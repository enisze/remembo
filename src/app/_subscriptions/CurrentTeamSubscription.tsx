import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { supabase } from "../_components/supabaseClient"

export const currentTeamAtom = atom("A")

export type Payload = {
  payload: { message: string }
  type: "broadcast"
  event: string
}
export const CurrentTeamSubscription = ({ id }: { id: string }) => {
  const setCurrentTeam = useSetAtom(currentTeamAtom)
  const called = useRef(false)
  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    setCurrentTeam(payload.message)
  }

  useEffect(() => {
    if (called.current) return

    channelA
      .on("broadcast", { event: "currentTeam" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

    called.current = true
  }, [supabase])

  return null
}
