"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storePlannedTest } from "@/lib/local-store"
import type { PlannedTest } from "@/lib/types"

export default function NewTestPage() {
  const router = useRouter()
  const [exam, setExam] = useState<"sat" | "ielts">("sat")
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState(10 as number)
  const [difficulty, setDifficulty] = useState<"mixed" | "easy" | "medium" | "hard">("mixed")

  function onCreate() {
    const plan: PlannedTest = {
      id: `plan_${Date.now()}`,
      exam,
      topic: topic || (exam === "sat" ? "SAT Practice" : "IELTS Reading"),
      count,
      difficulty,
    }
    storePlannedTest(plan)
    router.push(`/test/${exam}?plan=${plan.id}`)
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-pretty text-xl font-semibold">Create a Test</h1>
        <p className="text-muted-foreground">
          Choose an exam, topic, and size. We’ll render it in the exam’s familiar layout.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Test Settings</CardTitle>
          <CardDescription>These run fully client-side to keep costs at zero.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Exam</Label>
            <Select value={exam} onValueChange={(v) => setExam(v as "sat" | "ielts")}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sat">SAT</SelectItem>
                <SelectItem value="ielts">IELTS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topic (optional)</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Algebra, Reading Passage on Science"
            />
          </div>

          <div className="space-y-2">
            <Label>Number of Questions</Label>
            <Input
              type="number"
              min={5}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 10)}
            />
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button onClick={onCreate}>Create Test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
