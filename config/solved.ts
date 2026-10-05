export interface SolvedChallenge {
  /** Challenge name. */
  name: string
  /** CTF / event it appeared in. */
  event: string
  /** Year of the event. */
  year: number | string
  /** Difficulty label, e.g. easy / medium / hard. */
  difficulty?: string
  /** Team member who solved or wrote it up. */
  author?: string
  /** Link to the full write-up (internal doc path or external URL). */
  writeup?: string
}

/**
 * Solved-challenge records keyed by "<category>/<challenge-slug>".
 * Add rows here as the team solves challenges — the table fills in automatically.
 *
 * Example:
 * "pwn/ret2win": [
 *   { name: "split", event: "ROP Emporium", year: 2023, difficulty: "easy",
 *     author: "alice", writeup: "https://..." },
 * ],
 */
export const solvedChallenges: Record<string, SolvedChallenge[]> = {}
