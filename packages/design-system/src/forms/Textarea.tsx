import React, { forwardRef, type TextareaHTMLAttributes } from "react";
import { Caption } from "../typography/text";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  showCharCount?: boolean;
}

/**
 * Textarea Component
 * 
 * A controlled textarea field for multi-line text input with character counting,
 * validation, and error handling. Uses design-system typography for consistency.
 * 
 * Usage:
 * ```tsx
 * <Textarea
 *   label="Description"
 *   placeholder="Enter description..."
 *   maxLength={500}
 *   showCharCount
 *   required
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, showCharCount, className = "", ...props }, ref) => {
    const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const maxLength = props.maxLength as number | undefined;
    const [charCount, setCharCount] = React.useState(0);

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

        <textarea
          ref={ref}
          id={id}
          {...props}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
          }}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md
            font-base text-base leading-normal
            placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            resize-vertical min-h-[100px]
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />

        <div className="flex justify-between items-start mt-1">
          <div>
            {error && (
              <Caption id={`${id}-error`} className="text-red-500">
                {error}
              </Caption>
            )}

            {!error && hint && (
              <Caption id={`${id}-hint`} className="text-gray-500">
                {hint}
              </Caption>
            )}
          </div>

          {showCharCount && maxLength && (
            <Caption className="text-gray-400">
              {charCount} / {maxLength}
            </Caption>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export type { TextareaProps };
