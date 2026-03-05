"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken } from "@/lib/api";
import Sidebar from "./Sidebar";
import Header from "./Header";

type User = { _id: string; email: string };

type DashboardContextValue = {
  user: User | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  totalBooks: number;
  setTotalBooks: (n: number) => void;
  breadcrumbs: { label: string; href?: string }[];
  setBreadcrumbs: (b: { label: string; href?: string }[]) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardLayout");
  return ctx;
}

export default function DashboardLayout({
  children,
  breadcrumbs: initialBreadcrumbs = [{ label: "Dashboard" }],
}: {
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState(initialBreadcrumbs);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/";
      return;
    }
    api("/api/me")
      .then((data: { user: User }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((o) => !o);
  }, []);

  const value: DashboardContextValue = {
    user,
    sidebarOpen,
    setSidebarOpen,
    totalBooks,
    setTotalBooks,
    breadcrumbs,
    setBreadcrumbs,
  };

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={value}>
      <div className="min-h-screen bg-slate-50">
        <Sidebar open={sidebarOpen} totalBooks={totalBooks} />
        <div
          className={`transition-[margin] duration-200 ${
            sidebarOpen ? "md:ml-56" : "md:ml-0"
          }`}
        >
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            breadcrumbs={breadcrumbs}
            user={user}
          />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
