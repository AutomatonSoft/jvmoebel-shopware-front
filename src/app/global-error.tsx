"use client";

import { useEffect } from "react";

import { ErrorExperience } from "@/features/storefront-shell/components/error-experience";

import "./globals.css";

export default function GlobalError({
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
    <html lang="de">
      <body>
        <ErrorExperience
          code="500"
          eyebrow="JVMöbel"
          title="Der Shop braucht einen kurzen Moment."
          description="Beim Laden ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut. Falls das Problem bestehen bleibt, ist unser System bereits bereit für eine erneute Anfrage."
          reference={error.digest}
          retry={reset}
        />
      </body>
    </html>
  );
}
