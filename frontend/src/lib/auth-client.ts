import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";
import type { auth } from "../../../backend/src/auth";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  plugins: [inferAdditionalFields<typeof auth>(), usernameClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
