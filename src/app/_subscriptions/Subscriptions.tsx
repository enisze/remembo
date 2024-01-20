import { atom, useAtomValue } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { getChannel } from "../_components/supabaseClient"
import { gameIdAtom } from "../page"
import { useHandleCards } from "./useHandleCards"
import { useHandleCurrentCard } from "./useHandleCurrentCard"
import { useHandleCurrentPlayer } from "./useHandleCurrentPlayer"
import { useHandleCurrentTeam } from "./useHandleCurrentTeam"
import { useHandleDisplayedCards } from "./useHandleDisplayedCards"
import { useHandleTeams } from "./useHandleTeams"
import { useHandleTimer } from "./useHandleTimer"

export type Payload = {
  payload: unknown
  type: "broadcast"
  event:
    | "cards"
    | "teams"
    | "currentPlayer"
    | "currentTeam"
    | "timer"
    | "currentCard"
    | "displayedCards"
}
export const cardAtom = atom<string[]>([])
export const Subscriptions = () => {
  const called = useRef(false)

  const id = useAtomValue(gameIdAtom)

  const channel = getChannel(id)

  const handleCardsSubscription = useHandleCards()
  const handleCurrentTeam = useHandleCurrentTeam()
  const handleCurrentPlayer = useHandleCurrentPlayer()
  const handleTeams = useHandleTeams()
  const handleTimer = useHandleTimer()
  const handleCurrentCard = useHandleCurrentCard()

  const handleDisplayedCards = useHandleDisplayedCards()

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

      if (event === "currentCard") {
        handleCurrentCard(payload)
      }

      if (event === "timer") {
        handleTimer(payload)
      }

      if (event === "displayedCards") {
        handleDisplayedCards()
      }
    },
    [
      handleDisplayedCards,
      handleCardsSubscription,
      handleCurrentTeam,
      handleCurrentPlayer,
      handleTeams,
      handleTimer,
      handleCurrentCard,
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
