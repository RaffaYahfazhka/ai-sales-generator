"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Download, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function PreviewClient({ id, serverData }: { id: string, serverData: any }) {
  const [data, setData] = useState<any>(serverData);
  const [loading, setLoading] = useState(!serverData);

  useEffect(() => {
    if (!serverData) {
      // Fallback to local storage if DB fetch failed (e.g., user not logged in, or db not setup)
      const localData = localStorage.getItem(`sales_page_${id}`);
      if (localData) {
        setData(JSON.parse(localData));
      }
      setLoading(false);
    }
  }, [id, serverData]);

  const [isCopied, setIsCopied] = useState(false);

  const generateHtmlContent = () => {
    if (!data) return "";
    return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${data.headline}">
    <title>${data.product_name} | ${data.headline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .font-display { font-family: 'Outfit', sans-serif; }
        .glass-gradient { background: radial-gradient(ellipse at top, #eff6ff 0%, #ffffff 100%); }
    </style>
</head>
<body class="bg-white text-zinc-900 overflow-x-hidden">
    <main class="w-full">
        <!-- Hero -->
        <section class="relative pt-32 pb-40 px-6 lg:px-8 glass-gradient">
            <div class="max-w-5xl mx-auto text-center">
                <h1 class="text-5xl md:text-8xl font-display font-extrabold tracking-tight text-zinc-900 mb-8 leading-[1.1]">
                    ${data.headline}
                </h1>
                <p class="text-xl md:text-2xl text-zinc-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                    ${data.subheadline}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button class="w-full sm:w-auto px-10 py-5 text-xl font-bold bg-brand-600 text-white rounded-full shadow-2xl shadow-brand-600/30 hover:bg-brand-700 hover:scale-105 transition-all">
                        ${data.cta || "Get Started Now"}
                    </button>
                    <div class="flex flex-col items-start text-left">
                      <span class="text-sm font-bold text-zinc-900 uppercase tracking-widest">Investment</span>
                      <span class="text-lg font-medium text-zinc-500">${data.price}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Benefits -->
        <section class="py-32 bg-zinc-50 px-6 lg:px-8 border-y border-zinc-200">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-20">
                    <h2 class="text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-4">Unmatched Value</h2>
                    <p class="text-zinc-500 text-lg">Why industry leaders choose ${data.product_name}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    ${data.benefits.map((benefit: any) => `
                    <div class="bg-white p-10 rounded-3xl shadow-sm border border-zinc-200 hover:shadow-xl transition-all hover:-translate-y-1">
                        <div class="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-8 text-brand-600 font-bold text-3xl">✓</div>
                        <h3 class="text-2xl font-bold text-zinc-900 mb-4">${benefit.title}</h3>
                        <p class="text-zinc-600 leading-relaxed text-lg">${benefit.description}</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="py-32 px-6 lg:px-8 bg-zinc-950 text-white overflow-hidden relative">
            <div class="max-w-4xl mx-auto relative z-10 text-center">
                <h2 class="text-5xl md:text-6xl font-display font-bold mb-8">Join the Revolution.</h2>
                <p class="text-xl md:text-2xl text-zinc-400 mb-12">Experience the future of your industry with ${data.product_name}.</p>
                <button class="px-10 py-5 text-xl font-bold bg-white text-zinc-900 rounded-full hover:bg-zinc-200 hover:scale-105 transition-all">
                    ${data.cta || "Get Started Now"}
                </button>
                <div class="mt-8 flex items-center justify-center gap-6 text-zinc-500 font-medium">
                  <span>No credit card required</span>
                  <span class="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span>
                  <span>Instant access</span>
                </div>
            </div>
        </section>

        <footer class="py-12 text-center text-zinc-400 border-t border-zinc-100 text-sm">
          &copy; ${new Date().getFullYear()} ${data.product_name}. Generated by SalesGen AI.
        </footer>
    </main>
</body>
</html>
    `;
  };

  const handleExportHtml = () => {
    const htmlContent = generateHtmlContent();
    if (!htmlContent) return;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.product_name.toLowerCase().replace(/\s+/g, '-')}-sales-page.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    const htmlContent = generateHtmlContent();
    if (!htmlContent) return;

    try {
      await navigator.clipboard.writeText(htmlContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
      alert("Failed to copy code to clipboard.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading preview...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <p className="text-zinc-400 mb-8">We couldn't find the sales page you're looking for.</p>
        <Link href="/dashboard" className="text-brand-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-zinc-900 font-sans selection:bg-brand-200">
      {/* Admin Bar */}
      <div className="bg-zinc-950 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-white/20 hidden md:block"></div>
          <span className="text-sm font-medium hidden md:block text-zinc-300">Previewing: {data.product_name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyHtml}
            className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            title="Copy HTML to clipboard"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {isCopied ? "Copied!" : "Copy Code"}
          </button>
          <button 
            onClick={handleExportHtml}
            className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export HTML
          </button>
        </div>
      </div>

      {/* Generated Landing Page Content */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50/50 via-white to-white"></div>
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-zinc-900 mb-6"
            >
              {data.headline}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-zinc-600 mb-10 leading-relaxed"
            >
              {data.subheadline}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-brand-600 text-white rounded-full hover:bg-brand-700 hover:scale-105 transition-all shadow-xl shadow-brand-500/20">
                {data.cta || "Get Started Now"}
              </button>
              <div className="text-sm text-zinc-500 font-medium">
                Available for {data.price}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        {data.benefits && Array.isArray(data.benefits) && (
          <section className="py-24 bg-zinc-50 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-900">Why choose {data.product_name}?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.benefits.map((benefit: any, index: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-6 text-brand-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{benefit.title}</h3>
                    <p className="text-zinc-600 leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8 bg-zinc-900 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold mb-6">Ready to transform your workflow?</h2>
            <p className="text-xl text-zinc-400 mb-10">Join thousands of others using {data.product_name} today.</p>
            <button className="px-8 py-4 text-lg font-semibold bg-white text-zinc-900 rounded-full hover:bg-zinc-100 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto">
              {data.cta || "Get Started Now"}
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="mt-6 text-zinc-500 text-sm">Just {data.price}. No hidden fees.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
