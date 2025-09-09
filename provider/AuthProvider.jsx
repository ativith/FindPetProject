import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // เพิ่ม loading state

  useEffect(() => {
    // โหลด session ตอน mount
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    // ตั้ง listener สำหรับ auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        setProfile(null);
        setLoading(false); // โหลดเสร็จแล้ว แม้ไม่มี user
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (error) {
        console.log("Error fetching profile:", error.message);
      } finally {
        setLoading(false); // โหลดเสร็จ
      }
    };

    fetchProfile();
  }, [session?.user]);

  return (
    <AuthContext.Provider value={{ session, user: session?.user, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
