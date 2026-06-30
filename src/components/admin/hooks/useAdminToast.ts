"use client";

import { useCallback, useState } from "react";

export function useAdminToast() {
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  return { toast, showToast };
}