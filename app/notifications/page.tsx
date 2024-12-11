import { NotificationsList } from "@/components/NotificationsList";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Уведомления</h1>
      <NotificationsList />
    </div>
  );
}
