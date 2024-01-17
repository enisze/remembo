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
  const setTeamOne = useSetAtom(teamOneAtom)
  const setTeamTwo = useSetAtom(teamTwoAtom)
  const test = useRef(false)

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    console.log(payload)

    setTeamOne(payload.message.teamOne)
    setTeamTwo(payload.message.teamTwo)
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
