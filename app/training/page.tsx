"use client"

import { useState } from "react"
import { AIChatBot } from "@/components/ai-chat-bot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, CheckCircle2, Lock, Play } from "lucide-react"

const trainingModules = [
  {
    id: 1,
    title: "Private Label Sourcing Accelerator Overview",
    description: "An introduction to the platform and its key features for private label sourcing.",
    duration: "10 min",
    status: "completed" as const,
    thumbnail: "/training-video-dashboard-overview.jpg",
  },
  {
    id: 2,
    title: "Tendering with Purpose",
    description: "Learn how to approach tenders strategically to maximise value and efficiency.",
    duration: "12 min",
    status: "completed" as const,
    thumbnail: "/training-video-data-analytics-charts.jpg",
  },
  {
    id: 3,
    title: "Using Each Module",
    description: "A walkthrough of each module in the platform and how they work together.",
    duration: "15 min",
    status: "completed" as const,
    thumbnail: "/training-video-sourcing-opportunity-analysis.jpg",
  },
  {
    id: 4,
    title: "Commodity Price Negotiation Arguments",
    description: "Build compelling arguments using commodity price data to negotiate better deals.",
    duration: "14 min",
    status: "in-progress" as const,
    thumbnail: "/training-video-supplier-management-database.jpg",
  },
  {
    id: 5,
    title: "Tips for Tendering",
    description: "Practical tips and techniques to run more effective tender processes.",
    duration: "11 min",
    status: "available" as const,
    thumbnail: "/training-video-tender-document-creation.jpg",
  },
  {
    id: 6,
    title: "Unpacking and Scorecarding Offers",
    description: "How to analyse supplier offers and use the scorecard to compare them fairly.",
    duration: "13 min",
    status: "available" as const,
    thumbnail: "/training-video-offer-comparison-scorecard.jpg",
  },
  {
    id: 7,
    title: "Responding to a Deal",
    description: "Best practices for responding to supplier proposals and counter-offers.",
    duration: "9 min",
    status: "available" as const,
    thumbnail: "/training-video-contract-approval-workflow.jpg",
  },
  {
    id: 8,
    title: "Closing a Deal",
    description: "Navigate the final stages of negotiation and lock in agreements.",
    duration: "10 min",
    status: "locked" as const,
    thumbnail: "/training-video-advanced-tips-productivity.jpg",
  },
  {
    id: 9,
    title: "Best Practices",
    description: "Key best practices for private label sourcing and supplier management.",
    duration: "12 min",
    status: "locked" as const,
    thumbnail: "/training-video-dashboard-overview.jpg",
  },
  {
    id: 10,
    title: "Advanced Sourcing Techniques",
    description: "Power user techniques for experienced buyers to optimise their sourcing.",
    duration: "16 min",
    status: "locked" as const,
    thumbnail: "/training-video-data-analytics-charts.jpg",
  },
  {
    id: 11,
    title: "Tender Example Series - Bakery",
    description: "A complete walkthrough of a real bakery category tender from start to finish.",
    duration: "20 min",
    status: "locked" as const,
    thumbnail: "/training-video-sourcing-opportunity-analysis.jpg",
  },
  {
    id: 12,
    title: "Tender Example Series - Soap",
    description: "A complete walkthrough of a real soap category tender from start to finish.",
    duration: "18 min",
    status: "locked" as const,
    thumbnail: "/training-video-supplier-management-database.jpg",
  },
]

export default function TrainingPage() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof trainingModules)[0] | null>(null)

  const completedCount = trainingModules.filter((m) => m.status === "completed").length
  const totalDuration = trainingModules.reduce((acc, m) => acc + Number.parseInt(m.duration), 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>
      case "available":
        return <Badge variant="secondary">Available</Badge>
      case "locked":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Locked
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Play className="h-5 w-5 text-primary" />
      case "available":
        return <PlayCircle className="h-5 w-5 text-muted-foreground" />
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground/50" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PlayCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Video Training</h1>
          </div>
          <p className="text-muted-foreground">
            Complete these training modules to master the Private Label Sourcing Accelerator.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Progress</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">{completedCount}</span>
                  <span className="text-muted-foreground">/ {trainingModules.length} modules</span>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Duration</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold text-foreground">{totalDuration} minutes</span>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Completion</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(completedCount / trainingModules.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Player Modal */}
        {selectedVideo && (
          <Card className="mb-8 overflow-hidden">
            <div className="aspect-video bg-black relative">
              <img
                src={selectedVideo.thumbnail || "/placeholder.svg"}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Play Video
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setSelectedVideo(null)}
              >
                Close
              </Button>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedVideo.title}</CardTitle>
                  <CardDescription className="mt-1">{selectedVideo.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selectedVideo.duration}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trainingModules.map((module) => (
            <Card
              key={module.id}
              className={`overflow-hidden transition-all ${
                module.status === "locked" ? "opacity-60" : "hover:shadow-md cursor-pointer"
              }`}
              onClick={() => module.status !== "locked" && setSelectedVideo(module)}
            >
              <div className="aspect-video relative bg-muted">
                <img
                  src={module.thumbnail || "/placeholder.svg"}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  {module.status !== "locked" && (
                    <div className="p-3 bg-white/90 rounded-full">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2">{getStatusBadge(module.status)}</div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {module.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {getStatusIcon(module.status)}
                  <div>
                    <h3 className="font-medium text-foreground text-sm leading-tight">{module.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{module.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <AIChatBot />
    </div>
  )
}
