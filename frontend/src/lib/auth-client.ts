import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";
import type { AuthType } from "./auth-types";
import { API_BASE_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [inferAdditionalFields<AuthType>(), usernameClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
