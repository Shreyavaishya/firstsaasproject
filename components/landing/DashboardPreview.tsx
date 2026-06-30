export default function DashboardPreview() {
  return (
    <section className="mt-20 flex justify-center px-6">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
        
        <div className="h-10 flex items-center gap-2 px-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-32 bg-white/10 rounded-xl" />
          <div className="h-32 bg-white/10 rounded-xl" />
          <div className="h-32 bg-white/10 rounded-xl" />
        </div>

        <div className="h-48 mt-4 bg-white/10 rounded-xl" />
      </div>
    </section>
  );
}