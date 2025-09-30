export type ExamId = "sat" | "ielts"

export type Choice = {
  id: string
  label: "A" | "B" | "C" | "D"
  text: string
}

export type Question = {
  id: string
  stem: string
  choices: Choice[]
  answerId: string
  topic?: string
  difficulty?: "easy" | "medium" | "hard"
}

export type Test = {
  id: string
  exam: ExamId
  title: string
  durationSec: number
  questions: Question[]
}

export type Attempt = {
  id: string
  test: Test
  answers: Record<string, string>
  correct: number
  total: number
  perTopic: Record<string, { total: number; correct: number }>
  createdAt: string
}

export type PlannedTest = {
  id: string
  exam: ExamId
  topic: string
  count: number
  difficulty: "mixed" | "easy" | "medium" | "hard"
}
