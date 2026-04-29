import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Layout, ExternalLink, Trash2, LogOut } from "lucide-react";
import { logout } from "../login/actions";
import DeleteButton from "./DeleteButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  
  const userId = user.id;

  // Fetch sales pages from DB
  const { data: salesPages } = await supabase
    .from("sales_pages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Your Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage your generated sales pages</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/generate"
              className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Generate New Page
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="p-2.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </header>

        {(!salesPages || salesPages.length === 0) ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Layout className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No pages generated yet</h2>
            <p className="text-zinc-400 max-w-md mb-8">
              Create your first high-converting sales page in seconds using the power of AI.
            </p>
            <Link
              href="/generate"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesPages.map((page) => (
              <div key={page.id} className="glass border border-white/10 rounded-2xl p-6 group hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col bg-zinc-900/40">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-white line-clamp-1 group-hover:text-brand-300 transition-colors">{page.product_name}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{page.headline}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs font-medium px-2 py-1 bg-white/5 border border-white/10 rounded-md text-zinc-400">
                      {new Date(page.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-white/10 mt-auto">
                  <Link
                    href={`/preview/${page.id}`}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-sm font-medium py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </Link>
                  <DeleteButton id={page.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
