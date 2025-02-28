import { FC, ReactNode } from 'react';

interface Step {
  label: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
  completed?: boolean;
  error?: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dots' | 'progress';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onChange?: (step: number) => void;
  showStepNumbers?: boolean;
}

export const Stepper: FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  onChange,
  showStepNumbers = false,
}) => {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      connector: 'w-12',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-base',
      connector: 'w-16',
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-lg',
      connector: 'w-20',
    },
  };

  const renderStepIcon = (step: Step, index: number) => {
    if (step.icon) {
      return step.icon;
    }

    if (step.error) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }

    if (step.completed) {
      return (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    return showStepNumbers ? index + 1 : null;
  };

  const renderStep = (step: Step, index: number) => {
    const isActive = index === activeStep;
    const isCompleted = step.completed || index < activeStep;
    const isError = step.error;

    const stepIconClasses = `
      ${sizeClasses[size].icon}
      flex items-center justify-center rounded-full
      ${isError ? 'bg-red-100 text-red-600' : ''}
      ${isCompleted ? 'bg-red-600 text-white' : ''}
      ${isActive && !isCompleted && !isError ? 'bg-red-600 text-white' : ''}
      ${!isActive && !isCompleted && !isError ? 'bg-gray-100 text-gray-500' : ''}
      transition-colors duration-200
    `;

    return (
      <div
        key={index}
        className={`
          flex ${orientation === 'horizontal' ? 'flex-col items-center' : 'items-start'}
          ${onChange ? 'cursor-pointer' : ''}
        `}
        onClick={() => onChange?.(index)}
      >
        <div className="relative">
          <div className={stepIconClasses}>
            {renderStepIcon(step, index)}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                absolute
                ${orientation === 'horizontal'
                  ? 'top-1/2 left-full -translate-y-1/2'
                  : 'top-full left-1/2 -translate-x-1/2'
                }
                ${sizeClasses[size].connector}
                ${orientation === 'horizontal' ? 'h-0.5' : 'h-8 w-0.5'}
                ${isCompleted ? 'bg-red-600' : 'bg-gray-200'}
                transition-colors duration-200
              `}
            />
          )}
        </div>
        <div
          className={`
            mt-2
            ${orientation === 'horizontal' ? 'text-center' : 'ml-4'}
            ${sizeClasses[size].text}
          `}
        >
          <div className="font-medium text-gray-900">
            {step.label}
            {step.optional && (
              <span className="ml-1 text-gray-500 text-sm">(Optional)</span>
            )}
          </div>
          {step.description && (
            <div className="text-gray-500 text-sm mt-1">
              {step.description}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDot = (step: Step, index: number) => {
    const isActive = index === activeStep;
    const isCompleted = step.completed || index < activeStep;
    const isError = step.error;

    return (
      <div
        key={index}
        className={`
          flex flex-col items-center
          ${onChange ? 'cursor-pointer' : ''}
        `}
        onClick={() => onChange?.(index)}
      >
        <div className="relative">
          <div
            className={`
              w-3 h-3 rounded-full
              ${isError ? 'bg-red-600' : ''}
              ${isCompleted ? 'bg-red-600' : ''}
              ${isActive && !isCompleted && !isError ? 'bg-red-600' : ''}
              ${!isActive && !isCompleted && !isError ? 'bg-gray-300' : ''}
              transition-colors duration-200
            `}
          />
          {index < steps.length - 1 && (
            <div
              className={`
                absolute top-1/2 left-full -translate-y-1/2
                w-8 h-0.5
                ${isCompleted ? 'bg-red-600' : 'bg-gray-200'}
                transition-colors duration-200
              `}
            />
          )}
        </div>
      </div>
    );
  };

  const renderProgress = (step: Step, index: number) => {
    const isActive = index === activeStep;
    const isCompleted = step.completed || index < activeStep;
    const progress = (activeStep / (steps.length - 1)) * 100;

    return (
      <div
        key={index}
        className="relative flex-1"
        onClick={() => onChange?.(index)}
      >
        <div
          className={`
            h-2 rounded-full
            ${isCompleted ? 'bg-red-600' : 'bg-gray-200'}
            transition-colors duration-200
          `}
        >
          {isActive && (
            <div
              className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        flex
        ${orientation === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-4'}
        ${className}
      `}
    >
      {steps.map((step, index) => (
        variant === 'dots'
          ? renderDot(step, index)
          : variant === 'progress'
            ? renderProgress(step, index)
            : renderStep(step, index)
      ))}
    </div>
  );
};

export default Stepper;
