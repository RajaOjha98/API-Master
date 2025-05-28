import React from "react";

// Define animation keyframes
const fadeInAnimation = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  .notification-toast {
    animation: fadeInOut 2s ease forwards;
  }
`;

interface NotificationsProps {
  showNotification: boolean;
  showAddNotification: boolean;
  showUpdateNotification: boolean;
  showDeleteNotification: boolean;
  
  // Optional custom messages
  copyMessage?: string;
  addMessage?: string;
  updateMessage?: string;
  deleteMessage?: string;
}

export const Notifications: React.FC<NotificationsProps> = ({
  showNotification,
  showAddNotification,
  showUpdateNotification,
  showDeleteNotification,
  
  // Default messages
  copyMessage = "Copied API Key to clipboard",
  addMessage = "API Key created successfully",
  updateMessage = "API Key updated successfully",
  deleteMessage = "API Key deleted successfully"
}) => {
  return (
    <>
      {/* Apply global styles for animation */}
      <style dangerouslySetInnerHTML={{ __html: fadeInAnimation }} />
      
      {/* Copy Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 inset-x-0 mx-auto w-max z-50 notification-toast flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {copyMessage}
          </div>
        </div>
      )}

      {/* Add API Key Notification Toast */}
      {showAddNotification && (
        <div className="fixed top-4 inset-x-0 mx-auto w-max z-50 notification-toast flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            {addMessage}
          </div>
        </div>
      )}

      {/* Update API Key Notification Toast */}
      {showUpdateNotification && (
        <div className="fixed top-4 inset-x-0 mx-auto w-max z-50 notification-toast flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {updateMessage}
          </div>
        </div>
      )}

      {/* Delete API Key Notification Toast */}
      {showDeleteNotification && (
        <div className="fixed top-4 inset-x-0 mx-auto w-max z-50 notification-toast flex items-center justify-center">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-red-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-100" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {deleteMessage}
          </div>
        </div>
      )}
    </>
  );
}; 