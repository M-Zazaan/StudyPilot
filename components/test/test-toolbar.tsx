"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function TestToolbar({
  durationSec,
  onSubmit,
}: {
  durationSec: number
  onSubmit: () => void
}) {
  const [remaining, setRemaining] = useState(durationSec)

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0")
  const ss = (remaining % 60).toString().padStart(2, "0")

  return (
    <div className="flex items-center justify-between border-b bg-card p-3">
      <div className="text-sm">
        Time Left:{" "}
        <span className="font-mono">
          {mm}:{ss}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Top
        </Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  )
}
