import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useState } from "react"
import { playersAtom, type Player } from "./Game2"

// Define atoms for team A and B
export const teamAState = atom<Player[]>([])

export const teamBState = atom<Player[]>([])

type Team = "A" | "B" | null

// TeamSelector component
export const TeamSelector = ({ player }: { player: Player | undefined }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team>(null)
  const [teamA, setTeamA] = useAtom(teamAState)
  const [teamB, setTeamB] = useAtom(teamBState)

  const players = useAtomValue(playersAtom)

  const selectTeam = (team: Team) => {
    if (!player) return

    const isPlayerInTeamA = teamA.some((p) => p.key === player.key)
    const isPlayerInTeamB = teamB.some((p) => p.key === player.key)

    if (team === "A" && !isPlayerInTeamA) {
      setTeamA((oldTeamA) => [...oldTeamA, player])
      if (isPlayerInTeamB) {
        setTeamB((oldTeamB) => oldTeamB.filter((p) => p.key !== player.key))
      }
    } else if (team === "B" && !isPlayerInTeamB) {
      setTeamB((oldTeamB) => [...oldTeamB, player])
      if (isPlayerInTeamA) {
        setTeamA((oldTeamA) => oldTeamA.filter((p) => p.key !== player.key))
      }
    }

    setSelectedTeam(team)
  }

  const distributePlayersRandomly = () => {
    // Make a copy of the players array and shuffle it
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

    // Split the shuffled array into two halves
    const halfwayThrough = Math.ceil(shuffledPlayers.length / 2)
    const teamAPlayers = shuffledPlayers.slice(0, halfwayThrough)
    const teamBPlayers = shuffledPlayers.slice(halfwayThrough)

    // Set team A and team B state with these halves
    setTeamA(teamAPlayers)
    setTeamB(teamBPlayers)
  }

  // Inside your render method

  return (
    <div>
      <Button onClick={() => selectTeam("A")}>Join Team A</Button>
      <Button onClick={() => selectTeam("B")}>Join Team B</Button>
      {selectedTeam && <p>You have selected Team {selectedTeam}</p>}

      <Button onClick={distributePlayersRandomly}>
        Distribute Players Randomly
      </Button>
    </div>
  )
}
