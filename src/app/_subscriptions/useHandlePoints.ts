import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { teamOneAtom, teamTwoAtom } from "./useHandleTeams"

export const useHandlePoints = () => {
  const setTeamOne = useSetAtom(teamOneAtom)
  const setTeamTwo = useSetAtom(teamTwoAtom)

  return useCallback(
    (payload: unknown) => {
      if (payload?.message.team === "A") {
        setTeamOne((prev) => ({
          ...prev,
          points: prev.points + 1,
        }))
      }

      if (payload?.message.team === "B") {
        setTeamTwo((prev) => ({
          ...prev,
          points: prev.points + 1,
        }))
      }
    },
    [setTeamOne, setTeamTwo],
  )
}
