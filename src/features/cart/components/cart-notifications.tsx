"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const errorMessages: Readonly<Record<string, string>> = {
  aktualisierung:
    "Der Warenkorb konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
  eingabe: "Die Warenkorb-Aktion enthält ungültige Angaben.",
  gutschein: "Bitte geben Sie einen gültigen Gutscheincode ein.",
};

const successMessages: Readonly<Record<string, string>> = {
  entfernt: "Der Artikel wurde aus dem Warenkorb entfernt.",
  gutschein: "Der Gutscheincode wurde angewendet.",
  hinzugefuegt: "Der Artikel wurde zum Warenkorb hinzugefügt.",
  menge: "Die Menge wurde aktualisiert.",
};

type CartNotificationsProps = Readonly<{
  error?: string;
  messages: readonly string[];
  success?: string;
}>;

export function CartNotifications({
  error,
  messages,
  success,
}: CartNotificationsProps) {
  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((message, index) => {
        toast.error(message, { id: `cart-message-${index}-${message}` });
      });
      return;
    }

    if (error) {
      toast.error(errorMessages[error] ?? errorMessages.aktualisierung, {
        id: `cart-error-${error}`,
      });
      return;
    }

    if (success && successMessages[success]) {
      toast.success(successMessages[success], {
        id: `cart-success-${success}`,
      });
    }
  }, [error, messages, success]);

  return null;
}
