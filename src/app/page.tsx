"use client"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

const supabaseUrl = "https://zcpeifmwjlqfnqutpsrk.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcGVpZm13amxxZm5xdXRwc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5ODE5MDYsImV4cCI6MjAxOTU1NzkwNn0.P4gVfDpWHS99qpTvt2tbjGC9VDdTnwk2NaBrxBHtR0w"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Button
        variant="outline"
        onClick={async () => {
          const id = uuidv4()
          supabase.channel(id)
          router.push(`room/${id}`)
        }}
      >
        New game room
      </Button>
    </div>
  )
}
