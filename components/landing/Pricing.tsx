import Link from "next/link";
import { SITE } from "@/lib/site";
import { CheckIcon } from "./icons";
import { btnPrimary, btnSecondary, sectionTitle } from "./ui";

// Keep these numbers in sync with lib/limits.ts
const freeRows = [
  { label: "Exports per month", value: "10" },
  { label: "Image size", value: "Up to 10 MB" },
  { label: "Video size", value: "Up to 40 MB" },
  { label: "Storage", value: "300 MB" },
];
const freePerks = [
  "Saved library with delete and rename",
  "Download every size at once (.zip)",
];

const proRows = [
  { label: "Exports per month", value: "Higher" },
  { label: "File size", value: "Larger" },
  { label: "Storage", value: "More" },
];
const proPerks = ["More features based on your feedback"];

// Numbers sit in a right-aligned column so they scan top to bottom
function Rows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <ul className="mt-6 divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center justify-between py-2.5 text-sm">
          <span className="text-ink-2">{r.label}</span>
          <span className="font-medium tabular-nums">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20">
      <h2 className={`text-center ${sectionTitle}`}>Pricing</h2>
      <p className="mt-3 text-center text-ink-2">Start free. Paid plans are coming.</p>
      <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-accent/50 bg-surface p-7 ring-1 ring-accent/15">
          <h3 className="text-base font-semibold tracking-tight">Free</h3>
          <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums">$0</p>
          <Rows rows={freeRows} />
          <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink-2">
            {freePerks.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {i}
              </li>
            ))}
          </ul>
          <Link href="/sign-up" className={`${btnPrimary} mt-8 w-full`}>
            Get started free
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-line bg-surface p-7">
          <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            Pro
            <span className="rounded-md bg-accent-50 px-1.5 py-0.5 text-xs font-medium text-accent-strong">Coming soon</span>
          </h3>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-muted">TBA</p>
          <Rows rows={proRows} />
          <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink-2">
            {proPerks.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mx-1.5 mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                {i}
              </li>
            ))}
          </ul>
          <a href={`mailto:${SITE.contactEmail}?subject=Pixora%20Pro%20waitlist`} className={`${btnSecondary} mt-8 w-full`}>
            Join the Pro waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
