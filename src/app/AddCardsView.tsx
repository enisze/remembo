import { atom, useAtom } from "jotai"
import { useEffect, useRef } from "react"
import { type Payload } from "./Game"
import { supabase } from "./_components/supabaseClient"

export const cardAtom = atom<string[]>([])
export const AddCardsView = ({ id }: { id: string }) => {
  const channelB = supabase.channel("schema-db-changes")

  const [cards, setCards] = useAtom(cardAtom)

  const test = useRef(false)

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    if (payload.type === "cards") {
      setCards((prevCards) => [...prevCards, ...(payload.message as string[])])
    }
  }

  // Subscribe to presence changes
  useEffect(() => {
    if (test.current) return

    channelA
      .on("broadcast", { event: "testing" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

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
    <div className="rounded-md border p-4">
      Cards
      {cards.map((c) => (
        <div>{c}</div>
      ))}
    </div>
  )
}
