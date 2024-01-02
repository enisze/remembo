"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "./_components/supabaseClient";

export function Cards({ id }: { id: string }) {
  const [cardOne, setCardOne] = useState<string>("");
  const [cardTwo, setCardTwo] = useState<string>("");
  const [cardThree, setCardThree] = useState<string>("");

  const channelA = supabase.channel(id, {
    config: {
      broadcast: { self: true },
    },
  });

  return (
    <div className="flex flex-col gap-3 bg-blue-400 p-4">
      <CardInput
        value={cardOne}
        onChange={(value) => {
          setCardOne(value);
        }}
      />
      <CardInput
        value={cardTwo}
        onChange={(value) => {
          setCardTwo(value);
        }}
      />
      <CardInput
        value={cardThree}
        onChange={(value) => {
          setCardThree(value);
        }}
      />

      <Button
        variant="outline"
        onClick={async () => {
          console.log("sending");
          await channelA.send({
            type: "broadcast",
            event: "testing",
            payload: { message: [cardOne, cardTwo, cardThree], type: "cards" },
          });
        }}
      >
        Submit Cards
      </Button>
    </div>
  );
}

const CardInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-3 bg-blue-400 p-4">
      <Label htmlFor="card">Card 1</Label>
      <Input
        id="card"
        type="text"
        placeholder="card"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};
