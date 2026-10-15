import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ডেটাবেজ কনফিগারেশন (ডিফল্টভাবে লোকাল SQLite ব্যবহার করা যেতে পারে)
    database: {
        provider: "sqlite",
            url: "sqlite.db",
              },
                // ইমেইল ও পাসওয়ার্ড অথেন্টিকেশন চালু রাখা
                  emailAndPassword: {
                      enabled: true,
                        },
                          // সোশ্যাল লগইন প্রোভাইডারসমূহ
                            socialProviders: {
                                google: {
                                      clientId: process.env.GOOGLE_CLIENT_ID || "",
                                            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                                                },
                                                    github: {
                                                          clientId: process.env.GITHUB_CLIENT_ID || "",
                                                                clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
                                                                    },
                                                                      },
                                                                      });