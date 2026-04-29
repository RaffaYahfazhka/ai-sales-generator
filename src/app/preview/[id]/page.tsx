import { createClient } from "@/utils/supabase/server";
import PreviewClient from "./PreviewClient";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();

  // Try to fetch from DB first
  const { data: pageData } = await supabase
    .from("sales_pages")
    .select("*")
    .eq("id", id)
    .single();

  return <PreviewClient id={id} serverData={pageData} />;
}
