import assert from "node:assert/strict";
import test from "node:test";

import {
  guardPublicRequest,
  resetPublicRequestGuards,
} from "../lib/public-api-guard.ts";

test.beforeEach(() => resetPublicRequestGuards());

function request(ip: string, contentLength?: number) {
  const headers = new Headers({ "x-forwarded-for": `${ip}, 10.0.0.1` });
  if (contentLength !== undefined) headers.set("content-length", String(contentLength));
  return new Request("https://patak.example/api/contact", { headers });
}

test("rate limits contact submissions by client and scope", () => {
  for (let index = 0; index < 5; index += 1) {
    assert.equal(guardPublicRequest(request("203.0.113.10"), "contact", 1_000).allowed, true);
  }

  const blocked = guardPublicRequest(request("203.0.113.10"), "contact", 1_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.status, 429);
  assert.equal(blocked.retryAfterSeconds, 600);
});

test("keeps separate clients and endpoint scopes independent", () => {
  for (let index = 0; index < 5; index += 1) {
    guardPublicRequest(request("203.0.113.10"), "contact", 1_000);
  }

  assert.equal(guardPublicRequest(request("203.0.113.11"), "contact", 1_000).allowed, true);
  assert.equal(guardPublicRequest(request("203.0.113.10"), "newsletter", 1_000).allowed, true);
});

test("rejects oversized bodies before consuming rate limit capacity", () => {
  const oversized = guardPublicRequest(request("203.0.113.12", 32_001), "contact", 1_000);
  assert.equal(oversized.allowed, false);
  assert.equal(oversized.status, 413);

  const next = guardPublicRequest(request("203.0.113.12", 100), "contact", 1_000);
  assert.equal(next.allowed, true);
  assert.equal(next.remaining, 4);
});

test("resets the window after it expires", () => {
  for (let index = 0; index < 5; index += 1) {
    guardPublicRequest(request("203.0.113.13"), "contact", 1_000);
  }

  const reset = guardPublicRequest(request("203.0.113.13"), "contact", 601_001);
  assert.equal(reset.allowed, true);
  assert.equal(reset.remaining, 4);
});
