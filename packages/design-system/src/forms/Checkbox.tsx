import React, { forwardRef, type InputHTMLAttributes } from "react";
import { Caption } from "../typography/text";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

/**
 * Checkbox Component
 * 
 * A styled checkbox input with optional label and description.
 * Fully accessible with proper ARIA attributes and keyboard navigation.
 * 
 * Usage:
 * ```tsx
 * <Checkbox
 *   label="Remember me"
 *   description="Stay logged in for 30 days"
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = "", ...props }, ref) => {
    const id = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            {...props}
            className={`
              w-4 h-4 border border-gray-300 rounded
              text-blue-600 bg-gray-100
              focus:ring-2 focus:ring-blue-500
              cursor-pointer
              transition-colors duration-200
              ${className}
            `}
            aria-describedby={description ? `${id}-description` : undefined}
          />
        </div>

        {label && (
          <div className="ml-2">
            <label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
              {label}
            </label>
            {description && (
              <p id={`${id}-description`} className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export type { CheckboxProps };
