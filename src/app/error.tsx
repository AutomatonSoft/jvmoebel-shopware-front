"use client";

import { useEffect } from "react";

import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorExperience
      code="500"
      eyebrow="Technischer Hinweis"
      title="Etwas ist nicht wie geplant gelaufen."
      description="Unser Shop konnte diese Seite gerade nicht vollständig laden. Versuchen Sie es erneut – Ihre Anfrage kann in wenigen Sekunden wieder funktionieren."
      reference={error.digest}
      retry={reset}
    />
  );
}
