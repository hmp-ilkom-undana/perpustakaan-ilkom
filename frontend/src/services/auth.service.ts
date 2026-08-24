import { authClient } from "@/lib/auth-client";

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
   * Mengakhiri sesi pengguna aktif.
   */
  async signOutUser() {
    return await authClient.signOut();
  },

  /**
   * Mengambil data sesi pengguna yang sedang aktif.
   */
  async getSession() {
    return await authClient.getSession();
  },
};
