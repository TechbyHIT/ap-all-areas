import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  whatsapp: z.string().max(15).optional(),
  service: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  propertyType: z.string().optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal("on"),
});

function optionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const website = formData.get("website");
  if (website) {
    return NextResponse.json({ success: true });
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    whatsapp: optionalString(formData.get("whatsapp")),
    service: optionalString(formData.get("service")),
    district: optionalString(formData.get("district")),
    city: optionalString(formData.get("city")),
    area: optionalString(formData.get("area")),
    propertyType: optionalString(formData.get("propertyType")),
    message: optionalString(formData.get("message")),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // In production: send email/notification when phone is verified
  console.log("Contact submission:", parsed.data);

  return NextResponse.json({ success: true });
}
