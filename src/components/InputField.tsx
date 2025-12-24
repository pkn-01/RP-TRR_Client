import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon,
}: InputFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 sm:px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none text-base min-h-[44px] ${
            icon ? "pl-10" : ""
          } ${
            error
              ? "border-red-500 focus:border-red-600 bg-red-50"
              : "border-gray-200 focus:border-blue-500 bg-white"
          } ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "text-gray-900"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
