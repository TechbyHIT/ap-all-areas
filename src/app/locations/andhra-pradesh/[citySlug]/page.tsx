import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SILO_CITY_SLUGS } from "@/config/geo";
import { canonicalCitySlug } from "@/lib/routing/location-silo";
import LocationDetailPage, {
  generateMetadata as generateCityMetadata,
} from "../../[locationSlug]/page";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ citySlug: string }>;
};

export function generateStaticParams() {
  return SILO_CITY_SLUGS.map((citySlug) => ({ citySlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = canonicalCitySlug(citySlug);
  if (!city) return {};
  return generateCityMetadata({
    params: Promise.resolve({ locationSlug: city }),
  });
}

export default async function SiloCityPage({ params }: PageProps) {
  const { citySlug } = await params;
  const city = canonicalCitySlug(citySlug);
  if (!city) notFound();
  return LocationDetailPage({
    params: Promise.resolve({ locationSlug: city }),
  });
}
