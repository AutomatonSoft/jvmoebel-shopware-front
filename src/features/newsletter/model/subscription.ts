export type NewsletterSubscription = Readonly<{
  email: string;
}>;

export type NewsletterActionState = Readonly<{
  status: "error" | "idle" | "invalid" | "success";
}>;
