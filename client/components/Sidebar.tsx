"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBooks, IconLogout } from "@tabler/icons-react";

export default function Sidebar({
  open,
  totalBooks,
}: {
  open: boolean;
  totalBooks?: number;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full border-r border-slate-200 bg-white transition-all duration-200 ease-in-out ${
        open ? "w-56" : "w-0 overflow-hidden border-0"
      }`}
    >
      <div className="flex h-full w-56 flex-col pt-16">
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <IconBooks className="size-5 shrink-0" />
            <span>Books Listing</span>
          </Link>
          {typeof totalBooks === "number" && (
            <div className="px-3 py-1.5 text-xs text-slate-500">
              {totalBooks} book{totalBooks !== 1 ? "s" : ""} in collection
            </div>
          )}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <IconLogout className="size-5 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
