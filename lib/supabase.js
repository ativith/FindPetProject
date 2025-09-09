import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { PROJECT_URL, PROJECT_ANON_KEY } from "@env";

const supabaseUrl = PROJECT_URL;
const supabaseAnonKey = PROJECT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
