"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LockIcon, UploadIcon } from "./icons";
import { btnPrimary, btnSecondary, card, focusRing } from "./ui";

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

// Splits a byte count into a big number and a muted unit, e.g. { value: "2.4", unit: "MB" }
function splitBytes(bytes: number) {
  if (bytes < 1024 * 1024) return { value: String(Math.max(1, Math.round(bytes / 1024))), unit: "KB" };
  return { value: (bytes / (1024 * 1024)).toFixed(1), unit: "MB" };
}

// One figure in the summary strip: small muted label, big number, muted unit, optional status pill
function Stat({ label, value, unit, pill }: { label: string; value: string; unit?: string; pill?: string }) {
  return (
    <div className="bg-surface px-4 py-3.5 sm:px-5">
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {unit && <span className="text-base text-muted">{unit}</span>}
        {pill && (
          <span className="ml-1 self-center rounded-md bg-good-bg px-1.5 py-0.5 text-xs font-medium text-good">
            {pill}
          </span>
        )}
      </div>
    </div>
  );
}

function Tile({
  img,
  f,
  focus,
  selected,
  onSelect,
}: {
  img: HTMLImageElement;
  f: (typeof FORMATS)[number];
  focus: Focus;
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const scale = Math.min(190 / f.w, 130 / f.h);
  const W = Math.round(f.w * scale);
  const H = Math.round(f.h * scale);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    drawCover(ctx, img, c.width, c.height, focus);
  }, [img, focus, W, H]);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${focusRing} ${
        selected ? "border-accent bg-accent-50/60 ring-1 ring-accent" : "border-line bg-surface hover:border-ink/25"
      }`}
    >
      <div className="flex h-36.5 items-center justify-center rounded-lg bg-canvas">
        <canvas ref={ref} width={W * 2} height={H * 2} style={{ width: W }} className="h-auto max-w-full rounded-md" />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{f.name}</p>
        {selected && (
          <span className="shrink-0 rounded-md bg-accent px-1.5 py-0.5 text-xs font-medium text-white">Selected</span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted tabular-nums">{f.ratio} · {f.w}×{f.h}</p>
    </button>
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
  const [bytes, setBytes] = useState<number | null>(null);
  const [focus, setFocus] = useState<Focus>({ x: 0.5, y: 0.5 });
  const [selectedName, setSelectedName] = useState(FORMATS[1].name);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = (image: HTMLImageElement, url: string, size: number | null) => {
    setFocus({ x: 0.5, y: 0.5 });
    setBytes(size);
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
    image.onload = () => load(image, url, file.size);
    image.onerror = () => setError("We couldn’t read that image. Try a JPG or PNG.");
    image.src = url;
  };

  const useSample = async () => {
    setError(null);
    const image = await makeSample();
    load(image, image.src, null);
  };

  const pickFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setFocus({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  if (!img || !src) {
    return (
      <div className="mx-auto mt-10 max-w-3xl">
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); }
          }}
          className={`cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-colors ${focusRing} ${
            dragOver ? "border-accent bg-accent-50" : "border-ink/20 bg-surface hover:border-accent/60"
          }`}
        >
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-strong">
            <UploadIcon />
          </span>
          <p className="mt-4 text-base font-medium">Drop a photo here, or click to choose one</p>
          <p className="mt-1 text-sm text-ink-2">See it cropped for every platform instantly.</p>
          <p className="mt-0.5 text-xs text-muted">JPG, PNG or WEBP, up to 15 MB</p>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-canvas px-2.5 py-1 text-xs text-ink-2">
            <LockIcon />
            Your photo stays in your browser and is never uploaded.
          </p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={useSample} className={btnSecondary}>
            No photo handy? Try a sample
          </button>
        </div>
        {error && <p role="alert" className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  const selected = FORMATS.find((f) => f.name === selectedName) ?? FORMATS[0];
  const size = bytes === null ? null : splitBytes(bytes);

  return (
    <div className={`${card} mx-auto mt-10 max-w-5xl p-4 text-left shadow-[0_1px_2px_rgb(17_17_24/0.04)] sm:p-5`}>
      {/* Summary strip: what we have, at a glance */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
        <Stat label="Sizes ready" value={String(FORMATS.length)} />
        <Stat label="Your photo" value={`${img.width}×${img.height}`} unit="px" />
        {size ? <Stat label="File size" value={size.value} unit={size.unit} /> : <Stat label="Source" value="Sample" />}
        <Stat label="Uploaded" value="0" unit="B" pill="Local only" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="rounded-xl border border-line p-4">
          <p className="text-sm font-medium">Your photo</p>
          <p className="mt-0.5 text-xs text-muted">Click what should stay in frame</p>
          <div onClick={pickFocus} className="relative mt-3 cursor-crosshair overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Your photo" className="block w-full" draggable={false} />
            <span
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent shadow-md"
              style={{ left: `${focus.x * 100}%`, top: `${focus.y * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-line p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">Sizes</p>
            <p className="text-xs text-muted">Pick one to export</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {FORMATS.map((f) => (
              <Tile
                key={f.name}
                img={img}
                f={f}
                focus={focus}
                selected={f.name === selected.name}
                onSelect={() => setSelectedName(f.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* The selected size, its details and the action all point at the same thing */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line bg-canvas p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div>
          <p className="text-sm font-medium">
            {selected.name} <span className="font-normal text-muted tabular-nums">· {selected.ratio} · {selected.w}×{selected.h}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">
            This preview uses a simple crop. Signed-in exports use automatic subject detection.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={() => { setImg(null); setSrc(null); setBytes(null); }} className={btnSecondary}>
            Try another photo
          </button>
          <Link href="/sign-up" className={btnPrimary}>
            Create a free account to export
          </Link>
        </div>
      </div>
    </div>
  );
}
