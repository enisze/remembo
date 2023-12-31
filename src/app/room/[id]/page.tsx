"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~/app/_components/supabaseClient";

export default function Home() {
  const params = useParams();

  const roomName = params.id;

  if (!roomName) return <div>no room name</div>;

  const channel = supabase.channel(roomName as string);

  const [playername, setPlayername] = useState("");

  const test = useRef(false);

  // Subscribe to presence changes
  useEffect(() => {
    // channel
    //   .on("presence", { event: "sync" }, (event) => {
    //     console.log("Presence change:", event);
    //   })
    //   .subscribe();

    if (test.current) return;

    channel
      .on("broadcast", { event: "MESSAGE" }, (payload) => {
        console.log("New message:", payload);
      })
      .subscribe();

    test.current = true;
  }, []);

  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Input
        type="text"
        placeholder="playername"
        value={playername}
        onChange={(e) => {
          setPlayername(e.target.value);
        }}
      />
      <Button
        variant="outline"
        onClick={async () => {
          await channel.send({
            type: "broadcast",
            event: "MESSAGE",
            payload: { message: playername },
          });
        }}
      >
        test
      </Button>
    </div>
  );
}
