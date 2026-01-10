import { colors } from '@mohang/ui';

interface ProgressBarProps {
  currentStep: string;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = ['NAME', 'PASSWORD', 'EMAIL', 'AUTH_CODE'];

  return (
    <div className="flex gap-1 mb-8">
      {steps.map((step) => (
        <div
          key={step}
          className="transition-all duration-300 ease-in-out"
          style={{
            height: '8px',
            borderRadius: '10px',
            width: currentStep === step ? '40px' : '12px',
            backgroundColor:
              currentStep === step ? colors.primary[500] : '#D9D9D9',
          }}
        />
      ))}
    </div>
  );
}
