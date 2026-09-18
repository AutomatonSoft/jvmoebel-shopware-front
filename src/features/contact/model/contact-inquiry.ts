export type ContactInquiry = Readonly<{
  address: string;
  comment: string;
  email: string;
  firstName: string;
  lastName: string;
}>;

export type ContactInquiryActionState = Readonly<{
  status: "error" | "idle" | "invalid" | "success";
}>;

export function getContactInquirySubject(inquiry: ContactInquiry) {
  return `Kontaktanfrage von ${inquiry.firstName} ${inquiry.lastName}`;
}

export function getContactInquiryComment(inquiry: ContactInquiry) {
  return `Adresse:\n${inquiry.address}\n\nAnfrage:\n${inquiry.comment}`;
}
