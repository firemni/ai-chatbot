interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = 'Loading...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="h-12 w-12">
          <div className="animate-spin absolute h-12 w-12 rounded-full border-4 
                        border-solid border-blue-500 border-t-transparent"></div>
          <div className="animate-ping absolute h-12 w-12 rounded-full border-4 
                        border-solid border-blue-500 opacity-20"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}

export function SmallLoadingIndicator() {
  return (
    <div className="inline-block h-4 w-4">
      <div className="animate-spin h-4 w-4 rounded-full border-2 
                    border-solid border-current border-t-transparent"></div>
    </div>
  );
}

export function LoadingOverlay({ message }: LoadingIndicatorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 
                  flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
        <LoadingIndicator message={message} />
      </div>
    </div>
  );
}