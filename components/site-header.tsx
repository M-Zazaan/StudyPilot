"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          StudyBot
          <span className="sr-only">Home</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/chat">Chat</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/test/new">New Test</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/results/demo">Results</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
