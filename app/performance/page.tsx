"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  PoundSterling,
  ShoppingCart,
  Tag,
  CheckCircle,
  LayoutGrid,
  Trash2,
  Banknote,
} from "lucide-react"
import { availableCategories, availableTimePeriods } from "@/lib/data"
import { getPrivateLabelMetrics } from "@/lib/data/category-performance"
import { PerformanceSummary } from "@/components/performance-summary"

export default function PerformancePage() {
  const [selectedCategory, setSelectedCategory] = useState("Bakery")
  const [selectedPeriod, setSelectedPeriod] = useState("Last 4 Weeks")

  const metrics = getPrivateLabelMetrics(selectedCategory, selectedPeriod)

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}m`
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`
    return `£${value.toFixed(2)}`
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
    return value.toFixed(0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="page-header-gradient sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Review Private Label Performance</h1>
                <p className="text-sm text-white/70">Analyse sales, margins and trends</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Category:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
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
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Time Period:</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTimePeriods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {metrics && (
          <>
            {/* AI Summary */}
            <PerformanceSummary category={selectedCategory} period={selectedPeriod} metrics={metrics} />

            {/* Main Metrics - Top Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Market Share */}
              <Card className="p-6 border-l-4 border-l-primary">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Market Share</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Value Share</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.marketShare.value.toFixed(1)}%</p>
                    <YoYIndicator value={metrics.marketShare.valueYoY} suffix="pts" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Volume Share</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.marketShare.volume.toFixed(1)}%</p>
                    <YoYIndicator value={metrics.marketShare.volumeYoY} suffix="pts" />
                  </div>
                </div>
              </Card>

              {/* Sales */}
              <Card className="p-6 border-l-4 border-l-chart-2">
                <div className="flex items-center gap-2 mb-4">
                  <PoundSterling className="h-5 w-5 text-chart-2" />
                  <h3 className="font-semibold text-foreground">Sales</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Turnover</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.sales.turnover)}</p>
                    <YoYIndicator value={metrics.sales.turnoverYoY} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Volume</p>
                    <p className="text-2xl font-bold text-foreground">{formatNumber(metrics.sales.volume)}</p>
                    <YoYIndicator value={metrics.sales.volumeYoY} />
                  </div>
                </div>
              </Card>

              {/* Trading Margin */}
              <Card className="p-6 border-l-4 border-l-chart-3">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-chart-3" />
                  <h3 className="font-semibold text-foreground">Trading Margin</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Margin £</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.tradingMargin.pounds)}</p>
                    <YoYIndicator value={metrics.tradingMargin.poundsYoY} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Margin %</p>
                    <p className="text-2xl font-bold text-foreground">{metrics.tradingMargin.percent.toFixed(1)}%</p>
                    <YoYIndicator value={metrics.tradingMargin.percentYoY} suffix="pts" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Input Metrics Section */}
            <h2 className="text-lg font-semibold text-foreground mb-4">Input Metrics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Customer */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Customer</h3>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-right">Period</span>
                    <span className="w-14 text-center">YoY</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow
                    label="Baskets"
                    value={`${metrics.customer.baskets.toLocaleString()}k`}
                    yoy={metrics.customer.basketsYoY}
                  />
                  <MetricRow
                    label="Basket Size"
                    value={`£${metrics.customer.basketSize.toFixed(2)}`}
                    yoy={metrics.customer.basketSizeYoY}
                  />
                  <MetricRow
                    label="Frequency"
                    value={`${metrics.customer.frequency.toFixed(1)}/mo`}
                    yoy={metrics.customer.frequencyYoY}
                  />
                </div>
              </Card>

              {/* Price */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Price</h3>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-right">Period</span>
                    <span className="w-14 text-center">YoY</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow
                    label="Base Price"
                    value={`£${metrics.price.basePrice.toFixed(2)}`}
                    yoy={metrics.price.basePriceYoY}
                  />
                  <MetricRow
                    label="Average Price"
                    value={`£${metrics.price.averagePrice.toFixed(2)}`}
                    yoy={metrics.price.averagePriceYoY}
                  />
                  <MetricRow
                    label="Promo Volume"
                    value={`${metrics.price.promoVolume.toFixed(1)}%`}
                    yoy={metrics.price.promoVolumeYoY}
                    invertColor
                  />
                </div>
              </Card>

              {/* Quality */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Quality</h3>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-right">Period</span>
                    <span className="w-14 text-center">YoY</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow
                    label="Inbound Availability"
                    value={`${metrics.quality.inboundAvailability.toFixed(1)}%`}
                    yoy={metrics.quality.inboundAvailabilityYoY}
                  />
                  <MetricRow
                    label="EOD Availability"
                    value={`${metrics.quality.eodAvailability.toFixed(1)}%`}
                    yoy={metrics.quality.eodAvailabilityYoY}
                  />
                  <MetricRow
                    label="CPMUs"
                    value={metrics.quality.cpmus.toFixed(2)}
                    yoy={metrics.quality.cpmusYoY}
                    invertColor
                  />
                </div>
              </Card>

              {/* Range */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <LayoutGrid className="h-4 w-4 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Range</h3>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-right">Period</span>
                    <span className="w-14 text-center">YoY</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow
                    label="SKU Count"
                    value={metrics.range.skuCount.toString()}
                    yoy={metrics.range.skuCountYoY}
                  />
                  <MetricRow
                    label="Stocking Points"
                    value={metrics.range.stockingPoints.toString()}
                    yoy={metrics.range.stockingPointsYoY}
                  />
                </div>
              </Card>

              {/* Wastage */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Wastage</h3>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-right">Period</span>
                    <span className="w-14 text-center">YoY</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow
                    label="Waste & Markdown %"
                    value={`${metrics.wastage.wasteMarkdownPercent.toFixed(1)}%`}
                    yoy={metrics.wastage.wasteMarkdownPercentYoY}
                    invertColor
                  />
                  <MetricRow
                    label="Yield %"
                    value={`${metrics.wastage.yieldPercent.toFixed(1)}%`}
                    yoy={metrics.wastage.yieldPercentYoY}
                  />
                </div>
              </Card>

              {/* Cash */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Banknote className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Cash</h3>
                </div>
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <span></span>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-right">Period</span>
                    <span className="w-14 text-center">YoY</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow
                    label="Avg Payment Days"
                    value={`${metrics.cash.averagePaymentDays} days`}
                    yoy={metrics.cash.averagePaymentDaysYoY}
                    invertColor
                  />
                  <MetricRow
                    label="Average Stock"
                    value={formatCurrency(metrics.cash.averageStock)}
                    yoy={metrics.cash.averageStockYoY}
                    invertColor
                  />
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function YoYIndicator({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const isPositive = value > 0
  const isNegative = value < 0
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : null

  return (
    <div
      className={`flex items-center gap-1 text-sm mt-1 ${
        isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground"
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>
        {isPositive ? "+" : ""}
        {value.toFixed(1)}
        {suffix} YoY
      </span>
    </div>
  )
}

function MetricRow({
  label,
  value,
  yoy,
  invertColor = false,
}: {
  label: string
  value: string
  yoy: number
  invertColor?: boolean
}) {
  const isPositive = invertColor ? yoy < 0 : yoy > 0
  const isNegative = invertColor ? yoy > 0 : yoy < 0

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{value}</span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded ${
            isPositive
              ? "bg-green-100 text-green-700"
              : isNegative
                ? "bg-red-100 text-red-700"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {yoy > 0 ? "+" : ""}
          {yoy.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}
