"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string;
  selected?: string | null;
};

export default function Question({ examType }: { examType: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("https://sciaticmz-studypilot.hf.space/mcq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examType }),
        });
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions", err);
      }
    };

    fetchQuestions();
  }, [examType]);

  // Handle option selection
  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === questions[current].answer) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Correct: ${questions[current].answer}`);
    }
  };

  // Move to next question OR save results
  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      // Save current selection before moving forward
      setQuestions((prev) =>
        prev.map((q, i) =>
          i === current ? { ...q, selected } : q
        )
      );
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      // Save last question’s selection + results
      const finalQuestions = questions.map((q, i) =>
        i === current ? { ...q, selected } : q
      );

      const id = Date.now();
      localStorage.setItem(
        `result-${id}`,
        JSON.stringify({
          score,
          total: questions.length,
          wrong: questions.length - score,
          examType,
          questions: finalQuestions,
        })
      );

      router.push(`/results/${id}`);
    }
  };

  if (!questions.length) {
    return <p className="text-center">⏳ Loading questions...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Question */}
      <p className="font-medium">
        Q{current + 1}. {questions[current].question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {questions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={!!selected}
            className={`block w-full text-left p-2 border rounded ${
              selected === opt
                ? opt === questions[current].answer
                  ? "bg-green-100 border-green-500"
                  : "bg-red-100 border-red-500"
                : "hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && <p className="text-sm">{feedback}</p>}

      {/* Next button */}
      {selected && (
        <button
          onClick={nextQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {current + 1 < questions.length ? "Next Question" : "Finish Test"}
        </button>
      )}
    </div>
  );
}
