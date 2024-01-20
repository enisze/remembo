import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { playersAtom, type Player } from "./Game"
import { supabase } from "./_components/supabaseClient"
import { nameAtom } from "./page"

export const meAtom = atom<Player | null>(null)

export const PlayerPresence = ({
  id,
  playerName,
}: {
  id: string
  playerName: string
}) => {
  const [players, setPlayers] = useAtom(playersAtom)
  const setMe = useSetAtom(meAtom)

  const name = useAtomValue(nameAtom)

  const subscribed = useRef(false)

  const presence = supabase.channel("presence")

  useEffect(() => {
    if (subscribed.current) return

    presence
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        const user = newPresences.at(0)

        const myself = newPresences.find((p) => (p?.user as string) === name)

        setMe({
          key: myself?.presence_ref,
          name: myself?.user as string,
        })

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
        void presence.track({
          user: playerName,
          online_at: new Date().toISOString(),
        })
      })

    subscribed.current = true
  }, [id, name, playerName, presence, setMe, setPlayers, subscribed])

  return (
    <>
      <div className="rounded-md border p-4">Players</div>
      {players.map((p) => (
        <div key={p.key}>{p.name}</div>
      ))}
    </>
  )
}
