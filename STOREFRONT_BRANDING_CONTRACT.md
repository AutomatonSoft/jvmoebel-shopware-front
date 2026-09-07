# Storefront branding contract

The header and footer use one global branding configuration. This is separate
from page CMS content because the logo belongs to the whole sales channel.
Editable footer content is supplied by the dedicated CMS contract described in
[`docs/jv-footer.md`](docs/jv-footer.md).

Shopware's standard Administration can store storefront logos as theme media,
but a headless Store API does not expose resolved theme media to this Next.js
frontend automatically. The backend integration should resolve the selected
Administration media and add the following value to
`SalesChannelContext.salesChannel.configuration`:

```json
{
  "jvStorefrontBranding": {
    "name": "JVMöbel",
    "logo": {
      "url": "/images/logo.svg",
      "alt": "JVMöbel home",
      "width": 180,
      "height": 48
    }
  }
}
```

## Field rules

- `name` is optional and defaults to the sales channel name, then `JVMöbel`.
- `logo.url`, `logo.width`, and `logo.height` are required to use the configured
  image.
- `logo.alt` is optional and defaults to the resolved storefront name.
- `logo.url` may be a root-relative path or an absolute HTTP/HTTPS URL.
- Width and height must be positive finite numbers.
- Invalid or incomplete logo data falls back to the current `JV MOEBEL`
  wordmark without breaking the page.

The same resolved logo is rendered in the header and footer. The final media
storage and delivery strategy will be agreed when the backend is ready; this
change does not configure a fixed image host in Next.js.

## Backend checklist

1. Add an editable media field to the appropriate sales channel or theme
   configuration in Shopware Administration.
2. Resolve the selected media ID to its URL, alt text, width, and height.
3. Expose the normalized object under
   `salesChannel.configuration.jvStorefrontBranding` in the Store API context
   response.
4. Return no `logo` object when no media is configured so the frontend fallback
   remains active.
