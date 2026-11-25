"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Video, FileVideo, Sparkles } from "lucide-react";

type SignData = {
  signature: string;
  timestamp: number;
  folder: string;
  eager: string;
  apiKey: string;
  cloudName: string;
};

function uploadToCloudinary(
  file: File,
  sign: SignData,
  onProgress: (percent: number) => void
) {
  return new Promise<{ public_id: string; duration?: number }>((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sign.apiKey);
    fd.append("timestamp", String(sign.timestamp));
    fd.append("signature", sign.signature);
    fd.append("folder", sign.folder);
    fd.append("eager", sign.eager);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(body);
        else reject(new Error(body?.error?.message || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  // Cloudinary free plan: 40 MB video transformation limit
  const MAX_FILE_SIZE = 40 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setErrorMsg(null);

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("File is too large. Maximum allowed size is 40 MB.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Ask our server for a signature
      const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
      if (!signRes.ok) {
        const body = await signRes.json().catch(() => null);
        throw new Error(body?.error || "Could not start the upload. Please sign in again.");
      }
      const sign: SignData = await signRes.json();

      // 2. Upload straight to Cloudinary, with progress
      const uploaded = await uploadToCloudinary(file, sign, setProgress);

      // 3. Save the record on our server
      const saveRes = await fetch("/api/video-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: uploaded.public_id, title, description, duration: uploaded.duration }),
      });
      if (!saveRes.ok) {
        const body = await saveRes.json().catch(() => null);
        throw new Error(body?.error || "Could not save the video.");
      }

      router.push("/home");
    } catch (error) {
      console.log(error);
      setErrorMsg(error instanceof Error ? error.message : "Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // Changed bg-black text-white to dynamic semantic variables
    <main className="min-h-screen bg-base-100 text-base-content relative">
      {/* Background glow adapts softly to themes using opacity */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            Upload & Manage Your Videos
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Upload Your{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Video Content
            </span>
          </h1>

          {/* Muted content description color */}
          <p className="mx-auto mt-4 max-w-2xl opacity-70">
            Add your video, title, and description to upload content securely and
            keep everything organized in one place.
          </p>
        </div>

        {/* Card wrapper uses bg-base-200 for layered depth */}
        <div className="rounded-3xl border border-base-300 bg-base-200/50 p-8 shadow-xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium opacity-80">
                Video Title
              </label>
              {/* Using native DaisyUI input styling for flawless theme adaptation */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="input input-bordered w-full rounded-xl bg-base-100 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium opacity-80">
                Description
              </label>
              {/* Using native DaisyUI textarea styling */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about your video"
                rows={5}
                className="textarea textarea-bordered w-full rounded-xl bg-base-100 px-4 py-3 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-3 block text-sm font-medium opacity-80">
                Video File
              </label>

              <div className="rounded-2xl border border-dashed border-primary/30 bg-base-100/60 p-6 transition hover:border-primary">
                <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-2xl bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>

                  <p className="text-lg font-medium">
                    Click to choose a video
                  </p>
                  <p className="mt-2 text-sm opacity-60">
                    MP4, MOV, AVI supported • Max size 40 MB
                  </p>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    required
                  />
                </label>

                {/* Selected file preview */}
                {file && (
                  <div className="mt-6 rounded-2xl border border-base-300 bg-base-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-secondary/10 p-3">
                        <FileVideo className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {file.name}
                        </p>
                        <p className="text-sm opacity-60">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div>
                <progress className="progress progress-primary w-full" value={progress} max={100}></progress>
                <p className="mt-2 text-sm opacity-60">
                  {progress < 100 ? `Uploading… ${progress}%` : "Optimizing your video…"}
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-error text-sm">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Dynamic Button utilizing DaisyUI classes */}
            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-primary w-full gap-2 rounded-xl text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUploading ? (
                <>
                  <Upload className="h-5 w-5 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Video className="h-5 w-5" />
                  Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default VideoUpload;