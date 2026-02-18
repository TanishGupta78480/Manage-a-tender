"use client"
import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, TrendingUp, Scale, BarChart3, Calendar, ChevronDown } from "lucide-react"
import Link from "next/link"
import { InputPriceAnalysis } from "@/components/opportunities/input-price-analysis"
import { SpecOpportunities } from "@/components/opportunities/spec-opportunities"
import { PriceMarginOpportunities } from "@/components/opportunities/price-margin-opportunities"
import { ContractRenewals } from "@/components/opportunities/contract-renewals"
import { WorkflowStepIndicator } from "@/components/workflow-step"
import {
  getInputPriceOpportunities,
  getSpecOpportunities,
  getPriceMarginOpportunities,
  getContractRenewalOpportunities,
  getAllContractsForCalendar,
  getSkuById,
  subCategories,
} from "@/lib/data"

const TAB_ITEMS = [
  { value: "input-price", label: "Input Cost", icon: TrendingUp },
  { value: "spec", label: "Spec Difference", icon: Scale },
  { value: "price-margin", label: "Commercial Performance", icon: BarChart3 },
  { value: "contract-renewals", label: "Expiring Contracts", icon: Calendar },
] as const

function AnimatedTabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (v: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return
    const activeEl = containerRef.current.querySelector(`[data-tab-value="${activeTab}"]`) as HTMLElement | null
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      setIndicator({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      })
    }
  }, [activeTab])

  useEffect(() => {
    // Small delay on mount to ensure DOM is fully laid out before measuring
    const timer = setTimeout(updateIndicator, 50)
    window.addEventListener("resize", updateIndicator)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateIndicator)
    }
  }, [updateIndicator])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center h-11 p-1 rounded-lg bg-indigo-50 border border-indigo-200 w-full lg:w-auto"
    >
      {/* Sliding pill indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-md bg-[#3b5bdb] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.value
        const Icon = tab.icon
        return (
          <button
            key={tab.value}
            data-tab-value={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isActive
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function OpportunitiesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("input-price")
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set())
  const [excludedSubcategories, setExcludedSubcategories] = useState<Set<string>>(new Set())
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewSkus, setReviewSkus] = useState<Set<string>>(new Set())
  const [reviewSnapshot, setReviewSnapshot] = useState<string[]>([])

  // Division & Category from homepage (via URL params), with defaults
  const division = searchParams.get("division") || "Chilled Foods"
  const category = searchParams.get("category") || "Bakery"

  // Get subcategories for the selected category
  const availableSubcategories = useMemo(() => {
    return subCategories.filter((sc) => sc.category === category).map((sc) => sc.name)
  }, [category])

  const inputOpps = getInputPriceOpportunities()
  const specOpps = getSpecOpportunities()
  const priceMarginOpps = getPriceMarginOpportunities()
  const contractRenewalOpps = getContractRenewalOpportunities()
  const allContracts = getAllContractsForCalendar()

  // Derive selected subcategories from selected SKUs
  const selectedSubcategories = useMemo(() => {
    const subs = new Set<string>()
    selectedSkus.forEach((skuId) => {
      const sku = getSkuById(skuId)
      if (sku?.subcategory) subs.add(sku.subcategory)
      // Also check contract renewals which use subcategory directly
      const contractOpp = contractRenewalOpps.find((o) => o.skuId === skuId)
      if (contractOpp?.subcategory) subs.add(contractOpp.subcategory)
      const specOpp = specOpps.find((o) => o.skuId === skuId)
      if (specOpp?.subcategory) subs.add(specOpp.subcategory)
    })
    return subs
  }, [selectedSkus, contractRenewalOpps, specOpps])

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab")
    if (tabFromUrl && ["input-price", "spec", "price-margin", "contract-renewals"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleSkuToggle = (skuId: string) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev)
      if (next.has(skuId)) next.delete(skuId)
      else next.add(skuId)
      return next
    })
  }

  const handleSkusToggleAll = (skuIds: string[]) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev)
      const allSelected = skuIds.every((id) => next.has(id))
      if (allSelected) {
        skuIds.forEach((id) => next.delete(id))
      } else {
        skuIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleAddSuppliers = () => {
    // Snapshot the selected SKU IDs so the list stays stable even when unticked
    const snapshot = Array.from(selectedSkus)
    setReviewSnapshot(snapshot)
    setReviewSkus(new Set(selectedSkus))
    setShowReviewModal(true)
  }

  const handleConfirmAndAddSuppliers = () => {
    // Apply reviewSkus back as the final selection
    setSelectedSkus(new Set(reviewSkus))
    setShowReviewModal(false)
    if (reviewSkus.size > 0) {
      // Derive subcategory from first SKU for the suppliers page
      const firstSkuId = Array.from(reviewSkus)[0]
      const firstSku = getSkuById(firstSkuId)
      router.push(`/suppliers?category=${encodeURIComponent(firstSku?.subcategory || "")}`)
    } else {
      router.push("/suppliers")
    }
  }

  const handleReviewSkuToggle = (skuId: string) => {
    setReviewSkus((prev) => {
      const next = new Set(prev)
      if (next.has(skuId)) next.delete(skuId)
      else next.add(skuId)
      return next
    })
  }

  // Build review data from the snapshot so the list is stable (unticked items stay visible)
  const reviewGroups = useMemo(() => {
    const groups: Record<string, { subcategory: string; skus: { skuId: string; skuName: string; potentialSavings: number }[] }> = {}

    reviewSnapshot.forEach((skuId) => {
      const sku = getSkuById(skuId)
      if (!sku) return
      const sub = sku.subcategory

      if (!groups[sub]) groups[sub] = { subcategory: sub, skus: [] }

      // Find savings from any opportunity source
      const inputOpp = inputOpps.find((o) => o.skuId === skuId)
      const specOpp = specOpps.find((o) => o.skuId === skuId)
      const pmOpp = priceMarginOpps.find((o) => o.skuId === skuId)
      const contractOpp = contractRenewalOpps.find((o) => o.skuId === skuId)
      const savings = inputOpp?.opportunityValue || specOpp?.specPotentialSavingGBP || pmOpp?.opportunityValue || contractOpp?.annualValue || 0

      groups[sub].skus.push({ skuId, skuName: sku.name, potentialSavings: savings })
    })

    return Object.values(groups).sort((a, b) => a.subcategory.localeCompare(b.subcategory))
  }, [reviewSnapshot, inputOpps, specOpps, priceMarginOpps, contractRenewalOpps])

  return (
    <>
      <div className="max-w-[76rem] mx-auto px-6 pt-6">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:bg-gray-700 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Prioritise Opportunities</h1>
              <p className="text-sm text-muted-foreground">{"Identify the SKUs having savings potential"}</p>
            </div>
          </div>

          <div className="flex items-stretch gap-4">
            <div className="flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Division</span>
              <span className="text-sm font-medium text-foreground mt-1">{division}</span>
            </div>
            <div className="w-px bg-border self-stretch" />
            <div className="flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Category</span>
              <span className="text-sm font-medium text-foreground mt-1">{category}</span>
            </div>
            <div className="w-px bg-border self-stretch" />
            <div className="flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subcategory</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-[200px] text-sm mt-1 justify-between font-normal">
                    <span className="truncate">
                      {excludedSubcategories.size === 0
                        ? "All Subcategories"
                        : excludedSubcategories.size === availableSubcategories.length
                          ? "None selected"
                          : `${availableSubcategories.length - excludedSubcategories.size} of ${availableSubcategories.length} selected`}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[220px] p-2">
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
                      onClick={() => {
                        if (excludedSubcategories.size === 0) {
                          // All are ticked -> untick all
                          setExcludedSubcategories(new Set(availableSubcategories))
                        } else {
                          // Some/all are unticked -> tick all
                          setExcludedSubcategories(new Set())
                        }
                      }}
                    >
                      <Checkbox
                        checked={excludedSubcategories.size === 0}
                        className="h-4 w-4 pointer-events-none data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                        tabIndex={-1}
                      />
                      <span className={excludedSubcategories.size === 0 ? "font-medium" : ""}>All Subcategories</span>
                    </button>
                    <div className="h-px bg-border my-1" />
                    {availableSubcategories.map((sc) => {
                      const isChecked = !excludedSubcategories.has(sc)
                      return (
                        <button
                          key={sc}
                          type="button"
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
                          onClick={() => {
                            setExcludedSubcategories((prev) => {
                              const next = new Set(prev)
                              if (next.has(sc)) {
                                next.delete(sc) // re-tick it
                              } else {
                                next.add(sc) // untick it
                              }
                              return next
                            })
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            className="h-4 w-4 pointer-events-none data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                            tabIndex={-1}
                          />
                          <span className={isChecked ? "font-medium" : ""}>{sc}</span>
                        </button>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[76rem] mx-auto px-6 pb-6">
        <WorkflowStepIndicator
          currentStep={1}
          nextStepLabel="Select Suppliers"
          nextStepHref="/suppliers"
          onNextClick={handleAddSuppliers}
          selectedCount={selectedSkus.size}
        />

        {selectedSkus.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50/20 border border-blue-400 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Selected for tender:</span>
              {Array.from(selectedSubcategories).map((sub) => (
                <span key={sub} className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                  {sub}
                </span>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSkus(new Set())}
              className="text-gray-600 hover:bg-gray-700 hover:text-white"
            >
              Clear all
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <AnimatedTabBar activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="input-price">
            <InputPriceAnalysis
              opportunities={inputOpps}
              selectedSkus={selectedSkus}
              onSkuToggle={handleSkuToggle}
              onSkusToggleAll={handleSkusToggleAll}
              subcategoryFilter={excludedSubcategories.size === 0 ? undefined : availableSubcategories.filter((sc) => !excludedSubcategories.has(sc))}
            />
          </TabsContent>

          <TabsContent value="spec">
            <SpecOpportunities
              opportunities={specOpps}
              selectedSkus={selectedSkus}
              onSkuToggle={handleSkuToggle}
              onSkusToggleAll={handleSkusToggleAll}
              subcategoryFilter={excludedSubcategories.size === 0 ? undefined : availableSubcategories.filter((sc) => !excludedSubcategories.has(sc))}
            />
          </TabsContent>

          <TabsContent value="price-margin">
            <PriceMarginOpportunities
              opportunities={priceMarginOpps}
              selectedSkus={selectedSkus}
              onSkuToggle={handleSkuToggle}
              onSkusToggleAll={handleSkusToggleAll}
              subcategoryFilter={excludedSubcategories.size === 0 ? undefined : availableSubcategories.filter((sc) => !excludedSubcategories.has(sc))}
            />
          </TabsContent>

          <TabsContent value="contract-renewals">
            <ContractRenewals
              opportunities={contractRenewalOpps}
              allContracts={allContracts}
              selectedSkus={selectedSkus}
              onSkuToggle={handleSkuToggle}
              onSkusToggleAll={handleSkusToggleAll}
              subcategoryFilter={excludedSubcategories.size === 0 ? undefined : availableSubcategories.filter((sc) => !excludedSubcategories.has(sc))}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Review SKU Selection Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle className="text-lg font-semibold">Review SKU Selection</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
            {reviewGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No SKUs selected. Go back and select SKUs to proceed.</p>
            ) : (
              reviewGroups.map((group) => (
                <div key={group.subcategory}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{group.subcategory}</h3>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10"></TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Potential Savings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.skus.map((sku) => (
                          <TableRow key={sku.skuId}>
                            <TableCell>
                              <Checkbox
                                checked={reviewSkus.has(sku.skuId)}
                                onCheckedChange={() => handleReviewSkuToggle(sku.skuId)}
                                className="h-4 w-4 data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-sm">{sku.skuName}</TableCell>
                            <TableCell className="text-right text-sm">
                              {sku.potentialSavings > 0 ? `\u00A3${(sku.potentialSavings / 1000).toFixed(1)}k` : "\u2014"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="shrink-0 border-t px-6 py-4 flex items-center justify-between bg-muted/30">
            <Button
              variant="outline"
              onClick={() => {
                // Sync unticked SKUs back to the card selections
                setSelectedSkus(new Set(reviewSkus))
                setShowReviewModal(false)
              }}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit Selection
            </Button>
            <Button
              onClick={handleConfirmAndAddSuppliers}
              disabled={reviewSkus.size === 0}
              className="gap-2 bg-[#3b5bdb] hover:bg-[#364fc7] text-white"
            >
              {"Confirm & Select Suppliers"}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <OpportunitiesContent />
      </Suspense>
    </div>
  )
}
