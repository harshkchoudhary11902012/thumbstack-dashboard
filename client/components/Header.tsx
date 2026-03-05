"use client";

import { useState, useRef, useEffect } from "react";
import { IconMenu2, IconUser, IconLogout } from "@tabler/icons-react";

type User = { email: string };

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  breadcrumbs,
  user,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  breadcrumbs: { label: string; href?: string }[];
  user: User | null;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const displayName = user?.email
    ? user.email.split("@")[0].replace(/^./, (c) => c.toUpperCase())
    : "User";

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <IconMenu2 className="size-5" />
        </button>
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-slate-300 select-none">/</span>
              )}
              {b.href ? (
                <a
                  href={b.href}
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  {b.label}
                </a>
              ) : (
                <span className="text-slate-900 font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="relative flex items-center gap-3" ref={menuRef}>
        <button
          type="button"
          onClick={() => setUserMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100"
        >
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-medium text-slate-900">{displayName}</span>
            <span className="text-xs text-slate-500 truncate max-w-[160px]">
              {user?.email ?? "—"}
            </span>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <IconUser className="size-5" />
          </div>
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconLogout className="size-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
