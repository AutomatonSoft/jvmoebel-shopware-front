import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { getShopCartItemCount } from "@/features/cart/model/cart";
import { getShopCart } from "@/features/cart/server/cart";
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
  title: "JVMoebel",
  description: "JVMoebel",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [storefront, customer, cart] = await Promise.all([
    getStorefrontShellData(),
    getCustomerAccount().catch((error: unknown) => {
      console.error("Header customer account lookup failed.", error);
      return null;
    }),
    getShopCart().catch((error: unknown) => {
      console.error("Header cart lookup failed.", error);
      return null;
    }),
  ]);

  return (
    <html lang="de" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreHeader
          branding={storefront.branding}
          cartItemCount={cart ? getShopCartItemCount(cart) : 0}
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
