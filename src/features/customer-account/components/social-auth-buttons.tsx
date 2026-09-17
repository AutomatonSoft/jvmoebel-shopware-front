"use client";

import { Apple } from "lucide-react";

import { Button } from "@/components/ui/button";

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.71-.06-1.24-.2-1.8H12v3.42h5.52a4.7 4.7 0 0 1-2.05 3.08v2.22h3.32c1.94-1.79 2.81-4.42 2.81-6.92Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.32-2.22c-.92.62-2.1.99-3.31.99-2.61 0-4.82-1.76-5.61-4.13H2.96v2.29A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.39 14.19A6 6 0 0 1 6.08 12c0-.76.13-1.5.31-2.19V7.52H2.96A10 10 0 0 0 2 12c0 1.61.39 3.14.96 4.48l3.43-2.29Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.68c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-9.04 5.52l3.43 2.29C7.18 7.44 9.39 5.68 12 5.68Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SocialAuthButtons({
  mode,
}: Readonly<{ mode: "login" | "register" }>) {
  const action = mode === "login" ? "anmelden" : "registrieren";
  const noteId = `social-${mode}-note`;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          aria-describedby={noteId}
          className="w-full gap-2.5"
          disabled
          type="button"
          variant="outline"
        >
          <GoogleMark />
          Mit Google {action}
        </Button>
        <Button
          aria-describedby={noteId}
          className="w-full gap-2.5"
          disabled
          type="button"
          variant="outline"
        >
          <Apple aria-hidden="true" className="size-4" fill="currentColor" />
          Mit Apple ID {action}
        </Button>
      </div>
      <p className="sr-only" id={noteId}>
        Diese Anmeldeart ist noch nicht verfügbar.
      </p>
      <div className="flex items-center gap-3 py-1 text-[0.65rem] font-medium tracking-[0.12em] text-muted-foreground uppercase before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        oder mit E-Mail
      </div>
    </div>
  );
}
