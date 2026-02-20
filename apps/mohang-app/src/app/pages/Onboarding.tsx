import { Header, TravelSurvey } from '@mohang/ui';

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center font-sans p-8 md:p-16">
        <TravelSurvey />
      </div>
    </div>
  );
}
