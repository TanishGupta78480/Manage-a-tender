import { AIChatBot } from "@/components/ai-chat-bot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Users, FileText, BarChart3, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const guideModules = [
  {
    icon: BarChart3,
    title: "Review Private Label Performance",
    description: "Understand how to analyse category data to identify trends and opportunities.",
    sections: [
      "Selecting categories and time periods",
      "Understanding branded vs own brand metrics",
      "Interpreting market share and margin data",
      "Exporting reports",
    ],
    link: "/performance",
  },
  {
    icon: Search,
    title: "Identify Sourcing Opportunities",
    description: "Learn how to spot cost-saving opportunities using the three analysis tools.",
    sections: [
      "Input price change analysis",
      "Editing and saving recipe cards",
      "Spec comparison across retailers",
      "Price vs margin opportunity identification",
    ],
    link: "/opportunities",
  },
  {
    icon: Users,
    title: "Add/Review Suppliers",
    description: "Manage your supplier database and assess supplier suitability for tenders.",
    sections: [
      "Searching and filtering suppliers",
      "Understanding the inclusion score",
      "Adding notes and updating supplier details",
      "Selecting suppliers for tenders",
    ],
    link: "/suppliers",
  },
  {
    icon: FileText,
    title: "Launch Price Discovery",
    description: "Create and send price discovery requests to your chosen suppliers.",
    sections: [
      "Selecting SKUs for tender",
      "Setting terms and deadlines",
      "Choosing suppliers",
      "Generating tender documents",
    ],
    link: "/tender",
  },
  {
    icon: BarChart3,
    title: "Analyse Offers",
    description: "Compare supplier responses and identify the best value offers.",
    sections: [
      "Inputting supplier offers",
      "Understanding the scorecard",
      "Comparing across rounds",
      "Selecting the winning offer",
    ],
    link: "/analyse",
  },
  {
    icon: CheckCircle,
    title: "Finalise Agreements",
    description: "Complete the approval workflow and track signed contracts.",
    sections: [
      "Commercial approval process",
      "Finance sign-off requirements",
      "Uploading signed contracts",
      "Tracking savings",
    ],
    link: "/finalise",
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">User Guide</h1>
          </div>
          <p className="text-muted-foreground">
            Learn how to use each module of the Private Label Sourcing Accelerator effectively.
          </p>
        </div>

        <div className="grid gap-6">
          {guideModules.map((module, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="mt-1">{module.description}</CardDescription>
                    </div>
                  </div>
                  <Link href={module.link} className="flex items-center gap-1 text-sm text-primary hover:underline">
                    Go to module
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {module.sections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {sectionIndex + 1}
                      </span>
                      {section}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-muted/30">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Need more help?</h3>
                <p className="text-sm text-muted-foreground">
                  Use the AI Assistant in the bottom right corner to ask questions at any time, or check out our video
                  training modules.
                </p>
              </div>
              <Link
                href="/training"
                className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Training Videos
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <AIChatBot />
    </div>
  )
}
