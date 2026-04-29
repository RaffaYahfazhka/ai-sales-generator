"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Target, Layout } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <br /> <br />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">SalesGen AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-zinc-300">
              {mounted ? "Powered by Kimi Advanced AI" : "Powered by AI"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8"
          >
            <span className="text-gradient-display block mb-2">High-converting</span>
            sales pages in <span className="text-gradient">seconds</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Stop staring at a blank screen. Just describe your product, and our AI will generate a complete, beautifully designed landing page ready to convert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-white text-black rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Start Generating for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border border-white/10 rounded-full hover:bg-white/5 transition-colors"
            >
              See how it works
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Instant Generation"
            description="Go from idea to complete landing page in under 30 seconds."
            delay={0.4}
          />
          <FeatureCard
            icon={<Target className="w-6 h-6 text-brand-400" />}
            title="Conversion Optimized"
            description="Copywriting frameworks trained on the highest converting pages."
            delay={0.5}
          />
          <FeatureCard
            icon={<Layout className="w-6 h-6 text-purple-400" />}
            title="Beautiful UI"
            description="Not just text. Get a fully styled, modern interface ready to publish."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="glass-card p-8 group hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10 transition-all cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-300 transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
