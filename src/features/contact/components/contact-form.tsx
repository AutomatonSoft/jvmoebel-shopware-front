"use client";

import {
  Mail,
  MapPin,
  MessageSquareText,
  Send,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContactInquiryActionState } from "@/features/contact/model/contact-inquiry";

const initialState: ContactInquiryActionState = { status: "idle" };

export function ContactForm({ title }: Readonly<{ title: string }>) {
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);
  const invalid = state.status === "invalid";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState(initialState);

    try {
      const response = await fetch("/store-api/contact/submit", {
        body: new FormData(event.currentTarget),
        method: "POST",
      });

      if (response.ok) {
        setState({ status: "success" });
      } else if (response.status === 400) {
        setState({ status: "invalid" });
      } else {
        setState({ status: "error" });
      }
    } catch {
      setState({ status: "error" });
    } finally {
      setPending(false);
    }
  }

  if (state.status === "success") {
    return (
      <p
        className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6"
        role="status"
      >
        Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.
      </p>
    );
  }

  return (
    <form
      aria-busy={pending}
      aria-label={title}
      className="grid gap-2"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <ContactInput
          autoComplete="given-name"
          icon={UserRound}
          invalid={invalid}
          label="Vorname"
          name="firstName"
        />
        <ContactInput
          autoComplete="family-name"
          icon={UserRound}
          invalid={invalid}
          label="Nachname"
          name="lastName"
        />
      </div>

      <ContactInput
        autoComplete="email"
        icon={Mail}
        invalid={invalid}
        label="E-Mail-Adresse"
        name="email"
        type="email"
      />

      <ContactTextarea
        autoComplete="street-address"
        icon={MapPin}
        invalid={invalid}
        label="Adresse"
        name="address"
        rows={3}
      />

      <ContactTextarea
        icon={MessageSquareText}
        invalid={invalid}
        label="Ihre Anfrage"
        name="comment"
        rows={6}
      />

      {invalid && (
        <p className="text-sm text-destructive" role="alert">
          Bitte füllen Sie alle Pflichtfelder korrekt aus.
        </p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es
          erneut.
        </p>
      )}

      <Button
        className="w-full justify-between disabled:cursor-wait"
        disabled={pending}
        size="lg"
        type="submit"
      >
        {pending ? "Anfrage wird gesendet …" : "Anfrage absenden"}
        <Send aria-hidden="true" />
      </Button>
    </form>
  );
}

function ContactInput({
  autoComplete,
  icon: Icon,
  invalid,
  label,
  name,
  type = "text",
}: Readonly<{
  autoComplete: string;
  icon: LucideIcon;
  invalid: boolean;
  label: string;
  name: string;
  type?: "email" | "text";
}>) {
  const id = `contact-${name}`;

  return (
    <div className="group relative min-w-0">
      <Input
        aria-invalid={invalid || undefined}
        autoComplete={autoComplete}
        className="peer h-11 rounded-lg border-border/80 bg-card/80 pt-5 pb-1 pl-11 pr-3 text-foreground shadow-none transition-[border-color,background-color,box-shadow] focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/10 motion-reduce:transition-none"
        id={id}
        name={name}
        placeholder=" "
        required
        type={type}
      />
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground/70 transition-colors peer-focus:text-primary peer-aria-invalid:text-destructive motion-reduce:transition-none"
        strokeWidth={1.5}
      />
      <label
        className="absolute top-2 left-11 max-w-[calc(100%-3.5rem)] origin-left truncate text-[0.65rem] leading-4 text-muted-foreground transition-[top,translate,font-size,color] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.65rem] peer-focus:text-primary peer-aria-invalid:text-destructive motion-reduce:transition-none"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}

function ContactTextarea({
  autoComplete,
  icon: Icon,
  invalid,
  label,
  name,
  rows,
}: Readonly<{
  autoComplete?: string;
  icon: LucideIcon;
  invalid: boolean;
  label: string;
  name: string;
  rows: number;
}>) {
  const id = `contact-${name}`;

  return (
    <div className="group relative min-w-0">
      <textarea
        aria-invalid={invalid || undefined}
        autoComplete={autoComplete}
        className="peer min-h-28 w-full resize-y rounded-lg border border-border/80 bg-card/80 pt-6 pb-2 pl-11 pr-3 text-sm text-foreground shadow-none outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/10 motion-reduce:transition-none"
        id={id}
        name={name}
        placeholder=" "
        required
        rows={rows}
      />
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground/70 transition-colors peer-focus:text-primary peer-aria-invalid:text-destructive motion-reduce:transition-none"
        strokeWidth={1.5}
      />
      <label
        className="absolute top-2 left-11 max-w-[calc(100%-3.5rem)] origin-left truncate text-[0.65rem] leading-4 text-muted-foreground transition-[top,translate,font-size,color] peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-primary peer-aria-invalid:text-destructive motion-reduce:transition-none"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}
