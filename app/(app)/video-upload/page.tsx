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
        router.push("/home");
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