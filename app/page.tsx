"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-pretty text-2xl font-semibold">AI Study Assistant</h1>
        <p className="text-muted-foreground">
          Prepare for SAT, IELTS, and more with adaptive tests, smart analytics, and a Claude-like study chat.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Study Chat</CardTitle>
            <CardDescription>Ask questions, create notes, or generate MCQs.</CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <Button asChild className="ml-auto">
              <Link href="/chat">Open Chat</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Test</CardTitle>
            <CardDescription>Create an adaptive practice test by exam.</CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <Button asChild className="ml-auto">
              <Link href="/test/new">Create Test</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Review your performance and weaknesses.</CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <Button variant="secondary" asChild className="ml-auto">
              <Link href="/results/demo">View Demo</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
