import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zervan.studio"),
  title: {
    default: "زروان | سرامیک و کاشی دست‌ساز لوکس",
    template: "%s | زروان",
  },
  description:
    "زروان — کاشی و سطوح سرامیکی دست‌ساز، الهام‌گرفته از خدای زمان بی‌کران. هر قطعه از یک لحظه‌ی منحصربه‌فرد زاده می‌شود.",
  openGraph: {
    title: "زروان | سرامیک و کاشی دست‌ساز لوکس",
    description:
      "جایی که لحظه‌ها به سنگ و آتش بدل می‌شوند. سرامیک و کاشی دست‌ساز سفارشی.",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
