# Discount offers page

The `/rabatt-angebote` route renders a dedicated Shopware Shopping Experience.
In live mode, the CMS page ID comes from the sales-channel configuration key
`jvStorefrontDiscountOffersCmsPageId`. The value must be a 32-character
Shopware ID. A missing or invalid ID, or a failed Store API request, produces
the page's explicit unavailable state and a server-side error message.

Mock mode uses `discountOffersCmsPageMock`, which follows the same CMS
contracts as the live response.

## Page order

The Shopping Experience should contain these elements from top to bottom:

1. `jv-page-header` for the page title and introduction;
2. `jv-hero` for the main sale campaign;
3. `jv-category-rail` with `layout: "grid"` for offer categories;
4. `jv-product-grid` with `layout: "rail"` for the manually curated products;
5. `jv-promo-banner` for the consultation campaign;
6. `jv-benefit-strip` for service benefits;
7. `jv-faq` for discount-code questions;
8. the standard Shopware `text` element for editorial and SEO content.

The frontend breadcrumb, route metadata, global header, and global footer are
outside this Shopping Experience.

## Product curation

The `jv-product-grid` Administration control must let the manager select
specific Shopware products and order them manually. Its resolver returns the
current sales-channel product data in `slot.data.products`; the frontend does
not decide which products qualify for the sale. Current price, list price,
name, cover, product URL, rating, and availability therefore stay synchronized
with Shopware.

The hero call to action can target the product section through
`#sale-products` when the grid uses `anchorId: "sale-products"`.

## Category links

The manager controls every category card and its destination. The mock links
use `/moebel-sortiment?category={value}&categoryLabel={label}` so the catalog
can keep the selected filter and its display label even when the first loaded
product set does not contain that category. Live links may instead point to
the canonical Shopware category route once that routing is available.

All custom element payloads and Administration responsibilities are documented
separately in [`docs/`](docs/README.md).
