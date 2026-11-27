import { CheckIcon } from "./icons";
import { card, sectionTitle } from "./ui";

const PLATFORMS = ["Instagram", "Reels", "YouTube", "X"];

// Small schematic of each step. They show the idea without quoting any numbers.
function AddVisual() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5">
      <span className="h-8 w-8 shrink-0 rounded-md bg-accent-100" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="h-2 w-3/4 rounded-full bg-line" />
        <div className="h-2 w-1/3 rounded-full bg-line" />
      </div>
      <CheckIcon className="h-4 w-4 text-good" />
    </div>
  );
}

function PickVisual() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PLATFORMS.map((p, i) => (
        <span
          key={p}
          className={`rounded-md border px-2 py-1 text-xs font-medium ${
            i === 1 ? "border-accent bg-accent-50 text-accent-strong" : "border-line bg-surface text-ink-2"
          }`}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

function DownloadVisual() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs text-muted">Original</span>
        <div className="h-2 flex-1 rounded-full bg-ink/20" />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs text-muted">Pixora</span>
        <div className="h-2 flex-1 rounded-full bg-line">
          <div className="h-2 w-2/5 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}

const steps = [
  { n: "1", title: "Add your photo or video", text: "Images up to 10 MB and videos up to 40 MB on the free plan.", visual: <AddVisual /> },
  { n: "2", title: "Pick the platform", text: "Instagram, Reels and Stories, YouTube, X and more, cropped around your subject.", visual: <PickVisual /> },
  { n: "3", title: "Download and post", text: "Get the exact size each platform wants, or grab every size in one zip. Videos come out smaller, with the saving shown.", visual: <DownloadVisual /> },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <h2 className={`text-center ${sectionTitle}`}>How it works</h2>
      <div className={`${card} mx-auto mt-12 grid max-w-5xl divide-y divide-line overflow-hidden md:grid-cols-3 md:divide-x md:divide-y-0`}>
        {steps.map((s) => (
          <div key={s.n} className="flex flex-col p-6">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-50 text-xs font-semibold text-accent-strong tabular-nums">
              {s.n}
            </span>
            <h3 className="mt-4 text-base font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-1.5 text-sm text-ink-2">{s.text}</p>
            <div aria-hidden className="mt-6 flex min-h-24 flex-1 flex-col justify-end rounded-xl bg-canvas p-3">
              {s.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
