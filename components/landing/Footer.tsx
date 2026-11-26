import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-zinc-400 md:flex-row">
        <p>© 2026 {SITE.name}</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <a href={`mailto:${SITE.contactEmail}`} className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
