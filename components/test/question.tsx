"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type Question = {
  question: string;
  options: string[];
  answer: string;
  topic: string; // ✅ added topic tag
  selected?: string | null;
};

export default function Question({
  examType = "SAT",
}: {
  examType?: string;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function generateQuestions() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examType }),
      });

      const data = await res.json();
      // Expecting data.questions = [{question, options, answer, topic}]
      setQuestions(data.questions);
      setCurrent(0);
      setScore(0);
      setFinished(false);
    } catch (err) {
      console.error("Error generating MCQs", err);
    }

    setLoading(false);
  }

  function selectOption(option: string) {
    const updated = [...questions];
    updated[current].selected = option;
    setQuestions(updated);
  }

  function nextQuestion() {
    if (!questions[current].selected) return; // must answer

    if (questions[current].selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      finishTest(updatedResults());
    }
  }

  function updatedResults() {
    return {
      score,
      total: questions.length,
      wrong: questions.length - score,
      examType,
      questions,
    };
  }

  function finishTest(result: any) {
    setFinished(true);

    const id = uuidv4();
    localStorage.setItem(`result-${id}`, JSON.stringify(result));
    router.push(`/results/${id}`);
  }

  return (
    <div className="space-y-4">
      {!questions.length && !loading && (
        <button
          onClick={generateQuestions}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start {examType} Test
        </button>
      )}

      {loading && <p>⏳ Generating questions...</p>}

      {questions.length > 0 && !finished && (
        <div className="space-y-4">
          <p className="font-medium">
            Q{current + 1}/{questions.length} —{" "}
            <span className="text-sm text-gray-500">
              Topic: {questions[current].topic}
            </span>
          </p>
          <p>{questions[current].question}</p>
          <div className="space-y-2">
            {questions[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectOption(opt)}
                className={`block w-full text-left px-3 py-2 border rounded ${
                  questions[current].selected === opt
                    ? "bg-blue-100 border-blue-400"
                    : "bg-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={nextQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {current + 1 < questions.length ? "Next" : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
}
