# `image`

Standard Shopware image CMS element. It uses Shopware's existing image
Administration controls and does not require a custom `jv-*` extension.

## Data source

The selected media entity must be resolved into `slot.data.media`:

```json
{
  "media": {
    "url": "https://shop.example.com/media/showroom.webp",
    "translated": {
      "alt": "JVMöbel showroom",
      "title": "Our showroom"
    },
    "metaData": {
      "width": 1600,
      "height": 900
    }
  }
}
```

`media.url` is required. The frontend reads translated alt and title text first,
then falls back to the corresponding direct media fields. Width and height are
optional but recommended to preserve the intrinsic aspect ratio.

The media ID in `slot.config.media.value` is not enough to render an image. The
Store API must return the resolved media entity in `slot.data.media`.

## Supported configuration

The frontend reads standard Shopware configuration entries from `slot.config`:

| Field               | Supported values                                       |
| ------------------- | ------------------------------------------------------ |
| `displayMode`       | `standard`, `cover`, `contain`, or `stretch`           |
| `minHeight`         | CSS height used by non-standard display modes          |
| `horizontalAlign`   | `flex-start`, `center`, or `flex-end`                  |
| `verticalAlign`     | `flex-start`, `center`, or `flex-end`                  |
| `url`               | Root-relative, HTTP, HTTPS, `mailto`, `tel`, or anchor |
| `newTab`            | Opens the configured link in a new tab                 |
| `ariaLabel`         | Accessible label for the image link                    |
| `fetchPriorityHigh` | Requests high image fetch priority                     |
| `isDecorative`      | Renders empty alt and title text                       |

Unsupported image URLs omit the element. Unsafe link protocols are reported
and the image is rendered without a link.

## Shopware Administration

Editors use Shopware's standard image element to select media, choose its
display mode and alignment, configure an optional link, and mark decorative
images. No additional Administration component is required.
