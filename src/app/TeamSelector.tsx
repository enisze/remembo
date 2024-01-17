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
      const newTeamOne = {
        ...teamOne,
        players: [...teamOne.players, player],
      }

      setTeamOne(newTeamOne)

      let newTeamTwo = teamTwo

      if (isPlayerInTeamB) {
        newTeamTwo = {
          ...teamTwo,
          players: teamTwo.players.filter((p) => p.key !== player.key),
        }
        setTeamTwo(newTeamTwo)
      }

      await channelA.send({
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

      setTeamTwo(newTeamTwo)

      let newTeamOne = teamOne
      if (isPlayerInTeamA) {
        newTeamOne = {
          ...teamOne,
          players: teamOne.players.filter((p) => p.key !== player.key),
        }

        setTeamOne(newTeamOne)
      }

      await channelA.send({
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

    // Set team A and team B state with these halves
    setTeamOne(newTeamOne)
    setTeamTwo(newTeamTwo)

    await channelA.send({
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
