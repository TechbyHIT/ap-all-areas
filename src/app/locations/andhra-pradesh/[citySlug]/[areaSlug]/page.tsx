import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  canonicalCitySlug,
  locationServiceSlug,
  siloCityServicePath,
} from "@/lib/routing/location-silo";
import CityServicePage, {
  generateMetadata as generateCityServiceMetadata,
} from "../../../../[locationSlug]/[slug]/page";
import AreaDetailPage, {
  generateMetadata as generateAreaMetadata,
} from "../../../[locationSlug]/[areaSlug]/page";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ citySlug: string; areaSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug, areaSlug } = await params;
  const city = canonicalCitySlug(citySlug);
  if (!city) return {};
  const service = locationServiceSlug(areaSlug);
  if (service) {
    return generateCityServiceMetadata({
      params: Promise.resolve({ locationSlug: city, slug: service }),
    });
  }
  return generateAreaMetadata({
    params: Promise.resolve({ locationSlug: city, areaSlug }),
  });
}

export default async function SiloCityChildPage({ params }: PageProps) {
  const { citySlug, areaSlug } = await params;
  const city = canonicalCitySlug(citySlug);
  if (!city) notFound();
  const service = locationServiceSlug(areaSlug);
  if (service) {
    if (service !== areaSlug) {
      redirect(siloCityServicePath(city, service));
    }
    return CityServicePage({
      params: Promise.resolve({ locationSlug: city, slug: service }),
    });
  }
  return AreaDetailPage({
    params: Promise.resolve({ locationSlug: city, areaSlug }),
  });
}
