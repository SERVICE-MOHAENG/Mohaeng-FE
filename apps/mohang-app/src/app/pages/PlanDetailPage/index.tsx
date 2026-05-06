import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type CompositionEvent,
  type KeyboardEvent,
} from 'react';
import { useAlert } from '../../context/AlertContext';
import { useJsApiLoader } from '@react-google-maps/api';
import MapSection from './components/MapSection';
import PlanInfo from './components/PlanInfo';
import ScheduleSidebar from './components/ScheduleSidebar';
import ChatSidebar from './components/ChatSidebar';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Header,
  getItineraryStatus,
  getItineraryResult,
  getItineraryChatHistory,
  chatItineraryEdit,
  chatItineraryEditStatus,
  getAccessToken,
  LoadingScreen,
  getCourseDetail,
  getMainPageUser,
  UserResponse,
  useSurvey,
  updateCourseCompletion,
  copyCourse,
} from '@mohang/ui';
import {
  normalizeItineraryDays,
  type NormalizedSchedulePlace,
  type RawItineraryDay,
} from '../../utils/placeSchema';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const defaultCenter = { lat: 16.4855, lng: 97.6216 };
const defaultAiMessage = '안녕하세요! 어떤 일정 수정을 도와드릴까요?';

const CHAT_STORAGE_KEY_PREFIX = 'plan-detail-chat-history';
const DEFAULT_CHAT_SIDEBAR_WIDTH = 320;
const DEFAULT_SCHEDULE_SIDEBAR_WIDTH = 320;

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isPending?: boolean;
}

const getDefaultMessages = (): Message[] => [
  {
    id: '1',
    sender: 'ai',
    text: defaultAiMessage,
    timestamp: new Date(),
  },
];

const parseChatTimestamp = (timestampValue?: string) => {
  const parsedTimestamp = timestampValue ? new Date(timestampValue) : new Date();
  return Number.isNaN(parsedTimestamp.getTime()) ? new Date() : parsedTimestamp;
};

const getChatStorageKey = (travelCourseId: string) =>
  `${CHAT_STORAGE_KEY_PREFIX}:${travelCourseId}`;

const getChatStorageIds = (...ids: Array<string | null | undefined>) =>
  Array.from(
    new Set(
      ids.filter((id): id is string => typeof id === 'string' && id.trim().length > 0),
    ),
  );

const readStoredChatMessages = (travelCourseId: string): Message[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getChatStorageKey(travelCourseId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((message: any, index: number) => {
        const sender =
          message?.sender === 'user' || message?.sender === 'ai'
            ? message.sender
            : null;
        const text = typeof message?.text === 'string' ? message.text : null;

        if (!sender || !text) {
          return null;
        }

        return {
          id: String(message?.id ?? `stored-${index}`),
          sender,
          text,
          timestamp: parseChatTimestamp(message?.timestamp),
        };
      })
      .filter(Boolean) as Message[];
  } catch {
    return [];
  }
};

const persistChatMessages = (travelCourseId: string, messages: Message[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  const serializableMessages = messages
    .filter((message) => !message.isPending)
    .map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp.toISOString(),
    }));

  try {
    window.localStorage.setItem(
      getChatStorageKey(travelCourseId),
      JSON.stringify(serializableMessages),
    );
  } catch {}
};

const isSameChatMessage = (left: Message, right: Message) => {
  if (left.sender !== right.sender) {
    return false;
  }

  if (left.text.trim() !== right.text.trim()) {
    return false;
  }

  if (left.sender === 'ai' && left.text.trim() === defaultAiMessage) {
    return true;
  }

  return (
    Math.abs(left.timestamp.getTime() - right.timestamp.getTime()) <
    10 * 60 * 1000
  );
};

const mergeChatMessages = (...messageGroups: Message[][]) => {
  const merged: Message[] = [];
  const sortedMessages = messageGroups
    .flat()
    .filter((message) => !message.isPending)
    .sort((left, right) => left.timestamp.getTime() - right.timestamp.getTime());

  sortedMessages.forEach((message) => {
    const duplicatedMessage = merged.some((existingMessage) =>
      isSameChatMessage(existingMessage, message),
    );

    if (!duplicatedMessage) {
      merged.push(message);
    }
  });

  return merged;
};

const readStoredChatMessagesFromIds = (storageIds: string[]) =>
  mergeChatMessages(
    ...storageIds.map((storageId) => readStoredChatMessages(storageId)),
  );

const persistChatMessagesToIds = (storageIds: string[], messages: Message[]) => {
  storageIds.forEach((storageId) => {
    persistChatMessages(storageId, messages);
  });
};

const hasMeaningfulChatHistory = (messages: Message[]) =>
  messages.some(
    (message) =>
      message.sender === 'user' || message.text.trim() !== defaultAiMessage,
  );

const normalizeChatMessage = (message: any, index: number): Message | null => {
  const senderValue = String(message?.sender || message?.role || '').toUpperCase();
  const sender =
    senderValue === 'USER'
      ? 'user'
      : senderValue === 'ASSISTANT' || senderValue === 'AI'
        ? 'ai'
        : null;
  const text = message?.text || message?.message || message?.content;

  if (!sender || !text) {
    return null;
  }

  const timestampValue =
    message?.timestamp || message?.createdAt || message?.created_at;

  return {
    id: String(message?.id ?? `history-${index}`),
    sender,
    text,
    timestamp: parseChatTimestamp(timestampValue),
  };
};

const fetchItineraryChatHistory = async (travelCourseId: string) => {
  return getItineraryChatHistory(travelCourseId);
  /*
  const token = getAccessToken();
  const response = await fetch(
    `${apiBaseUrl}/api/v1/itineraries/${travelCourseId}/chats`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (response.status === 404) {
    return [];
  }

  if (response.status === 401) {
    clearTokens();
    window.location.replace('/login');
    throw new Error('로그인 세션이 만료되었습니다.');
  }

  if (!response.ok) {
    throw new Error('채팅 내역 조회에 실패했습니다.');
  }

  const payload = await response.json();
  return (
    payload?.data?.chats ||
    payload?.data?.messages ||
    payload?.data?.history ||
    payload?.chats ||
    payload?.messages ||
    payload?.history ||
    []
  );
  */
};

const resolveIsMyPlan = ({
  data,
  fallbackIsMyPlan = false,
  currentUser,
  authorName,
}: {
  data?: any;
  fallbackIsMyPlan?: boolean;
  currentUser?: UserResponse | null;
  authorName?: string;
}) => {
  const explicitOwnership =
    data?.is_mine ?? data?.is_owner ?? data?.isMine ?? data?.isOwner;

  if (typeof explicitOwnership === 'boolean') {
    return explicitOwnership;
  }

  if (fallbackIsMyPlan) {
    return true;
  }

  const myName =
    (currentUser as any)?.profile?.name ?? (currentUser as any)?.name ?? '';

  return Boolean(
    myName &&
      authorName &&
      myName.trim().toLowerCase() === authorName.trim().toLowerCase(),
  );
};

interface ItineraryInfo {
  itinerary: RawItineraryDay[] | null;
  title: string;
  startDate: string;
  endDate: string;
  nights: number;
  tripDays: number;
  peopleCount: number;
  tags: string[];
  isMyPlan: boolean;
  authorName?: string;
  isEdited?: boolean;
  tasteMatch?: string;
  summary?: any;
  llmCommentary?: any;
  isCompleted?: boolean;
  is_completed?: boolean;
}

const PlanDetailPage = () => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [zoom, setZoom] = useState(14);
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(defaultCenter);
  const { jobId: contextJobId } = useSurvey();
  const { jobId: paramJobId } = useParams();
  const jobId = paramJobId || contextJobId;
  const { showAlert } = useAlert();
  const [inputValue, setInputValue] = useState('');
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const isCourseView =
    location.state?.isCourseView === true ||
    (Boolean(paramJobId) && location.state?.isPendingJob !== true);
  const stateIsMyPlan = (location.state as any)?.isMyPlan;
  const stateAuthorName = (location.state as any)?.authorName;
  const navigate = useNavigate();
  const [travelCourseId, setTravelCourseId] = useState<string>('');
  const [tabPageIndex, setTabPageIndex] = useState(0);
  const [isScheduleSidebarOpen, setIsScheduleSidebarOpen] = useState(true);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<
    (NormalizedSchedulePlace & { index?: number }) | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] =
    useState('일정을 불러오고 있습니다');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '안녕하세요! 어떤 일정 수정을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);
  const [hasChatHistory, setHasChatHistory] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isChatHistoryHydrated, setIsChatHistoryHydrated] = useState(false);
  const isMessageComposingRef = useRef(false);
  const chatStorageIds = useMemo(
    () => getChatStorageIds(paramJobId, jobId, travelCourseId),
    [paramJobId, jobId, travelCourseId],
  );

  useEffect(() => {
    const token = getAccessToken();
    const isAuthed = Boolean(token && token !== 'undefined');
    setIsLoggedIn(isAuthed);

    if (isAuthed) {
      getMainPageUser()
        .then((res) => setCurrentUser(res))
        .catch((err) => console.error('Failed to fetch user:', err));
    }
  }, []);

  const [itineraryData, setItineraryData] = useState<ItineraryInfo>({
    itinerary: null,
    title: '',
    startDate: '',
    endDate: '',
    nights: 0,
    tripDays: 0,
    peopleCount: 0,
    tags: [],
    isMyPlan: false,
    isEdited: false,
  });

  // Sync isMyPlan when currentUser or authorName changes, unless already edited
  useEffect(() => {
    if (currentUser && (itineraryData.authorName || stateAuthorName) && !itineraryData.isEdited) {
      const myName = (currentUser as any).profile?.name ?? (currentUser as any).name ?? '';
      const authorName = itineraryData.authorName || stateAuthorName || '';
      const isOwnerByName = myName && authorName && myName.trim().toLowerCase() === authorName.trim().toLowerCase();
      
      const isMyPlanByFlag = itineraryData.isMyPlan || stateIsMyPlan === true;

      if (!isMyPlanByFlag && isOwnerByName) {
        setItineraryData((prev) => ({ ...prev, isMyPlan: true }));
      } else if (stateIsMyPlan === true && !itineraryData.isMyPlan) {
        setItineraryData((prev) => ({ ...prev, isMyPlan: true }));
      }
    }
  }, [currentUser, itineraryData.authorName, itineraryData.isEdited, itineraryData.isMyPlan]);

  const [scheduleData, setScheduleData] = useState<
    Record<number, NormalizedSchedulePlace[]>
  >({});

  useEffect(() => {
    if (!itineraryData.itinerary) return;

    const formattedData: Record<number, NormalizedSchedulePlace[]> = {};
    const normalizedItinerary = normalizeItineraryDays(itineraryData.itinerary);

    normalizedItinerary.forEach((day: {
      dayNumber: number;
      places: NormalizedSchedulePlace[];
    }) => {
      formattedData[day.dayNumber] = day.places;
    });

    setScheduleData(formattedData);

    if (Object.keys(formattedData).length > 0) {
      const firstDayNumber = normalizedItinerary[0]?.dayNumber ?? 1;
      setSelectedScheduleItem(null);
      setActiveDay(firstDayNumber);
      const firstMappablePlace = formattedData[firstDayNumber]?.find(
        (place) => place.position,
      );
      if (firstMappablePlace?.position) {
        setMapCenter(firstMappablePlace.position);
      }
    }
  }, [itineraryData.itinerary]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  useEffect(() => {
    if (!jobId) return;

    if (isCourseView) {
      const fetchCourseResult = async () => {
        try {
          if (paramJobId) setTravelCourseId(paramJobId);
          setIsLoading(true);
          setLoadingMessage('일정을 구성하고 있습니다');

          const resultRes = await getCourseDetail(jobId);
          const data = resultRes.data;
          const authorName =
            stateAuthorName ||
            data.userName ||
            (data as any).authorName ||
            (data as any).author_name;
          
          if (data && data.itinerary) {
            setItineraryData({
              itinerary: data.itinerary,
              title: data.title || '나의 여행 일정',
              startDate: data.start_date || '',
              endDate: data.end_date || '',
              nights: data.nights || 0,
              tripDays: data.trip_days || 0,
              peopleCount: data.people_count || 1,
              tags: data.tags || [],
              isMyPlan: resolveIsMyPlan({
                data,
                fallbackIsMyPlan: stateIsMyPlan === true,
                currentUser,
                authorName,
              }),
              authorName,
              tasteMatch: authorName
                ? `${authorName}님의 추천 코스`
                : undefined,
              summary: data.summary,
              llmCommentary: data.llm_commentary,
              isCompleted: data.is_completed ?? data.isCompleted,
              is_completed: data.is_completed ?? data.isCompleted,
            });

            if (data.llm_commentary) {
              const commentaryText = typeof data.llm_commentary === 'string' 
                ? data.llm_commentary 
                : data.llm_commentary.comment || data.llm_commentary.message || data.llm_commentary.text;
              
              if (commentaryText) {
                setMessages(prev => [
                  ...prev,
                  {
                    id: `ai-commentary-${Date.now()}`,
                    sender: 'ai',
                    text: commentaryText,
                    timestamp: new Date(),
                  }
                ]);
              }
            }
          } else {
            console.warn('Course data structure not recognized:', resultRes);
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching course detail:', error);
          setIsLoading(false);
          showAlert('일정을 불러오는 데 실패했습니다.', 'error');
        }
      };

      fetchCourseResult();
      return;
    }

    let pollInterval: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      try {
        const responseData = (await getItineraryStatus(jobId)) as any;
        const statusData = responseData.data?.status || responseData;
        const { status, travelCourseId: extractedId } = statusData;

        if (extractedId) {
          setTravelCourseId(extractedId);
        }

        if (status === 'SUCCESS' || status === 'COMPLETED') {
          if (extractedId || jobId) {
            const resultRes = (await getItineraryResult(jobId)) as any;
            const resultData = resultRes.data || resultRes;
            const data = resultData.result?.data || resultData.data || resultData;
            const authorName =
              data.userName || data.authorName || data.author_name;

            if (data && data.itinerary) {
              setLoadingMessage('일정을 구성하고 있습니다');
              setItineraryData({
                itinerary: data.itinerary,
                title: data.title || '나의 여행 일정',
                startDate: data.start_date || '',
                endDate: data.end_date || '',
                nights: data.nights || 0,
                tripDays: data.trip_days || 0,
                peopleCount: data.people_count || 0,
                tags: data.tags || [],
                isMyPlan: resolveIsMyPlan({
                  data,
                  fallbackIsMyPlan: true,
                  currentUser,
                  authorName,
                }),
                authorName,
                isCompleted: data.is_completed ?? data.isCompleted,
                is_completed: data.is_completed ?? data.isCompleted,
              });
              setIsLoading(false);
            } else {
              console.warn('Itinerary data structure not recognized:', resultRes);
              setIsLoading(false);
            }
          }
          clearInterval(pollInterval);
        } else if (status === 'FAILED') {
          showAlert('일정 생성에 실패했습니다. 다시 시도해주세요.', 'error');
          setIsLoading(false);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error fetching itinerary status:', error);
        setIsLoading(false);
      }
    };

    fetchStatus();
    pollInterval = setInterval(fetchStatus, 30000);
    return () => clearInterval(pollInterval);
  }, [jobId]);

  useEffect(() => {
    if (!travelCourseId || !paramJobId || paramJobId === travelCourseId) {
      return;
    }

    navigate(`/plan-detail/${travelCourseId}`, {
      replace: true,
      state: {
        ...(location.state as Record<string, unknown> | null),
        isCourseView: true,
        isPendingJob: false,
        isMyPlan: itineraryData.isMyPlan || stateIsMyPlan === true,
        authorName: itineraryData.authorName || stateAuthorName,
      },
    });
  }, [
    navigate,
    location.state,
    paramJobId,
    travelCourseId,
    itineraryData.isMyPlan,
    itineraryData.authorName,
    stateIsMyPlan,
    stateAuthorName,
  ]);

  useEffect(() => {
    if (!isChatHistoryHydrated || chatStorageIds.length === 0) {
      setHasChatHistory(false);
      return;
    }

    persistChatMessagesToIds(chatStorageIds, messages);
  }, [chatStorageIds, isChatHistoryHydrated, messages]);

  useEffect(() => {
    if (chatStorageIds.length === 0) {
      setIsChatHistoryHydrated(false);
      setHasChatHistory(false);
      return;
    }

    let isCancelled = false;
    const storedMessages = readStoredChatMessagesFromIds(chatStorageIds);

    setHasChatHistory(hasMeaningfulChatHistory(storedMessages));
    setMessages(
      storedMessages.length > 0 ? storedMessages : getDefaultMessages(),
    );
    setIsChatHistoryHydrated(true);

    if (!travelCourseId) {
      return () => {
        isCancelled = true;
      };
    }

    const fetchChatHistory = async () => {
      try {
        const history = await fetchItineraryChatHistory(travelCourseId);
        if (isCancelled) return;

        const normalizedMessages = history
          .map((message: any, index: number) => normalizeChatMessage(message, index))
          .filter(Boolean) as Message[];

        const mergedMessages = mergeChatMessages(
          storedMessages,
          normalizedMessages,
        );
        const resolvedMessages =
          mergedMessages.length > 0 ? mergedMessages : getDefaultMessages();

        setHasChatHistory(hasMeaningfulChatHistory(mergedMessages));
        setMessages(resolvedMessages);
      } catch (error: any) {
        if (isCancelled) return;

        if (error?.statusCode !== 404) {
          console.error('Failed to fetch chat history:', error);
        }

        setHasChatHistory(hasMeaningfulChatHistory(storedMessages));
      }
    };

    fetchChatHistory();

    return () => {
      isCancelled = true;
    };
  }, [chatStorageIds, travelCourseId]);

  const handleMessageCompositionStart = (
    _event?: CompositionEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    isMessageComposingRef.current = true;
  };

  const handleMessageCompositionEnd = (
    _event?: CompositionEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    isMessageComposingRef.current = false;
  };

  const handleMessageInputKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (
      event.shiftKey ||
      event.nativeEvent.isComposing ||
      isMessageComposingRef.current ||
      event.keyCode === 229
    ) {
      return;
    }

    event.preventDefault();
    void handleSendMessage();
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage ?? inputValue).trim();
    if (!textToSend || isTyping || isMessageComposingRef.current) return;
    if (!travelCourseId) {
      showAlert('일정 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'info');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setHasChatHistory(true);
    const originalInput = textToSend;
    if (!customMessage) setInputValue('');
    setIsChatSidebarOpen(true);
    setIsTyping(true);

    const pendingMsgId = `pending-${Date.now()}`;
    const pendingMessage: Message = {
      id: pendingMsgId,
      sender: 'ai',
      text: '...',
      timestamp: new Date(),
      isPending: true,
    };
    setMessages((prev) => [...prev, pendingMessage]);

    try {
      const responseRes = (await chatItineraryEdit(
        travelCourseId,
        originalInput,
      )) as any;
      const response =
        responseRes?.data?.chat || responseRes?.data || responseRes;
      const responseJobId = response?.jobId;

      if (!responseJobId) {
        throw new Error('Failed to start itinerary edit job.');
      }
      
      let lastStatusMessage = '';
      let isPollingComplete = false;
      let isPollingInFlight = false;

      const pollStatus = async (): Promise<void> => {
        if (isPollingComplete || isPollingInFlight) {
          return;
        }

        isPollingInFlight = true;
        try {
          const statusRes = (await chatItineraryEditStatus(responseJobId)) as any;
          const statusData = statusRes.data || statusRes;
          const statusPayload =
            typeof statusData?.status === 'object'
              ? statusData.status
              : typeof statusData?.data?.status === 'object'
                ? statusData.data.status
                : typeof statusData?.result?.status === 'object'
                  ? statusData.result.status
                  : null;
          const resolvedStatus =
            statusPayload?.status ||
            statusData?.status ||
            statusData?.data?.status ||
            statusData?.result?.status ||
            '';
          const currentMessage =
            statusPayload?.message ||
            statusData?.message ||
            statusData?.data?.message ||
            statusData?.result?.message ||
            '';
          const updatedTravelCourseId =
            statusPayload?.travelCourseId ||
            statusData?.travelCourseId ||
            statusData?.data?.travelCourseId ||
            statusData?.result?.travelCourseId ||
            statusPayload?.courseId ||
            statusData?.courseId ||
            statusData?.data?.courseId ||
            statusData?.result?.courseId ||
            null;
          if (currentMessage && currentMessage !== lastStatusMessage && currentMessage !== '...') {
            lastStatusMessage = currentMessage;
            setMessages((prev) => [
              ...prev.filter((m) => m.id !== pendingMsgId),
              {
                id: Date.now().toString(),
                sender: 'ai',
                text: currentMessage,
                timestamp: new Date(),
              },
            ]);
          }

          if (resolvedStatus === 'COMPLETED' || resolvedStatus === 'SUCCESS') {
            isPollingComplete = true;
            setIsTyping(false);

            try {
              let data: any = null;
              const editedCourseId = updatedTravelCourseId || travelCourseId;

              if (editedCourseId) {
                const courseDetailRes = await getCourseDetail(editedCourseId);
                data = courseDetailRes.data;
                setTravelCourseId(editedCourseId);
              } else {
                const res = (await getItineraryResult(responseJobId)) as any;
                const resultData = res.data || res;
                data = resultData.result?.data || resultData.data || resultData;
              }

              const authorName =
                data?.userName || data?.authorName || data?.author_name;

              if (data && data.itinerary) {
                setItineraryData({
                  itinerary: data.itinerary,
                  title: data.title || '나의 여행 일정',
                  startDate: data.start_date || '',
                  endDate: data.end_date || '',
                  nights: data.nights || 0,
                  tripDays: data.trip_days || 0,
                  peopleCount: data.people_count || 0,
                  tags: data.tags || [],
                  isMyPlan: resolveIsMyPlan({
                    data,
                    fallbackIsMyPlan:
                      itineraryData.isMyPlan || stateIsMyPlan === true,
                    currentUser,
                    authorName,
                  }),
                  authorName,
                  isEdited: true,
                  isCompleted: data.is_completed ?? data.isCompleted,
                  is_completed: data.is_completed ?? data.isCompleted,
                  summary: data.summary,
                  llmCommentary: data.llm_commentary,
                });
              }
            } catch (resultError) {
              console.error('Error fetching updated itinerary:', resultError);
            }

            const finalMsg = '요청하신 대로 일정을 수정했습니다! 확인해 보세요.';
            setMessages((prev) => {
              const hasSuccessMsg = prev.some((m) => m.sender === 'ai' && m.text === lastStatusMessage);
              if (hasSuccessMsg) return prev.filter((m) => m.id !== pendingMsgId);
              return [
                ...prev.filter((m) => m.id !== pendingMsgId),
                {
                  id: Date.now().toString(),
                  sender: 'ai',
                  text: finalMsg,
                  timestamp: new Date(),
                },
              ];
            });
          } else if (resolvedStatus === 'FAILED') {
            isPollingComplete = true;
            setIsTyping(false);
            const failMsg =
              currentMessage || '죄송합니다. 일정 수정에 실패했습니다.';
            setMessages((prev) => [
              ...prev.filter((m) => m.id !== pendingMsgId),
              {
                id: Date.now().toString(),
                sender: 'ai',
                text: failMsg,
                timestamp: new Date(),
              },
            ]);
            showAlert('일정 수정에 실패했습니다.', 'error');
          }
        } catch (pollError) {
          console.error('Polling Error:', pollError);
          isPollingComplete = true;
          setIsTyping(false);
          setMessages((prev) => prev.filter((m) => m.id !== pendingMsgId));
        } finally {
          isPollingInFlight = false;

          if (!isPollingComplete) {
            window.setTimeout(() => {
              void pollStatus();
            }, 3000);
          }
        }
      };

      window.setTimeout(() => {
        void pollStatus();
      }, 3000);
    } catch (error: any) {
      console.error('Chat Edit Error:', error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== pendingMsgId),
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: error.message || '일정 수정 요청 중 오류가 발생했습니다.',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const onBack = () => {
    setIsChatSidebarOpen(false);
    setInputValue('');
    navigate(-1);
  };

  const handleSaveToMyPlan = async () => {
    if (!travelCourseId) {
      showAlert('일정 정보를 저장할 수 없습니다. 잠시 후 다시 시도해주세요.', 'error');
      return;
    }

    try {
      const res = await copyCourse(travelCourseId);
      if (res.success) {
        showAlert('내 여행 일정에 성공적으로 추가되었습니다!', 'success');
        navigate('/mypage');
      }
    } catch (error: any) {
      console.error('Failed to save to my plan:', error);
      showAlert(error.message || '일정 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  const path = useMemo(
    () =>
      scheduleData[activeDay]?.flatMap((item) =>
        item.position ? [item.position] : [],
      ) || [],
    [scheduleData, activeDay],
  );

  const handleFocusLocation = (item: NormalizedSchedulePlace) => {
    const isSameItem =
      selectedScheduleItem?.id === item.id ||
      selectedScheduleItem?.placeId === item.placeId;
    setSelectedScheduleItem(isSameItem ? null : item);
    if (item.position) {
      setMapCenter(item.position);
      setZoom(16);
    }
  };

  const floatingPanelRightOffset =
    (isChatSidebarOpen ? DEFAULT_CHAT_SIDEBAR_WIDTH : 0) +
    (isScheduleSidebarOpen ? DEFAULT_SCHEDULE_SIDEBAR_WIDTH : 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-white text-gray-900">
      {isLoading && (
        <LoadingScreen
          message={loadingMessage}
          tips={[
            'AI가 딱 맞는 여행 일정을 고민하고 있어요...',
            '최적의 동선을 위해 이동 거리를 분석 중입니다',
            '여행지의 숨겨진 명소들을 탐색하고 있어요',
            '일정 생성에는 보통 1~3분 정도 소요됩니다',
            '나만의 완벽한 여행 계획이 곧 완성됩니다!',
          ]}
        />
      )}

      <Header isLoggedIn={isLoggedIn} />

      <main className="flex flex-1 relative overflow-hidden bg-[#0e1626]">
        <MapSection
          isLoaded={isLoaded}
          center={mapCenter}
          zoom={zoom}
          onLoad={() => {}}
          path={path}
          scheduleItems={scheduleData[activeDay] || []}
          activeDay={activeDay}
          onZoomIn={() => setZoom((prev) => prev + 1)}
          onZoomOut={() => setZoom((prev) => prev - 1)}
          onMarkerClick={(position) => {
            setMapCenter(position);
            setZoom(16);
          }}
          selectedMarkerId={selectedScheduleItem?.id ?? null}
          onSelectedMarkerChange={setSelectedScheduleItem}
        />

        <PlanInfo
          onBack={onBack}
          title={itineraryData.title}
          dateRange={`${itineraryData.startDate} - ${itineraryData.endDate}`}
          details={`${itineraryData.nights}박 ${itineraryData.tripDays}일 · ${itineraryData.peopleCount}명`}
          hashtags={itineraryData.tags}
          tasteMatch={itineraryData.isMyPlan ? undefined : itineraryData.tasteMatch}
          summary={itineraryData.summary}
          isMyPlan={itineraryData.isMyPlan}
          isCompleted={(itineraryData as any).is_completed || (itineraryData as any).isCompleted}
          onToggleCompletion={async () => {
             const courseId = travelCourseId || jobId;
             if (!courseId) return;
             try {
               const currentStatus = !!((itineraryData as any).is_completed || (itineraryData as any).isCompleted);
               const newStatus = !currentStatus;
               await updateCourseCompletion(courseId, newStatus);
               setItineraryData(prev => ({ 
                 ...prev, 
                 isCompleted: newStatus,
                 is_completed: newStatus 
               } as any));
             } catch (error: any) {
               alert(error.message || '상태 변경에 실패했습니다.');
             }
          }}
        />

        <div
          className={`absolute bottom-32 left-0 z-10 flex justify-center px-5 pr-8 transition-[right,opacity,transform] duration-300 ${
            isChatSidebarOpen
              ? 'pointer-events-none translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
          style={{ right: floatingPanelRightOffset }}
        >
          <div className="w-full max-w-[540px]">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsChatSidebarOpen(true)}
                className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-sky-600 shadow-lg transition hover:bg-white"
              >
                {hasChatHistory ? '채팅 내역 보기' : '채팅창 열기'}
              </button>
            </div>
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onCompositionStart={handleMessageCompositionStart}
                onCompositionEnd={handleMessageCompositionEnd}
                onKeyDown={handleMessageInputKeyDown}
                placeholder="원하는 일정 수정 내용을 입력해주세요."
                rows={1}
                className="scrollbar-hide min-h-[56px] max-h-40 w-full resize-none overflow-y-auto rounded-2xl border-none bg-white px-6 py-[15px] pr-16 text-[15px] leading-6 shadow-2xl outline-none transition-all focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="button"
                disabled={isTyping || inputValue.trim().length === 0}
                onClick={() => void handleSendMessage()}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-sky-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-0 z-10 flex justify-center px-5 transition-[right] duration-300"
          style={{ right: floatingPanelRightOffset }}
        >
          <div className="bg-[#f1f3f5] p-2 rounded-[32px] flex items-center gap-2 shadow-2xl border border-white/50 backdrop-blur-md">
            <button
              onClick={() => setTabPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={tabPageIndex === 0}
              className={`p-2 rounded-full transition-all ${tabPageIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {[...Array(itineraryData.tripDays)]
                .slice(tabPageIndex * 3, (tabPageIndex + 1) * 3)
                .map((_, sliceIdx) => {
                  const idx = tabPageIndex * 3 + sliceIdx;
                  const isActive = activeDay === idx + 1;
                  const dateObj = new Date(itineraryData.startDate);
                  dateObj.setDate(dateObj.getDate() + idx);

                  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                  const dayName = dayNames[dateObj.getDay()];
                  const dateString = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveDay(idx + 1);
                        const firstMappablePlace = scheduleData[idx + 1]?.find(
                          (place) => place.position,
                        );
                        if (firstMappablePlace?.position) {
                          setMapCenter(firstMappablePlace.position);
                          setZoom(14);
                        }
                      }}
                      className={`min-w-[140px] py-3 px-6 rounded-[22px] flex flex-col items-center transition-all duration-300 ${isActive ? 'text-white shadow-lg scale-[1.02]' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                      style={isActive ? { background: 'linear-gradient(135deg, #00CCFF 0%, #33E0FF 100%)' } : {}}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-white/80' : 'text-gray-300'}`}>Day {idx + 1}</span>
                      <span className="text-[13px] font-black">{dateString} ({dayName})</span>
                    </button>
                  );
                })}
            </div>

            <button
              onClick={() => setTabPageIndex((prev) => (prev + 1) * 3 < itineraryData.tripDays ? prev + 1 : prev)}
              disabled={(tabPageIndex + 1) * 3 >= itineraryData.tripDays}
              className={`p-2 rounded-full transition-all ${(tabPageIndex + 1) * 3 >= itineraryData.tripDays ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <ChatSidebar
          isOpen={isChatSidebarOpen}
          onClose={() => setIsChatSidebarOpen(false)}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          onInputKeyDown={handleMessageInputKeyDown}
          onInputCompositionStart={handleMessageCompositionStart}
          onInputCompositionEnd={handleMessageCompositionEnd}
          messages={messages}
          isTyping={isTyping}
          suggestions={itineraryData.llmCommentary?.next_action_suggestion || (itineraryData as any).next_action_suggestion}
        />

        <div
          className="flex overflow-hidden transition-[width] duration-300 ease-in-out"
          style={{ width: isScheduleSidebarOpen ? DEFAULT_SCHEDULE_SIDEBAR_WIDTH : 0 }}
        >
          <ScheduleSidebar
            activeDay={activeDay}
            scheduleItems={scheduleData[activeDay] || []}
            onAddToMyPlan={handleSaveToMyPlan}
            onItemClick={handleFocusLocation}
            isMyPlan={itineraryData.isMyPlan}
            isCompleted={!!((itineraryData as any).is_completed || (itineraryData as any).isCompleted)}
            onToggleCompletion={async () => {
              const courseId = travelCourseId || jobId;
              if (!courseId) return;
              try {
                const currentStatus = !!((itineraryData as any).is_completed || (itineraryData as any).isCompleted);
                const newStatus = !currentStatus;
                await updateCourseCompletion(courseId, newStatus);
                setItineraryData(prev => ({ 
                  ...prev, 
                  isCompleted: newStatus,
                  is_completed: newStatus 
                } as any));
              } catch (error: any) {
                alert(error.message || '상태 변경에 실패했습니다.');
              }
            }}
            selectedItemId={selectedScheduleItem?.id ?? null}
          />
        </div>

        <button
          onClick={() => setIsScheduleSidebarOpen(!isScheduleSidebarOpen)}
          className="absolute top-1/2 -translate-y-1/2 z-30 h-20 w-10 border-y border-l rounded-l-2xl bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.05)] hover:bg-gray-50 flex items-center justify-center transition-[right] duration-300"
          style={{ right: isScheduleSidebarOpen ? DEFAULT_SCHEDULE_SIDEBAR_WIDTH : 0 }}
        >
          <div className={`text-gray-400 transform transition-transform duration-300 ${isScheduleSidebarOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
      </main>
    </div>
  );
};

export default PlanDetailPage;
