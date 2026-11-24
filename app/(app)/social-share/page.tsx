"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { uploadToCloudinary, SignData } from "@/lib/cloudinaryUpload";
import { ImageIcon, Upload, Download, Sparkles, Crop } from "lucide-react";

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
      if (!signRes.ok) throw new Error("Could not start the upload. Please sign in again.");
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

  return (
    // Swapped bg-black text-white for dynamic semantic classes
    <main className="min-h-screen bg-base-100 text-base-content relative">
      {/* Background glow utilizing theme variables */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            Social Media Image Creator
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Create Perfect{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Social Media Images
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl opacity-70">
            Upload your image, choose the platform format, and instantly generate
            optimized versions for Instagram, Twitter, Facebook, and more.
          </p>
        </div>

        {/* Outer panel card using base-200 */}
        <div className="rounded-3xl border border-base-300 bg-base-200/50 p-8 shadow-2xl backdrop-blur-xl">
          {/* Upload section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Upload an Image</h2>

            <div className="rounded-2xl border border-dashed border-primary/30 bg-base-100/60 p-6 transition hover:border-primary">
              <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-2xl bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>

                <p className="text-lg font-medium">
                  Click to choose an image
                </p>
                <p className="mt-2 text-sm opacity-60">
                  JPG, PNG, WEBP • Max 10 MB
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm opacity-60">
                  {progress < 100 ? `Uploading… ${progress}%` : "Saving to your library…"}
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-error mt-6 text-sm">
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Format + Preview section */}
          {uploadedImage && (
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {/* Left side controls */}
              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Select Social Media Format
                </h2>

                <label className="mb-2 block text-sm font-medium opacity-80">
                  Choose a format
                </label>

                <div className="relative">
                  <Crop className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-60" />
                  {/* Using standard DaisyUI select class */}
                  <select
                    className="select select-bordered w-full rounded-xl bg-base-100 py-3 pl-12 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={selectedFormat}
                    onChange={(e) =>
                      setSelectedFormat(e.target.value as SocialFormat)
                    }
                  >
                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-container box using clear layout depth splits */}
                <div className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <ImageIcon className="h-5 w-5 text-secondary" />
                    Selected Output
                  </h3>
                  <p className="font-medium">{selectedFormat}</p>
                  <p className="mt-2 text-sm opacity-70">
                    Resolution: {socialFormats[selectedFormat].width} ×{" "}
                    {socialFormats[selectedFormat].height}
                  </p>
                  <p className="text-sm opacity-70">
                    Aspect Ratio: {socialFormats[selectedFormat].aspectRatio}
                  </p>
                </div>

                {/* DaisyUI Button conversion */}
                <button
                  className="btn btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl text-white shadow-lg transition hover:scale-[1.01]"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download className="h-5 w-5" />
                  Download for {selectedFormat}
                </button>
              </div>

              {/* Right side preview */}
              <div>
                <h3 className="mb-4 text-2xl font-semibold">Preview</h3>

                {/* Canvas card setup */}
                <div className="relative flex min-h-80 items-center justify-center rounded-3xl border border-base-300 bg-base-100 p-4">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-base-300/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-base-200 border-t-primary"></div>
                        <p className="text-sm opacity-80">
                          Transforming image...
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-2xl border border-base-300 shadow-lg">
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="Transformed social media image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="max-h-105 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}