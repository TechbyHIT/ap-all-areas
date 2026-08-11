"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type HeroScrollImage = {
  src: string;
  alt: string;
};

type HeroImageScrollProps = {
  images: readonly HeroScrollImage[];
  /** full-bleed background behind home hero text */
  variant?: "bleed" | "panel";
  /** cover = perfect frame fill; contain = full photo visible */
  fit?: "cover" | "contain";
  intervalMs?: number;
  className?: string;
};

/**
 * Scrolling hero media. Default fit is cover so images fill the hero frame.
 */
export function HeroImageScroll({
  images,
  variant = "bleed",
  fit = "cover",
  intervalMs = 4500,
  className = "",
}: HeroImageScrollProps) {
  const safe = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (safe.length < 2) return;
    const id = window.setInterval(() => {
      if (pauseRef.current) return;
      setIndex((current) => (current + 1) % safe.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [safe.length, intervalMs]);

  useEffect(() => {
    if (variant !== "panel" || !trackRef.current) return;
    const child = trackRef.current.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, variant]);

  if (safe.length === 0) return null;

  const fitClass = fit === "contain" ? "is-contain" : "is-cover";

  if (variant === "panel") {
    return (
      <div
        className={`hero-scroll-panel ${fitClass} ${className}`.trim()}
        onMouseEnter={() => {
          pauseRef.current = true;
        }}
        onMouseLeave={() => {
          pauseRef.current = false;
        }}
        onFocusCapture={() => {
          pauseRef.current = true;
        }}
        onBlurCapture={() => {
          pauseRef.current = false;
        }}
      >
        <div
          ref={trackRef}
          className="hero-scroll-panel-track"
          tabIndex={0}
          aria-label="Installation photo gallery"
        >
          {safe.map((image, i) => (
            <figure key={image.src} className="hero-scroll-panel-slide">
              <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={900}
                priority={i === 0}
                sizes="(max-width: 1024px) 90vw, 520px"
                className="hero-scroll-panel-img"
              />
            </figure>
          ))}
        </div>
        <div className="hero-scroll-dots" role="tablist" aria-label="Choose photo">
          {safe.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}`}
              className={i === index ? "is-active" : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`hero-scroll-bleed ${fitClass} ${className}`.trim()}
      aria-hidden
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
    >
      {safe.map((image, i) => (
        <div
          key={image.src}
          className={`hero-scroll-bleed-slide${i === index ? " is-active" : ""}`}
        >
          <Image
            src={image.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="hero-scroll-bleed-img"
          />
        </div>
      ))}
      <div className="home-hero-scrim" />
      <div className="hero-scroll-dots hero-scroll-dots--bleed" role="presentation">
        {safe.map((image, i) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            className={i === index ? "is-active" : undefined}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
