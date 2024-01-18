import { Button } from "@/components/ui/button"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { currentItemAtom, displayedItemsAtom, timerStartedAtom } from "./Timer"

import { CheckIcon, XIcon } from "lucide-react"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/useHandleTeams"

export const NextItem = ({ remainingItems }: { remainingItems: string[] }) => {
  const setTimerStarted = useSetAtom(timerStartedAtom)

  const setDisplayedItems = useSetAtom(displayedItemsAtom)
  const setCurrentItem = useSetAtom(currentItemAtom)

  const [teamOne, setTeamOne] = useAtom(teamOneAtom)
  const [teamTwo, setTeamTwo] = useAtom(teamTwoAtom)

  const currentTeam = useAtomValue(currentTeamAtom)

  const handleCheckClick = () => {
    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      setDisplayedItems((prevItems) => [...prevItems, nextItem!])

      if (nextItem) setCurrentItem(nextItem)

      // Increment the score for the current team
      if (currentTeam === "A") {
        setTeamOne((prevTeam) => {
          return { ...prevTeam, points: prevTeam.points + 1 }
        })
      } else {
        setTeamTwo((prevTeam) => {
          return { ...prevTeam, points: prevTeam.points + 1 }
        })
      }
    } else {
      setTimerStarted(false)
    }
  }

  const handleXClick = () => {
    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      if (nextItem) setCurrentItem(nextItem)
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
