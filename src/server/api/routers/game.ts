import { createTRPCRouter, publicProcedure } from "../trpc"

export const game = createTRPCRouter({
  test: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.query.round.findMany()
  }),
})
