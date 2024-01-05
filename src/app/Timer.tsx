import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { cardAtom } from "./AddCardsView"
import { type Player } from "./Game"
import { NextItem } from "./NextItem"

const team1PlayersAtom = atom<Player[]>([])
const team2PlayersAtom = atom<Player[]>([])
const currentPlayerAtom = atom<Player | undefined>(undefined)
const currentTeamAtom = atom(1)
const remainingTimeAtomA = atom(0)
const remainingTimeAtomB = atom(0)

export const currentItemAtom = atom("")

export const displayedItemsAtom = atom<string[]>([])

export const timerStartedAtom = atom(false)

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

export const Timer = () => {
  const initialCards = useAtomValue(cardAtom)

  const displayedItems = useAtomValue(displayedItemsAtom)

  const [currentItem, setCurrentItem] = useAtom(currentItemAtom)
  const [timerStarted, setTimerStarted] = useAtom(timerStartedAtom)
  const [timeLeft, setTimeLeft] = useState(60)

  const [team1Players] = useAtom(team1PlayersAtom)
  const [team2Players] = useAtom(team2PlayersAtom)
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom)
  const [currentTeam, setCurrentTeam] = useAtom(currentTeamAtom)
  const [remainingTimeA, setRemainingTimeA] = useAtom(remainingTimeAtomA)
  const [remainingTimeB, setRemainingTimeB] = useAtom(remainingTimeAtomB)

  const remainingCards = useMemo(
    () => initialCards.filter((item) => !displayedItems.includes(item)),
    [initialCards, displayedItems],
  )

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

  return (
    <div>
      <h1>Timer</h1>
      <p>Time left: {timeLeft}</p>
      <p>{currentItem}</p>

      {timeLeft <= 0 ||
        (displayedItems.length === initialCards.length && (
          <Button variant="outline" onClick={handleNextPlayer}>
            Next player
          </Button>
        ))}

      <Button
        onClick={() => {
          if (remainingCards.length > 0) {
            setTimerStarted(true)

            const card = remainingCards[0]
            if (card) {
              setCurrentItem(card)
            }
          }
        }}
      >
        Start
      </Button>

      <NextItem remainingItems={remainingCards} />
    </div>
  )
}
