import React, { forwardRef, type InputHTMLAttributes } from "react";
import { Label } from "../typography/text";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

/**
 * Toggle Component
 * 
 * A toggle switch component for boolean states. More visually prominent than
 * a checkbox for important settings and feature toggles.
 * 
 * Usage:
 * ```tsx
 * <Toggle
 *   label="Public Profile"
 *   description="Make your profile visible to others"
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className = "", ...props }, ref) => {
    const id = props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    const [isChecked, setIsChecked] = React.useState(props.checked || false);

    return (
      <div className="flex items-center justify-between">
        {label && (
          <div>
            <label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
              {label}
            </label>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        )}

        <button
          ref={ref as any}
          type="button"
          role="switch"
          aria-checked={isChecked}
          id={id}
          onClick={() => {
            setIsChecked(!isChecked);
            const event = new Event('change', { bubbles: true });
            ref && 'current' in ref && ref.current?.dispatchEvent(event);
          }}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isChecked ? "bg-blue-600" : "bg-gray-300"}
            ${className}
          `}
          aria-label={label}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full
              bg-white transition-transform duration-200
              ${isChecked ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export type { ToggleProps };
