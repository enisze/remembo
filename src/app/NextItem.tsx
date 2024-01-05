import { Button } from "@/components/ui/button"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
  currentItemAtom,
  currentTeamAtom,
  displayedItemsAtom,
  teamsAtom,
  timerStartedAtom,
} from "./Timer"

import { CheckIcon, XIcon } from "lucide-react"

export const NextItem = ({ remainingItems }: { remainingItems: string[] }) => {
  const setTimerStarted = useSetAtom(timerStartedAtom)

  const setDisplayedItems = useSetAtom(displayedItemsAtom)
  const setCurrentItem = useSetAtom(currentItemAtom)
  const [teams, setTeams] = useAtom(teamsAtom)

  const currentTeam = useAtomValue(currentTeamAtom)

  const handleCheckClick = () => {
    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      setDisplayedItems((prevItems) => [...prevItems, nextItem!])

      if (nextItem) setCurrentItem(nextItem)

      // Increment the score for the current team
      const updatedTeams = teams.map((team, index) => {
        if (index === currentTeam) {
          return { ...team, points: team.points + 1 }
        }
        return team
      })
      setTeams(updatedTeams)
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
        {teams.map((team, index) => (
          <div key={index}>
            Team {index + 1}: {team.points}
          </div>
        ))}
      </div>
    </div>
  )
}
