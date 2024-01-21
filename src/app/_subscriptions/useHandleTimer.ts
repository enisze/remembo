import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"

export const timerAtom = atom(60)

export const useHandleTimer = () => {
  const setTimer = useSetAtom(timerAtom)

  return useCallback(
    (payload: unknown) => {
      setTimer(payload?.message as number)
    },
    [setTimer],
  )
}
