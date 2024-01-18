"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { atom, useAtom } from "jotai"
import { useState } from "react"
import { getChannel } from "./_components/supabaseClient"

export const showCardAtom = atom(true)

export function Cards({ id }: { id: string }) {
  const [cardOne, setCardOne] = useState<string>("")
  const [cardTwo, setCardTwo] = useState<string>("")
  const [cardThree, setCardThree] = useState<string>("")

  const [showCardComponent, setShowCardComponent] = useAtom(showCardAtom)

  const channel = getChannel(id)

  return (
    <div
      className={cn(
        "flex h-96 flex-col gap-3 p-4 transition-all duration-500 ease-in-out",
        showCardComponent ? "translate-y-0 " : "-translate-y-full",
      )}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await channel.send({
            type: "broadcast",
            event: "cards",
            payload: {
              message: [cardOne, cardTwo, cardThree],
            },
          })

          setShowCardComponent(false)
        }}
      >
        <CardInput
          value={cardOne}
          onChange={(value) => {
            setCardOne(value)
          }}
        />
        <CardInput
          value={cardTwo}
          onChange={(value) => {
            setCardTwo(value)
          }}
        />
        <CardInput
          value={cardThree}
          onChange={(value) => {
            setCardThree(value)
          }}
        />

        <Button variant="outline">Submit Cards</Button>
      </form>
    </div>
  )
}

const CardInput = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Label htmlFor="card">Card 1</Label>
      <Input
        id="card"
        type="text"
        placeholder="card"
        value={value}
        required
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}
