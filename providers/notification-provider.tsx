"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster, Toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface NotificationContextType {
  socket: WebSocket | null;
}

interface OrderUpdateData {
  orderId: number;
  message: string;
  title?: string;
  status?: string;
}

const NotificationContext = createContext<NotificationContextType>({
  socket: null,
});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Ждем пока сессия загрузится
    if (status === "loading") {
      console.log("NotificationProvider: Загрузка сессии...");
      return;
    }

    console.log("NotificationProvider: Статус сессии:", status);
    console.log("NotificationProvider: Сессия:", session);

    // Проверяем наличие сессии и токена
    if (!session || !session.accessToken) {
      console.log("NotificationProvider: Нет токена доступа");
      if (session) {
        console.log("NotificationProvider: Содержимое сессии:", {
          user: session.user,
          accessToken: session.accessToken,
        });
      }
      return;
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//127.0.0.1:8000/ws/notifications/?token=${session.accessToken}`;

    console.log("NotificationProvider: Подключение к WebSocket:", wsUrl);

    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectInterval = 3000;

    function connect() {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket: Соединение установлено");
        setSocket(ws);
        reconnectAttempts = 0;
      };

      ws.onclose = (event) => {
        console.log("WebSocket: Соединение закрыто", event);
        setSocket(null);

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(
            `Попытка переподключения ${reconnectAttempts}/${maxReconnectAttempts}`
          );
          setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket: Ошибка", error);
      };

      ws.onmessage = (event) => {
        try {
          const data: OrderUpdateData = JSON.parse(event.data);
          console.log("WebSocket: Получено сообщение", data);

          const NotificationContent = () => (
            <div
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                if (data.orderId) {
                  router.push(`/my-orders/${data.orderId}`);
                }
              }}
            >
              <div className="font-semibold">{data.title}</div>
              <div>{data.message}</div>
              {data.status && (
                <div className="text-sm text-gray-500">
                  Статус: {data.status}
                </div>
              )}
            </div>
          );

          toast.custom(
            (t: Toast) => (
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto">
                <div className="p-4">
                  <NotificationContent />
                </div>
                <div className="border-t border-gray-200 p-2 text-right">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            ),
            {
              duration: 5000,
              position: "top-right",
            }
          );
        } catch (error) {
          console.error("Ошибка при обработке уведомления:", error);
        }
      };
    }

    connect();

    return () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close(1000, "Компонент размонтирован");
      }
    };
  }, [session, status, router]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
