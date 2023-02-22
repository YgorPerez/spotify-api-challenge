import { Cache, Client } from "spotify-api.js";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	protectedTokenProcedure,
	publicProcedure,
} from "../trpc";

export const spotifyRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),
	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
	getSpotifyPlaylist: protectedTokenProcedure
		.input(z.object({ playlistId: z.string() }))
		.query(async ({ ctx, input }) => {
			const client = new Client({
				token: ctx.session.accessToken,
				cacheSettings: {
					playlists: true,
				},
				retryOnRateLimit: true,
			});
			const playlist = await client.playlists.get(input.playlistId);
			Cache.playlists.get(input.playlistId);
			return playlist;
		}),
	getSpotifyAlbum: protectedTokenProcedure
		.input(z.object({ albumId: z.string() }))
		.query(async ({ ctx, input }) => {
			const client = new Client({
				token: ctx.session.accessToken,
				cacheSettings: {
					albums: true,
				},
				retryOnRateLimit: true,
			});
			const album = await client.albums.get(input.albumId);
			Cache.albums.get(input.albumId);
			// cache the album
			return album;
		}),
	getSpotifySearchAlbum: protectedTokenProcedure
		.input(z.object({ searchQuery: z.string() }))
		.query(async ({ ctx, input }) => {
			const client = new Client({
				token: ctx.session.accessToken,
				retryOnRateLimit: true,
			});
			const { tracks, albums, artists } = await client.search(
				input.searchQuery,
				{
					types: ["track", "album", "artist"],
				}
			);
			return { tracks, albums, artists };
		}),
});
