/**
 * Organic SEO page decision engine.
 * Prefer fewer useful URLs over city-name-swap doorways.
 */

import { STATE_SLUG } from "@/config/geo";
import {
  getArea,
  getCity,
  getService,
  getState,
  isServiceAvailableInArea,
  isServiceAvailableInCity,
} from "@/lib/data/location-catalog";
import { parentServiceSlug } from "@/lib/routing/location-silo";

export type SeoPageKind =
  | "state"
  | "city"
  | "area"
  | "service"
  | "city-service"
  | "area-service";

export type PageDecision = {
  generate: boolean;
  index: boolean;
  reason: string;
};

export type PageDecisionInput = {
  kind: SeoPageKind;
  stateSlug?: string;
  citySlug?: string;
  areaSlug?: string;
  serviceSlug?: string;
};

function deny(reason: string): PageDecision {
  return { generate: false, index: false, reason };
}

function serve(index: boolean, reason: string): PageDecision {
  return { generate: true, index, reason };
}

export function shouldGeneratePage(input: PageDecisionInput): PageDecision {
  const stateSlug = input.stateSlug ?? STATE_SLUG;

  if (input.kind === "state") {
    const state = getState(stateSlug);
    if (!state) return deny("unknown-or-disabled-state");
    return serve(true, "enabled-state-hub");
  }

  if (input.kind === "service") {
    const service = getService(input.serviceSlug ?? "");
    if (!service) return deny("unknown-or-disabled-service");
    return serve(true, "enabled-service-hub");
  }

  if (input.kind === "city") {
    const city = getCity(stateSlug, input.citySlug ?? "");
    if (!city) return deny("city-not-in-served-catalog");
    return serve(true, "enabled-city-hub");
  }

  if (input.kind === "area") {
    const area = getArea(stateSlug, input.citySlug ?? "", input.areaSlug ?? "");
    if (!area) return deny("area-not-in-served-catalog");
    return serve(true, "enabled-area-hub");
  }

  if (input.kind === "city-service") {
    const city = getCity(stateSlug, input.citySlug ?? "");
    if (!city) return deny("city-not-in-served-catalog");
    if (!isServiceAvailableInCity(stateSlug, city.slug, input.serviceSlug ?? "")) {
      return deny("service-not-available-in-city");
    }
    const core = parentServiceSlug(input.serviceSlug ?? "");
    if (core && core !== input.serviceSlug) {
      return deny("sub-service-belongs-on-core-city-service");
    }
    return serve(true, "enabled-city-service");
  }

  if (input.kind === "area-service") {
    const area = getArea(stateSlug, input.citySlug ?? "", input.areaSlug ?? "");
    if (!area) return deny("area-not-in-served-catalog");
    if (
      !isServiceAvailableInArea(
        stateSlug,
        area.citySlug,
        area.slug,
        input.serviceSlug ?? "",
      )
    ) {
      return deny("service-not-available-in-area");
    }
    const core = parentServiceSlug(input.serviceSlug ?? "");
    if (core && core !== input.serviceSlug) {
      return deny("sub-service-belongs-on-core-area-service");
    }
    return serve(true, "enabled-area-service");
  }

  return deny("unknown-page-kind");
}

export function shouldIndexPage(input: PageDecisionInput): boolean {
  return shouldGeneratePage(input).index;
}
