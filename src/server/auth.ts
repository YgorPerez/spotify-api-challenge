/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "../env.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      } 
      if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.error = token?.error;

      return session;
    },
    jwt({ token, user, account }) {
      console.log({ token });
      console.log({ user });
      console.log({ account });
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + (account.expires_at ?? 0) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `user-read-currently-playing playlist-read-collaborative
 user-read-recently-played user-top-read user-read-email playlist-read-private
`,
        },
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Spotify provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  //   pages: {
  //     signIn: "/auth/signin",
  //   },
};

const refreshAccessToken = async (token: JWT) => {
  console.log({ token });
  try {
    const url = "https://accounts.spotify.com/v1/refresh";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const query = new URLSearchParams({
      refresh_token: token.refreshToken ?? "",
    });

    const response = await fetch(url + query, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const tokens = await response.json();
    return {
      ...token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log({ error });

    return {
      ...token,
      error: "refreshAccessTokenError",
    };
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
