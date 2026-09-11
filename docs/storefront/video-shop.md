# Video Shop page

## Route

`/video-shop`

## Composition

The mock page contains a `jv-page-header` followed by the ten YouTube videos
from the existing JVMöbel Video Shop. The videos use Shopware's standard
`youtube-video` CMS element and appear in a responsive two-column grid.

In live mode, the page loads the Shopping Experience referenced by
`jvStorefrontVideoShopCmsPageId`. Editors can add, remove, and reorder standard
YouTube video blocks in Shopware Administration without changing the frontend.
Any section containing only single-slot YouTube blocks is automatically rendered
as the responsive video grid, so editors do not need to maintain CSS classes.

The footer service navigation exposes the page as **Video Shop**.
