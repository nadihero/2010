import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asdarium D. — Full-Stack Web Developer",
  description:
    "Full-Stack Web Developer portfolio. Building scalable web applications, RESTful APIs, and production-ready systems.",
  icons: {
    icon: "/asdar.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-serif text-ink antialiased">{children}</body>
    </html>
  );
}