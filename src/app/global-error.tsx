"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body className="flex min-h-screen items-center justify-center bg-white px-4 text-zinc-900">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold">Application Error</h1>
          <p className="mt-4 text-zinc-600">
            A critical error occurred. Please refresh the page or return to the
            homepage.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 overflow-auto rounded bg-zinc-100 p-3 text-left text-xs">
              {error.message}
            </pre>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
            <Link
              href={ROUTES.home}
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
