import Link from "next/link";
import { login, signup } from "./actions";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-white/5 hover:bg-white/10 flex items-center group text-sm transition-colors border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <div className="w-full max-w-md flex flex-col gap-8 glass-card p-8 md:p-10 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-semibold">Welcome back</h1>
          <p className="text-sm text-zinc-400 mt-2">Sign in or create an account to continue</p>
        </div>

        <form className="flex-1 flex flex-col w-full gap-4 text-zinc-300">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-zinc-600"
              name="email"
              placeholder="you@example.com"
              defaultValue="demo@salesgen.ai"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="bg-zinc-900/50 border border-white/10 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-zinc-600"
              type="password"
              name="password"
              placeholder="••••••••"
              defaultValue="demo123456"
              required
            />
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <button
              formAction={login}
              className="bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg px-4 py-3 transition-all flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-brand-500/25"
            >
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              formAction={signup}
              className="border border-white/10 bg-white/5 rounded-lg px-4 py-3 text-white hover:bg-white/10 transition-colors"
            >
              Sign Up
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xs text-zinc-500">
              Testing? Just click <strong className="text-zinc-400">Sign Up</strong> to create the demo account, or <strong className="text-zinc-400">Sign In</strong> if you already have.
            </p>
          </div>
          
          {resolvedParams?.message && (
            <p className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center rounded-lg">
              {resolvedParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
