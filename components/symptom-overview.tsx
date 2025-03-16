"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFirebaseData } from "@/lib/firebase"
import { TremorChart } from "@/components/tremor-chart"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { Clock, Activity, Brain, Thermometer, Droplets, Sun } from "lucide-react"

// Sample monthly data for the Monthly Analysis view
const monthlyData = {
  tremor: [
    { month: "May", avgDuration: 1.4 },
    { month: "Jun", avgDuration: 1.8 },
    { month: "Jul", avgDuration: 2.3 },
    { month: "Aug", avgDuration: 2.1 },
    { month: "Sep", avgDuration: 1.9 },
    { month: "Oct", avgDuration: 2.5 },
  ],
  cognitive: [
    { month: "May", clockScore: 62, subtractScore: 58 },
    { month: "Jun", clockScore: 65, subtractScore: 60 },
    { month: "Jul", clockScore: 70, subtractScore: 67 },
    { month: "Aug", clockScore: 72, subtractScore: 70 },
    { month: "Sep", clockScore: 74, subtractScore: 72 },
    { month: "Oct", clockScore: 75, subtractScore: 85 },
  ],
  motor: [
    { month: "May", score: 5.8 },
    { month: "Jun", score: 6.1 },
    { month: "Jul", score: 6.3 },
    { month: "Aug", score: 6.7 },
    { month: "Sep", score: 7.0 },
    { month: "Oct", score: 7.2 },
  ],
}

export function SymptomOverview() {
  const {
    dbrcScore,
    clockScore,
    motorScore,
    subtractScore,
    humidity,
    heatIndex,
    temperature,
    lastUpdated,
    formatTime,
    tremorHistory,
  } = useFirebaseData()

  const [view, setView] = useState("realtime")

  // Function to render real-time data view
  const renderRealtimeView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* DBRC Score */}
      <Card className="col-span-1 row-span-2 dbrc-box text-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            DBRC Score
            <Activity className="ml-auto h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full py-6">
            <span className="text-7xl font-bold">{dbrcScore}</span>
            <p className="text-sm mt-4 text-center">
              The DBRC Score is a score calculated by weighing the different test scores. The doctor can assign custom
              weightage for each test score depending on the patient.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clock Test Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            Clock Test Score
            <Clock className="ml-auto h-5 w-5 text-purple-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{clockScore}</span>
            <p className="text-sm text-gray-500 mt-2">
              This test assesses visuospatial ability, executive function, and planning by having a person draw a clock
              face with numbers and hands.
            </p>
            <p className="text-xs text-gray-400 mt-4">Last updated: {formatTime(lastUpdated)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card className="row-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <Thermometer className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-xl font-semibold">{temperature.toFixed(1)}°F</p>
                <p className="text-sm text-gray-500">Temperature</p>
              </div>
            </div>

            <div className="flex items-center">
              <Droplets className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-xl font-semibold">{humidity.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Humidity</p>
              </div>
            </div>

            <div className="flex items-center">
              <Sun className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <p className="text-xl font-semibold">{heatIndex.toFixed(1)}°F</p>
                <p className="text-sm text-gray-500">Heat Index</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">Last updated: {formatTime(lastUpdated)}</p>
            <p className="text-xs text-blue-500">Updates every 5 seconds</p>
          </div>
        </CardContent>
      </Card>

      {/* Motor Skills Test */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            Motor Skills Test
            <Activity className="ml-auto h-5 w-5 text-purple-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{motorScore}</span>
            <p className="text-sm text-gray-500 mt-2">
              This test assesses motor coordination and fine motor skills by having a person trace a line or shape.
            </p>
            <p className="text-xs text-gray-400 mt-4">Last updated: {formatTime(lastUpdated)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Serial Seven Subtraction Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            Serial Seven Subtraction Score
            <Brain className="ml-auto h-5 w-5 text-purple-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{subtractScore}</span>
            <p className="text-sm text-gray-500 mt-2">
              This test assesses attention, concentration, and working memory by having a person subtract 7 from 50
              repeatedly.
            </p>
            <p className="text-xs text-gray-400 mt-4">Last updated: {formatTime(lastUpdated)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tremor Analysis */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Tremor Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {tremorHistory.length > 0 ? (
            <TremorChart data={tremorHistory} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No tremor data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Function to render monthly analysis view
  const renderMonthlyView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>6-Month DBRC Score Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <MonthlyTrendChart
            data={monthlyData.cognitive.map((item, index) => ({
              month: item.month,
              score:
                Math.round(
                  (0.3 * item.clockScore + 0.3 * monthlyData.motor[index].score + 0.4 * item.subtractScore) * 10,
                ) / 10,
            }))}
            dataKey="score"
            title="DBRC Score"
            color="#8b5cf6"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6-Month Cognitive Test Scores</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <MonthlyTrendChart
            data={monthlyData.cognitive}
            dataKey="clockScore"
            secondaryDataKey="subtractScore"
            title="Clock Test Score"
            secondaryTitle="Serial Seven Score"
            color="#8b5cf6"
            secondaryColor="#e571db"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6-Month Motor and Tremor Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <MonthlyTrendChart
            data={monthlyData.motor.map((item, index) => ({
              month: item.month,
              score: item.score,
              tremor: monthlyData.tremor[index].avgDuration,
            }))}
            dataKey="score"
            secondaryDataKey="tremor"
            title="Motor Skills Score"
            secondaryTitle="Avg. Tremor Duration (s)"
            color="#8b5cf6"
            secondaryColor="#e571db"
          />
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="mb-6" id="symptom-overview">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Symptom Overview</h2>
        <Select defaultValue="realtime" onValueChange={setView}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Realtime Data</SelectItem>
            <SelectItem value="monthly">Monthly Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === "realtime" ? renderRealtimeView() : renderMonthlyView()}
    </div>
  )
}

