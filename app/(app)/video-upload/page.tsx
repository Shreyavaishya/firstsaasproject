"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Video, FileVideo } from "lucide-react";

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
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Upload a video</h1>
          <p className="mt-0.5 text-sm text-base-content/60">
            Add your video, title, and description. Everything is saved to your library.
          </p>
        </header>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="video-title" className="mb-1.5 block text-sm font-medium">
                Video Title
              </label>
              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="input w-full"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="video-description" className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="video-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about your video"
                rows={5}
                className="textarea w-full"
              />
            </div>

            {/* File Upload */}
            <div>
              <p className="mb-1.5 text-sm font-medium">Video File</p>

              <div className="rounded-xl border border-dashed border-base-content/20 p-6 transition-colors hover:border-primary/60">
                <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </span>

                  <p className="text-base font-medium">Click to choose a video</p>
                  <p className="mt-1 text-sm text-base-content/60">
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

                {/* Selected file */}
                {file && (
                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-base-300 bg-base-200 p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-base-100 text-base-content/70">
                      <FileVideo className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-base-content/60 tabular-nums">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div>
                <progress className="progress progress-primary h-1.5 w-full" value={progress} max={100}></progress>
                <p className="mt-2 text-sm text-base-content/60">
                  {progress < 100 ? `Uploading… ${progress}%` : "Optimizing your video…"}
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-error text-sm">
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-neutral w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70"
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
