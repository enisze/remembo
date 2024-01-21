import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { teamOneAtom, teamTwoAtom } from "./useHandleTeams"

export const useHandleTimeTeams = () => {
  const setTeamOne = useSetAtom(teamOneAtom)
  const setTeamTwo = useSetAtom(teamTwoAtom)

  return useCallback(
    ({ team, time }: { team: string; time: number }) => {
      if (team === "A") {
        setTeamOne((prev) => ({
          ...prev,
          remainingTime: time,
        }))
      }

      if (team === "B") {
        setTeamTwo((prev) => ({
          ...prev,
          remainingTime: time,
        }))
      }
    },
    [setTeamOne, setTeamTwo],
  )
}
