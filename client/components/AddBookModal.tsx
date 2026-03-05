"use client";

import { useEffect, useState } from "react";
import { IconLoader2, IconX } from "@tabler/icons-react";

export type BookForm = {
  title: string;
  author: string;
  tags: string;
  status: string;
};

const defaultForm: BookForm = {
  title: "",
  author: "",
  tags: "",
  status: "wantToRead",
};

export default function AddBookModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: BookForm) => Promise<void>;
  initialValues?: BookForm | null;
  isEdit?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const form = initialValues ?? defaultForm;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: BookForm = {
      title: (fd.get("title") as string) || "",
      author: (fd.get("author") as string) || "",
      tags: (fd.get("tags") as string) || "",
      status: (fd.get("status") as string) || "wantToRead",
    };
    setSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEdit ? "Edit book" : "Add book"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <IconX className="size-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="modal-title" className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              id="modal-title"
              name="title"
              type="text"
              defaultValue={form.title}
              placeholder="Book title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              required
            />
          </div>
          <div>
            <label htmlFor="modal-author" className="block text-sm font-medium text-slate-700 mb-1">
              Author
            </label>
            <input
              id="modal-author"
              name="author"
              type="text"
              defaultValue={form.author}
              placeholder="Author name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              required
            />
          </div>
          <div>
            <label htmlFor="modal-tags" className="block text-sm font-medium text-slate-700 mb-1">
              Tags / Category
            </label>
            <input
              id="modal-tags"
              name="tags"
              type="text"
              defaultValue={form.tags}
              placeholder="e.g. fiction, sci-fi (comma separated)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>
          <div>
            <label htmlFor="modal-status" className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              id="modal-status"
              name="status"
              defaultValue={form.status}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="wantToRead">Want to read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" aria-hidden />
                  {isEdit ? "Saving…" : "Adding…"}
                </>
              ) : isEdit ? (
                "Save"
              ) : (
                "Add book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
