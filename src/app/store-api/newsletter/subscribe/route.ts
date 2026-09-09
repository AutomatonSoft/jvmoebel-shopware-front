import type { NewsletterActionState } from "@/features/newsletter/model/subscription";
import { subscribeToNewsletter } from "@/features/newsletter/server/subscribe";

const responseStatus = {
  error: 502,
  idle: 500,
  invalid: 400,
  success: 200,
} as const satisfies Record<NewsletterActionState["status"], number>;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { status: "invalid" } satisfies NewsletterActionState,
      { status: 400 },
    );
  }

  const state = await subscribeToNewsletter(formData);

  return Response.json(state, { status: responseStatus[state.status] });
}
