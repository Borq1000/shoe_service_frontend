import { Notification, NotificationResponse } from "@/types/notifications";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getNotifications(token: string): Promise<Notification[]> {
  const response = await fetch(`${BASE_URL}/api/notifications/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data: NotificationResponse = await response.json();
  return data.data;
}

export async function markAsRead(id: number, token: string): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/notifications/${id}/mark_as_read/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
}

export async function markAllAsRead(token: string): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/notifications/mark_all_as_read/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
}
