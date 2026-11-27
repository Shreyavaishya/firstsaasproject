// A faint dot grid that fades out down the page: texture without clutter.
export default function Background() {
  const fade = "linear-gradient(to bottom, black 25%, transparent)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-180"
      style={{
        backgroundImage: "radial-gradient(rgb(17 17 24 / 0.12) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    />
  );
}
