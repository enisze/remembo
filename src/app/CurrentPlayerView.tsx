import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { NextItem } from "./NextItem"
import { meAtom } from "./PlayerPresence"
import { getChannel } from "./_components/supabaseClient"
import { gameIdAtom } from "./_helpers/atoms"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { cardAtom } from "./_subscriptions/Subscriptions"
import { currentCardAtom } from "./_subscriptions/useHandleCurrentCard"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { displayedCardsAtom } from "./_subscriptions/useHandleDisplayedCards"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/useHandleTeams"
import { timerAtom } from "./_subscriptions/useHandleTimer"

export const timerStartedAtom = atom(false)

export const CurrentPlayerView = () => {
  const currentCard = useAtomValue(currentCardAtom)
  const currentPlayer = useAtomValue(currentPlayerAtom)
  const me = useAtomValue(meAtom)
  const initialCards = useAtomValue(cardAtom)
  const displayedCards = useAtomValue(displayedCardsAtom)
  const timeLeft = useAtomValue(timerAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const timer = useRef<NodeJS.Timer>()

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
    if (timerStarted) {
      timer.current = setInterval(() => {
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
          if (timer.current) {
            clearInterval(timer.current)
            setTimerStarted(false)
          }
        }
      }, 1000)
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [
    timeLeft,
    currentTeam,
    channel,
    setNextPlayer,
    setTimerStarted,
    timerStarted,
    displayedCards,
    remainingCards,
  ])

  const handleNextPlayer = useCallback(async () => {
    await channel.send({
      type: "broadcast",
      event: "timeTeams",
      payload: {
        message: {
          team: currentTeam,
          time: timeLeft,
        },
      },
    })

    const newTeam = currentTeam === "A" ? "B" : "A"

    await channel.send({
      type: "broadcast",
      event: "currentTeam",
      payload: {
        message: newTeam,
      },
    })

    //TODO: add this
    await channel.send({
      type: "broadcast",
      event: "remainingCards",
      payload: {},
    })

    const newTime =
      newTeam === "A" ? teamOne?.remainingTime + 5 : teamTwo?.remainingTime + 5

    await channel.send({
      type: "broadcast",
      event: "timer",
      payload: {
        message: newTime,
      },
    })
    clearInterval(timer.current)
    setTimerStarted(false)

    await setNextPlayer()
  }, [
    channel,
    currentTeam,
    setNextPlayer,
    teamOne,
    teamTwo,
    timeLeft,
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

      <Button variant="outline" onClick={handleNextPlayer}>
        Next player
      </Button>

      <NextItem />
    </div>
  )
}
