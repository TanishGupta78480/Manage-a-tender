"use client"

import type React from "react"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  BarChart3,
  History,
  Package,
  Users,
  FileText,
  TrendingDown,
  Download,
  PoundSterling,
  Upload,
  ClipboardList,
  ChevronDown,
  Calendar,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"
import { tenders, suppliers, skus, offers, type Offer, calculateSupplierScore } from "@/lib/data"
import { WorkflowStepIndicator } from "@/components/workflow-step"

import { OfferComparison } from "@/components/analyse/offer-comparison"
import { AddOfferModal } from "@/components/analyse/add-offer-modal"
import { GenerateContractModal } from "@/components/analyse/generate-contract-modal"

const ANALYSE_TAB_ITEMS = [
  { value: "comparison", label: "Offer Comparison", icon: BarChart3 },
  { value: "evolution", label: "Round Evolution", icon: History },
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
      <div
        className="absolute top-1 bottom-1 rounded-md bg-[#3b5bdb] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {ANALYSE_TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.value
        const Icon = tab.icon
        return (
          <button
            key={tab.value}
            data-tab-value={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
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

// Demo offer data with investments for the savings view
interface ExtendedOffer extends Offer {
  fixedInvestment?: number
  promotionalInvestment?: number
  otherInvestment?: number
}

interface RoundData {
  round: number
  totalInvestment: number
  changeFromPrior: number
  changePercent: number
}

interface SupplierRoundEvolution {
  supplierId: string
  supplierName: string
  rounds: RoundData[]
}

export default function AnalyseOfferPage() {
  const [activeTab, setActiveTab] = useState("comparison")
  const [contractSelection, setContractSelection] = useState<{
    supplierId: string; supplierName: string; totalSaving: number
    unitPriceDDP: number; unitPriceEXW: number; annualSpend: number
    fixedInvestment: number; promotionalInvestment: number; otherInvestment: number
    forecastedVolume: number; paymentTerms: string; deliveryFrequency: string
    skuDetails: { skuName: string; costPrice: number; volume: number; annualSpend: number; saving: number }[]
  } | null>(null)
  const [selectedTenderId, setSelectedTenderId] = useState<string>("")
  const [localOffers, setLocalOffers] = useState<ExtendedOffer[]>(
    offers.map((o, i) => ({
      ...o,
      fixedInvestment: o.additionalFunding > 0 ? Math.round(o.additionalFunding * 0.55) : 1500 + (i % 5) * 800,
      promotionalInvestment: o.additionalFunding > 0 ? Math.round(o.additionalFunding * 0.30) : 800 + (i % 4) * 400,
      otherInvestment: o.additionalFunding > 0 ? Math.round(o.additionalFunding * 0.15) : 200 + (i % 3) * 150,
    })),
  )
  const [showAddOfferModal, setShowAddOfferModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  // Get open and evaluating tenders
  const openTenders = tenders.filter((t) => t.status === "open" || t.status === "evaluating")

  const selectedTender = tenders.find((t) => t.id === selectedTenderId)

  // Get all offers for selected tender
  const tenderOffers = useMemo(() => {
    return localOffers.filter((o) => o.tenderId === selectedTenderId)
  }, [localOffers, selectedTenderId])

  // Get SKUs for the tender
  const tenderSkus = useMemo(() => {
    if (!selectedTender) return []
    return skus.filter((s) => selectedTender.skuIds.includes(s.id))
  }, [selectedTender])

  // Get suppliers for the tender
  const tenderSuppliers = useMemo(() => {
    if (!selectedTender) return []
    return suppliers.filter((s) => selectedTender.supplierIds.includes(s.id))
  }, [selectedTender])

  // Get latest round offers per supplier per SKU
  const getLatestOfferForSupplierSku = (supplierId: string, skuId: string) => {
    const supplierSkuOffers = tenderOffers.filter((o) => o.supplierId === supplierId && o.skuId === skuId)
    if (supplierSkuOffers.length === 0) return null
    return supplierSkuOffers.reduce((latest, curr) => (curr.round > latest.round ? curr : latest))
  }

  // Calculate savings data for the savings tab
  const savingsData = useMemo(() => {
    const data: {
      supplierId: string
      supplierName: string
      skuSavings: Record<string, { saving: number; newPrice: number; oldPrice: number }>
      fixedInvestment: number
      promotionalInvestment: number
      otherInvestment: number
      totalCostSaving: number
      totalInvestment: number
      totalSaving: number
    }[] = []

    tenderSuppliers.forEach((supplier) => {
      const supplierData = {
        supplierId: supplier.id,
        supplierName: supplier.name,
        skuSavings: {} as Record<string, { saving: number; newPrice: number; oldPrice: number }>,
        fixedInvestment: 0,
        promotionalInvestment: 0,
        otherInvestment: 0,
        totalCostSaving: 0,
        totalInvestment: 0,
        totalSaving: 0,
      }

      tenderSkus.forEach((sku) => {
        const offer = getLatestOfferForSupplierSku(supplier.id, sku.id)
        if (offer) {
          const annualSaving = (sku.currentCostPrice - offer.costPrice) * sku.weeklyVolume * 52
          supplierData.skuSavings[sku.id] = {
            saving: annualSaving,
            newPrice: offer.costPrice,
            oldPrice: sku.currentCostPrice,
          }
          supplierData.totalCostSaving += annualSaving
          // additionalFunding is the real field; split into investment buckets for display
          const funding = offer.additionalFunding || 0
          supplierData.fixedInvestment += Math.round(funding * 0.5)
          supplierData.promotionalInvestment += Math.round(funding * 0.35)
          supplierData.otherInvestment += Math.round(funding * 0.15)
        }
      })

      supplierData.totalInvestment =
        supplierData.fixedInvestment + supplierData.promotionalInvestment + supplierData.otherInvestment
      supplierData.totalSaving = supplierData.totalCostSaving + supplierData.totalInvestment

      data.push(supplierData)
    })

    return data.sort((a, b) => b.totalSaving - a.totalSaving)
  }, [localOffers, selectedTenderId, tenderSkus, tenderSuppliers])

  const maxRounds = 5

  const roundEvolutionData = useMemo((): (SupplierRoundEvolution & { isCurrent: boolean; hasOffer: boolean })[] => {
    return tenderSuppliers.map((supplier, sIdx) => {
      const isCurrent = sIdx === 0
      const supplierOffers = tenderOffers.filter((o) => o.supplierId === supplier.id)
      const hasOffer = isCurrent ? supplierOffers.length > 0 : true

      // Current supplier with no offer gets empty rounds
      if (isCurrent && !hasOffer) {
        return {
          supplierId: supplier.id,
          supplierName: supplier.name,
          rounds: [],
          isCurrent,
          hasOffer,
        }
      }

      // Each supplier has a different number of rounds (2-5)
      const numRounds = Math.min(maxRounds, 2 + (sIdx % 4))
      const baseValue = 50000 + sIdx * 8000
      const rounds: RoundData[] = []

      for (let r = 1; r <= numRounds; r++) {
        const factor = 1 - r * (0.04 + (sIdx % 3) * 0.015) + (r === 3 ? -0.02 : 0)
        const value = Math.round(baseValue * Math.max(factor, 0.7))
        const prev = rounds.length > 0 ? rounds[rounds.length - 1].totalInvestment : value
        const change = value - prev
        const pct = prev !== 0 ? (change / prev) * 100 : 0
        rounds.push({
          round: r,
          totalInvestment: value,
          changeFromPrior: change,
          changePercent: r === 1 ? 0 : pct,
        })
      }
      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        rounds,
        isCurrent,
        hasOffer,
      }
    })
  }, [tenderSuppliers, tenderOffers])

  // Best total saving - use same formula as comparison cards (baselineSpend - annualSpend)
  const bestTotalSaving = useMemo(() => {
    if (tenderSuppliers.length === 0 || tenderSkus.length === 0) return null
    const baselineSpend = tenderSkus.reduce((sum, sku) => sum + sku.currentCostPrice * sku.weeklyVolume * 52, 0)
    let best: { supplierName: string; totalSaving: number } | null = null
    tenderSuppliers.forEach((supplier) => {
      const supplierOffers = tenderOffers.filter((o) => o.supplierId === supplier.id)
      // Skip suppliers with no offers at all
      if (supplierOffers.length === 0) return
      let annualSpend = 0
      tenderSkus.forEach((sku) => {
        // Get latest round offer for this SKU
        const skuOffers = supplierOffers.filter((o) => o.skuId === sku.id)
        const latestOffer = skuOffers.length > 0
          ? skuOffers.reduce((a, b) => (b.round > a.round ? b : a))
          : null
        // Use offer price if available, otherwise use current baseline (no saving on that SKU)
        const price = latestOffer ? latestOffer.costPrice : sku.currentCostPrice
        annualSpend += price * sku.weeklyVolume * 52
      })
      // Include supplier funding in total saving (additionalFunding is the per-SKU annual funding field)
      const latestRoundOffers = tenderSkus.map((sku) => {
        const skuOffers = supplierOffers.filter((o) => o.skuId === sku.id)
        return skuOffers.length > 0 ? skuOffers.reduce((a, b) => (b.round > a.round ? b : a)) : null
      }).filter(Boolean) as typeof supplierOffers
      const totalFunding = latestRoundOffers.reduce((sum, o) => sum + (o.additionalFunding || 0), 0)
      const costSaving = baselineSpend - annualSpend
      const saving = costSaving + totalFunding
      if (!best || saving > best.totalSaving) {
        best = { supplierName: supplier.name, totalSaving: saving }
      }
    })
    return best
  }, [tenderSuppliers, tenderSkus, tenderOffers])

  const handleOfferSubmit = (data: { qualification: any; skus: any[] }) => {
    // In a real app, this would process and store the submitted offer data
    // For now, we add dummy offers based on the submitted SKUs
    const newOffers = data.skus.map((sku) => {
      const randomSupplier = tenderSuppliers[Math.floor(Math.random() * tenderSuppliers.length)]
      const randomSku = tenderSkus[Math.floor(Math.random() * tenderSkus.length)]
      return {
        id: `OFF${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        tenderId: selectedTenderId,
        supplierId: randomSupplier?.id || "",
        skuId: randomSku?.id || "",
        round: 1,
        submittedDate: new Date().toISOString().split("T")[0],
        costPrice: Number(sku.unitPriceDDP) || 1.0,
        costPriceSaving: 5,
        additionalFunding: 0,
        promotionChange: "same" as const,
        promotionWeeks: 0,
        deliveryTerms: "delivered" as const,
        deliveryFrequency: sku.deliveryFrequency || "Weekly",
        paymentDays: 30,
        specSame: true,
        supplierAttractivenessScore: 75,
        overallScore: 70,
        fixedInvestment: 0,
        promotionalInvestment: 0,
        otherInvestment: 0,
      }
    })
    setLocalOffers([...localOffers, ...newOffers])
  }

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `£${(value / 1000).toFixed(1)}k`
    }
    return `£${value.toLocaleString()}`
  }

  const getSavingColor = (value: number) => {
    if (value > 0) return "text-green-600 bg-green-50"
    if (value < 0) return "text-red-600 bg-red-50"
    return "text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[76rem] mx-auto px-6 pt-6">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/tender">
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:bg-gray-700 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to Launch a Tender
              </Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Analyse Offers</h1>
              <p className="text-sm text-muted-foreground">Review and compare supplier offers for open tenders</p>
            </div>
          </div>

          <div className="flex items-stretch gap-4">
            <div className="flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Division</span>
              <span className="text-sm font-medium text-foreground mt-1">Chilled Foods</span>
            </div>
            <div className="w-px bg-border self-stretch" />
            <div className="flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Category</span>
              <span className="text-sm font-medium text-foreground mt-1">Bakery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[76rem] mx-auto px-6 pb-6">
        <WorkflowStepIndicator currentStep={5} nextStepLabel="Approve & Close" nextStepHref="/finalise" />

        {/* Tender Selection */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Select Tender to Analyse</Label>
          <Select value={selectedTenderId} onValueChange={setSelectedTenderId}>
            <SelectTrigger className="w-full md:w-96 mt-1.5 text-sm">
              <SelectValue placeholder="Choose an open tender..." />
            </SelectTrigger>
            <SelectContent>
              {openTenders.map((tender) => (
                <SelectItem key={tender.id} value={tender.id}>
                  <div className="flex items-center gap-2">
                    <span>{tender.name}</span>
                    <Badge
                      variant="outline"
                      className={
                        tender.status === "open"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {tender.status === "open" ? "Open" : "Evaluating"}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTender && (
          <>
            {/* Tender Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1.6fr] gap-4 mb-6">
              <Card className="p-4 shadow-xl transition-all duration-200 ease-out hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">SKUs in Tender</p>
                    <p className="text-2xl font-semibold">{tenderSkus.length}</p>
                  </div>
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                    <Package className="h-5 w-5 text-[var(--primary)] stroke-[2.5]" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 shadow-xl transition-all duration-200 ease-out hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Suppliers Invited</p>
                    <p className="text-2xl font-semibold">{tenderSuppliers.length}</p>
                  </div>
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                    <Users className="h-5 w-5 text-[var(--primary)] stroke-[2.5]" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 shadow-xl transition-all duration-200 ease-out hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Offers Received</p>
                    <p className="text-2xl font-semibold">{new Set(tenderOffers.map((o) => o.supplierId)).size}</p>
                  </div>
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                    <FileText className="h-5 w-5 text-[var(--primary)] stroke-[2.5]" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 shadow-xl transition-all duration-200 ease-out hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Best Total Saving</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-semibold text-emerald-700">
                        {bestTotalSaving ? formatCurrency(bestTotalSaving.totalSaving) : "\u2014"}
                      </p>
                      {bestTotalSaving && (
                        <span className="text-xs font-medium text-emerald-600">{bestTotalSaving.supplierName}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <PoundSterling className="h-5 w-5 text-emerald-600 stroke-[2.5]" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Selected supplier banner -- above tabs */}
            {contractSelection && (
              <div className="mb-4 border border-blue-200 bg-blue-50/60 rounded-lg px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b5bdb]">
                    <ClipboardCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{contractSelection.supplierName} selected for contract</p>
                    <p className="text-xs text-gray-600">
                      Ready to create final contract with estimated savings of{" "}
                      <span className="font-bold text-[#3b5bdb]">
                        {"\u00A3"}{Math.abs(contractSelection.totalSaving).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="gap-1.5 bg-[#3b5bdb] hover:bg-[#364fc7] text-white font-semibold text-xs px-4 shadow-sm"
                  onClick={() => setShowContractModal(true)}
                >
                  Generate Contract Docs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Main Content Tabs - New 3-tab structure */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <AnimatedTabBar activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="flex items-center gap-2">
                  {activeTab === "evolution" && (
                    <Button
                      variant="outline"
                      className="gap-1.5 text-xs font-semibold border-2 border-gray-200"
                      onClick={() => {
                        const headers = ["Supplier", ...Array.from({ length: maxRounds }, (_, i) => `Round ${i + 1}`)]
                        const rows = roundEvolutionData.map((s) => {
                          const cells = [s.supplierName]
                          for (let r = 1; r <= maxRounds; r++) {
                            const rd = s.rounds.find((d) => d.round === r)
                            cells.push(rd ? `£${rd.totalInvestment.toLocaleString()}` : "--")
                          }
                          return cells
                        })
                        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
                        const blob = new Blob([csv], { type: "text/csv" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "round-evolution.csv"
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export as Excel
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-2 bg-[#3b5bdb] hover:bg-[#364fc7]">
                        <Plus className="h-4 w-4" />
                        Add Offer
                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer [&>svg]:text-muted-foreground [&:hover>svg]:text-white [&:focus>svg]:text-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer [&>svg]:text-muted-foreground [&:hover>svg]:text-white [&:focus>svg]:text-white"
                        onClick={() => setShowAddOfferModal(true)}
                      >
                        <ClipboardList className="h-4 w-4" />
                        Add Manually
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // TODO: parse uploaded file and add offers
                        alert(`File "${file.name}" uploaded successfully. Parsing will be implemented.`)
                        e.target.value = ""
                      }
                    }}
                  />
                </div>
              </div>

              {/* Offer Comparison Tab */}
              <TabsContent value="comparison">
                <OfferComparison
                  suppliers={tenderSuppliers}
                  skus={tenderSkus}
                  supplierRounds={Object.fromEntries(
                    roundEvolutionData.map((s) => [s.supplierId, s.rounds.length > 0 ? Math.max(...s.rounds.map((r) => r.round)) : 0])
                  )}
                  tenderOffers={tenderOffers.map((o) => ({
                    supplierId: o.supplierId,
                    skuId: o.skuId,
                    costPrice: o.costPrice,
                    round: o.round,
                    deliveryFrequency: o.deliveryFrequency,
                    deliveryTerms: o.deliveryTerms,
                    paymentDays: o.paymentDays,
                    specSame: o.specSame,
                    promotionChange: o.promotionChange,
                    promotionWeeks: o.promotionWeeks,
                    additionalFunding: o.additionalFunding,
                    fixedInvestment: o.fixedInvestment,
                    promotionalInvestment: o.promotionalInvestment,
                    otherInvestment: o.otherInvestment,
                  }))}
                  onContractSelect={setContractSelection}
                />
              </TabsContent>

              {/* Round Evolution Tab */}
              <TabsContent value="evolution">
                <Card className="border-gray-300 p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
                  <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-100 pt-6 rounded-t-lg">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                        <History className="h-5 w-5 text-gray-700" />
                        Round Evolution
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Offer value progression across negotiation rounds
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 bg-white">
                  {roundEvolutionData.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No round evolution data available yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b-2 border-gray-200">
                            <TableHead className="min-w-[220px] text-sm font-bold text-gray-700 pl-6">
                              Supplier
                            </TableHead>
                            {Array.from({ length: maxRounds }, (_, i) => (
                              <TableHead key={i} className="text-center min-w-[150px] text-sm font-bold text-gray-700">
                                Round {i + 1}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roundEvolutionData.map((supplier) => {
                            const isNotSelected = supplier.isCurrent && !supplier.hasOffer

                            // Find the best round (lowest totalInvestment = best offer for the buyer)
                            const bestRoundIdx = supplier.rounds.length > 0
                              ? supplier.rounds.reduce(
                                  (bestIdx, r, rIdx) => (r.totalInvestment < supplier.rounds[bestIdx].totalInvestment ? rIdx : bestIdx),
                                  0,
                                )
                              : -1

                            return (
                              <TableRow
                                key={supplier.supplierId}
                                className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${
                                  supplier.isCurrent ? "bg-amber-50/30" : ""
                                }`}
                              >
                                {/* Supplier name cell */}
                                <TableCell className="pl-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-sm text-gray-900">{supplier.supplierName}</span>
                                    {supplier.isCurrent && (
                                      <Badge className="w-fit text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2">
                                        Current
                                      </Badge>
                                    )}
                                    {isNotSelected ? (
                                      <span className="text-[11px] font-medium text-gray-400 italic">
                                        Tender Not Offered
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-gray-400">
                                        {supplier.rounds.length} {supplier.rounds.length === 1 ? "round" : "rounds"} submitted
                                      </span>
                                    )}
                                  </div>
                                </TableCell>

                                {/* Round cells */}
                                {isNotSelected ? (
                                  Array.from({ length: maxRounds }, (_, rIdx) => (
                                    <TableCell key={rIdx} className="text-center align-middle py-4">
                                      <div className="flex flex-col items-center justify-center h-[60px]">
                                        <span className="text-gray-300 text-xl">--</span>
                                      </div>
                                    </TableCell>
                                  ))
                                ) : (
                                  Array.from({ length: maxRounds }, (_, rIdx) => {
                                    const roundData = supplier.rounds.find((r) => r.round === rIdx + 1)
                                    const isBestRound = roundData && rIdx === bestRoundIdx

                                    if (!roundData) {
                                      return (
                                        <TableCell key={rIdx} className="text-center align-middle py-4">
                                          <div className="flex flex-col items-center justify-center h-[60px]">
                                            <span className="text-gray-300 text-xl">--</span>
                                          </div>
                                        </TableCell>
                                      )
                                    }

                                    return (
                                      <TableCell
                                        key={rIdx}
                                        className={`text-center align-middle py-4 ${isBestRound ? "bg-emerald-50/60" : ""}`}
                                      >
                                        <div className="flex flex-col items-center justify-center h-[60px]">
                                          {/* Best badge - fixed 16px row */}
                                          <div className="h-4 flex items-center justify-center">
                                            {isBestRound ? (
                                              <Badge className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-0 leading-none">
                                                Best
                                              </Badge>
                                            ) : null}
                                          </div>
                                          {/* Value - fixed 28px row */}
                                          <div className="h-7 flex items-center justify-center">
                                            <span className={`text-xl font-bold tabular-nums ${isBestRound ? "text-emerald-700" : "text-gray-900"}`}>
                                              {"\u00A3"}{roundData.totalInvestment.toLocaleString()}
                                            </span>
                                          </div>
                                          {/* % change - fixed 16px row */}
                                          <div className="h-4 flex items-center justify-center">
                                            {rIdx > 0 && roundData.changePercent !== 0 ? (
                                              <span
                                                className={`text-[11px] font-semibold tabular-nums leading-none ${
                                                  roundData.changePercent < 0
                                                    ? "text-emerald-600"
                                                    : "text-red-500"
                                                }`}
                                              >
                                                {roundData.changePercent < 0 ? "" : "+"}{roundData.changePercent.toFixed(1)}%
                                              </span>
                                            ) : rIdx === 0 ? (
                                              <span className="text-[11px] text-gray-400 leading-none">Baseline</span>
                                            ) : null}
                                          </div>
                                        </div>
                                      </TableCell>
                                    )
                                  })
                                )}
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Add Offer Modal */}
      <AddOfferModal
        open={showAddOfferModal}
        onOpenChange={setShowAddOfferModal}
        onSubmit={handleOfferSubmit}
      />

      {/* Generate Contract Docs Modal */}
      <GenerateContractModal
        open={showContractModal}
        onClose={() => setShowContractModal(false)}
        supplier={contractSelection}
      />
      </div>
  )
}
