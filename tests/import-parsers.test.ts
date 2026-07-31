import assert from "node:assert/strict";
import test from "node:test";

import { parseXmlImportText } from "../lib/import/xml-import.ts";

test("parses product XML exported by the CMS", () => {
  const items = parseXmlImportText(
    `<?xml version="1.0"?><products><product><title>Hotel &amp; Spa Towel</title><slug>hotel-towel</slug><featured>true</featured></product></products>`
    ,
    "product"
  );

  assert.deepEqual(items, [
    { title: "Hotel & Spa Towel", slug: "hotel-towel", featured: "true" },
  ]);
});

test("supports CDATA content", () => {
  const items = parseXmlImportText(
    "<blogPosts><post><content><![CDATA[<p>Textile story</p>]]></content></post></blogPosts>",
    "post"
  );
  assert.equal(items[0].content, "<p>Textile story</p>");
});

test("blocks XML document type and entity declarations", () => {
  assert.throws(
    () =>
      parseXmlImportText(
        '<!DOCTYPE products [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><products><product><title>&xxe;</title></product></products>',
        "product"
      ),
    /not allowed/
  );
});
