import mohaengLogo from '../../assets/images/mohaeng-logo.svg';
import earthDarkBackground from '../../assets/images/service-end-earth-dark.webp';
import { SERVICE_END_DISPLAY_TEXT } from '../constants/serviceEnd';

export default function ServiceEndNoticePage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${earthDarkBackground}")` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.86)_0%,rgba(2,6,23,0.62)_42%,rgba(2,6,23,0.16)_72%,rgba(2,6,23,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />

      <section className="relative z-10 flex w-full flex-col justify-between px-6 py-7 sm:px-10 lg:px-16">
        <div className="flex items-center gap-4">
          <img src={mohaengLogo} alt="모행 로고" className="h-9 w-auto" />
          <span className="text-[22px] font-black text-[#00CCFF]">MoHaeng</span>
        </div>

        <div className="my-16 max-w-[760px]">
          <h1 className="text-[42px] font-black leading-[1.16] tracking-normal text-white sm:text-[56px] lg:text-[68px]">
            모행 서비스 운영이
            <br />
            종료되었습니다.
          </h1>

          <p className="mt-8 max-w-[620px] text-[16px] font-medium leading-8 text-slate-200 sm:text-[18px] sm:leading-9">
            모행은 {SERVICE_END_DISPLAY_TEXT}를 끝으로 서비스를 종료했습니다.
            그동안 모행과 함께 여행을 준비해 주셔서 진심으로 감사합니다.
          </p>

          <div className="mt-10 max-w-[620px] rounded-[20px] border border-white/12 bg-white/[0.07] px-6 py-5 backdrop-blur-sm">
            <p className="text-[15px] font-semibold leading-8 text-slate-100">
              운영 종료 일시: {SERVICE_END_DISPLAY_TEXT}
            </p>
            <p className="mt-1 text-[14px] font-medium leading-7 text-slate-300">
              현재 로그인, 여행 추천, 일정 생성, 블로그 등 기존 서비스 기능은
              제공되지 않습니다.
            </p>
          </div>
        </div>

        <div />
      </section>
    </main>
  );
}
