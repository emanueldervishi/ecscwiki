export type ContributionKind = "about" | "analyze" | "solution" | "script"

export interface DbChallengeType {
  id: string
  category: string
  slug: string
  title: string
  description: string
  created_at: string
}

export interface Contribution {
  id: string
  challenge_key: string
  kind: ContributionKind
  label: string
  body: string
  author: string | null
  author_name: string | null
  linked_id: string | null
  created_at: string
  updated_at: string
}

export interface SolvedEntry {
  id: string
  challenge_key: string
  name: string
  event: string | null
  year: number | null
  difficulty: string | null
  author: string | null
  author_name: string | null
  writeup: string | null
  linked_id: string | null
  created_at: string
}
