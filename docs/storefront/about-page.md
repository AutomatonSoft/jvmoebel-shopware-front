# About page

The `/ueber-uns` route renders a dedicated Shopware Shopping Experience. In
live mode, its CMS page ID comes from the sales-channel configuration key
`jvStorefrontAboutCmsPageId`. The value must be a 32-character Shopware ID.

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
