export type BackendCheck = {
  name: string;
  ready: boolean;
  missing: string[];
};

type Environment = Record<string, string | undefined>;

function hasValue(env: Environment, name: string) {
  return Boolean(env[name]?.trim());
}

function checkGroup(env: Environment, name: string, required: string[]): BackendCheck {
  const missing = required.filter((key) => !hasValue(env, key));

  return {
    name,
    ready: missing.length === 0,
    missing,
  };
}

export function getBackendReadiness(env: Environment = process.env) {
  const authDisabled = env.ADMIN_AUTH_DISABLED === "true";
  const checks = [
    checkGroup(env, "catalog", [
      "GOOGLE_SHEET_ID",
      "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      "GOOGLE_PRIVATE_KEY",
    ]),
    checkGroup(env, "forms", ["GOOGLE_FORMS_SHEET_ID"]),
    authDisabled
      ? { name: "admin_auth", ready: true, missing: [] }
      : checkGroup(env, "admin_auth", [
          "ADMIN_PORTAL_USERNAME",
          "ADMIN_PASSWORD_HASH",
          "ADMIN_SESSION_SECRET",
        ]),
  ];

  return {
    ready: checks.every((check) => check.ready),
    authMode: authDisabled ? "disabled" : "session",
    checks,
  };
}
