"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { atom, useAtom, useAtomValue } from "jotai"
import { useState } from "react"
import { AddCardsSubscribe } from "./AddCardsView"
import { Cards, showCardAtom } from "./Cards"
import { Game } from "./Game"

export const nameAtom = atom("")

export default function Home() {
  const [name, setName] = useAtom(nameAtom)

  const [gameId, setGameId] = useState<string>("")
  const showCards = useAtomValue(showCardAtom)

  if (gameId)
    return (
      <div className="bg-slate-800 text-white">
        <Cards id={gameId} />

        <div
          className={cn(
            "transform transition-all duration-500 ease-in-out",
            showCards ? "translate-y-0" : "-translate-y-96",
          )}
        >
          <AddCardsSubscribe id={gameId} />
          <Game id={gameId} playerName={name} />
        </div>
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
