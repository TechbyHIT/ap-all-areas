/**
 * §64 Video SEO — only for genuine videos. Never fabricate VideoObject.
 */

export type GenuineVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  durationIso?: string;
  transcript?: string;
  serviceSlug?: string;
  citySlug?: string | null;
  published: boolean;
};

/** Empty until real videos are verified and uploaded. */
export const PUBLISHED_VIDEOS: GenuineVideo[] = [];

export function listPublishedVideos(): GenuineVideo[] {
  return PUBLISHED_VIDEOS.filter((v) => v.published);
}

export function videoObjectSchema(video: GenuineVideo) {
  if (!video.published) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    contentUrl: video.contentUrl,
    uploadDate: video.uploadDate,
    ...(video.durationIso ? { duration: video.durationIso } : {}),
    ...(video.transcript ? { transcript: video.transcript } : {}),
  };
}
