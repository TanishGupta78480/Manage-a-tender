import { ModuleGrid } from "@/components/module-grid"
import { AiChatBot } from "@/components/ai-chat-bot"
import { MyPortfolio } from "@/components/my-portfolio"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight text-balance">Private Label Sourcing</h1>
          <p className="text-muted-foreground mt-1">Manage sourcing, tenders, and contracts</p>
        </div>

        <MyPortfolio />
        <ModuleGrid />
      </main>
      <AiChatBot />
    </div>
  )
}
