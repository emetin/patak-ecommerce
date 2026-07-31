import assert from "node:assert/strict";
import test from "node:test";
import { normalizeImageUrl } from "../lib/image-url.ts";

test("normalizes Google Drive images to the direct image CDN", () => {
  const result = normalizeImageUrl(
    "https://drive.google.com/thumbnail?id=example-file_123&sz=w420"
  );

  assert.equal(
    result,
    "https://lh3.googleusercontent.com/d/example-file_123=w2000"
  );
});

test("keeps direct image paths valid while normalizing their size", () => {
  const result = normalizeImageUrl(
    "https://lh3.googleusercontent.com/d/example-file_123=w420"
  );

  assert.equal(
    result,
    "https://lh3.googleusercontent.com/d/example-file_123=w2000"
  );
});
