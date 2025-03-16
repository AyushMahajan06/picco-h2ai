"use client"
import { Scatter, ScatterChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"

interface TremorDataPoint {
  time: Date
  duration: number
  humidity: number
  heatIndex: number
  temperature: number
}

interface TremorChartProps {
  data: TremorDataPoint[]
}

export function TremorChart({ data }: TremorChartProps) {
  const chartData = data.map((point) => ({
    time: point.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    duration: point.duration,
    humidity: point.humidity,
    heatIndex: point.heatIndex,
    temperature: point.temperature,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.split(":")[0] + ":" + value.split(":")[1]}
          name="Time"
        />
        <YAxis
          label={{
            value: "Duration (s)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
          tick={{ fontSize: 12 }}
          name="Duration"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-3 bg-white shadow-lg border border-gray-200">
                  <p className="font-semibold">{`Time: ${payload[0].payload.time}`}</p>
                  <p className="text-purple-600">{`Tremor Duration: ${payload[0].value}s`}</p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p>{`Temperature: ${payload[0].payload.temperature}°F`}</p>
                    <p>{`Humidity: ${payload[0].payload.humidity}%`}</p>
                    <p>{`Heat Index: ${payload[0].payload.heatIndex}°F`}</p>
                  </div>
                </Card>
              )
            }
            return null
          }}
        />
        <Scatter
          name="Tremor Duration"
          data={chartData}
          fill="#8b5cf6"
          dataKey="duration"
          shape="circle"
          line={false}
          fillOpacity={0.8}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

