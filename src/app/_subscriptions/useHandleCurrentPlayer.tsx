import { atom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { type Player } from "../Game"

export const currentPlayerAtom = atom<Player | undefined>(undefined)

export const useHandleCurrentPlayer = () => {
  const setCurrentPlayer = useSetAtom(currentPlayerAtom)

  return useCallback(
    (payload: unknown) => {
      setCurrentPlayer(payload?.message as Player)
    },
    [setCurrentPlayer],
  )
}
