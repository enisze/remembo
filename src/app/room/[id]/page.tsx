"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const supabaseUrl = "https://zcpeifmwjlqfnqutpsrk.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcGVpZm13amxxZm5xdXRwc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5ODE5MDYsImV4cCI6MjAxOTU1NzkwNn0.P4gVfDpWHS99qpTvt2tbjGC9VDdTnwk2NaBrxBHtR0w"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const params = useParams()

  const roomName = params.id

  if (!roomName) return <div>no room name</div>

  const channel = supabase.channel(roomName)

  const [playername, setPlayername] = useState("")

  const test = useRef(false)

  // Subscribe to presence changes
  useEffect(() => {
    // channel
    //   .on("presence", { event: "sync" }, (event) => {
    //     console.log("Presence change:", event);
    //   })
    //   .subscribe();

    if (test.current) return

    channel
      .on("broadcast", { event: "MESSAGE" }, (payload) => {
        console.log("New message:", payload)
      })
      .subscribe()

    test.current = true
  }, [])

  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Input
        type="text"
        placeholder="playername"
        value={playername}
        onChange={(e) => {
          setPlayername(e.target.value)
        }}
      />
      <Button
        variant="outline"
        onClick={async () => {
          await channel.send({
            type: "broadcast",
            event: "MESSAGE",
            payload: { message: playername },
          })
        }}
      >
        test
      </Button>
    </div>
  )
}
