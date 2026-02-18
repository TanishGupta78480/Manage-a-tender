"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Search, Users, Send, FileSearch, FileCheck, ArrowRight } from "lucide-react"

export function ModuleGrid() {
  const modules = [
    {
      id: 1,
      title: "Review Private Label Performance",
      description: "Analyse sales, margins, and trends across all bakery SKUs to identify areas for improvement.",
      icon: BarChart3,
      color: "bg-chart-1",
      href: "/performance",
      quickAction: "View Dashboard",
    },
    {
      id: 2,
      title: "Identify Sourcing Opportunities",
      description:
        "Discover cost-saving opportunities through input price analysis, spec review, and margin optimisation.",
      icon: Search,
      color: "bg-chart-2",
      href: "/opportunities",
      quickAction: "Find Opportunities",
    },
    {
      id: 3,
      title: "Add / Review Suppliers",
      description: "Manage your supplier database. Add new suppliers, review capabilities, and track certifications.",
      icon: Users,
      color: "bg-chart-3",
      href: "/suppliers",
      quickAction: "Manage Suppliers",
    },
    {
      id: 4,
      title: "Launch Price Discovery / Tender",
      description: "Create and send tender requests to selected suppliers for specific SKUs or product groups.",
      icon: Send,
      color: "bg-chart-4",
      href: "/tender",
      quickAction: "Start Tender",
    },
    {
      id: 5,
      title: "Compare Offers",
      description: "Compare supplier responses, evaluate pricing, and assess total cost of ownership for each offer.",
      icon: FileSearch,
      color: "bg-chart-5",
      href: "/analyse",
      quickAction: "Review Offers",
    },
    {
      id: 6,
      title: "Finalise Agreement",
      description: "Lock in contracts with selected suppliers. Manage terms, volumes, and delivery schedules.",
      icon: FileCheck,
      color: "bg-chart-1",
      href: "/finalise",
      quickAction: "View Contracts",
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-medium text-foreground mb-4">Sourcing Modules</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Link key={module.id} href={module.href}>
            <Card className="group p-5 bg-card border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl ${module.color} flex items-center justify-center`}>
                  <module.icon className="h-5 w-5 text-card" />
                </div>
              </div>

              <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{module.description}</p>

              <div className="flex items-center justify-end pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 -mr-2">
                  {module.quickAction}
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
