"use client"

import { Card } from "@/components/ui/card"
import type { Attempt } from "@/lib/types"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function ResultsSummary({ attempt }: { attempt: Attempt }) {
  const pct = Math.round((attempt.correct / attempt.total) * 100)
  const data = Object.entries(attempt.perTopic).map(([topic, v]) => ({
    topic,
    correct: v.correct,
    total: v.total,
  }))

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{new Date(attempt.createdAt).toLocaleString()}</div>
          <h2 className="text-lg font-semibold">{attempt.test.title}</h2>
          <p className="text-muted-foreground">
            Score: <span className="font-medium">{attempt.correct}</span> / {attempt.total} ({pct}%)
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-2 text-sm font-medium">Performance by Topic</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="correct" fill="var(--color-chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
