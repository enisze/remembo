import { atom, useAtomValue } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { getChannel } from "../_components/supabaseClient"
import { gameIdAtom } from "../page"
import { useHandleCards } from "./useHandleCards"
import { useHandleCurrentCard } from "./useHandleCurrentCard"
import { useHandleCurrentPlayer } from "./useHandleCurrentPlayer"
import { useHandleCurrentTeam } from "./useHandleCurrentTeam"
import { useHandleDisplayedCards } from "./useHandleDisplayedCards"
import { useHandlePoints } from "./useHandlePoints"
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
    | "points"
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
  const handlePoints = useHandlePoints()

  const messageReceived = useCallback(
    ({ payload, event }: Payload) => {
      switch (event) {
        case "cards": {
          handleCardsSubscription(payload)
          break
        }
        case "currentTeam": {
          handleCurrentTeam(payload)
          break
        }
        case "currentPlayer": {
          handleCurrentPlayer(payload)
          break
        }
        case "teams": {
          handleTeams(payload)
          break
        }
        case "currentCard": {
          handleCurrentCard(payload)
          break
        }
        case "timer": {
          handleTimer(payload)
          break
        }
        case "displayedCards": {
          handleDisplayedCards(payload)
          break
        }
        case "points": {
          handlePoints(payload)
          break
        }
        default: {
          break
        }
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
      handlePoints,
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
