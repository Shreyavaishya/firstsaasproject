"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FORMATS = [
  { name: "Instagram Post", ratio: "1:1", w: 1080, h: 1080 },
  { name: "Instagram Portrait", ratio: "4:5", w: 1080, h: 1350 },
  { name: "Reels / Stories", ratio: "9:16", w: 1080, h: 1920 },
  { name: "YouTube Thumbnail", ratio: "16:9", w: 1280, h: 720 },
  { name: "X Header", ratio: "3:1", w: 1500, h: 500 },
];

const MAX_BYTES = 15 * 1024 * 1024;

type Focus = { x: number; y: number };

// Crops the image to fill the box, keeping the focus point as centred as possible
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, dw: number, dh: number, f: Focus) {
  const sr = img.width / img.height;
  const dr = dw / dh;
  let sw: number, sh: number;
  if (sr > dr) { sh = img.height; sw = sh * dr; } else { sw = img.width; sh = sw / dr; }
  const sx = Math.min(Math.max(f.x * img.width - sw / 2, 0), img.width - sw);
  const sy = Math.min(Math.max(f.y * img.height - sh / 2, 0), img.height - sh);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
}

function Tile({ img, f, focus }: { img: HTMLImageElement; f: (typeof FORMATS)[number]; focus: Focus }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scale = Math.min(220 / f.w, 150 / f.h);
  const W = Math.round(f.w * scale);
  const H = Math.round(f.h * scale);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    c.width = W * 2;
    c.height = H * 2;
    drawCover(ctx, img, c.width, c.height, focus);
  }, [img, focus, W, H]);

  return (
    <div className="flex flex-col items-start">
      <canvas ref={ref} style={{ width: W, height: H }} className="rounded-lg border border-white/10" />
      <p className="mt-2 text-sm font-medium">{f.name}</p>
      <p className="text-xs text-zinc-400">{f.ratio} · {f.w}×{f.h}</p>
    </div>
  );
}

// A simple generated picture, so visitors can try the demo without a photo
function makeSample(): Promise<HTMLImageElement> {
  const c = document.createElement("canvas");
  c.width = 1600; c.height = 1000;
  const ctx = c.getContext("2d")!;
  const sky = ctx.createLinearGradient(0, 0, 0, 1000);
  sky.addColorStop(0, "#4c1d95"); sky.addColorStop(0.6, "#f472b6"); sky.addColorStop(1, "#fbbf24");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 1600, 1000);
  ctx.fillStyle = "#fef3c7"; ctx.beginPath(); ctx.arc(1120, 360, 110, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1e1b4b";
  ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(0, 700); ctx.lineTo(380, 520); ctx.lineTo(760, 760); ctx.lineTo(1100, 600); ctx.lineTo(1600, 800); ctx.lineTo(1600, 1000); ctx.fill();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = c.toDataURL("image/jpeg", 0.9);
  });
}

export default function DemoCropper() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [focus, setFocus] = useState<Focus>({ x: 0.5, y: 0.5 });
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = (image: HTMLImageElement, url: string) => {
    setFocus({ x: 0.5, y: 0.5 });
    setImg(image);
    setSrc(url);
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Please choose an image (JPG, PNG or WEBP).");
    if (file.size > MAX_BYTES) return setError("That file is too big for the demo (max 15 MB).");
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => load(image, url);
    image.onerror = () => setError("We couldn’t read that image. Try a JPG or PNG.");
    image.src = url;
  };

  const useSample = async () => {
    setError(null);
    const image = await makeSample();
    load(image, image.src);
  };

  const pickFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setFocus({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  if (!img || !src) {
    return (
      <div className="mx-auto mt-10 max-w-3xl">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition ${
            dragOver ? "border-purple-400 bg-purple-500/10" : "border-white/20 bg-white/5 hover:border-white/40"
          }`}
        >
          <p className="text-lg font-semibold">Drop a photo here, or click to choose one</p>
          <p className="mt-2 text-sm text-zinc-400">
            See it cropped for every platform instantly. Your photo stays in your browser and is never uploaded.
          </p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
        <div className="mt-4 flex justify-center">
          <button onClick={useSample} className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10">
            No photo handy? Try a sample
          </button>
        </div>
        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div>
          <p className="mb-2 text-sm font-medium">Click what should stay in frame</p>
          <div onClick={pickFocus} className="relative cursor-crosshair overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Your photo" className="block w-full" draggable={false} />
            <span
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-purple-500/60 shadow"
              style={{ left: `${focus.x * 100}%`, top: `${focus.y * 100}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-6">
          {FORMATS.map((f) => <Tile key={f.name} img={img} f={f} focus={focus} />)}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-sm text-zinc-400">
          This preview uses a simple crop. Signed-in exports use automatic subject detection.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setImg(null); setSrc(null); }} className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10">
            Try another photo
          </button>
          <Link href="/sign-up" className="rounded-full bg-linear-to-r from-purple-500 to-cyan-500 px-5 py-2 text-sm font-semibold">
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}
