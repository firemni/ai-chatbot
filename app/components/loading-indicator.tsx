'use client';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingIndicator({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative">
        <div className={sizeClasses[size]}>
          <div 
            className={`animate-spin absolute ${sizeClasses[size]} rounded-full 
                       border-2 border-solid border-blue-500 border-t-transparent`}
          />
          <div 
            className={`animate-ping absolute ${sizeClasses[size]} rounded-full 
                       border-2 border-solid border-blue-500 opacity-20`}
          />
        </div>
      </div>
      {message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}

// Small loading indicator with no label, useful for buttons
export function SmallLoadingIndicator() {
  return (
    <div className="inline-block h-4 w-4">
      <div className="animate-spin h-4 w-4 rounded-full border-2 
                    border-solid border-current border-t-transparent"/>
    </div>
  );
}

// Loading overlay with backdrop
export function LoadingOverlay({ message }: LoadingIndicatorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 
                  flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
        <LoadingIndicator size="large" message={message} />
      </div>
    </div>
  );
}