"use client";

export function AdminToast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 border-4 border-black bg-black text-newsprint px-6 py-3 shadow-hard font-sans text-xs uppercase tracking-widest"
    >
      {message}
    </div>
  );
}