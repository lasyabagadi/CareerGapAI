import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerGap AI",
  description: "Bridge the distance between where you are and the role you want."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
