"use client";

import Question from "@/components/test/question";

export default function TestPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-1 pt-2">
        <h1 className="text-xl font-semibold">Practice Test</h1>
        <p className="text-muted-foreground">
          Generate SAT/IELTS style MCQs, attempt them, and check your answers.
        </p>
      </header>

      <Question />
    </div>
  );
}
