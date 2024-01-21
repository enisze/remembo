import { atom, useAtom } from "jotai"
import { useCallback } from "react"

export const displayedCardsAtom = atom<string[]>([])
export const useHandleDisplayedCards = () => {
  const [displayedCards, setDisplayedCards] = useAtom(displayedCardsAtom)

  return useCallback(
    (message?: string) => {
      if (!message) {
        setDisplayedCards([])
      } else {
        if (displayedCards.includes(message)) return
        setDisplayedCards((prev) => [...prev, message])
      }
    },
    [setDisplayedCards, displayedCards],
  )
}
