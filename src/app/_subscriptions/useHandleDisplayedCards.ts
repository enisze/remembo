import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const displayedCardsAtom = atom<string[]>([])
export const useHandleDisplayedCards = () => {
  const setDisplayedCards = useSetAtom(displayedCardsAtom)

  return useCallback(
    (payload: unknown) => {
      if (!payload) {
        setDisplayedCards([])
      } else {
        setDisplayedCards((prev) => [...prev, payload?.message as string])
      }
    },
    [setDisplayedCards],
  )
}