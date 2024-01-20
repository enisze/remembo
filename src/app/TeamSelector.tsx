import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { playersAtom, type Player } from "./Game"
import { getChannel } from "./_components/supabaseClient"
import { teamOneAtom, teamTwoAtom } from "./_subscriptions/useHandleTeams"
import { gameIdAtom } from "./page"

type Team = "A" | "B" | null

export const TeamSelector = ({ player }: { player: Player | undefined }) => {
  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  const id = useAtomValue(gameIdAtom)

  const channel = getChannel(id)
  const players = useAtomValue(playersAtom)

  const selectTeam = async (team: Team) => {
    if (!player) return

    const isPlayerInTeamA = teamOne.players.some((p) => p.key === player.key)
    const isPlayerInTeamB = teamTwo.players.some((p) => p.key === player.key)

    if (team === "A" && !isPlayerInTeamA) {
      const newTeamOne = {
        ...teamOne,
        players: [...teamOne.players, player],
      }

      let newTeamTwo = teamTwo

      if (isPlayerInTeamB) {
        newTeamTwo = {
          ...teamTwo,
          players: teamTwo.players.filter((p) => p.key !== player.key),
        }
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

      return
    } else if (team === "B" && !isPlayerInTeamB) {
      const newTeamTwo = {
        ...teamTwo,
        players: [...teamTwo.players, player],
      }

      let newTeamOne = teamOne
      if (isPlayerInTeamA) {
        newTeamOne = {
          ...teamOne,
          players: teamOne.players.filter((p) => p.key !== player.key),
        }
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
    }
  }

  const distributePlayersRandomly = async () => {
    // Make a copy of the players array and shuffle it
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

    // Split the shuffled array into two halves
    const halfwayThrough = Math.ceil(shuffledPlayers.length / 2)
    const teamOnePlayers = shuffledPlayers.slice(0, halfwayThrough)
    const teamTwoPlayers = shuffledPlayers.slice(halfwayThrough)

    const newTeamOne = {
      ...teamOne,
      players: teamOnePlayers,
    }

    const newTeamTwo = {
      ...teamTwo,
      players: teamTwoPlayers,
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
