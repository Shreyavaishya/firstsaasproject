"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Video, ImageIcon } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">


        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Upload className="mr-2 h-4 w-4" />
            Fast, Secure & Modern Media Uploads
          </div>

          <h2 className="text-4xl font-bold md:text-6xl">
            Upload, Store & Manage Your{" "}
            <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Videos & Images
            </span>
          </h2>

          <p className="mt-6 text-lg text-zinc-400">
            A modern platform to upload videos and images securely, preview them instantly,
            and manage everything in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/video-upload"
              className="rounded-xl bg-linear-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold transition hover:scale-105"
            >
              Start Uploading
            </Link>

            <a href="#features" className="rounded-xl border border-white/10 px-6 py-3">
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <div className="space-y-4">

            <div className="flex gap-3">
              <Video className="text-purple-400" />
              <div>
                <p>travel-vlog.mp4</p>
                <p className="text-sm text-zinc-400">Uploaded</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ImageIcon className="text-cyan-400" />
              <div>
                <p>cover.png</p>
                <p className="text-sm text-zinc-400">Preview ready</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 p-6 text-center">
              Drag & drop uploads
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}