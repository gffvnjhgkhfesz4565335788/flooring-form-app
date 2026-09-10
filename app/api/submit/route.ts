import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const FORM_TOKEN = process.env.FORM_TOKEN;
  const API_BASE_URL = process.env.API_BASE_URL;
  const FORM_ID = process.env.FORM_ID;

  if (!FORM_TOKEN) {
    return NextResponse.json(
      { error: "Server misconfigured: FORM_TOKEN is not set." },
      { status: 500 }
    );
  }
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "Server misconfigured: API_BASE_URL is not set." },
      { status: 500 }
    );
  }
  if (!FORM_ID) {
    return NextResponse.json(
      { error: "Server misconfigured: FORM_ID is not set." },
      { status: 500 }
    );
  }

  let payload: { data?: Record<string, unknown>; email?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawData =
    payload && typeof payload.data === "object" && payload.data !== null
      ? (payload.data as Record<string, unknown>)
      : {};

  const data: Record<string, string> = {
    name: String(rawData.name ?? "").trim(),
    email: String(rawData.email ?? "").trim(),
    phone: String(rawData.phone ?? "").trim(),
    address: String(rawData.address ?? "").trim(),
    scope: String(rawData.scope ?? "").trim(),
  };

  const email =
    typeof payload.email === "string" && payload.email.trim() !== ""
      ? String(payload.email).trim()
      : data.email || undefined;

  if (!data.name || !data.email || !data.phone || !data.address || !data.scope) {
    return NextResponse.json(
      { error: "Missing required fields: name, email, phone, address, scope." },
      { status: 400 }
    );
  }

  const upstreamUrl = `${String(API_BASE_URL).replace(/\/$/, "")}/api/public/forms/${String(FORM_ID)}/submit`;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: FORM_TOKEN, data, ...(email ? { email } : {}) }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach submission backend." },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  let upstreamBody: unknown = null;
  try {
    upstreamBody = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();
  } catch {
    upstreamBody = null;
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error:
          (typeof upstreamBody === "object" &&
            upstreamBody !== null &&
            "error" in upstreamBody &&
            String((upstreamBody as Record<string, unknown>).error)) ||
          (typeof upstreamBody === "string" && upstreamBody) ||
          "Submission backend rejected the request.",
        upstream: upstreamBody,
      },
      { status: upstream.status }
    );
  }

  return NextResponse.json(
    { ok: true, result: upstreamBody },
    { status: upstream.status }
  );
}
