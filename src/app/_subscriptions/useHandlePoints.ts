import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { teamOneAtom, teamTwoAtom } from "./useHandleTeams"

export const useHandlePoints = () => {
  const setTeamOne = useSetAtom(teamOneAtom)
  const setTeamTwo = useSetAtom(teamTwoAtom)

  return useCallback(
    (message: string) => {
      if (message === "A") {
        setTeamOne((prev) => ({
          ...prev,
          points: prev.points + 1,
        }))
      }

      if (message === "B") {
        setTeamTwo((prev) => ({
          ...prev,
          points: prev.points + 1,
        }))
      }
    },
    [setTeamOne, setTeamTwo],
  )
}
