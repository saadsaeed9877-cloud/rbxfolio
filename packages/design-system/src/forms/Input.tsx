import React, { forwardRef, type InputHTMLAttributes } from "react";
import { Caption } from "../typography/text";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

/**
 * TextInput Component
 * 
 * A controlled text input field with built-in validation, error handling, and accessibility.
 * Uses design-system typography for consistent sizing and styling.
 * 
 * Usage:
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={errors.email}
 *   required
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = "", ...props }, ref) => {
    const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          {...props}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md
            font-base text-base leading-normal
            placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />

        {error && (
          <Caption id={`${id}-error`} className="mt-1 text-red-500">
            {error}
          </Caption>
        )}

        {!error && hint && (
          <Caption id={`${id}-hint`} className="mt-1 text-gray-500">
            {hint}
          </Caption>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export type { InputProps };
