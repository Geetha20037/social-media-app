import {
  Search,
  Bell,
  MessageCircle,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ onCreatePost }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notificationCount, setNotificationCount] =
    useState(() => {
      return Number(
        localStorage.getItem(
          "socially_notification_count"
        ) || 3
      );
    });

  /* =========================================
     UPDATE COUNT
  ========================================= */

  useEffect(() => {
    const updateCount = () => {
      const count = Number(
        localStorage.getItem(
          "socially_notification_count"
        ) || 0
      );

      setNotificationCount(count);
    };

    window.addEventListener(
      "socially-notifications-updated",
      updateCount
    );

    window.addEventListener(
      "storage",
      updateCount
    );

    return () => {
      window.removeEventListener(
        "socially-notifications-updated",
        updateCount
      );

      window.removeEventListener(
        "storage",
        updateCount
      );
    };
  }, []);

  /* =========================================
     OPEN NOTIFICATIONS
  ========================================= */

  const openNotifications = () => {
    navigate("/notifications");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="flex h-[72px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile logo */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 lg:hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
            S
          </div>

          <span className="text-xl font-extrabold text-slate-900">
            Socially
          </span>
        </button>

        {/* Search */}

        <button
          type="button"
          onClick={() => navigate("/search")}
          className="hidden w-full max-w-[430px] items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-left md:flex"
        >
          <Search
            size={19}
            className="text-slate-400"
          />

          <span className="text-sm text-slate-400">
            Search people, posts...
          </span>
        </button>

        {/* Actions */}

        <div className="ml-auto flex items-center gap-1">
          {/* CREATE */}

          <button
            type="button"
            onClick={onCreatePost}
            className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex"
          >
            <Plus size={17} />
            Create
          </button>

          {/* MESSAGES */}

          <button
            type="button"
            onClick={() => navigate("/messages")}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
          >
            <MessageCircle size={21} />
          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            onClick={openNotifications}
            className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
          >
            <Bell size={21} />

            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notificationCount > 99
                  ? "99+"
                  : notificationCount}
              </span>
            )}
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
            className="ml-1 overflow-hidden rounded-full"
          >
            <img
              src={
                user?.avatar ||
                "https://i.pravatar.cc/100?img=47"
              }
              alt={
                user?.name || "Profile"
              }
              className="h-9 w-9 object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;