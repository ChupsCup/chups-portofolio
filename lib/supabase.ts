import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// If environment variables are set, create a real Supabase client. Otherwise
// export a minimal stub so the app doesn't crash in the browser when the
// variables are missing (useful for local dev without Supabase configured).
const _supabase: SupabaseClient | any =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: (_table: string) => ({
          select: (_sel?: string) => ({
            order: (_col: string, _opts?: any) =>
              Promise.resolve({
                data: null,
                error: new Error("Supabase not configured"),
              }),
          }),
        }),
      };

export const supabase = _supabase;

// Types untuk database
export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_urls?: string[];
  demo_url?: string;
  github_url?: string;
  technologies: string[];
  created_at: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  technologies: string[];
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface AboutInfo {
  id: number;
  name: string;
  location: string;
  education: string;
  email: string;
  phone: string;
  status: string;
  cv_url?: string;
  created_at: string;
}
