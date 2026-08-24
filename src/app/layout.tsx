import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { StoreHeader } from "@/components/storefront/store-header";
import { getMainNavigation } from "@/lib/shopware/navigation";
import { createShopwareSession } from "@/lib/shopware/session";

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
  const session = createShopwareSession();
  const navigation = await getMainNavigation(session.client);

  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader navigation={navigation} />
        {children}
      </body>
    </html>
  );
}
