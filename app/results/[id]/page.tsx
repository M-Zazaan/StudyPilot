"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ResultData = {
  score: number;
  total: number;
  wrong: number;
  examType: string;
  questions?: {
    question: string;
    options: string[];
    answer: string;
    selected?: string | null;
  }[];
};

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    if (!id) return;
    const data = localStorage.getItem(`result-${id}`);
    if (data) {
      setResult(JSON.parse(data));
    }
  }, [id]);

  if (!result) {
    return <p className="text-center">⚠️ No result found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1 pt-2">
        <h1 className="text-2xl font-semibold">Results</h1>
        <p className="text-muted-foreground">
          Exam Type: <strong>{result.examType.toUpperCase()}</strong>
        </p>
      </header>

      <div className="p-4 border rounded">
        <p className="text-lg">
          ✅ Score: <strong>{result.score}</strong> / {result.total}
        </p>
        <p className="text-red-500">
          ❌ Wrong: {result.wrong}
        </p>
      </div>

      {result.questions && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review</h2>
          {result.questions.map((q, idx) => (
            <div
              key={idx}
              className="border rounded p-4 space-y-2 bg-gray-50"
            >
              <p className="font-medium">
                Q{idx + 1}. {q.question}
              </p>
              <div className="space-y-1">
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.answer;
                  const isChosen = opt === q.selected;

                  return (
                    <p
                      key={i}
                      className={`px-2 py-1 rounded ${
                        isCorrect
                          ? "bg-green-100 text-green-700"
                          : isChosen
                          ? "bg-red-100 text-red-700"
                          : ""
                      }`}
                    >
                      {opt}
                      {isCorrect && " ✅"}
                      {isChosen && !isCorrect && " ❌"}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/test/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Take Another Test
        </button>
        <button
          onClick={() => router.push("/chat")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Go to Study Chat
        </button>
      </div>
    </div>
  );
}
