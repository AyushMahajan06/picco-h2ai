"use client"

import { useState } from "react"

// OpenAI API key - IMPORTANT: In a production app, this should be an environment variable
const OPENAI_API_KEY = "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"

export function useOpenAI() {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")

  const generateSummary = async (patientData: any) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are a medical AI assistant specializing in Parkinson's disease. Analyze the provided patient data and generate a concise summary of the patient's condition. Do not provide a diagnosis or point out any diseases. Only analyze the given ",
            },
            {
              role: "user",
              content: `Generate a summary for a Parkinson's patient based on the following data: ${JSON.stringify(patientData)}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "Error generating summary")
      }

      setSummary(data.choices[0].message.content)
    } catch (err: any) {
      setError(err.message || "Failed to generate summary")
      console.error("OpenAI API error:", err)
    } finally {
      setLoading(false)
    }
  }

  return { generateSummary, summary, loading, error }
}

