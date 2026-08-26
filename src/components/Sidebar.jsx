import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar({ onCreatePost }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  const [notificationCount, setNotificationCount] =
    useState(() => {
      return Number(
        localStorage.getItem(
          "socially_notification_count"
        ) || 3
      );
    });

  /* =========================================
     NOTIFICATION COUNT
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

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      label: "Search",
      icon: Search,
      path: "/search",
    },
    {
      label: "Explore",
      icon: Compass,
      path: "/explore",
    },
    {
      label: "Reels",
      icon: Film,
      path: "/reels",
    },
    {
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      label: "Notifications",
      icon: Heart,
      path: "/notifications",
    },
    {
      label: "Create",
      icon: PlusSquare,
      action: "create",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleItemClick = (item) => {
    if (item.action === "create") {
      onCreatePost?.();
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[250px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* LOGO */}

      <div className="px-7 pb-7 pt-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-extrabold text-white">
            S
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Socially
          </span>
        </button>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.path ===
              location.pathname;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleItemClick(item)
                }
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition ${
                  active
                    ? "bg-slate-900 font-semibold text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={
                    active ? 2.4 : 1.9
                  }
                />

                <span>{item.label}</span>

                {item.label ===
                  "Notifications" &&
                  notificationCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {notificationCount >
                      99
                        ? "99+"
                        : notificationCount}
                    </span>
                  )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* BOTTOM */}

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={() =>
            navigate("/settings")
          }
          className={`mb-1 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
            location.pathname ===
            "/settings"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Settings size={20} />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;