import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const timerAtom = atom(5)

export const useHandleTimer = () => {
  const setTimer = useSetAtom(timerAtom)

  return useCallback(
    (message: number) => {
      setTimer(message)
    },
    [setTimer],
  )
}
