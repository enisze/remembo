"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

const supabaseUrl = "https://zcpeifmwjlqfnqutpsrk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcGVpZm13amxxZm5xdXRwc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5ODE5MDYsImV4cCI6MjAxOTU1NzkwNn0.P4gVfDpWHS99qpTvt2tbjGC9VDdTnwk2NaBrxBHtR0w";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const roomName = "game_room";
  const channel = supabase.channel(roomName);

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

  // Subscribe to new messages (e.g., player names)
  const playerName = "Player1";

  return (
    <div>
      <button
        onClick={async () => {
          await channel
            .send({
              type: "broadcast",
              event: "MESSAGE",
              payload: { message: "Hello world!" },
            })
            .then((response) => {
              console.log("Broadcast response:", response);
            });
        }}
      >
        test
      </button>
    </div>
  );
}
