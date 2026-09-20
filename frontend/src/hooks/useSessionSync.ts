import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export type AuthSyncAction = "LOGIN" | "LOGOUT" | "SESSION_CHANGED";

export interface AuthSyncMessage {
  type: "AUTH_EVENT";
  action: AuthSyncAction;
  timestamp: number;
}

const AUTH_CHANNEL_NAME = "auth-sync";
const STORAGE_SYNC_KEY = "auth-sync-event";

export function broadcastAuthEvent(action: AuthSyncAction) {
  const message: AuthSyncMessage = {
    type: "AUTH_EVENT",
    action,
    timestamp: Date.now(),
  };

  try {
    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
  } catch {
    // BroadcastChannel unsupported or restricted in current context
  }

  try {
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(message));
  } catch {
    // localStorage unavailable
  }
}

export function useSessionSync(requiredRole?: "MAHASISWA" | "PETUGAS" | "ADMIN") {
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();
  const isRedirectingRef = useRef(false);

  const performRedirectToLogin = (reasonMessage: string) => {
    if (isRedirectingRef.current) return;
    isRedirectingRef.current = true;

    queryClient.clear();

    toast.warning("Sesi Berubah", {
      id: "auth-sync-toast",
      description: reasonMessage,
      duration: 4000,
    });

    setTimeout(() => {
      window.location.replace("/login");
    }, 500);
  };

  // 1. Initial / Reactive Role Guard
  useEffect(() => {
    if (isPending || !requiredRole) return;

    if (session?.user) {
      const currentRole = (session.user as any)?.role;
      if (currentRole && currentRole !== requiredRole) {
        performRedirectToLogin(
          `Sesi saat ini adalah ${currentRole}. Halaman ini hanya untuk ${requiredRole}. Mengalihkan ke login...`
        );
      }
    }
  }, [session, isPending, requiredRole]);

  // 2. Real-time Multi-Tab Sync Listener
  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    const handleSyncAction = async (action: AuthSyncAction) => {
      if (isRedirectingRef.current) return;

      if (action === "LOGOUT") {
        performRedirectToLogin(
          "Akun telah keluar di tab lain. Mengalihkan ke halaman login..."
        );
        return;
      }

      try {
        const latestSessionRes = await authClient.getSession();
        const latestUser = latestSessionRes?.data?.user;

        if (!latestUser) {
          performRedirectToLogin(
            "Sesi telah berakhir di tab lain. Mengalihkan ke halaman login..."
          );
          return;
        }

        const latestRole = (latestUser as any)?.role;
        if (requiredRole && latestRole !== requiredRole) {
          performRedirectToLogin(
            `Terdeteksi aktivitas login baru (${latestRole}) di tab lain. Mengalihkan ke halaman login...`
          );
        }
      } catch (err) {
        console.error("[useSessionSync] Gagal memverifikasi sesi terbaru:", err);
      }
    };

    try {
      channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<AuthSyncMessage>) => {
        if (event.data && event.data.type === "AUTH_EVENT") {
          handleSyncAction(event.data.action);
        }
      };
    } catch {
      // Fallback handled by storage listener below
    }

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === STORAGE_SYNC_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as AuthSyncMessage;
          if (parsed && parsed.type === "AUTH_EVENT") {
            handleSyncAction(parsed.action);
          }
        } catch {
          // Ignore invalid JSON
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [requiredRole]);
}
