"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Send, Paperclip } from "lucide-react"
import { getDatabase, ref, onValue, push, set } from "firebase/database"

interface Report {
  title: string
  date: string
}

interface Message {
  sender: string
  time: string
  content: string
  timestamp: number
}

// Sample hardcoded reports
const sampleReports = {
  october: [
    {
      title: "Weekly Progress Report",
      date: "October 12, 2023",
    },
    {
      title: "Medication Adjustment Report",
      date: "October 5, 2023",
    },
  ],
  september: [
    {
      title: "Monthly Assessment",
      date: "September 28, 2023",
    },
    {
      title: "Neurologist Consultation Summary",
      date: "September 15, 2023",
    },
  ],
  august: [
    {
      title: "Cognitive Function Evaluation",
      date: "August 30, 2023",
    },
  ],
}

// Sample hardcoded messages
const sampleMessages: Message[] = [
  {
    sender: "Michael Johnson",
    time: "05:45 AM",
    content:
      "Hello Dr. Smith, this is Michael. I wanted to let you know that I've been experiencing increased tremors in my right hand this week, especially in the mornings. Should I be concerned?",
    timestamp: Date.now() - 3600000,
  },
  {
    sender: "Doctor",
    time: "06:00 AM",
    content:
      "Hi Michael, thank you for reaching out. Morning tremors are common with Parkinson's. Have you noticed any changes in your sleep pattern or medication timing? Also, have you been doing the hand exercises we discussed?",
    timestamp: Date.now() - 3000000,
  },
  {
    sender: "Michael Johnson",
    time: "06:15 AM",
    content:
      "I've been sleeping a bit less due to some back discomfort. And yes, I've been doing the hand exercises daily, but maybe not as consistently in the morning. I'll make sure to do them right after taking my medication.",
    timestamp: Date.now() - 2400000,
  },
]

export function CommunicationHub() {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("october")
  const [reports, setReports] = useState<{ [key: string]: Report[] }>(sampleReports)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const database = getDatabase()
    const reportsRef = ref(database, "reports")
    const messagesRef = ref(database, "messages")

    // Fetch reports
    const unsubscribeReports = onValue(reportsRef, (snapshot) => {
      try {
        const data = snapshot.val()
        if (data) {
          const formattedReports: { [key: string]: Report[] } = {}

          // Group reports by month
          Object.entries(data).forEach(([key, value]: [string, any]) => {
            const month = value.date.split(" ")[0].toLowerCase()
            if (!formattedReports[month]) {
              formattedReports[month] = []
            }
            formattedReports[month].push({
              title: value.title,
              date: value.date,
            })
          })

          setReports(formattedReports)
        } else {
          // Use sample data if no Firebase data is available
          setReports(sampleReports)
        }
      } catch (err) {
        console.error("Error fetching reports:", err)
        // Use sample data on error
        setReports(sampleReports)
      }
    })

    // Fetch messages
    const unsubscribeMessages = onValue(
      messagesRef,
      (snapshot) => {
        setLoading(true)
        try {
          const data = snapshot.val()
          if (data) {
            const messageList: Message[] = Object.values(data)
              .map((msg: any) => ({
                sender: msg.sender,
                time: msg.time,
                content: msg.content,
                timestamp: msg.timestamp || 0,
              }))
              .sort((a, b) => a.timestamp - b.timestamp)

            setMessages(messageList)
          } else {
            // Use sample data if no Firebase data is available
            setMessages(sampleMessages)
          }
          setError("")
        } catch (err: any) {
          console.error("Error fetching messages:", err)
          // Use sample data on error
          setMessages(sampleMessages)
          setError("")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error("Firebase error:", err)
        // Use sample data on connection error
        setMessages(sampleMessages)
        setError("")
        setLoading(false)
      },
    )

    return () => {
      unsubscribeReports()
      unsubscribeMessages()
    }
  }, [])

  const sendMessage = () => {
    if (!message.trim()) return

    const database = getDatabase()
    const messagesRef = ref(database, "messages")
    const newMessageRef = push(messagesRef)

    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const newMessage = {
      sender: "Doctor",
      time,
      content: message,
      timestamp: Date.now(),
    }

    // Add message to local state immediately for better UX
    setMessages([...messages, newMessage])
    setMessage("")

    // Then try to save to Firebase
    set(newMessageRef, newMessage).catch((err) => {
      console.error("Error sending message:", err)
    })
  }

  return (
    <div id="communication-hub">
      <h2 className="text-2xl font-bold mb-4">Communication Hub</h2>

      <Card className="mb-6">
        <CardHeader className="gradient-header text-white">
          <CardTitle>Weekly Reports</CardTitle>
          <p className="text-sm font-normal">Health reports for Michael Johnson</p>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="october" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="october" className="rounded-full">
                October 2023
              </TabsTrigger>
              <TabsTrigger value="september" className="rounded-full">
                September 2023
              </TabsTrigger>
              <TabsTrigger value="august" className="rounded-full">
                August 2023
              </TabsTrigger>
            </TabsList>

            <TabsContent value="october" className="space-y-4">
              {reports.october?.map((report, index) => (
                <div key={index} className="flex items-start p-3 border-b last:border-0">
                  <div className="text-purple-600 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-text"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.date}</p>
                  </div>
                </div>
              ))}
              {!reports.october && (
                <div className="p-4 text-center text-gray-500">No reports available for October 2023</div>
              )}
            </TabsContent>

            <TabsContent value="september">
              {reports.september?.map((report, index) => (
                <div key={index} className="flex items-start p-3 border-b last:border-0">
                  <div className="text-purple-600 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-text"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.date}</p>
                  </div>
                </div>
              ))}
              {!reports.september && (
                <div className="p-4 text-center text-gray-500">No reports available for September 2023</div>
              )}
            </TabsContent>

            <TabsContent value="august">
              {reports.august?.map((report, index) => (
                <div key={index} className="flex items-start p-3 border-b last:border-0">
                  <div className="text-purple-600 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-text"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.date}</p>
                  </div>
                </div>
              ))}
              {!reports.august && (
                <div className="p-4 text-center text-gray-500">No reports available for August 2023</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gradient-header text-white">
          <CardTitle className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white mr-3 flex items-center justify-center">
              <img src="/placeholder.svg?height=40&width=40" alt="Michael Johnson" className="rounded-full" />
            </div>
            Message Michael Johnson
          </CardTitle>
          <p className="text-sm font-normal">Direct patient communication</p>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : (
            <>
              <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.sender === "Doctor" ? "bg-purple-100 ml-12" : "bg-gray-100 mr-12"
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <span
                          className={`font-medium ${msg.sender === "Doctor" ? "text-purple-700" : "text-gray-700"}`}
                        >
                          {msg.sender}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-700">{msg.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No messages yet</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button className="rounded-full bg-pink-500 hover:bg-pink-600" size="icon" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

