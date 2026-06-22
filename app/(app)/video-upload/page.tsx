"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload, Video, FileVideo, Sparkles } from "lucide-react";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  // max file size of 70 MB
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large. Max allowed size is 70 MB.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Video uploaded successfully!");
        router.push("/");
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong while uploading the video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Sparkles className="mr-2 h-4 w-4" />
            Upload & Manage Your Videos
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Upload Your{" "}
            <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Video Content
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Add your video, title, and description to upload content securely and
            keep everything organized in one place.
          </p>
        </div>

        {/* upload card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about your video"
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Video File
              </label>

              <div className="rounded-2xl border border-dashed border-purple-500/30 bg-zinc-950/60 p-6 transition hover:border-purple-400">
                <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-2xl bg-purple-500/10 p-4">
                    <Upload className="h-8 w-8 text-purple-400" />
                  </div>

                  <p className="text-lg font-medium text-white">
                    Click to choose a video
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    MP4, MOV, AVI supported • Max size 70 MB
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
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-500/10 p-3">
                        <FileVideo className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {file.name}
                        </p>
                        <p className="text-sm text-zinc-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload button */}
            <button
              type="submit"
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
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