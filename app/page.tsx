import Background from "@/components/landing/Background";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Background />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
