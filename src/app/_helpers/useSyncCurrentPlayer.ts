import { useAtom } from "jotai"
import { useCallback } from "react"
import { type Player } from "../Game"
import { teamsAtom } from "../Timer"
import { supabase } from "../_components/supabaseClient"
import { currentPlayerAtom } from "../_subscriptions/CurrentPlayerSubscription"
import { currentTeamAtom } from "../_subscriptions/CurrentTeamSubscription"

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
  const [currentTeam, setCurrentTeam] = useAtom(currentTeamAtom)

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom)

  const [teams, setTeams] = useAtom(teamsAtom)

  const teamAPlayers = teams[0]?.players ?? []
  const teamBPlayers = teams[1]?.players ?? []

  const nextPlayer = getNextPlayer(
    currentTeam === "B" ? teamBPlayers : teamAPlayers,
    currentPlayer,
  )

  const setNextPlayer = useCallback(async () => {
    setCurrentPlayer(nextPlayer)
    await channelA.send({
      type: "broadcast",
      event: "currentPlayer",
      payload: {
        message: nextPlayer,
      },
    })
  }, [])

  return setNextPlayer
}
