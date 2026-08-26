import { useEffect, useState } from "react";

import {
  User,
  Bell,
  Lock,
  Moon,
  Shield,
  ChevronRight,
  X,
  LogOut,
  Check,
} from "lucide-react";

import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] =
    useState(null);

  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem(
        "socially_dark_mode"
      ) === "true"
  );

  const [notifications, setNotifications] =
    useState(
      () =>
        localStorage.getItem(
          "socially_notifications_enabled"
        ) !== "false"
    );

  const [privateAccount, setPrivateAccount] =
    useState(
      () =>
        localStorage.getItem(
          "socially_private_account"
        ) === "true"
    );

  const [savedMessage, setSavedMessage] =
    useState("");

  /* =========================================
     APPLY DARK MODE WHEN PAGE LOADS
  ========================================= */

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  /* =========================================
     SUCCESS MESSAGE
  ========================================= */

  const showSaved = () => {
    setSavedMessage(
      "Changes saved successfully."
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  };

  /* =========================================
     DARK MODE
  ========================================= */

  const handleDarkMode = () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    localStorage.setItem(
      "socially_dark_mode",
      String(newValue)
    );

    if (newValue) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    showSaved();
  };

  /* =========================================
     NOTIFICATIONS
  ========================================= */

  const handleNotifications = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "socially_notifications_enabled",
      String(newValue)
    );

    showSaved();
  };

  /* =========================================
     PRIVACY
  ========================================= */

  const handlePrivateAccount = () => {
    const newValue = !privateAccount;

    setPrivateAccount(newValue);

    localStorage.setItem(
      "socially_private_account",
      String(newValue)
    );

    showSaved();
  };

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[850px]">
        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your Socially account and
            preferences.
          </p>
        </div>

        {/* SUCCESS */}

        {savedMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <Check size={18} />
            {savedMessage}
          </div>
        )}

        {/* PROFILE */}

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                "https://i.pravatar.cc/150?img=47"
              }
              alt={user?.name || "User"}
              className="h-16 w-16 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="font-bold text-slate-900">
                {user?.name || "Your Name"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                @{user?.username || "username"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveSection("account")
              }
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit
            </button>
          </div>
        </div>

        {/* SETTINGS LIST */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <SettingRow
            icon={User}
            title="Account"
            description="Manage your profile information."
            onClick={() =>
              setActiveSection("account")
            }
          />

          <SettingRow
            icon={Bell}
            title="Notifications"
            description={
              notifications
                ? "Notifications are enabled."
                : "Notifications are disabled."
            }
            onClick={handleNotifications}
            toggle
            checked={notifications}
          />

          <SettingRow
            icon={Lock}
            title="Privacy"
            description={
              privateAccount
                ? "Your account is private."
                : "Your account is public."
            }
            onClick={handlePrivateAccount}
            toggle
            checked={privateAccount}
          />

          <SettingRow
            icon={Shield}
            title="Security"
            description="Manage password and account security."
            onClick={() =>
              setActiveSection("security")
            }
          />

          <SettingRow
            icon={Moon}
            title="Appearance"
            description={
              darkMode
                ? "Dark mode is enabled."
                : "Light mode is enabled."
            }
            onClick={handleDarkMode}
            toggle
            checked={darkMode}
          />
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={logout}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-5 py-4 text-sm font-bold text-red-500 shadow-sm transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* MODAL */}

      {activeSection === "account" && (
        <AccountModal
          user={user}
          onClose={() =>
            setActiveSection(null)
          }
        />
      )}

      {activeSection === "security" && (
        <SecurityModal
          user={user}
          onClose={() =>
            setActiveSection(null)
          }
        />
      )}
    </PageLayout>
  );
}

/* =========================================
   SETTING ROW
========================================= */

function SettingRow({
  icon: Icon,
  title,
  description,
  onClick,
  toggle,
  checked,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left transition last:border-b-0 hover:bg-slate-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon
          size={20}
          className="text-slate-700"
        />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>
      </div>

      {toggle ? (
        <div
          className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
            checked
              ? "bg-slate-900"
              : "bg-slate-300"
          }`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
              checked
                ? "translate-x-5"
                : "translate-x-0"
            }`}
          />
        </div>
      ) : (
        <ChevronRight
          size={20}
          className="text-slate-300"
        />
      )}
    </button>
  );
}

/* =========================================
   ACCOUNT MODAL
========================================= */

function AccountModal({ user, onClose }) {
  const [name, setName] = useState(
    user?.name || ""
  );

  const [bio, setBio] = useState(
    user?.bio || ""
  );

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: name.trim() || user.name,
      bio: bio.trim(),
    };

    localStorage.setItem(
      "socially_user",
      JSON.stringify(updatedUser)
    );

    alert("Profile updated successfully.");

    onClose();

    window.location.reload();
  };

  return (
    <Modal title="Account" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Name
          </label>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

/* =========================================
   SECURITY MODAL
========================================= */

function SecurityModal({ user, onClose }) {
  return (
    <Modal
      title="Security"
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">
            Login email
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {user?.email || "No email"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">
            Password
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Your password is protected for this
            demo application.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}

/* =========================================
   MODAL
========================================= */

function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[500px] rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Settings;