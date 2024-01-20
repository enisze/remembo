import { Button } from "@/components/ui/button"
import { useAtomValue, useSetAtom } from "jotai"
import { displayedCardsAtom, timerStartedAtom } from "./Timer"

import { CheckIcon, XIcon } from "lucide-react"
import { useCallback } from "react"
import { getChannel } from "./_components/supabaseClient"
import { cardAtom } from "./_subscriptions/Subscriptions"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import {
  teamOneAtom,
  teamTwoAtom,
  type Team,
} from "./_subscriptions/useHandleTeams"

export const NextItem = ({ id }: { id: string }) => {
  const setTimerStarted = useSetAtom(timerStartedAtom)
  const initialCards = useAtomValue(cardAtom)
  const displayedCards = useAtomValue(displayedCardsAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const currentTeam = useAtomValue(currentTeamAtom)

  const channel = getChannel(id)

  const handleCheckClick = useCallback(async () => {
    const remainingCards = initialCards.filter(
      (item) => !displayedCards.includes(item),
    )

    if (remainingCards.length > 0) {
      const newTeamOne: Team = {
        ...teamOne,
        points: currentTeam === "A" ? teamOne.points + 1 : teamOne.points,
      }

      const newTeamTwo: Team = {
        ...teamTwo,
        points: currentTeam === "B" ? teamTwo.points + 1 : teamTwo.points,
      }

      await channel.send({
        type: "broadcast",
        event: "teams",
        payload: {
          message: {
            teamOne: newTeamOne,
            teamTwo: newTeamTwo,
          },
        },
      })

      const nextItem = getNextCard(remainingCards)

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
    displayedCards,
    channel,
    setTimerStarted,
    currentTeam,
    teamOne,
    teamTwo,
  ])

  const handleXClick = useCallback(async () => {
    const remainingCards = initialCards.filter(
      (item) => !displayedCards.includes(item),
    )
    if (remainingCards.length > 0) {
      const nextItem = getNextCard(remainingCards)

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
  }, [initialCards, displayedCards, channel, setTimerStarted])

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
      Current points:
      <div className="flex gap-2">
        <div>Team 1: {teamOne?.points}</div>

        <div>Team 2: {teamTwo?.points}</div>
      </div>
    </div>
  )
}

const getNextCard = (remainingCards: string[]) => {
  const nextItem =
    remainingCards[Math.floor(Math.random() * remainingCards.length)]

  return nextItem
}
