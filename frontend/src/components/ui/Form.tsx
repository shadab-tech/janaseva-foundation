import { FC, ReactNode, createContext, useContext, useCallback, useState } from 'react';

type FormValue = string | number | boolean;

type ValidationRule = {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  validate?: (value: FormValue) => boolean | string;
};

type FieldError = {
  type: string;
  message: string;
};

type FormState = {
  values: Record<string, FormValue>;
  errors: Record<string, FieldError>;
  touched: Record<string, boolean>;
};

interface FormContextType extends FormState {
  register: (name: string, rules?: ValidationRule) => {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    ref: (element: HTMLInputElement | null) => void;
  };
  handleSubmit: (callback: (data: Record<string, FormValue>) => void) => (e: React.FormEvent) => void;
  setValue: (name: string, value: FormValue) => void;
  setError: (name: string, error: FieldError) => void;
  clearError: (name: string) => void;
}

const FormContext = createContext<FormContextType | null>(null);

interface FormProps {
  onSubmit: (data: Record<string, FormValue>) => void;
  children: ReactNode;
  className?: string;
  id?: string;
  defaultValues?: Record<string, FormValue>;
}

export const Form: FC<FormProps> = ({
  onSubmit,
  children,
  className,
  id,
  defaultValues = {},
}) => {
  const [formState, setFormState] = useState<FormState>({
    values: defaultValues,
    errors: {},
    touched: {},
  });

  const validateField = (value: FormValue, rules?: ValidationRule): FieldError | null => {
    if (!rules) return null;

    if (rules.required && !value) {
      return { type: 'required', message: 'This field is required' };
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return { type: 'pattern', message: 'Invalid format' };
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return { type: 'minLength', message: `Minimum length is ${rules.minLength}` };
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return { type: 'maxLength', message: `Maximum length is ${rules.maxLength}` };
    }

    if (rules.min && typeof value === 'number' && value < rules.min) {
      return { type: 'min', message: `Minimum value is ${rules.min}` };
    }

    if (rules.max && typeof value === 'number' && value > rules.max) {
      return { type: 'max', message: `Maximum value is ${rules.max}` };
    }

    if (rules.validate) {
      const result = rules.validate(value);
      if (result !== true) {
        return { type: 'validate', message: typeof result === 'string' ? result : 'Invalid value' };
      }
    }

    return null;
  };

  const register = useCallback((name: string, rules?: ValidationRule) => {
    return {
      name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const formValue = e.target.type === 'number' ? Number(value) : value;

        setFormState(prev => ({
          ...prev,
          values: { ...prev.values, [name]: formValue },
          touched: { ...prev.touched, [name]: true },
        }));

        const error = validateField(formValue, rules);
        if (error) {
          setFormState(prev => ({
            ...prev,
            errors: { ...prev.errors, [name]: error },
          }));
        } else {
          setFormState(prev => {
            const newErrors = { ...prev.errors };
            delete newErrors[name];
            return { ...prev, errors: newErrors };
          });
        }
      },
      onBlur: () => {
        setFormState(prev => ({
          ...prev,
          touched: { ...prev.touched, [name]: true },
        }));
      },
      ref: (element: HTMLInputElement | null) => {
        if (element) {
          const value = formState.values[name];
          if (element.type === 'checkbox' && typeof value === 'boolean') {
            element.checked = value;
          } else {
            element.value = value?.toString() || '';
          }
        }
      },
    };
  }, [formState.values]);

  const handleSubmit = useCallback((callback: (data: Record<string, FormValue>) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      callback(formState.values);
    };
  }, [formState.values]);

  const setValue = useCallback((name: string, value: FormValue) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
    }));
  }, []);

  const setError = useCallback((name: string, error: FieldError) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  }, []);

  const clearError = useCallback((name: string) => {
    setFormState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[name];
      return { ...prev, errors: newErrors };
    });
  }, []);

  const contextValue: FormContextType = {
    ...formState,
    register,
    handleSubmit,
    setValue,
    setError,
    clearError,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        id={id}
        className={className}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form component');
  }
  return context;
};

interface FormFieldProps {
  name: string;
  rules?: ValidationRule;
  children: (fieldProps: {
    error?: string;
    touched: boolean;
    value: FormValue;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    ref: (element: HTMLInputElement | null) => void;
  }) => ReactNode;
}

export const FormField: FC<FormFieldProps> = ({ name, rules, children }) => {
  const form = useForm();
  const fieldProps = form.register(name, rules);
  const error = form.errors[name]?.message;
  const touched = form.touched[name];
  const value = form.values[name];

  return (
    <div className="space-y-2">
      {children({
        error,
        touched,
        value,
        onChange: fieldProps.onChange,
        onBlur: fieldProps.onBlur,
        ref: fieldProps.ref,
      })}
    </div>
  );
};

interface FormLabelProps {
  children: ReactNode;
  className?: string;
  required?: boolean;
}

export const FormLabel: FC<FormLabelProps> = ({ children, className, required }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

interface FormMessageProps {
  children?: ReactNode;
  className?: string;
}

export const FormMessage: FC<FormMessageProps> = ({ children, className }) => {
  if (!children) return null;
  return <p className={`text-sm font-medium text-red-500 ${className}`}>{children}</p>;
};

export default Form;
