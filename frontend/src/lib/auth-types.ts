import { betterAuth } from "better-auth";

// Ini hanya digunakan untuk mendefinisikan tipe data (TypeScript) di Frontend,
// sehingga kita tidak perlu meng-import langsung dari file backend yang bisa menyebabkan error path.
const dummyAuth = betterAuth({
  database: {} as any,
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      nim: {
        type: "string",
      },
    },
  },
});

export type AuthType = typeof dummyAuth;
