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
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  // Set timer based on exam type
  useEffect(() => {
    let duration = 600; // default 10 minutes
    if (examType.toLowerCase() === "sat") duration = 30 * 60;
    if (examType.toLowerCase() === "ielts") duration = 15 * 60;
    setTimeLeft(duration);
  }, [examType]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0 && questions.length > 0) {
      finishTest(); // auto-submit
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions]);

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

  // Handle answer selection
  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === questions[current].answer) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Correct: ${questions[current].answer}`);
    }
  };

  // Next question or finish
  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setQuestions((prev) =>
        prev.map((q, i) => (i === current ? { ...q, selected } : q))
      );
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      finishTest();
    }
  };

  // Finish test and save results
  const finishTest = () => {
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
  };

  // Format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!questions.length) {
    return <p className="text-center">⏳ Loading questions...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header with timer */}
      <div className="flex justify-between items-center">
        <p className="font-medium">Exam: {examType.toUpperCase()}</p>
        <p
          className={`font-semibold ${
            timeLeft < 60 ? "text-red-500" : "text-gray-700"
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </p>
      </div>

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

      {/* Next / Finish button */}
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
