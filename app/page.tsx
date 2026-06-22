import Link from "next/link";
import { Upload, ImageIcon, Video, ShieldCheck, FolderOpen, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-20 h-75 w-75 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="border-b border-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Media<span className="text-purple-400">Vault</span>
          </h1>

          <nav className="hidden gap-8 text-sm text-zinc-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it Works
            </a>
            <a href="#upload" className="transition hover:text-white">
              Upload
            </a>
          </nav>

          <Link
            href="/upload"
            className="rounded-full bg-linear-to-r from-purple-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Upload className="mr-2 h-4 w-4" />
              Fast, Secure & Modern Media Uploads
            </div>

            <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Upload, Store & Manage Your{" "}
              <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Videos & Images
              </span>{" "}
              Effortlessly
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              A modern platform to upload videos and images securely, preview them instantly,
              and keep all your media organized in one place. Built for speed, simplicity,
              and seamless access.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/upload"
                className="rounded-xl bg-linear-to-r from-purple-500 to-cyan-500 px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:scale-105"
              >
                Start Uploading
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center font-medium text-zinc-200 transition hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">Fast</p>
                <p className="text-sm text-zinc-400">Media Uploads</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">Secure</p>
                <p className="text-sm text-zinc-400">File Storage</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-white">Simple</p>
                <p className="text-sm text-zinc-400">Media Management</p>
              </div>
            </div>
          </div>

          {/* Right side preview card */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upload Preview</h3>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-purple-500/20 bg-zinc-900/80 p-4">
                  <div className="flex items-center gap-3">
                    <Video className="h-8 w-8 text-purple-400" />
                    <div>
                      <p className="font-medium">travel-vlog.mp4</p>
                      <p className="text-sm text-zinc-400">Video uploaded successfully</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-zinc-900/80 p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-cyan-400" />
                    <div>
                      <p className="font-medium">cover-image.png</p>
                      <p className="text-sm text-zinc-400">Image preview ready</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center">
                  <Upload className="mx-auto mb-3 h-10 w-10 text-purple-400" />
                  <p className="font-medium">Drag & drop your media here</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Upload videos and images in a smooth and secure way
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur md:block">
              <p className="text-sm text-zinc-300">Supports videos, images & previews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
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
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y border-white/10 bg-zinc-950/60 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400">
              How It Works
            </p>
            <h3 className="text-3xl font-bold md:text-4xl">
              Upload Your Media in 3 Simple Steps
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <StepCard
              step="01"
              title="Choose Your Files"
              description="Select the videos or images you want to upload directly from your device."
            />
            <StepCard
              step="02"
              title="Upload in Seconds"
              description="Add your media through a fast, seamless, and user-friendly upload flow."
            />
            <StepCard
              step="03"
              title="Access Anytime"
              description="View, organize, and manage all your uploaded content whenever you want."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="upload" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-linear-to-r from-purple-600/20 via-zinc-900 to-cyan-600/20 p-10 text-center shadow-2xl backdrop-blur">
          <h3 className="text-3xl font-bold md:text-4xl">
            Start Uploading Your Videos & Images Today
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            Store your media in a secure, simple, and modern platform designed for speed,
            accessibility, and effortless management.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-xl bg-linear-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Upload Now
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-zinc-200 transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-zinc-400 md:flex-row">
          <p>© 2026 MediaVault. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How it Works
            </a>
            <a href="#upload" className="hover:text-white">
              Upload
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

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
      <div className="mb-4 inline-flex rounded-2xl bg-black/40 p-3">{icon}</div>
      <h4 className="mb-3 text-xl font-semibold">{title}</h4>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <span className="text-sm font-semibold tracking-widest text-purple-400">
        {step}
      </span>
      <h4 className="mt-4 text-2xl font-bold">{title}</h4>
      <p className="mt-3 leading-7 text-zinc-400">{description}</p>
    </div>
  );
}