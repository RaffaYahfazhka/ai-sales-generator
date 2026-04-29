"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wand2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      productName: formData.get("productName"),
      description: formData.get("description"),
      features: formData.get("features"),
      targetMarket: formData.get("targetMarket"),
      price: formData.get("price"),
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to generate page");
      }

      const result = await response.json();
      localStorage.setItem(`sales_page_${result.id}`, JSON.stringify(result.data));
      router.push(`/preview/${result.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Generate Sales Page</h1>
          <p className="text-zinc-400 text-lg">Tell us about your product, and our AI will craft a high-converting landing page specifically tailored to your audience.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex justify-between" htmlFor="productName">
                  <span>Product Name <span className="text-brand-400">*</span></span>
                </label>
                <input
                  id="productName"
                  name="productName"
                  required
                  className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-zinc-600"
                  placeholder="e.g. SalesGen Pro"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex justify-between" htmlFor="price">
                  <span>Price <span className="text-brand-400">*</span></span>
                </label>
                <input
                  id="price"
                  name="price"
                  required
                  className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-zinc-600"
                  placeholder="e.g. $49/mo or Free"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex flex-col gap-1" htmlFor="description">
                <span>Short Description <span className="text-brand-400">*</span></span>
                <span className="text-xs text-zinc-500 font-normal">Keep it concise. What problem does it solve?</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none placeholder:text-zinc-600"
                placeholder="What does your product do in 1-2 sentences?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex flex-col gap-1" htmlFor="features">
                <span>Key Features <span className="text-zinc-500 font-normal">(Optional)</span></span>
                <span className="text-xs text-zinc-500 font-normal">What makes it stand out? One per line is best.</span>
              </label>
              <textarea
                id="features"
                name="features"
                rows={4}
                className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none placeholder:text-zinc-600"
                placeholder="List the main features or benefits (one per line is fine)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex justify-between" htmlFor="targetMarket">
                <span>Target Market <span className="text-zinc-500 font-normal">(Optional)</span></span>
              </label>
              <input
                id="targetMarket"
                name="targetMarket"
                className="w-full bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-zinc-600"
                placeholder="e.g. Indie hackers, Marketing agencies"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white font-semibold rounded-lg px-4 py-4 hover:bg-brand-500 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Sales Page
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
