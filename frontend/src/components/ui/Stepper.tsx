import { FC, ReactNode } from 'react';

interface Step {
  id: string | number;
  title: string;
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
  onStepClick?: (index: number) => void;
  showLabels?: boolean;
  alternativeLabel?: boolean;
  connector?: ReactNode;
}

export const Stepper: FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  onStepClick,
  showLabels = true,
  alternativeLabel = false,
  connector,
}) => {
  const sizeStyles = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-xs',
      connector: 'h-0.5',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-sm',
      connector: 'h-0.5',
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-base',
      connector: 'h-1',
    },
  };

  const renderIcon = (step: Step, index: number) => {
    if (step.icon) {
      return step.icon;
    }

    if (step.completed) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (step.error) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return index + 1;
  };

  const renderConnector = (index: number) => {
    if (index === steps.length - 1) return null;

    const isCompleted = steps[index].completed;
    const isActive = index < activeStep;
    const hasError = steps[index].error || steps[index + 1].error;

    return connector || (
      <div
        className={`
          flex-1
          ${orientation === 'horizontal' ? 'mx-4' : 'my-4 ml-4'}
          ${sizeStyles[size].connector}
          ${isCompleted || isActive ? 'bg-red-500' : 'bg-gray-200'}
          ${hasError ? 'bg-red-500' : ''}
        `}
      />
    );
  };

  const renderStep = (step: Step, index: number) => {
    const isActive = index === activeStep;
    const isCompleted = step.completed;
    const isClickable = onStepClick && !step.error;

    return (
      <div
        key={step.id}
        className={`
          flex ${orientation === 'horizontal' ? 'flex-col' : 'items-start'}
          ${alternativeLabel ? 'items-center' : ''}
          ${orientation === 'horizontal' ? 'flex-1' : 'w-full'}
        `}
      >
        <div className={`flex ${orientation === 'horizontal' ? 'flex-col items-center' : 'items-center'}`}>
          <div
            className={`
              flex items-center justify-center rounded-full
              ${sizeStyles[size].icon}
              ${isActive ? 'bg-red-500 text-white' : ''}
              ${isCompleted ? 'bg-red-500 text-white' : 'bg-gray-200'}
              ${step.error ? 'bg-red-500 text-white' : ''}
              ${isClickable ? 'cursor-pointer hover:bg-red-600' : ''}
              transition-colors duration-200
            `}
            onClick={() => isClickable && onStepClick(index)}
            role={isClickable ? 'button' : undefined}
          >
            {renderIcon(step, index)}
          </div>
          {showLabels && (
            <div
              className={`
                ${orientation === 'horizontal' ? 'mt-2' : 'ml-4'}
                ${sizeStyles[size].text}
                ${isActive ? 'text-gray-900' : 'text-gray-500'}
                ${step.error ? 'text-red-600' : ''}
              `}
            >
              <div className="font-medium">{step.title}</div>
              {step.description && (
                <div className="text-gray-500">{step.description}</div>
              )}
              {step.optional && (
                <div className="text-gray-400 text-xs">Optional</div>
              )}
            </div>
          )}
        </div>
        {renderConnector(index)}
      </div>
    );
  };

  const renderDots = (step: Step, index: number) => {
    const isActive = index === activeStep;
    const isCompleted = step.completed;
    const isClickable = onStepClick && !step.error;

    return (
      <div
        key={step.id}
        className={`
          flex flex-col items-center
          ${orientation === 'horizontal' ? 'flex-1' : 'w-full'}
        `}
      >
        <div
          className={`
            rounded-full transition-all duration-200
            ${sizeStyles[size].icon}
            ${isActive ? 'bg-red-500 scale-125' : ''}
            ${isCompleted ? 'bg-red-500' : 'bg-gray-200'}
            ${step.error ? 'bg-red-500' : ''}
            ${isClickable ? 'cursor-pointer hover:bg-red-600' : ''}
          `}
          onClick={() => isClickable && onStepClick(index)}
          role={isClickable ? 'button' : undefined}
        />
        {showLabels && (
          <div
            className={`
              mt-2 text-center
              ${sizeStyles[size].text}
              ${isActive ? 'text-gray-900' : 'text-gray-500'}
              ${step.error ? 'text-red-600' : ''}
            `}
          >
            {step.title}
          </div>
        )}
        {renderConnector(index)}
      </div>
    );
  };

  const renderProgress = (step: Step, index: number) => {
    const progress = (activeStep / (steps.length - 1)) * 100;
    const isActive = index === activeStep;
    const isCompleted = step.completed;

    return (
      <div
        key={step.id}
        className="relative flex-1"
      >
        <div
          className={`
            absolute top-0 left-0 h-1
            ${isCompleted ? 'bg-red-500' : 'bg-gray-200'}
            transition-all duration-300
          `}
          style={{ width: `${progress}%` }}
        />
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            ${index === 0 ? 'left-0' : index === steps.length - 1 ? 'right-0' : 'left-1/2'}
            transform ${index === steps.length - 1 ? 'translate-x-0' : '-translate-x-1/2'}
          `}
        >
          <div
            className={`
              rounded-full transition-all duration-200
              ${sizeStyles[size].icon}
              ${isActive ? 'bg-red-500 ring-4 ring-red-100' : ''}
              ${isCompleted ? 'bg-red-500' : 'bg-gray-200'}
              ${step.error ? 'bg-red-500' : ''}
            `}
          >
            {isCompleted && (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          {showLabels && (
            <div
              className={`
                absolute top-full mt-2 text-center whitespace-nowrap
                ${sizeStyles[size].text}
                ${isActive ? 'text-gray-900' : 'text-gray-500'}
                ${step.error ? 'text-red-600' : ''}
              `}
            >
              {step.title}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        flex
        ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
        ${className}
      `}
    >
      {steps.map((step, index) => {
        switch (variant) {
          case 'dots':
            return renderDots(step, index);
          case 'progress':
            return renderProgress(step, index);
          default:
            return renderStep(step, index);
        }
      })}
    </div>
  );
};

export default Stepper;
