"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/useAppStore";

export function useLabAuth() {
  const { sudahLogin, isAdmin, adminUser, checkTeacherSession } = useAppStore();
  const [isChecking, setIsChecking] = useState(!sudahLogin);

  useEffect(() => {
    let mounted = true;

    if (!sudahLogin) {
      checkTeacherSession().then(() => {
        if (mounted) {
          setIsChecking(false);
        }
      });
    } else {
      setIsChecking(false);
    }

    return () => {
      mounted = false;
    };
  }, [sudahLogin, checkTeacherSession]);

  return {
    isAuthorized: sudahLogin,
    isAdmin,
    adminUser,
    isChecking,
  };
}
