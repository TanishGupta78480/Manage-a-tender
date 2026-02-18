"use client"

import { useState, useMemo } from "react"
import { AIChatBot } from "@/components/ai-chat-bot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  TrendingUp,
  PoundSterling,
  FileCheck,
  Rocket,
  Users,
  Package,
  Calendar,
  CheckCircle,
  LayoutGrid,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { tenders, suppliers, skus, subCategories, availableCategories } from "@/lib/data"

type TimePeriod = "30d" | "90d" | "6m" | "ytd" | "1y" | "all"
type ViewMode = "category" | "programme"

const timePeriods: { value: TimePeriod; label: string }[] = [
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "6m", label: "Last 6 Months" },
  { value: "ytd", label: "Year to Date" },
  { value: "1y", label: "Last 12 Months" },
  { value: "all", label: "All Time" },
]

function getDateFromPeriod(period: TimePeriod): Date {
  const now = new Date()
  switch (period) {
    case "30d":
      return new Date(now.setDate(now.getDate() - 30))
    case "90d":
      return new Date(now.setDate(now.getDate() - 90))
    case "6m":
      return new Date(now.setMonth(now.getMonth() - 6))
    case "ytd":
      return new Date(now.getFullYear(), 0, 1)
    case "1y":
      return new Date(now.setFullYear(now.getFullYear() - 1))
    case "all":
      return new Date(2000, 0, 1)
    default:
      return new Date(2000, 0, 1)
  }
}

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("category")
  const [selectedCategory, setSelectedCategory] = useState<string>("Bakery")
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(subCategories.map((c) => c.id))
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("ytd")
  const [selectAll, setSelectAll] = useState(true)

  const filterDate = useMemo(() => getDateFromPeriod(timePeriod), [timePeriod])

  // Calculate metrics based on view mode and selections
  const metrics = useMemo(() => {
    const selectedCategoryNames =
      viewMode === "programme"
        ? subCategories.map((c) => c.name)
        : subCategories.filter((c) => selectedSubCategories.includes(c.id)).map((c) => c.name)

    const relevantSkuIds = skus.filter((sku) => selectedCategoryNames.includes(sku.subcategory)).map((sku) => sku.id)

    // Filter tenders by date and relevant SKUs
    const filteredTenders = tenders.filter((t) => {
      const tenderDate = new Date(t.createdDate)
      const hasRelevantSku = t.skuIds.some((id) => relevantSkuIds.includes(id))
      return tenderDate >= filterDate && hasRelevantSku
    })

    const completedTenders = filteredTenders.filter((t) => t.status === "completed")
    const openTenders = filteredTenders.filter((t) => t.status === "open")
    const pendingTenders = filteredTenders.filter((t) => t.status === "pending_sign_off")
    const priceDiscoveries = filteredTenders.filter((t) => t.type === "price_discovery")
    const fullTenders = filteredTenders.filter((t) => t.type === "full_tender")

    const totalSavings = completedTenders.reduce((sum, t) => sum + (t.actualSavings || 0), 0)
    const totalValue = completedTenders.reduce((sum, t) => sum + t.estimatedValue, 0)

    // Count suppliers added in period (using current supplier status as proxy for demo)
    const activeSuppliers = suppliers.filter((s) => s.status === "active").length
    const potentialSuppliers = suppliers.filter((s) => s.status === "potential").length

    // Average savings per tender
    const avgSavings = completedTenders.length > 0 ? totalSavings / completedTenders.length : 0

    // Savings rate
    const savingsRate = totalValue > 0 ? (totalSavings / totalValue) * 100 : 0

    return {
      totalSavings,
      totalValue,
      tendersLaunched: filteredTenders.length,
      tendersClosed: completedTenders.length,
      tendersOpen: openTenders.length,
      tendersPending: pendingTenders.length,
      priceDiscoveriesLaunched: priceDiscoveries.length,
      fullTendersLaunched: fullTenders.length,
      activeSuppliers,
      potentialSuppliers,
      skusInScope: relevantSkuIds.length,
      avgSavings,
      savingsRate,
      categoriesSelected: viewMode === "programme" ? subCategories.length : selectedSubCategories.length,
    }
  }, [viewMode, selectedSubCategories, filterDate])

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedSubCategories(subCategories.map((c) => c.id))
    } else {
      setSelectedSubCategories([])
    }
  }

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      const newSelection = [...selectedSubCategories, categoryId]
      setSelectedSubCategories(newSelection)
      setSelectAll(newSelection.length === subCategories.length)
    } else {
      const newSelection = selectedSubCategories.filter((id) => id !== categoryId)
      setSelectedSubCategories(newSelection)
      setSelectAll(false)
    }
  }

  const handleExportCSV = () => {
    const selectedCategoryNames =
      viewMode === "programme"
        ? subCategories.map((c) => c.name)
        : subCategories.filter((c) => selectedSubCategories.includes(c.id)).map((c) => c.name)

    const csvData = [
      ["Private Label Sourcing Accelerator - Report"],
      ["Generated:", new Date().toLocaleDateString()],
      ["View Mode:", viewMode === "programme" ? "Programme (All Categories)" : "Category View"],
      ["Time Period:", timePeriods.find((p) => p.value === timePeriod)?.label || ""],
      ["Categories:", selectedCategoryNames.join(", ")],
      [""],
      ["Key Metrics"],
      ["Metric", "Value"],
      ["Total Savings", `£${metrics.totalSavings.toLocaleString()}`],
      ["Total Contract Value", `£${metrics.totalValue.toLocaleString()}`],
      ["Savings Rate", `${metrics.savingsRate.toFixed(1)}%`],
      ["Average Savings per Tender", `£${metrics.avgSavings.toLocaleString()}`],
      [""],
      ["Tender Activity"],
      ["Tenders Launched", metrics.tendersLaunched],
      ["Tenders Closed", metrics.tendersClosed],
      ["Tenders Open", metrics.tendersOpen],
      ["Tenders Pending Sign-off", metrics.tendersPending],
      ["Price Discoveries Launched", metrics.priceDiscoveriesLaunched],
      ["Full Tenders Launched", metrics.fullTendersLaunched],
      [""],
      ["Supplier & SKU Overview"],
      ["Active Suppliers", metrics.activeSuppliers],
      ["Potential Suppliers", metrics.potentialSuppliers],
      ["SKUs in Scope", metrics.skusInScope],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `sourcing_report_${viewMode}_${timePeriod}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const handleExportPDF = () => {
    // In a real app, this would generate a PDF
    alert("PDF export would be generated here with the same metrics. For demo purposes, please use CSV export.")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-header-gradient px-4 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-xl font-semibold text-white">Reports</h1>
              <p className="text-sm text-white/70">Generate and export sourcing performance reports</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6">

        <div className="mb-6">
          <div className="inline-flex items-center rounded-lg border bg-muted p-1">
            <Button
              variant={viewMode === "programme" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${viewMode === "programme" ? "" : "hover:bg-transparent"}`}
              onClick={() => setViewMode("programme")}
            >
              <Layers className="h-4 w-4" />
              Programme View
            </Button>
            <Button
              variant={viewMode === "category" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${viewMode === "category" ? "" : "hover:bg-transparent"}`}
              onClick={() => setViewMode("category")}
            >
              <LayoutGrid className="h-4 w-4" />
              Category View
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {viewMode === "category"
              ? "Viewing metrics for a single category with sub-category filtering"
              : "Viewing metrics across all categories simultaneously"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Time Period Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Time Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timePeriods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {viewMode === "category" ? (
              <>
                {/* Category Selection for Category View */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Sub-Category Selection */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Sub-Categories
                    </CardTitle>
                    <CardDescription>Select sub-categories to include</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 pb-2 border-b">
                      <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                        Select All
                      </label>
                      <Badge variant="secondary" className="ml-auto">
                        {selectedSubCategories.length}/{subCategories.length}
                      </Badge>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {subCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={selectedSubCategories.includes(category.id)}
                            onCheckedChange={(checked) => handleCategoryToggle(category.id, checked as boolean)}
                          />
                          <label htmlFor={category.id} className="text-sm cursor-pointer">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Programme View - Shows all categories info */
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Programme Scope
                  </CardTitle>
                  <CardDescription>All categories included</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Categories</span>
                      <Badge variant="secondary">{availableCategories.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sub-categories</span>
                      <Badge variant="secondary">{subCategories.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total SKUs</span>
                      <Badge variant="secondary">{skus.length}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Programme view aggregates data across all categories for a holistic view of sourcing performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  Export Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start gap-2" onClick={handleExportCSV}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as CSV
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                  onClick={handleExportPDF}
                >
                  <FileCheck className="h-4 w-4" />
                  Export as PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Display */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary Banner */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <Badge variant="outline" className="text-xs">
                        {viewMode === "programme" ? "All Categories" : selectedCategory}
                      </Badge>
                    </div>
                    <p className="text-4xl font-bold text-primary">£{metrics.totalSavings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      from {metrics.tendersClosed} completed tender{metrics.tendersClosed !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-semibold text-green-600">{metrics.savingsRate.toFixed(1)}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">savings rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <PoundSterling className="h-4 w-4" />
                    <span className="text-xs">Contract Value</span>
                  </div>
                  <p className="text-2xl font-bold">£{(metrics.totalValue / 1000).toFixed(0)}k</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Avg Savings/Tender</span>
                  </div>
                  <p className="text-2xl font-bold">£{metrics.avgSavings.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Active Suppliers</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.activeSuppliers}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-4 w-4" />
                    <span className="text-xs">SKUs in Scope</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.skusInScope}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tender Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tender Activity</CardTitle>
                <CardDescription>Breakdown of tender status and types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">By Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <span className="font-semibold">{metrics.tendersClosed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm">Open</span>
                        </div>
                        <span className="font-semibold">{metrics.tendersOpen}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-sm">Pending Sign-off</span>
                        </div>
                        <span className="font-semibold">{metrics.tendersPending}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">By Type</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-primary" />
                          <span className="text-sm">Price Discoveries</span>
                        </div>
                        <span className="font-semibold">{metrics.priceDiscoveriesLaunched}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-primary" />
                          <span className="text-sm">Full Tenders</span>
                        </div>
                        <span className="font-semibold">{metrics.fullTendersLaunched}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">Total Launched</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{metrics.tendersLaunched}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        tenders in
                        <br />
                        selected period
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supplier Overview</CardTitle>
                <CardDescription>Current supplier base for selected categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metrics.activeSuppliers}</p>
                      <p className="text-sm text-muted-foreground">Active Suppliers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metrics.potentialSuppliers}</p>
                      <p className="text-sm text-muted-foreground">Potential Suppliers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AIChatBot />
    </div>
  )
}
