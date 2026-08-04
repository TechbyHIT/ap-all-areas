import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";

export type BenefitCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export function BenefitCard({
  title,
  description,
  icon,
  className = "",
}: BenefitCardProps) {
  return (
    <Card as="article" className={`flex h-full flex-col ${className}`.trim()}>
      {icon ? (
        <IconBox size="md" tone="brand" className="mb-4">
          {icon}
        </IconBox>
      ) : null}
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
    </Card>
  );
}
