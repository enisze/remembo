import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { z } from "zod"
import { playerSchema } from "../Game"

export const teamSchema = z.object({
  players: playerSchema.array(),
  remainingTime: z.number(),
  points: z.number(),
})

export type Team = z.infer<typeof teamSchema>

export const teamOneAtom = atom<Team>({
  players: [],
  remainingTime: 0,
  points: 0,
})
export const teamTwoAtom = atom<Team>({
  players: [],
  remainingTime: 0,
  points: 0,
})

export const useHandleTeams = () => {
  const setTeamOne = useSetAtom(teamOneAtom)
  const setTeamTwo = useSetAtom(teamTwoAtom)

  return useCallback(
    (teamOne: Team, teamTwo: Team) => {
      setTeamOne(teamOne)
      setTeamTwo(teamTwo)
    },
    [setTeamOne, setTeamTwo],
  )
}
