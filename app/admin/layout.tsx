import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminShell from "../../components/admin/AdminShell";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "../../lib/admin-auth";

import "./admin-responsive.css";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || null;
  const isValidSession = await verifyAdminSessionToken(token);

  if (!isValidSession) {
    redirect("/portal-ptx-admin");
  }

  return <AdminShell>{children}</AdminShell>;
}