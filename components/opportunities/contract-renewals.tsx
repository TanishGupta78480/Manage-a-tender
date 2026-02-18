"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, Building2, ChevronDown, ShieldAlert, Sparkles } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"


interface ContractRenewal {
  skuId: string
  skuName: string
  subcategory: string
  supplierId: string
  supplierName: string
  contractEndDate: string
  daysUntilExpiry: number
  annualValue: number
  contractDurationYears: number
  urgency: "critical" | "high" | "warning" | "normal"
}

interface CalendarContract {
  skuId: string
  skuName: string
  subcategory: string
  supplierId: string
  supplierName: string
  contractStartDate: string
  contractEndDate: string
  daysUntilExpiry: number
  annualValue: number
  contractDurationYears: number
  isExpiringSoon: boolean
  isExpired: boolean
}

interface SubcategoryGroup {
  subcategory: string
  opportunities: ContractRenewal[]
  totalValue: number
  skuCount: number
  criticalCount: number
  highCount: number
  warningCount: number
}

interface ContractRenewalsProps {
  opportunities: ContractRenewal[]
  allContracts: CalendarContract[]
  selectedSkus?: Set<string>
  onSkuToggle?: (skuId: string) => void
  onSkusToggleAll?: (skuIds: string[]) => void
  subcategoryFilter?: string[]
}

export function ContractRenewals({
  opportunities,
  selectedSkus = new Set(),
  onSkuToggle,
  onSkusToggleAll,
  subcategoryFilter,
}: ContractRenewalsProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedSku, setSelectedSku] = useState<string | null>(null)


  const groupedOpportunities = opportunities.reduce<Record<string, SubcategoryGroup>>((acc, opp) => {
    const subcategory = opp.subcategory || "Unknown"

    if (!acc[subcategory]) {
      acc[subcategory] = {
        subcategory,
        opportunities: [],
        totalValue: 0,
        skuCount: 0,
        criticalCount: 0,
        highCount: 0,
        warningCount: 0,
      }
    }
    acc[subcategory].opportunities.push(opp)
    acc[subcategory].totalValue += opp.annualValue
    acc[subcategory].skuCount += 1
    if (opp.urgency === "critical") acc[subcategory].criticalCount += 1
    if (opp.urgency === "high") acc[subcategory].highCount += 1
    if (opp.urgency === "warning") acc[subcategory].warningCount += 1
    return acc
  }, {})

  const subcategoryGroups = Object.values(groupedOpportunities)
    .filter((g) => {
      if (subcategoryFilter && subcategoryFilter.length > 0 && !subcategoryFilter.includes(g.subcategory)) return false
      return true
    })
    .sort((a, b) => {
    if (a.criticalCount !== b.criticalCount) return b.criticalCount - a.criticalCount
    if (a.highCount !== b.highCount) return b.highCount - a.highCount
    if (a.warningCount !== b.warningCount) return b.warningCount - a.warningCount
    return b.totalValue - a.totalValue
  })

  const selectedGroupOpps = selectedSubcategory
    ? groupedOpportunities[selectedSubcategory]?.opportunities || []
    : []

  const selectedOpp = selectedSku ? opportunities.find((o) => o.skuId === selectedSku) : null

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `\u00A3${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `\u00A3${(value / 1000).toFixed(0)}k`
    return `\u00A3${value.toFixed(0)}`
  }

  const getUrgencyBadge = (urgency: string, daysLeft?: number) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical{daysLeft !== undefined ? ` (${daysLeft}d)` : ""}
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-300">
            <ShieldAlert className="h-3 w-3 mr-1" />
            High{daysLeft !== undefined ? ` (${daysLeft}d)` : ""}
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Warning{daysLeft !== undefined ? ` (${daysLeft}d)` : ""}
          </Badge>
        )
      default:
        return <Badge variant="secondary">Normal</Badge>
    }
  }

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null)
      setSelectedSku(null)
    } else {
      setSelectedSubcategory(subcategory)
      setSelectedSku(null)
    }
  }

  const getUrgencySummary = (group: SubcategoryGroup) => {
    const parts: string[] = []
    if (group.criticalCount > 0) parts.push(`${group.criticalCount} critical`)
    if (group.highCount > 0) parts.push(`${group.highCount} high`)
    if (group.warningCount > 0) parts.push(`${group.warningCount} warning`)
    return parts.length > 0 ? parts.join(", ") : ""
  }

  return (
    <div className="space-y-6">
      {opportunities.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No contracts expiring in the next 150 days</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-300 pt-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
          <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-100 pt-6 rounded-t-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <AlertTriangle className="h-5 w-5 text-gray-700" />
                  Contract Renewal Opportunities
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1.5">
                  {opportunities.length} contract{opportunities.length !== 1 ? "s" : ""} expiring within 150 days
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="flex items-center justify-end px-4 pb-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px] text-right">Annual Value at Risk</span>
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
                        {group.skuCount} contract{group.skuCount !== 1 ? "s" : ""} expiring soon
                        {(() => {
                          const summary = getUrgencySummary(group)
                          return summary ? (
                            <span className="ml-1">({summary})</span>
                          ) : null
                        })()}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-foreground min-w-[80px] text-right">{formatCurrency(group.totalValue)}</p>
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
                            <TableHead className="text-center">Supplier</TableHead>
                            <TableHead className="text-center">Urgency</TableHead>
                            <TableHead className="text-center">Days Left</TableHead>
                            <TableHead className="text-center">Contract End</TableHead>
                            <TableHead className="text-center">Annual Value</TableHead>
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
                              <TableCell className="text-center">
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  <Building2 className="h-3 w-3" />
                                  {opp.supplierName}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">{getUrgencyBadge(opp.urgency)}</TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={
                                    opp.urgency === "critical"
                                      ? "text-red-600 font-medium"
                                      : opp.urgency === "high"
                                        ? "text-orange-600 font-medium"
                                        : ""
                                  }
                                >
                                  {opp.daysUntilExpiry} days
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {new Date(opp.contractEndDate).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {formatCurrency(opp.annualValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Selected SKU detail */}
                      {selectedOpp && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-start gap-3">
                              <Sparkles className="h-5 w-5 mt-0.5 text-amber-600" />
                              <div className="flex-1">
                                <p className="font-medium text-amber-900">
                                  Why does this need attention?
                                </p>
                                <p className="text-sm mt-1 text-amber-800">
                                  The contract for <strong>{selectedOpp.skuName}</strong> with{" "}
                                  <strong>{selectedOpp.supplierName}</strong> expires on{" "}
                                  <strong>
                                    {new Date(selectedOpp.contractEndDate).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </strong>{" "}
                                  ({selectedOpp.daysUntilExpiry} days away). This represents{" "}
                                  <strong>{formatCurrency(selectedOpp.annualValue)}</strong> in annual value.
                                </p>
                                <p className="text-sm mt-2 text-amber-800">
                                  {selectedOpp.urgency === "critical"
                                    ? "Immediate action required - insufficient time for a full tender process. Consider a direct negotiation or emergency extension."
                                    : selectedOpp.urgency === "high"
                                      ? "Urgent attention needed - limited time remaining to negotiate or tender. Begin supplier outreach immediately to avoid supply disruption."
                                      : "Consider launching a tender to secure competitive pricing before renewal. There is still time to run a structured process."}
                                </p>
                                <p className="text-xs font-medium text-amber-700 mt-3 pt-2 border-t border-amber-200">
                                  Recommended action: {selectedOpp.urgency === "critical" ? "Escalate to procurement lead and initiate emergency review." : "Add to upcoming tender pipeline for competitive re-pricing."}
                                </p>
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
      )}
    </div>
  )
}
