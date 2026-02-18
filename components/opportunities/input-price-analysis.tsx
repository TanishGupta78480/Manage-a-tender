"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, ChevronDown, Sparkles } from "lucide-react"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  skuCostHistory,
  defaultRecipeCards,
  getCommodityCostHistory,
  getCommodityById,
  getSkuById,
  type RecipeCard,
} from "@/lib/data"

interface InputPriceOpportunity {
  skuId: string
  skuName: string
  costPriceChange: number
  commodityCostChange: number
  gap: number
  opportunityValue: number
  commodityBasketYoYPct?: number // Added for commodityBasketYoYPct
}

interface SubcategoryGroup {
  subcategory: string
  opportunities: InputPriceOpportunity[]
  totalValue: number
  skuCount: number
}

interface InputPriceAnalysisProps {
  opportunities: InputPriceOpportunity[]
  selectedSkus?: Set<string>
  onSkuToggle?: (skuId: string) => void
  onSkusToggleAll?: (skuIds: string[]) => void
  subcategoryFilter?: string[]
}

export function InputPriceAnalysis({
  opportunities,
  selectedSkus = new Set(),
  onSkuToggle,
  onSkusToggleAll,
  subcategoryFilter,
}: InputPriceAnalysisProps) {
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null)
  const [selectedSku, setSelectedSku] = useState<string | null>(null)
  const [recipes] = useState<RecipeCard[]>(defaultRecipeCards)


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

  const expandedGroupOpps = expandedSubcategory ? groupedOpportunities[expandedSubcategory]?.opportunities || [] : []

  const selectedSkuData = selectedSku ? skuCostHistory.find((s) => s.skuId === selectedSku) : null
  const selectedRecipe = selectedSku ? recipes.find((r) => r.skuId === selectedSku) : null
  const sku = selectedSku ? getSkuById(selectedSku) : null

  const recipeAnalysis = useMemo(() => {
    if (!selectedRecipe) return null

    // Calculate total quantity for percentage
    const totalQuantity = selectedRecipe.ingredients.reduce((sum, ing) => sum + ing.quantity, 0)

    const ingredientAnalysis = selectedRecipe.ingredients.map((ing) => {
      const commodity = getCommodityById(ing.commodityId)
      const percentage = (ing.quantity / totalQuantity) * 100
      const priceChange = commodity?.priceChange12w || 0

      return {
        commodityId: ing.commodityId,
        name: commodity?.name || "Unknown",
        percentage,
        priceChange, // illustrative only
        unit: ing.unit,
      }
    })

    const selectedOpp = opportunities.find((o) => o.skuId === selectedRecipe.skuId)

    // If we have opportunity data with basket, use that; otherwise fall back to weighted calc
    const totalCommodityChange = selectedOpp
      ? (selectedOpp as any).commodityBasketYoYPct !== undefined
        ? (selectedOpp as any).commodityBasketYoYPct * 100
        : ingredientAnalysis.reduce((sum, ing) => sum + (ing.percentage / 100) * ing.priceChange, 0)
      : ingredientAnalysis.reduce((sum, ing) => sum + (ing.percentage / 100) * ing.priceChange, 0)

    return {
      ingredients: ingredientAnalysis,
      overheadPercent: selectedRecipe.overheadPercent,
      totalCommodityChange: totalCommodityChange,
    }
  }, [selectedRecipe, opportunities])

  const chartData =
    selectedSkuData && selectedRecipe
      ? (() => {
          // 12 data points = 12 months, starting 11 months back from current
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          const now = new Date()
          const currentMonth = now.getMonth()
          const totalPoints = selectedSkuData.history.length
          const commodityCosts = getCommodityCostHistory(selectedRecipe)

          return selectedSkuData.history.map((h, i) => {
            // Each point is one month: oldest first
            const monthIndex = (currentMonth - (totalPoints - 1 - i) + 12) % 12
            const monthLabel = monthNames[monthIndex]

            return {
              week: monthLabel,
              costPrice: h.costPrice,
              commodityCost: commodityCosts[i]?.cost || 0,
            }
          })
        })()
      : []

  const handleExpandClick = (subcategory: string) => {
    if (expandedSubcategory === subcategory) {
      setExpandedSubcategory(null)
      setSelectedSku(null)
    } else {
      setExpandedSubcategory(subcategory)
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
                <TrendingUp className="h-5 w-5 text-gray-700" />
                Input Cost Change Analysis
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 max-w-none text-sm">
                Compare supplier cost price changes against underlying commodity movements. Opportunities exist where cost prices increased more than commodity prices justify
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
                  expandedSubcategory === group.subcategory
                    ? "bg-blue-200/60 border-2 border-[#3b5bdb] shadow-[0_4px_14px_rgba(59,91,219,0.35)] ring-1 ring-indigo-100"
                    : "bg-blue-150/40 border-2 border-gray-200 hover:border-[#3b5bdb]/50 hover:shadow-[0_4px_14px_rgba(59,91,219,0.3)] hover:-translate-y-0.5"
                }`}
                onClick={() => handleExpandClick(group.subcategory)}
              >
                {/* Subcategory header row */}
                <div className="group/row flex items-center p-4 min-h-[72px]">
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 shrink-0 ${
                    expandedSubcategory === group.subcategory ? "text-[#3b5bdb] rotate-0" : "text-muted-foreground -rotate-90"
                  }`} />
                  <div className="flex-1 ml-3">
                    <p className="font-medium text-foreground">{group.subcategory}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.skuCount} SKU{group.skuCount !== 1 ? "s" : ""} with cost price gaps
                    </p>
                  </div>
                  <p className="text-lg font-bold text-foreground min-w-[80px] text-right">{"\u00A3"}{(group.totalValue / 1000).toFixed(1)}k</p>
                </div>

                {expandedSubcategory === group.subcategory && (
                  <div className="border-t bg-gray-100 p-4" onClick={(e) => e.stopPropagation()}>
                    {/* SKU list within subcategory */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <Checkbox
                              checked={expandedGroupOpps.length > 0 && expandedGroupOpps.every((o) => selectedSkus.has(o.skuId))}
                              onCheckedChange={() => onSkusToggleAll?.(expandedGroupOpps.map((o) => o.skuId))}
                              className="h-4 w-4 data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                            />
                          </TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Cost Price Change</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Commodity Change</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Gap</TableHead>
                          <TableHead className="text-center whitespace-nowrap">Potential Savings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expandedGroupOpps.map((opp) => (
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
                            <TableCell className="text-center">
                              <span className="text-rose-600">+{opp.costPriceChange.toFixed(1)}%</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={opp.commodityCostChange > 0 ? "text-rose-600" : "text-emerald-600"}>
                                {opp.commodityCostChange > 0 ? "+" : ""}
                                {opp.commodityCostChange.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center w-[70px] text-xs font-semibold px-2 py-1 rounded-md border bg-red-50 text-red-600 border-red-200">
                                +{opp.gap.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-medium whitespace-nowrap">
                              {opp.opportunityValue > 0 ? (
                                <span className="text-emerald-600">{"\u00A3"}{(opp.opportunityValue / 1000).toFixed(1)}k</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {selectedSku && sku && selectedRecipe && recipeAnalysis && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Chart */}
                          <div className="lg:col-span-2">
                            <h4 className="font-medium mb-3">{sku.name} - Cost vs Commodity Trend</h4>
                            <div className="h-[250px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#737373" />
                                  <YAxis
                                    tick={{ fontSize: 12 }}
                                    stroke="#737373"
                                    tickFormatter={(v) => `£${v.toFixed(2)}`}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #e5e5e5",
                                      borderRadius: "8px",
                                    }}
                                    formatter={(value: number) => [`£${value.toFixed(2)}`, ""]}
                                  />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="costPrice"
                                    stroke="#dc2626"
                                    strokeWidth={2}
                                    name="Supplier Cost Price"
                                    dot={false}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="commodityCost"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    name="Estimated Commodity Cost"
                                    dot={false}
                                    strokeDasharray="5 5"
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Insight panel on the right */}
                          {opportunities.find((o) => o.skuId === selectedSku) && (
                            <div className="flex flex-col">
                              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg h-full">
                                <div className="flex items-start gap-3">
                                  <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-medium text-amber-900">Why is this an opportunity?</p>
                                    <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                                      Supplier cost price increased by{" "}
                                      <strong>
                                        {opportunities.find((o) => o.skuId === selectedSku)?.costPriceChange.toFixed(1)}%
                                      </strong>{" "}
                                      over the last 12 weeks, while commodity costs only moved{" "}
                                      <strong>
                                        {opportunities.find((o) => o.skuId === selectedSku)?.commodityCostChange.toFixed(1)}%
                                      </strong>.
                                    </p>
                                    <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                                      This{" "}
                                      <strong>
                                        {opportunities.find((o) => o.skuId === selectedSku)?.gap.toFixed(1)}%
                                      </strong>{" "}
                                      gap represents an estimated annual saving of{" "}
                                      <strong>
                                        {"\u00A3"}{((opportunities.find((o) => o.skuId === selectedSku)?.opportunityValue || 0) / 1000).toFixed(1)}k
                                      </strong>.
                                    </p>
                                    <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                                      Consider challenging the supplier on this gap during the next price review or tender cycle.
                                    </p>
                                    <p className="text-xs font-medium text-amber-700 mt-3 pt-2 border-t border-amber-200">
                                      Recommended action: Include in next tender round for competitive re-pricing.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
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
