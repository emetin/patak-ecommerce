# Patak Textile CMS

Patak Textile CMS is a lightweight Next.js-based catalog website with an
internal admin panel.

It is designed for a premium textile catalog structure, not a full
ecommerce checkout system.

## Tech Stack

-   Next.js App Router
-   React
-   TypeScript
-   Tailwind CSS
-   Google Sheets as the main content database
-   Google Drive media storage
-   Internal admin panel
-   CSV / JSON / XML import-export support

## Project Purpose

This project is built as a clean and manageable CMS foundation for Patak
Textile.

It supports:

-   Product listing pages
-   Product detail pages
-   Collection pages
-   Blog pages
-   Admin-based content management
-   Media Library management
-   Google Sheets-based database management
-   Google Drive image storage

The current structure is focused on a premium catalog presentation. It
is not intended to behave like a full Shopify-style ecommerce store at
this stage.

## Main Features

### Backend health

- `GET /api/health` provides a public, value-safe readiness response.
- `GET /api/admin/health` verifies protected configuration and the live catalog
  connection. It requires a valid admin session.
- `npm run check` runs lint, backend tests and the production build.
- Admin collection links, Shopify imports and upload endpoints are session-protected.
- Variant option combinations are unique per product; non-empty SKU and barcode
  values are unique across the catalog.
- Public contact, newsletter and career endpoints enforce per-client rate limits
  and request-size limits, and do not expose internal service errors.


### Website

-   Premium catalog-style frontend
-   Product listing pages
-   Product detail pages
-   Collection pages
-   Blog listing and detail pages
-   SEO fields for products and blog content
-   Responsive layout

### Admin Panel

The internal admin panel allows managing:

-   Products
-   Collections
-   Blog posts
-   Product variants
-   Product images
-   Media files

### Media Library

The Media Library supports:

-   Google Drive image upload
-   Multiple image upload
-   Upload queue system
-   Upload progress popup
-   Preview thumbnails
-   Copy image URL
-   Open image
-   Single image delete
-   Bulk image delete
-   Google Sheets media database integration

### Import / Export

Supported formats:

-   CSV
-   JSON
-   XML

CSV, JSON and XML imports use `slug` as the upsert key: an existing record is
updated and a new slug is appended to the relevant Google Sheets table.
The admin import panel supports a no-write preview, rejects duplicate slugs in
the same file and limits each batch to 2000 records.

Supports bulk product, collection and blog migration workflows.

## Main Data Sources

Required sheet names:

``` txt
products
collections
blog
product_variants
product_images
media
```

## Products Sheet Header Order

``` txt
id
title
slug
description
short_description
image
gallery
collection_slug
status
featured
seo_title
seo_description
created_at
updated_at
vendor
product_category
type
tags
```

## Collections Sheet Header Order

``` txt
id
title
slug
description
image
status
created_at
updated_at
```

## Blog Sheet Header Order

``` txt
id
title
slug
excerpt
content
image
status
featured
seo_title
seo_description
created_at
updated_at
```

## Product Variants Sheet Header Order

``` txt
id
product_id
product_slug
option_name
option_value
sku
price
compare_at_price
stock
status
created_at
updated_at
```

## Product Images Sheet Header Order

``` txt
id
product_slug
image_url
alt_text
sort_order
is_main
created_at
updated_at
```

## Media Sheet Header Order

``` txt
id
file_name
file_id
image_url
preview_url
mime_type
size_bytes
folder
alt_text
created_at
```

## Environment Variables

Create a `.env.local` file:

``` env
GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

GOOGLE_APPS_SCRIPT_MEDIA_URL=
GOOGLE_APPS_SCRIPT_MEDIA_SECRET=

ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_COOKIE_NAME=
```

## Installation

Install dependencies:

``` bash
npm install
```

Run development server:

``` bash
npm run dev
```

Build production:

``` bash
npm run build
```

Run production:

``` bash
npm run start
```

## Admin Workflow

1.  Login to admin panel
2.  Manage products
3.  Manage collections
4.  Upload media
5.  Manage blog
6.  Import / Export content
7.  Maintain Google Sheets structure

## Media Workflow

1.  Select images
2.  Upload to Google Drive
3.  Save metadata to Google Sheets
4.  Manage through Media Library
5.  Bulk or single delete
6.  Copy URLs for frontend use

## Important Notes

-   Google Sheets functions as the CMS database
-   Google Drive stores images
-   Preview thumbnails use Drive file IDs
-   Sheet structure must remain accurate
-   This project is catalog-focused, not checkout-focused
-   Admin panel requires correct environment configuration

## Future Development Suggestions

-   Folder filters
-   Drag & drop uploads
-   Advanced SEO tools
-   Bulk product editor
-   Media folder categorization
-   User roles
-   Activity logs
-   Shopify-like advanced CMS features

## Repository

``` txt
https://github.com/emetin/patak-ecommerce
```
