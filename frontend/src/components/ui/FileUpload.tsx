import { FC, useRef, useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  showPreview?: boolean;
  previewType?: 'list' | 'grid';
  allowPaste?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  className = '',
  disabled = false,
  label = 'Upload files',
  description = 'Drag and drop files here, or click to select files',
  error,
  showPreview = true,
  previewType = 'list',
  allowPaste = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || disabled) return;

    const validFiles: File[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Check file size
      if (maxSize && file.size > maxSize) {
        console.error(`File ${file.name} exceeds maximum size of ${maxSize} bytes`);
        continue;
      }

      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type || `application/${file.name.split('.').pop()}`;
        if (!acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.slice(0, -1));
          }
          return fileType === type;
        })) {
          console.error(`File ${file.name} type not accepted`);
          continue;
        }
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newFiles = multiple
        ? [...selectedFiles, ...validFiles].slice(0, maxFiles)
        : [validFiles[0]];

      setSelectedFiles(newFiles);
      onFileSelect(newFiles);
    }
  }, [disabled, maxSize, accept, multiple, maxFiles, selectedFiles, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (!allowPaste || disabled) return;

    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [allowPaste, disabled, handleFileSelect]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      onFileSelect(newFiles);
      return newFiles;
    });
  }, [onFileSelect]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-500' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
        />

        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          {accept && (
            <p className="mt-1 text-xs text-gray-500">
              Accepted file types: {accept}
            </p>
          )}
          {maxSize && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showPreview && selectedFiles.length > 0 && (
        <div className={`mt-4 ${previewType === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-2'}`}>
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className={`
                flex items-center justify-between
                p-2 rounded-lg border border-gray-200
                ${previewType === 'grid' ? 'flex-col text-center' : ''}
              `}
            >
              <div className={`flex items-center ${previewType === 'grid' ? 'flex-col' : ''}`}>
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                )}
                <div className={`${previewType === 'grid' ? 'mt-2' : 'ml-3'}`}>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <span className="sr-only">Remove file</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
