"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { GALLERY_PROJECTS } from "@/config/design";
import { ROUTES } from "@/config/routes";
import { HOME_GALLERY_FILTERS } from "@/data/home-page";

function categoryFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("window")) return "Windows";
  if (t.includes("stair")) return "Staircases";
  if (t.includes("cricket") || t.includes("sport")) return "Sports Areas";
  if (t.includes("apartment") || t.includes("coastal") || t.includes("premium"))
    return "Apartments";
  if (t.includes("net") || t.includes("pet") || t.includes("children") || t.includes("duct"))
    return "Safety Nets";
  return "Balconies";
}

export function HomeGallery() {
  const [filter, setFilter] = useState<(typeof HOME_GALLERY_FILTERS)[number]>(
    "All",
  );

  const projects = useMemo(() => {
    const base = GALLERY_PROJECTS.slice(0, 8);
    if (filter === "All") return base;
    return base.filter((p) => categoryFor(p.title) === filter);
  }, [filter]);

  return (
    <section className="home-section home-section--white" id="projects">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Featured projects</p>
          <h2 className="home-h2">Recent Installation Gallery</h2>
          <p className="home-lead">
            Real project photographs across balconies, windows, ducts and
            practice areas—useful when comparing nets and invisible grills.
          </p>
        </header>

        <div className="home-gallery-filters" role="group" aria-label="Gallery filters">
          {HOME_GALLERY_FILTERS.map((item) => (
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
              key={project.image}
              href={project.href ?? ROUTES.gallery}
              className="home-gallery-item"
            >
              <Image
                src={project.image}
                alt={project.alt}
                width={800}
                height={600}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1050px) 50vw, 33vw"
              />
              <div className="home-gallery-meta">
                <strong>{project.title}</strong>
                <span>
                  {categoryFor(project.title)} · Andhra Pradesh installation
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
