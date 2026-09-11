"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type AccountToastProps = Readonly<{
  description?: string;
  id: string;
  title?: string;
  trigger?: unknown;
  type: "error" | "success";
}>;

export function AccountToast({
  description,
  id,
  title,
  trigger,
  type,
}: AccountToastProps) {
  useEffect(() => {
    if (!title) {
      return;
    }

    toast[type](title, { description, id });
  }, [description, id, title, trigger, type]);

  return null;
}
