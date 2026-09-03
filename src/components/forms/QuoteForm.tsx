"use client";

import { useState } from "react";
import {
  buildWhatsAppEnquiryMessage,
  openWhatsAppEnquiry,
} from "@/config/business";
import { INITIAL_SERVICES } from "@/data/initial-services";
import { AP_DISTRICTS } from "@/data/initial-locations";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { buildConversionEvent, trackConversion } from "@/lib/seo/conversion-tracking";

const PROPERTY_TYPES = [
  "Apartment / Flat",
  "Independent House",
  "Villa",
  "School / Institution",
  "Commercial",
  "Other",
] as const;

type QuoteFormProps = {
  title?: string;
  defaultService?: string;
  defaultCity?: string;
  defaultLocality?: string;
  defaultPropertyType?: string;
  defaultRequirement?: string;
  className?: string;
  embedded?: boolean;
};

export function QuoteForm({
  title = "Request a Quotation",
  defaultService,
  defaultCity,
  defaultLocality,
  defaultPropertyType,
  defaultRequirement,
  className = "",
  embedded = false,
}: QuoteFormProps) {
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
    const serviceSlug = String(data.get("service") ?? "");
    const serviceName =
      INITIAL_SERVICES.find((service) => service.slug === serviceSlug)?.name ??
      serviceSlug;

    const message = buildWhatsAppEnquiryMessage({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      service: serviceName,
      city: String(data.get("city") ?? ""),
      area: String(data.get("area") ?? ""),
      district: String(data.get("district") ?? ""),
      propertyType: String(data.get("propertyType") ?? ""),
      message: [
        String(data.get("requirement") ?? ""),
        String(data.get("message") ?? ""),
        data.get("email") ? `Email: ${String(data.get("email"))}` : "",
        data.get("photoNote")
          ? `Photo note: ${String(data.get("photoNote"))}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    const opened = openWhatsAppEnquiry(message);
    if (opened) {
      trackConversion(
        buildConversionEvent({
          conversionType: "form_submit",
          dimensions: {
            pageType: "quote-form",
            service: serviceSlug || null,
            city: String(data.get("city") ?? "") || null,
            locality: String(data.get("area") ?? "") || null,
          },
        }),
      );
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  const form = (
    <>
      <Heading as="h2">{title}</Heading>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600">
        Submit to open WhatsApp with your details pre-filled for a faster photo
        estimate.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2"
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <label className="grid gap-1 sm:col-span-1">
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
          <span className="text-sm font-medium">WhatsApp</span>
          <input
            name="whatsapp"
            type="tel"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Service</span>
          <select
            name="service"
            defaultValue={defaultService ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="">Select a service</option>
            {INITIAL_SERVICES.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">District</span>
          <select
            name="district"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="">Select district (optional)</option>
            {AP_DISTRICTS.map((district) => (
              <option key={district.slug} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">City</span>
          <input
            name="city"
            defaultValue={defaultCity}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Area / Locality</span>
          <input
            name="area"
            defaultValue={defaultLocality}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Property Type</span>
          <select
            name="propertyType"
            defaultValue={defaultPropertyType ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="">Select property type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Requirement</span>
          <input
            name="requirement"
            defaultValue={defaultRequirement}
            className="rounded-lg border border-zinc-300 px-3 py-2"
            placeholder="e.g. balcony child safety, pigeon entry, cricket nets…"
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Photo note</span>
          <input
            name="photoNote"
            className="rounded-lg border border-zinc-300 px-3 py-2"
            placeholder="Describe photos you will send on WhatsApp (openings, access)"
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-sm font-medium">Message</span>
          <textarea
            name="message"
            rows={4}
            className="rounded-lg border border-zinc-300 px-3 py-2"
            placeholder="Floor level, society rules, preferred visit time…"
          />
        </label>

        <label className="flex items-start gap-2 text-sm sm:col-span-2">
          <input name="consent" type="checkbox" required className="mt-1" />
          <span>I agree to be contacted on WhatsApp regarding my enquiry.</span>
        </label>

        <div className="sm:col-span-2">
          <Button
            type="submit"
            variant="whatsapp"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Opening WhatsApp..." : "Send on WhatsApp"}
          </Button>
          {status === "success" ? (
            <p className="mt-3 text-[var(--primary-700)]">
              WhatsApp opened with your enquiry. Send the message to continue.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="mt-3 text-red-600">
              Could not open WhatsApp. Please try again or call us directly.
            </p>
          ) : null}
        </div>
      </form>
    </>
  );

  if (embedded) {
    return <div className={className}>{form}</div>;
  }

  return (
    <Section className={className}>
      <Container>{form}</Container>
    </Section>
  );
}
