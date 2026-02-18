"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Loader2 } from "lucide-react"
import type { PrivateLabelMetrics } from "@/lib/data/category-performance"

interface PerformanceSummaryProps {
  category: string
  period: string
  metrics: PrivateLabelMetrics
}

export function PerformanceSummary({ category, period, metrics }: PerformanceSummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  // Reset when category or period changes
  useEffect(() => {
    setSummary("")
    setHasGenerated(false)
  }, [category, period])

  const generateSummary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/performance-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, period, metrics }),
      })

      if (!response.ok) throw new Error("Failed to generate summary")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += decoder.decode(value, { stream: true })
          setSummary(result)
        }
      }

      setHasGenerated(true)
    } catch (error) {
      console.error("Error generating summary:", error)
      setSummary("Unable to generate summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-8 border-l-4 border-l-chart-4 bg-gradient-to-r from-chart-4/5 to-transparent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-chart-4/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Performance Summary</h3>
            <p className="text-sm text-muted-foreground">
              {category} • {period}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSummary}
          disabled={isLoading}
          className="shrink-0 bg-transparent"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analysing...
            </>
          ) : hasGenerated ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Summary
            </>
          )}
        </Button>
      </div>

      {!hasGenerated && !isLoading && !summary && (
        <p className="text-sm text-muted-foreground italic">
          Click "Generate Summary" to get AI-powered insights on your {category} private label performance.
        </p>
      )}

      {(summary || isLoading) && (
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="whitespace-pre-wrap leading-relaxed">
            {summary}
            {isLoading && <span className="inline-block w-2 h-4 bg-chart-4 animate-pulse ml-1" />}
          </p>
        </div>
      )}
    </Card>
  )
}
