"use client"

import type React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, ArrowUp, ImageIcon, FileUp, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

type Message = { id: string; role: "user" | "assistant"; content: string }
type Attachment = {
  id: string
  name: string
  url: string
  mime: string
  kind: "image" | "file"
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      content:
        "Hi! I’m your study assistant. Ask me to create SAT/IELTS practice, explain answers, or make notes. You can also say “adaptive SAT reading set” to start a test.",
    },
  ])
  const [input, setInput] = useState("")
  const [pending, setPending] = useState<Attachment[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function sendMessage(text?: string) {
    const value = (text ?? input).trim()
    if (!value && pending.length === 0) return
    const userMsg: Message & { attachments?: Attachment[] } = {
      id: `u_${Date.now()}`,
      role: "user",
      content: value || (pending.length ? "(sent attachments)" : ""),
      attachments: pending.length ? pending : undefined,
    }
    setMessages((m) => [...m, userMsg])

    // Placeholder assistant reply; wire up Vercel AI SDK later in an API route.
    const reply: Message = {
      id: `a_${Date.now()}`,
      role: "assistant",
      content:
        "Great! I can process your attachments and generate study materials. Do you prefer SAT Reading or IELTS Reading to start?",
    }
    setMessages((m) => [...m, reply])
    setInput("")
    setPending([])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showStarters = messages.length <= 1

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col">
      {/* Stream */}
      <ScrollArea className="flex-1">
        <div className="mx-auto w-full space-y-4 p-4">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              {m.role === "assistant" ? (
                <>
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[85%]">
                    <div className="rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">{m.content}</div>
                    {"attachments" in m && Array.isArray((m as any).attachments) && (m as any).attachments?.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {(m as any).attachments.map((att: Attachment) =>
                          att.kind === "image" ? (
                            <img
                              key={att.id}
                              src={att.url || "/placeholder.svg"}
                              alt={att.name}
                              className="h-28 w-full rounded-lg object-cover"
                            />
                          ) : (
                            <a
                              key={att.id}
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                            >
                              <FileUp className="size-4" />
                              <span className="truncate">{att.name}</span>
                            </a>
                          ),
                        )}
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="ml-auto max-w-[85%]">
                    <div className="rounded-2xl bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                      {m.content}
                    </div>
                    {"attachments" in m && Array.isArray((m as any).attachments) && (m as any).attachments?.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {(m as any).attachments.map((att: Attachment) =>
                          att.kind === "image" ? (
                            <img
                              key={att.id}
                              src={att.url || "/placeholder.svg"}
                              alt={att.name}
                              className="h-28 w-full rounded-lg object-cover"
                            />
                          ) : (
                            <a
                              key={att.id}
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-card text-foreground"
                            >
                              <FileUp className="size-4" />
                              <span className="truncate">{att.name}</span>
                            </a>
                          ),
                        )}
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          ))}
          {showStarters && (
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <StarterChip label="Generate 5 SAT Math MCQs" onClick={() => sendMessage("Generate 5 SAT Math MCQs")} />
              <StarterChip
                label="IELTS Reading passage practice"
                onClick={() => sendMessage("IELTS Reading passage practice")}
              />
              <StarterChip
                label="Summarize notes on photosynthesis"
                onClick={() => sendMessage("Summarize notes on photosynthesis")}
              />
              <StarterChip
                label="Create a 7‑day study plan"
                onClick={() => sendMessage("Create a 7-day study plan for SAT Reading and Writing")}
              />
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="sticky bottom-0 z-10 mx-auto w-full max-w-3xl border-t bg-background/80 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-end gap-2 rounded-xl border bg-card p-2">
          {pending.length > 0 && (
            <div className="w-full">
              <div className="mb-2 grid grid-cols-3 gap-2">
                {pending.map((att) =>
                  att.kind === "image" ? (
                    <div key={att.id} className="relative">
                      <img
                        src={att.url || "/placeholder.svg"}
                        alt={att.name}
                        className="h-24 w-full rounded-md object-cover"
                      />
                      <button
                        aria-label={`Remove ${att.name}`}
                        onClick={() => setPending((p) => p.filter((x) => x.id !== att.id))}
                        className="absolute right-1 top-1 rounded-full bg-background/80 p-1"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div key={att.id} className="flex items-center justify-between gap-2 rounded-md border px-2 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileUp className="size-4 shrink-0" />
                        <span className="truncate text-sm">{att.name}</span>
                      </div>
                      <button
                        aria-label={`Remove ${att.name}`}
                        onClick={() => setPending((p) => p.filter((x) => x.id !== att.id))}
                        className="rounded-full bg-background/80 p-1"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Add attachments" className="shrink-0">
                <Plus className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem onSelect={() => imageInputRef.current?.click()} className="gap-2">
                <ImageIcon className="size-4" />
                Add image
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => fileInputRef.current?.click()} className="gap-2">
                <FileUp className="size-4" />
                Add file
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (!files.length) return
              const atts: Attachment[] = files.map((f) => ({
                id: `att_${crypto.randomUUID?.() ?? Date.now()}_${f.name}`,
                name: f.name,
                url: URL.createObjectURL(f),
                mime: f.type || "image/*",
                kind: "image",
              }))
              setPending((p) => [...p, ...atts])
              e.currentTarget.value = ""
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (!files.length) return
              const atts: Attachment[] = files.map((f) => ({
                id: `att_${crypto.randomUUID?.() ?? Date.now()}_${f.name}`,
                name: f.name,
                url: URL.createObjectURL(f),
                mime: f.type || "application/octet-stream",
                kind: f.type.startsWith("image/") ? "image" : "file",
              }))
              setPending((p) => [...p, ...atts])
              e.currentTarget.value = ""
            }}
          />
          <Textarea
            placeholder="Ask for MCQs, notes, explanations...  Press Enter to send, Shift+Enter for newline"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Message input"
            className="min-h-12 max-h-40 resize-none border-0 bg-transparent px-2 py-2 focus-visible:ring-0"
          />
          <Button
            onClick={() => sendMessage()}
            aria-label="Send message"
            className="shrink-0"
            size="icon"
            disabled={!input.trim() && pending.length === 0}
          >
            <ArrowUp className="size-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          This chat is optimized for study tasks. Upgrade later to enable AI models; local mode works free.
        </p>
      </div>
    </div>
  )
}

function StarterChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-foreground/80 hover:bg-muted/80 inline-flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors"
      aria-label={label}
    >
      <span className="text-pretty">{label}</span>
      <span className="sr-only">Start prompt</span>
    </button>
  )
}
