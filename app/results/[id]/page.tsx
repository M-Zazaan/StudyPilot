"use client"

import { Card } from "@/components/ui/card"
import { ResultsSummary } from "@/components/analytics/results-summary"
import { getAttempt } from "@/lib/local-store"

export default function ResultsPage({ params }: { params: { id: string } }) {
  const attempt = getAttempt(params.id) // in-memory/localStorage demo
  if (!attempt) {
    return <p className="text-muted-foreground">No results found.</p>
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-pretty text-xl font-semibold">Results</h1>
        <p className="text-muted-foreground">{attempt.test.title}</p>
      </header>

      <Card className="p-4">
        <ResultsSummary attempt={attempt} />
      </Card>
    </div>
  )
}
