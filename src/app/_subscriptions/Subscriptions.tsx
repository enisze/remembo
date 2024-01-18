import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { getChannel, supabase } from "../_components/supabaseClient"
import { useHandleCards } from "./useHandleCards"
import { useHandleCurrentPlayer } from "./useHandleCurrentPlayer"
import { useHandleCurrentTeam } from "./useHandleCurrentTeam"
import { useHandleTeams } from "./useHandleTeams"

export type Payload = {
  payload: unknown
  type: "broadcast"
  event: "card" | "teams" | "currentPlayer" | "currentTeam"
}
export const cardAtom = atom<string[]>([])
export const Subscriptions = ({ id }: { id: string }) => {
  const setCards = useSetAtom(cardAtom)
  const called = useRef(false)
  const channel = getChannel(id)

  const handleCardsSubscription = useHandleCards()
  const handleCurrentTeam = useHandleCurrentTeam()
  const handleCurrentPlayer = useHandleCurrentPlayer()
  const handleTeams = useHandleTeams()

  const messageReceived = ({ payload, event }: Payload) => {
    if (event === "card") {
      handleCardsSubscription(payload)
    }
    if (event === "currentTeam") {
      handleCurrentTeam(payload)
    }

    if (event === "currentPlayer") {
      handleCurrentPlayer(payload)
    }

    if (event === "teams") {
      handleTeams(payload)
    }
  }

  useEffect(() => {
    if (called.current) return

    channel
      .on("broadcast", { event: "*" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

    called.current = true
  }, [supabase])

  return null
}
