import DemoCropper from "./DemoCropper";

export default function Hero() {
  return (
    <section id="try" className="px-6 pb-20 pt-36 text-center">
      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
        Upload once. Get it sized for{" "}
        <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          every platform.
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
        Stop re-cropping the same photo for Instagram, Reels, YouTube and X. Pixora also shrinks your videos without
        visible quality loss.
      </p>
      <DemoCropper />
      <p className="mt-6 text-sm text-zinc-400">No credit card. Free plan included.</p>
    </section>
  );
}
