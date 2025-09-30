"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "@/lib/types"

export function QuestionCard({
  q,
  value,
  onChange,
  index,
}: {
  q: Question
  value?: string
  onChange: (choiceId: string) => void
  index: number
}) {
  return (
    <div className="space-y-3 p-4">
      <div className="text-sm text-muted-foreground">Question {index + 1}</div>
      <div className="text-pretty">{q.stem}</div>
      <RadioGroup value={value} onValueChange={onChange} className="mt-2 grid gap-2">
        {q.choices.map((c) => (
          <div key={c.id} className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem id={`${q.id}_${c.id}`} value={c.id} />
            <Label htmlFor={`${q.id}_${c.id}`} className="flex-1 text-pretty">
              {c.label}. {c.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
