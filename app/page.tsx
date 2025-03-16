import { Header } from "@/components/header"
import { PatientDescription } from "@/components/patient-description"
import { SymptomOverview } from "@/components/symptom-overview"
import { AISummary } from "@/components/ai-summary"
import { DailyLogs } from "@/components/daily-logs"
import { CommunicationHub } from "@/components/communication-hub"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <PatientDescription />
        <SymptomOverview />
        <AISummary />
        <DailyLogs />
        <CommunicationHub />
      </main>
      <footer className="gradient-footer text-white p-4 text-center">
        <p>Created by Team DBRC for Georgetown H2AI Hack</p>
      </footer>
    </div>
  )
}

