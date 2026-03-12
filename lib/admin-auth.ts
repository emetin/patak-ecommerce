export const ADMIN_COOKIE_NAME = "ptx_admin_auth";

export function isAuthenticatedAdmin(cookieValue?: string) {
  return cookieValue === "ok";
}