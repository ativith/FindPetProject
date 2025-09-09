import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { StreamChat } from "stream-chat";
import { OverlayProvider, Chat } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";
import { tokenProvider } from "../ีีีutils/tokenProvider";
import { STREAM_API_KEY } from "@env";
// สร้าง StreamChat instance เดียว (singleton)
const client = StreamChat.getInstance(STREAM_API_KEY);

export function ChatProvider({ children }) {
  const { profile, session } = useAuth(); // ดึง session ด้วย
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ถ้ายังไม่ได้ล็อกอิน → ไม่ต้อง connect chat
    if (!session?.user) {
      setIsReady(false); // ไม่ต้องรอ
      client.disconnectUser().catch(() => {}); // ป้องกัน error
      return;
    }

    // ถ้ามี session แต่ profile ยังไม่มา → รอ
    if (!profile) {
      setIsReady(false);
      return;
    }

    let isCancelled = false;

    const connect = async () => {
      try {
        // ถ้าเชื่อมแล้ว ไม่ต้อง connect อีก
        if (client.user?.id === profile.id) {
          setIsReady(true);
          return;
        }
        let imageUrl = null;

        if (profile?.avatar_url) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.avatar_url);
          imageUrl = data?.publicUrl ?? null;
        }

        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name,
            image: imageUrl,
          },
          tokenProvider
        );

        if (!isCancelled) setIsReady(true);
      } catch (error) {
        console.error("Chat connect error:", error);
        if (!isCancelled) setIsReady(false);
      }
    };

    connect();

    return () => {
      isCancelled = true;
      if (isReady) {
        client.disconnectUser().catch(() => {});
      }
      setIsReady(false);
    };
  }, [profile?.id, session?.user]);

  // กรณียังไม่ได้ล็อกอิน → render children เลย (Auth จะทำงาน)
  if (!session?.user) {
    return <>{children}</>;
  }

  // กรณีล็อกอินแล้ว แต่ยังไม่ ready → render loader
  if (!profile || !isReady) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // กรณีล็อกอิน + chat ready → render children ภายใน Chat
  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}

export { client };
