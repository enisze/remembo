import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo } from "react"
import { NextItem } from "./NextItem"
import { meAtom } from "./PlayerPresence"
import { getChannel } from "./_components/supabaseClient"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { cardAtom } from "./_subscriptions/Subscriptions"
import { currentCardAtom } from "./_subscriptions/useHandleCurrentCard"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { displayedCardsAtom } from "./_subscriptions/useHandleDisplayedCards"
import { timerAtom } from "./_subscriptions/useHandleTimer"
import { gameIdAtom } from "./page"

export const timerStartedAtom = atom(false)

export const CurrentPlayerView = () => {
  const currentCard = useAtomValue(currentCardAtom)
  const currentPlayer = useAtomValue(currentPlayerAtom)
  const me = useAtomValue(meAtom)
  const initialCards = useAtomValue(cardAtom)
  const displayedCards = useAtomValue(displayedCardsAtom)
  const timeLeft = useAtomValue(timerAtom)

  const currentTeam = useAtomValue(currentTeamAtom)

  const id = useAtomValue(gameIdAtom)

  const remainingCards = useMemo(
    () => initialCards.filter((item) => !displayedCards.includes(item)),
    [initialCards, displayedCards],
  )

  const channel = getChannel(id)

  const [timerStarted, setTimerStarted] = useAtom(timerStartedAtom)

  const setNextPlayer = useSetNextPlayer()

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    console.log(timerStarted)
    if (timerStarted) {
      timer = setInterval(() => {
        const newTime = timeLeft - 1

        void (async () => {
          await channel.send({
            type: "broadcast",
            event: "timer",
            payload: {
              message: newTime,
            },
          })
        })()

        if (timeLeft <= 0) {
          void (async () => {
            await channel.send({
              type: "broadcast",
              event: "currentCard",
              payload: {
                message: "Over",
              },
            })
          })()
          setTimerStarted(false)

          void (async () => {
            await channel.send({
              type: "broadcast",
              event: "currentTeam",
              payload: {
                message: currentTeam === "A" ? "B" : "A",
              },
            })
          })()

          void (async () => {
            await setNextPlayer()
          })()
        }
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [
    timerStarted,
    timeLeft,
    currentTeam,
    channel,
    setNextPlayer,
    setTimerStarted,
  ])

  if (currentPlayer?.key !== me?.key) return null
  return (
    <div>
      <Button
        onClick={async () => {
          if (remainingCards.length > 0) {
            setTimerStarted(true)

            const card = remainingCards[0]
            if (card) {
              await channel.send({
                type: "broadcast",
                event: "currentCard",
                payload: {
                  message: card,
                },
              })
            }
          }
        }}
        variant="outline"
      >
        Start
      </Button>
      <p className="text-md font-bold">{currentCard}</p>

      <NextItem />
    </div>
  )
}