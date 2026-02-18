import React, { useEffect, useRef } from 'react';
import ChatLogo from '../../../../assets/images/chatLogo.png';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  messages: Message[];
  isTyping?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  inputValue,
  onInputChange,
  onSendMessage,
  messages,
  isTyping,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <aside className="w-[320px] bg-[#f8f9fa] border-l flex flex-col z-20 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 flex items-center justify-between bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 ${isTyping ? 'animate-pulse' : ''}`}
          >
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-[10px]">
              <img src={ChatLogo} alt="chatLogo" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {isTyping ? (
                  <>
                    <span className="text-xs font-bold text-gray-500">
                      모행 AI가 생각중
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      <div className="w-0.5 h-0.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-0.5 h-0.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-0.5 h-0.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 scroll-smooth scrollbar-hide"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-white rounded-tr-none'
                  : 'bg-white text-gray-700 border border-sky-50 rounded-tl-none'
              }`}
            >
              {msg.text}
              <div
                className={`text-[8px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white border border-sky-50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1 h-1 bg-sky-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="추가 질문을 입력하세요..."
            className="w-full bg-gray-50 px-5 py-3 pr-12 rounded-xl text-[11px] outline-none border border-transparent focus:border-sky-300 focus:bg-white transition-all shadow-lg"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          />
          <button
            onClick={onSendMessage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-sky-500 text-white p-1.5 rounded-lg hover:bg-sky-600 transition-all active:scale-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
        <p className="text-[8px] text-center text-gray-400 mt-3 font-medium">
          MoHaeng AI는 실수를 할 수 있습니다. 계획을 항상 확인해주세요.
        </p>
      </div>
    </aside>
  );
};

export default ChatSidebar;
