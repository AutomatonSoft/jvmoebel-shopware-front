"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

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
      className="grid gap-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <ContactField label="Vorname">
          <Input autoComplete="given-name" name="firstName" required />
        </ContactField>
        <ContactField label="Nachname">
          <Input autoComplete="family-name" name="lastName" required />
        </ContactField>
      </div>

      <ContactField label="E-Mail-Adresse">
        <Input autoComplete="email" name="email" required type="email" />
      </ContactField>

      <ContactField label="Adresse">
        <textarea
          autoComplete="street-address"
          className="min-h-24 w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
          name="address"
          required
          rows={3}
        />
      </ContactField>

      <ContactField label="Ihre Anfrage">
        <textarea
          className="min-h-36 w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15"
          name="comment"
          required
          rows={6}
        />
      </ContactField>

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

function ContactField({
  children,
  label,
}: Readonly<{
  children: ReactNode;
  label: string;
}>) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
