export interface GameHistoryRaw {
  roomId: string
  token: string
  entryFee: number
  prize: number
  status: 'matching' | 'enqueued' | 'started' | 'finished' | 'canceled'
  winnerId?: string
  updatedAt?: string | Date
  createdAt?: string | Date
  players?: { id: string, score: number }[]
  quitPlayers?: { id: string, score: number }[]
}

export interface GameHistoryItem {
  id: string
  date: string
  time: string
  bet: number
  score: number
  prize: number
  result: 'win' | 'lose' | 'canceled' | 'abandoned'
  players?: { id: string }[]
  quitPlayers?: { id: string }[]
}

export function formatGameHistory(
  game: GameHistoryRaw,
  userId: string,
): GameHistoryItem {
  let result: GameHistoryItem['result'] = 'canceled'
  let prize = game.prize
  let bet = game.entryFee
  const score = game.players?.find(p => p.id === userId)?.score || game.quitPlayers?.find(p => p.id === userId)?.score || 0
  if (game.status === 'canceled') {
    result = 'canceled'
    prize = 0
    bet = 0
  }
  else if (game.winnerId === userId) {
    result = 'win'
  }
  else if (game.status === 'finished') {
    const abandoned = (game.quitPlayers || []).some(p => p.id === userId)
    result = abandoned ? 'abandoned' : 'lose'
    prize = 0
  }
  const dateObj = new Date(game.updatedAt || game.createdAt || Date.now())
  return {
    id: game.roomId,
    date: dateObj.toLocaleDateString('es-ES'),
    time: dateObj.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    bet,
    prize,
    result,
    score,
  }
}
