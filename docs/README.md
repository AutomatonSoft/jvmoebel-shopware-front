# Project documentation

## Storefront and page contracts

| Documentation                                             | Purpose                                |
| --------------------------------------------------------- | -------------------------------------- |
| [`storefront-config.md`](storefront/storefront-config.md) | Global header and footer configuration |
| [`product-listing.md`](storefront/product-listing.md)     | Product listing model and behavior     |
| [`discount-offers.md`](storefront/discount-offers.md)     | Discount offers page composition       |
| [`about-page.md`](storefront/about-page.md)               | About page composition                 |
| [`video-shop.md`](storefront/video-shop.md)               | Video Shop page composition            |

## Shopware CMS components

The following files document CMS elements rendered by the Next.js
storefront. Each file defines the element's `slot.type`, the resolved
`slot.data` expected from Shopware, validation and fallback behavior, and the
fields that should be editable in Shopware Administration.

### Supported elements

| `slot.type`         | Documentation                                             | Purpose                      |
| ------------------- | --------------------------------------------------------- | ---------------------------- |
| `jv-page-header`    | [`jv-page-header.md`](components/jv-page-header.md)       | Internal page heading        |
| `jv-hero`           | [`jv-hero.md`](components/jv-hero.md)                     | Hero banner carousel         |
| `jv-category-rail`  | [`jv-category-rail.md`](components/jv-category-rail.md)   | Category cards               |
| `jv-room-grid`      | [`jv-room-grid.md`](components/jv-room-grid.md)           | Editorial room grid          |
| `jv-product-grid`   | [`jv-product-grid.md`](components/jv-product-grid.md)     | Curated product cards        |
| `jv-promo-banner`   | [`jv-promo-banner.md`](components/jv-promo-banner.md)     | Image and promotional copy   |
| `jv-benefit-strip`  | [`jv-benefit-strip.md`](components/jv-benefit-strip.md)   | Service benefits             |
| `jv-faq`            | [`jv-faq.md`](components/jv-faq.md)                       | Expandable questions         |
| `jv-shop-the-look`  | [`jv-shop-the-look.md`](components/jv-shop-the-look.md)   | Image with product hotspots  |
| `jv-why-jvmoebel`   | [`jv-why-jvmoebel.md`](components/jv-why-jvmoebel.md)     | Brand benefits section       |
| `jv-home-editorial` | [`jv-home-editorial.md`](components/jv-home-editorial.md) | Expandable editorial content |
| `jv-newsletter`     | [`jv-newsletter.md`](components/jv-newsletter.md)         | Newsletter subscription form |
| `image`             | [`image.md`](components/image.md)                         | Standard image content       |
| `text`              | [`text.md`](components/text.md)                           | Standard rich-text content   |
| `youtube-video`     | [`youtube-video.md`](components/youtube-video.md)         | Standard YouTube video       |

### Common Store API structure

Page-body elements are read from the standard Shopware CMS hierarchy:

```text
CmsPage
└── sections, ordered by position
    └── blocks, ordered by position
        └── slots
            └── element selected by slot.type
```

Custom element values must be resolved into `slot.data`. Supplying values only
in `slot.config` is not supported for custom elements. The standard `text`
element additionally supports static `slot.config.content` as documented in
its own file.

An unknown `slot.type` produces a visible development marker and is omitted in
production. A known element with invalid required data is omitted without
breaking the rest of the page. Contract issues are reported server-side.

Arrays are the canonical representation for repeatable fields. Some elements
also accept keyed objects for fixture and Administration compatibility; this
is stated in the relevant component file.

### Shopware Administration responsibility

The frontend renderer does not register custom CMS elements, blocks, or
Administration controls. A Shopware extension must register every custom
`jv-*` element and its block, expose the documented fields, resolve selected
media and entities, and return the final values in `slot.data`.

The extension should preserve configured order, provide stable IDs, and emit
public media URLs. Layout, responsive behavior, typography, and visual styling
remain owned by the frontend.
