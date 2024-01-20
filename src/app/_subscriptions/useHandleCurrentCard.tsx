import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const currentCardAtom = atom("")

export const useHandleCurrentPlayer = () => {
  const setCurrentCard = useSetAtom(currentCardAtom)

  return useCallback(
    (payload: unknown) => {
      setCurrentCard(payload?.message as string)
    },
    [setCurrentCard],
  )
}
