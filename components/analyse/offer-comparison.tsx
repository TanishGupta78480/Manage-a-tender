"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ChevronDown,
  ChevronRight,
  Info,
  Download,
  Eye,
  Layers,
  Medal,
  BarChart3,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  Settings,
  Truck,
  ShieldCheck,
  Leaf,
  Building2,
  PoundSterling,
  Triangle,
  Package,
  Ruler,
  Clock,
  Globe,
  BoxIcon,
  Boxes,
} from "lucide-react"
import type { Supplier, SKU } from "@/lib/data"

// =============================================
// TYPES
// =============================================
type ScoreValue = 1 | 2 | 3 | 4 | 5

interface SupplierComparisonData {
  supplierId: string
  supplierName: string
  isCurrent: boolean
  unitPriceDDP: number
  unitPriceEXW: number
  currency: string
  forecastedAnnualVolume: number
  annualSpend: number
  totalSaving: number
  priceChange: number
  maxLeadTime: number
  deliveryFrequency: string
  caseSize: number
  casesPerPallet: number
  unitWeight: number
  shelfLife: number
  packagingWeight: number
  contractScore: ScoreValue
  paymentTerms: string
  fixedInvestment: number
  promotionalInvestment: number
  otherInvestment: number
  specReq1: string
  specReq2: string
  specReq3: string
  certification: string
  specificationsScore: ScoreValue
  manufacturer: string
  manufacturerSku: string
  operationalScore: ScoreValue
  countryOfOrigin: string
  supplyChainScore: ScoreValue
  packagingType: string
  primaryPackagingMaterial: string
  packagingRecyclingType: string
  srp: boolean
  coloursForPrinting: number
  esgScore: ScoreValue
  allergens: string
  storageConditions: string
  otif: number
  distributionSites: number
  comments: string
  hasOffer: boolean
  round: number
  skusOffered: number
}

interface OfferComparisonProps {
  suppliers: Supplier[]
  skus: SKU[]
  tenderOffers: {
    supplierId: string
    skuId: string
    costPrice: number
    round: number
    deliveryFrequency: string
    deliveryTerms: string
    paymentDays: number
    specSame: boolean
    promotionChange: string
    promotionWeeks: number
    additionalFunding: number
    fixedInvestment?: number
    promotionalInvestment?: number
    otherInvestment?: number
  }[]
  /** Maps supplierId -> max round from evolution data */
  supplierRounds?: Record<string, number>
  /** Callback when a supplier is selected/deselected for contract */
  onContractSelect?: (data: {
    supplierId: string
    supplierName: string
    totalSaving: number
    unitPriceDDP: number
    unitPriceEXW: number
    annualSpend: number
    fixedInvestment: number
    promotionalInvestment: number
    otherInvestment: number
    forecastedVolume: number
    paymentTerms: string
    deliveryFrequency: string
    skuDetails: { skuName: string; costPrice: number; volume: number; annualSpend: number; saving: number }[]
  } | null) => void
}

type SortMode = "original" | "best-overall" | "lowest-price" | "shortest-lead"

// =============================================
// HELPERS
// =============================================
function scoreColor(score: ScoreValue) {
  if (score >= 5) return "bg-emerald-100 text-emerald-800 border-emerald-300"
  if (score >= 4) return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (score >= 3) return "bg-amber-50 text-amber-700 border-amber-200"
  if (score >= 2) return "bg-orange-50 text-orange-700 border-orange-200"
  return "bg-red-50 text-red-700 border-red-200"
}

function ordinalSuffix(n: number) {
  if (n === 1) return "st"
  if (n === 2) return "nd"
  if (n === 3) return "rd"
  return "th"
}

function rankLabelText(rank: number) {
  return `${rank}${ordinalSuffix(rank)}`
}

function rankLabel(rank: number) {
  return <>{rank}<sup className="text-[0.65em] leading-none">{ordinalSuffix(rank)}</sup></>
}

function roundLabel(round: number) {
  return <>{round}<sup className="text-[0.65em] leading-none">{ordinalSuffix(round)}</sup> Round</>
}

/** Compute overall score.
 *  Called TWICE: once individually per-supplier for sub-scores, once
 *  collectively with allSuppliers to do relative savings scoring.
 *  When allSuppliers is omitted the savings component uses absolute thresholds. */
function computeOverallScore(s: SupplierComparisonData, allSuppliers?: SupplierComparisonData[]): number {
  // ----- Savings score (relative) -- 55 % weight -----
  // Compare this supplier's saving against the best saving across all non-current suppliers.
  let savingsNorm = 0 // 0-1
  if (allSuppliers && allSuppliers.length > 1) {
    const offerSuppliers = allSuppliers.filter((x) => x.hasOffer)
    const maxSaving = Math.max(...offerSuppliers.map((x) => x.totalSaving), 1)
    const minSaving = Math.min(...offerSuppliers.map((x) => x.totalSaving), 0)
    const range = maxSaving - minSaving || 1
    // Scale: best saver = 1.0, worst = 0.05 (never zero so there's always a base score)
    savingsNorm = s.hasOffer ? 0.05 + 0.95 * ((s.totalSaving - minSaving) / range) : 0
  } else {
    // Fallback absolute thresholds
    const pct = s.totalSaving > 0 ? Math.min(s.totalSaving / 50000, 1) : 0
    savingsNorm = pct
  }

  // ----- Sub-category scores (1-5 → 0-1) -----
  const supplyScore = s.maxLeadTime <= 3 ? 5 : s.maxLeadTime <= 5 ? 4 : s.maxLeadTime <= 7 ? 3 : s.maxLeadTime <= 10 ? 2 : 1
  const productScore = s.shelfLife >= 10 ? 5 : s.shelfLife >= 7 ? 4 : s.shelfLife >= 5 ? 3 : 2

  // Weighted total out of 100:
  //  Savings 55%, Supply 12%, Specifications 10%, Product/Shelf 8%,
  //  Operational 5%, Supply Chain 5%, ESG 5%
  const weighted =
    savingsNorm * 55 +
    (supplyScore / 5) * 12 +
    (s.specificationsScore / 5) * 10 +
    (productScore / 5) * 8 +
    (s.operationalScore / 5) * 5 +
    (s.supplyChainScore / 5) * 5 +
    (s.esgScore / 5) * 5
  return Math.round(weighted)
}

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center justify-center w-4 h-4 ml-1.5 shrink-0">
          <Info className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-muted-foreground cursor-default transition-colors" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="w-max max-w-xs text-xs">{text}</TooltipContent>
    </Tooltip>
  )
}

// Section header row inside tables
function SectionHeaderRow({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
      <TableCell colSpan={colSpan} className="pl-6 py-2.5">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </TableCell>
    </TableRow>
  )
}

// =============================================
// MAIN COMPONENT
// =============================================
export function OfferComparison({ suppliers, skus, tenderOffers, supplierRounds, onContractSelect }: OfferComparisonProps) {
  const [viewMode, setViewMode] = useState<"executive" | "detailed">("executive")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["quantitative"]))
  const [sortMode, setSortMode] = useState<SortMode>("original")
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedForContract, setSelectedForContract] = useState<string | null>(null)
  // Detailed view: expanded SKUs and sub-sections per SKU
  const [expandedSkus, setExpandedSkus] = useState<Set<string>>(new Set())
  const [expandedSkuSections, setExpandedSkuSections] = useState<Map<string, Set<string>>>(new Map())

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSku = useCallback((skuId: string) => {
    setExpandedSkus((prev) => {
      const next = new Set(prev)
      if (next.has(skuId)) next.delete(skuId)
      else next.add(skuId)
      return next
    })
  }, [])

  const toggleSkuSection = useCallback((skuId: string, sectionKey: string) => {
    setExpandedSkuSections((prev) => {
      const next = new Map(prev)
      const sections = new Set(next.get(skuId) || [])
      if (sections.has(sectionKey)) sections.delete(sectionKey)
      else sections.add(sectionKey)
      next.set(skuId, sections)
      return next
    })
  }, [])

  // Build comparison data - only first supplier is "Current"
  const comparisonData = useMemo((): SupplierComparisonData[] => {
    const baselineSpend = skus.reduce((sum, sku) => sum + sku.currentCostPrice * sku.weeklyVolume * 52, 0)
    const forecastedVolume = skus.reduce((s, sku) => s + sku.weeklyVolume * 52, 0)

    const data: SupplierComparisonData[] = suppliers.map((supplier, idx) => {
      const supplierOffers = tenderOffers.filter((o) => o.supplierId === supplier.id)

      // Calculate annual spend per-SKU using best offer price per SKU, falling back to current price
      let annualSpend = 0
      let weightedPriceSum = 0
      let weightedVolumeSum = 0
      skus.forEach((sku) => {
        const skuOffer = supplierOffers.find((o) => o.skuId === sku.id)
        const price = skuOffer ? skuOffer.costPrice : sku.currentCostPrice * (1 - 0.02 * (idx + 1))
        const annualVol = sku.weeklyVolume * 52
        annualSpend += price * annualVol
        weightedPriceSum += price * annualVol
        weightedVolumeSum += annualVol
      })
      const avgCostPrice = weightedVolumeSum > 0 ? weightedPriceSum / weightedVolumeSum : skus[0]?.currentCostPrice || 1.5
      const totalSaving = baselineSpend - annualSpend

      // --- Derive realistic scores from actual offer data & supplier profile ---
      const hasHighRating = supplier.reliabilityScore >= 93
      const hasBrcA = supplier.accreditation?.brcGrade === "A" || supplier.accreditation?.brcGrade === "AA"
      const hasOffers = supplierOffers.length > 0
      const latestRound = hasOffers ? Math.max(...supplierOffers.map((o) => o.round)) : 0
      const latestOffers = supplierOffers.filter((o) => o.round === latestRound)

      // Commercial score (1-5): based on absolute saving amount relative to baseline
      // This score feeds the summary view. The overall score uses relative savings.
      const savingPct = baselineSpend > 0 ? ((baselineSpend - annualSpend) / baselineSpend) * 100 : 0
      const commercialScore: ScoreValue = savingPct >= 8 ? 5 : savingPct >= 5 ? 4 : savingPct >= 2 ? 3 : savingPct > 0 ? 2 : 1

      // Supply score: lead time + delivery frequency from offer data
      const bestPaymentDays = latestOffers.length > 0 ? Math.max(...latestOffers.map((o) => o.paymentDays)) : 30
      const deliveryFreq = latestOffers.length > 0 ? latestOffers[0].deliveryFrequency : "Weekly"
      const leadTimeBase = deliveryFreq === "Daily" ? 3 : deliveryFreq === "4x weekly" ? 5 : deliveryFreq === "3x weekly" ? 7 : deliveryFreq === "2x weekly" ? 10 : 14
      const supplyScore: ScoreValue = leadTimeBase <= 3 ? 5 : leadTimeBase <= 5 ? 4 : leadTimeBase <= 7 ? 3 : leadTimeBase <= 10 ? 2 : 1

      // Product score: from spec compliance and shelf life
      const allSpecsSame = latestOffers.length > 0 ? latestOffers.every((o) => o.specSame) : false
      const avgShelfLife = skus.length > 0 ? Math.round(skus.reduce((s, sku) => s + parseInt(sku.shelfLife) || 5, 0) / skus.length) : 5
      const productScore: ScoreValue = allSpecsSame && avgShelfLife >= 7 ? 5 : allSpecsSame ? 4 : avgShelfLife >= 5 ? 3 : 2

      // Specifications score: based on BRC grade + reliability
      const specificationsScoreVal: ScoreValue = hasBrcA && hasHighRating ? 5 : hasBrcA || hasHighRating ? 4 : supplier.reliabilityScore >= 85 ? 3 : 2

      // Operational score: domestic suppliers score higher, + reliable delivery
      const isDomestic = supplier.country === "United Kingdom"
      const operationalScoreVal: ScoreValue = isDomestic && hasHighRating ? 5 : isDomestic ? 4 : hasHighRating ? 3 : 2

      // Supply chain score: based on accreditations and delivery terms
      const hasDelivered = latestOffers.length > 0 && latestOffers.every((o) => o.deliveryTerms === "delivered")
      const supplyChainScoreVal: ScoreValue = hasDelivered && hasBrcA ? 5 : hasDelivered ? 4 : hasBrcA ? 3 : 2

      // ESG score: from certifications and packaging sustainability
      const hasCerts = (supplier.accreditation?.certifications?.length || 0) >= 2
      const esgScoreVal: ScoreValue = hasCerts && hasHighRating ? 5 : hasCerts ? 4 : hasHighRating ? 3 : 2

      // Promotion analysis
      const promoChange = latestOffers.length > 0
        ? (latestOffers.filter((o) => o.promotionChange === "increased").length >= latestOffers.length / 2
          ? "increased"
          : latestOffers.filter((o) => o.promotionChange === "decreased").length > 0
            ? "decreased"
            : "same")
        : "same"
      const avgPromoWeeks = latestOffers.length > 0
        ? Math.round(latestOffers.reduce((s, o) => s + o.promotionWeeks, 0) / latestOffers.length)
        : 6

      // Investment: sum from all latest round offers
      const totalAdditionalFunding = latestOffers.reduce((s, o) => s + (o.additionalFunding || 0), 0)
      const fixedInv = hasOffers ? Math.round(totalAdditionalFunding * 0.55) : 0
      const promoInv = hasOffers ? Math.round(totalAdditionalFunding * 0.30) : 0
      const otherInv = hasOffers ? Math.round(totalAdditionalFunding * 0.15) : 0

      // Spec compliance mapping
      const specMapping = (allMet: boolean, idx: number): string =>
        allMet ? (idx === 0 ? "Exceeds" : "Meets") : "Minor Gap"

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        isCurrent: idx === 0,
        unitPriceDDP: Number(avgCostPrice.toFixed(2)),
        unitPriceEXW: Number((avgCostPrice * 0.88).toFixed(2)),
        currency: "GBP",
        forecastedAnnualVolume: forecastedVolume,
        annualSpend: Math.round(annualSpend),
        totalSaving: Math.round(totalSaving),
        priceChange: baselineSpend > 0
          ? Number((((annualSpend - baselineSpend) / baselineSpend) * 100).toFixed(1))
          : 0,
        maxLeadTime: leadTimeBase,
        deliveryFrequency: deliveryFreq,
        caseSize: [12, 24, 6, 18, 12][idx % 5],
        casesPerPallet: [48, 60, 72, 56, 48][idx % 5],
        unitWeight: skus[0] ? parseInt(skus[0].specs?.weight || "400") : 400,
        shelfLife: avgShelfLife,
        packagingWeight: [25, 30, 22, 28, 20][idx % 5],
        contractScore: commercialScore,
        paymentTerms: bestPaymentDays >= 60 ? "Net 60" : bestPaymentDays >= 45 ? "Net 45" : "Net 30",
        fixedInvestment: fixedInv,
        promotionalInvestment: promoInv,
        otherInvestment: otherInv,
        specReq1: specMapping(allSpecsSame, 0),
        specReq2: specMapping(allSpecsSame, 1),
        specReq3: specMapping(allSpecsSame, 2),
        certification: supplier.accreditation?.certifications?.[0] || "Pending",
        specificationsScore: specificationsScoreVal,
        manufacturer: supplier.name,
        manufacturerSku: `${supplier.id}-${skus[0]?.id || "SKU"}-${latestRound || 1}`,
        operationalScore: operationalScoreVal,
        countryOfOrigin: supplier.country,
        supplyChainScore: supplyChainScoreVal,
        packagingType: ["Cardboard Box", "Film Wrap", "Eco Tray", "Cardboard Box", "Film Wrap"][idx % 5],
        primaryPackagingMaterial: ["Cardboard", "PP Film", "Pulp", "Cardboard", "PE Film"][idx % 5],
        packagingRecyclingType: ["Widely Recycled", "Check Locally", "Compostable", "Widely Recycled", "Not Recyclable"][idx % 5],
        srp: promoChange === "increased" || idx % 2 === 0,
        coloursForPrinting: [4, 2, 6, 3, 2][idx % 5],
        esgScore: esgScoreVal,
        allergens: skus[0]?.specs?.allergens?.join(", ") || "Gluten, Eggs, Milk",
        storageConditions: skus[0]?.storageTemp === "Chilled" ? "Chilled 2-5C" : "Ambient",
        otif: [97.2, 95.8, 98.1, 94.5, 96.3][idx % 5],
        distributionSites: [12, 8, 15, 6, 10][idx % 5],
        comments: !hasOffers ? "Current supplier - no new offer submitted"
          : promoChange === "increased" && savingPct >= 5 ? "Strong commercial proposal with additional promotional support"
          : savingPct >= 3 ? "Competitive pricing with acceptable terms"
          : "Marginal improvement over baseline",
        hasOffer: hasOffers,
        round: supplierRounds?.[supplier.id] ?? latestRound,
        skusOffered: hasOffers ? new Set(supplierOffers.map(o => o.skuId)).size : 0,
      }
    })

    const withScore = data.map((d) => ({ ...d, __overallScore: computeOverallScore(d, data) }))

    switch (sortMode) {
      case "best-overall":
        withScore.sort((a, b) => b.__overallScore - a.__overallScore)
        break
      case "lowest-price":
        withScore.sort((a, b) => a.unitPriceDDP - b.unitPriceDDP)
        break
      case "shortest-lead":
        withScore.sort((a, b) => a.maxLeadTime - b.maxLeadTime)
        break
      default:
        withScore.sort((a, b) => (a.isCurrent === b.isCurrent ? 0 : a.isCurrent ? -1 : 1))
    }

    return withScore.map(({ __overallScore, ...rest }) => rest)
  }, [suppliers, skus, tenderOffers, sortMode])

  const overallScores = useMemo(() => comparisonData.map((s) => computeOverallScore(s, comparisonData)), [comparisonData])

  const ranks = useMemo(() => {
    const sorted = [...overallScores].sort((a, b) => b - a)
    return overallScores.map((score) => sorted.indexOf(score) + 1)
  }, [overallScores])

  // Per-SKU per-supplier data for detailed view
  interface PerSkuData {
    // SKU Identification
    skuNumber: string
    skuDescription: string
    manufacturerSku: string
    // Financial
    costPrice: number
    exwPrice: number
    cogs: number
    annualVolume: number
    annualSpend: number
    saving: number
    priceChange: number
    // Product Specifications
    specReq1: string
    specReq2: string
    specReq3: string
    certification: string
    // Physical & Packaging
    packSize: string
    packType: string
    caseSize: number
    casesPerPallet: number
    unitWeight: number
    packagingWeight: number
    packagingType: string
    primaryMaterial: string
    recyclingType: string
    srp: boolean
    printColours: number
    // Shelf Life & Storage
    shelfLife: number
    storageConditions: string
    // Supply Chain
    countryOfOrigin: string
    moq: number
    uom: string
    leadTime: number
    deliveryFrequency: string
    deliveryTerms: string
    // Other
    paymentTerms: string
    fixedInvestment: number
    promotionalInvestment: number
    otherInvestment: number
    hasOffer: boolean
  }

  const perSkuData = useMemo(() => {
    const result = new Map<string, Map<string, PerSkuData>>()
    skus.forEach((sku) => {
      const baselineAnnual = sku.currentCostPrice * sku.weeklyVolume * 52
      const supplierMap = new Map<string, PerSkuData>()

      comparisonData.forEach((s, idx) => {
        const offer = tenderOffers.find((o) => o.supplierId === s.supplierId && o.skuId === sku.id)
        const price = offer ? offer.costPrice : sku.currentCostPrice * (1 - 0.02 * (idx + 1))
        const annualVol = sku.weeklyVolume * 52
        const annualSpend = price * annualVol
        const saving = baselineAnnual - annualSpend
        const priceChange = baselineAnnual > 0 ? ((annualSpend - baselineAnnual) / baselineAnnual) * 100 : 0
        const deliveryFreq = offer?.deliveryFrequency || "Weekly"
        const leadTime = deliveryFreq === "Daily" ? 3 : deliveryFreq === "4x weekly" ? 5 : deliveryFreq === "3x weekly" ? 7 : deliveryFreq === "2x weekly" ? 10 : 14

        const supplier = suppliers.find((sup) => sup.id === s.supplierId)

        supplierMap.set(s.supplierId, {
          // SKU Identification
          skuNumber: sku.id,
          skuDescription: sku.name,
          manufacturerSku: `${s.supplierId}-${sku.id}-${offer?.round || 1}`,
          // Financial
          costPrice: Number(price.toFixed(2)),
          exwPrice: Number((price * 0.88).toFixed(2)),
          cogs: Number((price * 0.92).toFixed(2)),
          annualVolume: annualVol,
          annualSpend: Math.round(annualSpend),
          saving: Math.round(saving),
          priceChange: Number(priceChange.toFixed(1)),
          // Product Specifications
          specReq1: offer?.specSame ? "Meets" : ["Meets", "Gap", "Meets"][idx % 3],
          specReq2: offer?.specSame ? "Meets" : ["Gap", "Meets", "Meets"][idx % 3],
          specReq3: "Meets",
          certification: supplier?.accreditation?.certifications?.[0] || "BRC AA",
          // Physical & Packaging
          packSize: sku.packSize,
          packType: ["Flow Wrap", "Box", "Bag", "Pouch", "Tray"][idx % 5],
          caseSize: [12, 24, 6, 18, 12][idx % 5],
          casesPerPallet: [48, 60, 72, 56, 48][idx % 5],
          unitWeight: parseInt(sku.specs?.weight || "400"),
          packagingWeight: [25, 30, 22, 28, 20][idx % 5],
          packagingType: ["Plastic", "Cardboard", "Recyclable", "Compostable", "Plastic"][idx % 5],
          primaryMaterial: ["LDPE", "Corrugated", "rPET", "PLA", "PP"][idx % 5],
          recyclingType: ["Kerbside", "Store Drop-off", "Kerbside", "Industrial", "Kerbside"][idx % 5],
          srp: idx % 2 === 0,
          printColours: [4, 6, 4, 3, 5][idx % 5],
          // Shelf Life & Storage
          shelfLife: parseInt(sku.shelfLife) || 5,
          storageConditions: sku.storageTemp === "Chilled" ? "Chilled 2-5\u00B0C" : "Ambient",
          // Supply Chain
          countryOfOrigin: supplier?.country || "UK",
          moq: [500, 1000, 250, 750, 500][idx % 5],
          uom: "Cases",
          leadTime,
          deliveryFrequency: deliveryFreq,
          deliveryTerms: offer?.deliveryTerms || "ex-works",
          // Other
          paymentTerms: offer ? (offer.paymentDays >= 60 ? "Net 60" : offer.paymentDays >= 45 ? "Net 45" : "Net 30") : "Net 30",
          fixedInvestment: offer?.fixedInvestment || 0,
          promotionalInvestment: offer?.promotionalInvestment || 0,
          otherInvestment: offer?.otherInvestment || 0,
          hasOffer: !!offer,
        })
      })
      result.set(sku.id, supplierMap)
    })
    return result
  }, [skus, comparisonData, tenderOffers, suppliers])

  // Notify parent when contract selection changes
  const onContractSelectRef = React.useRef(onContractSelect)
  onContractSelectRef.current = onContractSelect
  const comparisonDataRef = React.useRef(comparisonData)
  comparisonDataRef.current = comparisonData
  const perSkuDataRef = React.useRef(perSkuData)
  perSkuDataRef.current = perSkuData
  const skusRef = React.useRef(skus)
  skusRef.current = skus
  useEffect(() => {
    const cb = onContractSelectRef.current
    if (!cb) return
    if (selectedForContract) {
      const s = comparisonDataRef.current.find((d) => d.supplierId === selectedForContract)
      if (!s) return
      // Build per-SKU details for this supplier
      const skuDetails: { skuName: string; costPrice: number; volume: number; annualSpend: number; saving: number }[] = []
      perSkuDataRef.current.forEach((supplierMap, skuId) => {
        const d = supplierMap.get(s.supplierId)
        if (d && d.hasOffer) {
          const sku = skusRef.current.find((sk) => sk.id === skuId)
          skuDetails.push({
            skuName: sku?.name || skuId,
            costPrice: d.costPrice,
            volume: d.annualVolume,
            annualSpend: d.annualSpend,
            saving: d.saving,
          })
        }
      })
      cb({
        supplierId: s.supplierId,
        supplierName: s.supplierName,
        totalSaving: s.totalSaving,
        unitPriceDDP: s.unitPriceDDP,
        unitPriceEXW: s.unitPriceEXW,
        annualSpend: s.annualSpend,
        fixedInvestment: s.fixedInvestment,
        promotionalInvestment: s.promotionalInvestment,
        otherInvestment: s.otherInvestment,
        forecastedVolume: s.forecastedAnnualVolume,
        paymentTerms: s.paymentTerms,
        deliveryFrequency: s.deliveryFrequency,
        skuDetails,
      })
    } else {
      cb(null)
    }
  }, [selectedForContract])

  if (comparisonData.length === 0) {
    return (
      <Card className="border-gray-300 p-12 text-center text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p className="font-medium">No offers to compare yet</p>
      </Card>
    )
  }

  const sortLabels: Record<SortMode, string> = {
    original: "Original Order",
    "best-overall": "Best Overall",
    "lowest-price": "Lowest Price",
    "shortest-lead": "Shortest Lead Time",
  }

  const colSpan = comparisonData.length + 1

  // =============================================
  // Supplier column headers (reused across tables)
  // =============================================
  function renderSupplierHeaders() {
    return comparisonData.map((s, idx) => {
      const isBest = ranks[idx] === 1
      return (
        <TableHead
          key={s.supplierId}
  className={`text-center min-w-[170px] ${
  isBest ? "bg-emerald-50/50" : ""
  }`}
        >
          <div className="flex flex-col items-center gap-1 py-1">
            {s.isCurrent && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-300 rounded-full px-2.5 py-0.5 leading-none">
                Current
              </span>
            )}
            {isBest && !s.isCurrent && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full px-2.5 py-0.5 leading-none">
                Recommended
              </span>
            )}
            {!s.isCurrent && !isBest && <span className="h-[22px]" />}
            <span className="text-sm font-bold text-gray-900">{s.supplierName}</span>
          </div>
        </TableHead>
      )
    })
  }

  // Column background for current/best supplier
  function cellBg(idx: number) {
  if (ranks[idx] === 1) return "bg-emerald-50/30"
  return ""
  }

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="space-y-5">
      {/* ===== SUPPLIER SUMMARY CARDS (Top 5, current always first) ===== */}
      {(() => {
        const sortedCards = comparisonData
          .map((s, idx) => ({ s, idx, rank: ranks[idx] }))
          .sort((a, b) => {
            if (a.s.isCurrent && !b.s.isCurrent) return -1
            if (!a.s.isCurrent && b.s.isCurrent) return 1
            return a.rank - b.rank
          })
          .slice(0, 5)
        const cardCount = sortedCards.length
        const gridClass = cardCount <= 2 ? "grid-cols-2" : cardCount === 3 ? "grid-cols-3" : cardCount === 4 ? "grid-cols-4" : "grid-cols-5"
        return (
        <div className={`grid ${gridClass} gap-4`}>
        {sortedCards.map(({ s, idx }) => {
          const isBest = ranks[idx] === 1
          const showLeftPill = s.isCurrent
          const leftPillText = s.isCurrent ? (s.hasOffer ? "New Offer" : "Tender Not Offered") : ""
          const leftPillColor = s.isCurrent
            ? s.hasOffer
              ? "bg-emerald-600 text-white"
              : "bg-gray-400 text-white"
            : ""
          const showRightPill = s.isCurrent ? s.hasOffer : true
          const rightPillText = showRightPill && s.round > 0 ? roundLabel(s.round) : ""

          return (
            <Card
              key={s.supplierId}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isBest
                  ? "border-2 border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white shadow-md"
                  : "border-2 border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Color bar at top */}
              <div className={`h-1.5 w-full ${
                isBest ? "bg-gradient-to-r from-emerald-400 to-emerald-300" : "bg-gradient-to-r from-gray-200 to-gray-100"
              }`} />

              {/* Half-pill status row */}
              <div className="flex items-center justify-between h-6 mt-0.5">
                {showLeftPill && leftPillText ? (
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-3.5 py-1 rounded-r-full leading-none ${leftPillColor}`}>
                    {leftPillText}
                  </span>
                ) : <span />}
                {showRightPill && rightPillText ? (
                  <span className="text-[11px] font-bold uppercase tracking-wide px-3.5 py-1 rounded-l-full leading-none bg-blue-600 text-white">
                    {rightPillText}
                  </span>
                ) : <span />}
              </div>

              <CardContent className="px-5 pb-4 pt-1">
                <div className="flex flex-col items-center text-center">
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 h-5 mb-1">
                    {s.isCurrent && (
                      <Badge className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2.5">
                        Current Supplier
                      </Badge>
                    )}
                    {isBest && !s.isCurrent && (
                      <Badge className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full px-2.5">
                        Recommended
                      </Badge>
                    )}
                    {!s.isCurrent && !isBest && <span className="h-5" />}
                  </div>

                  <span className="text-base font-bold text-gray-900">{s.supplierName}</span>

                  <div className={`text-3xl font-extrabold tabular-nums mt-1 ${
                    ranks[idx] === 1 ? "text-emerald-700" : ranks[idx] === 2 ? "text-blue-700" : ranks[idx] === 3 ? "text-amber-700" : "text-gray-900"
                  }`}>
                    {overallScores[idx]}%
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Overall Score</span>

                  <Badge
                    className={`text-xs font-bold border rounded-full px-3 py-0.5 mt-1 ${
                      ranks[idx] === 1
                        ? "text-emerald-800 bg-emerald-100 border-emerald-300 gap-1"
                        : ranks[idx] === 2
                          ? "text-blue-700 bg-blue-50 border-blue-200 gap-1"
                          : ranks[idx] === 3
                            ? "text-amber-700 bg-amber-50 border-amber-200 gap-1"
                            : "text-gray-500 bg-gray-50 border-gray-200"
                    }`}
                  >
                    {ranks[idx] <= 3 && <Medal className="h-3.5 w-3.5" />}
                    {ranks[idx]}
                  </Badge>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full mt-4 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      {s.isCurrent && !s.hasOffer ? (
                        <div className="text-sm font-bold tabular-nums text-gray-400">-</div>
                      ) : (
                        <div className={`text-sm font-bold tabular-nums ${s.totalSaving >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                          {s.totalSaving >= 0 ? "+" : ""}{"\u00A3"}{Math.abs(s.totalSaving).toLocaleString()}
                        </div>
                      )}
                      <div className="text-[11px] text-gray-500 font-medium">Total Saving</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold tabular-nums text-gray-900">{"\u00A3"}{s.unitPriceDDP.toFixed(2)}</div>
                      <div className="text-[11px] text-gray-500 font-medium">Unit Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold tabular-nums text-gray-900">{s.maxLeadTime}d</div>
                      <div className="text-[11px] text-gray-500 font-medium">Lead Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold tabular-nums text-gray-900">{"\u00A3"}{s.annualSpend.toLocaleString()}</div>
                      <div className="text-[11px] text-gray-500 font-medium">COGS</div>
                    </div>
                  </div>

                  {/* Select for Contract - inside card (show for all non-current, or current with new offer) */}
                  {(!s.isCurrent || (s.isCurrent && s.hasOffer)) && (
                  <div className="w-full mt-3 pt-3 border-t border-gray-200">
                    {selectedForContract === s.supplierId ? (
                      isBest ? (
                        <Button
                          size="sm"
                          className="w-full text-xs font-bold gap-1.5 bg-[#3b5bdb] hover:bg-[#364fc7] text-white rounded-lg shadow-md shadow-blue-200 border border-[#3b5bdb] transition-all duration-200"
                          onClick={() => setSelectedForContract(null)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Selected
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full text-xs font-bold gap-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md shadow-gray-200 border border-gray-800 transition-all duration-200"
                          onClick={() => setSelectedForContract(null)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Selected
                        </Button>
                      )
                    ) : isBest ? (
                      <Button
                        size="sm"
                        className="w-full text-xs font-bold border-2 border-[#3b5bdb] bg-[#3b5bdb] text-white hover:bg-[#364fc7] rounded-lg shadow-sm shadow-blue-100 hover:shadow-md hover:shadow-blue-200 transition-all duration-200"
                        onClick={() => setSelectedForContract(s.supplierId)}
                      >
                        Select for Contract
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold border border-gray-300 text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 rounded-lg transition-all duration-200"
                        onClick={() => setSelectedForContract(s.supplierId)}
                      >
                        Select for Contract
                      </Button>
                    )}
                  </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
        )
      })()}

      {/* ===== SCORING INFO + SKU COUNT ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-default">
                <Info className="h-4 w-4" />
                How are scores calculated?
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="w-[300px] p-3 text-xs leading-relaxed bg-white text-gray-900 shadow-xl border border-gray-200 [&>svg]:hidden">
              <p className="w-full font-bold text-sm mb-1 text-gray-900">Overall Weighted Score Formula</p>
              <p className="w-full text-gray-500 mb-2 text-[11px]">Scored 1-5 across 7 categories, weighted sum normalised to %:</p>

              {/* Formula */}
              <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 mb-2 font-mono text-[11px] leading-relaxed">
                <p className="font-bold mb-0.5 text-gray-900">{'Score = (C/5 x 40) + (S/5 x 20) + (P/5 x 15) + (Sp/5 x 10) + (O/5 x 5) + (SC/5 x 5) + (E/5 x 5)'}</p>
                <p className="text-gray-500 text-[10px]">{'C = Commercial  S = Supply  P = Product  Sp = Spec  O = Ops  SC = Chain  E = ESG'}</p>
              </div>

              {/* Weights table */}
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left font-semibold text-gray-900 py-0.5 pr-1">Category</th>
                    <th className="text-left font-semibold text-gray-900 py-0.5 px-1 w-10">Wt</th>
                    <th className="text-left font-semibold text-gray-900 py-0.5 pl-1">Based on</th>
                  </tr>
                </thead>
                <tbody>
                {[
                  { name: "Commercial", weight: "40%", based: "Saving vs baseline" },
                  { name: "Supply", weight: "20%", based: "Lead time & freq." },
                  { name: "Product", weight: "15%", based: "Shelf life & spec" },
                  { name: "Specifications", weight: "10%", based: "BRC & reliability" },
                  { name: "Operational", weight: "5%", based: "Domestic & perf." },
                  { name: "Supply Chain", weight: "5%", based: "Delivery & accred." },
                  { name: "ESG", weight: "5%", based: "Certifications" },
                ].map((row) => (
                  <tr key={row.name}>
                    <td className="text-gray-800 py-0.5 pr-1">{row.name}</td>
                    <td className="font-bold text-gray-900 py-0.5 px-1">{row.weight}</td>
                    <td className="text-gray-500 py-0.5 pl-1">{row.based}</td>
                  </tr>
                ))}
                </tbody>
              </table>

              <div className="mt-2 pt-1.5 border-t border-gray-200">
                <p className="text-gray-500 text-[10px]">
                  <span className="font-semibold text-gray-900">Example:</span> Score 4 in Commercial:
                  <span className="font-mono font-semibold text-gray-900 ml-0.5">{'(4/5)x40=32'}</span> / 40.
                  Max = <span className="font-mono font-semibold text-gray-900">100%</span>.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          <span />
        </div>
      </div>

      {/* ===== CONTROLS BAR ===== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center h-9 p-0.5 rounded-lg border-2 border-gray-200 bg-gray-50">
              <button
                onClick={() => setViewMode("executive")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "executive"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Summary View
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "detailed"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Detailed View
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9 border-2 border-gray-200 font-semibold"
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort: {sortLabels[sortMode]}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
              {sortOpen && (
                <div className="absolute right-0 top-10 z-50 bg-white border-2 border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]">
                  {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setSortMode(mode); setSortOpen(false) }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                        sortMode === mode ? "bg-indigo-50 text-[#3b5bdb]" : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {sortLabels[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-9 border-2 border-gray-200 font-semibold"
              onClick={() => {
                const headers = ["Metric", ...comparisonData.map((s) => s.supplierName)]
                const rows = [
                  ["Overall Score", ...overallScores.map((s) => `${Math.round(s)}%`)],
                  ["Rank", ...ranks.map((r) => rankLabelText(r))],
                  ["Total Saving", ...comparisonData.map((s) => `£${Math.abs(s.totalSaving).toLocaleString()}`)],
                  ["Unit Price (DDP)", ...comparisonData.map((s) => `£${s.unitPriceDDP.toFixed(2)}`)],
                  ["COGS", ...comparisonData.map((s) => `£${s.annualSpend.toLocaleString()}`)],
                  ["Price Change", ...comparisonData.map((s) => `${s.priceChange}%`)],
                  ["Max Lead Time", ...comparisonData.map((s) => `${s.maxLeadTime} days`)],
                  ["Delivery Frequency", ...comparisonData.map((s) => s.deliveryFrequency)],
                  ["Case Size", ...comparisonData.map((s) => String(s.caseSize))],
                  ["Shelf Life", ...comparisonData.map((s) => `${s.shelfLife} days`)],
                  ["Contract Score", ...comparisonData.map((s) => String(s.contractScore))],
                  ["Payment Terms", ...comparisonData.map((s) => s.paymentTerms)],
                  ["Fixed Investment", ...comparisonData.map((s) => `£${s.fixedInvestment.toLocaleString()}`)],
                  ["Country of Origin", ...comparisonData.map((s) => s.countryOfOrigin)],
                  ["Packaging Type", ...comparisonData.map((s) => s.packagingType)],
                  ["Allergens", ...comparisonData.map((s) => s.allergens)],
                  ["Storage Conditions", ...comparisonData.map((s) => s.storageConditions)],
                  ["Comments", ...comparisonData.map((s) => s.comments)],
                ]
                const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
                const blob = new Blob([csv], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "offer-comparison.csv"
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Export as Excel
            </Button>
          </div>
      </div>

      {/* ===== SUMMARY VIEW ===== */}
      {(viewMode === "executive") && (() => {
        const sections = [
          { key: "summary-contract", icon: FileText, label: "Contract", scoreKey: "contractScore" as const },
          { key: "summary-specifications", icon: ShieldCheck, label: "Specifications", scoreKey: "specificationsScore" as const },
          { key: "summary-operational", icon: Settings, label: "Operational", scoreKey: "operationalScore" as const },
          { key: "summary-supply-chain", icon: Truck, label: "Supply Chain", scoreKey: "supplyChainScore" as const },
          { key: "summary-esg", icon: Leaf, label: "ESG", scoreKey: "esgScore" as const },
        ]
        return (
        <Card className="border-gray-300 p-0 overflow-hidden">
          <div className="overflow-auto max-h-[75vh]">
            <table className="w-full border-collapse">
              {/* Column header row */}
              <thead className="sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th className="min-w-[220px] text-left text-xs font-bold text-gray-500 uppercase tracking-wider pl-6 pr-4 py-3 bg-white">Criteria</th>
                  {comparisonData.map((s, idx) => {
                    const isBest = ranks[idx] === 1
                    return (
                      <th key={s.supplierId} className={`text-center min-w-[150px] px-3 py-3 ${isBest ? "bg-emerald-50" : "bg-white"}`}>
                        <div className="flex flex-col items-center">
                          <div className="h-4 flex items-center justify-center mb-0.5">
                            {s.isCurrent && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2 py-0 leading-tight">Current</span>
                            )}
                            {isBest && !s.isCurrent && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-0 leading-tight">Recommended</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{s.supplierName}</span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Total Savings row */}
                <tr className="bg-white border-b border-gray-200">
                  <td className="pl-6 pr-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <PoundSterling className="h-4 w-4 text-gray-600 shrink-0" />
                      <span className="text-sm font-bold text-gray-900">Total Savings</span>
                    </div>
                  </td>
                  {comparisonData.map((s, idx) => (
                    <td key={s.supplierId} className={`text-center px-3 py-3 ${ranks[idx] === 1 ? "bg-emerald-50/30" : ""}`}>
                      {s.isCurrent && !s.hasOffer ? (
                        <span className="text-sm font-bold text-gray-400">-</span>
                      ) : (
                        <span className={`text-sm font-bold ${s.totalSaving >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                          {s.totalSaving >= 0 ? "+" : ""}{"\u00A3"}{Math.abs(s.totalSaving).toLocaleString()}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* SKUs Offered row */}
                <tr className="bg-white border-b border-gray-100">
                  <td className="pl-6 pr-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Package className="h-4 w-4 text-gray-500 shrink-0" />
                      <span className="text-sm font-semibold text-gray-700">SKUs Offered</span>
                    </div>
                  </td>
                  {comparisonData.map((s, idx) => (
                    <td key={s.supplierId} className={`text-center px-3 py-3 ${ranks[idx] === 1 ? "bg-emerald-50/30" : ""}`}>
                      <span className="text-sm font-bold text-gray-800">
                        {s.skusOffered > 0 ? s.skusOffered : "-"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Category rows with expandable sections */}
                {sections.map((section) => {
                  const Icon = section.icon
                  const isExpanded = expandedSections.has(section.key)
                  return (
                    <React.Fragment key={section.key}>
                      {/* Section header - collapsible */}
                      <tr
                        onClick={() => toggleSection(section.key)}
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200/80 border-b border-gray-200 transition-colors"
                      >
                        <td colSpan={comparisonData.length + 1} className="pl-5 pr-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <ChevronDown className={`h-4 w-4 text-gray-600 shrink-0 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
                            <Icon className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{section.label}</span>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail rows */}
                      {isExpanded && (
                        <>
                          {section.key === "summary-contract" && (<>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Payment Terms<InfoTip text="Agreed payment terms with this supplier." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.paymentTerms}</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Rebates<InfoTip text="Volume rebates or retrospective discounts offered." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.promotionalInvestment > 0 ? `\u00A3${s.promotionalInvestment.toLocaleString()}` : "None"}</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Incoterms<InfoTip text="Trade delivery terms (e.g. DDP, EXW, FOB)." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.deliveryTerms || "DDP"}</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Currency<InfoTip text="Transaction currency for this supplier." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.currency}</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Price Change (%)<InfoTip text="Percentage change from current baseline price." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm px-3 py-2.5 ${cellBg(idx)}`}>
                                  {s.isCurrent && !s.hasOffer ? (
                                    <span className="font-semibold text-gray-400">-</span>
                                  ) : (
                                    <span className={`font-semibold ${s.priceChange <= 0 ? "text-emerald-700" : "text-red-600"}`}>
                                      {s.priceChange > 0 ? "+" : ""}{s.priceChange}%
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Fixed Investment<InfoTip text="One-off fixed investment offered by the supplier." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>
                                  {s.isCurrent && !s.hasOffer ? <span className="text-gray-400">-</span> : <>{"\u00A3"}{s.fixedInvestment.toLocaleString()}</>}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Promotional Investment<InfoTip text="Annual promotional investment offered." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>
                                  {s.isCurrent && !s.hasOffer ? <span className="text-gray-400">-</span> : <>{"\u00A3"}{s.promotionalInvestment.toLocaleString()}</>}
                                </td>
                              ))}
                            </tr>
                          </>)}
                          {section.key === "summary-specifications" && (<>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Certification<InfoTip text="Main accreditation (e.g. BRC Rating, ISO)." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.certification}</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Compliance<InfoTip text="Regulatory and product compliance status." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.specReq1 || "Compliant"}</td>
                              ))}
                            </tr>

                          </>)}
                          {section.key === "summary-operational" && (<>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Maximum Lead Time<InfoTip text="Longest lead time from order to delivery." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.maxLeadTime} days</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Delivery Frequency<InfoTip text="How often deliveries are scheduled." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.deliveryFrequency}</td>
                              ))}
                            </tr>

                          </>)}
                          {section.key === "summary-supply-chain" && (<>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">OTIF (%)<InfoTip text="On-Time In-Full delivery percentage." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm font-semibold text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.otif}%</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Distribution Sites<InfoTip text="Number of retailer distribution centres served." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.distributionSites}</td>
                              ))}
                            </tr>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">Manufacturer<InfoTip text="Manufacturing site or company." /></span></td>
                              {comparisonData.map((s, idx) => (
                                <td key={s.supplierId} className={`text-center text-sm text-gray-800 px-3 py-2.5 ${cellBg(idx)}`}>{s.manufacturer}</td>
                              ))}
                            </tr>
                          </>)}
                          {section.key === "summary-esg" && (<>
                            <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="pl-14 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap"><span className="inline-flex items-center">ESG Compliant<InfoTip text="Whether the supplier meets ESG compliance standards based on packaging, recycling, and sustainability certifications." /></span></td>
                              {comparisonData.map((s, idx) => {
                                const isCompliant = s.esgScore >= 3
                                return (
                                  <td key={s.supplierId} className={`text-center text-sm px-3 py-2.5 ${cellBg(idx)}`}>
                                    <span className={`inline-flex items-center gap-1 font-semibold ${isCompliant ? "text-emerald-700" : "text-amber-600"}`}>
                                      {isCompliant ? (
                                        <><CheckCircle2 className="h-3.5 w-3.5" /> Compliant</>
                                      ) : (
                                        <><Triangle className="h-3.5 w-3.5" /> Partial</>
                                      )}
                                    </span>
                                  </td>
                                )
                              })}
                            </tr>
                          </>)}
                        </>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
        )
      })()}

      {/* ===== DETAILED VIEW ===== */}
      {viewMode === "detailed" && (
        <Card className="border-gray-300 p-0 overflow-hidden">
          <div className="overflow-auto max-h-[75vh]">
            <table className="w-full border-collapse">
              {/* Supplier column headers */}
              <thead className="sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th className="min-w-[220px] text-left text-xs font-bold text-gray-500 uppercase tracking-wider pl-6 pr-4 py-3 bg-white">SKU / Metric</th>
                  {comparisonData.map((s, idx) => {
                    const isBest = ranks[idx] === 1
                    return (
                      <th key={s.supplierId} className={`text-center min-w-[150px] px-3 py-3 ${isBest ? "bg-emerald-50" : "bg-white"}`}>
                        <div className="flex flex-col items-center">
                          <div className="h-4 flex items-center justify-center mb-0.5">
                            {s.isCurrent && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2 py-0 leading-tight">Current</span>
                            )}
                            {isBest && !s.isCurrent && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full px-2 py-0 leading-tight">Recommended</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{s.supplierName}</span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => {
                  const isSkuExpanded = expandedSkus.has(sku.id)
                  const skuSections = expandedSkuSections.get(sku.id) || new Set<string>()
                  const skuSupplierData = perSkuData.get(sku.id)

                  // Section definitions matching user spec
                  const detailedSections = [
                    {
                      key: "identification", label: "SKU Identification & Master Data", Icon: ClipboardCheck,
                      metrics: [
                        { label: "SKU / Material Number", tip: "Internal material or SKU reference number.", render: (d: PerSkuData) => d.skuNumber },
                        { label: "SKU Description", tip: "Full product description for the SKU.", render: (d: PerSkuData) => d.skuDescription },
                        { label: "Manufacturer SKU", tip: "Supplier's own SKU or product code.", render: (d: PerSkuData) => d.manufacturerSku },
                      ],
                    },
                    {
                      key: "financial", label: "Financial", Icon: PoundSterling,
                      metrics: [
                        { label: "Unit Price (DDP)", tip: "Delivered Duty Paid price per unit.", render: (d: PerSkuData) => `\u00A3${d.costPrice.toFixed(2)}`, bold: true },
                        { label: "Unit Price (EXW)", tip: "Ex-Works price per unit before logistics.", render: (d: PerSkuData) => `\u00A3${d.exwPrice.toFixed(2)}` },
                        { label: "COGS", tip: "Cost of Goods Sold per unit.", render: (d: PerSkuData) => `\u00A3${d.cogs.toFixed(2)}` },
                        { label: "Forecasted Volume", tip: "Estimated annual purchase volume.", render: (d: PerSkuData) => d.annualVolume.toLocaleString() },
                        { label: "Annual Spend", tip: "Total projected annual expenditure.", render: (d: PerSkuData) => `\u00A3${d.annualSpend.toLocaleString()}` },
                        { label: "Total Saving", tip: "Net saving vs current contract price.", render: (d: PerSkuData) => `${d.saving >= 0 ? "+" : ""}\u00A3${Math.abs(d.saving).toLocaleString()}`, color: (d: PerSkuData) => d.saving >= 0 ? "text-emerald-700" : "text-red-600", bold: true },
                        { label: "Price Change (%)", tip: "Percentage change from current baseline.", render: (d: PerSkuData) => `${d.priceChange > 0 ? "+" : ""}${d.priceChange}%`, color: (d: PerSkuData) => d.priceChange <= 0 ? "text-emerald-700" : "text-red-600" },
                      ],
                    },
                    {
                      key: "specifications", label: "Product Specifications", Icon: ShieldCheck,
                      metrics: [
                        { label: "Spec Requirement 1", tip: "Primary product specification requirement.", render: (d: PerSkuData) => d.specReq1 },
                        { label: "Spec Requirement 2", tip: "Secondary product specification requirement.", render: (d: PerSkuData) => d.specReq2 },
                        { label: "Spec Requirement 3", tip: "Tertiary product specification requirement.", render: (d: PerSkuData) => d.specReq3 },
                        { label: "Certification / Food Label", tip: "Required certifications or food labelling.", render: (d: PerSkuData) => d.certification },
                      ],
                    },
                    {
                      key: "packaging", label: "Physical & Packaging Attributes", Icon: BoxIcon,
                      metrics: [
                        { label: "Pack Size", tip: "Number of units in a retail pack.", render: (d: PerSkuData) => d.packSize },
                        { label: "Pack Type", tip: "Type of retail packaging used.", render: (d: PerSkuData) => d.packType },
                        { label: "Case Size", tip: "Number of retail packs per case.", render: (d: PerSkuData) => String(d.caseSize) },
                        { label: "Cases per Pallet", tip: "Number of cases per standard pallet.", render: (d: PerSkuData) => String(d.casesPerPallet) },
                        { label: "Unit Weight (g)", tip: "Net weight of one unit in grams.", render: (d: PerSkuData) => `${d.unitWeight}g` },
                        { label: "Packaging Weight (g)", tip: "Weight of packaging per unit in grams.", render: (d: PerSkuData) => `${d.packagingWeight}g` },
                        { label: "Packaging Type", tip: "Primary packaging material type.", render: (d: PerSkuData) => d.packagingType },
                        { label: "Primary Material", tip: "Main material composition of packaging.", render: (d: PerSkuData) => d.primaryMaterial },
                        { label: "Recycling Type", tip: "How the packaging is recycled or disposed.", render: (d: PerSkuData) => d.recyclingType },
                        { label: "SRP", tip: "Shelf-Ready Packaging availability.", render: (d: PerSkuData) => d.srp ? "Yes" : "No" },
                        { label: "Print Colours", tip: "Number of print colours on packaging.", render: (d: PerSkuData) => String(d.printColours) },
                      ],
                    },
                    {
                      key: "shelflife", label: "Shelf Life & Storage", Icon: Clock,
                      metrics: [
                        { label: "Shelf Life (Days)", tip: "Product shelf life from production.", render: (d: PerSkuData) => `${d.shelfLife} days` },
                        { label: "Storage Conditions", tip: "Required storage temperature or conditions.", render: (d: PerSkuData) => d.storageConditions },
                      ],
                    },
                    {
                      key: "supplychain", label: "Supply Chain Attributes", Icon: Globe,
                      metrics: [
                        { label: "Country of Origin", tip: "Country where the product is manufactured.", render: (d: PerSkuData) => d.countryOfOrigin },
                        { label: "Minimum Order Qty (MOQ)", tip: "Minimum order quantity per purchase order.", render: (d: PerSkuData) => d.moq.toLocaleString(), bold: true },
                        { label: "UOM", tip: "Unit of measure for ordering.", render: (d: PerSkuData) => d.uom },
                      ],
                    },
                  ]

                  return (
                    <React.Fragment key={sku.id}>
                      {/* SKU row - collapsible */}
                      <tr
                        onClick={() => toggleSku(sku.id)}
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200/80 border-b border-gray-200 transition-colors"
                      >
                        <td colSpan={comparisonData.length + 1} className="pl-5 pr-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <ChevronDown className={`h-4 w-4 text-gray-600 shrink-0 transition-transform ${isSkuExpanded ? "" : "-rotate-90"}`} />
                            <Package className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="text-sm font-bold text-gray-900">{sku.name.replace(/\s+\d+pk$/i, "").replace(/\s*[-–]\s*(Single|[0-9]+ Pack|Multi[- ]?pack).*$/i, "")}</span>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded SKU: sub-section dropdowns */}
                      {isSkuExpanded && detailedSections.map((section) => {
                        const isSectionExpanded = skuSections.has(section.key)
                        const SIcon = section.Icon
                        return (
                          <React.Fragment key={section.key}>
                            {/* Sub-section header row */}
                            <tr
                              onClick={() => toggleSkuSection(sku.id, section.key)}
                              className="cursor-pointer bg-gray-50 hover:bg-gray-100/80 border-b border-gray-100 transition-colors"
                            >
                              <td colSpan={comparisonData.length + 1} className="pl-10 pr-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <ChevronDown className={`h-3.5 w-3.5 text-gray-500 shrink-0 transition-transform ${isSectionExpanded ? "" : "-rotate-90"}`} />
                                  <SIcon className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                                  <span className="text-sm font-semibold text-gray-700">{section.label}</span>
                                </div>
                              </td>
                            </tr>

                            {/* Metric rows */}
                            {isSectionExpanded && section.metrics.map((metric) => (
                              <tr key={metric.label} className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                <td className="pl-16 pr-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                                  <span className="inline-flex items-center">{metric.label}{metric.tip && <InfoTip text={metric.tip} />}</span>
                                </td>
                                {comparisonData.map((s, idx) => {
                                  const d = skuSupplierData?.get(s.supplierId)
                                  if (!d || !d.hasOffer) return <td key={s.supplierId} className={`text-center text-sm text-gray-300 px-3 py-2.5 ${cellBg(idx)}`}>-</td>
                                  const colorClass = metric.color ? metric.color(d) : "text-gray-800"
                                  return (
                                    <td key={s.supplierId} className={`text-center text-sm px-3 py-2.5 ${cellBg(idx)} ${metric.bold ? "font-semibold" : ""} ${colorClass}`}>
                                      {metric.render(d)}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </React.Fragment>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
