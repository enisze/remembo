import { Button } from "@/components/ui/button"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { cardAtom } from "./AddCardsView"
import { type Player } from "./Game"
import { NextItem } from "./NextItem"

type Team = {
  players: Player[]
  remainingTime: number
  points: number
}

export const teamsAtom = atom<Team[]>([
  { players: [], remainingTime: 0, points: 0 },
  { players: [], remainingTime: 0, points: 0 },
])
const currentPlayerAtom = atom<Player | undefined>(undefined)
export const currentTeamAtom = atom(0)

export const currentItemAtom = atom("")
export const displayedItemsAtom = atom<string[]>([])
export const timerStartedAtom = atom(false)

function getNextPlayer(
  teamPlayers: Player[],
  currentPlayer: Player | undefined,
) {
  if (!currentPlayer) return teamPlayers[0]
  const currentPlayerIndex = teamPlayers.indexOf(currentPlayer)
  return currentPlayerIndex === teamPlayers.length - 1
    ? teamPlayers[0]
    : teamPlayers[currentPlayerIndex + 1]
}

export const Timer = () => {
  const initialCards = useAtomValue(cardAtom)
  const displayedItems = useAtomValue(displayedItemsAtom)

  const [currentItem, setCurrentItem] = useAtom(currentItemAtom)
  const [timerStarted, setTimerStarted] = useAtom(timerStartedAtom)
  const [timeLeft, setTimeLeft] = useState(60)

  const [teams, setTeams] = useAtom(teamsAtom)
  const team1Players = teams[0]?.players ?? []
  const team2Players = teams[1]?.players ?? []

  const remainingTimeA = teams[0]?.remainingTime ?? 0
  const remainingTimeB = teams[1]?.remainingTime ?? 0
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom)
  const [currentTeam, setCurrentTeam] = useAtom(currentTeamAtom)

  const remainingCards = useMemo(
    () => initialCards.filter((item) => !displayedItems.includes(item)),
    [initialCards, displayedItems],
  )

  const handleNextPlayer = () => {
    const remainingTime = currentTeam === 1 ? remainingTimeA : remainingTimeB
    setTimeLeft(60 + remainingTime)

    setCurrentTeam(currentTeam === 1 ? 2 : 1)
    setCurrentPlayer(
      getNextPlayer(
        currentTeam === 1 ? team2Players : team1Players,
        currentPlayer,
      ),
    )
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (timerStarted) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1

          setTeams((prevTeams) => {
            const newTeams = [...prevTeams]
            if (currentTeam === 1) {
              if (newTeams[0]) {
                newTeams[0].remainingTime = newTime
              }
            } else {
              if (newTeams[1]) {
                newTeams[1].remainingTime = newTime
              }
            }
            return newTeams
          })

          return newTime
        })
        if (timeLeft <= 0) {
          setCurrentItem("Over")
          setTimerStarted(false)
          setCurrentTeam(currentTeam === 1 ? 2 : 1)
          setCurrentPlayer(
            getNextPlayer(
              currentTeam === 1 ? team2Players : team1Players,
              currentPlayer,
            ),
          )
        }
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerStarted, timeLeft, currentPlayer, currentTeam])

  return (
    <div>
      <h1>Its your turn</h1>
      <div>{currentPlayer?.name}</div>
      <h1>Timer</h1>
      <p>Time left: {timeLeft}</p>
      <p>{currentItem}</p>

      {timeLeft <= 0 ||
        (displayedItems.length === initialCards.length && (
          <Button variant="outline" onClick={handleNextPlayer}>
            Next player
          </Button>
        ))}

      <Button
        onClick={() => {
          if (remainingCards.length > 0) {
            setTimerStarted(true)

            const card = remainingCards[0]
            if (card) {
              setCurrentItem(card)
              setCurrentPlayer(
                getNextPlayer(
                  currentTeam === 1 ? team1Players : team2Players,
                  currentPlayer,
                ),
              )
            }
          }
        }}
      >
        Start
      </Button>

      <NextItem remainingItems={remainingCards} />
    </div>
  )
}
