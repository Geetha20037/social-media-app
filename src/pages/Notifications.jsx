import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  UserPlus,
  CheckCheck,
  Trash2,
} from "lucide-react";

import PageLayout from "../components/PageLayout";

const defaultNotifications = [
  {
    id: 1,
    type: "like",
    name: "Maya Wilson",
    text: "liked your post.",
    time: "2 min ago",
    image: "https://i.pravatar.cc/150?img=5",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    name: "Alex Johnson",
    text: "commented on your post.",
    time: "18 min ago",
    image: "https://i.pravatar.cc/150?img=12",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    name: "Sarah Smith",
    text: "started following you.",
    time: "1 hour ago",
    image: "https://i.pravatar.cc/150?img=32",
    read: false,
  },
  {
    id: 4,
    type: "like",
    name: "David Miller",
    text: "liked your photo.",
    time: "3 hours ago",
    image: "https://i.pravatar.cc/150?img=15",
    read: true,
  },
];

function Notifications() {
  const [notifications, setNotifications] =
    useState(() => {
      const saved = localStorage.getItem(
        "socially_notifications"
      );

      if (saved) {
        return JSON.parse(saved);
      }

      localStorage.setItem(
        "socially_notifications",
        JSON.stringify(defaultNotifications)
      );

      return defaultNotifications;
    });

  /* =========================================
     SAVE NOTIFICATIONS
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "socially_notifications",
      JSON.stringify(notifications)
    );

    updateNotificationCount(notifications);
  }, [notifications]);

  /* =========================================
     MARK ALL AS READ WHEN PAGE OPENS
  ========================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================
     MARK ONE AS READ
  ========================================= */

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  /* =========================================
     MARK ALL AS READ
  ========================================= */

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /* =========================================
     DELETE ALL
  ========================================= */

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[800px]">
        {/* HEADER */}

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated with your activity.
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>

              <button
                type="button"
                onClick={clearNotifications}
                className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {notifications.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Heart
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No notifications
              </h2>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                You're all caught up. New likes,
                comments and follows will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon =
                notification.type === "like"
                  ? Heart
                  : notification.type === "comment"
                  ? MessageCircle
                  : UserPlus;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    markAsRead(notification.id)
                  }
                  className={`flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left transition last:border-b-0 ${
                    notification.read
                      ? "bg-white hover:bg-slate-50"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  {/* Avatar */}

                  <img
                    src={notification.image}
                    alt={notification.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900">
                        {notification.name}
                      </span>{" "}
                      {notification.text}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {notification.time}
                    </p>
                  </div>

                  {/* Icon */}

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.type === "like"
                        ? "bg-red-50 text-red-500"
                        : notification.type ===
                          "comment"
                        ? "bg-blue-50 text-blue-500"
                        : "bg-green-50 text-green-500"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Unread indicator */}

                  {!notification.read && (
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
}

/* =========================================
   UPDATE GLOBAL NOTIFICATION COUNT
========================================= */

function updateNotificationCount(
  notifications
) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  localStorage.setItem(
    "socially_notification_count",
    String(unreadCount)
  );

  window.dispatchEvent(
    new CustomEvent("socially-notifications-updated", {
      detail: unreadCount,
    })
  );
}

export default Notifications;