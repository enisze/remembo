import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { type Player } from "../Game"
import { supabase } from "../_components/supabaseClient"

type Payload = {
  payload: { message: { teamOne: Team; teamTwo: Team } }
  type: "broadcast"
  event: string
}

export type Team = {
  players: Player[]
  remainingTime: number
  points: number
}

export const teamOneAtom = atom<Team>({
  players: [],
  remainingTime: 0,
  points: 0,
})
export const teamTwoAtom = atom<Team>({
  players: [],
  remainingTime: 0,
  points: 0,
})

export const TeamSubscription = ({ id }: { id: string }) => {
  const setTeamA = useSetAtom(teamOneAtom)
  const setTeamB = useSetAtom(teamTwoAtom)
  const test = useRef(false)

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    console.log(payload)

    setTeamA(payload.message.teamOne)
    setTeamB(payload.message.teamTwo)
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
