import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = { title: "Terms of Service · Pixora" };

export default function Terms() {
  return (
    <main className="min-h-screen bg-canvas text-ink-2 [color-scheme:light]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-accent-strong hover:underline">← Back to Pixora</Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: November 26, 2026</p>
        <div className="mt-8 space-y-6 rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed sm:p-8">
          <section><h2 className="font-semibold text-ink">Using Pixora</h2>
            <p>Pixora lets you resize and optimize images and videos. You need an account, and you are responsible for activity on it.</p></section>
          <section><h2 className="font-semibold text-ink">Your content</h2>
            <p>You keep ownership of what you upload. You confirm you have the right to use it, and that it is not illegal or harmful. We may remove content that breaks these terms.</p></section>
          <section><h2 className="font-semibold text-ink">Free plan limits</h2>
            <p>The free plan has limits on file size, monthly exports and storage. We may change limits and will try to give notice of significant changes.</p></section>
          <section><h2 className="font-semibold text-ink">No guarantees</h2>
            <p>Pixora is provided as is. We work to keep it reliable, but we cannot promise it will always be available or error free, so keep copies of your original files.</p></section>
          <section><h2 className="font-semibold text-ink">Contact</h2>
            <p>Questions: <a className="text-accent-strong hover:underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p></section>
        </div>
      </div>
    </main>
  );
}
