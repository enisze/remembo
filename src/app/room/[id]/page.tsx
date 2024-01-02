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

  const presenceChannel = supabase.channel("presence");

  const [playername, setPlayername] = useState("");

  presenceChannel
    .on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      console.log("sync", newState);
    })
    .on("presence", { event: "join" }, ({ key, newPresences }) => {
      console.log("join", key, newPresences);
    })
    .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      console.log("leave", key, leftPresences);
    })
    .subscribe();

  const [players, setPlayers] = useState([]);

  const test = useRef(false);

  const userStatus = {
    user: "user-1",
    online_at: new Date().toISOString(),
  };

  // Subscribe to presence changes
  useEffect(() => {
    if (test.current) return;

    const channel = supabase
      .channel(roomName as string)
      .on("broadcast", { event: "MESSAGE" }, (payload) => {
        console.log("New message:", payload);
      })
      .subscribe();

    test.current = true;

    // void presenceChannel.subscribe((status) => {
    //   if (status !== "SUBSCRIBED") {
    //     return;
    //   }

    //   const presenceTrackStatus = channel.track(userStatus);
    //   console.log(presenceTrackStatus);
    // });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

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
