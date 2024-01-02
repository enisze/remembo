"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Button
        variant="outline"
        onClick={async () => {
          const id = uuidv4();
          router.push(`room/${id}`);
        }}
      >
        New game room
      </Button>
    </div>
  );
}
