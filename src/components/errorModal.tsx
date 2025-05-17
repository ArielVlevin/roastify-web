// components/ErrorModal.tsx
import React, { useEffect } from "react";
import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";

// Zustand store לניהול מצב השגיאה
interface ErrorState {
  isOpen: boolean;
  message: string | null;
  details: string | null;
  showError: (message: string, details?: string) => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isOpen: false,
  message: null,
  details: null,
  showError: (message, details) => set({ isOpen: true, message, details }),
  hideError: () => set({ isOpen: false, message: null, details: null }),
}));

// קומפוננטת המודל עצמה
const ErrorModal: React.FC = () => {
  const { isOpen, message, details, hideError } = useErrorStore();

  // מניעת גלילה בגוף העמוד כשהמודל פתוח
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* שכבה כהה (overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70"
            onClick={hideError}
          />

          {/* תיבת המודל */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* כותרת וצלמית */}
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 p-2 mr-3 bg-red-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-red-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  התרחשה שגיאה
                </h3>
                <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                  {message}
                </p>
              </div>
            </div>

            {/* פרטי שגיאה (אם קיימים) */}
            {details && (
              <div className="p-3 mt-3 mb-4 overflow-auto text-sm bg-gray-100 rounded-md max-h-32 text-gray-600 font-mono">
                <code>{details}</code>
              </div>
            )}

            {/* כפתור סגירה */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={hideError}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                סגור
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// הוק להפעלה נוחה של המודל
export const useErrorModal = () => {
  const { showError } = useErrorStore();

  return {
    showError,
  };
};

export default ErrorModal;
