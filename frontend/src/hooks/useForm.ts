import { useState, useCallback, ChangeEvent } from 'react';
import { FormErrors } from '@/types';

type ValidationRule<T> = {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  validate?: (value: T, formData: Record<string, unknown>) => string | undefined;
};

type ValidationRules<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

interface UseFormResult<T extends Record<string, unknown>> {
  data: T;
  errors: FormErrors;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setFieldValue: (name: keyof T, value: T[keyof T]) => void;
  validateField: (name: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  setErrors: (errors: FormErrors) => void;
}

export function useForm<T extends Record<string, unknown>>(
  initialData: T,
  validationRules?: ValidationRules<T>
): UseFormResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback(
    (name: keyof T): boolean => {
      if (!validationRules || !validationRules[name]) {
        return true;
      }

      const rules = validationRules[name];
      const value = data[name];
      let error: string | undefined;

      if (rules?.required && !value) {
        error = `${String(name)} is required`;
      } else if (rules?.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        error = `${String(name)} is invalid`;
      } else if (rules?.minLength && typeof value === 'string' && value.length < rules.minLength) {
        error = `${String(name)} must be at least ${rules.minLength} characters`;
      } else if (rules?.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        error = `${String(name)} must be less than ${rules.maxLength} characters`;
      } else if (rules?.validate) {
        error = rules.validate(value, data);
      }

      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return false;
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[String(name)];
        return newErrors;
      });
      return true;
    },
    [data, validationRules]
  );

  const validateForm = useCallback((): boolean => {
    if (!validationRules) {
      return true;
    }

    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const fieldIsValid = validateField(key as keyof T);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    return isValid;
  }, [validateField, validationRules]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      let fieldValue: unknown = value;

      // Handle different input types
      if (type === 'number' || type === 'range') {
        fieldValue = value === '' ? '' : Number(value);
      } else if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      }
      
      setData((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      if (validationRules?.[name as keyof T]) {
        validateField(name as keyof T);
      }
    },
    [validateField, validationRules]
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (validationRules?.[name]) {
        validateField(name);
      }
    },
    [validateField, validationRules]
  );

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
  }, [initialData]);

  return {
    data,
    errors,
    handleChange,
    setFieldValue,
    validateField,
    validateForm,
    resetForm,
    setErrors,
  };
}

// Predefined validation patterns
export const validationPatterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  mobile: /^[0-9]{10}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // At least 6 chars, 1 letter and 1 number
  name: /^[A-Za-z\s]{2,}$/,
  pincode: /^[0-9]{6}$/,
} as const;

// Common validation rules
export const createValidationRules = {
  required: (fieldName: string): ValidationRule<unknown> => ({
    required: true,
    validate: (value: unknown) =>
      value ? undefined : `${fieldName} is required`,
  }),
  
  email: (): ValidationRule<string> => ({
    pattern: validationPatterns.email,
    validate: (value: string) =>
      validationPatterns.email.test(value) ? undefined : 'Invalid email address',
  }),
  
  mobile: (): ValidationRule<string> => ({
    pattern: validationPatterns.mobile,
    validate: (value: string) =>
      validationPatterns.mobile.test(value) ? undefined : 'Invalid mobile number',
  }),
  
  password: (): ValidationRule<string> => ({
    pattern: validationPatterns.password,
    validate: (value: string) =>
      validationPatterns.password.test(value)
        ? undefined
        : 'Password must be at least 6 characters with at least 1 letter and 1 number',
  }),
  
  confirmPassword: (getPassword: () => string): ValidationRule<string> => ({
    validate: (value: string) =>
      value === getPassword() ? undefined : 'Passwords do not match',
  }),
};
