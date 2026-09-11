# Storefront shell contract

The global header and footer are loaded together from
`GET /store-api/storefront-config`. The endpoint resolves the configuration for
the current Shopware sales channel and language.

The root layout performs this request once per server render and maps the
response to frontend-owned presentation models. Customer account data and
on-demand category children remain separate requests.

## Header

`header.branding` supplies the store name and optional logo. A complete logo
contains `url`, `alt`, `width`, and `height`. Invalid or incomplete branding
uses the local wordmark fallback.

`header.navigation` supplies the top-level header links. The frontend preserves
this array as returned and does not merge children from the footer navigation.
Every item contains `id`, `label`, `href`, and a `children` array.

## Footer

The footer response supplies:

- `about` copy;
- revocation availability, button label, and recipient email;
- copyright text;
- category and service navigation;
- ordered social links and payment badges with resolved media.

The frontend maps `copyrightText` to its copyright model, `recipientEmail` to
the revocation recipient, and media `icon` objects to its shared media model.
Social links and payment badges are sorted by `position`. `openInNewTab` and
`revocation.enabled` directly control their respective UI behavior.

The current response does not own footer headings or the explanatory copy in
the revocation dialog. Those values remain in the local footer defaults.

Invalid individual navigation, social, or payment entries are reported and
omitted. Missing required footer copy falls back to the corresponding local
value. A failed Store API request is not silently swallowed.

## Mock mode

With `SHOPWARE_USE_MOCKS=true`, the shell uses the existing local branding,
footer, main-navigation, and service-navigation fixtures without requiring
Shopware credentials.
