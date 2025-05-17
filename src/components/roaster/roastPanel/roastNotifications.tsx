import { NotificationType } from "@/lib/types/____types";

const RoastNotifications = ({
  notification,
}: {
  notification: NotificationType | null;
}) => {
  if (notification)
    return (
      <div
        className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
          notification.type === "info"
            ? "bg-primary/20 text-primary"
            : notification.type === "warning"
            ? "bg-accent/20 text-accent"
            : "bg-destructive/20 text-destructive"
        }`}
      >
        {notification.message}
      </div>
    );
  return null;
};
export default RoastNotifications;
