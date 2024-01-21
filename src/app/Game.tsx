"use client"

import { atom, useAtomValue } from "jotai"
import { type z } from "zod"
import { PlayerPresence } from "./PlayerPresence"
import { TeamSelector } from "./TeamSelector"
import { Timer } from "./Timer"
import {
  teamOneAtom,
  teamTwoAtom,
  type playerSchema,
} from "./_subscriptions/useHandleTeams"

export type Player = z.infer<typeof playerSchema>
export const playersAtom = atom<Player[]>([])

export function Game({ playerName }: { playerName: string }) {
  const players = useAtomValue(playersAtom)
  const teamOne = useAtomValue(teamOneAtom)
  const teamTwo = useAtomValue(teamTwoAtom)

  return (
    <div className="flex h-screen flex-col gap-3 bg-slate-800 p-4 text-white">
      <PlayerPresence playerName={playerName} />
      <TeamSelector player={players.find((p) => p.name === playerName)} />
      <div className="rounded-md border p-4">Teams</div>
      <div className="text-md">TEAM A</div>
      {teamOne.players.map((m) => (
        <div key={m.key}>{m.name}</div>
      ))}
      <div className="text-md">TEAM B</div>
      {teamTwo.players.map((m) => (
        <div key={m.key}>{m.name}</div>
      ))}

      <Timer />
    </div>
  )
}
