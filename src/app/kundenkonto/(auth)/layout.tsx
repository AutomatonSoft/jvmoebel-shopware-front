import type { ReactNode } from "react";

import { AccountPageShell } from "@/features/customer-account/components/account-page-shell";

export default function CustomerAuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AccountPageShell authNavigation>{children}</AccountPageShell>;
}
