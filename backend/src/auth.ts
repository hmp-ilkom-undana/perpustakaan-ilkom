import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import pkg from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { setupPlugin } from "./setupPlugin.js";

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:5173"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "MAHASISWA"
      },
      wa_number: {
        type: "string",
        required: false,
      },
      nim: {
        type: "string",
        required: true,
        unique: true,
      }
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [setupPlugin()]
});
