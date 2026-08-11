"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";
import { ROUTES } from "@/config/routes";

const FILTERS = [
  "All",
  "Safety Nets",
  "Invisible Grills",
  "Sports Nets",
  "Cloth Hangers",
] as const;

function labelForService(service: string): string {
  switch (service) {
    case "invisible-grills":
      return "Invisible Grills";
    case "sports-nets":
      return "Sports Nets";
    case "cloth-drying-hangers":
      return "Cloth Hangers";
    default:
      return "Safety Nets";
  }
}

export function HomeGallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const projects = useMemo(() => {
    if (filter === "All") return [...INSTALLATION_PHOTOS];
    return INSTALLATION_PHOTOS.filter((p) => labelForService(p.service) === filter);
  }, [filter]);

  return (
    <section className="home-section home-section--white" id="projects">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Featured projects</p>
          <h2 className="home-h2">Recent Installation Gallery</h2>
          <p className="home-lead">
            All {INSTALLATION_PHOTOS.length} project photographs — balconies,
            invisible grills, sports nets and cloth hangers.
          </p>
        </header>

        <div className="home-gallery-filters" role="group" aria-label="Gallery filters">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="home-gallery-grid">
          {projects.map((project) => (
            <Link
              key={project.src}
              href={ROUTES.gallery}
              className="home-gallery-item"
            >
              <Image
                src={project.src}
                alt={project.alt}
                width={800}
                height={600}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1050px) 50vw, 33vw"
              />
              <div className="home-gallery-meta">
                <strong>{project.alt}</strong>
                <span>
                  {labelForService(project.service)} · Andhra Pradesh
                </span>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="home-note">No projects in this category yet. Try All.</p>
        ) : null}

        <div className="home-cta-row">
          <Link href={ROUTES.gallery} className="home-btn home-btn--outline">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
