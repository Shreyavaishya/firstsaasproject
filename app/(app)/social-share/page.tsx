"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { uploadToCloudinary, SignData } from "@/lib/cloudinaryUpload";
import { makeZip } from "@/lib/zip";
import { Upload, Download } from "lucide-react";

const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Reels / Stories (9:16)": {
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  "YouTube Thumbnail (16:9)": {
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] =
    useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // Cloudinary free plan: 10 MB per image

  // Opening an image from the library: /social-share?img=<id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("img");
    if (!id) return;
    fetch("/api/images")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const found = Array.isArray(list)
          ? list.find((i: { id: string; publicId: string }) => i.id === id)
          : null;
        if (found) setUploadedImage(found.publicId);
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be chosen again
    if (!file) return;
    setErrorMsg(null);

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMsg("Image is too large. Maximum allowed size is 10 MB.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Ask our server for a signature
      const signRes = await fetch("/api/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "image" }),
      });
      if (!signRes.ok) {
        const body = await signRes.json().catch(() => null);
        throw new Error(body?.error || "Could not start the upload. Please sign in again.");
      }
      const sign: SignData = await signRes.json();

      // 2. Upload straight to Cloudinary, with progress
      const uploaded = await uploadToCloudinary(file, sign, setProgress);

      // 3. Save it to the user's library
      const saveRes = await fetch("/api/image-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: uploaded.public_id,
          title: file.name.replace(/\.[^.]+$/, ""),
        }),
      });
      if (!saveRes.ok) {
        const body = await saveRes.json().catch(() => null);
        throw new Error(body?.error || "Could not save the image.");
      }

      const data = await saveRes.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      setErrorMsg(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Downloads the exact resolution of the selected format (not the on-screen preview size)
  const handleDownload = async () => {
    if (!uploadedImage) return;
    setIsDownloading(true);
    try {
      const f = socialFormats[selectedFormat];
      const url = getCldImageUrl({
        src: uploadedImage,
        width: f.width,
        height: f.height,
        crop: "fill",
        gravity: "auto",
        format: "jpg",
        quality: "auto",
      });
      const blob = await (await fetch(url)).blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
      setErrorMsg("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Builds every format and downloads them together as one .zip
  const handleDownloadAll = async () => {
    if (!uploadedImage) return;
    setIsZipping(true);
    setErrorMsg(null);
    try {
      const files = await Promise.all(
        (Object.keys(socialFormats) as SocialFormat[]).map(async (name) => {
          const f = socialFormats[name];
          const url = getCldImageUrl({
            src: uploadedImage,
            width: f.width,
            height: f.height,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
          });
          const res = await fetch(url);
          if (!res.ok) throw new Error("Could not fetch " + name);
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          return {
            name: `${slug}_${f.width}x${f.height}.jpg`,
            data: new Uint8Array(await res.arrayBuffer()),
          };
        })
      );
      const blobUrl = URL.createObjectURL(makeZip(files));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "pixora-all-sizes.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
      setErrorMsg("Could not build the zip. Please try again.");
    } finally {
      setIsZipping(false);
    }
  };

  const formatNames = Object.keys(socialFormats) as SocialFormat[];
  const current = socialFormats[selectedFormat];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Social Studio</h1>
          <p className="mt-0.5 text-sm text-base-content/60">
            Upload an image, choose a platform, and download the exact size.
          </p>
        </header>

        {/* Upload */}
        <section className="rounded-2xl border border-base-300 bg-base-100 p-6">
          <h2 className="mb-4 text-base font-semibold">Upload an image</h2>

          <div className="rounded-xl border border-dashed border-base-content/20 p-6 transition-colors hover:border-primary/60">
            <label className="flex cursor-pointer flex-col items-center justify-center text-center">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Upload className="h-5 w-5" />
              </span>

              <p className="text-base font-medium">Click to choose an image</p>
              <p className="mt-1 text-sm text-base-content/60">JPG, PNG, WEBP • Max 10 MB</p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {isUploading && (
            <div className="mt-5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-300">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-base-content/60">
                {progress < 100 ? `Uploading… ${progress}%` : "Saving to your library…"}
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-error mt-5 text-sm">
              <span>{errorMsg}</span>
            </div>
          )}
        </section>

        {/* Format + Preview */}
        {uploadedImage && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <h2 className="text-base font-semibold">Format</h2>
              <p className="mt-0.5 text-xs text-base-content/60">Pick the platform size</p>

              <div role="radiogroup" aria-label="Social media format" className="mt-4 space-y-1.5">
                {formatNames.map((name) => {
                  const f = socialFormats[name];
                  const active = name === selectedFormat;
                  return (
                    <button
                      key={name}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedFormat(name)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-base-300 hover:border-base-content/25"
                      }`}
                    >
                      <span className="font-medium">{name}</span>
                      <span className="text-xs text-base-content/60 tabular-nums">
                        {f.width}×{f.height}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* The selected size, at a glance */}
              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-base-300 bg-base-300">
                <div className="bg-base-100 px-4 py-3">
                  <p className="text-xs text-base-content/60">Resolution</p>
                  <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">
                    {current.width}×{current.height}
                  </p>
                </div>
                <div className="bg-base-100 px-4 py-3">
                  <p className="text-xs text-base-content/60">Aspect ratio</p>
                  <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">
                    {current.aspectRatio}
                  </p>
                </div>
              </div>

              <button
                className="btn btn-neutral mt-5 w-full gap-2"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-5 w-5" />
                Download for {selectedFormat}
              </button>
              <button
                className="btn btn-outline mt-2 w-full gap-2"
                onClick={handleDownloadAll}
                disabled={isZipping || isDownloading}
              >
                <Download className="h-5 w-5" />
                {isZipping ? "Building your zip…" : `Download all ${formatNames.length} sizes (.zip)`}
              </button>
            </section>

            <section className="rounded-2xl border border-base-300 bg-base-100 p-6">
              <h2 className="text-base font-semibold">Preview</h2>
              <p className="mt-0.5 text-xs text-base-content/60">{selectedFormat}</p>

              <div className="relative mt-4 flex min-h-80 items-center justify-center rounded-xl bg-base-200 p-4">
                {isTransforming && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-base-200/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-base-300 border-t-primary"></div>
                      <p className="text-sm text-base-content/70">Transforming image...</p>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden rounded-lg border border-base-300">
                  <CldImage
                    width={current.width}
                    height={current.height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="Transformed social media image"
                    crop="fill"
                    aspectRatio={current.aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    className="max-h-105 w-auto object-contain"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
