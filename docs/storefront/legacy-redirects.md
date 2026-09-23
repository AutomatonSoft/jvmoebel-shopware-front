# Legacy URL redirects

## Responsibility

Shopware plugin `JvSeo` is the source of truth for general, product, category,
and image legacy redirect rules. The Next.js storefront owns the public HTTP
response: it checks the incoming URL before route resolution and returns the
exact permanent `301` response that browsers and search crawlers observe.

The cross-repository contract and alternative delivery designs are maintained
in `jvmoebel-shopware-docs/docs/specs/SPEC-049-legacy-redirect-delivery.md`.
The backend data model, import behavior, and Store API route are documented in
`jvmoebel-shopware-back/docs/specs/SPEC-053-product-legacy-redirects.md`.

## Current request flow

`src/proxy.ts` delegates public requests to the SEO redirect handler before an
App Router page or not-found response is selected:

1. `GET` and `HEAD` requests are eligible. Next.js internals and the `/api`,
   `/bff`, and `/store-api` namespaces are excluded.
2. In real Shopware mode, the handler sends the absolute `request.url` to
   `POST /store-api/jv-seo/redirect` using the configured Store API client.
3. `data: null` continues normal Next.js routing.
4. A valid decision returns an external `301` response with the exact
   `targetUrl` from JvSeo in `Location`.
5. An invalid response, timeout, or backend error is fail-open: normal routing
   continues and the server logs a generic lookup error. A target equal to the
   requested URL is also ignored to avoid a direct loop.

The lookup is server-only, uses `cache: "no-store"`, has no retry, and times out
after two seconds. With `SHOPWARE_USE_MOCKS=true`, it is skipped.

The Store API response has this shape:

```json
{
  "data": {
    "statusCode": 301,
    "type": "product",
    "targetUrl": "https://www.jvmoebel.de/Produktname/SKU",
    "productId": "018f...",
    "categoryId": null,
    "mediaId": null
  }
}
```

The parser accepts `general`, `product`, `category`, and `image`. Product
decisions carry `productId`, category decisions carry `categoryId`, image
decisions carry `mediaId`, and unrelated entity IDs are `null`. The proxy itself
is not limited to a particular legacy path format.

## Domain and URL rules

JvSeo resolves a rule inside the Sales Channel selected by the Store API access
token. The current frontend configuration contains one `SHOPWARE_ACCESS_TOKEN`,
so it is suitable for the current single-channel pilot. Before more public
domains are served by the same process, the request host must select an explicit
Shopware endpoint/access-token configuration. An unknown host must not fall back
to another market.

The absolute URL sent to Shopware includes scheme, host, path, and query. The
reverse proxy must therefore preserve the original host and scheme through the
standard forwarded headers. JvSeo keeps path details such as case, `+`, percent
encoding, and trailing slash significant.

For product and category rules, JvSeo computes the target from the canonical
Shopware SEO URL and Sales Channel domain. Image rules use the current public
Shopware media URL. A local request can therefore redirect to a production or
backend media domain unless the relevant local domains are configured for the
local environment. To test an entirely local source and target without changing
entity configuration, use a general rule whose target is an absolute localhost
URL.

## Manual verification

Run the frontend with real Shopware configuration and inspect the response
without following it:

```bash
curl -i --max-redirs 0 \
  'http://localhost:3000/Ledersofa+Wohnlandschaft+Ecksofa+H2209+Beta.htm'
```

The successful result is `HTTP/1.1 301` with a `Location` header equal to the
JvSeo target. `curl -I` verifies the equivalent `HEAD` path. A URL without a
rule must continue to its normal Next.js response instead of being redirected.

## Possible optimizations

### Next.js proxy with Redis

JvSeo/MySQL remains the source of truth while Redis stores an exact-key redirect
read model. The server-side proxy can query Redis directly and return `301`
without calling Shopware on every request. Redis must be private, use a dedicated
key namespace and read-only credentials for Next.js, and be reachable only from
the required application network. Browser code must never receive Redis access.

This option needs more than a Redis client: save/import changes, product SEO URL
changes, and Sales Channel domain changes must invalidate or rebuild cached
targets. A full rebuild command and a defined miss/error fallback are required.
It is not implemented in the current version.

### Nginx redirect map

An infrastructure job can export active, fully resolved redirects from JvSeo to
an Nginx map and activate it with a validated atomic reload. This removes the
application lookup from redirect requests, but manual edits and dynamic product
target changes are invisible until the map is regenerated. Exact URL semantics,
multi-domain isolation, rollback, map size, and reload monitoring must be tested
before choosing this design. It is not implemented in the current version.
