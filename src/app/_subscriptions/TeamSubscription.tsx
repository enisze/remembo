import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { type Player } from "../Game"
import { supabase } from "../_components/supabaseClient"

export type Payload = {
  payload: { message: { teamA: Player[]; teamB: Player[] } }
  type: "broadcast"
  event: string
}

export const teamAState = atom<Player[]>([])
export const teamBState = atom<Player[]>([])

export const TeamSubscription = ({ id }: { id: string }) => {
  const setTeamA = useSetAtom(teamAState)
  const setTeamB = useSetAtom(teamBState)
  const test = useRef(false)

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    setTeamA(payload.message.teamA)
    setTeamB(payload.message.teamB)
  }

  useEffect(() => {
    if (test.current) return

    channelA
      .on("broadcast", { event: "teams" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

    test.current = true
  }, [supabase])

  return null
}
