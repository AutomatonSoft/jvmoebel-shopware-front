"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";

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
        className={buttonVariants({ className: "rounded-full px-5" })}
        onClick={() => setAccepted(true)}
        type="button"
      >
        YouTube-Video laden
      </button>
    </div>
  );
}
