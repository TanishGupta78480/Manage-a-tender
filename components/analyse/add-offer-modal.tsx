"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Building2,
  Package,
  PoundSterling,
  BoxSelect,
  Truck,
  ShieldCheck,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  FileUp,
  Loader2,
  CheckCircle2,
  Sparkles,
  X,
  Save,
  Send,
  Info,
  Globe,
  Eye,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

interface SupplierQualification {
  registeredCompanyName: string
  registeredHeadOffice: string
  companyRegistrationNumber: string
  registrationAuthority: string
  supplierDisplayName: string
  websiteLink: string
}

interface SkuLineItem {
  id: string
  // Step 2: SKU / Product Details
  subCategory: string
  skuNumber: string
  skuDescription: string
  unitWeight: string
  brandTier: string
  specRequirement1: string
  specRequirement2: string
  specRequirement3: string
  certification: string
  // Step 3: Commercial & Pricing
  currency: string
  unitPriceDDP: string
  unitPriceEXW: string
  cogs: string
  forecastedAnnualVolume: string
  paymentTerms: string
  // Step 4: Packaging
  packSize: string
  packType: string
  packagingType: string
  packagingTypeText: string
  primaryPackagingMaterial: string
  packagingWeight: string
  packagingRecyclingType: string
  srpVsStandardBox: string
  srp: string
  printColours: string
  // Step 5: Logistics & Supply
  caseSize: string
  casesPerPallet: string
  maximumLeadTime: string
  deliveryFrequency: string
  deliveryTerms: string
  moq: string
  uom: string
  otif: string
  distributionSites: string
  // Step 6: Compliance & Notes
  manufacturer: string
  manufacturerSku: string
  countryOfOrigin: string
  allergens: string
  storageConditions: string
  shelfLife: string
  comments: string
}

interface AddOfferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { qualification: SupplierQualification; skus: SkuLineItem[]; investment: SupplierInvestment }) => void
}

// ── Constants ──────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: "Supplier & Company", icon: Building2 },
  { num: 2, label: "SKU & Specifications", icon: Package },
  { num: 3, label: "Financial & Pricing", icon: PoundSterling },
  { num: 4, label: "Physical & Packaging", icon: BoxSelect },
  { num: 5, label: "Supply Chain & Logistics", icon: Truck },
  { num: 6, label: "Compliance & Storage", icon: ShieldCheck },
  { num: 7, label: "Review & Submit", icon: ClipboardCheck },
] as const

const CURRENCIES = ["GBP", "EUR", "USD", "CHF", "SEK", "NOK", "DKK", "PLN"]
const BRAND_TIERS = ["Premium", "Standard", "Value", "Economy"]
const PACKAGING_TYPES = ["Flow Wrap", "Tray", "Bag", "Box", "Pouch", "Sleeve", "Carton", "Blister"]
const RECYCLING_TYPES = ["Widely Recycled", "Check Locally", "Not Currently Recycled", "Recyclable"]
const SRP_OPTIONS = ["SRP", "Standard Box"]
const STORAGE_CONDITIONS = ["Ambient", "Chilled", "Frozen", "Temperature Controlled"]
const COUNTRIES = [
  "United Kingdom", "Ireland", "France", "Germany", "Netherlands", "Belgium",
  "Spain", "Italy", "Poland", "Czech Republic", "Turkey", "China", "India",
  "United States", "Canada", "Brazil", "Thailand", "Vietnam", "Other",
]
const ALLERGENS = [
  "Gluten", "Crustaceans", "Eggs", "Fish", "Peanuts", "Soybeans",
  "Milk", "Nuts", "Celery", "Mustard", "Sesame", "Sulphites", "Lupin", "Molluscs",
]

const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "Net 90", "Prepay", "COD"]
const DELIVERY_TERMS = ["DDP", "EXW", "FOB", "CIF", "DAP", "FCA"]
const PACK_TYPES = ["Flow Wrap", "Box", "Bag", "Pouch", "Tray", "Sleeve", "Carton", "Blister"]
const DELIVERY_FREQUENCIES = ["Daily", "4x weekly", "3x weekly", "2x weekly", "Weekly", "Bi-weekly", "Monthly"]
const UOM_OPTIONS = ["Cases", "Units", "Pallets", "Kg", "Litres"]

function createEmptySku(): SkuLineItem {
  return {
    id: `sku-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    subCategory: "", skuNumber: "", skuDescription: "", unitWeight: "",
    brandTier: "", specRequirement1: "", specRequirement2: "", specRequirement3: "",
    certification: "",
    currency: "GBP", unitPriceDDP: "", unitPriceEXW: "", cogs: "",
    forecastedAnnualVolume: "", paymentTerms: "",
    packSize: "", packType: "", packagingType: "", packagingTypeText: "",
    primaryPackagingMaterial: "", packagingWeight: "", packagingRecyclingType: "",
    srpVsStandardBox: "", srp: "", printColours: "",
    caseSize: "", casesPerPallet: "", maximumLeadTime: "", deliveryFrequency: "",
    deliveryTerms: "", moq: "", uom: "", otif: "", distributionSites: "",
    manufacturer: "", manufacturerSku: "", countryOfOrigin: "", allergens: "",
    storageConditions: "", shelfLife: "", comments: "",
  }
}

// ── Supplier Investment (offer-level) ──────────────────────────────────────

interface SupplierInvestment {
  fixedInvestment: string
  promotionalInvestment: string
  otherInvestment: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function RequiredMark() {
  return <span className="text-red-500 ml-0.5">*</span>
}

function FieldLabel({ label, required, tooltip }: { label: string; required?: boolean; tooltip?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <RequiredMark />}
      </Label>
      {tooltip && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function AddOfferModal({ open, onOpenChange, onSubmit }: AddOfferModalProps) {
  const [modalTab, setModalTab] = useState<"upload" | "manual">("upload")
  const [currentStep, setCurrentStep] = useState(1)

  // Upload state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  // Form state
  const [qualification, setQualification] = useState<SupplierQualification>({
    registeredCompanyName: "",
    registeredHeadOffice: "",
    companyRegistrationNumber: "",
    registrationAuthority: "",
    supplierDisplayName: "",
    websiteLink: "",
  })

  const [investment, setInvestment] = useState<SupplierInvestment>({
    fixedInvestment: "",
    promotionalInvestment: "",
    otherInvestment: "",
  })

  const [skuItems, setSkuItems] = useState<SkuLineItem[]>([createEmptySku()])
  const [activeSkuIndex, setActiveSkuIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const activeSku = skuItems[activeSkuIndex] || skuItems[0]

  // ── SKU Management ──

  const addSku = () => {
    setSkuItems([...skuItems, createEmptySku()])
    setActiveSkuIndex(skuItems.length)
  }

  const removeSku = (index: number) => {
    if (skuItems.length <= 1) return
    const updated = skuItems.filter((_, i) => i !== index)
    setSkuItems(updated)
    setActiveSkuIndex(Math.min(activeSkuIndex, updated.length - 1))
  }

  const copyFromPrevious = () => {
    if (activeSkuIndex === 0) return
    const prev = skuItems[activeSkuIndex - 1]
    const current = skuItems[activeSkuIndex]
    setSkuItems(
      skuItems.map((s, i) =>
        i === activeSkuIndex
          ? { ...prev, id: current.id, skuNumber: "", skuDescription: "" }
          : s,
      ),
    )
  }

  const updateSku = (field: keyof SkuLineItem, value: string) => {
    setSkuItems(
      skuItems.map((s, i) => (i === activeSkuIndex ? { ...s, [field]: value } : s)),
    )
    // Clear error for field
    if (errors[`sku.${activeSkuIndex}.${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`sku.${activeSkuIndex}.${field}`]
      setErrors(newErrors)
    }
  }

  const updateQualification = (field: keyof SupplierQualification, value: string) => {
    setQualification({ ...qualification, [field]: value })
    if (errors[`qual.${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`qual.${field}`]
      setErrors(newErrors)
    }
  }

  // ── Validation ──

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!qualification.registeredCompanyName.trim()) newErrors["qual.registeredCompanyName"] = "Required"
      if (!qualification.supplierDisplayName.trim()) newErrors["qual.supplierDisplayName"] = "Required"
    }

    if (step === 2) {
      skuItems.forEach((sku, i) => {
        if (!sku.skuNumber.trim()) newErrors[`sku.${i}.skuNumber`] = "Required"
        if (!sku.skuDescription.trim()) newErrors[`sku.${i}.skuDescription`] = "Required"
        if (!sku.unitWeight.trim()) newErrors[`sku.${i}.unitWeight`] = "Required"
      })
    }

    if (step === 3) {
      skuItems.forEach((sku, i) => {
        if (!sku.currency) newErrors[`sku.${i}.currency`] = "Required"
        if (!sku.unitPriceDDP.trim()) newErrors[`sku.${i}.unitPriceDDP`] = "Required"
      })
    }

    if (step === 5) {
      skuItems.forEach((sku, i) => {
        if (!sku.maximumLeadTime.trim()) newErrors[`sku.${i}.maximumLeadTime`] = "Required"
        if (!sku.deliveryFrequency.trim()) newErrors[`sku.${i}.deliveryFrequency`] = "Required"
      })
    }

    if (step === 6) {
      skuItems.forEach((sku, i) => {
        if (!sku.shelfLife.trim()) newErrors[`sku.${i}.shelfLife`] = "Required"
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 7))
    }
  }

  const handleBack = () => setCurrentStep(Math.max(currentStep - 1, 1))

  const handleSaveDraft = () => {
    // In a real app this would persist to backend
    onOpenChange(false)
  }

  const handleSubmit = () => {
    onSubmit({ qualification, skus: skuItems, investment })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setCurrentStep(1)
    setQualification({
      registeredCompanyName: "", registeredHeadOffice: "",
      companyRegistrationNumber: "", registrationAuthority: "",
      supplierDisplayName: "", websiteLink: "",
    })
    setInvestment({ fixedInvestment: "", promotionalInvestment: "", otherInvestment: "" })
    setSkuItems([createEmptySku()])
    setActiveSkuIndex(0)
    setErrors({})
    setUploadedFile(null)
    setUploadComplete(false)
  }

  // ── Upload Handlers ──

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase()
      if (ext !== "xlsx" && ext !== "xls") return
      setUploadedFile(file)
      processFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase()
      if (ext !== "xlsx" && ext !== "xls") return
      setUploadedFile(file)
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 2500))
    // Simulate extracted data
    setQualification({
      registeredCompanyName: "Extracted Supplier Ltd",
      registeredHeadOffice: "London, UK",
      companyRegistrationNumber: "12345678",
      registrationAuthority: "Companies House",
      supplierDisplayName: "Extracted Supplier",
      websiteLink: "https://example.com",
    })
    const extracted = createEmptySku()
    extracted.skuNumber = "SKU-001"
    extracted.skuDescription = "Extracted Product"
    extracted.unitWeight = "250"
    extracted.currency = "GBP"
    extracted.unitPriceDDP = "1.25"
    extracted.shelfLife = "180"
    extracted.maximumLeadTime = "14"
    extracted.deliveryFrequency = "Weekly"
    setSkuItems([extracted])
    setIsProcessing(false)
    setUploadComplete(true)
  }

  // ── Error helper ──

  const fieldError = (key: string) => errors[key]

  // ── Preview Data ──

  const previewData = useMemo(() => {
    const s = activeSku
    const sym = s.currency === "GBP" ? "\u00A3" : s.currency === "EUR" ? "\u20AC" : s.currency === "USD" ? "$" : ""
    return [
      { label: "Supplier", value: qualification.supplierDisplayName || "---" },
      { label: "SKU", value: s.skuNumber || "---" },
      { label: "DDP Price", value: s.unitPriceDDP ? `${sym}${s.unitPriceDDP}` : "---" },
      { label: "EXW Price", value: s.unitPriceEXW ? `${sym}${s.unitPriceEXW}` : "---" },
      { label: "COGS", value: s.cogs ? `${sym}${s.cogs}` : "---" },
      { label: "Payment Terms", value: s.paymentTerms || "---" },
      { label: "Lead Time", value: s.maximumLeadTime ? `${s.maximumLeadTime} days` : "---" },
      { label: "Delivery", value: s.deliveryFrequency || "---" },
      { label: "Incoterms", value: s.deliveryTerms || "---" },
      { label: "MOQ", value: s.moq || "---" },
      { label: "Shelf Life", value: s.shelfLife ? `${s.shelfLife} days` : "---" },
      { label: "Pack Size", value: s.packSize || "---" },
      { label: "Packaging", value: s.packagingType || "---" },
      { label: "Unit Weight", value: s.unitWeight ? `${s.unitWeight}g` : "---" },
    ]
  }, [activeSku, qualification.supplierDisplayName])

  // ── Step Progress ──

  const completedSteps = useMemo(() => {
    const done = new Set<number>()
    if (qualification.registeredCompanyName && qualification.supplierDisplayName) done.add(1)
    if (skuItems.some((s) => s.skuNumber && s.skuDescription && s.unitWeight)) done.add(2)
    if (skuItems.some((s) => s.currency && s.unitPriceDDP)) done.add(3)
    if (skuItems.some((s) => s.packagingType || s.packagingTypeText || s.packSize)) done.add(4)
    if (skuItems.some((s) => s.maximumLeadTime && s.deliveryFrequency)) done.add(5)    
    if (skuItems.some((s) => s.shelfLife)) done.add(6)
    return done
  }, [qualification, skuItems])

  // ── Render Helpers ──

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts?: { required?: boolean; type?: string; placeholder?: string; errorKey?: string; tooltip?: string; prefix?: string },
  ) => (
    <div className="space-y-1.5">
      <FieldLabel label={label} required={opts?.required} tooltip={opts?.tooltip} />
      <div className="relative">
        {opts?.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{opts.prefix}</span>
        )}
        <Input
          type={opts?.type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={opts?.placeholder}
          className={`${opts?.prefix ? "pl-7" : ""} ${opts?.errorKey && fieldError(opts.errorKey) ? "border-red-400 focus-visible:ring-red-400" : ""}`}
        />
      </div>
      {opts?.errorKey && fieldError(opts.errorKey) && (
        <p className="text-xs text-red-500">{fieldError(opts.errorKey)}</p>
      )}
    </div>
  )

  const renderSelect = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: string[],
    opts?: { required?: boolean; placeholder?: string; errorKey?: string },
  ) => (
    <div className="space-y-1.5">
      <FieldLabel label={label} required={opts?.required} />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={opts?.errorKey && fieldError(opts.errorKey) ? "border-red-400" : ""}>
          <SelectValue placeholder={opts?.placeholder || `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {opts?.errorKey && fieldError(opts.errorKey) && (
        <p className="text-xs text-red-500">{fieldError(opts.errorKey)}</p>
      )}
    </div>
  )

  // ── SKU Tab Selector ──

  const SkuTabs = () => (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {skuItems.map((sku, i) => (
        <div key={sku.id} className="flex items-center gap-0">
          <button
            onClick={() => setActiveSkuIndex(i)}
            className={`px-3 py-1.5 text-sm font-medium rounded-l-md border transition-colors cursor-pointer ${
              activeSkuIndex === i
                ? "bg-[#3b5bdb] text-white border-[#3b5bdb]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            SKU {i + 1}{sku.skuNumber ? `: ${sku.skuNumber}` : ""}
          </button>
          {skuItems.length > 1 && (
            <button
              onClick={() => removeSku(i)}
              className="px-1.5 py-1.5 text-sm rounded-r-md border border-l-0 border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {skuItems.length === 1 && <div className="rounded-r-md border border-l-0 border-transparent w-0" />}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addSku} className="gap-1.5 text-xs h-8">
        <Plus className="h-3.5 w-3.5" />
        Add SKU
      </Button>
      {activeSkuIndex > 0 && (
        <Button variant="ghost" size="sm" onClick={copyFromPrevious} className="gap-1.5 text-xs h-8 text-muted-foreground">
          <Copy className="h-3.5 w-3.5" />
          Copy from previous
        </Button>
      )}
    </div>
  )

  // ── Step Renderers ──

  const renderStep1 = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Supplier Qualification</h3>
        <p className="text-sm text-muted-foreground">Company registration and identification details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderInput("Registered Company Name", qualification.registeredCompanyName,
          (v) => updateQualification("registeredCompanyName", v),
          { required: true, errorKey: "qual.registeredCompanyName", placeholder: "e.g. Acme Foods Ltd" })}
        {renderInput("Supplier Display Name", qualification.supplierDisplayName,
          (v) => updateQualification("supplierDisplayName", v),
          { required: true, errorKey: "qual.supplierDisplayName", placeholder: "Name shown in comparison" })}
        {renderInput("Registered Head Office", qualification.registeredHeadOffice,
          (v) => updateQualification("registeredHeadOffice", v),
          { placeholder: "Full address" })}
        {renderInput("Registration Authority", qualification.registrationAuthority,
          (v) => updateQualification("registrationAuthority", v),
          { placeholder: "e.g. Companies House" })}
        {renderInput("Company Registration Number", qualification.companyRegistrationNumber,
          (v) => updateQualification("companyRegistrationNumber", v),
          { placeholder: "e.g. 12345678" })}
        {renderInput("Website Link", qualification.websiteLink,
          (v) => updateQualification("websiteLink", v),
          { placeholder: "https://...", type: "url" })}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">SKU Identification & Specifications</h3>
        <p className="text-sm text-muted-foreground">Product identification, master data, and specification requirements per SKU</p>
      </div>
      <SkuTabs />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderInput("SKU Number", activeSku.skuNumber, (v) => updateSku("skuNumber", v),
          { required: true, errorKey: `sku.${activeSkuIndex}.skuNumber`, placeholder: "e.g. SKU-10042" })}
        {renderInput("SKU Description", activeSku.skuDescription, (v) => updateSku("skuDescription", v),
          { required: true, errorKey: `sku.${activeSkuIndex}.skuDescription`, placeholder: "Product description" })}
        {renderInput("Unit weight (g)", activeSku.unitWeight, (v) => updateSku("unitWeight", v),
          { required: true, type: "number", errorKey: `sku.${activeSkuIndex}.unitWeight`, placeholder: "e.g. 500" })}
        {renderInput("Sub Category", activeSku.subCategory, (v) => updateSku("subCategory", v),
          { placeholder: "e.g. Morning Goods" })}
        {renderSelect("Brand tier", activeSku.brandTier, (v) => updateSku("brandTier", v), BRAND_TIERS)}
        {renderInput("Certification", activeSku.certification, (v) => updateSku("certification", v),
          { placeholder: "e.g. BRC AA, Organic" })}
      </div>
      <CollapsibleSection title="Spec Requirements (Optional)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Spec Requirement 1", activeSku.specRequirement1, (v) => updateSku("specRequirement1", v), { placeholder: "Specification detail" })}
          {renderInput("Spec Requirement 2", activeSku.specRequirement2, (v) => updateSku("specRequirement2", v), { placeholder: "Specification detail" })}
          {renderInput("Spec Requirement 3", activeSku.specRequirement3, (v) => updateSku("specRequirement3", v), { placeholder: "Specification detail" })}
        </div>
      </CollapsibleSection>
    </div>
  )

  const renderStep3 = () => {
    const currSymbol = activeSku.currency === "GBP" ? "\u00A3" : activeSku.currency === "EUR" ? "\u20AC" : activeSku.currency === "USD" ? "$" : ""
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">Financial & Pricing</h3>
          <p className="text-sm text-muted-foreground">Cost prices, COGS, volumes, payment terms, and supplier investment per SKU</p>
        </div>
        <SkuTabs />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {renderSelect("Currency", activeSku.currency, (v) => updateSku("currency", v), CURRENCIES,
            { required: true, errorKey: `sku.${activeSkuIndex}.currency` })}
          {renderInput("Unit Price (DDP)", activeSku.unitPriceDDP, (v) => updateSku("unitPriceDDP", v),
            { required: true, type: "number", errorKey: `sku.${activeSkuIndex}.unitPriceDDP`, prefix: currSymbol, placeholder: "0.00", tooltip: "Delivered Duty Paid price per unit" })}
          {renderInput("Unit Price (EXW)", activeSku.unitPriceEXW, (v) => updateSku("unitPriceEXW", v),
            { type: "number", prefix: currSymbol, placeholder: "0.00", tooltip: "Ex-Works price per unit" })}
          {renderInput("COGS", activeSku.cogs, (v) => updateSku("cogs", v),
            { type: "number", prefix: currSymbol, placeholder: "0.00", tooltip: "Cost of Goods Sold per unit" })}
          {renderInput("Forecasted Annual Volume", activeSku.forecastedAnnualVolume, (v) => updateSku("forecastedAnnualVolume", v),
            { type: "number", placeholder: "e.g. 500000", tooltip: "Pre-filled by buyer, editable" })}
          {renderSelect("Payment Terms", activeSku.paymentTerms, (v) => updateSku("paymentTerms", v), PAYMENT_TERMS,
            { placeholder: "Select terms" })}
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Supplier Investment</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput("Fixed Investment", investment.fixedInvestment,
              (v) => setInvestment({ ...investment, fixedInvestment: v }),
              { type: "number", prefix: "\u00A3", placeholder: "0" })}
            {renderInput("Promotional Investment", investment.promotionalInvestment,
              (v) => setInvestment({ ...investment, promotionalInvestment: v }),
              { type: "number", prefix: "\u00A3", placeholder: "0" })}
            {renderInput("Other Investment", investment.otherInvestment,
              (v) => setInvestment({ ...investment, otherInvestment: v }),
              { type: "number", prefix: "\u00A3", placeholder: "0" })}
          </div>
        </div>
      </div>
    )
  }

  const renderStep4 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Physical & Packaging Attributes</h3>
        <p className="text-sm text-muted-foreground">Pack size, type, packaging details, materials, and sustainability per SKU</p>
      </div>
      <SkuTabs />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderInput("Pack Size", activeSku.packSize, (v) => updateSku("packSize", v),
          { placeholder: "e.g. 400g, 6-pack", tooltip: "Consumer-facing pack size" })}
        {renderSelect("Pack Type", activeSku.packType, (v) => updateSku("packType", v), PACK_TYPES,
          { placeholder: "Select pack type" })}
        {renderSelect("Packaging Type", activeSku.packagingType, (v) => updateSku("packagingType", v), PACKAGING_TYPES)}
        {renderInput("Packaging Type (Free Text)", activeSku.packagingTypeText, (v) => updateSku("packagingTypeText", v),
          { placeholder: "If not in dropdown" })}
        {renderInput("Primary Packaging Material", activeSku.primaryPackagingMaterial, (v) => updateSku("primaryPackagingMaterial", v),
          { placeholder: "e.g. LDPE, rPET, Corrugated" })}
        {renderInput("Packaging Weight (g)", activeSku.packagingWeight, (v) => updateSku("packagingWeight", v),
          { type: "number", placeholder: "Weight in grams" })}
        {renderSelect("Packaging Recycling Type", activeSku.packagingRecyclingType, (v) => updateSku("packagingRecyclingType", v), RECYCLING_TYPES)}
        {renderSelect("SRP vs Standard Box", activeSku.srpVsStandardBox, (v) => updateSku("srpVsStandardBox", v), SRP_OPTIONS)}
        {renderInput("Print Colours", activeSku.printColours, (v) => updateSku("printColours", v),
          { type: "number", placeholder: "e.g. 4", tooltip: "Number of print colours on packaging" })}
      </div>
      <CollapsibleSection title="Additional Packaging Options">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel label="Shelf-Ready Packaging (SRP)?" tooltip="Does the packaging allow direct shelf placement?" />
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={activeSku.srp === "Yes"}
                onCheckedChange={(checked) => updateSku("srp", checked ? "Yes" : "No")}
              />
              <span className="text-sm text-muted-foreground">{activeSku.srp === "Yes" ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Supply Chain & Logistics</h3>
        <p className="text-sm text-muted-foreground">Case config, lead times, delivery terms, MOQ, OTIF, and distribution per SKU</p>
      </div>
      <SkuTabs />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderInput("Case Size", activeSku.caseSize, (v) => updateSku("caseSize", v),
          { type: "number", placeholder: "Units per case", tooltip: "Number of individual units packed per case" })}
        {renderInput("Cases per Pallet", activeSku.casesPerPallet, (v) => updateSku("casesPerPallet", v),
          { type: "number", placeholder: "e.g. 80" })}
        {renderInput("Maximum Lead Time (Days)", activeSku.maximumLeadTime, (v) => updateSku("maximumLeadTime", v),
          { required: true, type: "number", errorKey: `sku.${activeSkuIndex}.maximumLeadTime`, placeholder: "e.g. 14", tooltip: "Longest lead time from order to delivery" })}
        {renderSelect("Delivery Frequency", activeSku.deliveryFrequency, (v) => updateSku("deliveryFrequency", v), DELIVERY_FREQUENCIES,
          { required: true, errorKey: `sku.${activeSkuIndex}.deliveryFrequency`, placeholder: "Select frequency" })}
        {renderSelect("Delivery Terms (Incoterms)", activeSku.deliveryTerms, (v) => updateSku("deliveryTerms", v), DELIVERY_TERMS,
          { placeholder: "Select terms" })}
        {renderInput("MOQ (Minimum Order Qty)", activeSku.moq, (v) => updateSku("moq", v),
          { type: "number", placeholder: "e.g. 500", tooltip: "Minimum order quantity per order" })}
        {renderSelect("UOM (Unit of Measure)", activeSku.uom, (v) => updateSku("uom", v), UOM_OPTIONS,
          { placeholder: "Select UOM" })}
        {renderInput("OTIF (%)", activeSku.otif, (v) => updateSku("otif", v),
          { type: "number", placeholder: "e.g. 98.5", tooltip: "On-Time In-Full delivery percentage" })}
        {renderInput("Distribution Sites", activeSku.distributionSites, (v) => updateSku("distributionSites", v),
          { type: "number", placeholder: "e.g. 12", tooltip: "Number of retailer distribution centres served" })}
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Compliance & Storage</h3>
        <p className="text-sm text-muted-foreground">Manufacturer, origin, allergens, shelf life, storage conditions, and notes per SKU</p>
      </div>
      <SkuTabs />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderInput("Manufacturer", activeSku.manufacturer, (v) => updateSku("manufacturer", v),
          { placeholder: "Manufacturing company name" })}
        {renderInput("Manufacturer SKU #", activeSku.manufacturerSku, (v) => updateSku("manufacturerSku", v),
          { placeholder: "Manufacturer reference" })}
        {renderSelect("Country of Origin (COO)", activeSku.countryOfOrigin, (v) => updateSku("countryOfOrigin", v), COUNTRIES)}
        {renderInput("Allergens", activeSku.allergens, (v) => updateSku("allergens", v),
          { placeholder: "e.g. Gluten, Milk, Eggs" })}
        {renderSelect("Storage Conditions", activeSku.storageConditions, (v) => updateSku("storageConditions", v), STORAGE_CONDITIONS)}
        {renderInput("Shelf Life (Days)", activeSku.shelfLife, (v) => updateSku("shelfLife", v),
          { required: true, type: "number", errorKey: `sku.${activeSkuIndex}.shelfLife`, placeholder: "e.g. 180" })}
      </div>
      <div className="space-y-1.5">
        <FieldLabel label="Comments" />
        <Textarea
          value={activeSku.comments}
          onChange={(e) => updateSku("comments", e.target.value)}
          placeholder="Additional notes or comments about this SKU..."
          rows={3}
        />
      </div>
    </div>
  )

  const renderStep7 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Review & Submit</h3>
        <p className="text-sm text-muted-foreground">Verify all details before submitting your offer</p>
      </div>

      {/* Supplier Qualification Summary */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#3b5bdb]/10 to-[#3b5bdb]/5 px-4 py-2.5 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#3b5bdb]" />
            Supplier Qualification
          </h4>
        </div>
        <div className="p-4 grid grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company</span>
            <span className="font-medium">{qualification.registeredCompanyName || "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Display Name</span>
            <span className="font-medium">{qualification.supplierDisplayName || "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Head Office</span>
            <span className="font-medium">{qualification.registeredHeadOffice || "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reg. Number</span>
            <span className="font-medium">{qualification.companyRegistrationNumber || "---"}</span>
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      {(investment.fixedInvestment || investment.promotionalInvestment || investment.otherInvestment) && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 px-4 py-2.5 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-emerald-600" />
              Supplier Investment
            </h4>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Fixed</span>
              <span className="font-semibold">{investment.fixedInvestment ? `\u00A3${Number(investment.fixedInvestment).toLocaleString()}` : "---"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Promotional</span>
              <span className="font-semibold">{investment.promotionalInvestment ? `\u00A3${Number(investment.promotionalInvestment).toLocaleString()}` : "---"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Other</span>
              <span className="font-semibold">{investment.otherInvestment ? `\u00A3${Number(investment.otherInvestment).toLocaleString()}` : "---"}</span>
            </div>
          </div>
        </div>
      )}

      {/* SKU Line Items Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-2.5 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            SKU Line Items ({skuItems.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs font-semibold">SKU #</TableHead>
                <TableHead className="text-xs font-semibold">Description</TableHead>
                <TableHead className="text-xs font-semibold text-right">DDP</TableHead>
                <TableHead className="text-xs font-semibold text-right">EXW</TableHead>
                <TableHead className="text-xs font-semibold text-right">COGS</TableHead>
                <TableHead className="text-xs font-semibold">Terms</TableHead>
                <TableHead className="text-xs font-semibold">Lead Time</TableHead>
                <TableHead className="text-xs font-semibold">Delivery</TableHead>
                <TableHead className="text-xs font-semibold">Incoterms</TableHead>
                <TableHead className="text-xs font-semibold text-right">MOQ</TableHead>
                <TableHead className="text-xs font-semibold">Pack Size</TableHead>
                <TableHead className="text-xs font-semibold text-right">Shelf Life</TableHead>
                <TableHead className="text-xs font-semibold">Packaging</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skuItems.map((sku) => {
                const sym = sku.currency === "GBP" ? "\u00A3" : sku.currency === "EUR" ? "\u20AC" : "$"
                return (
                <TableRow key={sku.id}>
                  <TableCell className="font-medium text-sm">{sku.skuNumber || "---"}</TableCell>
                  <TableCell className="text-sm max-w-[160px] truncate">{sku.skuDescription || "---"}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{sku.unitPriceDDP ? `${sym}${sku.unitPriceDDP}` : "---"}</TableCell>
                  <TableCell className="text-sm text-right">{sku.unitPriceEXW ? `${sym}${sku.unitPriceEXW}` : "---"}</TableCell>
                  <TableCell className="text-sm text-right">{sku.cogs ? `${sym}${sku.cogs}` : "---"}</TableCell>
                  <TableCell className="text-sm">{sku.paymentTerms || "---"}</TableCell>
                  <TableCell className="text-sm">{sku.maximumLeadTime ? `${sku.maximumLeadTime}d` : "---"}</TableCell>
                  <TableCell className="text-sm">{sku.deliveryFrequency || "---"}</TableCell>
                  <TableCell className="text-sm">{sku.deliveryTerms || "---"}</TableCell>
                  <TableCell className="text-sm text-right">{sku.moq || "---"}</TableCell>
                  <TableCell className="text-sm">{sku.packSize || "---"}</TableCell>
                  <TableCell className="text-sm text-right">{sku.shelfLife ? `${sku.shelfLife}d` : "---"}</TableCell>
                  <TableCell className="text-sm">{sku.packagingType || sku.packagingTypeText || "---"}</TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )

  // ── Upload Tab ──

  const renderUploadTab = () => (
    <div className="space-y-6 p-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
          isDragging ? "border-[#3b5bdb] bg-[#3b5bdb]/5" : uploadComplete ? "border-emerald-400 bg-emerald-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#3b5bdb]" />
            <p className="font-medium text-foreground">Processing with AI...</p>
            <p className="text-sm text-muted-foreground">Extracting offer details from {uploadedFile?.name}</p>
          </div>
        ) : uploadComplete ? (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500" />
            <p className="font-medium text-emerald-700">Extraction Complete</p>
            <p className="text-sm text-muted-foreground">
              Data extracted from {uploadedFile?.name}. Switch to the Manually Fill tab to review and edit.
            </p>
            <Button variant="outline" onClick={() => setModalTab("manual")} className="gap-2">
              <Eye className="h-4 w-4" />
              Review Extracted Data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <FileUp className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <div>
              <p className="font-medium text-foreground">Drop an Excel file here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse your files</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => document.getElementById("file-upload-input")?.click()}>
              <FileUp className="h-4 w-4" />
              Browse Files
            </Button>
            <input
              id="file-upload-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )

  // ── Main Render ──

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} showCloseButton={false} className="!max-w-[80vw] !w-[80vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Add Supplier Offer</DialogTitle>
        {/* Sticky Header */}
        <div className="shrink-0 border-b border-gray-200 bg-white">
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add Supplier Offer</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Fill in the supplier offer details below</p>
              </div>
              <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex min-h-full">
              {/* Left: Form Content */}
              <div className="flex-1 min-w-0">
                {/* Stepper */}
                <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-6 py-3">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {STEPS.map((step, i) => {
                      const Icon = step.icon
                      const isActive = currentStep === step.num
                      const isDone = completedSteps.has(step.num) && currentStep > step.num
                      return (
                        <div key={step.num} className="flex items-center gap-1">
                          <button
                            onClick={() => setCurrentStep(step.num)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                              isActive
                                ? "bg-[#3b5bdb] text-white"
                                : isDone
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "text-muted-foreground hover:bg-gray-200"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">{step.label}</span>
                            <span className="lg:hidden">{step.num}</span>
                          </button>
                          {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Form */}
                <div className="p-6">
                  {/* Back / Next navigation above step content */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="gap-1.5 text-muted-foreground px-2 h-8 text-xs"
                    >
                      <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                      Back
                    </Button>
                    {currentStep < 7 && (
                      <Button
                        size="sm"
                        onClick={handleNext}
                        className="gap-1.5 bg-[#3b5bdb] hover:bg-[#364fc7] px-4 h-8 text-xs"
                      >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                  {currentStep === 5 && renderStep5()}
                  {currentStep === 6 && renderStep6()}
                  {currentStep === 7 && renderStep7()}
                </div>
              </div>

              {/* Right: Preview Panel */}
              {currentStep < 7 && (
                <div className="w-60 shrink-0 border-l border-gray-200 bg-gray-50 p-3 hidden lg:block">
                  <div className="sticky top-20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Live Preview</h4>
                    <div className="space-y-2.5">
                      {previewData.map((item) => (
                        <div key={item.label}>
                          <p className="text-[11px] text-muted-foreground">{item.label}</p>
                          <p className={`text-sm font-medium ${item.value === "---" ? "text-gray-300" : "text-foreground"}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">SKUs Added</p>
                      <p className="text-lg font-semibold text-foreground">{skuItems.length}</p>
                    </div>
                    {(investment.fixedInvestment || investment.promotionalInvestment || investment.otherInvestment) && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-[11px] text-muted-foreground">Total Investment</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {"\u00A3"}{(
                              Number(investment.fixedInvestment || 0) +
                              Number(investment.promotionalInvestment || 0) +
                              Number(investment.otherInvestment || 0)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-3 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5 bg-[#3b5bdb] hover:bg-[#364fc7]">
            <Send className="h-3.5 w-3.5" />
            Add Offer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
