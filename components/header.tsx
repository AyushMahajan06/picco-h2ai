"use client"
import { Button } from "@/components/ui/button"

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="gradient-header text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold">Michael's Health Tracker</h1>
      <nav className="flex flex-wrap justify-center md:justify-end space-x-4 mt-2 md:mt-0">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 font-semibold"
          onClick={() => scrollToSection("symptom-overview")}
        >
          Overview
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 font-semibold"
          onClick={() => scrollToSection("ai-summary")}
        >
          AI Summary
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 font-semibold"
          onClick={() => scrollToSection("daily-logs")}
        >
          Daily Logs
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 font-semibold"
          onClick={() => scrollToSection("communication-hub")}
        >
          Messages
        </Button>
        <Button
          className="bg-white text-purple-600 hover:bg-gray-100 rounded-full font-semibold"
          onClick={() => scrollToSection("communication-hub")}
        >
          View Reports
        </Button>
      </nav>
    </header>
  )
}

