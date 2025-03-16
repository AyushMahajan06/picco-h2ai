"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card } from "@/components/ui/card"

interface MonthlyTrendChartProps {
  data: any[]
  dataKey: string
  secondaryDataKey?: string
  title: string
  secondaryTitle?: string
  color: string
  secondaryColor?: string
}

export function MonthlyTrendChart({
  data,
  dataKey,
  secondaryDataKey,
  title,
  secondaryTitle,
  color,
  secondaryColor,
}: MonthlyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-3 bg-white shadow-lg border border-gray-200">
                  <p className="font-semibold">{`${label}`}</p>
                  <p style={{ color }}>{`${title}: ${payload[0].value}`}</p>
                  {secondaryDataKey && secondaryTitle && (
                    <p style={{ color: secondaryColor }}>{`${secondaryTitle}: ${payload[1].value}`}</p>
                  )}
                </Card>
              )
            }
            return null
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          name={title}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        {secondaryDataKey && secondaryColor && secondaryTitle && (
          <Line
            type="monotone"
            dataKey={secondaryDataKey}
            stroke={secondaryColor}
            name={secondaryTitle}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

