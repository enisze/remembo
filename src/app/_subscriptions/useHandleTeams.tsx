import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { type Player } from "../Game"

export type Team = {
  players: Player[]
  remainingTime: number
  points: number
}

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
    (payload: unknown) => {
      setTeamOne(payload.message.teamOne)
      setTeamTwo(payload.message.teamTwo)
    },
    [setTeamOne, setTeamTwo],
  )
}
