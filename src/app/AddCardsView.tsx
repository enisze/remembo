import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { type Payload } from "./Game"
import { supabase } from "./_components/supabaseClient"

export const cardAtom = atom<string[]>([])
export const AddCardsSubscribe = ({ id }: { id: string }) => {
  const setCards = useSetAtom(cardAtom)

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

    test.current = true
  }, [supabase])

  return null
}
