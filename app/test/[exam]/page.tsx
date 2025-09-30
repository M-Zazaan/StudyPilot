"use client";

import { useParams } from "next/navigation";
import Question from "@/components/test/question";

export default function ExamPage() {
  const { exam } = useParams();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-1 pt-2">
        <h1 className="text-xl font-semibold">Exam: {exam?.toString().toUpperCase()}</h1>
        <p className="text-muted-foreground">
          Answer the following questions to test your knowledge.
        </p>
      </header>

      <Question examType={exam?.toString() || "custom"} />
    </div>
  );
}
