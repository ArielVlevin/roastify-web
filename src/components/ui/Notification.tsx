// components/ui/Notification.tsx
import React, { useEffect } from "react";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { NotificationType } from "@/lib/types";

interface NotificationProps {
  notification: NotificationType;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose, autoClose, duration]);

  // Get the appropriate background color based on notification type
  const getBgColor = () => {
    switch (notification.type) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "info":
        return <Info size={18} />;
      case "warning":
        return <AlertTriangle size={18} />;
      case "success":
        return <Check size={18} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg flex items-center justify-between ${getBgColor()}`}
    >
      <div className="flex items-center gap-2">
        {getIcon()}
        <span>{notification.message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Notification;
