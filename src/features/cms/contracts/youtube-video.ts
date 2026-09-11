import {
  getCmsRecord,
  getCmsString,
  type CmsDataRecord,
} from "@/features/cms/contracts/parsing";
import type {
  CmsContractIssue,
  CmsContractResult,
} from "@/features/cms/contracts/result";
import type { CmsSlot } from "@/features/cms/model/page";

export type CmsYoutubeVideoDisplayMode = "cover" | "standard";

export type CmsYoutubeVideoData = Readonly<{
  advancedPrivacyMode: boolean;
  autoPlay: boolean;
  displayMode: CmsYoutubeVideoDisplayMode;
  end?: number;
  iframeTitle: string;
  loop: boolean;
  needsConfirmation: boolean;
  showControls: boolean;
  start?: number;
  videoId: string;
}>;

const youtubeVideoIdPattern = /^[A-Za-z0-9_-]{11}$/;

function getConfigValue(config: CmsDataRecord | undefined, key: string) {
  return getCmsRecord(config?.[key])?.value;
}

function getConfigString(config: CmsDataRecord | undefined, key: string) {
  const value = getConfigValue(config, key);

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getConfigBoolean(
  config: CmsDataRecord | undefined,
  key: string,
  fallback: boolean,
) {
  const value = getConfigValue(config, key);

  return typeof value === "boolean" ? value : fallback;
}

function getConfigSeconds(config: CmsDataRecord | undefined, key: string) {
  const value = getConfigValue(config, key);

  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : undefined;
}

function resolveDisplayMode(value: unknown): CmsYoutubeVideoDisplayMode {
  return value === "cover" ? "cover" : "standard";
}

export function buildYoutubeEmbedUrl(data: CmsYoutubeVideoData) {
  const host = data.advancedPrivacyMode
    ? "https://www.youtube-nocookie.com"
    : "https://www.youtube.com";
  const url = new URL(`/embed/${data.videoId}`, host);

  url.searchParams.set("cc_lang_pref", "de");
  url.searchParams.set("cc_load_policy", "1");
  url.searchParams.set("hl", "de");
  url.searchParams.set("rel", "0");

  if (data.autoPlay) {
    url.searchParams.set("autoplay", "1");
  }

  if (data.loop) {
    url.searchParams.set("loop", "1");
    url.searchParams.set("playlist", data.videoId);
  }

  if (!data.showControls) {
    url.searchParams.set("controls", "0");
  }

  if (data.start && data.start > 0) {
    url.searchParams.set("start", String(data.start));
  }

  if (data.end && data.end > 0) {
    url.searchParams.set("end", String(data.end));
  }

  return url.toString();
}

export function parseCmsYoutubeVideoData(
  slot: Pick<CmsSlot, "config" | "data">,
): CmsContractResult<CmsYoutubeVideoData> {
  const config = getCmsRecord(slot.config);
  const data = getCmsRecord(slot.data);
  const videoId = getConfigString(config, "videoID");
  const issues: CmsContractIssue[] = [];

  if (!videoId || !youtubeVideoIdPattern.test(videoId)) {
    issues.push({
      message: "YouTube video ID must contain exactly 11 valid characters.",
      path: "config.videoID.value",
    });

    return { data: null, issues };
  }

  return {
    data: {
      advancedPrivacyMode: getConfigBoolean(
        config,
        "advancedPrivacyMode",
        true,
      ),
      autoPlay: getConfigBoolean(config, "autoPlay", false),
      displayMode: resolveDisplayMode(getConfigValue(config, "displayMode")),
      end: getConfigSeconds(config, "end"),
      iframeTitle:
        getConfigString(config, "iframeTitle") ||
        getCmsString(data, "title") ||
        "YouTube-Video",
      loop: getConfigBoolean(config, "loop", false),
      needsConfirmation: getConfigBoolean(config, "needsConfirmation", false),
      showControls: getConfigBoolean(config, "showControls", true),
      start: getConfigSeconds(config, "start"),
      videoId,
    },
    issues,
  };
}
