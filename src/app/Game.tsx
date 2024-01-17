"use client"

import { atom, useAtomValue } from "jotai"
import { PlayerPresence } from "./PlayerPresence"
import { TeamSelector } from "./TeamSelector"
import { Timer } from "./Timer"
import { teamAState, teamBState } from "./_subscriptions/TeamSubscription"

export type Player = {
  key: string | undefined
  name: string | undefined
}

export const playersAtom = atom<Player[]>([])

export function Game({ id, playerName }: { id: string; playerName: string }) {
  const players = useAtomValue(playersAtom)

  const teamA = useAtomValue(teamAState)

  const teamB = useAtomValue(teamBState)

  return (
    <div className="flex h-screen flex-col gap-3 bg-slate-800 p-4 text-white">
      <PlayerPresence id={id} playerName={playerName} />
      <TeamSelector
        player={players.find((p) => p.name === playerName)}
        id={id}
      />
      <div className="rounded-md border p-4">Teams</div>
      <div className="text-md">TEAM A</div>
      {teamA?.map((m) => <div key={m.key}>{m.name}</div>)}
      <div className="text-md">TEAM B</div>
      {teamB?.map((m) => <div key={m.key}>{m.name}</div>)}

      <Timer id={id} />
    </div>
  )
}
