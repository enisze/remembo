import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { cardAtom, type Player } from "./Game2"

const team1PlayersAtom = atom<Player[]>([])
const team2PlayersAtom = atom<Player[]>([])
const currentPlayerAtom = atom<Player | undefined>(undefined)
const currentTeamAtom = atom(1)
const remainingTimeAtomA = atom(0)
const remainingTimeAtomB = atom(0)

function getNextPlayer(
  teamPlayers: Player[],
  currentPlayer: Player | undefined,
) {
  if (!currentPlayer) return teamPlayers[0]
  const currentPlayerIndex = teamPlayers.indexOf(currentPlayer)
  return currentPlayerIndex === teamPlayers.length - 1
    ? teamPlayers[0]
    : teamPlayers[currentPlayerIndex + 1]
}

// In your component

export const Timer = () => {
  const initialCards = useAtomValue(cardAtom)

  const [displayedItems, setDisplayedItems] = useState<string[]>([])
  const [currentItem, setCurrentItem] = useState(initialCards[0])
  const [timerStarted, setTimerStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  const [team1Players] = useAtom(team1PlayersAtom)
  const [team2Players] = useAtom(team2PlayersAtom)
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom)
  const [currentTeam, setCurrentTeam] = useAtom(currentTeamAtom)
  const [remainingTimeA, setRemainingTimeA] = useAtom(remainingTimeAtomA)
  const [remainingTimeB, setRemainingTimeB] = useAtom(remainingTimeAtomB)

  const handleNextPlayer = () => {
    const remainingTime = currentTeam === 1 ? remainingTimeA : remainingTimeB
    setTimeLeft(60 + remainingTime)

    setCurrentTeam(currentTeam === 1 ? 2 : 1)
    setCurrentPlayer(
      getNextPlayer(
        currentTeam === 1 ? team2Players : team1Players,
        currentPlayer,
      ),
    )
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (timerStarted) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1

          if (currentTeam === 1) {
            setRemainingTimeA(newTime)
          } else {
            setRemainingTimeB(newTime)
          }
          return newTime
        })
        if (timeLeft <= 0) {
          setCurrentItem("Over")
          setTimerStarted(false)
          setCurrentTeam(currentTeam === 1 ? 2 : 1)
          setCurrentPlayer(
            getNextPlayer(
              currentTeam === 1 ? team2Players : team1Players,
              currentPlayer,
            ),
          )
        }
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerStarted, timeLeft, currentPlayer, currentTeam])

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
      {timeLeft <= 0 ||
        (displayedItems.length === initialCards.length && (
          <button onClick={handleNextPlayer}>Next player</button>
        ))}

      <Button onClick={() => setTimerStarted(true)}>Start</Button>
    </div>
  )
}
