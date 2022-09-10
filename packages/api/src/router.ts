import * as t from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Media, MediaType, PrismaClient } from "@prisma/client";
import * as z from "zod";

import { supabase } from "./supabase";

const prisma = new PrismaClient();

const USER_SCHEMA = z.object({
  picture: z.string().url(),
  nickname: z.string(),
  sub: z.string(),
});

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  async function getUser() {
    const { user } = await supabase.auth.api.getUserByCookie(req, res);

    if (!user) return null;

    const data = USER_SCHEMA.safeParse(user.user_metadata);

    if (!data.success) return null;

    return data.data;
  }

  const user = await getUser();

  return { user, req, res };
}

type Context = t.inferAsyncReturnType<typeof createContext>;

export const router = t
  .router<Context>()
  .query("user", {
    resolve({ ctx }) {
      if (!ctx.user)
        throw new t.TRPCError({
          code: "UNAUTHORIZED",
        });

      return prisma.user.upsert({
        where: {
          twitchId: ctx.user.sub,
        },
        create: {
          twitchId: ctx.user.sub,
          displayName: ctx.user.nickname,
        },
        update: {},
      });
    },
  })
  .query("joshStats", {
    resolve() {
      return prisma.joshStats.upsert({
        where: {
          id: 0,
        },
        create: {},
        update: {},
      });
    },
  })
  .query("media", {
    async resolve() {
      const media = await prisma.media.findMany();

      return media.reduce(
        (acc, item) => {
          acc[item.type].push(item);
          return acc;
        },
        {
          [MediaType.Audio]: [],
          [MediaType.Video]: [],
        } as Record<MediaType, Media[]>
      );
    },
  })
  .query("secretBits", {
    async resolve() {
      return prisma.secretBit.findMany();
    },
  });

// export type definition of API
export type Router = typeof router;

export const handler = trpcNext.createNextApiHandler({
  router,
  createContext,
});
