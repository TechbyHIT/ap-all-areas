"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HOME_ROTATION_PHOTOS } from "@/config/installation-photos";
import { ROUTES } from "@/config/routes";

/**
 * Homepage full photo rotation — cycles every installation image (not only
 * the hero subset).
 */
export function HomePhotoRotation() {
  const photos = HOME_ROTATION_PHOTOS;
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = window.setInterval(() => {
      if (pauseRef.current) return;
      setIndex((current) => (current + 1) % photos.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [photos.length]);

  const active = photos[index] ?? photos[0];
  if (!active) return null;

  return (
    <section
      className="home-section home-section--soft home-photo-rotation"
      aria-labelledby="home-photo-rotation-heading"
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
    >
      <div className="home-container">
        <header className="home-section-head home-section-head--center">
          <p className="home-eyebrow">Real installations</p>
          <h2 id="home-photo-rotation-heading" className="home-h2">
            Every project photo in rotation
          </h2>
          <p className="home-lead">
            All {photos.length} recent installation photos — nets, invisible
            grills, sports cages and cloth hangers across Andhra Pradesh.
          </p>
        </header>

        <div className="home-photo-rotation-stage">
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 900px) 100vw, 1100px"
            className="home-photo-rotation-img"
            priority={index === 0}
          />
          <div className="home-photo-rotation-caption">
            <strong>{active.alt}</strong>
            <span>
              {index + 1} / {photos.length}
            </span>
          </div>
        </div>

        <div
          className="home-photo-rotation-thumbs"
          role="tablist"
          aria-label="Installation photos"
        >
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}: ${photo.alt}`}
              className={i === index ? "is-active" : undefined}
              onClick={() => setIndex(i)}
            >
              <Image
                src={photo.src}
                alt=""
                width={96}
                height={72}
                loading="lazy"
                sizes="96px"
              />
            </button>
          ))}
        </div>

        <div className="home-cta-row">
          <Link href={ROUTES.gallery} className="home-btn home-btn--outline">
            Open full gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
