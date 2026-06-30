"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <motion.section
      id="upload"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-7xl px-6 py-20"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-purple-600/20 via-zinc-900 to-cyan-600/20 p-10 text-center shadow-2xl backdrop-blur">

        {/* glow effect */}
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative">
          <h3 className="text-3xl font-bold md:text-4xl">
            Start Uploading Your Media Today
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            Store, preview and manage all your videos & images in a modern SaaS platform.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            
            <Link
              href="/video-upload"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-purple-500/30"
            >
              Upload Now
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-zinc-200 transition hover:bg-white/10 hover:scale-105"
            >
              Learn More
            </a>

          </div>
        </div>
      </div>
    </motion.section>
  );
}