import { atom, useAtomValue } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { z } from "zod"
import { playerSchema } from "../Game"
import { getChannel } from "../_components/supabaseClient"
import { gameIdAtom } from "../_helpers/atoms"
import { useHandleCards } from "./useHandleCards"
import { useHandleCurrentCard } from "./useHandleCurrentCard"
import { useHandleCurrentPlayer } from "./useHandleCurrentPlayer"
import { useHandleCurrentTeam } from "./useHandleCurrentTeam"
import { useHandleDisplayedCards } from "./useHandleDisplayedCards"
import { useHandlePoints } from "./useHandlePoints"
import { teamSchema, useHandleTeams } from "./useHandleTeams"
import { useHandleTimeTeams } from "./useHandleTimeTeams"
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
    | "timeTeams"
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
  const handleTimeTeams = useHandleTimeTeams()

  const messageReceived = useCallback(
    ({ payload, event }: Payload) => {
      switch (event) {
        case "cards": {
          const schema = z.object({
            message: z.array(z.string()),
          })
          const { message } = schema.parse(payload)
          handleCardsSubscription(message)
          break
        }
        case "currentTeam": {
          const schema = z.object({
            message: z.string(),
          })

          const { message } = schema.parse(payload)
          handleCurrentTeam(message)
          break
        }
        case "currentPlayer": {
          const schema = z.object({
            message: playerSchema,
          })

          const { message } = schema.parse(payload)
          handleCurrentPlayer(message)
          break
        }
        case "teams": {
          const schema = z.object({
            message: z.object({
              teamOne: teamSchema,
              teamTwo: teamSchema,
            }),
          })

          const {
            message: { teamOne, teamTwo },
          } = schema.parse(payload)
          handleTeams(teamOne, teamTwo)
          break
        }
        case "currentCard": {
          const schema = z.object({
            message: z.string(),
          })

          const { message } = schema.parse(payload)

          handleCurrentCard(message)
          break
        }
        case "timer": {
          const schema = z.object({
            message: z.number(),
          })

          const { message } = schema.parse(payload)
          handleTimer(message)
          break
        }
        case "displayedCards": {
          const schema = z.object({
            message: z.string().optional(),
          })

          const { message } = schema.parse(payload)
          handleDisplayedCards(message)
          break
        }
        case "points": {
          const schema = z.object({
            message: z.string(),
          })

          const { message } = schema.parse(payload)
          handlePoints(message)
          break
        }

        case "timeTeams": {
          const schema = z.object({
            message: z.object({
              team: z.string(),
              time: z.number(),
            }),
          })

          const { message } = schema.parse(payload)
          handleTimeTeams(message)
        }

        default: {
          break
        }
      }
    },
    [
      handleTimeTeams,
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
