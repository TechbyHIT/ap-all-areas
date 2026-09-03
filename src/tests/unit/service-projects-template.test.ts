import { describe, expect, it } from "vitest";
import { getServiceAdvancedSections } from "@/data/service-advanced-sections";
import {
  listPublishedProjects,
  PROJECT_CASES,
} from "@/data/projects";
import { INSTALLATION_PHOTOS } from "@/config/installation-photos";

describe("service advanced sections (§13)", () => {
  it("covers all four core services", () => {
    for (const slug of [
      "invisible-grills",
      "safety-nets",
      "sports-nets",
      "cloth-drying-hangers",
    ]) {
      const sections = getServiceAdvancedSections(slug);
      expect(sections).toBeTruthy();
      expect(sections!.whoNeeds.length).toBeGreaterThan(0);
      expect(sections!.limitations.length).toBeGreaterThan(0);
      expect(sections!.whenAnotherServiceBetter.length).toBeGreaterThan(0);
    }
  });
});

describe("project cases (§22)", () => {
  it("creates one published record per installation photo", () => {
    expect(PROJECT_CASES.length).toBe(INSTALLATION_PHOTOS.length);
    expect(listPublishedProjects().length).toBe(INSTALLATION_PHOTOS.length);
  });

  it("does not invent city or review fields", () => {
    for (const project of PROJECT_CASES) {
      expect(project.city).toBeNull();
      expect(project.review).toBeNull();
      expect(project.status).toBe("published");
      expect(project.images[0]?.src.startsWith("/images/")).toBe(true);
    }
  });
});
