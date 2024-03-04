import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { CurrentPlayerView } from "./CurrentPlayerView"
import { getChannel } from "./_components/supabaseClient"
import { gameIdAtom } from "./_helpers/atoms"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { cardAtom } from "./_subscriptions/Subscriptions"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { displayedCardsAtom } from "./_subscriptions/useHandleDisplayedCards"
import { currentRoundAtom } from "./_subscriptions/useHandleRound"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/useHandleTeams"
import { timerAtom } from "./_subscriptions/useHandleTimer"

export const Timer = () => {
  const timeLeft = useAtomValue(timerAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const currentPlayer = useAtomValue(currentPlayerAtom)
  const currentTeam = useAtomValue(currentTeamAtom)

  const currentRound = useAtomValue(currentRoundAtom)

  const initialCards = useAtomValue(cardAtom)
  const displayedCards = useAtomValue(displayedCardsAtom)

  const id = useAtomValue(gameIdAtom)

  const setNextPlayer = useSetNextPlayer()

  const channel = getChannel(id)

  const remainingCards = useMemo(
    () => initialCards.filter((item) => !displayedCards.includes(item)),
    [initialCards, displayedCards],
  )

  return (
    <div>
      <div className="flex gap-2 rounded-md border border-solid p-3">
        <h1>Its your turn</h1>
        <div>{currentPlayer?.name}</div>

        <div>Team: {currentTeam}</div>
      </div>
      <div className="flex gap-2 rounded-md border border-solid p-3">
        <h1>Timer</h1>
        <p>Time left: {timeLeft}</p>
        <CurrentPlayerView />
      </div>
      <Button
        onClick={async () => {
          await setNextPlayer()
        }}
        variant="outline"
      >
        Choose Player
      </Button>

      <Button
        onClick={async () => {
          await channel.send({
            type: "broadcast",
            event: "timer",
            payload: {
              message: 5,
            },
          })

          await channel.send({
            type: "broadcast",
            event: "timeTeams",
            payload: {
              message: {
                team: "A",
                time: 0,
              },
            },
          })

          await channel.send({
            type: "broadcast",
            event: "timeTeams",
            payload: {
              message: {
                team: "B",
                time: 0,
              },
            },
          })
        }}
        variant="outline"
      >
        Reset timer
      </Button>

      {remainingCards.length === 0 && (
        <Button
          onClick={async () => {
            await channel.send({
              event: "round",
              type: "broadcast",
              payload: {
                message: currentRound + 1,
              },
            })

            //TODO: when round is over (all  cards where displayed, then all buttons should disappear and only next round is pressable)
            //When pressed next round, timer is reset, and all cards are reset and next player is chosen.
            await channel.send({
              event: "displayedCards",
              type: "broadcast",
              payload: { message: undefined },
            })
          }}
          variant="outline"
        >
          Start next round
        </Button>
      )}
      <div>
        Current points:
        <div className="flex gap-2">
          <div>Team 1: {teamOne?.points}</div>

          <div>Team 2: {teamTwo?.points}</div>
        </div>
      </div>
    </div>
  )
}
