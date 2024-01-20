import { atom } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { getChannel } from "../_components/supabaseClient"
import { useHandleCards } from "./useHandleCards"
import { useHandleCurrentPlayer } from "./useHandleCurrentPlayer"
import { useHandleCurrentTeam } from "./useHandleCurrentTeam"
import { useHandleTeams } from "./useHandleTeams"
import { useHandleTimer } from "./useHandleTimer"

export type Payload = {
  payload: unknown
  type: "broadcast"
  event: "cards" | "teams" | "currentPlayer" | "currentTeam" | "timer"
}
export const cardAtom = atom<string[]>([])
export const Subscriptions = ({ id }: { id: string }) => {
  const called = useRef(false)
  const channel = getChannel(id)

  const handleCardsSubscription = useHandleCards()
  const handleCurrentTeam = useHandleCurrentTeam()
  const handleCurrentPlayer = useHandleCurrentPlayer()
  const handleTeams = useHandleTeams()
  const handleTimer = useHandleTimer()

  const messageReceived = useCallback(
    ({ payload, event }: Payload) => {
      if (event === "cards") {
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

      if (event === "timer") {
        handleTimer(payload)
      }
    },
    [
      handleCardsSubscription,
      handleCurrentTeam,
      handleCurrentPlayer,
      handleTeams,
      handleTimer,
    ],
  )

  useEffect(() => {
    if (called.current) return

    channel
      .on("broadcast", { event: "*" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

    called.current = true
  }, [channel, messageReceived])

  return null
}
