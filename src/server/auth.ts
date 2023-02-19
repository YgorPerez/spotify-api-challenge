import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import {
	getServerSession,
	TokenSet,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
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
		async session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			const [spotify] = await prisma.account.findMany({
				where: { userId: user.id },
			});
			if (!spotify?.expires_at) return session;

			if (spotify.expires_at < Math.floor(Date.now() / 1000)) {
				// the token has expired
				try {
					const spotifyTokenResponse = await fetch(
						"https://accounts.spotify.com/api/token",
						{
							headers: {
								"Content-Type":
									"application/x-www-form-urlencoded",
							},
							body: new URLSearchParams({
								client_id: process.env
									.SPOTIFY_CLIENT_ID as string,
								client_secret: process.env
									.SPOTIFY_CLIENT_SECRET as string,
								grant_type: "refresh_token",
								refresh_token: spotify.refresh_token ?? "",
							}),
							method: "POST",
						}
					);

					const tokens: TokenSet = await spotifyTokenResponse.json();

					if (!spotifyTokenResponse.ok) throw tokens;

					console.log("Refreshed access token", tokens);

					await prisma.account.update({
						data: {
							access_token: tokens.access_token,
							expires_at: Date.now() + 3600000,
							refresh_token:
								tokens.refresh_token ?? spotify.refresh_token,
						},
						where: {
							provider_providerAccountId: {
								provider: "spotify",
								providerAccountId: spotify.providerAccountId,
							},
						},
					});
				} catch (error) {
					console.error("Error refreshing access token", error);
				}
			}
			return session;
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
