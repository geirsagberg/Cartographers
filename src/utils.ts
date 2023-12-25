export function sumScores(scores: Scores): number {
  return (
    (scores.first ?? 0) +
    (scores.second ?? 0) +
    (scores.coins ?? 0) -
    (scores.monsters ?? 0)
  )
}
