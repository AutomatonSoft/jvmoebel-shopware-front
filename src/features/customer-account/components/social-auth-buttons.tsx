"use client";

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

function AppleMark() {
  return (
    <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"></path>{" "}
      </g>
    </svg>
  );
}

export function SocialAuthButtons({
  mode,
}: Readonly<{ mode: "login" | "register" }>) {
  const action = mode === "login" ? "anmelden" : "registrieren";
  const noteId = `social-${mode}-note`;

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
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
          <AppleMark />
          Mit Apple ID {action}
        </Button>
      </div>
      <p className="sr-only" id={noteId}>
        Diese Anmeldeart ist noch nicht verfügbar.
      </p>
      <div className="flex items-center gap-3 py-0.5 text-[0.65rem] font-medium tracking-[0.12em] text-muted-foreground uppercase before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        oder mit E-Mail
      </div>
    </div>
  );
}
