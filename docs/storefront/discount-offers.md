# Discount offers page

The `/rabatt-angebote` route is a Shopware landing page with an assigned
Shopping Experience. In live mode, the shared storefront router resolves its
SEO URL and landing-page ID through the Store API. The frontend has no
dedicated route file or CMS page ID setting for this page. A missing SEO URL or
an inactive or incomplete landing page returns the storefront 404 page.

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
8. `jv-home-editorial` with `appearance: "plain"` for expandable editorial and
   SEO content.

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
product set does not contain that category. Live links should point to the
canonical Shopware category route.

All custom element payloads and Administration responsibilities are documented
separately in the [CMS component index](../README.md#supported-elements).
