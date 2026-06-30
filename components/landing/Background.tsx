export default function Background() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>
  );
}