"use client"

import { useState } from "react"
import { AIChatBot } from "@/components/ai-chat-bot"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  FileText,
  Users,
  ChevronLeft,
  PoundSterling,
  Lightbulb,
  Zap,
  Clock,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"
import { getLemonDrizzleCakeData, getTenderBySubcategory } from "@/lib/data/bakery-opportunities"

export default function LemonDrizzleCaseStudyPage() {
  const data = getLemonDrizzleCakeData()
  const tender = data ? getTenderBySubcategory(data.subcategory) : null
  const [activeTab, setActiveTab] = useState("overview")

  if (!data) {
    return <div>Case study data not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Back navigation */}
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Opportunities
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{data.sku}</h1>
                <Badge variant="destructive" className="text-sm">
                  4 Levers Triggered
                </Badge>
                {data.isLiveTender && (
                  <Badge className="bg-green-600 text-white text-sm animate-pulse">
                    <Zap className="h-3 w-3 mr-1" /> LIVE TENDER
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg">
                {data.subcategory} | SKU: {data.skuId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Value at Stake</p>
              <p className="text-3xl font-bold text-primary">£{data.totalValueAtStakeGBP.toLocaleString()}</p>
            </div>
          </div>

          {/* Lever badges */}
          <div className="flex gap-2 mt-4">
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <TrendingUp className="h-3 w-3 mr-1" /> Input Price
            </Badge>
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Target className="h-3 w-3 mr-1" /> Spec Gap
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <PoundSterling className="h-3 w-3 mr-1" /> Price/Margin
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Calendar className="h-3 w-3 mr-1" /> Contract Renewal
            </Badge>
          </div>
        </div>

        {data.isLiveTender && tender && (
          <Card className="mb-6 border-2 border-green-500 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Zap className="h-5 w-5" />
                Live Tender Context
              </CardTitle>
              <CardDescription className="text-green-700">
                This is no longer a theoretical opportunity — the tender is live, so we can act now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-green-700">Tender ID</p>
                  <p className="font-bold text-green-900">{tender.tenderId}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Time to Award</p>
                  <p className="font-bold text-green-900 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tender.monthsToAward} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Tender Period</p>
                  <p className="font-bold text-green-900">
                    {new Date(tender.tenderStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} -{" "}
                    {new Date(tender.tenderEndDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Incumbent</p>
                  <p className="font-bold text-green-900">{tender.incumbentSupplier}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-green-700">Commercial Focus</p>
                <p className="font-semibold text-green-900">{tender.commercialFocus}</p>
              </div>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Why this accelerates action:</strong> With a live tender in market, all identified
                  opportunities (input cost reset, spec alignment, margin recovery) can be addressed immediately through
                  the competitive process. The commercial team can act now rather than waiting for the next contract
                  cycle.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Narrative card */}
        <Card className="mb-6 border-l-4 border-l-primary bg-primary/5">
          <CardContent className="py-4">
            <p className="text-foreground">{data.narrative}</p>
          </CardContent>
        </Card>

        {/* Tabs for each lever */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="input-price">Input Price</TabsTrigger>
            <TabsTrigger value="spec">Specification</TabsTrigger>
            <TabsTrigger value="price-margin">Price / Margin</TabsTrigger>
            <TabsTrigger value="live-tender" className="text-green-700">
              <Zap className="h-3 w-3 mr-1" /> Live Tender
            </TabsTrigger>
            <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Annual Units</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{data.annualUnits.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Annual Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">£{data.annualRevenueGBP.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Annual Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">£{data.annualSpendGBP.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className={data.isLiveTender ? "border-green-500 bg-green-50" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {data.isLiveTender ? "Months to Award" : "Months to Tender"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${data.isLiveTender ? "text-green-700" : ""}`}>
                    {data.isLiveTender ? data.monthsToAward : data.monthsToTender}
                    {data.isLiveTender && <span className="text-sm ml-1">(LIVE)</span>}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Value Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Potential Input Saving</span>
                    <span className="font-semibold text-green-600">
                      £{data.potentialInputSavingGBP.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Potential Margin Uplift</span>
                    <span className="font-semibold text-green-600">
                      £{data.potentialMarginUpliftGBP.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Total Value at Stake</span>
                    <span className="font-bold text-xl text-primary">
                      £{data.totalValueAtStakeGBP.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opportunity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Input Price Gap: +{(data.inputPriceGapPct * 100).toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Supplier cost up while commodities down</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Target className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Spec Gap: {data.specGapVsMin} pts</p>
                      <p className="text-sm text-muted-foreground">
                        {data.specMetric} {data.ourSpec}% vs market {data.marketSpecMin}-{data.marketSpecMax}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <PoundSterling className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Price Index: {data.priceIndex.toFixed(2)} | Margin: {(data.grossMarginPct * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Priced above market with weak margin</p>
                    </div>
                  </div>
                  {data.isLiveTender && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700">LIVE TENDER - Immediate Action</p>
                        <p className="text-sm text-muted-foreground">{data.monthsToAward} months to award</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Input Price Tab */}
          <TabsContent value="input-price" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  Input Price Analysis
                </CardTitle>
                <CardDescription>Supplier cost is increasing while commodity inputs are falling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  {/* Supplier Cost */}
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-muted-foreground mb-1">Supplier Cost YoY</p>
                    <p className="text-3xl font-bold text-red-600">+{(data.supplierCostYoYPct * 100).toFixed(1)}%</p>
                    <div className="mt-2 text-sm">
                      <p>12M Ago: £{data.supplierUnitCost12MAgoGBP.toFixed(2)}</p>
                      <p>Current: £{data.supplierUnitCostGBP.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Commodity Basket */}
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-muted-foreground mb-1">Commodity Basket YoY</p>
                    <p className="text-3xl font-bold text-green-600">
                      {(data.commodityBasketYoYPct * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">Weighted average of inputs (falling)</p>
                  </div>

                  {/* Gap */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary">
                    <p className="text-sm text-muted-foreground mb-1">Input Price Gap</p>
                    <p className="text-3xl font-bold text-primary">+{(data.inputPriceGapPct * 100).toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground mt-2">Opportunity threshold: ≥10%</p>
                  </div>
                </div>

                {/* Commodity breakdown */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Commodity Component Breakdown</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Note: Individual commodity trends are illustrative. The basket total (
                    {(data.commodityBasketYoYPct * 100).toFixed(1)}%) is the authoritative figure.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Commodity</th>
                          <th className="text-center py-2">Weight</th>
                          <th className="text-right py-2">Prev Value</th>
                          <th className="text-right py-2">Curr Value</th>
                          <th className="text-right py-2">YoY %</th>
                          <th className="text-right py-2">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 font-medium">{data.commodity1}</td>
                          <td className="text-center">{data.commodity1Weight * 100}%</td>
                          <td className="text-right">
                            {data.commodity1PrevValue.toFixed(3)} {data.commodity1Units.split(" ")[0]}
                          </td>
                          <td className="text-right">
                            {data.commodity1CurrValue.toFixed(3)} {data.commodity1Units.split(" ")[0]}
                          </td>
                          <td className="text-right">
                            <span className="text-green-600">{(data.commodity1YoYPct * 100).toFixed(1)}%</span>
                          </td>
                          <td className="text-right">
                            <TrendingDown className="h-4 w-4 text-green-600 inline" />
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium">{data.commodity2}</td>
                          <td className="text-center">{data.commodity2Weight * 100}%</td>
                          <td className="text-right">
                            {data.commodity2PrevValue.toFixed(3)} {data.commodity2Units.split(" ")[0]}
                          </td>
                          <td className="text-right">
                            {data.commodity2CurrValue.toFixed(3)} {data.commodity2Units.split(" ")[0]}
                          </td>
                          <td className="text-right">
                            <span className="text-green-600">{(data.commodity2YoYPct * 100).toFixed(1)}%</span>
                          </td>
                          <td className="text-right">
                            <TrendingDown className="h-4 w-4 text-green-600 inline" />
                          </td>
                        </tr>
                        <tr className="bg-muted/50 font-semibold">
                          <td className="py-3">Total Commodity Basket</td>
                          <td className="text-center">100%</td>
                          <td className="text-right">-</td>
                          <td className="text-right">-</td>
                          <td className="text-right">
                            <span className="text-green-600">{(data.commodityBasketYoYPct * 100).toFixed(1)}%</span>
                          </td>
                          <td className="text-right">
                            <TrendingDown className="h-4 w-4 text-green-600 inline" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Source: {data.commodity1Source} ({data.commodity1SeriesId}), {data.commodity2Source} (
                    {data.commodity2SeriesId})
                  </p>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">Estimated Annual Opportunity Value</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Gap of <strong>+{(data.inputPriceGapPct * 100).toFixed(1)}%</strong> applied to annual spend of{" "}
                        <strong>£{data.annualSpendGBP.toLocaleString()}</strong> = estimated saving of{" "}
                        <strong>£{data.potentialInputSavingGBP.toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spec Tab */}
          <TabsContent value="spec" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Specification Benchmarking
                </CardTitle>
                <CardDescription>Our spec is below market standard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Spec Metric</p>
                    <p className="text-xl font-bold">{data.specMetric}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Our Spec</p>
                    <p className="text-3xl font-bold text-orange-600">{data.ourSpec}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Market Min</p>
                    <p className="text-3xl font-bold text-green-600">{data.marketSpecMin}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Market Max</p>
                    <p className="text-3xl font-bold text-green-600">{data.marketSpecMax}%</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">
                        Spec Gap: {data.specGapVsMin} percentage points below market minimum
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        Our {data.specMetric} at {data.ourSpec}% is below the market range of {data.marketSpecMin}%-
                        {data.marketSpecMax}%. Consider spec negotiation or reformulation to meet market expectations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price/Margin Tab */}
          <TabsContent value="price-margin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PoundSterling className="h-5 w-5 text-amber-600" />
                  Price vs Market & Margin Analysis
                </CardTitle>
                <CardDescription>Priced above market with below-target margin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  {/* Price section */}
                  <div>
                    <h4 className="font-semibold mb-4">Price Positioning</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Our Price</span>
                        <span className="font-semibold">£{data.ourPriceGBP.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Market Price</span>
                        <span className="font-semibold">£{data.marketPriceGBP.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Price Index</span>
                        <span
                          className={`font-bold text-xl ${data.priceIndex > 1.02 ? "text-amber-600" : "text-green-600"}`}
                        >
                          {data.priceIndex.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Price index {">"} 1.02 indicates we are priced significantly above market
                    </p>
                  </div>

                  {/* Margin section */}
                  <div>
                    <h4 className="font-semibold mb-4">Margin Performance</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Supplier Unit Cost</span>
                        <span className="font-semibold">£{data.supplierUnitCostGBP.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Our Price</span>
                        <span className="font-semibold">£{data.ourPriceGBP.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Gross Margin %</span>
                        <span
                          className={`font-bold text-xl ${data.grossMarginPct < 0.3 ? "text-red-600" : "text-green-600"}`}
                        >
                          {(data.grossMarginPct * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Target Margin</span>
                        <span className="font-semibold">30.0%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Margin {"<"} 30% indicates below-target profitability for this category
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live-tender" className="space-y-6">
            {tender && (
              <Card className="border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Zap className="h-5 w-5" />
                    Live Tender Details
                  </CardTitle>
                  <CardDescription>Active sourcing process for {tender.subcategory}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tender ID</p>
                        <p className="text-xl font-bold">{tender.tenderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className="bg-green-600 text-white">{tender.tenderStatus}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Incumbent Supplier</p>
                        <p className="font-semibold">{tender.incumbentSupplier}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tender Period</p>
                        <p className="font-semibold">
                          {new Date(tender.tenderStartDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          to{" "}
                          {new Date(tender.tenderEndDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time to Award</p>
                        <p className="text-2xl font-bold text-green-700">{tender.monthsToAward} months</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Commercial Focus</p>
                    <p className="font-semibold text-lg">{tender.commercialFocus}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">SKUs Included in Tender</p>
                    <div className="flex flex-wrap gap-2">
                      {tender.includedSkus.map((sku, idx) => (
                        <Badge
                          key={idx}
                          variant={sku === data.sku ? "default" : "outline"}
                          className={sku === data.sku ? "bg-green-600" : ""}
                        >
                          {sku}
                          {sku === data.sku && " (This SKU)"}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-green-700 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">End-to-End Story</p>
                          <ol className="mt-2 space-y-1 text-sm text-green-700 list-decimal list-inside">
                            <li>Analytics identified the multi-lever opportunity (input cost, spec, margin)</li>
                            <li>Tender timing creates urgency — the tender is live NOW</li>
                            <li>Commercial team can act immediately through the competitive process</li>
                            <li>Value capture: £{data.totalValueAtStakeGBP.toLocaleString()} at stake</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Action Plan Tab */}
          <TabsContent value="action-plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Recommended Action Plan
                </CardTitle>
                <CardDescription>
                  Prioritised actions to capture £{data.totalValueAtStakeGBP.toLocaleString()} opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.isLiveTender && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-800">URGENT: Live Tender in Progress</span>
                    </div>
                    <p className="text-sm text-green-700">
                      All actions below can be addressed immediately through the current tender process. Time to award:{" "}
                      {data.monthsToAward} months.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-red-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Challenge Supplier on Input Cost</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Present commodity data showing {data.commodity1} ({(data.commodity1YoYPct * 100).toFixed(1)}%
                        YoY) and {data.commodity2} ({(data.commodity2YoYPct * 100).toFixed(1)}% YoY) are both down, yet
                        supplier cost is up +{(data.supplierCostYoYPct * 100).toFixed(0)}%. Request cost breakdown and
                        justification.
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Potential saving: £{data.potentialInputSavingGBP.toLocaleString()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-orange-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">Address Specification Gap</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our {data.specMetric} at {data.ourSpec}% is {Math.abs(data.specGapVsMin || 0)} percentage points
                        below market minimum ({data.marketSpecMin}%). Options: (a) negotiate spec increase to align with
                        market, or (b) use lower spec as cost reduction lever.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-amber-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Review Price Positioning</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Price index of {data.priceIndex.toFixed(2)} with only {(data.grossMarginPct * 100).toFixed(1)}%
                        margin suggests cost structure issue. Either reduce cost to improve margin, or consider price
                        reduction to improve competitiveness.
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Margin uplift potential: £{data.potentialMarginUpliftGBP.toLocaleString()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-primary">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {data.isLiveTender ? "Execute Through Live Tender" : "Prepare for Tender"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {data.isLiveTender
                          ? `With the ${tender?.subcategory} tender live, incorporate all three levers (cost, spec, margin) into supplier negotiations. Use competitive tension to drive value.`
                          : `Contract renewal in ${data.monthsToTender} months. Prepare RFP incorporating cost benchmarks, spec requirements, and margin targets.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button asChild>
                    <Link href="/suppliers">
                      <Users className="h-4 w-4 mr-2" />
                      View Suppliers
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/tender">
                      <FileText className="h-4 w-4 mr-2" />
                      {data.isLiveTender ? "View Active Tender" : "Launch Tender"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <AIChatBot />
    </div>
  )
}
