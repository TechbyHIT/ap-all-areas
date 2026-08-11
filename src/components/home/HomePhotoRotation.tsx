"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { HOME_VISUAL_SERVICES } from "@/config/design";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { HOME_MAIN_SERVICE_IMAGE_SRCS } from "@/data/home-page";

/**
 * Horizontal scroll of leftover installation photos — never duplicates Main /
 * Our Services card images. Natural aspect ratio (no forced crop height).
 */
export function HomePhotoRotation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const photos = useMemo(() => {
    const used = new Set([
      ...HOME_MAIN_SERVICE_IMAGE_SRCS,
      ...HOME_VISUAL_SERVICES.map((s) => s.image),
    ]);
    return INSTALLATION_PHOTOS.filter((photo) => !used.has(photo.src));
  }, []);
  const loop = [...photos, ...photos];

  useEffect(() => {
    const el = trackRef.current;
    if (!el || photos.length < 2) return;

    let raf = 0;
    let x = 0;
    const speed = 0.45;

    const tick = () => {
      x += speed;
      const half = el.scrollWidth / 2;
      if (half > 0 && x >= half) x = 0;
      el.style.transform = `translate3d(${-x}px, 0, 0)`;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <section
      className="home-section home-section--soft home-photo-marquee"
      aria-label="Installation photo scroll"
    >
      <div className="home-photo-marquee-viewport">
        <div ref={trackRef} className="home-photo-marquee-track">
          {loop.map((photo, index) => (
            <figure
              key={`${photo.src}-${index}`}
              className="home-photo-marquee-item home-photo-marquee-item--native"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={900}
                height={700}
                loading="lazy"
                sizes="280px"
                className="home-native-img"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
