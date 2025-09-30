import { NextResponse } from "next/server";

async function callOpenAI(examType: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert exam MCQ generator.
Generate multiple-choice questions for the exam type: ${examType}.
Return ONLY JSON in the following format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "string (must be one of the options)",
      "topic": "string (like Grammar, Algebra, Vocabulary, Reading)"
    }
  ]
}
No explanations, only structured JSON.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "{}";
}

async function callGroq(examType: string) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768", // or "llama3-70b-8192"
      messages: [
        {
          role: "system",
          content: `You are an expert exam MCQ generator.
Generate multiple-choice questions for the exam type: ${examType}.
Return ONLY JSON in the following format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "string (must be one of the options)",
      "topic": "string (like Grammar, Algebra, Vocabulary, Reading)"
    }
  ]
}
No explanations, only structured JSON.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "{}";
}

export async function POST(req: Request) {
  try {
    const { examType } = await req.json();

    let raw = "{}";
    let parsed;

    try {
      // Try OpenAI first
      raw = await callOpenAI(examType);
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn("⚠️ OpenAI failed, switching to Groq…", err);
      try {
        raw = await callGroq(examType);
        parsed = JSON.parse(raw);
      } catch (err2) {
        console.error("❌ Both OpenAI and Groq failed", err2);
        parsed = { questions: [] };
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("MCQ API error:", error);
    return NextResponse.json(
      { error: "Failed to generate MCQs" },
      { status: 500 }
    );
  }
}
