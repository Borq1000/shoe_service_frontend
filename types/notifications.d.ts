export interface Notification {
  id: number;
  type: "new_order" | "order_update" | "order_cancelled" | "system";
  title: string;
  message: string;
  order_id?: number;
  order_status?: string;
  created_at: string;
  is_read: boolean;
}

export interface NotificationResponse {
  data: Notification[];
  error?: string;
}
