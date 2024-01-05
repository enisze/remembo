import { useAtomValue } from "jotai"
import { meAtom } from "./PlayerPresence"
import { currentItemAtom, currentPlayerAtom } from "./Timer"

export const CurrentItemView = () => {
  const currentItem = useAtomValue(currentItemAtom)
  const currentPlayer = useAtomValue(currentPlayerAtom)
  const me = useAtomValue(meAtom)

  if (currentPlayer?.key !== me?.key) return null

  return <p className="text-md font-bold">{currentItem}</p>
}
