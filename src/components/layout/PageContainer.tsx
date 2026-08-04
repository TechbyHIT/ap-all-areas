import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Consistent page content wrapper with brand max-width. */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <Container className={className}>{children}</Container>;
}
