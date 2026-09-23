"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContactWidgetChannel } from "@/features/storefront-shell/model/footer";

type ContactWidgetProps = Readonly<{
  channels?: readonly ContactWidgetChannel[];
}>;

function BrandIcon({
  type,
  url,
  iconUrl,
}: {
  type: string;
  url: string;
  iconUrl?: string;
}) {
  if (iconUrl) {
    return <img src={iconUrl} alt={type} className="size-5 object-contain" />;
  }

  const t = type.toLowerCase();
  const u = url.toLowerCase();

  if (t === "telegram" || u.includes("t.me") || u.includes("telegram")) {
    return <Send className="size-5 -ml-0.5" />;
  }

  if (t === "whatsapp" || u.includes("wa.me") || u.includes("whatsapp")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
      </svg>
    );
  }

  if (t === "email" || u.includes("mailto:")) {
    return <Mail className="size-5" />;
  }

  if (t === "phone" || u.includes("tel:")) {
    return <Phone className="size-5" />;
  }

  return <MessageSquare className="size-5" />;
}

export function ContactWidget({ channels }: ContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!channels?.length) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center"
      ref={menuRef}
    >
      <div
        className={cn(
          "mb-2 flex flex-col-reverse gap-3 transition-all duration-300 ease-in-out origin-bottom",
          isOpen
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-2 opacity-0 scale-90 pointer-events-none",
        )}
      >
        {channels.map((channel) => (
          <Button
            key={channel.id}
            render={
              <a href={channel.url} target="_blank" rel="noopener noreferrer" />
            }
            variant="outline"
            size="icon"
            className="size-12 rounded-full border border-primary text-primary bg-background shadow-lg shadow-black/5 transition-transform hover:scale-110 hover:bg-primary/5 flex items-center justify-center relative group"
            title={channel.label}
          >
            <span className="absolute right-full mr-3 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
              {channel.label}
            </span>
            <BrandIcon
              type={channel.type}
              url={channel.url}
              iconUrl={channel.icon}
            />
          </Button>
        ))}
      </div>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="solid"
        size="icon"
        className="size-14 rounded-full shadow-xl shadow-primary/20 transition-transform active:scale-95"
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
      >
        <div className="relative flex size-full items-center justify-center">
          <X
            className={cn(
              "absolute size-6 transition-all duration-300",
              isOpen
                ? "rotate-0 opacity-100 scale-100"
                : "-rotate-90 opacity-0 scale-50",
            )}
          />
          <MessageCircle
            className={cn(
              "absolute size-6 transition-all duration-300",
              isOpen
                ? "rotate-90 opacity-0 scale-50"
                : "rotate-0 opacity-100 scale-100",
            )}
          />
        </div>
      </Button>
    </div>
  );
}
