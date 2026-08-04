import { Card } from "@/components/ui/Card";

export type FeatureCardProps = {
  title: string;
  description: string;
  className?: string;
};

export function FeatureCard({
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <Card as="article" className={`flex h-full flex-col ${className}`.trim()}>
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
    </Card>
  );
}
