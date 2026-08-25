"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ProductInquiryDialogProps = {
  productName: string;
};

export function ProductInquiryDialog({
  productName,
}: ProductInquiryDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <Button
            className="w-full"
            size="lg"
            type="button"
            variant="outline"
          />
        }
      >
        Ask about this product
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-60 min-h-dvh bg-foreground/45 backdrop-blur-xs transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Viewport className="fixed inset-0 z-70 flex min-h-dvh items-center justify-center overflow-y-auto p-4 sm:p-8">
          <Dialog.Popup className="w-full max-w-xl overflow-hidden rounded-2xl border bg-background shadow-2xl transition-[transform,opacity] duration-200 ease-out data-ending-style:scale-[.98] data-ending-style:opacity-0 data-starting-style:scale-[.98] data-starting-style:opacity-0">
            <div className="flex items-start justify-between gap-5 border-b px-5 py-5 sm:px-7 sm:py-6">
              <div className="min-w-0">
                <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-primary uppercase">
                  Product inquiry
                </p>
                <Dialog.Title className="mt-2 text-2xl leading-tight font-semibold tracking-[-0.03em] wrap-break-word">
                  Ask about this product
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground wrap-break-word">
                  Send us your question about {productName}.
                </Dialog.Description>
              </div>

              <Dialog.Close
                aria-label="Close product inquiry"
                render={
                  <Button
                    className="shrink-0 rounded-full"
                    size="icon-lg"
                    type="button"
                    variant="ghost"
                  />
                }
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>

            <div className="space-y-5 px-5 py-6 sm:px-7">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold">Email</span>
                <Input
                  autoComplete="email"
                  className="h-11 bg-background"
                  name="email"
                  placeholder="name@email.com"
                  type="email"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold">
                  Your question
                </span>
                <textarea
                  className="min-h-36 w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  name="question"
                  placeholder="What would you like to know?"
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t bg-muted/35 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <Dialog.Close
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    className="sm:min-w-28"
                  />
                }
              >
                Cancel
              </Dialog.Close>
              <Button className="sm:min-w-40" type="button">
                Send question
                <Send className="size-4" />
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
