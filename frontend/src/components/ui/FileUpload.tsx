import { FC, useRef, useState, useCallback, DragEvent } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  multiple?: boolean;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  previewMaxHeight?: number;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  className?: string;
  showFileList?: boolean;
  onRemove?: (file: File) => void;
}

export const FileUpload: FC<FileUploadProps> = ({
  onChange,
  value = [],
  multiple = false,
  accept = ['image/*', 'application/pdf'],
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  preview = true,
  previewMaxHeight = 200,
  disabled = false,
  loading = false,
  error,
  label,
  helperText,
  className = '',
  showFileList = true,
  onRemove,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (maxSize && file.size > maxSize) {
      return false;
    }
    if (accept.length > 0) {
      const fileType = file.type;
      const isAccepted = accept.some(type => {
        if (type.endsWith('/*')) {
          const baseType = type.slice(0, -2);
          return fileType.startsWith(baseType);
        }
        return type === fileType;
      });
      return isAccepted;
    }
    return true;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files)
      .filter(validateFile)
      .slice(0, maxFiles - value.length);

    if (validFiles.length > 0) {
      const newFiles = [...value, ...validFiles];
      onChange(newFiles);

      if (preview) {
        const newPreviews = validFiles.map(file => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        setPreviews(prev => [...prev, ...newPreviews]);
      }
    }
  }, [value, onChange, maxFiles, preview, validateFile]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !loading) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (!disabled && !loading && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && !loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (file: File) => {
    const newFiles = value.filter(f => f !== file);
    onChange(newFiles);

    if (preview) {
      setPreviews(prev => {
        const newPreviews = prev.filter(p => p.file !== file);
        URL.revokeObjectURL(prev.find(p => p.file === file)?.preview || '');
        return newPreviews;
      });
    }

    onRemove?.(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const renderPreview = (file: File) => {
    const previewUrl = previews.find(p => p.file === file)?.preview;
    
    if (!previewUrl) return null;

    if (file.type.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt={file.name}
          className="object-contain rounded"
          style={{ maxHeight: previewMaxHeight }}
        />
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded p-4">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2h-3.93a2 2 0 01-1.66-.89l-.812-1.22A2 2 0 008.93 1H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
          </svg>
          <span className="ml-2 text-sm text-gray-600">{file.name}</span>
        </div>
      );
    }

    return null;
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
          ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-red-500'}
          ${error ? 'border-red-500' : ''}
          transition-colors
        `}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled || loading}
        />
        <div className="text-center">
          {loading ? (
            <LoadingSpinner text="Uploading..." />
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14m0 0l-4-4m4 4l-4-4m-4-4l-4 4m4-4l-4 4"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                {isDragActive ? (
                  'Drop the files here...'
                ) : (
                  <>
                    Drag & drop files here, or{' '}
                    <span className="text-red-500">browse</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {helperText || `Max ${formatFileSize(maxSize)} per file. Allowed types: ${accept.join(', ')}`}
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showFileList && value.length > 0 && (
        <ul className="mt-4 space-y-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-start space-x-4 p-2 bg-gray-50 rounded"
            >
              {preview && renderPreview(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {!disabled && !loading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
