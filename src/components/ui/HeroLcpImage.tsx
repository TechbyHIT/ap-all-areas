import Image from "next/image";

type HeroLcpImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Single hero image for LCP — no carousel JS, no multi-image download.
 * Replaces HeroImageScroll on money pages (GFG technical SEO / page speed).
 */
export function HeroLcpImage({ src, alt, className = "" }: HeroLcpImageProps) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-200 shadow-sm ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 560px"
        className="object-cover"
        quality={75}
      />
    </div>
  );
}
