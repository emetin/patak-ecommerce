import assert from "node:assert/strict";
import test from "node:test";

import { getBackendReadiness } from "../lib/backend-health.ts";

const completeEnvironment = {
  GOOGLE_SHEET_ID: "sheet-id",
  GOOGLE_FORMS_SHEET_ID: "forms-id",
  GOOGLE_SERVICE_ACCOUNT_EMAIL: "service@example.com",
  GOOGLE_PRIVATE_KEY: "private-key",
  ADMIN_PORTAL_USERNAME: "admin",
  ADMIN_PASSWORD_HASH: "hash",
  ADMIN_SESSION_SECRET: "secret",
};

test("reports a fully configured backend as ready", () => {
  const result = getBackendReadiness(completeEnvironment);

  assert.equal(result.ready, true);
  assert.equal(result.authMode, "session");
  assert.deepEqual(result.checks.flatMap((check) => check.missing), []);
});

test("reports missing configuration without exposing values", () => {
  const result = getBackendReadiness({});

  assert.equal(result.ready, false);
  assert.deepEqual(result.checks.find((check) => check.name === "catalog")?.missing, [
    "GOOGLE_SHEET_ID",
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
  ]);
});

test("allows explicit local admin bypass without auth secrets", () => {
  const result = getBackendReadiness({
    ...completeEnvironment,
    ADMIN_AUTH_DISABLED: "true",
    ADMIN_PORTAL_USERNAME: undefined,
    ADMIN_PASSWORD_HASH: undefined,
    ADMIN_SESSION_SECRET: undefined,
  });

  assert.equal(result.ready, true);
  assert.equal(result.authMode, "disabled");
});
