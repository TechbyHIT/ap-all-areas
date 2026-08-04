"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Something went wrong
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        We encountered an unexpected error. Please try again or contact us if the
        problem persists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try again
        </button>
        <Link
          href={ROUTES.home}
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
