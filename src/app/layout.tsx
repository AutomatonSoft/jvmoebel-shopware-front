import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { getCustomerAccount } from "@/features/customer-account/server/account";
import { StoreFooter } from "@/features/storefront-shell/components/store-footer";
import { StoreHeader } from "@/features/storefront-shell/components/store-header";
import { getStorefrontShellData } from "@/features/storefront-shell/server/storefront-config";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "JVMöbel",
  description: "JVMöbel",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [storefront, customer] = await Promise.all([
    getStorefrontShellData(),
    getCustomerAccount().catch((error: unknown) => {
      console.error("Header customer account lookup failed.", error);
      return null;
    }),
  ]);

  return (
    <html lang="de" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader
          branding={storefront.branding}
          customer={customer}
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
