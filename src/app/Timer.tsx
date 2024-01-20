import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { CurrentPlayerView } from "./CurrentPlayerView"
import { getChannel } from "./_components/supabaseClient"
import { useSetNextPlayer } from "./_helpers/useSyncCurrentPlayer"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "./_subscriptions/useHandleCurrentTeam"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/useHandleTeams"
import { timerAtom } from "./_subscriptions/useHandleTimer"
import { gameIdAtom } from "./page"

export const Timer = () => {
  const timeLeft = useAtomValue(timerAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const currentPlayer = useAtomValue(currentPlayerAtom)
  const currentTeam = useAtomValue(currentTeamAtom)

  const id = useAtomValue(gameIdAtom)

  const setNextPlayer = useSetNextPlayer()

  const channel = getChannel(id)

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
              message: 60,
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
