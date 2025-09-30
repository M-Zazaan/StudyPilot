"use client"

import { useMemo, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { TestToolbar } from "./test-toolbar"
import { QuestionCard } from "./question"
import type { Attempt, Test } from "@/lib/types"
import { saveAttempt } from "@/lib/local-store"

export function SATTestRunner({ test }: { test: Test }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [index, setIndex] = useState(0)

  const palette = useMemo(() => test.questions.map((q) => ({ id: q.id })), [test.questions])

  function setAnswer(qid: string, choiceId: string) {
    setAnswers((a) => ({ ...a, [qid]: choiceId }))
  }

  function onSubmit() {
    const correct = test.questions.filter((q) => answers[q.id] === q.answerId).length
    const attempt: Attempt = {
      id: `attempt_${Date.now()}`,
      test,
      answers,
      correct,
      total: test.questions.length,
      perTopic: aggregateByTopic(test, answers),
      createdAt: new Date().toISOString(),
    }
    saveAttempt(attempt)
    window.location.href = `/results/${attempt.id}`
  }

  const current = test.questions[index]

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <TestToolbar durationSec={test.durationSec} onSubmit={onSubmit} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
        {/* Main question area */}
        <div>
          <QuestionCard
            q={current}
            index={index}
            value={answers[current.id]}
            onChange={(v) => setAnswer(current.id, v)}
          />
        </div>

        {/* Right palette */}
        <div className="border-l bg-card p-3">
          <div className="text-sm font-medium">Question Palette</div>
          <Separator className="my-2" />
          <div className="grid grid-cols-5 gap-2">
            {palette.map((p, i) => {
              const answered = !!answers[p.id]
              const isActive = i === index
              return (
                <button
                  key={p.id}
                  onClick={() => setIndex(i)}
                  className={[
                    "rounded-md border p-2 text-center text-xs",
                    isActive ? "bg-primary text-primary-foreground" : "",
                    !isActive && answered ? "bg-accent" : "",
                  ].join(" ")}
                  aria-label={`Go to question ${i + 1}`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between border-t p-3">
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Previous
        </button>
        <button
          disabled={index === test.questions.length - 1}
          onClick={() => setIndex((i) => Math.min(test.questions.length - 1, i + 1))}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function aggregateByTopic(test: Test, answers: Record<string, string>) {
  const map: Record<string, { total: number; correct: number }> = {}
  for (const q of test.questions) {
    const key = q.topic || "General"
    map[key] ??= { total: 0, correct: 0 }
    map[key].total += 1
    if (answers[q.id] === q.answerId) map[key].correct += 1
  }
  return map
}
