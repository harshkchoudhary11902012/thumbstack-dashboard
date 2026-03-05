"use client";

import type { ReactNode } from "react";

export default function OnboardingLayout({
  children,
  title,
  formSubheading,
}: {
  children: ReactNode;
  title: string;
  formSubheading?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-800">
          Personal Book Manager
        </h1>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">{title}</h2>
        {formSubheading && (
          <p className="mt-1 text-sm text-slate-500">{formSubheading}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
