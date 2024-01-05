import { Button } from "@/components/ui/button"
import { useAtom, useSetAtom } from "jotai"
import { currentItemAtom, displayedItemsAtom, timerStartedAtom } from "./Timer"

import { CheckIcon, XIcon } from "lucide-react"

export const NextItem = ({ remainingItems }: { remainingItems: string[] }) => {
  const [timerStarted, setTimerStarted] = useAtom(timerStartedAtom)

  const setDisplayedItems = useSetAtom(displayedItemsAtom)
  const setCurrentItem = useSetAtom(currentItemAtom)
  const handleClick = () => {
    if (!timerStarted) {
      setTimerStarted(true)
    }

    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      setDisplayedItems((prevItems) => [...prevItems, nextItem!])

      if (nextItem) setCurrentItem(nextItem)
    } else {
      setTimerStarted(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 pt-4">
      Next Item
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClick}>
          <CheckIcon className="text-green-400" />
        </Button>
        <Button variant="outline" onClick={handleClick}>
          <XIcon className="text-red-400" />
        </Button>
      </div>
    </div>
  )
}
