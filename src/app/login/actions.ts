"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message)
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const adminClient = createAdminClient();
  
  // 1. Create user as admin and force email confirmation to be true
  const { error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    console.error('Signup create error:', createError.message);
    // If the user already exists, we shouldn't throw an error here, 
    // we'll just try to log them in anyway below.
    if (!createError.message.toLowerCase().includes('already registered')) {
      redirect(`/login?message=${encodeURIComponent(createError.message)}`);
    }
  }

  // 2. Log the user in with the standard client to set cookies
  const supabase = await createClient();
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('Signup login error:', loginError.message);
    redirect(`/login?message=${encodeURIComponent(loginError.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
