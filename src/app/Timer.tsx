import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { CurrentItemView } from "./CurrentItemView"
import { NextItem } from "./NextItem"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { cardAtom } from "./_subscriptions/Subscriptions"
import { currentCardAtom } from "./_subscriptions/useHandleCurrentCard"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/useHandleTeams"

export const displayedItemsAtom = atom<string[]>([])
export const timerStartedAtom = atom(false)

export const Timer = ({ id }: { id: string }) => {
  const initialCards = useAtomValue(cardAtom)
  const displayedItems = useAtomValue(displayedItemsAtom)

  const [currentCard, setCurrentCard] = useAtom(currentCardAtom)
  const [timerStarted, setTimerStarted] = useAtom(timerStartedAtom)
  const [timeLeft, setTimeLeft] = useState(60)

  const [teamOne, setTeamOne] = useAtom(teamOneAtom)
  const [teamTwo, setTeamTwo] = useAtom(teamTwoAtom)

  const remainingTimeA = teamOne?.remainingTime ?? 0
  const remainingTimeB = teamTwo?.remainingTime ?? 0
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

          if (currentTeam === "A") {
            setTeamOne((prevTeam) => {
              if (prevTeam) {
                return { ...prevTeam, remainingTime: newTime }
              }
              return prevTeam
            })
          }

          if (currentTeam === "B") {
            setTeamTwo((prevTeam) => {
              if (prevTeam) {
                return { ...prevTeam, remainingTime: newTime }
              }
              return prevTeam
            })
          }

          return newTime
        })
        if (timeLeft <= 0) {
          setCurrentCard("Over")
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
      <div className="flex gap-2 rounded-md border border-solid p-3">
        <h1>Its your turn</h1>
        <div>{currentPlayer?.name}</div>
        <h2>Current Card</h2>
        <div>{currentCard}</div>
      </div>

      <div className="flex gap-2 rounded-md border border-solid p-3">
        <h1>Timer</h1>
        <p>Time left: {timeLeft}</p>
        <CurrentItemView />
      </div>

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
              setCurrentCard(card)
              await setNextPlayer()
            }
          }
        }}
        variant="outline"
      >
        Start
      </Button>

      <NextItem remainingItems={remainingCards} />
    </div>
  )
}
