"use client";

import { useRouter } from "next/navigation";

export default function NewTestPage() {
  const router = useRouter();

  const startExam = (exam: string) => {
    router.push(`/test/${exam}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Start a New Test</h1>
      <p className="text-muted-foreground">Choose an exam type to begin.</p>

      <div className="space-y-3">
        <button
          onClick={() => startExam("sat")}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          SAT Practice
        </button>
        <button
          onClick={() => startExam("ielts")}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          IELTS Practice
        </button>
        <button
          onClick={() => startExam("custom")}
          className="bg-purple-500 text-white px-4 py-2 rounded w-full"
        >
          Custom Test
        </button>
      </div>
    </div>
  );
}
