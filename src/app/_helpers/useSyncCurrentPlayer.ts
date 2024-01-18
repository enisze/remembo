import { useAtom, useAtomValue } from "jotai"
import { useCallback } from "react"
import { type Player } from "../Game"
import { getChannel } from "../_components/supabaseClient"
import { currentPlayerAtom } from "../_subscriptions/useHandleCurrentPlayer"
import { currentTeamAtom } from "../_subscriptions/useHandleCurrentTeam"
import { teamOneAtom, teamTwoAtom } from "../_subscriptions/useHandleTeams"

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

export const useSetNextPlayer = ({ id }: { id: string }) => {
  const currentTeam = useAtomValue(currentTeamAtom)

  const channel = getChannel(id)

  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom)

  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const teamOnePlayers = teamOne?.players ?? []
  const teamTwoPlayers = teamTwo?.players ?? []

  const nextPlayer = getNextPlayer(
    currentTeam === "B" ? teamTwoPlayers : teamOnePlayers,
    currentPlayer,
  )

  const setNextPlayer = useCallback(async () => {
    setCurrentPlayer(nextPlayer)
    await channel.send({
      type: "broadcast",
      event: "currentPlayer",
      payload: {
        message: nextPlayer,
      },
    })
  }, [])

  return setNextPlayer
}
