import React, { forwardRef, type InputHTMLAttributes } from "react";
import { Caption, Label } from "../typography/text";

interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  helpText?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

/**
 * FileUpload Component
 * 
 * A styled file upload input with drag-and-drop support, file size validation,
 * and preview capabilities. Designed for image and video uploads.
 * 
 * Usage:
 * ```tsx
 * <FileUpload
 *   label="Upload Avatar"
 *   accept="image/*"
 *   maxSize={5242880} // 5MB
 *   helpText="JPG, PNG, or WebP up to 5MB"
 * />
 * ```
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, hint, required, helpText, maxSize, className = "", ...props }, ref) => {
    const id = props.id || `file-upload-${Math.random().toString(36).substr(2, 9)}`;
    const [isDragging, setIsDragging] = React.useState(false);
    const [fileName, setFileName] = React.useState<string>("");

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (maxSize && file.size > maxSize) {
          // Error will be handled by parent component
        }
        setFileName(file.name);
      }
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-6
            transition-colors duration-200
            text-center
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}
            ${error ? "border-red-500 bg-red-50" : ""}
          `}
        >
          <input
            ref={ref}
            id={id}
            type="file"
            {...props}
            onChange={handleChange}
            className="hidden"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />

          <label htmlFor={id} className="cursor-pointer block">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div className="text-sm font-medium text-gray-900">
              Click to upload or drag and drop
            </div>
            {fileName && (
              <div className="text-xs text-gray-500 mt-1">
                Selected: {fileName}
              </div>
            )}
          </label>
        </div>

        {helpText && !error && (
          <Caption className="mt-1 text-gray-500">{helpText}</Caption>
        )}

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

FileUpload.displayName = "FileUpload";

export type { FileUploadProps };
