import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { teamOneAtom, teamTwoAtom } from "./useHandleTeams"

export const useHandleTimeTeams = () => {
  const setTeamOne = useSetAtom(teamOneAtom)
  const setTeamTwo = useSetAtom(teamTwoAtom)

  return useCallback(
    (payload: unknown) => {
      if (payload?.message.team === "A") {
        setTeamOne((prev) => ({
          ...prev,
          remainingTime: payload?.message.time as number,
        }))
      }

      if (payload?.message.team === "B") {
        setTeamTwo((prev) => ({
          ...prev,
          remainingTime: payload?.message.time as number,
        }))
      }
    },
    [setTeamOne, setTeamTwo],
  )
}
