import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
        <p>© 2026 {SITE.name}</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="transition-colors hover:text-ink">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-ink">Terms</Link>
          <a href={`mailto:${SITE.contactEmail}`} className="transition-colors hover:text-ink">Contact</a>
        </div>
      </div>
    </footer>
  );
}
