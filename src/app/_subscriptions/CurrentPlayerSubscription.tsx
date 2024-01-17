import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { type Player } from "../Game"
import { supabase } from "../_components/supabaseClient"

export const currentPlayerAtom = atom<Player | undefined>(undefined)

export type Payload = {
  payload: { message: Player }
  type: "broadcast"
  event: string
}
export const CurrentPlayerSubscription = ({ id }: { id: string }) => {
  const setCurrentPlayer = useSetAtom(currentPlayerAtom)
  const called = useRef(false)
  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    setCurrentPlayer(payload.message)
  }

  useEffect(() => {
    if (called.current) return

    channelA
      .on("broadcast", { event: "currentPlayer" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

    called.current = true
  }, [supabase])

  return null
}
