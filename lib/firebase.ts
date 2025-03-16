"use client"

import { useEffect, useState, useRef } from "react"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQqXeoXC39yQC1NE9VlmzPvaN58FrAki8",
  authDomain: "esp32demo-955b3.firebaseapp.com",
  databaseURL: "https://esp32demo-955b3-default-rtdb.firebaseio.com",
  projectId: "esp32demo-955b3",
  storageBucket: "esp32demo-955b3.firebasestorage.app",
  messagingSenderId: "894485628740",
  appId: "1:894485628740:web:2a9231e0b351a61dc3f911",
  measurementId: "G-7CMEYSTTT5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Function to extract number before /100 between ** **
function extractScore(text: string): number {
  if (!text) return 0

  // Updated regex to match pattern like **x/100** and extract only x
  const match = text.match(/\*\*(\d+(\.\d+)?)\s*\/\s*100\*\*/)

  if (match && match[1]) {
    console.log("Extracted score:", match[1], "from:", text)
    return Number.parseFloat(match[1])
  }

  // Fallback to the original regex in case the format is different
  const fallbackMatch = text.match(/\*\*(\d+(\.\d+)?)\*\*/)
  if (fallbackMatch && fallbackMatch[1]) {
    console.log("Fallback extraction:", fallbackMatch[1], "from:", text)
    return Number.parseFloat(fallbackMatch[1])
  }

  console.log("No score found in:", text)
  return 0
}

// Hardcoded sample data for when Firebase data isn't available
const sampleData = {
  subtractString: "The patient was able to subtract 7 from 100 and got **85/100** correct in a row.",
  clockString: "The patient drew a clock and scored **75/100** on the assessment.",
  motorScore: 7.2,
  tremorDuration: 2.5,
  humidity: 60.0,
  heatIndex: 75.0,
  temperature: 72.0,
}

export function useFirebaseData() {
  const [data, setData] = useState({
    subtractString: sampleData.subtractString,
    subtractScore: extractScore(sampleData.subtractString),
    clockString: sampleData.clockString,
    clockScore: extractScore(sampleData.clockString),
    motorScore: sampleData.motorScore,
    tremorDuration: sampleData.tremorDuration,
    humidity: sampleData.humidity,
    heatIndex: sampleData.heatIndex,
    temperature: sampleData.temperature,
    lastUpdated: new Date(),
  })

  const [tremorHistory, setTremorHistory] = useState<
    { time: Date; duration: number; humidity: number; heatIndex: number; temperature: number }[]
  >([])

  // Use refs to track the last two tremor duration values
  const lastTremorDurationRef = useRef<number | null>(null)
  const secondLastTremorDurationRef = useRef<number | null>(null)

  useEffect(() => {
    // Reference to the data we want to listen to
    const promptARef = ref(database, "promptA/result")
    const promptBRef = ref(database, "promptB/result")
    const motorScoreRef = ref(database, "scores/motorTest/finalScore")
    const tremorDurationRef = ref(database, "tremor/duration")
    const humidityRef = ref(database, "sensor/humidity")
    const heatIndexRef = ref(database, "sensor/heatIndexF")
    const temperatureRef = ref(database, "sensor/temperatureF")

    // Set up listeners for each data point
    const unsubscribePromptA = onValue(promptARef, (snapshot) => {
      const subtractString = snapshot.val() || sampleData.subtractString
      const subtractScore = extractScore(subtractString)
      console.log("Extracted subtractScore:", subtractScore, "from:", subtractString)
      setData((prev) => ({ ...prev, subtractString, subtractScore }))
    })

    const unsubscribePromptB = onValue(promptBRef, (snapshot) => {
      const clockString = snapshot.val() || sampleData.clockString
      const clockScore = extractScore(clockString)
      console.log("Extracted clockScore:", clockScore, "from:", clockString)
      setData((prev) => ({ ...prev, clockString, clockScore }))
    })

    const unsubscribeMotorScore = onValue(motorScoreRef, (snapshot) => {
      const motorScore = snapshot.val() || sampleData.motorScore
      setData((prev) => ({ ...prev, motorScore }))
    })

    const unsubscribeTremorDuration = onValue(tremorDurationRef, (snapshot) => {
      const tremorDuration = snapshot.val() || sampleData.tremorDuration
      setData((prev) => ({ ...prev, tremorDuration }))

      // Only add to history if the tremor duration is different from the last recorded value
      if (tremorDuration !== lastTremorDurationRef.current) {
        // Update the tremor duration history
        secondLastTremorDurationRef.current = lastTremorDurationRef.current
        lastTremorDurationRef.current = tremorDuration

        // Update tremor history
        const now = new Date()
        setTremorHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              time: now,
              duration: tremorDuration,
              humidity: data.humidity,
              heatIndex: data.heatIndex,
              temperature: data.temperature,
            },
          ]

          // Filter to only keep data from the last 2 minutes
          const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000)
          return newHistory.filter((item) => item.time >= twoMinutesAgo)
        })
      }
    })

    const unsubscribeHumidity = onValue(humidityRef, (snapshot) => {
      const humidity = snapshot.val() || sampleData.humidity
      setData((prev) => ({ ...prev, humidity }))
    })

    const unsubscribeHeatIndex = onValue(heatIndexRef, (snapshot) => {
      const heatIndex = snapshot.val() || sampleData.heatIndex
      setData((prev) => ({ ...prev, heatIndex }))
    })

    const unsubscribeTemperature = onValue(temperatureRef, (snapshot) => {
      const temperature = snapshot.val() || sampleData.temperature
      setData((prev) => ({ ...prev, temperature, lastUpdated: new Date() }))
    })

    // Clean up listeners on unmount
    return () => {
      unsubscribePromptA()
      unsubscribePromptB()
      unsubscribeMotorScore()
      unsubscribeTremorDuration()
      unsubscribeHumidity()
      unsubscribeHeatIndex()
      unsubscribeTemperature()
    }
  }, [data.humidity, data.heatIndex, data.temperature])

  // Calculate DBRC score
  const dbrcScore = Math.round((0.3 * data.clockScore + 0.3 * data.motorScore + 0.4 * data.subtractScore) * 10) / 10

  return {
    ...data,
    dbrcScore,
    tremorHistory,
    formatTime: (date: Date) => {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    },
  }
}

