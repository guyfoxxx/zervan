"use client";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "98XXXXXXXXXX"; // بدون + و صفر ابتدایی
const TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "YourUsername";

export function buildWhatsAppUrl(message: string) {
  const encoded = encodeURIComponent(message);
  const isMobile =
    typeof navigator !== "undefined" &&
    /android|iphone|ipad|mobile/i.test(navigator.userAgent);
  return isMobile
    ? `whatsapp://send?phone=${PHONE}&text=${encoded}`
    : `https://wa.me/${PHONE}?text=${encoded}`;
}

export function buildTelegramUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encoded}`;
}

export default function ProjectContactLinks({
  projectTitle,
}: {
  projectTitle: string;
}) {
  const message = `سلام، من از سایت زروان روی پروژهٔ ${projectTitle} هستم. می‌خواستم مشاوره بگیرم.`;

  return (
    <div className="flex gap-3">
      <a
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-emerald-700/50 bg-emerald-900/30 px-5 py-2 text-sm text-emerald-300 hover:bg-emerald-900/50 transition-colors"
      >
        استعلام در واتساپ
      </a>
      <a
        href={buildTelegramUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-sky-700/50 bg-sky-900/30 px-5 py-2 text-sm text-sky-300 hover:bg-sky-900/50 transition-colors"
      >
        استعلام در تلگرام
      </a>
    </div>
  );
}
