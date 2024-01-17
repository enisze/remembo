import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { CurrentItemView } from "./CurrentItemView"
import { type Player } from "./Game"
import { NextItem } from "./NextItem"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { cardAtom } from "./_subscriptions/AddCardsSubscription"
import { currentPlayerAtom } from "./_subscriptions/CurrentPlayerSubscription"
import { currentTeamAtom } from "./_subscriptions/CurrentTeamSubscription"

type Team = {
  players: Player[]
  remainingTime: number
  points: number
}

export const teamsAtom = atom<Team[]>([
  { players: [], remainingTime: 0, points: 0 },
  { players: [], remainingTime: 0, points: 0 },
])

export const currentItemAtom = atom("")
export const displayedItemsAtom = atom<string[]>([])
export const timerStartedAtom = atom(false)

export const Timer = ({ id }: { id: string }) => {
  const initialCards = useAtomValue(cardAtom)
  const displayedItems = useAtomValue(displayedItemsAtom)

  const [currentItem, setCurrentItem] = useAtom(currentItemAtom)
  const [timerStarted, setTimerStarted] = useAtom(timerStartedAtom)
  const [timeLeft, setTimeLeft] = useState(60)

  const [teams, setTeams] = useAtom(teamsAtom)

  const remainingTimeA = teams[0]?.remainingTime ?? 0
  const remainingTimeB = teams[1]?.remainingTime ?? 0
  const [currentPlayer] = useAtom(currentPlayerAtom)
  const [currentTeam, setCurrentTeam] = useAtom(currentTeamAtom)

  const setNextPlayer = useSetNextPlayer({ id })

  const remainingCards = useMemo(
    () => initialCards.filter((item) => !displayedItems.includes(item)),
    [initialCards, displayedItems],
  )

  const handleNextPlayer = async () => {
    const remainingTime = currentTeam === "A" ? remainingTimeA : remainingTimeB
    setTimeLeft(60 + remainingTime)

    setCurrentTeam(currentTeam === "A" ? "B" : "A")

    await setNextPlayer()
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (timerStarted) {
      timer = setInterval(() => {
        console.log("running timer")
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1

          setTeams((prevTeams) => {
            const newTeams = [...prevTeams]
            if (currentTeam === "A") {
              if (newTeams[0]) {
                newTeams[0].remainingTime = newTime
              }
            } else {
              if (newTeams[1]) {
                newTeams[1].remainingTime = newTime
              }
            }
            return newTeams
          })

          return newTime
        })
        if (timeLeft <= 0) {
          setCurrentItem("Over")
          setTimerStarted(false)
          setCurrentTeam(currentTeam === "A" ? "B" : "A")

          void (async () => {
            await setNextPlayer()
          })()
        }
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerStarted, timeLeft, currentPlayer, currentTeam])

  return (
    <div>
      <h1>Its your turn</h1>
      <div>{currentPlayer?.name}</div>
      <h1>Timer</h1>
      <p>Time left: {timeLeft}</p>
      <CurrentItemView />

      {timeLeft <= 0 ||
        (displayedItems.length === initialCards.length && (
          <Button variant="outline" onClick={handleNextPlayer}>
            Next player
          </Button>
        ))}

      <Button
        onClick={async () => {
          if (remainingCards.length > 0) {
            setTimerStarted(true)

            const card = remainingCards[0]
            if (card) {
              setCurrentItem(card)
              await setNextPlayer()
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
