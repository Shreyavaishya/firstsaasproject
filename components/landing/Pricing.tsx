import Link from "next/link";
import { SITE } from "@/lib/site";

// Keep these numbers in sync with lib/limits.ts
const free = [
  "10 exports per month",
  "Images up to 10 MB",
  "Videos up to 40 MB",
  "300 MB of storage",
  "Saved library with delete and rename",
];
const pro = [
  "Higher monthly exports",
  "Larger files and more storage",
  "All sizes in one download",
  "More features based on your feedback",
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">Pricing</h2>
      <p className="mt-3 text-center text-zinc-400">Start free. Paid plans are coming.</p>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-purple-400/40 bg-white/5 p-8">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-2 text-4xl font-extrabold">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-300">
            {free.map((i) => <li key={i}>✓ {i}</li>)}
          </ul>
          <Link href="/sign-up" className="mt-8 block rounded-full bg-linear-to-r from-purple-500 to-cyan-500 py-2 text-center text-sm font-semibold">
            Get started free
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-semibold">Pro <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-normal">Coming soon</span></h3>
          <p className="mt-2 text-4xl font-extrabold text-zinc-500">TBA</p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-300">
            {pro.map((i) => <li key={i}>• {i}</li>)}
          </ul>
          <a
            href={`mailto:${SITE.contactEmail}?subject=Pixora%20Pro%20waitlist`}
            className="mt-8 block rounded-full border border-white/20 py-2 text-center text-sm hover:bg-white/10"
          >
            Join the Pro waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
