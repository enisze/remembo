"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { atom } from "jotai";
import { useState } from "react";
import { Cards } from "./Cards";
import { Game } from "./Game2";

export const nameAtom = atom<string>("");

export default function Home() {
  const [name, setName] = useState("");

  const [gameId, setGameId] = useState<string>("");

  if (gameId)
    return (
      <div>
        <Cards id={gameId} />
        <Game id={gameId} playerName={name} />;
      </div>
    );

  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Label htmlFor="playername">Player name</Label>
      <Input
        id="playername"
        type="text"
        placeholder="playername"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Button
        variant="outline"
        onClick={() => {
          setGameId("abc");
        }}
      >
        Create game
      </Button>
    </div>
  );
}
