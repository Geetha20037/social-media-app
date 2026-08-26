import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

function MobileNav({ onCreatePost }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[68px] items-center justify-around border-t border-slate-200 bg-white/95 px-3 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={() => navigate("/")}
        className={`rounded-xl p-2.5 ${
          location.pathname === "/"
            ? "text-slate-900"
            : "text-slate-500"
        }`}
      >
        <Home size={22} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/search")}
        className="rounded-xl p-2.5 text-slate-500"
      >
        <Search size={22} />
      </button>

      <button
        type="button"
        onClick={onCreatePost}
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg"
      >
        <PlusSquare size={22} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/notifications")}
        className="rounded-xl p-2.5 text-slate-500"
      >
        <Heart size={22} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="rounded-xl p-2.5 text-slate-500"
      >
        <User size={22} />
      </button>
    </nav>
  );
}

export default MobileNav;