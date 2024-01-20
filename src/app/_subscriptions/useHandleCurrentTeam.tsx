import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const currentTeamAtom = atom("A")

export const useHandleCurrentTeam = () => {
  const setCurrentTeam = useSetAtom(currentTeamAtom)

  return useCallback(
    (payload: unknown) => {
      setCurrentTeam(payload?.message as string)
    },
    [setCurrentTeam],
  )
}
