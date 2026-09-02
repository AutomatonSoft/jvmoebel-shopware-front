import "server-only";

type NewsletterSubscriptionIssue =
  | Readonly<{
      code: "mock-write-rejected";
    }>
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
  let details: Readonly<Record<string, string>>;

  if (issue.code === "request-failed") {
    details = {
      cause:
        issue.cause instanceof Error
          ? issue.cause.message
          : "Unknown Shopware request error.",
      code: issue.code,
    };
  } else if (issue.code === "unsuccessful-response") {
    details = {
      code: issue.code,
      shopwareStatus: issue.shopwareStatus,
    };
  } else {
    details = { code: issue.code };
  }

  console.error("Newsletter subscription issue.", details);
}
