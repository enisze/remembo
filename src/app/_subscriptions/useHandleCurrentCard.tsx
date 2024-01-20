import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const currentCardAtom = atom("")

export const displayedCardsAtom = atom<string[]>([])

export const useHandleCurrentCard = () => {
  const setCurrentCard = useSetAtom(currentCardAtom)

  const setDisplayedCards = useSetAtom(displayedCardsAtom)

  return useCallback(
    (payload: unknown) => {
      setCurrentCard(payload?.message as string)

      setDisplayedCards((cards) => [...cards, payload?.message as string])
    },
    [setCurrentCard, setDisplayedCards],
  )
}
