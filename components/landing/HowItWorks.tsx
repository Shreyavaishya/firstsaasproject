const steps = [
  { n: "1", title: "Add your photo or video", text: "Images up to 10 MB and videos up to 40 MB on the free plan." },
  { n: "2", title: "Pick the platform", text: "Instagram, Reels and Stories, YouTube, X and more, cropped around your subject." },
  { n: "3", title: "Download and post", text: "Get the exact size each platform wants, or grab every size in one zip. Videos come out smaller, with the saving shown." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">How it works</h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 font-bold text-purple-300">{s.n}</div>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
