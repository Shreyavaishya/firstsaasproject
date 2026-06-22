"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
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
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Sparkles className="mr-2 h-4 w-4" />
            Social Media Image Creator
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Create Perfect{" "}
            <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Social Media Images
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Upload your image, choose the platform format, and instantly generate
            optimized versions for Instagram, Twitter, Facebook, and more.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Upload section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Upload an Image</h2>

            <div className="rounded-2xl border border-dashed border-purple-500/30 bg-zinc-950/60 p-6 transition hover:border-purple-400">
              <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-2xl bg-purple-500/10 p-4">
                  <Upload className="h-8 w-8 text-purple-400" />
                </div>

                <p className="text-lg font-medium text-white">
                  Click to choose an image
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  JPG, PNG, WEBP supported
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
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full animate-pulse rounded-full bg-linear-to-r from-purple-500 to-cyan-500" />
                </div>
                <p className="mt-2 text-sm text-zinc-400">Uploading image...</p>
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

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Choose a format
                </label>

                <div className="relative">
                  <Crop className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <select
                    className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-900/80 py-3 pl-12 pr-4 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
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

                <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    Selected Output
                  </h3>
                  <p className="text-zinc-300">{selectedFormat}</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Resolution: {socialFormats[selectedFormat].width} ×{" "}
                    {socialFormats[selectedFormat].height}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Aspect Ratio: {socialFormats[selectedFormat].aspectRatio}
                  </p>
                </div>

                <button
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                  Download for {selectedFormat}
                </button>
              </div>

              {/* Right side preview */}
              <div>
                <h3 className="mb-4 text-2xl font-semibold">Preview</h3>

                <div className="relative flex min-h-80 items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/70 p-4">
                  {isTransforming && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-purple-400"></div>
                        <p className="text-sm text-zinc-300">
                          Transforming image...
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
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