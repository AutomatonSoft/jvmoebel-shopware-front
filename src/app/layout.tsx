import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { StoreFooter } from "@/features/storefront-shell/components/store-footer";
import { StoreHeader } from "@/features/storefront-shell/components/store-header";
import { getStorefrontBranding } from "@/features/storefront-shell/server/branding";
import {
  getFooterNavigation,
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
  const [branding, navigation, footerNavigation, serviceNavigation] =
    await Promise.all([
      getStorefrontBranding(),
      getMainNavigation(),
      getFooterNavigation(),
      getServiceNavigation(),
    ]);

  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader branding={branding} navigation={navigation} />
        {children}
        <StoreFooter
          branding={branding}
          footerNavigation={footerNavigation}
          serviceNavigation={serviceNavigation}
        />
      </body>
    </html>
  );
}
