import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATE_SLUG } from "@/config/geo";
import {
  canonicalCitySlug,
  isAreaMoneyLanding,
  parentServiceSlug,
} from "@/lib/routing/location-silo";
import AreaServicePage, {
  generateMetadata as generateAreaServiceMetadata,
} from "../../../../../[locationSlug]/[slug]/[serviceSlug]/page";
import AreaMoneyLandingPage, {
  generateMetadata as generateLandingMetadata,
} from "../../../../../landings/area/[serviceSlug]/[stateSlug]/[citySlug]/[areaSlug]/page";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{
    citySlug: string;
    areaSlug: string;
    serviceSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug, areaSlug, serviceSlug } = await params;
  const city = canonicalCitySlug(citySlug);
  const service = parentServiceSlug(serviceSlug);
  if (!city || !service) return {};
  if (isAreaMoneyLanding(service, city, areaSlug)) {
    return generateLandingMetadata({
      params: Promise.resolve({
        serviceSlug: service,
        stateSlug: STATE_SLUG,
        citySlug: city,
        areaSlug,
      }),
    });
  }
  return generateAreaServiceMetadata({
    params: Promise.resolve({
      locationSlug: city,
      slug: areaSlug,
      serviceSlug: service,
    }),
  });
}

export default async function SiloAreaServicePage({ params }: PageProps) {
  const { citySlug, areaSlug, serviceSlug } = await params;
  const city = canonicalCitySlug(citySlug);
  const service = parentServiceSlug(serviceSlug);
  if (!city || !service) notFound();
  if (isAreaMoneyLanding(service, city, areaSlug)) {
    return AreaMoneyLandingPage({
      params: Promise.resolve({
        serviceSlug: service,
        stateSlug: STATE_SLUG,
        citySlug: city,
        areaSlug,
      }),
    });
  }
  return AreaServicePage({
    params: Promise.resolve({
      locationSlug: city,
      slug: areaSlug,
      serviceSlug: service,
    }),
  });
}
