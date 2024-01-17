import { atom, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { supabase } from "../_components/supabaseClient"

export type Payload = {
  payload: { message: string | string[] }
  type: "broadcast"
  event: string
}
export const cardAtom = atom<string[]>([])
export const AddCardsSubscribe = ({ id }: { id: string }) => {
  const setCards = useSetAtom(cardAtom)
  const called = useRef(false)
  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  })

  const messageReceived = ({ payload }: Payload) => {
    console.log(payload)
    setCards((prevCards) => [...prevCards, ...(payload.message as string[])])
  }

  useEffect(() => {
    if (called.current) return

    channelA
      .on("broadcast", { event: "cards" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe()

    called.current = true
  }, [supabase])

  return null
}
