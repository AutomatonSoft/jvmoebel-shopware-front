"use client";

import { useState } from "react";

type CmsYoutubeVideoConsentProps = Readonly<{
  embedUrl: string;
  title: string;
}>;

export function CmsYoutubeVideoConsent({
  embedUrl,
  title,
}: CmsYoutubeVideoConsentProps) {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
        referrerPolicy="strict-origin-when-cross-origin"
        src={embedUrl}
        title={title}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-white">
      <p className="max-w-md text-sm leading-6 text-white/70">
        Beim Laden des Videos werden Daten an YouTube übertragen. Weitere
        Informationen finden Sie in unserer Datenschutzerklärung.
      </p>
      <button
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onClick={() => setAccepted(true)}
        type="button"
      >
        YouTube-Video laden
      </button>
    </div>
  );
}
