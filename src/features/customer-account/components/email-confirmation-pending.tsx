"use client";

import { BadgeCheck, MailCheck, MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const codeLength = 4;

export function EmailConfirmationPending({
  email,
}: Readonly<{ email?: string }>) {
  const [code, setCode] = useState(Array(codeLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const setCodeDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setCode((currentCode) =>
      currentCode.map((currentDigit, currentIndex) =>
        currentIndex === index ? digit : currentDigit,
      ),
    );

    if (digit && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, codeLength - index);

    if (!digits) return;

    setCode((currentCode) =>
      currentCode.map(
        (currentDigit, currentIndex) =>
          digits[currentIndex - index] ?? currentDigit,
      ),
    );

    inputRefs.current[Math.min(index + digits.length, codeLength - 1)]?.focus();
  };

  return (
    <div className="flex min-h-72 flex-col items-center justify-center py-5 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-foreground shadow-[0_10px_26px_-16px_rgb(21_21_19/0.75)]">
        <MailCheck aria-hidden="true" className="size-4" strokeWidth={1.8} />
      </div>
      <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        Konto bestätigen
      </p>
      <h1 className="mt-2 max-w-md text-2xl leading-[1.08] font-medium tracking-[-0.045em]">
        Geben Sie den Bestätigungscode ein.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-5 text-muted-foreground">
        Wir senden Ihnen einen vierstelligen Code zur Bestätigung Ihrer
        E-Mail-Adresse
        {email ? " an " : "."}
        {email && (
          <strong className="font-medium text-foreground">{email}</strong>
        )}
        {email && "."}
      </p>
      <form
        className="mt-5 max-w-sm"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend className="sr-only">Vierstelliger Bestätigungscode</legend>
          <div className="flex gap-2.5" role="group">
            {code.map((digit, index) => (
              <Input
                aria-label={`Ziffer ${index + 1}`}
                className="size-11 rounded-xl border-border/90 bg-card px-0 text-center text-lg font-semibold tabular-nums shadow-none transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/10"
                inputMode="numeric"
                key={index}
                maxLength={1}
                onChange={(event) => setCodeDigit(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !digit && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  handlePaste(index, event.clipboardData.getData("text"));
                }}
                pattern="[0-9]*"
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                value={digit}
              />
            ))}
          </div>
        </fieldset>
        <Button className="mt-4 w-full" disabled type="submit">
          Code bestätigen
          <MoveRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </form>
      <p className="mt-3 flex max-w-sm items-start justify-center gap-2 text-xs leading-5 text-muted-foreground">
        <BadgeCheck
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-primary"
          strokeWidth={1.8}
        />
        <span>
          Die Bestätigung wird aktiviert, sobald der E-Mail-Versand eingerichtet
          ist.
        </span>
      </p>
      <Link
        className={buttonVariants({
          className: "mt-6 w-full max-w-sm",
          variant: "outline",
        })}
        href="/kundenkonto/anmelden"
      >
        Zur Anmeldung
      </Link>
    </div>
  );
}
