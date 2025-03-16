"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFirebaseData } from "@/lib/firebase"
import { useOpenAI } from "@/lib/openai"
import { Sparkles } from "lucide-react"

export function AISummary() {
  const firebaseData = useFirebaseData()
  const { generateSummary, summary, loading, error } = useOpenAI()

  const handleGenerateSummary = () => {
    generateSummary({
      dbrcScore: firebaseData.dbrcScore,
      clockScore: firebaseData.clockScore,
      motorScore: firebaseData.motorScore,
      subtractScore: firebaseData.subtractScore,
      tremorDuration: firebaseData.tremorDuration,
      environmentData: {
        temperature: firebaseData.temperature,
        humidity: firebaseData.humidity,
        heatIndex: firebaseData.heatIndex,
      },
      tremorHistory: firebaseData.tremorHistory,
    })
  }

  return (
    <div className="mb-6" id="ai-summary">
      <h2 className="text-2xl font-bold mb-4">AI Summary</h2>

      <Card>
        <CardHeader className="gradient-header text-white">
          <CardTitle>Comprehensive Analysis</CardTitle>
          <p className="text-sm font-normal">AI-powered insights based on all available data</p>
        </CardHeader>
        <CardContent className="p-6">
          {summary ? (
            <div className="prose max-w-none">
              <p>{summary}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Generate an AI-powered analysis of the patient's condition based on test results, environment data, and
                tremor patterns.
              </p>
              <Button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 rounded-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate Summary"}
              </Button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

