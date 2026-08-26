import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalCitySlug, parentServiceSlug } from "@/lib/routing/location-silo";
import CityServicePage, {
  generateMetadata as generateCityServiceMetadata,
} from "../../../../[locationSlug]/[slug]/page";
import AreaDetailPage, {
  generateMetadata as generateAreaMetadata,
} from "../../../[locationSlug]/[areaSlug]/page";

export const dynamicParams = true;
export const revalidate = 86400;

type PageProps = {
  params: Promise<{ citySlug: string; childSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug, childSlug } = await params;
  const city = canonicalCitySlug(citySlug);
  if (!city) return {};
  const service = parentServiceSlug(childSlug);
  if (service) {
    return generateCityServiceMetadata({
      params: Promise.resolve({ locationSlug: city, slug: service }),
    });
  }
  return generateAreaMetadata({
    params: Promise.resolve({ locationSlug: city, areaSlug: childSlug }),
  });
}

export default async function SiloCityChildPage({ params }: PageProps) {
  const { citySlug, childSlug } = await params;
  const city = canonicalCitySlug(citySlug);
  if (!city) notFound();
  const service = parentServiceSlug(childSlug);
  if (service) {
    return CityServicePage({
      params: Promise.resolve({ locationSlug: city, slug: service }),
    });
  }
  return AreaDetailPage({
    params: Promise.resolve({ locationSlug: city, areaSlug: childSlug }),
  });
}
