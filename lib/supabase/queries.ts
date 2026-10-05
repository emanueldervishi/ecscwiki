"use client"

import { createClient } from "@/lib/supabase/client"

import type {
  Contribution,
  ContributionKind,
  DbChallengeType,
  SolvedEntry,
} from "./types"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Uploads a file to the public "uploads" bucket and returns its public URL. */
export async function uploadFile(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin"
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  const path = `${Date.now()}-${safe || "file"}.${ext}`
  const { error } = await supabase.storage.from("uploads").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from("uploads").getPublicUrl(path)
  return data.publicUrl
}

export async function getCurrentUser() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function listDbChallengeTypes(
  category: string
): Promise<DbChallengeType[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("challenge_types")
      .select("*")
      .eq("category", category)
      .order("title", { ascending: true })
    if (error) throw error
    return (data as DbChallengeType[]) ?? []
  } catch {
    return []
  }
}

export async function getChallengeType(
  category: string,
  slug: string
): Promise<DbChallengeType | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("challenge_types")
      .select("*")
      .eq("category", category)
      .eq("slug", slug)
      .maybeSingle()
    if (error) throw error
    return (data as DbChallengeType) ?? null
  } catch {
    return null
  }
}

export async function createChallengeType(input: {
  category: string
  title: string
  description?: string
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const slug = slugify(input.title)
  const title = input.title.trim()
  const description = input.description?.trim() ?? ""
  const { data, error } = await supabase
    .from("challenge_types")
    .insert({
      category: input.category,
      slug,
      title,
      description,
      created_by: user?.id ?? null,
    })
    .select()
    .single()
  if (error) throw error

  // Only the About tab is prefilled; everything else starts empty.
  const aboutBody = [
    `## What it is`,
    ``,
    description || `Describe what a ${title} challenge is.`,
    ``,
    `## How it occurs`,
    ``,
    `_Add how this challenge type typically occurs._`,
    ``,
    `## A quick example`,
    ``,
    `_Add a short example._`,
    ``,
    `## Fast explanation`,
    ``,
    `_The shortest version: what you see, what you do, what you get._`,
    ``,
  ].join("\n")

  try {
    await supabase.from("contributions").insert({
      challenge_key: `${input.category}/${slug}`,
      kind: "about",
      label: "About",
      body: aboutBody,
      author: user?.id ?? null,
      author_name: user?.email ?? null,
    })
  } catch {
    // Non-fatal: the challenge exists even if the starter About fails.
  }

  return data as DbChallengeType
}

export async function listContributions(
  challengeKey: string,
  kind: ContributionKind
): Promise<Contribution[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("challenge_key", challengeKey)
      .eq("kind", kind)
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data as Contribution[]) ?? []
  } catch {
    return []
  }
}

export async function getContribution(
  id: string
): Promise<Contribution | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("id", id)
      .single()
    if (error) throw error
    return data as Contribution
  } catch {
    return null
  }
}

export async function createContribution(input: {
  challengeKey: string
  kind: ContributionKind
  label: string
  body: string
  linkedId?: string | null
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      challenge_key: input.challengeKey,
      kind: input.kind,
      label: input.label.trim(),
      body: input.body,
      linked_id: input.linkedId ?? null,
      author: user?.id ?? null,
      author_name: user?.email ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data as Contribution
}

/** Entries that are linked to a given analysis (solutions, scripts, etc.). */
export async function listLinkedContributions(
  linkedId: string
): Promise<Contribution[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("linked_id", linkedId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data as Contribution[]) ?? []
  } catch {
    return []
  }
}

export async function upsertAbout(input: {
  challengeKey: string
  body: string
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // One shared "about" row per challenge.
  const existing = await listContributions(input.challengeKey, "about")
  if (existing[0]) {
    const { data, error } = await supabase
      .from("contributions")
      .update({ body: input.body, updated_at: new Date().toISOString() })
      .eq("id", existing[0].id)
      .select()
      .single()
    if (error) throw error
    return data as Contribution
  }
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      challenge_key: input.challengeKey,
      kind: "about",
      label: "About",
      body: input.body,
      author: user?.id ?? null,
      author_name: user?.email ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data as Contribution
}

export async function deleteContribution(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("contributions").delete().eq("id", id)
  if (error) throw error
}

export async function listSolved(
  challengeKey: string
): Promise<SolvedEntry[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("solved")
      .select("*")
      .eq("challenge_key", challengeKey)
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data as SolvedEntry[]) ?? []
  } catch {
    return []
  }
}

export async function createSolved(input: {
  challengeKey: string
  name: string
  event?: string
  year?: number
  difficulty?: string
  writeup?: string
  linkedId?: string | null
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("solved")
    .insert({
      challenge_key: input.challengeKey,
      name: input.name.trim(),
      event: input.event?.trim() || null,
      year: input.year ?? null,
      difficulty: input.difficulty?.trim() || null,
      writeup: input.writeup?.trim() || null,
      linked_id: input.linkedId ?? null,
      author: user?.id ?? null,
      author_name: user?.email ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data as SolvedEntry
}
