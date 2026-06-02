import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "vitalis_admin_unlocked";

export const useAdminAuth = () => {
  const [unlocked, setUnlocked] = useState<boolean>(() => sessionStorage.getItem(KEY) === "1");
  const [loading, setLoading] = useState(false);

  const login = async (password: string): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "admin_password")
      .maybeSingle();
    setLoading(false);
    if (error || !data) return false;
    if (data.value === password) {
      sessionStorage.setItem(KEY, "1");
      setUnlocked(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    setUnlocked(false);
  };

  // re-check on mount in case storage is cleared elsewhere
  useEffect(() => {
    const onStorage = () => setUnlocked(sessionStorage.getItem(KEY) === "1");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { unlocked, loading, login, logout };
};
