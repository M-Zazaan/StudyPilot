import type { Attempt, PlannedTest } from "./types"

const ATTEMPTS = "sb_attempts"
const PLANNED = "sb_planned"

export function saveAttempt(a: Attempt) {
  const all = getAllAttempts()
  all.unshift(a)
  localStorage.setItem(ATTEMPTS, JSON.stringify(all).toString())
}

export function getAttempt(id: string): Attempt | undefined {
  return getAllAttempts().find((a) => a.id === id)
}

export function getAllAttempts(): Attempt[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS) || "[]") as Attempt[]
  } catch {
    return []
  }
}

export function storePlannedTest(p: PlannedTest) {
  const all = getAllPlanned()
  all.unshift(p)
  localStorage.setItem(PLANNED, JSON.stringify(all).toString())
}

export function getPlannedTest(id: string): PlannedTest | undefined {
  return getAllPlanned().find((p) => p.id === id)
}

export function getAllPlanned(): PlannedTest[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(PLANNED) || "[]") as PlannedTest[]
  } catch {
    return []
  }
}
