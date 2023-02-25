import { Client } from "spotify-api.js";
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
	getPlaylist: protectedTokenProcedure
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
			return playlist;
		}),
	getAlbumTracks: protectedTokenProcedure
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
			const tracks = await client.albums.getTracks(input.albumId);
			return { album, tracks };
		}),
	getArtistAlbums: protectedTokenProcedure
		.input(z.object({ artistId: z.string() }))
		.query(async ({ ctx, input }) => {
			const client = new Client({
				token: ctx.session.accessToken,
				cacheSettings: {
					artists: true,
					albums: true,
				},
				retryOnRateLimit: true,
			});
			const artist = await client.artists.get(input.artistId);
			const albums = await client.artists.getAlbums(input.artistId);
			return { artist, albums };
		}),
	getTrack: protectedTokenProcedure
		.input(z.object({ trackId: z.string() }))
		.query(async ({ ctx, input }) => {
			const client = new Client({
				token: ctx.session.accessToken,
				cacheSettings: {
					tracks: true,
				},
				retryOnRateLimit: true,
			});
			const track = await client.tracks.get(input.trackId);
			return track;
		}),
	getSearch: protectedTokenProcedure
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
					includeExternalAudio: true,
				}
			);
			return { tracks, albums, artists };
		}),
});
