import { Card } from "@/components/ui/Card";

export type ProcessCardProps = {
  step: number;
  title: string;
  description: string;
  className?: string;
};

export function ProcessCard({
  step,
  title,
  description,
  className = "",
}: ProcessCardProps) {
  return (
    <Card as="article" className={`flex h-full gap-4 ${className}`.trim()}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-700)] text-sm font-bold text-white shadow-sm">
        {step}
      </span>
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      </div>
    </Card>
  );
}
