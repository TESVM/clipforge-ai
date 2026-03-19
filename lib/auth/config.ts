import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.email === env.demoUserEmail &&
          credentials.password === env.demoUserPassword
        ) {
          return {
            id: "user_demo",
            name: "ClipForge Demo",
            email: env.demoUserEmail
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = "pro";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) ?? "pro";
      }
      return session;
    }
  },
  secret: env.nextAuthSecret
};
