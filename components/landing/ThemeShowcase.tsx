"use client";

import { motion } from "framer-motion";

const themes = [
  {
    name: "Dark Mode",
    description: "Clean, modern, and easy on the eyes.",
    className: "bg-black text-white border-white/10",
  },
  {
    name: "Light Mode",
    description: "Bright and minimal interface.",
    className: "bg-white text-black border-black/10",
  },
  {
    name: "Gradient Mode",
    description: "Vibrant and eye-catching experience.",
    className:
      "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white",
  },
];

export default function ThemeShowcase() {
  return (
    <section className="py-20 px-6 md:px-20">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          One App. Multiple Themes.
        </h2>
        <p className="text-gray-400 mt-3">
          Switch between styles that match your mood.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {themes.map((theme, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-2xl border shadow-lg transition-all ${theme.className}`}
          >
            <h3 className="text-xl font-semibold">{theme.name}</h3>
            <p className="mt-2 opacity-80">{theme.description}</p>

            <div className="mt-6 h-24 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-sm">
              Preview Box
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}