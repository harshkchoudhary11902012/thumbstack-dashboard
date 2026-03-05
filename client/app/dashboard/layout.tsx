"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Books" }]}>
      {children}
    </DashboardLayout>
  );
}
