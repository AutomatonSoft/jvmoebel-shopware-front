# `text`

Standard Shopware rich-text CMS element. It does not require a custom `jv-*`
Administration extension.

## Data sources

The frontend first reads resolved HTML from `slot.data.content`:

```json
{
  "content": "<h2>Pflegehinweise</h2><p>Reinigen Sie die Oberfläche mit einem weichen Tuch.</p>"
}
```

If resolved content is absent, the frontend accepts standard static Shopware
configuration:

```json
{
  "content": {
    "source": "static",
    "value": "<p>Statischer Text aus der Shopping Experience.</p>"
  }
}
```

This fallback is read from `slot.config`, not `slot.data`. Mapped or default
configuration without resolved `slot.data.content` is not rendered by the
current frontend.

## HTML rules

The frontend sanitizes all HTML. Supported tags include headings, paragraphs,
links, emphasis, lists, blockquotes, horizontal rules and basic tables.
Supported link protocols are HTTP, HTTPS, `mailto`, and `tel`. Protocol-relative
URLs, scripts, event handlers and unsupported tags or attributes are removed.
Links with `target="_blank"` receive `rel="noopener noreferrer"`.

The element is omitted when content is missing or empty after sanitization.

## Shopware Administration

Editors manage this element through Shopware's standard text CMS controls.
The Store API should preferably resolve the final HTML into
`slot.data.content`. The frontend owns sanitization and presentation styles.
