'use client';

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 15,
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 6,
  fontSize: 14,
};

export default function FlooringFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [scope, setScope] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const data = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      scope: String(scope).trim(),
    };

    if (!data.name || !data.email || !data.phone || !data.address || !data.scope) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, email: data.email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof body?.error === "string" ? body.error : "Submission failed."
        );
      }
      setStatus("success");
      setMessage("Thank you! Your flooring request has been received.");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setScope("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5f9",
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 12,
          padding: 28,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: "0 0 6px", fontSize: 24 }}>
          Flooring Services — Request a Quote
        </h1>
        <p style={{ margin: "0 0 20px", color: "#475569", fontSize: 14 }}>
          Share your contact details and project scope. Standard services:
          installation, refinishing, repair, and consultation.
        </p>
        <form onSubmit={handleSubmit} noValidate={false}>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="name" style={labelStyle}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="phone" style={labelStyle}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={40}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="address" style={labelStyle}>
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              maxLength={220}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State ZIP"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="scope" style={labelStyle}>
              Project Scope
            </label>
            <textarea
              id="scope"
              name="scope"
              required
              rows={5}
              maxLength={2000}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. Refinish 800 sq ft hardwood in living room and hallway…"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: status === "sending" ? "#94a3b8" : "#0f172a",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: status === "sending" ? "wait" : "pointer",
            }}
          >
            {status === "sending" ? "Sending…" : "Submit Request"}
          </button>
        </form>
        {message && (
          <p
            role={status === "error" ? "alert" : "status"}
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 14,
              background: status === "error" ? "#fef2f2" : "#f0fdf4",
              color: status === "error" ? "#b91c1c" : "#15803d",
              border:
                status === "error"
                  ? "1px solid #fecaca"
                  : "1px solid #bbf7d0",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
