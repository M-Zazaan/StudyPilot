"use client";

import { useState } from "react";

type MCQ = {
  question: string;
  options: string[];
  answer: string;
};

// Backend helper
async function fetchMCQ(topic: string): Promise<MCQ> {
  const response = await fetch("https://sciaticmz-studypilot.hf.space/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: topic, mode: "mcq" }),
  });

  const data = await response.json();
  return data.response as MCQ;
}

export default function Question() {
  const [mcq, setMcq] = useState<MCQ | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateMCQ = async () => {
    setLoading(true);
    setFeedback(null);
    setSelected(null);
    try {
      const newMcq = await fetchMCQ("SAT math practice");
      setMcq(newMcq);
    } catch (err) {
      setFeedback("⚠️ Error fetching MCQ.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!mcq || !selected) return;
    if (selected === mcq.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong. Correct answer: ${mcq.answer}`);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateMCQ}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate MCQ"}
      </button>

      {mcq && (
        <div className="border rounded p-4">
          <h2 className="font-semibold">{mcq.question}</h2>
          <div className="space-y-2 mt-2">
            {mcq.options.map((opt, i) => (
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

          <button
            onClick={checkAnswer}
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            disabled={!selected}
          >
            Check Answer
          </button>

          {feedback && <p className="mt-2">{feedback}</p>}
        </div>
      )}
    </div>
  );
}
