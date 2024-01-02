import { Button } from "@/components/ui/button";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  return (
    <div className="flex h-screen flex-col gap-3 bg-blue-400 p-4">
      <Link href={`/room/${uuidv4()}`}>
        <Button variant="outline">New game room</Button>
      </Link>
    </div>
  );
}
