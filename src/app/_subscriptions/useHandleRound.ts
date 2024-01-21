import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const currentRoundAtom = atom(0)

export const useHandleCurrentRound = () => {
  const setRound = useSetAtom(currentRoundAtom)

  return useCallback(
    (message: number) => {
      setRound(message)
    },
    [setRound],
  )
}
