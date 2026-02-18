"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Zap,
  FileText,
  Search,
  Plus,
  X,
  Truck,
  Calendar,
  Send,
  AlertCircle,
  CheckCircle2,
  StickyNote,
  Settings2,
  FlaskConical,
  ArrowRight,
  Package,
  Building2,
  Users,
} from "lucide-react"

const TAB_ITEMS = [
  { value: "rapid", label: "Rapid Price Discovery", icon: Zap },
  { value: "tender", label: "Full Tender", icon: FileText },
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
      {TAB_ITEMS.map((tab) => {
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  skus,
  suppliers,
  tenders,
  type SKU,
  type Supplier,
  type Tender,
  getCompletedPriceDiscoveries,
} from "@/lib/data"
import { AIChatBot } from "@/components/ai-chat-bot"
import { useRouter } from "next/navigation"
import { WorkflowStepIndicator } from "@/components/workflow-step"

export default function TenderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const preSelectedSupplierIds = useMemo(
    () => searchParams.get("suppliers")?.split(",").filter(Boolean) || [],
    [searchParams],
  )
  const preSelectedSkuIds = useMemo(() => searchParams.get("skus")?.split(",").filter(Boolean) || [], [searchParams])
  const tenderTypeParam = searchParams.get("type") as "rapid" | "tender" | null

  // Sub-module selection
  const [activeSubModule, setActiveSubModule] = useState(tenderTypeParam || "rapid")

  // SKU selection state
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
  const [selectedSkus, setSelectedSkus] = useState<SKU[]>([])
  const [skuSearch, setSkuSearch] = useState("")

  // Terms state
  const [tenderName, setTenderName] = useState("")
  const [responseDeadline, setResponseDeadline] = useState("")
  const [deliveryLocation, setDeliveryLocation] = useState("Central Distribution Centre, Bradford")
  const [deliveryFrequency, setDeliveryFrequency] = useState("daily")
  const [paymentTerms, setPaymentTerms] = useState("30")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const [allowAlternativeSpecs, setAllowAlternativeSpecs] = useState(false)
  const [requestSamples, setRequestSamples] = useState(false)
  const [contractLength, setContractLength] = useState("12")
  const [volumeCommitment, setVolumeCommitment] = useState("committed")
  const [qualityStandards, setQualityStandards] = useState("")
  const [evaluationCriteria, setEvaluationCriteria] = useState("")

  // Supplier selection state
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
  const [supplierSearch, setSupplierSearch] = useState("")

  // New SKU dialog
  const [isNewSkuDialogOpen, setIsNewSkuDialogOpen] = useState(false)
  const [newSkuName, setNewSkuName] = useState("")
  const [newSkuSubcategory, setNewSkuSubcategory] = useState("")
  const [newSkuPackSize, setNewSkuPackSize] = useState("")
  const [newSkuVolume, setNewSkuVolume] = useState("")

  // Success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdTenderId, setCreatedTenderId] = useState("")
  const [createdTenderType, setCreatedTenderType] = useState<"rapid" | "tender">("rapid")

  const [selectedPriceDiscovery, setSelectedPriceDiscovery] = useState<string>("")
  const completedPriceDiscoveries = useMemo(() => getCompletedPriceDiscoveries(), [])

  // Get unique subcategories from SKUs
  const subcategories = useMemo(() => [...new Set(skus.map((sku) => sku.subcategory))], [])

  const initialLoadDone = useRef(false)

  // Load pre-selected suppliers and SKUs from URL params - only run once on mount
  useEffect(() => {
    if (initialLoadDone.current) return
    initialLoadDone.current = true

    if (preSelectedSupplierIds.length > 0) {
      const preselected = suppliers.filter((s) => preSelectedSupplierIds.includes(s.id))
      setSelectedSuppliers(preselected)
    }

    if (preSelectedSkuIds.length > 0) {
      const preselected = skus.filter((sku) => preSelectedSkuIds.includes(sku.id))
      setSelectedSkus(preselected)
      // If SKUs are pre-selected, try to set the subcategory
      if (preselected.length > 0) {
        setSelectedSubcategory(preselected[0].subcategory)
      }
    }
  }, [preSelectedSupplierIds, preSelectedSkuIds])

  const lastPriceDiscoveryId = useRef<string>("")

  useEffect(() => {
    // Only run if the selection actually changed
    if (selectedPriceDiscovery === lastPriceDiscoveryId.current) return
    lastPriceDiscoveryId.current = selectedPriceDiscovery

    if (selectedPriceDiscovery && selectedPriceDiscovery !== "none" && activeSubModule === "tender") {
      const pd = completedPriceDiscoveries.find((t) => t.id === selectedPriceDiscovery)
      if (pd) {
        // Pre-fill SKUs
        const pdSkus = skus.filter((sku) => pd.skuIds.includes(sku.id))
        setSelectedSkus(pdSkus)

        // Pre-fill Suppliers
        const pdSuppliers = suppliers.filter((s) => pd.supplierIds.includes(s.id))
        setSelectedSuppliers(pdSuppliers)

        // Pre-fill tender name based on price discovery
        setTenderName(`${pd.name} - Full Tender`)
      }
    }
  }, [selectedPriceDiscovery, activeSubModule, completedPriceDiscoveries])

  // Filter SKUs by subcategory and search
  const availableSkus = useMemo(
    () =>
      skus.filter((sku) => {
        const matchesCategory =
          !selectedSubcategory || selectedSubcategory === "all" || sku.subcategory === selectedSubcategory
        const matchesSearch = !skuSearch || sku.name.toLowerCase().includes(skuSearch.toLowerCase())
        const notAlreadySelected = !selectedSkus.find((s) => s.id === sku.id)
        return matchesCategory && matchesSearch && notAlreadySelected
      }),
    [selectedSubcategory, skuSearch, selectedSkus],
  )

  // Filter suppliers by search and capability
  const availableSuppliers = useMemo(
    () =>
      suppliers.filter((supplier) => {
        const matchesSearch =
          !supplierSearch ||
          supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
          supplier.canSupply.some((cat) => cat.toLowerCase().includes(supplierSearch.toLowerCase()))
        const notAlreadySelected = !selectedSuppliers.find((s) => s.id === supplier.id)

        // If SKUs are selected, filter to suppliers who can supply those categories
        if (selectedSkus.length > 0) {
          const requiredCategories = [...new Set(selectedSkus.map((sku) => sku.subcategory))]
          const canSupplyRequired = requiredCategories.some((cat) => supplier.canSupply.includes(cat))
          return matchesSearch && notAlreadySelected && canSupplyRequired
        }

        return matchesSearch && notAlreadySelected
      }),
    [supplierSearch, selectedSuppliers, selectedSkus],
  )

  const handleAddSku = (sku: SKU) => {
    setSelectedSkus([...selectedSkus, sku])
  }

  const handleRemoveSku = (skuId: string) => {
    setSelectedSkus(selectedSkus.filter((s) => s.id !== skuId))
  }

  const handleAddNewSku = () => {
    const newSku: SKU = {
      id: `SKU_NEW_${Date.now()}`,
      name: newSkuName,
      category: "Cakes", // Default category, could be made dynamic
      subcategory: newSkuSubcategory || "Sponge Cakes", // Default subcategory if not provided
      packSize: newSkuPackSize,
      shelfLife: "5 days", // Default, could be dynamic
      storageTemp: "Ambient", // Default, could be dynamic
      weeklyVolume: Number.parseInt(newSkuVolume) || 0,
      currentSupplier: "", // Default
      currentCostPrice: 0, // Default
      retailPrice: 0, // Default
      specs: {
        // Default specs, could be made dynamic
        weight: "",
        ingredients: [],
        allergens: [],
        nutritionPer100g: { calories: 0, fat: 0, sugar: 0, protein: 0 },
      },
    }
    setSelectedSkus([...selectedSkus, newSku])
    setIsNewSkuDialogOpen(false)
    setNewSkuName("")
    setNewSkuSubcategory("")
    setNewSkuPackSize("")
    setNewSkuVolume("")
  }

  const handleAddSupplier = (supplier: Supplier) => {
    setSelectedSuppliers([...selectedSuppliers, supplier])
  }

  const handleRemoveSupplier = (supplierId: string) => {
    setSelectedSuppliers(selectedSuppliers.filter((s) => s.id !== supplierId))
  }

  const handleSelectAllSkusInCategory = () => {
    if (selectedSubcategory && selectedSubcategory !== "all") {
      const categorySkus = skus.filter((sku) => sku.subcategory === selectedSubcategory)
      setSelectedSkus([...selectedSkus, ...categorySkus.filter((sku) => !selectedSkus.find((s) => s.id === sku.id))])
    }
  }

  const estimatedValue = useMemo(
    () => selectedSkus.reduce((sum, sku) => sum + (sku.currentCostPrice || 0) * (sku.weeklyVolume || 0) * 52, 0),
    [selectedSkus],
  )

  const canGenerate =
    selectedSkus.length > 0 && selectedSuppliers.length > 0 && tenderName && responseDeadline && deliveryLocation

  const handleGenerateTender = (type: "rapid" | "tender") => {
    const newTenderId = `TND${String(tenders.length + 1).padStart(3, "0")}`

    const newTender: Tender = {
      id: newTenderId,
      name: tenderName,
      description: additionalNotes || `${type === "rapid" ? "Rapid price discovery" : "Full tender"} for selected SKUs`,
      skuIds: selectedSkus.map((sku) => sku.id),
      supplierIds: selectedSuppliers.map((s) => s.id),
      status: "open",
      type: type === "rapid" ? "price_discovery" : "full_tender",
      linkedPriceDiscoveryId: type === "tender" && selectedPriceDiscovery ? selectedPriceDiscovery : undefined,
      createdDate: new Date().toISOString().split("T")[0],
      closeDate: responseDeadline,
      estimatedValue: estimatedValue,
      responses: 0,
      leadBuyer: "Sarah Mitchell",
    }

    tenders.push(newTender)

    setCreatedTenderId(newTenderId)
    setCreatedTenderType(type)
    setShowSuccessDialog(true)
  }

  const SkuSelectionCard = () => (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          1. Select SKUs
        </CardTitle>
        <CardDescription>
          Choose products to include in {activeSubModule === "rapid" ? "price discovery" : "this tender"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subcategory Filter */}
        <div className="space-y-2">
          <Label>Filter by Sub-category</Label>
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger>
              <SelectValue placeholder="All sub-categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sub-categories</SelectItem>
              {subcategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SKU Search */}
        <div className="space-y-2">
          <Label>Search SKUs</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={skuSearch}
              onChange={(e) => setSkuSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {selectedSubcategory && selectedSubcategory !== "all" && (
            <Button variant="outline" size="sm" onClick={handleSelectAllSkusInCategory}>
              Select All in {selectedSubcategory}
            </Button>
          )}
          <Dialog open={isNewSkuDialogOpen} onOpenChange={setIsNewSkuDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New SKU
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New SKU</DialogTitle>
                <DialogDescription>Create a new SKU to include in the tender</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>SKU Name</Label>
                  <Input
                    placeholder="e.g., Red Velvet Cake"
                    value={newSkuName}
                    onChange={(e) => setNewSkuName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sub-category</Label>
                  <Select value={newSkuSubcategory} onValueChange={setNewSkuSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pack Size</Label>
                  <Input
                    placeholder="e.g., Single, 4-pack"
                    value={newSkuPackSize}
                    onChange={(e) => setNewSkuPackSize(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Weekly Volume</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1000"
                    value={newSkuVolume}
                    onChange={(e) => setNewSkuVolume(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewSkuDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNewSku} disabled={!newSkuName}>
                  Add SKU
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Available SKUs */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">Available SKUs ({availableSkus.length})</Label>
          <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
            {availableSkus.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No SKUs available</p>
            ) : (
              availableSkus.map((sku) => (
                <div
                  key={sku.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleAddSku(sku)}
                >
                  <div>
                    <p className="text-sm font-medium">{sku.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {sku.subcategory} · {sku.packSize}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected SKUs */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Selected SKUs
            <Badge variant="secondary">{selectedSkus.length}</Badge>
          </Label>
          <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2 bg-primary/5 border-primary/20">
            {selectedSkus.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Click on SKUs above to add them</p>
            ) : (
              selectedSkus.map((sku) => (
                <div key={sku.id} className="flex items-center justify-between p-2 rounded-md bg-background">
                  <div>
                    <p className="text-sm font-medium">{sku.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Vol: {sku.weeklyVolume?.toLocaleString() ?? "N/A"}/wk ·{" "}
                      {sku.currentCostPrice && sku.currentCostPrice > 0 ? `£${sku.currentCostPrice.toFixed(2)}` : "New"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveSku(sku.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const SupplierSelectionCard = () => (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          3. Select Suppliers
        </CardTitle>
        <CardDescription>
          {selectedSuppliers.length > 0
            ? `${selectedSuppliers.length} supplier(s) selected`
            : `Choose suppliers to ${activeSubModule === "rapid" ? "send price discovery" : "invite to tender"}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Supplier Search */}
        <div className="space-y-2">
          <Label>Search Suppliers</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or capability..."
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Quick link to suppliers page */}
        <Link href="/suppliers">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            Browse Full Supplier Database
          </Button>
        </Link>

        {/* Available Suppliers */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">
            {selectedSkus.length > 0 ? "Capable Suppliers" : "All Suppliers"} ({availableSuppliers.length})
          </Label>
          <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
            {availableSuppliers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No suppliers available</p>
            ) : (
              availableSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleAddSupplier(supplier)}
                >
                  <div>
                    <p className="text-sm font-medium">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {supplier.country} ·{" "}
                      {supplier.accreditation?.brcGrade ? (
                        <span className="text-primary">BRC {supplier.accreditation.brcGrade}</span>
                      ) : (
                        "Not Accredited"
                      )}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Suppliers */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Selected Suppliers
            <Badge variant="secondary">{selectedSuppliers.length}</Badge>
          </Label>
          <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2 bg-primary/5 border-primary/20">
            {selectedSuppliers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Click on suppliers above to add them</p>
            ) : (
              selectedSuppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-2 rounded-md bg-background">
                  <div>
                    <p className="text-sm font-medium">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground">{supplier.country}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveSupplier(supplier.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
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
              <h1 className="text-lg font-semibold text-foreground">Launch Price Discovery / Tender</h1>
              <p className="text-sm text-muted-foreground">Create and manage procurement activities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[76rem] mx-auto px-6 pb-6">
        <WorkflowStepIndicator currentStep={4} nextStepLabel="Manage Tender" nextStepHref="/analyse" />

        {/* Sub-module Tabs */}
        <Tabs
          value={activeSubModule}
          onValueChange={(v) => setActiveSubModule(v as "rapid" | "tender")}
          className="space-y-6"
        >
          <AnimatedTabBar activeTab={activeSubModule} onTabChange={(v) => setActiveSubModule(v as "rapid" | "tender")} />

          {/* Rapid Price Discovery Tab */}
          <TabsContent value="rapid" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkuSelectionCard />

              {/* Terms Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-primary" />
                    2. Basic Terms
                  </CardTitle>
                  <CardDescription>Set the key parameters for this price discovery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Price Discovery Name *</Label>
                    <Input
                      placeholder="e.g., Q1 2026 Sponge Cakes Review"
                      value={tenderName}
                      onChange={(e) => setTenderName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Response Deadline *</Label>
                    <Input type="date" value={responseDeadline} onChange={(e) => setResponseDeadline(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Location *</Label>
                    <Input
                      placeholder="Distribution centre location"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Frequency</Label>
                    <Select value={deliveryFrequency} onValueChange={setDeliveryFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="twice-weekly">Twice Weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Terms (days)</Label>
                    <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any specific requirements or context..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <SupplierSelectionCard />
            </div>

            {/* Summary and Generate */}
            <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Price Discovery Summary</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {selectedSkus.length} SKUs
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {selectedSuppliers.length} Suppliers
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {responseDeadline || "Not set"}
                      </span>
                    </div>
                    <p className="text-sm">
                      Estimated Annual Value:{" "}
                      <span className="font-semibold text-primary">£{estimatedValue.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!canGenerate && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Complete all required fields</span>
                      </div>
                    )}
                    <Button
                      size="lg"
                      className="gap-2"
                      disabled={!canGenerate}
                      onClick={() => handleGenerateTender("rapid")}
                    >
                      <Send className="h-4 w-4" />
                      Generate Price Discovery Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full Tender Tab */}
          <TabsContent value="tender" className="space-y-6">
            {/* Start from Price Discovery Option */}
            {completedPriceDiscoveries.length > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Start from Price Discovery
                  </CardTitle>
                  <CardDescription>
                    Pre-fill SKUs and suppliers from a completed price discovery exercise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedPriceDiscovery} onValueChange={setSelectedPriceDiscovery}>
                    <SelectTrigger className="w-full md:w-96">
                      <SelectValue placeholder="Select a completed price discovery..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Start from scratch</SelectItem>
                      {completedPriceDiscoveries.map((pd) => (
                        <SelectItem key={pd.id} value={pd.id}>
                          {pd.name} - {pd.skuIds.length} SKUs, {pd.supplierIds.length} suppliers
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPriceDiscovery && selectedPriceDiscovery !== "none" && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>SKUs and suppliers pre-filled from selected price discovery</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkuSelectionCard />

              {/* Extended Terms Card for Full Tender */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    2. Tender Terms
                  </CardTitle>
                  <CardDescription>Configure full tender requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tender Name *</Label>
                    <Input
                      placeholder="e.g., FY26 Celebration Cakes Tender"
                      value={tenderName}
                      onChange={(e) => setTenderName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Response Deadline *</Label>
                    <Input type="date" value={responseDeadline} onChange={(e) => setResponseDeadline(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Location *</Label>
                    <Input
                      placeholder="Distribution centre location"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Delivery Frequency</Label>
                      <Select value={deliveryFrequency} onValueChange={setDeliveryFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="twice-weekly">Twice Weekly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="45">45 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Contract Length</Label>
                      <Select value={contractLength} onValueChange={setContractLength}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Volume Commitment</Label>
                      <Select value={volumeCommitment} onValueChange={setVolumeCommitment}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="committed">Committed Volume</SelectItem>
                          <SelectItem value="forecast">Forecast Only</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tender Options */}
                  <div className="space-y-3 pt-2 border-t">
                    <Label className="text-sm font-medium">Tender Options</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alt-specs"
                        checked={allowAlternativeSpecs}
                        onCheckedChange={(checked) => setAllowAlternativeSpecs(checked as boolean)}
                      />
                      <label htmlFor="alt-specs" className="text-sm text-muted-foreground cursor-pointer">
                        Allow suppliers to offer alternative specifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="samples"
                        checked={requestSamples}
                        onCheckedChange={(checked) => setRequestSamples(checked as boolean)}
                      />
                      <label htmlFor="samples" className="text-sm text-muted-foreground cursor-pointer">
                        Request samples alongside submission
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality Standards</Label>
                    <Textarea
                      placeholder="e.g., BRC Grade A minimum, specific allergen requirements..."
                      value={qualityStandards}
                      onChange={(e) => setQualityStandards(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Evaluation Criteria</Label>
                    <Textarea
                      placeholder="e.g., 40% price, 30% quality, 20% service, 10% sustainability..."
                      value={evaluationCriteria}
                      onChange={(e) => setEvaluationCriteria(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any specific requirements or context..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <SupplierSelectionCard />
            </div>

            {/* Summary and Generate */}
            <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Full Tender Summary</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {selectedSkus.length} SKUs
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {selectedSuppliers.length} Suppliers
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {responseDeadline || "Not set"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        {contractLength} month contract
                      </span>
                      {allowAlternativeSpecs && (
                        <Badge variant="secondary" className="text-xs">
                          <Settings2 className="h-3 w-3 mr-1" />
                          Alt Specs
                        </Badge>
                      )}
                      {requestSamples && (
                        <Badge variant="secondary" className="text-xs">
                          <FlaskConical className="h-3 w-3 mr-1" />
                          Samples
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">
                      Estimated Annual Value:{" "}
                      <span className="font-semibold text-primary">£{estimatedValue.toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!canGenerate && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Complete all required fields</span>
                      </div>
                    )}
                    <Button
                      size="lg"
                      className="gap-2"
                      disabled={!canGenerate}
                      onClick={() => handleGenerateTender("tender")}
                    >
                      <Send className="h-4 w-4" />
                      Generate Tender Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              {createdTenderType === "rapid" ? "Price Discovery" : "Tender"} Created Successfully
            </DialogTitle>
            <DialogDescription>
              Your {createdTenderType === "rapid" ? "price discovery request" : "tender"} has been created and is ready
              to send to suppliers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Reference:</span>{" "}
                <span className="font-mono font-medium">{createdTenderId}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Name:</span> <span className="font-medium">{tenderName}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">SKUs:</span> {selectedSkus.length}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Suppliers:</span> {selectedSuppliers.length}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Response Deadline:</span> {responseDeadline}
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
              Create Another
            </Button>
            <Link href="/analyse">
              <Button className="w-full sm:w-auto">
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Analyse Offers
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIChatBot />
    </div>
  )
}
