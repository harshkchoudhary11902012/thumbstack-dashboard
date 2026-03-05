"use client";

import { useCallback, useEffect, useState } from "react";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { api } from "@/lib/api";
import { useDashboard } from "@/components/DashboardLayout";
import AddBookModal, { type BookForm } from "@/components/AddBookModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

type Book = {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: string;
};

const statusStyles: Record<string, string> = {
  wantToRead: "bg-amber-100 text-amber-800",
  reading: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  wantToRead: "Want to read",
  reading: "Reading",
  completed: "Completed",
};

export default function DashboardPage() {
  const { setTotalBooks, setBreadcrumbs } = useDashboard();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Books" },
    ]);
  }, [setBreadcrumbs]);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (tagFilter) params.set("tag", tagFilter);
      if (statusFilter) params.set("status", statusFilter);
      const data = await api(`/api/books?${params}`);
      setBooks(data);
      if (!tagFilter && !statusFilter) setTotalBooks(data.length);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [tagFilter, statusFilter, setTotalBooks]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(form: BookForm) {
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: form.status || "wantToRead",
    };
    if (editingBook) {
      await api(`/api/books/${editingBook._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setEditingBook(null);
    } else {
      await api("/api/books", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    setModalOpen(false);
    load();
  }

  async function deleteBook(id: string) {
    await api(`/api/books/${id}`, { method: "DELETE" });
    setDeletingBook(null);
    load();
  }

  function openAddModal() {
    setEditingBook(null);
    setModalOpen(true);
  }

  function openEditModal(book: Book) {
    setEditingBook(book);
    setModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Book Listing</h1>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
          >
            <IconPlus className="size-4" />
            Add Books
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 py-3">
          <input
            type="text"
            placeholder="Filter by tag"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
          >
            <option value="">All statuses</option>
            <option value="wantToRead">Want to read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Book name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {books.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {b.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {b.author}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(b.tags || []).length
                        ? (b.tags || []).map((t) => (
                            <span
                              key={t}
                              className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                            >
                              {t}
                            </span>
                          ))
                        : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[b.status] || "bg-slate-100 text-slate-700"}`}
                    >
                      {statusLabels[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(b)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Edit"
                      >
                        <IconEdit className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBook(b)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        aria-label="Delete"
                      >
                        <IconTrash className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {books.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-slate-500">
            No books yet. Click &quot;Add Books&quot; to add one.
          </div>
        )}
      </div>

      <AddBookModal
        key={editingBook?._id ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleSubmit}
        initialValues={
          editingBook
            ? {
                title: editingBook.title,
                author: editingBook.author,
                tags: (editingBook.tags || []).join(", "),
                status: editingBook.status,
              }
            : null
        }
        isEdit={!!editingBook}
      />

      <DeleteConfirmModal
        open={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={async () => {
          if (deletingBook) await deleteBook(deletingBook._id);
        }}
        title="Delete book?"
        message={
          deletingBook
            ? `Are you sure you want to delete "${deletingBook.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this book? This action cannot be undone."
        }
      />
    </>
  );
}
