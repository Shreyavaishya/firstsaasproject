const faqs = [
  { q: "Are my files private?", a: "Your library is only visible to you. Files are stored with our media provider, Cloudinary, and are not listed publicly." },
  { q: "How long do you keep my files?", a: "Until you delete them. You can delete any image or video from your library at any time, and it is removed from storage." },
  { q: "What file types and sizes work?", a: "Images (JPG, PNG, WEBP) up to 10 MB and videos (MP4, MOV, AVI) up to 40 MB on the free plan." },
  { q: "Is it really free?", a: "Yes. The free plan includes 10 exports a month and 300 MB of storage, with no card needed. Paid plans will come later." },
  { q: "Do you use my content for anything else?", a: "No. Your files are only processed to give you the results you asked for." },
  { q: "Does the demo upload my photo?", a: "No. The preview runs entirely in your browser, and nothing is sent anywhere until you create an account and upload." },
];

export default function Faq() {
  return (
    <section id="faq" className="px-6 py-20">
      <h2 className="text-center text-3xl font-bold sm:text-4xl">Questions</h2>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
            <p className="mt-3 text-sm text-zinc-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
