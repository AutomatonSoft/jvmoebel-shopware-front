import type { CmsElementProps } from "@/features/cms/components/cms-element";
import { CmsYoutubeVideoConsent } from "@/features/cms/components/elements/cms-youtube-video-consent";
import {
  buildYoutubeEmbedUrl,
  type CmsYoutubeVideoData,
} from "@/features/cms/contracts/youtube-video";

const youtubePermissions =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function CmsYoutubeVideo({
  data,
}: CmsElementProps<CmsYoutubeVideoData>) {
  const embedUrl = buildYoutubeEmbedUrl(data);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-3xl bg-neutral-950 shadow-sm"
      data-cms-element="youtube-video"
      data-display-mode={data.displayMode}
    >
      {data.needsConfirmation ? (
        <CmsYoutubeVideoConsent embedUrl={embedUrl} title={data.iframeTitle} />
      ) : (
        <iframe
          allow={youtubePermissions}
          allowFullScreen
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embedUrl}
          title={data.iframeTitle}
        />
      )}
    </div>
  );
}
