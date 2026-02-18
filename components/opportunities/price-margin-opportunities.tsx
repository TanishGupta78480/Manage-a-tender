"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, ChevronDown, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { competitorSpecs, getSkuById, getPerformanceBySkuId } from "@/lib/data"

interface PriceMarginOpportunity {
  skuId: string
  skuName: string
  morrisonsPrice: number
  competitorAvgPrice: number
  priceVsMarket: number
  margin: number
  marginVsTarget: number
  opportunityType: string
  opportunityValue: number
}

interface SubcategoryGroup {
  subcategory: string
  opportunities: PriceMarginOpportunity[]
  totalValue: number
  skuCount: number
}

interface PriceMarginOpportunitiesProps {
  opportunities: PriceMarginOpportunity[]
  selectedSkus?: Set<string>
  onSkuToggle?: (skuId: string) => void
  onSkusToggleAll?: (skuIds: string[]) => void
  subcategoryFilter?: string[]
}

export function PriceMarginOpportunities({
  opportunities,
  selectedSkus = new Set(),
  onSkuToggle,
  onSkusToggleAll,
  subcategoryFilter,
}: PriceMarginOpportunitiesProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedSku, setSelectedSku] = useState<string | null>(null)


  const TARGET_MARGIN = 46

  const groupedOpportunities = opportunities.reduce<Record<string, SubcategoryGroup>>((acc, opp) => {
    const sku = getSkuById(opp.skuId)
    const subcategory = sku?.subcategory || "Unknown"

    if (!acc[subcategory]) {
      acc[subcategory] = {
        subcategory,
        opportunities: [],
        totalValue: 0,
        skuCount: 0,
      }
    }
    acc[subcategory].opportunities.push(opp)
    acc[subcategory].totalValue += opp.opportunityValue
    acc[subcategory].skuCount += 1
    return acc
  }, {})

  const subcategoryGroups = Object.values(groupedOpportunities)
    .filter((g) => {
      if (subcategoryFilter && subcategoryFilter.length > 0 && !subcategoryFilter.includes(g.subcategory)) return false
      return true
    })
    .sort((a, b) => b.totalValue - a.totalValue)

  const selectedGroupOpps = selectedSubcategory ? groupedOpportunities[selectedSubcategory]?.opportunities || [] : []
  const selectedOpp = selectedSku ? opportunities.find((o) => o.skuId === selectedSku) : null
  const selectedSkuInfo = selectedSku ? getSkuById(selectedSku) : null
  const selectedCompSpecs = competitorSpecs.filter((c) => c.skuId === selectedSku)

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null)
      setSelectedSku(null)
    } else {
      setSelectedSubcategory(subcategory)
      setSelectedSku(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-gray-300 pt-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
        <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-100 pt-6 rounded-t-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="h-5 w-5 text-gray-700" />
                Commercial Performance Analysis
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 max-w-none">
                Identify SKUs where pricing is misaligned with margin performance. Opportunities exist where products are overpriced but still delivering below subcategory average margins
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="flex items-center justify-end px-4 pb-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px] text-right">Est. Annual Value</span>
          </div>
          <div className="space-y-2">
            {subcategoryGroups.map((group) => (
              <div
                key={group.subcategory}
                className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedSubcategory === group.subcategory
                    ? "bg-blue-200/60 border-2 border-[#3b5bdb] shadow-[0_4px_14px_rgba(59,91,219,0.35)] ring-1 ring-indigo-100"
                    : "bg-blue-150/40 border-2 border-gray-200 hover:border-[#3b5bdb]/50 hover:shadow-[0_4px_14px_rgba(59,91,219,0.3)] hover:-translate-y-0.5"
                }`}
                onClick={() => handleSubcategoryClick(group.subcategory)}
              >
                {/* Subcategory header row */}
                <div className="flex items-center p-4 min-h-[72px]">
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 shrink-0 ${
                    selectedSubcategory === group.subcategory ? "text-[#3b5bdb] rotate-0" : "text-muted-foreground -rotate-90"
                  }`} />
                  <div className="flex-1 ml-3">
                    <p className="font-medium text-foreground">{group.subcategory}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.skuCount} SKU{group.skuCount !== 1 ? "s" : ""} with price/margin misalignment
                    </p>
                  </div>
                  <p className="text-lg font-bold text-foreground min-w-[80px] text-right">{"\u00A3"}{(group.totalValue / 1000).toFixed(1)}k</p>
                </div>

                {selectedSubcategory === group.subcategory && (
                  <div className="border-t bg-gray-100 p-4" onClick={(e) => e.stopPropagation()}>
                    {/* SKU list within subcategory */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <Checkbox
                              checked={selectedGroupOpps.length > 0 && selectedGroupOpps.every((o) => selectedSkus.has(o.skuId))}
                              onCheckedChange={() => onSkusToggleAll?.(selectedGroupOpps.map((o) => o.skuId))}
                              className="h-4 w-4 data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                            />
                          </TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Our Price</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Avg. Market Price</TableHead>
                          <TableHead className="text-center whitespace-nowrap">% Price Difference</TableHead>
                          <TableHead className="text-center whitespace-nowrap">TNP Margin</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Potential Savings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedGroupOpps.map((opp) => (
                          <TableRow
                            key={opp.skuId}
                            className={`cursor-pointer transition-colors hover:bg-primary/10 ${selectedSku === opp.skuId ? "bg-primary/15" : ""}`}
                            onClick={() => setSelectedSku(selectedSku === opp.skuId ? null : opp.skuId)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedSkus.has(opp.skuId)}
                                onCheckedChange={() => onSkuToggle?.(opp.skuId)}
                                className="h-4 w-4 data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {opp.skuName}
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${selectedSku === opp.skuId ? "text-[#3b5bdb] rotate-0" : "text-muted-foreground -rotate-90"}`} />
                              </div>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">{"\u00A3"}{opp.morrisonsPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-center whitespace-nowrap">{"\u00A3"}{opp.competitorAvgPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                              <span className={`inline-flex items-center justify-center w-[70px] text-xs font-semibold px-2 py-1 rounded-md border ${
                                opp.priceVsMarket > 0
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
                              }`}>
                                {opp.priceVsMarket > 0 ? "+" : ""}
                                {opp.priceVsMarket.toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={opp.marginVsTarget < 0 ? "text-rose-600" : ""}>
                                {opp.margin.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-medium whitespace-nowrap">
                              {opp.opportunityValue > 0 ? (
                                <span className="text-emerald-600">£{(opp.opportunityValue / 1000).toFixed(1)}k</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {selectedOpp && selectedSkuInfo && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-3">{selectedSkuInfo.name} - Commercial Performance Analysis</h4>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* 1. Competitor Pricing (with Our Price merged) */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">Competitors Pricing</CardTitle>
                            </CardHeader>
        <CardContent className="bg-blue-50/20">
                              <div className="space-y-1.5">
                                {selectedCompSpecs.map((comp) => {
                                  const diff = ((selectedSkuInfo.retailPrice - comp.price) / comp.price) * 100
                                  return (
                                    <div key={comp.competitor} className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">{comp.competitor}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="w-[50px] text-right">£{comp.price.toFixed(2)}</span>
                                        <span className={`inline-flex items-center justify-center w-[55px] text-xs font-semibold px-1.5 py-0.5 rounded-md border ${
                                          diff > 0
                                            ? "bg-red-50 text-red-600 border-red-200"
                                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        }`}>
                                          {diff > 0 ? "+" : ""}
                                          {diff.toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                                <div className="flex items-center justify-between text-sm pt-2 border-t">
                                  <span className="font-medium">Avg. Market Price</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium w-[50px] text-right">£{selectedOpp.competitorAvgPrice.toFixed(2)}</span>
                                    <span className="w-[55px]"></span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm pt-1.5 border-t">
                                  <span className="font-bold">Our Price</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold w-[50px] text-right">£{selectedOpp.morrisonsPrice.toFixed(2)}</span>
                                    <span className={`inline-flex items-center justify-center w-[55px] text-xs font-semibold px-1.5 py-0.5 rounded-md border ${
                                      selectedOpp.priceVsMarket > 0
                                        ? "bg-red-50 text-red-600 border-red-200"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    }`}>
                                      {selectedOpp.priceVsMarket > 0 ? "+" : ""}{Math.abs(selectedOpp.priceVsMarket).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* 2. Margin */}
                          {(() => {
                            const perf = getPerformanceBySkuId(selectedOpp.skuId)
                            const marginPct = selectedOpp.margin
                            const barWidth = Math.min((marginPct / TARGET_MARGIN) * 100, 100)
                            return (
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Margin Performance</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {/* Big margin number */}
                                  <div>
                                    <p className="text-3xl font-bold">{marginPct.toFixed(1)}%</p>
                                    <div
                                      className={`flex items-center gap-1 text-sm mt-1 ${selectedOpp.marginVsTarget < 0 ? "text-rose-600" : "text-emerald-600"}`}
                                    >
                                      {selectedOpp.marginVsTarget < 0 ? (
                                        <TrendingDown className="h-3 w-3" />
                                      ) : (
                                        <TrendingUp className="h-3 w-3" />
                                      )}
                                      {selectedOpp.marginVsTarget > 0 ? "+" : ""}
                                      {selectedOpp.marginVsTarget.toFixed(1)}% vs category avg
                                    </div>
                                  </div>

                                  {/* Progress bar: margin vs category average */}
                                  <div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                      <span>Current</span>
                                      <span>Category Average: {TARGET_MARGIN}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${marginPct >= TARGET_MARGIN ? "bg-emerald-500" : "bg-rose-500"}`}
                                        style={{ width: `${barWidth}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Breakdown rows */}
                                  {perf && (
                                    <div className="space-y-2 pt-2 border-t">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Net Sales</span>
                                        <span className="font-medium">
                                          {"\u00A3"}{(perf.salesValue / 1000).toFixed(1)}k
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">COGS</span>
                                        <span className="font-medium">
                                          {"\u00A3"}{(perf.costOfGoods / 1000).toFixed(1)}k
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">TNP Margin</span>
                                        <span className="font-medium text-emerald-600">
                                          {"\u00A3"}{(perf.grossMargin / 1000).toFixed(1)}k
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )
                          })()}

                          {/* 3. Why this is an opportunity */}
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-medium text-amber-900">Why is this an opportunity?</p>
                                <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                                  {selectedOpp.skuName} is priced{" "}
                                  <strong>
                                    {Math.abs(selectedOpp.priceVsMarket).toFixed(0)}%{" "}
                                    {selectedOpp.priceVsMarket > 0 ? "above" : "below"}
                                  </strong>{" "}
                                  the competitor average (£{selectedOpp.competitorAvgPrice.toFixed(2)}), yet the margin
                                  is <strong>{Math.abs(selectedOpp.marginVsTarget).toFixed(1)}% below</strong> the
                                  subcategory average of {TARGET_MARGIN}%.
                                </p>
                                <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                                  This suggests the cost base is too high. Consider tendering to reduce supplier costs,
                                  or review the product specification to identify savings.
                                </p>
                                <p className="text-sm font-medium text-amber-900 mt-3">
                                  Estimated annual opportunity: {"\u00A3"}{(selectedOpp.opportunityValue / 1000).toFixed(1)}k
                                </p>
                                <p className="text-xs font-medium text-amber-700 mt-2 pt-2 border-t border-amber-200">
                                  Recommended action: Benchmark supplier cost against market and include in next tender round.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
