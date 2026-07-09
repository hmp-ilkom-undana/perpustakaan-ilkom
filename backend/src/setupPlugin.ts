import { createAuthEndpoint, APIError } from "better-auth/api";
import { z } from "zod";

export const setupPlugin = () => {
    return {
        id: "setup-password-plugin",
        endpoints: {
            checkSetup: createAuthEndpoint("/check-setup", {
                method: "POST",
                body: z.object({
                    loginId: z.string(),
                    wa_number: z.string().optional()
                })
            }, async (ctx) => {
                const { loginId, wa_number } = ctx.body;
                
                let user;
                if (loginId.includes('@')) {
                    const userRecord = await ctx.context.internalAdapter.findUserByEmail(loginId);
                    user = userRecord?.user;
                } else {
                    user = await ctx.context.adapter.findOne({
                        model: "user",
                        where: [{ field: "wa_number", value: loginId }]
                    });
                }
                
                if (!user) {
                    throw new APIError("BAD_REQUEST", { message: "Data pengguna tidak ditemukan." });
                }

                if (wa_number && user.wa_number !== wa_number) {
                    throw new APIError("BAD_REQUEST", { message: "Data pengguna tidak cocok." });
                }

                // Check if credential account already exists
                const accounts = await ctx.context.internalAdapter.findAccounts(user.id);
                const hasCredential = accounts.some(acc => acc.providerId === "credential" && acc.password);
                
                if (hasCredential) {
                    return ctx.json({ requiresSetup: false, email: user.email });
                }

                return ctx.json({ requiresSetup: true, name: user.name, email: user.email });
            }),
            setupPassword: createAuthEndpoint("/setup-password", {
                method: "POST",
                body: z.object({
                    email: z.string().email(),
                    wa_number: z.string().optional(),
                    newPassword: z.string().min(8)
                })
            }, async (ctx) => {
                const { email, wa_number, newPassword } = ctx.body;

                const userRecord = await ctx.context.internalAdapter.findUserByEmail(email);
                const user = userRecord?.user;
                
                if (!user) {
                    throw new APIError("BAD_REQUEST", { message: "Data pengguna tidak ditemukan." });
                }

                if (wa_number && user.wa_number !== wa_number) {
                    throw new APIError("BAD_REQUEST", { message: "Data pengguna tidak cocok." });
                }

                const accounts = await ctx.context.internalAdapter.findAccounts(user.id);
                const hasCredential = accounts.some(acc => acc.providerId === "credential" && acc.password);
                
                if (hasCredential) {
                    throw new APIError("BAD_REQUEST", { message: "Akun ini sudah memiliki password. Silakan login." });
                }

                const passwordHash = await ctx.context.password.hash(newPassword);
                await ctx.context.internalAdapter.linkAccount({
                    userId: user.id,
                    providerId: "credential",
                    accountId: user.id,
                    password: passwordHash,
                });

                return ctx.json({ success: true });
            })
        }
    }
}
