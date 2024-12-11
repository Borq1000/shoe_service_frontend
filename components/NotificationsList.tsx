"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export function NotificationsList() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) {
      setIsLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/notifications/", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Не удалось загрузить уведомления");
        }
        return res.json();
      })
      .then(setNotifications)
      .catch((err) => {
        console.error("Ошибка при загрузке уведомлений:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p>Произошла ошибка: {error}</p>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="p-4 text-gray-500 bg-gray-50 rounded-lg">
        <p>У вас пока нет уведомлений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg ${
            notification.is_read ? "bg-gray-100" : "bg-blue-50"
          }`}
        >
          <p className="font-medium">{notification.message}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {new Date(notification.created_at).toLocaleString()}
            </p>
            {!notification.is_read && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Новое
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
