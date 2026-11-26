"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition ${scrolled ? "border-b border-white/10 bg-black/60 backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-purple-400">Pixora</Link>

        <nav className="hidden gap-8 text-sm text-zinc-300 md:flex">
          <a href="#try" className="hover:text-white">Try it</a>
          <a href="#how-it-works" className="hover:text-white">How it works</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-zinc-300 hover:text-white">Log in</Link>
          <Link href="/sign-up" className="rounded-full bg-linear-to-r from-purple-500 to-cyan-500 px-5 py-2 text-sm font-semibold">
            Try free
          </Link>
        </div>
      </div>
    </header>
  );
}
