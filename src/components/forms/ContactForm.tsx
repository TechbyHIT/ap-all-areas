"use client";

import { useState } from "react";
import {
  buildWhatsAppEnquiryMessage,
  openWhatsAppEnquiry,
} from "@/config/business";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

const SERVICE_LABELS: Record<string, string> = {
  "invisible-grills": "Invisible Grills",
  "safety-nets": "Safety Nets",
  "sports-nets": "Sports Nets",
  "cloth-drying-hangers": "Cloth Drying Hangers",
};

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)
      ?.value;
    if (honeypot) {
      setStatus("success");
      return;
    }

    const data = new FormData(form);
    const serviceValue = String(data.get("service") ?? "");
    const message = buildWhatsAppEnquiryMessage({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: SERVICE_LABELS[serviceValue] ?? serviceValue,
      city: String(data.get("city") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    const opened = openWhatsAppEnquiry(message);
    if (opened) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <Section>
      <Container>
        <Heading as="h2">Request a Quotation</Heading>
        <p className="mt-2 max-w-xl text-sm text-zinc-600">
          Submit to open WhatsApp with your enquiry pre-filled. We reply on
          WhatsApp for faster photo-based estimates.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid max-w-xl gap-4">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <label className="grid gap-1">
            <span className="text-sm font-medium">Name *</span>
            <input
              name="name"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Phone *</span>
            <input
              name="phone"
              type="tel"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Service</span>
            <select
              name="service"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="invisible-grills">Invisible Grills</option>
              <option value="safety-nets">Safety Nets</option>
              <option value="sports-nets">Sports Nets</option>
              <option value="cloth-drying-hangers">Cloth Drying Hangers</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">City</span>
            <input
              name="city"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Message</span>
            <textarea
              name="message"
              rows={4}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input name="consent" type="checkbox" required className="mt-1" />
            <span>I agree to be contacted on WhatsApp regarding my enquiry.</span>
          </label>
          <Button type="submit" variant="whatsapp" disabled={status === "loading"}>
            {status === "loading" ? "Opening WhatsApp..." : "Send on WhatsApp"}
          </Button>
          {status === "success" ? (
            <p className="text-[var(--primary-700)]">
              WhatsApp opened with your enquiry. Send the message to continue.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-red-600">
              Could not open WhatsApp. Please try again or call us directly.
            </p>
          ) : null}
        </form>
      </Container>
    </Section>
  );
}
