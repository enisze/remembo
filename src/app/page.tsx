"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AddCardsView } from "./AddCardsView"
import { Cards } from "./Cards"
import { Game } from "./Game"

export default function Home() {
  const [name, setName] = useState("")

  const [gameId, setGameId] = useState<string>("")

  if (gameId)
    return (
      <div className="bg-slate-800 text-white">
        <Cards id={gameId} />

        <AddCardsView id={gameId} />
        <Game id={gameId} playerName={name} />
      </div>
    )

  return (
    <div className="flex h-screen flex-col gap-3 bg-slate-800 p-4 text-white">
      <Label htmlFor="playername">Player name</Label>
      <Input
        id="playername"
        type="text"
        placeholder="playername"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <Button
        variant="outline"
        onClick={() => {
          setGameId("abc")
        }}
      >
        Create game
      </Button>
    </div>
  )
}
