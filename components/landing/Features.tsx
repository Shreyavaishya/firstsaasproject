"use client";

import { motion } from "framer-motion";
import { Zap, ImageIcon, ShieldCheck, FolderOpen } from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-4 inline-flex rounded-2xl bg-black/40 p-3">
        {icon}
      </div>
      <h4 className="mb-3 text-xl font-semibold">{title}</h4>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-7xl px-6 py-20"
    >
      {/* Header */}
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-purple-400">
          Features
        </p>

        <h3 className="text-3xl font-bold md:text-4xl">
          Everything You Need to Manage Your Media
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          Built for creators, students, and teams who want a clean, reliable,
          and modern way to upload and manage visual content.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
          icon={<Zap className="h-8 w-8 text-purple-400" />}
          title="Lightning Fast Uploads"
          description="Upload videos and images smoothly with a clean and user-friendly experience."
        />

        <FeatureCard
          icon={<ImageIcon className="h-8 w-8 text-cyan-400" />}
          title="Instant Media Preview"
          description="Preview your uploaded content instantly without extra downloads or hassle."
        />

        <FeatureCard
          icon={<ShieldCheck className="h-8 w-8 text-green-400" />}
          title="Secure Storage"
          description="Your files stay safe, protected, and accessible whenever you need them."
        />

        <FeatureCard
          icon={<FolderOpen className="h-8 w-8 text-pink-400" />}
          title="Easy Organization"
          description="Keep all your uploaded media structured in one clean and intuitive dashboard."
        />
      </div>
    </motion.section>
  );
}