"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteSalesPage(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("sales_pages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}
