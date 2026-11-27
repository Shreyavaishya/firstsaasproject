import Link from "next/link";
import { btnPrimaryLg, card, sectionTitle } from "./ui";

export default function CTA() {
  return (
    <section className="px-6 py-20">
      <div className={`${card} mx-auto max-w-5xl px-6 py-14 text-center`}>
        <h2 className={`mx-auto max-w-2xl ${sectionTitle}`}>Stop resizing by hand.</h2>
        <p className="mt-3 text-ink-2">Create a free account and export your first photo in a minute.</p>
        <Link href="/sign-up" className={`${btnPrimaryLg} mt-8`}>
          Try it free
        </Link>
      </div>
    </section>
  );
}
