import { Button } from "@/components/ui/button"
import { useAtom, useAtomValue } from "jotai"
import { playersAtom, type Player } from "./Game"
import { supabase } from "./_components/supabaseClient"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/TeamSubscription"

type Team = "A" | "B" | null

export const TeamSelector = ({
  player,
  id,
}: {
  player: Player | undefined
  id: string
}) => {
  const [teamOne, setTeamOne] = useAtom(teamOneAtom)
  const [teamTwo, setTeamTwo] = useAtom(teamTwoAtom)

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const players = useAtomValue(playersAtom)

  const selectTeam = async (team: Team) => {
    if (!player) return

    const isPlayerInTeamA = teamOne.players.some((p) => p.key === player.key)
    const isPlayerInTeamB = teamTwo.players.some((p) => p.key === player.key)

    if (team === "A" && !isPlayerInTeamA) {
      setTeamOne((oldTeam) => {
        return {
          ...oldTeam,
          players: [...oldTeam.players, player],
        }
      })

      if (isPlayerInTeamB) {
        setTeamTwo((oldTeam) => {
          return {
            ...oldTeam,
            players: oldTeam.players.filter((p) => p.key !== player.key),
          }
        })
      }

      await channelA.send({
        type: "broadcast",
        event: "teams",
        payload: {
          message: {
            teamOne,
            teamTwo,
          },
        },
      })

      return
    } else if (team === "B" && !isPlayerInTeamB) {
      setTeamTwo((oldTeam) => {
        return {
          ...oldTeam,
          players: [...oldTeam.players, player],
        }
      })

      if (isPlayerInTeamA) {
        setTeamOne((oldTeam) => {
          return {
            ...oldTeam,
            players: oldTeam.players.filter((p) => p.key !== player.key),
          }
        })
      }

      await channelA.send({
        type: "broadcast",
        event: "teams",
        payload: {
          message: {
            teamOne,
            teamTwo,
          },
        },
      })
    }
  }

  const distributePlayersRandomly = async () => {
    // Make a copy of the players array and shuffle it
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

    // Split the shuffled array into two halves
    const halfwayThrough = Math.ceil(shuffledPlayers.length / 2)
    const teamOnePlayers = shuffledPlayers.slice(0, halfwayThrough)
    const teamTwoPlayers = shuffledPlayers.slice(halfwayThrough)

    // Set team A and team B state with these halves
    setTeamOne((oldTeam) => {
      return {
        ...oldTeam,
        players: teamOnePlayers,
      }
    })
    setTeamTwo((oldTeam) => {
      return {
        ...oldTeam,
        players: teamTwoPlayers,
      }
    })

    await channelA.send({
      type: "broadcast",
      event: "teams",
      payload: {
        message: {
          teamOne,
          teamTwo,
        },
      },
    })
  }

  return (
    <div>
      <Button onClick={() => selectTeam("A")}>Join Team A</Button>
      <Button onClick={() => selectTeam("B")}>Join Team B</Button>

      <Button onClick={distributePlayersRandomly}>
        Distribute Players Randomly
      </Button>
    </div>
  )
}
