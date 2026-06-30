"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminField,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/shared/AdminField";
import { formatTagsInput, parseTagsInput } from "@/lib/content";

type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "tags";
  required?: boolean;
  rows?: number;
  maxLength?: number;
};

type CrudListModuleProps<T extends { id: string }> = {
  title: string;
  endpoint: string;
  fields: FieldConfig[];
  emptyLabel: string;
  renderItem: (item: T) => React.ReactNode;
  getInitialForm: () => Record<string, string>;
  itemToForm: (item: T) => Record<string, string>;
  formToPayload: (form: Record<string, string>) => Record<string, unknown>;
  onSaved: (msg: string) => void;
};

export function CrudListModule<T extends { id: string }>({
  title,
  endpoint,
  fields,
  emptyLabel,
  renderItem,
  getInitialForm,
  itemToForm,
  formToPayload,
  onSaved,
}: CrudListModuleProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [form, setForm] = useState<Record<string, string>>(getInitialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const res = await fetch(endpoint);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function resetForm() {
    setEditId(null);
    setForm(getInitialForm());
  }

  function startEdit(item: T) {
    setEditId(item.id);
    setForm(itemToForm(item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = formToPayload(form);
    const res = await fetch(editId ? `${endpoint}/${editId}` : endpoint, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      onSaved("Failed to save entry.");
      return;
    }
    onSaved(editId ? "Entry updated." : "Entry created.");
    resetForm();
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      onSaved("Failed to delete.");
      return;
    }
    if (editId === id) resetForm();
    onSaved("Entry deleted.");
    fetchItems();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
      <section className="border-4 border-black bg-newsprint p-6 shadow-hard">
        <p className="font-mono text-xs text-ink-faded mb-1">{editId ? "Editing" : "New Entry"}</p>
        <h2 className="font-serif text-2xl font-black uppercase border-b-4 border-double border-black pb-3 mb-6">
          {editId ? `Edit ${title}` : `Add ${title}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <AdminField key={field.key} label={field.label} htmlFor={field.key}>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  required={field.required}
                  rows={field.rows ?? 4}
                  maxLength={field.maxLength}
                  value={form[field.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className={adminTextareaClass}
                />
              ) : (
                <input
                  id={field.key}
                  type="text"
                  required={field.required}
                  maxLength={field.maxLength}
                  value={form[field.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className={adminInputClass}
                  placeholder={field.type === "tags" ? "Comma-separated tags" : undefined}
                />
              )}
            </AdminField>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className={adminButtonPrimaryClass}>
              {editId ? "Update" : "Create"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className={adminButtonSecondaryClass}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="border-4 border-black bg-newsprint-accent p-6 shadow-hard">
        <h2 className="font-serif text-2xl font-black uppercase mb-6">All {title}</h2>
        <div className="border-2 border-black divide-y-2 divide-black max-h-[640px] overflow-y-auto">
          {loading && <div className="p-6 text-center font-mono text-xs uppercase text-ink-faded">Loading...</div>}
          {!loading && items.length === 0 && (
            <div className="p-6 text-center font-mono text-xs uppercase text-ink-faded">{emptyLabel}</div>
          )}
          {items.map((item) => (
            <article key={item.id} className="p-4 bg-newsprint">
              <div className="flex flex-wrap justify-end gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="font-sans text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 bg-newsprint-accent hover:bg-black hover:text-newsprint transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="font-sans text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 hover:bg-black hover:text-newsprint transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
              {renderItem(item)}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export { parseTagsInput, formatTagsInput };