"use client";

import { useNotifications } from "@/providers/notification-provider";
import Link from "next/link";

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Link href="/notifications" className="relative">
      <div className="w-6 h-6">🔔</div>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
