# YouTube video

## Slot type

`youtube-video`

This renderer supports Shopware's standard YouTube CMS element. No custom CMS
element or Administration extension is required.

## Shopware configuration

The element reads the standard values from `slot.config`:

| Field                 | Required | Default     | Purpose                           |
| --------------------- | -------- | ----------- | --------------------------------- |
| `videoID`             | yes      | —           | Eleven-character YouTube video ID |
| `iframeTitle`         | no       | Video label | Accessible iframe title           |
| `autoPlay`            | no       | `false`     | Starts playback automatically     |
| `loop`                | no       | `false`     | Repeats the video                 |
| `showControls`        | no       | `true`      | Shows YouTube playback controls   |
| `start`               | no       | —           | Start time in seconds             |
| `end`                 | no       | —           | End time in seconds               |
| `displayMode`         | no       | `standard`  | Standard or cover display         |
| `advancedPrivacyMode` | no       | `true`      | Uses `youtube-nocookie.com`       |
| `needsConfirmation`   | no       | `false`     | Requires a click before loading   |

## Administration workflow

In **Content → Shopping Experiences**, add the standard **YouTube video** block
for every new video. Paste the YouTube video ID, provide a meaningful video
title, and arrange the blocks in the desired order. The storefront renders any
number of these elements without a code change.

The page layout ID must be exposed through the sales-channel configuration key
`jvStorefrontVideoShopCmsPageId`.
