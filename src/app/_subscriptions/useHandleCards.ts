import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { cardAtom } from "./Subscriptions"

export const useHandleCards = () => {
  const setCards = useSetAtom(cardAtom)

  return useCallback(
    (message: string[]) => {
      setCards((prevCards) => [...prevCards, ...message])
    },
    [setCards],
  )
}
