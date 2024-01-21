import { atom, useAtom } from "jotai"
import { useCallback } from "react"

export const displayedCardsAtom = atom<string[]>([])
export const useHandleDisplayedCards = () => {
  const [displayedCards, setDisplayedCards] = useAtom(displayedCardsAtom)

  return useCallback(
    (payload: unknown) => {
      if (!payload.message) {
        setDisplayedCards([])
      } else {
        const item = payload?.message as string
        console.log(item, displayedCards)
        if (displayedCards.includes(item)) return
        setDisplayedCards((prev) => [...prev, item])
      }
    },
    [setDisplayedCards, displayedCards],
  )
}
