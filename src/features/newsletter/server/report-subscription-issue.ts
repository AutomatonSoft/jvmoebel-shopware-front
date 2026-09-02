import "server-only";

type NewsletterSubscriptionIssue =
  | Readonly<{
      cause: unknown;
      code: "request-failed";
    }>
  | Readonly<{
      code: "unsuccessful-response";
      shopwareStatus: string;
    }>;

export function reportNewsletterSubscriptionIssue(
  issue: NewsletterSubscriptionIssue,
): void {
  const details =
    issue.code === "request-failed"
      ? {
          cause:
            issue.cause instanceof Error
              ? issue.cause.message
              : "Unknown Shopware request error.",
          code: issue.code,
        }
      : {
          code: issue.code,
          shopwareStatus: issue.shopwareStatus,
        };

  console.error("Newsletter subscription issue.", details);
}
