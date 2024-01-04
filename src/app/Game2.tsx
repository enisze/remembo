"use client"

import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"
import { supabase } from "~/app/_components/supabaseClient"
import { TeamSelector, teamAState, teamBState } from "./TeamSelector"
import { Timer } from "./Timer"

type Payload = {
  payload: { message: string | string[]; type: "cards" | undefined }
  type: "broadcast"
  event: string
}

export type Player = {
  key: string | undefined
  name: string | undefined
}

export const cardAtom = atom<string[]>([])

export const playersAtom = atom<Player[]>([])

export function Game({ id, playerName }: { id: string; playerName: string }) {
  const [messages, setMessages] = useState<string[]>([])

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })
  const channelB = supabase.channel("schema-db-changes")
  const presence = supabase.channel("presence")

  const [cards, setCards] = useAtom(cardAtom)
  const [players, setPlayers] = useAtom(playersAtom)

  const test = useRef(false)

  const teamA = useAtomValue(teamAState)

  const teamB = useAtomValue(teamBState)

  const userStatus = {
    user: playerName,
    online_at: new Date().toISOString(),
  }

  const messageReceived = ({ payload }: Payload) => {
    if (payload.type === "cards") {
      setCards((prevCards) => [...prevCards, ...(payload.message as string[])])
    }
    setMessages((prev) => [...prev, payload.message as string])
  }

  // Subscribe to presence changes
  useEffect(() => {
    if (test.current) return

    channelA
      .on("broadcast", { event: "testing" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()
    presence
      .on("presence", { event: "sync" }, () => {
        const newState = presence.presenceState()
        console.log("sync", newState)
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        const user = newPresences.at(0)
        setPlayers((prev) => [
          ...prev,
          { key: user?.presence_ref, name: user?.user as string },
        ])
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        const user = leftPresences.at(0)
        setPlayers((prev) => prev.filter((p) => p.key !== user?.presence_ref))
      })
      .subscribe(() => {
        void presence.track(userStatus)
      })

    channelB
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => console.log(payload),
      )
      .subscribe()

    test.current = true
  }, [supabase])

  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Button
        variant="outline"
        onClick={async () => {
          await channelA.send({
            type: "broadcast",
            event: "testing",
            payload: { message: playerName },
          })
        }}
      >
        test
      </Button>
      <div className="rounded-md border p-4">Messages</div>
      {messages.map((m) => (
        <div>{m}</div>
      ))}

      <div className="rounded-md border p-4">Players</div>
      {players.map((p) => (
        <div>{p.name}</div>
      ))}

      <div className="rounded-md border p-4">Cards</div>
      {cards.map((c) => (
        <div>{c}</div>
      ))}

      <Timer />

      <TeamSelector player={players.find((p) => p.name === playerName)} />

      <div className="rounded-md border p-4">Teams</div>

      <div className="text-md">TEAM A</div>
      {teamA.map((m) => (
        <div>{m.name}</div>
      ))}

      <div className="text-md">TEAM B</div>
      {teamB.map((m) => (
        <div>{m.name}</div>
      ))}
    </div>
  )
}
