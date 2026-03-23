import { ApiError } from './common.type';
import { publicApi } from './client';
import { getAuthHeaders } from './authUtils';

export const FEEDBACK_KEYWORDS = [
  '로그인 / 계정 문제',
  '기능이 작동하지 않아요',
  '화면이 이상해요',
  '서비스가 느려요',
  '사용하기 불편해요',
  '새로운 기능을 제안하고 싶어요',
  '기타 의견',
] as const;

export const FEEDBACK_PLATFORMS = ['웹', '앱'] as const;

export type FeedbackKeyword = (typeof FEEDBACK_KEYWORDS)[number];
export type FeedbackPlatform = (typeof FEEDBACK_PLATFORMS)[number];

export interface SubmitFeedbackPayload {
  keywords: FeedbackKeyword[];
  platform: FeedbackPlatform | '';
  title: string;
  content: string;
  userName?: string;
  userEmail?: string;
}

interface FeedbackResponse {
  message: string;
}

const buildFeedbackContent = ({
  keywords,
  platform,
  content,
  userName,
  userEmail,
}: Omit<SubmitFeedbackPayload, 'title'>) =>
  [
    `피드백 유형: ${keywords.join(', ')}`,
    `플랫폼: ${platform || '미선택'}`,
    `사용자: ${userName || '알 수 없음'}`,
    `이메일: ${userEmail || '알 수 없음'}`,
    '',
    content,
  ].join('\n');

export const submitFeedback = async ({
  keywords,
  platform,
  title,
  content,
  userName,
  userEmail,
}: SubmitFeedbackPayload): Promise<string> => {
  try {
    const response = await publicApi.post<FeedbackResponse>(
      '/api/v1/feedback',
      {
        title,
        content: buildFeedbackContent({
          keywords,
          platform,
          content,
          userName,
          userEmail,
        }),
      },
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data?.message || '피드백이 접수되었습니다.';
  } catch (error: any) {
    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          '피드백 제출에 실패했습니다. 다시 시도해주세요',
        statusCode: error.response.status,
      } as ApiError;
    } else if (error.request) {
      throw {
        message: '네트워크 연결을 확인해주세요',
        statusCode: 0,
      } as ApiError;
    } else {
      throw {
        message: '피드백 제출에 실패했습니다. 다시 시도해주세요',
        statusCode: 0,
      } as ApiError;
    }
  }
};
