import type { ContactInquiryActionState } from "@/features/contact/model/contact-inquiry";
import { submitContactInquiry } from "@/features/contact/server/submit-contact-inquiry";

const responseStatus = {
  error: 502,
  idle: 500,
  invalid: 400,
  success: 200,
} as const satisfies Record<ContactInquiryActionState["status"], number>;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { status: "invalid" } satisfies ContactInquiryActionState,
      { status: 400 },
    );
  }

  const state = await submitContactInquiry(formData);

  return Response.json(state, { status: responseStatus[state.status] });
}
