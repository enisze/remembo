import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { cardAtom } from "./Game2"

export const Timer = () => {
  const initialCards = useAtomValue(cardAtom)

  const [displayedItems, setDisplayedItems] = useState<string[]>([])
  const [currentItem, setCurrentItem] = useState(initialCards[0])
  const [timerStarted, setTimerStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  const handleClick = () => {
    if (!timerStarted) {
      setTimerStarted(true)
    }

    const remainingItems = initialCards.filter(
      (item) => !displayedItems.includes(item),
    )

    if (remainingItems.length > 0) {
      const nextItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)]
      setDisplayedItems((prevItems) => [...prevItems, nextItem!])
      setCurrentItem(nextItem)
    } else {
      setTimerStarted(false)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (timerStarted) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
        if (timeLeft <= 0) {
          setCurrentItem("Over")
          setTimerStarted(false)
        }
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerStarted, timeLeft])

  return (
    <div>
      <h1>Timer</h1>
      <p>Time left: {timeLeft}</p>
      <p>{currentItem}</p>
      <button onClick={handleClick}>Next item</button>
    </div>
  )
}
