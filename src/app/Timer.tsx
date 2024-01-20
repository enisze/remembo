import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { useCallback } from "react"
import { MeView, timerStartedAtom } from "./CurrentItemView"
import { NextItem } from "./NextItem"
import { getChannel } from "./_components/supabaseClient"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import {
  teamOneAtom,
  teamTwoAtom,
  type Team,
} from "./_subscriptions/useHandleTeams"
import { timerAtom } from "./_subscriptions/useHandleTimer"
import { gameIdAtom } from "./page"

export const Timer = () => {
  const timerStarted = useAtomValue(timerStartedAtom)
  const timeLeft = useAtomValue(timerAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const currentPlayer = useAtomValue(currentPlayerAtom)
  const currentTeam = useAtomValue(currentTeamAtom)

  const id = useAtomValue(gameIdAtom)

  const setNextPlayer = useSetNextPlayer()

  const channel = getChannel(id)

  const handleNextPlayer = useCallback(async () => {
    const remainingTimeA = teamOne.remainingTime ?? 0
    const remainingTimeB = teamTwo.remainingTime ?? 0
    const newTeamOne: Team = {
      ...teamOne,
      remainingTime: currentTeam === "A" ? remainingTimeA + 60 : remainingTimeA,
    }

    const newTeamTwo: Team = {
      ...teamTwo,
      remainingTime: currentTeam === "B" ? remainingTimeB + 60 : remainingTimeB,
    }

    await channel.send({
      type: "broadcast",
      event: "teams",
      payload: {
        message: {
          teamOne: newTeamOne,
          teamTwo: newTeamTwo,
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

    await channel.send({
      type: "broadcast",
      event: "remainingCards",
    })

    const newTime =
      newTeam === "A" ? newTeamOne.remainingTime : newTeamTwo.remainingTime

    await channel.send({
      type: "broadcast",
      event: "timer",
      payload: {
        message: newTime,
      },
    })

    await setNextPlayer()
  }, [channel, currentTeam, setNextPlayer, teamOne, teamTwo])

  return (
    <div>
      <div className="flex gap-2 rounded-md border border-solid p-3">
        <h1>Its your turn</h1>
        <div>{currentPlayer?.name}</div>
      </div>

      <div className="flex gap-2 rounded-md border border-solid p-3">
        <h1>Timer</h1>
        <p>Time left: {timeLeft}</p>
        <MeView />
      </div>

      {timeLeft <= 0 ||
        (!timerStarted && (
          <Button variant="outline" onClick={handleNextPlayer}>
            Next player
          </Button>
        ))}

      <Button
        onClick={async () => {
          await setNextPlayer()
        }}
        variant="outline"
      >
        Choose Player
      </Button>

      <NextItem id={id} />
    </div>
  )
}
