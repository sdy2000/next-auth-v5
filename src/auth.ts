import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "@/data/account";
import {
  deleteTwoFactorConfirmationByUserId,
  getTwoFactorConfirmationByUserId,
} from "@/data/two-factor-confirmation";

declare module "next-auth" {
  // Add role Field in session(user)
  interface Session {
    user: DefaultSession["user"] & {
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id); // Get user by id

      // Prevent sing in without email verification
      if (!existingUser?.emailVerified) return false;

      // Check user 2FA
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await deleteTwoFactorConfirmationByUserId(twoFactorConfirmation.id);
      }

      return true;
    },
    async session({ session, token }) {
      // Add user id in session
      if (token.sub && session.user) session.user.id = token.sub;

      // Add user role in session
      if (token.role && session.user)
        session.user.role = token.role as UserRole;

      // Add user isTwoFactorEnabled in session
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub); // get user
      if (!existingUser) return token; // if user doesn't exist return token

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
