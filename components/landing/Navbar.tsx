"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { btnPrimary, focusRing } from "./ui";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink = `rounded-md transition-colors hover:text-ink ${focusRing}`;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors ${
        scrolled ? "border-b border-line bg-canvas/80 backdrop-blur" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className={`rounded-md text-lg font-semibold tracking-tight text-ink ${focusRing}`}>
          Pixora
        </Link>

        <nav className="hidden gap-8 text-sm text-ink-2 md:flex">
          <a href="#try" className={navLink}>Try it</a>
          <a href="#how-it-works" className={navLink}>How it works</a>
          <a href="#pricing" className={navLink}>Pricing</a>
          <a href="#faq" className={navLink}>FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className={`rounded-md text-sm text-ink-2 transition-colors hover:text-ink ${focusRing}`}>
            Log in
          </Link>
          <Link href="/sign-up" className={btnPrimary}>Try free</Link>
        </div>
      </div>
    </header>
  );
}
