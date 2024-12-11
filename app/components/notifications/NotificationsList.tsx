"use client";

import { useNotifications } from "@/providers/notification-provider";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Непрочитанных: {unreadCount}
          </span>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Отметить все как прочитанные
          </button>
        </div>
      )}

      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => !notification.is_read && markAsRead(notification.id)}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            notification.is_read ? "bg-gray-50" : "bg-blue-50 hover:bg-blue-100"
          }`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{notification.title}</h3>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{notification.message}</p>
          {notification.order_id && (
            <div className="mt-2 text-sm text-gray-500">
              Заказ #{notification.order_id}
            </div>
          )}
        </div>
      ))}

      {notifications.length === 0 && (
        <div className="text-center text-gray-500 py-8">Нет уведомлений</div>
      )}
    </div>
  );
}
