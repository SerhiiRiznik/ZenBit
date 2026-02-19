import { forwardRef, InputHTMLAttributes } from "react";
import "./FormInput.css";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, type = "text", className, ...rest }, ref) => {
    const inputClassName = error
      ? "form-input-control form-input-control--error"
      : "form-input-control";

    return (
      <label className="form-input-field">
        <span>{label}</span>
        <input
          ref={ref}
          type={type}
          className={
            className ? `${inputClassName} ${className}` : inputClassName
          }
          {...rest}
        />
        <small
          className={
            error
              ? "form-input-error"
              : "form-input-error form-input-error--empty"
          }
          aria-live="polite"
        >
          {error ?? " "}
        </small>
      </label>
    );
  },
);

FormInput.displayName = "FormInput";
