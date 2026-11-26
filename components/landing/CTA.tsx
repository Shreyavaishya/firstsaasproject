import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">Stop resizing by hand.</h2>
      <p className="mt-3 text-zinc-400">Create a free account and export your first photo in a minute.</p>
      <Link href="/sign-up" className="mt-8 inline-block rounded-full bg-linear-to-r from-purple-500 to-cyan-500 px-8 py-3 font-semibold">
        Try it free
      </Link>
    </section>
  );
}
