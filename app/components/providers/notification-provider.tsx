"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  getNotifications,
  markAsRead as markAsReadApi,
  markAllAsRead as markAllAsReadApi,
} from "@/lib/notifications";
import { Notification } from "@/types/notifications";

interface NotificationContextType {
  socket: WebSocket | null;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  socket: null,
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  // Загрузка существующих уведомлений
  useEffect(() => {
    if (!session?.accessToken) return;

    getNotifications(session.accessToken)
      .then(setNotifications)
      .catch(console.error);
  }, [session]);

  // WebSocket подключение
  useEffect(() => {
    if (!session?.accessToken) return;

    const connectWebSocket = () => {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//127.0.0.1:8000/ws/notifications/?token=${session.accessToken}`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket соединение установлено");
        setSocket(ws);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        setNotifications((prev) => [notification, ...prev]);

        // Показываем toast уведомление
        toast(notification.message, {
          duration: 4000,
          position: "top-right",
          icon: getNotificationIcon(notification.type),
        });
      };

      ws.onerror = (error) => {
        console.error("WebSocket ошибка:", error);
      };

      ws.onclose = () => {
        setSocket(null);
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connectWebSocket();
          }, 3000);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [session, reconnectAttempts]);

  const markAsRead = async (id: number) => {
    if (!session?.accessToken) return;

    try {
      await markAsReadApi(id, session.accessToken);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Ошибка при отметке уведомления как прочитанного:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!session?.accessToken) return;

    try {
      await markAllAsReadApi(session.accessToken);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(
        "Ошибка при отметке всех уведомлений как прочитанных:",
        error
      );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_order":
        return "📦";
      case "order_update":
        return "🔄";
      case "order_cancelled":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        unreadCount: notifications.filter((n) => !n.is_read).length,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
