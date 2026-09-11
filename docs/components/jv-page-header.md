# `jv-page-header`

Page heading for an internal storefront page. The component renders the only
`h1` owned by the CMS page body.

## `slot.data`

```json
{
  "eyebrow": "Preisvorteile für dein Zuhause",
  "title": "Sale im Überblick",
  "description": "Entdecke reduzierte Möbel, Wohnaccessoires und ausgewählte Bestseller zum Vorteilspreis."
}
```

## Field contract

| Field         | Required | Rule                                     |
| ------------- | -------- | ---------------------------------------- |
| `title`       | yes      | Non-empty page heading rendered as `h1`. |
| `eyebrow`     | no       | Short text displayed above the heading.  |
| `description` | no       | Supporting plain text.                   |

The whole element is omitted when `title` is missing or empty. The component
does not accept HTML.

Breadcrumbs, route metadata, layout, responsive behavior and visual styling
remain owned by the frontend. A CMS page should contain at most one
`jv-page-header` element so it does not render multiple primary headings.

## Shopware Administration

Register the `jv-page-header` element and block. Editors should be able to
change the title, eyebrow and description. The Administration form should
mark `title` as required and resolve all values into `slot.data`.
