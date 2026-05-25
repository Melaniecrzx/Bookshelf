import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testSupabaseConnection() {
  const { data, error } = await supabase.from("books").select("*");
  if (error) {
    console.error("[Supabase] Erreur de connexion :", error.message);
  } else {
    console.log("[Supabase] Connexion OK — livres récupérés :", data);
  }
}
