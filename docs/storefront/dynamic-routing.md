# Dynamic Shopware routing

The catch-all route `src/app/[...path]/page.tsx` resolves public Shopware SEO
URLs through the Store API. It supports categories, products, and landing
pages.

For a landing page request, the storefront:

1. queries `/store-api/seo-url` with the requested path;
2. accepts the `frontend.landing.page` route and reads its landing-page ID;
3. loads `/store-api/landing-page/{landingPageId}`;
4. maps the assigned Shopping Experience into the shared CMS model;
5. renders its sections, blocks, and supported elements through the central
   CMS renderer.

Non-canonical SEO URLs redirect permanently to the canonical Shopware URL.
Unknown URLs and inactive or incomplete landing pages return the Next.js 404
page. Both Store API requests use `cache: "no-store"`, so published Shopware
changes are read on the next page request.

## Creating a page

Create and publish a Shopware landing page, assign its Shopping Experience and
sales channel, and give it an SEO URL for that sales channel. No Next.js route
file or CMS page ID environment setting is required. The frontend can render
the page automatically when every element in its Shopping Experience is
supported by the CMS renderer.

Mock mode keeps a small path-to-fixture registry for local development. That
registry does not participate in live Shopware routing.
