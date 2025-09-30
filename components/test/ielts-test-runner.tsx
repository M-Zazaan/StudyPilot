"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { TestToolbar } from "./test-toolbar"
import { QuestionCard } from "./question"
import type { Attempt, Test } from "@/lib/types"
import { saveAttempt } from "@/lib/local-store"

export function IELTSTestRunner({ test }: { test: Test }) {
  const answers: Record<string, string> = {}
  function setAnswer(qid: string, choiceId: string) {
    answers[qid] = choiceId
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

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <TestToolbar durationSec={test.durationSec} onSubmit={onSubmit} />
      <ResizablePanelGroup direction="horizontal" className="min-h-[60vh]">
        {/* Left: Passage */}
        <ResizablePanel defaultSize={50} className="border-r bg-card p-4">
          <article className="prose prose-neutral max-w-none">
            <h2 className="m-0">{test.title}</h2>
            <p className="text-muted-foreground text-sm">Reading Passage</p>
            <hr />
            <p>
              In this demo, the left panel simulates an IELTS passage area. In your real test, the AI will insert the
              full passage content here. You may resize panels as needed.
            </p>
          </article>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* Right: Questions */}
        <ResizablePanel defaultSize={50}>
          <div className="max-h-[65vh] overflow-auto">
            {test.questions.map((q, idx) => (
              <div key={q.id} className="border-b">
                <QuestionCard q={q} index={idx} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
              </div>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
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
