"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { HOME_ROTATION_PHOTOS } from "@/config/installation-photos";

/**
 * Continuous horizontal scroll of every installation photo — images only.
 */
export function HomePhotoRotation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const photos = HOME_ROTATION_PHOTOS;
  // Duplicate for seamless loop
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

  return (
    <section
      className="home-section home-section--soft home-photo-marquee"
      aria-label="Installation photo scroll"
    >
      <div className="home-photo-marquee-viewport">
        <div ref={trackRef} className="home-photo-marquee-track">
          {loop.map((photo, i) => (
            <figure key={`${photo.src}-${i}`} className="home-photo-marquee-item">
              <Image
                src={photo.src}
                alt={i < photos.length ? photo.alt : ""}
                width={480}
                height={360}
                loading={i < 6 ? "eager" : "lazy"}
                sizes="280px"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
