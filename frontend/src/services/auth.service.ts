import { authClient } from "@/lib/auth-client";
import { broadcastAuthEvent } from "@/hooks/useSessionSync";

export interface StudentSignUpPayload {
  email: string;
  password: string;
  name: string;
  nim: string;
  username: string;
  wa_number: string;
}

export const authService = {
  /**
   * Autentikasi masuk menggunakan alamat email dan kata sandi.
   */
  async signInWithEmail(email: string, password: string) {
    return await authClient.signIn.email({
      email: email.toLowerCase(),
      password,
    });
  },

  /**
   * Autentikasi masuk menggunakan username / NIM (khusus Mahasiswa).
   */
  async signInWithUsername(username: string, password: string) {
    return await authClient.signIn.username({
      username,
      password,
    });
  },

  /**
   * Pendaftaran akun mandiri untuk Mahasiswa baru.
   */
  async signUpStudent(payload: StudentSignUpPayload) {
    return await authClient.signUp.email({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      nim: payload.nim,
      username: payload.username,
      wa_number: payload.wa_number,
    });
  },

  /**
   * Mengirim permintaan tautan reset kata sandi ke alamat email pengguna.
   */
  async forgotPassword(email: string, redirectTo?: string) {
    const targetRedirect =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/reset-sandi`
        : "http://localhost:5173/reset-sandi");

    return await authClient.requestPasswordReset({
      email: email.trim().toLowerCase(),
      redirectTo: targetRedirect,
    });
  },

  /**
   * Mengatur ulang kata sandi baru menggunakan token verifikasi email.
   */
  async resetPassword(newPassword: string, token: string) {
    return await authClient.resetPassword({
      newPassword,
      token,
    });
  },

  /**
   * Mengakhiri sesi pengguna aktif.
   */
  async signOutUser() {
    broadcastAuthEvent("LOGOUT");
    return await authClient.signOut();
  },

  /**
   * Mengambil data sesi pengguna yang sedang aktif.
   */
  async getSession() {
    return await authClient.getSession();
  },
};
