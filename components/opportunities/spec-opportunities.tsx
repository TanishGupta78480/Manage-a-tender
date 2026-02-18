"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Scale, ChevronDown, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getSpecRecipeBySkuId, skus } from "@/lib/data"
import { SpecRecipeComparison } from "@/components/opportunities/spec-recipe-comparison"


interface SubcategoryGroup {
  subcategory: string
  opportunities: Array<{
    skuId: string
    sku: string
    specMetric: string
    ourSpec: number
    marketSpec: number
    specGap: number
    savingGBP: number
    isAboveSpec: boolean
  }>
  totalValue: number
  skuCount: number
}

interface SpecOpportunitiesProps {
  opportunities?: Array<{
    skuId: string
    sku: string
    subcategory: string
    specMetric: string
    ourSpec: number
    marketSpecMin: number
    specGapVsMin: number
    specPotentialSavingGBP?: number
    isAboveSpec?: boolean
  }>
  selectedSkus?: Set<string>
  onSkuToggle?: (skuId: string) => void
  onSkusToggleAll?: (skuIds: string[]) => void
  subcategoryFilter?: string[]
}

export function SpecOpportunities({
  opportunities = [],
  selectedSkus = new Set(),
  onSkuToggle,
  onSkusToggleAll,
  subcategoryFilter,
}: SpecOpportunitiesProps) {
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null)
  const [selectedSku, setSelectedSku] = useState<string | null>(null)

  const [recipeViewSku, setRecipeViewSku] = useState<{
    skuId: string
    sku: string
    subcategory: string
    specMetric: string
    ourSpec: number
    marketSpec: number
    isAboveSpec: boolean
  } | null>(null)

  // Group by subcategory
  const groupedOpportunities = opportunities.reduce<Record<string, SubcategoryGroup>>((acc, opp) => {
    const subcategory = opp.subcategory

    if (!acc[subcategory]) {
      acc[subcategory] = {
        subcategory,
        opportunities: [],
        totalValue: 0,
        skuCount: 0,
      }
    }

    acc[subcategory].opportunities.push({
      skuId: opp.skuId,
      sku: opp.sku,
      specMetric: opp.specMetric,
      ourSpec: opp.ourSpec,
      marketSpec: opp.marketSpecMin,
      specGap: opp.specGapVsMin,
      savingGBP: opp.specPotentialSavingGBP || 0,
      isAboveSpec: opp.isAboveSpec ?? opp.specGapVsMin > 0,
    })
    acc[subcategory].totalValue += opp.specPotentialSavingGBP || 0
    acc[subcategory].skuCount++
    return acc
  }, {})

  const subcategoryGroups = Object.values(groupedOpportunities)
    .filter((g) => {
      if (subcategoryFilter && subcategoryFilter.length > 0 && !subcategoryFilter.includes(g.subcategory)) return false
      return true
    })
    .sort((a, b) => b.totalValue - a.totalValue)

  const handleSubcategoryClick = (subcategory: string) => {
    if (expandedSubcategory === subcategory) {
      setExpandedSubcategory(null)
      setSelectedSku(null)
      setRecipeViewSku(null)
    } else {
      setExpandedSubcategory(subcategory)
      setSelectedSku(null)
      setRecipeViewSku(null)
    }
  }

  const handleSkuClick = (opp: SubcategoryGroup["opportunities"][0], subcategory: string) => {
    const recipes = getSpecRecipeBySkuId(opp.skuId, subcategory)
    if (recipes.current && recipes.competitor) {
      setRecipeViewSku({
        skuId: opp.skuId,
        sku: opp.sku,
        subcategory,
        specMetric: opp.specMetric,
        ourSpec: opp.ourSpec,
        marketSpec: opp.marketSpec,
        isAboveSpec: opp.isAboveSpec,
      })
      setSelectedSku(opp.skuId)
    } else {
      // Toggle the info panel if no recipe data
      setSelectedSku(selectedSku === opp.skuId ? null : opp.skuId)
      setRecipeViewSku(null)
    }
  }

  const handleBackFromRecipe = () => {
    setRecipeViewSku(null)
    setSelectedSku(null)
  }

  return (
    <div className="space-y-4">
      <Card className="border-gray-300 pt-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
        <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-100 pt-6 rounded-t-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Scale className="h-5 w-5 text-gray-700" />
                Spec Opportunity Analysis
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 max-w-none">
                Compare product specifications against competitors. Over-specced products may offer cost savings; under-specced products represent quality gaps for tender negotiation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="flex items-center justify-end px-4 pb-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px] text-right">Est. Annual Value</span>
          </div>
          <div className="space-y-2">
            {subcategoryGroups.map((group) => {
              // Pre-compute positive impact total for the value column
              const positiveImpactTotal = group.opportunities.reduce((sum, opp) => {
                const recipes = getSpecRecipeBySkuId(opp.skuId, group.subcategory)
                const curCost = recipes.current
                  ? recipes.current.ingredients.reduce((s, i) => s + i.priceInSku, 0)
                  : 0
                const compCost = recipes.competitor
                  ? recipes.competitor.ingredients.reduce((s, i) => s + i.priceInSku, 0)
                  : 0
                const diff = curCost - compCost
                const skuData = skus.find((s) => s.id === opp.skuId)
                const annVol = skuData?.contractTerms?.annualVolume ?? (skuData ? skuData.weeklyVolume * 52 : 0)
                const impact = diff * annVol
                return impact > 0 ? sum + impact : sum
              }, 0)

              return (
              <div
                key={group.subcategory}
                className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  expandedSubcategory === group.subcategory
                    ? "bg-blue-200/60 border-2 border-[#3b5bdb] shadow-[0_4px_14px_rgba(59,91,219,0.35)] ring-1 ring-indigo-100"
                    : "bg-blue-150/40 border-2 border-gray-200 hover:border-[#3b5bdb]/50 hover:shadow-[0_4px_14px_rgba(59,91,219,0.3)] hover:-translate-y-0.5"
                }`}
                onClick={() => handleSubcategoryClick(group.subcategory)}
              >
                {/* Subcategory header row */}
                <div className="group/row flex items-center p-4 min-h-[72px]">
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 shrink-0 ${
                    expandedSubcategory === group.subcategory ? "text-[#3b5bdb] rotate-0" : "text-muted-foreground -rotate-90"
                  }`} />
                  <div className="flex-1 ml-3">
                      <p className="font-medium text-foreground">{group.subcategory}</p>
                      <p className="text-sm text-muted-foreground">
                        {(() => {
                          const savingsCount = group.opportunities.filter((opp) => {
                            const recipes = getSpecRecipeBySkuId(opp.skuId, group.subcategory)
                            const curCost = recipes.current
                              ? recipes.current.ingredients.reduce((s, i) => s + i.priceInSku, 0)
                              : 0
                            const compCost = recipes.competitor
                              ? recipes.competitor.ingredients.reduce((s, i) => s + i.priceInSku, 0)
                              : 0
                            return curCost - compCost > 0.001
                          }).length
                          return savingsCount > 0
                            ? `${savingsCount} SKU${savingsCount !== 1 ? "s" : ""} with potential savings`
                            : `${group.skuCount} SKU${group.skuCount !== 1 ? "s" : ""} with spec gaps`
                        })()}
                      </p>
                  </div>
                  <p className={`text-lg font-bold min-w-[80px] text-right ${positiveImpactTotal > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                    {"\u00A3"}{(positiveImpactTotal / 1000).toFixed(1)}k
                  </p>
                </div>

                {expandedSubcategory === group.subcategory && (
                  <div className="border-t bg-gray-100 p-4" onClick={(e) => e.stopPropagation()}>
                    {/* If recipe view is active, show recipe comparison */}
                    {recipeViewSku && recipeViewSku.subcategory === group.subcategory ? (
                      (() => {
                        const recipes = getSpecRecipeBySkuId(
                          recipeViewSku.skuId,
                          recipeViewSku.subcategory,
                        )
                        if (!recipes.current || !recipes.competitor) return null
                        return (
                          <SpecRecipeComparison
                            skuName={recipeViewSku.sku}
                            specMetric={recipeViewSku.specMetric}
                            ourSpec={recipeViewSku.ourSpec}
                            marketSpec={recipeViewSku.marketSpec}
                            isAboveSpec={recipeViewSku.isAboveSpec}
                            currentRecipe={recipes.current}
                            competitorRecipe={recipes.competitor}
                            onBack={handleBackFromRecipe}
                          />
                        )
                      })()
                    ) : (
                      <>
                        {/* SKU list within subcategory */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10">
                                <Checkbox
                                  checked={group.opportunities.length > 0 && group.opportunities.every((o) => selectedSkus.has(o.skuId))}
                                  onCheckedChange={() => onSkusToggleAll?.(group.opportunities.map((o) => o.skuId))}
                                  className="h-4 w-4 data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                                />
                              </TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead className="text-center whitespace-nowrap">Current Cost</TableHead>
                              <TableHead className="text-center whitespace-nowrap">Competitor Cost</TableHead>
                              <TableHead className="text-center whitespace-nowrap">% Cost Difference</TableHead>
                              <TableHead className="text-center whitespace-nowrap">Potential Savings</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.opportunities.map((opp, idx) => {
                              const recipes = getSpecRecipeBySkuId(opp.skuId, group.subcategory)
                              const currentCost = recipes.current
                                ? recipes.current.ingredients.reduce((s, i) => s + i.priceInSku, 0)
                                : 0
                              const competitorCost = recipes.competitor
                                ? recipes.competitor.ingredients.reduce((s, i) => s + i.priceInSku, 0)
                                : 0
                              const costDiff = currentCost - competitorCost
                              const costDiffPct = competitorCost > 0
                                ? ((costDiff / competitorCost) * 100)
                                : 0
                              const skuData = skus.find((s) => s.id === opp.skuId)
                              const annualVolume = skuData?.contractTerms?.annualVolume ?? (skuData ? skuData.weeklyVolume * 52 : 0)
                              const annualImpact = costDiff * annualVolume

                              return (
                                <TableRow
                                  key={`${opp.skuId}-${idx}`}
                                  className={`cursor-pointer transition-colors hover:bg-primary/10 ${
                                    selectedSku === opp.skuId ? "bg-primary/15" : ""
                                  }`}
                                  onClick={() => handleSkuClick(opp, group.subcategory)}
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
                                      {opp.sku}
                                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${selectedSku === opp.skuId ? "text-[#3b5bdb] rotate-0" : "text-muted-foreground -rotate-90"}`} />
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center whitespace-nowrap">
                                    {recipes.current ? (
                                      <span className="font-medium">{"\u00A3"}{currentCost.toFixed(2)}</span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center whitespace-nowrap">
                                    {recipes.competitor ? (
                                      <span className="font-medium">{"\u00A3"}{competitorCost.toFixed(2)}</span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {Math.abs(costDiffPct) > 0.1 ? (
                                      <span
                                        className={`inline-flex items-center justify-center gap-1 w-[80px] text-xs font-semibold px-2 py-1 rounded-md border ${
                                          costDiffPct > 0
                                            ? "bg-red-50 text-red-600 border-red-200"
                                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        }`}
                                      >
                                        {costDiffPct > 0 ? (
                                          <TrendingUp className="h-3 w-3" />
                                        ) : (
                                          <TrendingDown className="h-3 w-3" />
                                        )}
                                        {costDiffPct > 0 ? "+" : ""}{costDiffPct.toFixed(1)}%
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center justify-center w-[80px] text-xs font-semibold px-2 py-1 rounded-md border bg-gray-50 text-gray-500 border-gray-200">
                                        0.0%
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center font-medium whitespace-nowrap">
                                    {annualImpact > 1 ? (
                                      <span className="text-emerald-600">
                                        {"\u00A3"}{(annualImpact / 1000).toFixed(1)}k/yr
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>

                        {selectedSku && !recipeViewSku && (
                          <div className="mt-4 pt-4 border-t">
                            {(() => {
                              const selectedOpp = group.opportunities.find(
                                (o) => o.skuId === selectedSku,
                              )
                              if (!selectedOpp) return null

                              return (
                                <div
                                  className="p-4 border rounded-lg bg-amber-50 border-amber-200"
                                >
                                  <div className="flex items-start gap-3">
                                    <Sparkles
                                      className="h-5 w-5 mt-0.5 text-amber-600"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-amber-900">
                                        Why is this an opportunity?
                                      </p>
                                      <div className="mt-2 text-sm text-amber-800">
                                        {selectedOpp.isAboveSpec ? (
                                          <>
                                            <p>
                                              <strong>{selectedOpp.specMetric}:</strong>{" "}
                                              Our product has{" "}
                                              {selectedOpp.specMetric.includes("Salt")
                                                ? `${selectedOpp.ourSpec}g`
                                                : `${selectedOpp.ourSpec}%`}{" "}
                                              while competitors average{" "}
                                              {selectedOpp.specMetric.includes("Salt")
                                                ? `${selectedOpp.marketSpec}g`
                                                : `${selectedOpp.marketSpec}%`}{" "}
                                              (we are{" "}
                                              <strong>above market spec</strong>).
                                            </p>
                                            <p className="mt-2">
                                              Potential saving:{" "}
                                              <strong>
                                                {"\u00A3"}
                                                {(selectedOpp.savingGBP / 1000).toFixed(1)}
                                                k/year
                                              </strong>{" "}
                                              if we align with market spec.
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p>
                                              <strong>{selectedOpp.specMetric}:</strong>{" "}
                                              Our product has{" "}
                                              {selectedOpp.specMetric.includes("Salt")
                                                ? `${selectedOpp.ourSpec}g`
                                                : `${selectedOpp.ourSpec}%`}{" "}
                                              while competitors average{" "}
                                              {selectedOpp.specMetric.includes("Salt")
                                                ? `${selectedOpp.marketSpec}g`
                                                : `${selectedOpp.marketSpec}%`}{" "}
                                              (we are{" "}
                                              <strong>below market spec</strong>).
                                            </p>
                                            <p className="mt-2">
                                              This is a{" "}
                                              <strong>quality consideration</strong> for
                                              tender negotiations. Consider whether to
                                              request spec alignment from suppliers or
                                              accept the difference.
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
