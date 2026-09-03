export type NewsletterSubscription = Readonly<{
  email: string;
  storefrontUrl: string;
}>;

export type NewsletterActionState = Readonly<{
  status: "error" | "idle" | "invalid" | "success";
}>;
