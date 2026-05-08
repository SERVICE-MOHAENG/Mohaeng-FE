import { useEffect, useState } from 'react';
import noticeImage from '../../assets/images/mohaeng-logo.svg';

const NOTICE_SUPPRESS_UNTIL_KEY = 'mohaeng-service-end-notice-suppress-until';
const NOTICE_END_AT = new Date('2026-05-12T23:59:00+09:00').getTime();

const isNoticeSuppressed = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  const storedUntil = window.localStorage.getItem(NOTICE_SUPPRESS_UNTIL_KEY);

  if (!storedUntil) {
    return false;
  }

  const suppressUntil = Number(storedUntil);

  if (Number.isNaN(suppressUntil) || Date.now() >= suppressUntil) {
    window.localStorage.removeItem(NOTICE_SUPPRESS_UNTIL_KEY);
    return false;
  }

  return true;
};

const getTomorrowStart = () => {
  const tomorrowStart = new Date();
  tomorrowStart.setHours(24, 0, 0, 0);
  return tomorrowStart.getTime();
};

export default function ServiceEndNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hideForToday, setHideForToday] = useState(false);

  useEffect(() => {
    if (Date.now() > NOTICE_END_AT || isNoticeSuppressed()) {
      return;
    }

    setIsOpen(true);
  }, []);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      if (hideForToday) {
        window.localStorage.setItem(
          NOTICE_SUPPRESS_UNTIL_KEY,
          String(getTomorrowStart()),
        );
      } else {
        window.localStorage.removeItem(NOTICE_SUPPRESS_UNTIL_KEY);
      }
    }

    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, hideForToday]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 py-6">
      <div className="absolute inset-0" onClick={handleClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-end-notice-message"
        className="relative w-full max-w-[440px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.28)]"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
          <strong className="truncate pr-4 text-[17px] font-extrabold text-slate-800">
            모행 서비스 운영 안내
          </strong>
          <button
            type="button"
            onClick={handleClose}
            aria-label="운영 안내 팝업 닫기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="rounded-[20px] bg-white px-8 py-8">
            <img
              src={noticeImage}
              alt=""
              className="mx-auto w-full max-w-[210px]"
            />
          </div>

          <p
            id="service-end-notice-message"
            className="mt-6 text-center text-[16px] font-semibold leading-8 text-slate-700 break-keep"
          >
            <span className="block">모행(Mohaeng) 서비스는 다음주 화요일</span>
            <span className="block">(2026.05.12. 23시 59분)까지 운영될 예정입니다.</span>
            <span className="block">많은 사랑 감사합니다❤️</span>
          </p>

          <label className="mt-5 ml-1 inline-flex cursor-pointer items-end gap-2.5 text-[14px] font-medium text-slate-500">
            <input
              type="checkbox"
              checked={hideForToday}
              onChange={(event) => setHideForToday(event.target.checked)}
              className="mt-0 h-4 w-4 shrink-0 rounded border-slate-300 text-sky-500 align-middle focus:ring-sky-400"
            />
            <span className="leading-none">오늘 하루 보지 않기</span>
          </label>

          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-full bg-[#00C2FF] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
