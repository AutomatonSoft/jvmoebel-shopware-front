import type { ContactInquiryActionState } from "@/features/contact/model/contact-inquiry";
import { parseContactInquiry } from "@/features/contact/model/validation";
import { reportContactInquiryIssue } from "@/features/contact/server/report-contact-inquiry-issue";
import { shouldUseShopwareMocks } from "@/integrations/shopware/mock-mode";
import { sendShopwareContactInquiry } from "@/integrations/shopware/contact";
import { createShopwareSession } from "@/integrations/shopware/session";

export async function submitContactInquiry(
  formData: FormData,
): Promise<ContactInquiryActionState> {
  const inquiry = parseContactInquiry(formData);

  if (!inquiry) {
    return { status: "invalid" };
  }

  if (shouldUseShopwareMocks()) {
    return { status: "success" };
  }

  try {
    const session = createShopwareSession();
    await sendShopwareContactInquiry(session.client, inquiry);

    return { status: "success" };
  } catch (error) {
    reportContactInquiryIssue({ cause: error, code: "request-failed" });

    return { status: "error" };
  }
}
