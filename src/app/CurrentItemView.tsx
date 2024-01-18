import { useAtomValue } from "jotai"
import { meAtom } from "./PlayerPresence"
import { currentCardAtom } from "./_subscriptions/useHandleCurrentCard"
import { currentPlayerAtom } from "./_subscriptions/useHandleCurrentPlayer"

export const CurrentItemView = () => {
  const currentCard = useAtomValue(currentCardAtom)
  const currentPlayer = useAtomValue(currentPlayerAtom)
  const me = useAtomValue(meAtom)

  if (currentPlayer?.key !== me?.key) return null

  return <p className="text-md font-bold">{currentCard}</p>
}
