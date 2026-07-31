import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../lib/json-ld.ts";

test("serializes valid JSON-LD", () => {
  const serialized = serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Patak Textile",
  });

  assert.equal(JSON.parse(serialized).name, "Patak Textile");
});

test("escapes opening tags in JSON-LD payloads", () => {
  const serialized = serializeJsonLd({ name: "</script><script>alert(1)</script>" });

  assert.equal(serialized.includes("<"), false);
  assert.equal(JSON.parse(serialized).name, "</script><script>alert(1)</script>");
});
