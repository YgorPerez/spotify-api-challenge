import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedTokenProcedure,
  publicProcedure,
} from "../trpc";

export const spotifyRouter = createTRPCRouter({
  hello: publicProcedure
    .meta({ description: "Returns hello + your text" })
    .input(
      z.object({
        text: z.string().describe("The name to say hello too."),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getSecretMessage: protectedProcedure
    .meta({ description: "Shows a message if the user is logged in" })
    .query(() => {
      return "you can now see this secret message!";
    }),
  getPlaylist: protectedTokenProcedure
    .meta({ description: "Gets the playlist using the id" })
    .input(
      z.object({
        playlistId: z.string().describe("The id to get the playlist."),
      })
    )
    .query(async ({ ctx, input }) => {
      const playlist = await ctx.session.client.playlists.get(input.playlistId);
      return playlist;
    }),
  getAlbumTracks: protectedTokenProcedure
    .meta({
      description: "Gets the album and it's tracks using the id of an album",
    })
    .input(
      z.object({
        albumId: z.string().describe("The id to get the album."),
      })
    )
    .query(async ({ ctx, input }) => {
      const album = await ctx.session.client.albums.get(input.albumId);
      const tracks = await ctx.session.client.albums.getTracks(input.albumId);
      return { album, tracks };
    }),
  getArtistAlbums: protectedTokenProcedure
    .meta({
      description: "Gets the artist and it's albums using the id of an album",
    })
    .input(
      z.object({
        artistId: z.string().describe("The id to get the artist."),
      })
    )
    .query(async ({ ctx, input }) => {
      const artist = await ctx.session.client.artists.get(input.artistId);
      const albums = await ctx.session.client.artists.getAlbums(input.artistId);
      return { artist, albums };
    }),
  getTrack: protectedTokenProcedure
    .meta({ description: "Gets a track using an id" })
    .input(
      z.object({
        trackId: z.string().describe("The id to get the track."),
      })
    )
    .query(async ({ ctx, input }) => {
      const track = await ctx.session.client.tracks.get(input.trackId);
      return track;
    }),
  getSearch: protectedTokenProcedure
    .meta({
      description:
        "Gets 50 search results for tracks, albums and artists based on text",
    })
    .input(
      z.object({
        searchQuery: z.string().describe("The text to be searched."),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tracks, albums, artists } = await ctx.session.client.search(
        input.searchQuery,
        {
          types: ["track", "album", "artist"],
          includeExternalAudio: true,
          limit: 50,
        }
      );
      return { tracks, albums, artists };
    }),
});
