import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const currentCardAtom = atom("")

export const useHandleCurrentCard = () => {
  const setCurrentCard = useSetAtom(currentCardAtom)

  return useCallback(
    (message: string) => {
      setCurrentCard(message)
    },
    [setCurrentCard],
  )
}
