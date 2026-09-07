# Discount offers page

The `/rabatt-angebote` route is the JVMöbel sale overview. It follows the same
mock-mode boundary as `/shop`: presentation components receive the normalized
catalog listing, while product loading stays in the catalog server module.

The page contains:

- two responsive campaign banners with original JVMöbel imagery;
- linked offer-category tiles;
- a horizontally scrollable selection of reduced product cards;
- JVMöbel service benefits;
- expandable discount-code questions;
- editorial information about sale products, filters, delivery, and services.

A product is eligible for the sale selection when `previousPrice` exists and
is greater than `unitPrice`. The frontend calculates and displays the discount
percentage from those two values. Category tiles route to
`/shop?category={value}`. The shop reads the query parameter, activates the
matching category filter, and returns to page one. A known offer category stays
visible as the selected filter even when the local mock has no products for it;
the live Shopware adapter is responsible for supplying its inventory.

The banner images are generated project assets stored in
`public/images/offers`. Text and calls to action remain HTML so they stay
accessible and can reflow independently from the imagery on small screens.

Mock navigation points `Angebote` and `Sonderangebote` to this route. In live
mode, the navigation URL continues to come from Shopware and must be configured
to resolve to `/rabatt-angebote`.
