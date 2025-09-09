import { supabase } from "../lib/supabase";

export async function uploadToSupabaseFromUri(
  uri,
  fileName,
  contentType = "image/jpeg"
) {
  const response = await fetch(uri);
  const blob = await response.blob();

  // ✅ Get access token from Supabase auth
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("⚠️ Failed to get Supabase session.");
  }

  const accessToken = session.access_token;

  const res = await fetch(
    `https://whieggrrnkpwjvicmkfj.supabase.co/storage/v1/object/avatars/${fileName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
      },
      body: blob,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return `https://whieggrrnkpwjvicmkfj.supabase.co/storage/v1/object/public/avatars/${fileName}`;
}
