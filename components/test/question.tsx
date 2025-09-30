"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MCQ = {
  question: string;
  options: string[];
  answer: string;
};

async function fetchMCQ(examType: string): Promise<MCQ> {
  const response = await fetch("https://sciaticmz-studypilot.hf.space/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Generate a ${examType} style MCQ`, mode: "mcq" }),
  });

  const data = await response.json();
  return data.response as MCQ;
}

export default function Question({ examType }: { examType: string }) {
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const generateMCQs = async () => {
    setLoading(true);
    setFeedback(null);
    setSelected(null);
    setCurrent(0);
    setScore(0);

    try {
      const newQs: MCQ[] = [];
      for (let i = 0; i < 5; i++) {
        const q = await fetchMCQ(examType);
        newQs.push(q);
      }
      setQuestions(newQs);
    } catch {
      setFeedback("⚠️ Error fetching MCQs.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!questions[current] || !selected) return;
    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong. Correct: ${questions[current].answer}`);
    }
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      const id = Date.now();
      localStorage.setItem(
        `result-${id}`,
        JSON.stringify({
          score,
          total: questions.length,
          wrong: questions.length - score,
          examType,
        })
      );
      router.push(`/results/${id}`);
    }
  };

  const currentQ = questions[current];

  return (
    <div className="space-y-4">
      <button
        onClick={generateMCQs}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Start Test"}
      </button>

      {currentQ && (
        <div className="border rounded p-4">
          <h2 className="font-semibold">
            Q{current + 1}. {currentQ.question}
          </h2>
          <div className="space-y-2 mt-2">
            {currentQ.options.map((opt, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />{" "}
                {opt}
              </label>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={checkAnswer}
              className="bg-green-500 text-white px-3 py-1 rounded"
              disabled={!selected}
            >
              Check
            </button>
            <button
              onClick={nextQuestion}
              className="bg-purple-500 text-white px-3 py-1 rounded"
              disabled={!feedback}
            >
              {current + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </div>

          {feedback && <p className="mt-2">{feedback}</p>}
        </div>
      )}
    </div>
  );
}
