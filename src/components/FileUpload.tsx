import { ChangeEvent } from "react";

interface FileUploadProps {
  label: string;
  onChange?: (files: File[]) => void;
  onFilesChange?: (files: File[]) => void;
  files?: File[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  maxSizeMB?: number; // alternative name for maxSize
  maxFiles?: number;
  required?: boolean;
}

export default function FileUpload({
  label,
  onChange,
  onFilesChange,
  files = [],
  multiple = true,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  maxSize,
  maxSizeMB = 5,
  maxFiles = 3,
  required = false,
}: FileUploadProps) {
  const limit = maxSize || maxSizeMB;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newFiles = Array.from(e.target.files || []);

    // Check max files
    if (newFiles.length + files.length > maxFiles) {
      alert(`คุณสามารถอัปโหลดไฟล์ได้สูงสุด ${maxFiles} ไฟล์`);
      newFiles = newFiles.slice(0, maxFiles - files.length);
    }

    // Validate file size
    const validFiles = newFiles.filter((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > limit) {
        alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด ${limit}MB)`);
        return false;
      }
      return true;
    });

    const updatedFiles = [...files, ...validFiles];
    const handler = onFilesChange || onChange;
    if (handler) {
      handler(updatedFiles);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg sm:rounded-md">
        <div className="space-y-1 text-center w-full">
          <svg
            className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-12l-3.172-3.172a4 4 0 00-5.656 0L28 20M8 20l3.172-3.172a4 4 0 015.656 0L28 20"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-600 justify-center gap-1">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 min-h-[44px] sm:min-h-auto flex items-center justify-center">
              <span>อัปโหลดไฟล์</span>
              <input
                type="file"
                className="sr-only"
                multiple={multiple}
                accept={accept}
                onChange={handleFileChange}
                required={required}
              />
            </label>
            <p className="hidden sm:block">หรือลากไฟล์มาวางที่นี่</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF, DOC, DOCX ขนาดไม่เกิน {limit}MB (สูงสุด {maxFiles}{" "}
            ไฟล์)
          </p>
        </div>
      </div>
    </div>
  );
}
