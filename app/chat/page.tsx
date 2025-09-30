"use client"

import { ChatPanel } from "@/components/chat/chat-panel"

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-1 pt-2">
        <h1 className="text-pretty text-xl font-semibold">Study Chat</h1>
        <p className="text-muted-foreground">
          Claude-like experience for studying: generate MCQs, get explanations, make notes, and plan sessions.
        </p>
      </header>

      {/* Main chat area */}
      <div className="min-h-[70vh]">
        <ChatPanel />
      </div>
    </div>
  )
}
