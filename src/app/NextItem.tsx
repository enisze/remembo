import { Button } from "@/components/ui/button"
import { useAtomValue, useSetAtom } from "jotai"

import { CheckIcon, XIcon } from "lucide-react"
import { useCallback } from "react"
import { timerStartedAtom } from "./CurrentPlayerView"
import { getChannel } from "./_components/supabaseClient"
import { cardAtom } from "./_subscriptions/Subscriptions"
import { currentCardAtom } from "./_subscriptions/useHandleCurrentCard"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { displayedCardsAtom } from "./_subscriptions/useHandleDisplayedCards"
import { gameIdAtom } from "./page"

export const NextItem = () => {
  const setTimerStarted = useSetAtom(timerStartedAtom)
  const initialCards = useAtomValue(cardAtom)
  const displayedCards = useAtomValue(displayedCardsAtom)

  const currentCard = useAtomValue(currentCardAtom)

  const id = useAtomValue(gameIdAtom)

  const currentTeam = useAtomValue(currentTeamAtom)

  const channel = getChannel(id)

  const handleCheckClick = useCallback(async () => {
    const remainingCards = initialCards.filter(
      (item) => !displayedCards.includes(item),
    )

    if (remainingCards.length > 0) {
      const nextItem = getNextCard(remainingCards)

      await channel.send({
        type: "broadcast",
        event: "points",
        payload: {
          message: {
            team: currentTeam,
          },
        },
      })

      await channel.send({
        type: "broadcast",
        event: "displayedCards",
        payload: {
          message: currentCard,
        },
      })

      await channel.send({
        type: "broadcast",
        event: "currentCard",
        payload: {
          message: nextItem,
        },
      })
    } else {
      setTimerStarted(false)
    }
  }, [
    initialCards,
    currentCard,
    displayedCards,
    channel,
    setTimerStarted,
    currentTeam,
  ])

  const handleXClick = useCallback(async () => {
    const remainingCards = initialCards.filter(
      (item) => !displayedCards.includes(item),
    )
    if (remainingCards.length > 0) {
      let nextItem = getNextCard(remainingCards)

      while (nextItem === currentCard && remainingCards.length > 1) {
        nextItem = getNextCard(remainingCards)
      }

      await channel.send({
        type: "broadcast",
        event: "currentCard",
        payload: {
          message: nextItem,
        },
      })
    } else {
      setTimerStarted(false)
    }
  }, [initialCards, displayedCards, channel, setTimerStarted, currentCard])

  return (
    <div className="flex flex-col gap-2 pt-4">
      Next Item
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCheckClick}>
          <CheckIcon className="text-green-400" />
        </Button>
        <Button variant="outline" onClick={handleXClick}>
          <XIcon className="text-red-400" />
        </Button>
      </div>
    </div>
  )
}

const getNextCard = (remainingCards: string[]) => {
  const nextItem =
    remainingCards[Math.floor(Math.random() * remainingCards.length)]

  return nextItem
}
