import "server-only";

type ContactInquiryIssue = Readonly<{
  cause: unknown;
  code: "request-failed";
}>;

export function reportContactInquiryIssue(issue: ContactInquiryIssue): void {
  console.error("Contact inquiry issue.", {
    cause:
      issue.cause instanceof Error
        ? issue.cause.message
        : "Unknown Shopware request error.",
    code: issue.code,
  });
}
