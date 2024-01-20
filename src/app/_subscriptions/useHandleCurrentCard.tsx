import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { displayedCardsAtom } from "../Timer"

export const currentCardAtom = atom("")

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
