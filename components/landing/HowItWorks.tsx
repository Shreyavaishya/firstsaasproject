"use client";

import { motion } from "framer-motion";

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10 hover:-translate-y-1">
      <span className="text-sm font-semibold tracking-widest text-purple-400">
        {step}
      </span>
      <h4 className="mt-4 text-2xl font-bold">{title}</h4>
      <p className="mt-3 leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="border-y border-white/10 bg-zinc-950/60 px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400">
            How It Works
          </p>
          <h3 className="text-3xl font-bold md:text-4xl">
            Upload Your Media in 3 Simple Steps
          </h3>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <StepCard
              step="01"
              title="Choose Your Files"
              description="Select videos or images directly from your device."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <StepCard
              step="02"
              title="Upload in Seconds"
              description="Fast, smooth and seamless upload experience."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <StepCard
              step="03"
              title="Access Anytime"
              description="View and manage your media anytime, anywhere."
            />
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}