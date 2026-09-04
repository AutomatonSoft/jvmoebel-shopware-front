# Storefront navigation contract

The header and footer share the sales channel main navigation, while the footer
service links remain a separate Shopware navigation source.

## Navigation sources

| Storefront area      | Shopware source      | Rendering rule                                                                                  |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| Header categories    | `main-navigation`    | Render the main navigation tree.                                                                |
| Footer categories    | `main-navigation`    | Render only the first-level items received by the header.                                       |
| Footer service links | `service-navigation` | Render the configured service items; when Shopware returns a wrapper item, render its children. |

The root layout loads `main-navigation` once and passes the same normalized
array to the header and footer. It does not make a separate
`footer-navigation` request.

The footer service section still comes from Shopware. The active sales channel
must have an **Entry point service navigation** category assigned. When that
entry point is missing or contains no active, visible items, the Store API
returns an empty service navigation and the footer renders no service links.

## Normalized item

Every Shopware navigation item is converted to this frontend shape before it
reaches a component:

```ts
type StoreNavigationItem = {
  id: string;
  label: string;
  href: string;
  children: StoreNavigationItem[];
  childCount?: number;
};
```

`id`, `label`, `href`, and `children` are required. Components use `href`
directly as the anchor destination, so category and service items are
clickable without Shopware-specific URL logic in the UI.

## Link resolution

The Shopware mapper always supplies `href` using the first available source:

1. translated or untranslated `externalLink`;
2. `seoUrl` or the first canonical, non-deleted entry in `seoUrls`;
3. `/navigation/{categoryId}` as a stable fallback.

The navigation request includes the `sw-include-seo-urls` header so Shopware
can return canonical SEO paths. The backend should provide an external or SEO
URL for every visible item. The ID fallback prevents a missing `href` in the
frontend model, but the storefront must have a matching navigation route for
that fallback to resolve to a page.

## Shopware checklist

1. Assign the main navigation entry point to the sales channel.
2. Assign the service navigation entry point to the sales channel.
3. Keep every item intended for the footer active and visible in that sales
   channel.
4. Provide either an external link or a canonical SEO URL for every item.
5. Verify that `main-navigation` returns the expected first-level categories
   and `service-navigation` returns the expected service items.
