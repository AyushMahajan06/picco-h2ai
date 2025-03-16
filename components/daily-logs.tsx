"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "lucide-react"
import { getDatabase, ref, onValue } from "firebase/database"

interface LogEntry {
  title: string
  content: string
}

interface DayLog {
  date: string
  logs: LogEntry[]
}

// Sample hardcoded logs
const sampleLogData: DayLog[] = [
  {
    date: "Saturday, October 14, 2023",
    logs: [
      {
        title: "Morning Medication Report",
        content: "Took Sinemet at 7:30 AM. Noticed reduced tremors within 45 minutes. No side effects reported.",
      },
      {
        title: "Physical Therapy Session",
        content:
          "Completed 30-minute session focusing on balance exercises and hand dexterity. Reported slight fatigue afterward but improved mobility.",
      },
    ],
  },
  {
    date: "Friday, October 13, 2023",
    logs: [
      {
        title: "Sleep Pattern Report",
        content:
          "Slept for 6.5 hours with two interruptions. Reported mild discomfort in right shoulder. Used relaxation techniques to return to sleep.",
      },
      {
        title: "Cognitive Exercise Results",
        content:
          "Completed word association exercises with 85% accuracy. Showed improvement from previous session (78%).",
      },
    ],
  },
  {
    date: "Thursday, October 12, 2023",
    logs: [
      {
        title: "Tremor Observations",
        content:
          "Increased tremors noted in the morning before medication. Tremors subsided after medication but returned mildly in the evening. Possible correlation with increased stress levels due to family visit.",
      },
    ],
  },
]

export function DailyLogs() {
  const [logData, setLogData] = useState<DayLog[]>(sampleLogData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const database = getDatabase()
    const logsRef = ref(database, "dailyLogs")

    const unsubscribe = onValue(
      logsRef,
      (snapshot) => {
        setLoading(true)
        try {
          const data = snapshot.val()
          if (data) {
            // Transform the data into the format we need
            const formattedLogs: DayLog[] = Object.entries(data).map(([key, value]: [string, any]) => ({
              date: value.date,
              logs: Object.entries(value.logs || {}).map(([logKey, logValue]: [string, any]) => ({
                title: logValue.title,
                content: logValue.content,
              })),
            }))

            setLogData(formattedLogs)
          } else {
            // Use sample data if no Firebase data is available
            setLogData(sampleLogData)
          }
          setError("")
        } catch (err: any) {
          console.error("Error fetching logs:", err)
          // Use sample data on error
          setLogData(sampleLogData)
          setError("")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error("Firebase error:", err)
        // Use sample data on connection error
        setLogData(sampleLogData)
        setError("")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="mb-6" id="daily-logs">
        <h2 className="text-2xl font-bold mb-4">Daily Logs</h2>
        <p className="text-gray-600 mb-4">Loading daily logs...</p>
      </div>
    )
  }

  return (
    <div className="mb-6" id="daily-logs">
      <h2 className="text-2xl font-bold mb-4">Daily Logs</h2>
      <p className="text-gray-600 mb-4">Daily updates provided by the patient/caretaker</p>

      {logData.map((day, index) => (
        <Card key={index} className="mb-4">
          <CardHeader className="gradient-header text-white py-3">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              {day.date}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {day.logs.map((log, logIndex) => (
                <AccordionItem key={logIndex} value={`item-${index}-${logIndex}`}>
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">{log.title}</AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-gray-700">{log.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

