import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { StoreFooter } from "@/components/storefront/store-footer";
import { StoreHeader } from "@/components/storefront/store-header";
import {
  getFooterNavigation,
  getMainNavigation,
  getServiceNavigation,
} from "@/lib/shopware/navigation";
import { getShopwareRequestSession } from "@/lib/shopware/session";

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
  const session = getShopwareRequestSession();
  const [navigation, footerNavigation, serviceNavigation] = await Promise.all([
    getMainNavigation(session.client),
    getFooterNavigation(session.client),
    getServiceNavigation(session.client),
  ]);

  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader navigation={navigation} />
        {children}
        <StoreFooter
          footerNavigation={footerNavigation}
          serviceNavigation={serviceNavigation}
        />
      </body>
    </html>
  );
}
