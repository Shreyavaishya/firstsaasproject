import DemoCropper from "./DemoCropper";

export default function Hero() {
  return (
    <section id="try" className="px-6 pb-20 pt-32 text-center sm:pt-40">
      <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
        Upload once. Get it sized for <span className="text-accent">every platform.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-2">
        Stop re-cropping the same photo for Instagram, Reels, YouTube and X. Pixora also shrinks your videos without
        visible quality loss.
      </p>
      <DemoCropper />
      <p className="mt-6 text-sm text-muted">No credit card. Free plan included.</p>
    </section>
  );
}
