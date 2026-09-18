import "server-only";

import {
  getContactInquiryComment,
  getContactInquirySubject,
  type ContactInquiry,
} from "@/features/contact/model/contact-inquiry";
import type { ShopwareClient } from "@/integrations/shopware/client";

export async function sendShopwareContactInquiry(
  client: ShopwareClient,
  inquiry: ContactInquiry,
): Promise<void> {
  await client.invoke("sendContactMail post /contact-form", {
    body: {
      comment: getContactInquiryComment(inquiry),
      email: inquiry.email,
      firstName: inquiry.firstName,
      lastName: inquiry.lastName,
      subject: getContactInquirySubject(inquiry),
    },
  });
}
