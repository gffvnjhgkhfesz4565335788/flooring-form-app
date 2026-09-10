import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flooring Services — Request a Quote",
  description: "Capture name, email, phone number, address and project scope for flooring services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
