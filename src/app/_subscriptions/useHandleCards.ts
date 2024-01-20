import { useSetAtom } from "jotai"
import { useCallback } from "react"
import { cardAtom } from "./Subscriptions"

export const useHandleCards = () => {
  const setCards = useSetAtom(cardAtom)

  return useCallback(
    (payload: unknown) => {
      setCards((prevCards) => [...prevCards, ...(payload?.message as string[])])
    },
    [setCards],
  )
}
