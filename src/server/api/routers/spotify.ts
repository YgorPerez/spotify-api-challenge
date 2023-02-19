import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
  getSpotifyPlaylist: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = ctx.session.user.id;
      const accountQuery = await ctx.prisma.account.findFirst({
        where: {
          userId: id,
        },
      });
      const accessToken = accountQuery?.access_token;
      if (!accessToken) return;
      const spotifyPlaylistUrl = "https://api.spotify.com/v1/playlists";
      const spotifyPlaylistResponse = await fetch(
        `${spotifyPlaylistUrl}/${input.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      //   if (!spotifyPlaylistResponse.ok) {
      //     throw new TRPCError({ message: "error", code: "BAD_REQUEST" });
      //   }
      //   type Playlist = z.infer<typeof PlaylistValidator>;
      //   const responseValidator = z.array(PlaylistValidator);
      //   const validResponse = responseValidator.safeParse(
      //     spotifyPlaylistResponse.json()
      //   );
      // data is valid and typed
      return await spotifyPlaylistResponse.json();
    }),
});
