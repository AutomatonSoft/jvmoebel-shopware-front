# About page

The `/ueber-uns` route is a Shopware landing page with an assigned Shopping
Experience. In live mode, the shared storefront router resolves its SEO URL
and landing-page ID through the Store API. The frontend has no dedicated route
file or CMS page ID setting for this page.

Mock mode uses `aboutCmsPageMock`. Its copy and source image are adapted from
the existing JVMöbel page at
`https://www.jvmoebel.de/Infos/JVMoebel+de.htm`.

## Page order

1. `jv-page-header` introduces the company.
2. `image` presents the main brand image.
3. `jv-why-jvmoebel` highlights selection, service, and payment.
4. `jv-home-editorial` contains the detailed company and service copy.

The route metadata, breadcrumb, global header, and global footer live outside
the Shopping Experience.
