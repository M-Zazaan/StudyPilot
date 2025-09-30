import type { PlannedTest, Test } from "./types"

export function getMockTestFromPlan(exam: "sat" | "ielts", plan?: PlannedTest): Test {
  const count = plan?.count ?? 10
  const title = plan?.topic || (exam === "sat" ? "SAT Reading Practice" : "IELTS Reading Practice")
  const durationSec = Math.min(60 * 60, Math.max(10 * 60, count * 60)) // rough 1 min per question
  const questions = Array.from({ length: count }).map((_, i) => {
    const id = `${exam}_q${i + 1}`
    const answerId = `${id}_cA`
    return {
      id,
      stem:
        exam === "sat"
          ? `Which choice best describes the main purpose of the passage in question ${i + 1}?`
          : `According to the passage, which statement is true for item ${i + 1}?`,
      choices: [
        { id: `${id}_cA`, label: "A", text: "Statement A" },
        { id: `${id}_cB`, label: "B", text: "Statement B" },
        { id: `${id}_cC`, label: "C", text: "Statement C" },
        { id: `${id}_cD`, label: "D", text: "Statement D" },
      ],
      answerId,
      topic: i % 2 === 0 ? "Comprehension" : "Inference",
      difficulty: i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard",
    }
  })

  return {
    id: `mock_${exam}_${Date.now()}`,
    exam,
    title,
    durationSec,
    questions,
  }
}
