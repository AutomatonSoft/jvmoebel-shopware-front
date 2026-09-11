"use client";

import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AccountFieldProps = Readonly<{
  autoComplete: string;
  className?: string;
  icon?: LucideIcon;
  id: string;
  invalid?: true;
  label: string;
  minLength?: number;
  name?: string;
  type?: "email" | "password" | "text";
}>;

export function AccountField({
  autoComplete,
  className,
  icon,
  id,
  invalid,
  label,
  minLength,
  name = id,
  type = "text",
}: AccountFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const Icon =
    icon ??
    (type === "email" ? Mail : type === "password" ? KeyRound : UserRound);

  return (
    <div className={cn("group relative min-w-0", className)}>
      <Input
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className={cn(
          "peer h-14 rounded-lg border-border/80 bg-card/80 pt-5 pb-1 pl-11 text-foreground shadow-none transition-[border-color,background-color,box-shadow] focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/10 motion-reduce:transition-none",
          type === "password" ? "pr-12" : "pr-3",
        )}
        id={id}
        minLength={minLength}
        name={name}
        placeholder=" "
        required
        type={type === "password" && passwordVisible ? "text" : type}
      />
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute top-5 left-3.5 size-4 text-muted-foreground/70 transition-colors peer-focus:text-primary peer-aria-invalid:text-destructive motion-reduce:transition-none"
        strokeWidth={1.5}
      />
      <label
        className="absolute top-2 left-11 max-w-[calc(100%-3.5rem)] origin-left truncate text-[0.65rem] leading-4 text-muted-foreground transition-[top,translate,font-size,color] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.65rem] peer-focus:text-primary peer-aria-invalid:text-destructive motion-reduce:transition-none"
        htmlFor={id}
      >
        {label}
      </label>
      {type === "password" && (
        <button
          aria-controls={id}
          aria-label="Passwort anzeigen"
          aria-pressed={passwordVisible}
          className="absolute top-1 right-1 grid size-12 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => setPasswordVisible((visible) => !visible)}
          type="button"
        >
          {passwordVisible ? (
            <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.5} />
          ) : (
            <Eye aria-hidden="true" className="size-4" strokeWidth={1.5} />
          )}
        </button>
      )}
    </div>
  );
}
