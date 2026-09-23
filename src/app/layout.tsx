import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { StoreFooter } from "@/features/storefront-shell/components/store-footer";
import { StoreHeader } from "@/features/storefront-shell/components/store-header";
import { getStorefrontShellData } from "@/features/storefront-shell/server/storefront-config";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "JVMoebel",
  description: "JVMoebel",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const storefront = await getStorefrontShellData();

  return (
    <html lang="de" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader
          branding={storefront.branding}
          navigation={storefront.navigation}
        />
        {children}
        <StoreFooter
          branding={storefront.branding}
          content={storefront.footerContent}
          footerNavigation={storefront.footerNavigation}
          serviceNavigation={storefront.serviceNavigation}
        />
        <Toaster />
      </body>
    </html>
  );
}
