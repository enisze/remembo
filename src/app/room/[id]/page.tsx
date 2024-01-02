"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~/app/_components/supabaseClient";

const message: string[] = [];

export default function Home() {
  const params = useParams();

  const roomName = params.id;

  if (!roomName) return <div>no room name</div>;

  const channelA = supabase.channel(`room`, {
    config: {
      broadcast: { self: true },
    },
  });

  const presence = supabase.channel("presence");

  const [playername, setPlayername] = useState("test");

  const [players, setPlayers] = useState([]);

  console.log(message);

  const test = useRef(false);

  const userStatus = {
    user: playername,
    online_at: new Date().toISOString(),
  };

  type Payload = {
    payload: { message: string };
    type: "broadcast";
    event: string;
  };

  const messageReceived = ({ payload }: Payload) => {
    message.push(payload.message);
    console.log("new message", payload.message);
  };

  // Subscribe to presence changes
  useEffect(() => {
    if (test.current) return;

    channelA
      .on("broadcast", { event: "testing" }, (payload) =>
        messageReceived(payload as Payload),
      )
      .subscribe();
    presence
      .on("presence", { event: "sync" }, () => {
        const newState = presence.presenceState();
        console.log("sync", newState);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe(() => {
        void presence.track(userStatus);
      });

    test.current = true;
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
          console.log("sending");
          await channelA.send({
            type: "broadcast",
            event: "testing",
            payload: { message: playername },
          });

          await presence.track(userStatus);
        }}
      >
        test
      </Button>
      {playername}
      <>
        {message.map((m) => (
          <div>{m}</div>
        ))}
      </>
    </div>
  );
}
