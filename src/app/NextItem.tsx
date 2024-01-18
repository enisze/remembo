import { Button } from "@/components/ui/button"
import { useAtomValue, useSetAtom } from "jotai"
import { displayedCardsAtom, timerStartedAtom } from "./Timer"

import { CheckIcon, XIcon } from "lucide-react"
import { getChannel } from "./_components/supabaseClient"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import {
  teamOneAtom,
  teamTwoAtom,
  type Team,
} from "./_subscriptions/useHandleTeams"

export const NextItem = ({
  remainingItems,
  id,
}: {
  remainingItems: string[]
  id: string
}) => {
  const setTimerStarted = useSetAtom(timerStartedAtom)

  const setDisplayedItems = useSetAtom(displayedCardsAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const currentTeam = useAtomValue(currentTeamAtom)

  const channel = getChannel(id)

  const handleCheckClick = async () => {
    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      setDisplayedItems((prevItems) => [...prevItems, nextItem!])

      if (nextItem) {
        await channel.send({
          type: "broadcast",
          event: "currentTeam",
          payload: {
            message: currentTeam === "A" ? "B" : "A",
          },
        })
      }

      // Increment the score for the current team

      const newTeamOne: Team = {
        ...teamOne,
        points: currentTeam === "A" ? teamOne.points + 1 : teamOne.points,
      }

      const newTeamTwo: Team = {
        ...teamOne,
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

      await channel.send({
        type: "broadcast",
        event: "currentTeam",
        payload: {
          message: currentTeam === "A" ? "B" : "A",
        },
      })
    } else {
      setTimerStarted(false)
    }
  }

  const handleXClick = async () => {
    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      if (nextItem) {
        await channel.send({
          type: "broadcast",
          event: "currentCard",
          payload: {
            message: nextItem,
          },
        })
      }
    } else {
      setTimerStarted(false)
    }
  }

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
