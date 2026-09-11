"use client";

import { CircleCheckBig, CircleX, Info, TriangleAlert } from "lucide-react";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      closeButton
      icons={{
        error: <CircleX className="size-5" />,
        info: <Info className="size-5" />,
        success: <CircleCheckBig className="size-5" />,
        warning: <TriangleAlert className="size-5" />,
      }}
      position="top-center"
      richColors
      theme="light"
      toastOptions={{
        classNames: {
          actionButton: "!rounded-lg !bg-primary !text-primary-foreground",
          closeButton:
            "!border-current/20 !bg-transparent !text-current hover:!bg-black/5",
          default: "!border-[#decfbe] !bg-[#fffaf4] !text-foreground",
          description: "!text-current !opacity-75",
          error: "!border-[#e88f82] !bg-[#fff0ed] !text-[#a12d22]",
          info: "!border-[#91b9d8] !bg-[#eef7ff] !text-[#245f8d]",
          loading: "!border-[#decfbe] !bg-[#fffaf4] !text-foreground",
          success: "!border-[#80b979] !bg-[#edf8ea] !text-[#25612c]",
          title: "!font-semibold !text-current",
          toast:
            "!rounded-2xl !border-2 !shadow-[0_18px_45px_-28px_rgba(91,67,43,0.5)]",
          warning: "!border-[#e0b85a] !bg-[#fff7df] !text-[#805a09]",
        },
      }}
      {...props}
    />
  );
}
