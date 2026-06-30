"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition ${
        scrolled
          ? "bg-black/60 backdrop-blur border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">
          <span className="text-purple-400">Pixora</span>
        </h1>

        <nav className="hidden gap-8 text-sm text-zinc-300 md:flex">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#upload">Upload</a>
        </nav>

        <Link
          href="/video-upload"
          className="rounded-full bg-linear-to-r from-purple-500 to-cyan-500 px-5 py-2 text-sm font-semibold"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}