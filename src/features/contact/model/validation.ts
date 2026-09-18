import { z } from "zod";

import type { ContactInquiry } from "@/features/contact/model/contact-inquiry";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactInquirySchema = z.object({
  address: z.string().trim().min(1).max(500),
  comment: z.string().trim().min(1).max(5000),
  email: z.string().trim().max(254).regex(emailPattern),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
});

export function parseContactInquiry(formData: FormData): ContactInquiry | null {
  const result = contactInquirySchema.safeParse({
    address: formData.get("address"),
    comment: formData.get("comment"),
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  return result.success ? result.data : null;
}
