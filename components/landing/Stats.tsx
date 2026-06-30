"use client";

import { motion } from "framer-motion";

const stats = [
  {
    label: "Active Users",
    value: "10K+",
  },
  {
    label: "Files Uploaded",
    value: "1M+",
  },
  {
    label: "Uptime",
    value: "99.9%",
  },
  {
    label: "Processing Speed",
    value: "2.5x Faster",
  },
];

export default function Stats() {
  return (
    <section className="py-16 px-6 md:px-20 bg-black text-white">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          Trusted by creators worldwide
        </h2>
        <p className="text-gray-400 mt-3">
          Real numbers that show our impact
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {stat.value}
            </h3>
            <p className="text-gray-400 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}