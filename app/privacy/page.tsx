import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy Policy · Pixora" };

export default function Privacy() {
  return (
    <main className="min-h-screen bg-canvas text-ink-2 [color-scheme:light]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-accent-strong hover:underline">← Back to Pixora</Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: November 26, 2026</p>
        <div className="mt-8 space-y-6 rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed sm:p-8">
          <section><h2 className="font-semibold text-ink">What we collect</h2>
            <p>Your account details (name and email, handled by our sign-in provider), the images and videos you upload, and basic usage counts such as how many exports you made this month.</p></section>
          <section><h2 className="font-semibold text-ink">How we use it</h2>
            <p>Only to run Pixora: to show your library, process your files, and apply plan limits. We do not sell your data or use your files for anything else.</p></section>
          <section><h2 className="font-semibold text-ink">Who handles your data</h2>
            <p>Clerk (sign-in), Cloudinary (file storage and processing), Neon (database) and Vercel (hosting). They process data on our behalf.</p></section>
          <section><h2 className="font-semibold text-ink">The homepage demo</h2>
            <p>The demo on the homepage runs in your browser. Photos you try there are not uploaded.</p></section>
          <section><h2 className="font-semibold text-ink">Deleting your data</h2>
            <p>You can delete any file from your library at any time. To delete your account and data, email us at <a className="text-accent-strong hover:underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p></section>
        </div>
      </div>
    </main>
  );
}
