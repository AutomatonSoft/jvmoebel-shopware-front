import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { getCustomerAccount } from "@/features/customer-account/server/account";
import { StoreFooter } from "@/features/storefront-shell/components/store-footer";
import { StoreHeader } from "@/features/storefront-shell/components/store-header";
import { getStorefrontBranding } from "@/features/storefront-shell/server/branding";
import { getStorefrontFooterContent } from "@/features/storefront-shell/server/footer";
import {
  getMainNavigation,
  getServiceNavigation,
} from "@/features/storefront-shell/server/navigation";

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
  const [branding, customer, footerContent, navigation, serviceNavigation] =
    await Promise.all([
      getStorefrontBranding(),
      getCustomerAccount().catch((error: unknown) => {
        console.error("Header customer account lookup failed.", error);
        return null;
      }),
      getStorefrontFooterContent(),
      getMainNavigation(),
      getServiceNavigation(),
    ]);

  return (
    <html lang="de" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader
          branding={branding}
          customer={customer}
          navigation={navigation}
        />
        {children}
        <StoreFooter
          branding={branding}
          content={footerContent}
          footerNavigation={navigation}
          serviceNavigation={serviceNavigation}
        />
      </body>
    </html>
  );
}
