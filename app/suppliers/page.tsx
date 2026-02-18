"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MapPin,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Users,
  CheckCircle2,
  ChevronRight,
  Truck,
  PoundSterling,
  Target,
  Globe,
  Sparkles,
  ExternalLink,
  Loader2,
  Building2,
  Zap,
  FileText,
} from "lucide-react"
import { suppliers as initialSuppliers, calculateInclusionScore, type Supplier } from "@/lib/data"
import { WorkflowStepIndicator } from "@/components/workflow-step"

interface FoundSupplier {
  name: string
  description: string
  location: string
  country: string
  website: string
  products: string[]
  estimatedRevenue: string
  certifications: string[]
}

function SuppliersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedForTender, setSelectedForTender] = useState<string[]>([])
  const [newNote, setNewNote] = useState("")

  const [newSupplierForm, setNewSupplierForm] = useState({
    name: "",
    contactName: "",
    contactEmail: "",
    location: "",
    country: "United Kingdom",
    canSupply: [] as string[],
  })

  const [isFindSupplierOpen, setIsFindSupplierOpen] = useState(false)
  const [findCategory, setFindCategory] = useState("")
  const [findCountry, setFindCountry] = useState("")
  const [findCertification, setFindCertification] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [foundSuppliers, setFoundSuppliers] = useState<FoundSupplier[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const [showTenderTypeDialog, setShowTenderTypeDialog] = useState(false)

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setCategorySearch(decodeURIComponent(categoryFromUrl))
    }
  }, [searchParams])

  // Get unique values for filters
  const allCountries = [...new Set(suppliers.map((s) => s.country).filter(Boolean))]
  const allCategories = [...new Set(suppliers.flatMap((s) => s.canSupply || []).filter(Boolean))]

  const handleAISearch = async () => {
    setIsSearching(true)
    setHasSearched(true)

    // Simulate AI search delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock results based on search criteria
    const mockResults: FoundSupplier[] = [
      {
        name: "Artisan Bakes UK Ltd",
        description:
          "Family-run bakery specialising in premium celebration cakes and sponges. Supplies several independent retailers across the Midlands.",
        location: "Birmingham",
        country: "UK",
        website: "https://www.artisanbakesuk.co.uk",
        products: ["Single cakes", "Special event cakes", "Cake trays"],
        estimatedRevenue: "£8-12m",
        certifications: ["BRC Grade A", "Organic Certified"],
      },
      {
        name: "Nordic Pastry Co",
        description:
          "Scandinavian-style bakery with modern production facility. Known for high-quality croissants and Danish pastries.",
        location: "Copenhagen",
        country: "Denmark",
        website: "https://www.nordicpastry.dk",
        products: ["French bakery", "Tarts"],
        estimatedRevenue: "£15-20m",
        certifications: ["BRC Grade AA", "IFS"],
      },
      {
        name: "Sweet Traditions Bakery",
        description:
          "Large-scale bakery manufacturer with retail experience supplying Co-op and Waitrose. Strong track record in private label.",
        location: "Leeds",
        country: "UK",
        website: "https://www.sweettraditions.co.uk",
        products: ["Single cakes", "Multipack cakes", "Cake trays"],
        estimatedRevenue: "£25-35m",
        certifications: ["BRC Grade AA", "SALSA", "Red Tractor"],
      },
      {
        name: "Euro Confections GmbH",
        description:
          "German manufacturer with state-of-the-art facility. Competitive pricing and strong logistics network across Europe.",
        location: "Munich",
        country: "Germany",
        website: "https://www.euroconfections.de",
        products: ["Tarts", "French bakery", "Special event cakes"],
        estimatedRevenue: "£40-50m",
        certifications: ["BRC Grade A", "IFS", "ISO 22000"],
      },
      {
        name: "Celtic Cakes Ltd",
        description:
          "Welsh bakery with focus on traditional recipes. Growing rapidly with recent investment in new production line.",
        location: "Cardiff",
        country: "UK",
        website: "https://www.celticcakes.co.uk",
        products: ["Single cakes", "Multipack cakes", "Muffins and cupcakes"],
        estimatedRevenue: "£5-8m",
        certifications: ["BRC Grade B", "Welsh Quality"],
      },
    ]

    // Filter based on criteria
    let filtered = mockResults
    if (findCountry && findCountry !== "any") {
      filtered = filtered.filter(
        (s) => s.country.toLowerCase() === findCountry.toLowerCase() || (findCountry === "UK" && s.country === "UK"),
      )
    }
    if (findCategory) {
      filtered = filtered.filter((s) => s.products.some((p) => p.toLowerCase().includes(findCategory.toLowerCase())))
    }
    if (findCertification && findCertification !== "any") {
      filtered = filtered.filter((s) =>
        s.certifications.some((c) => c.toLowerCase().includes(findCertification.toLowerCase())),
      )
    }

    setFoundSuppliers(filtered.length > 0 ? filtered : mockResults.slice(0, 3))
    setIsSearching(false)
  }

  const handleAddFoundSupplier = (found: FoundSupplier) => {
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: found.name,
      location: found.location,
      country: found.country,
      contactName: "To be confirmed",
      contactEmail: "contact@supplier.com",
      status: "potential",
      currentSupplier: false,
      subCategoriesSupplied: [],
      canSupply: found.products,
      otherRetailers: [],
      financialHealth: {
        revenue: Number.parseInt(found.estimatedRevenue.replace(/[^0-9]/g, "")) || 10,
        rating: "Good",
        trend: "stable",
      },
      accreditation: {
        brcGrade:
          found.certifications
            .find((c) => c.includes("BRC"))
            ?.split(" ")
            .pop() || "A",
        auditScore: 85,
        lastAuditDate: new Date().toISOString().split("T")[0],
        certifications: found.certifications,
      },
      otifPerformance: null,
      notes: [`Added via AI search on ${new Date().toLocaleDateString("en-GB")}`, `Website: ${found.website}`],
    }
    setSuppliers([...suppliers, newSupplier])
    setFoundSuppliers(foundSuppliers.filter((f) => f.name !== found.name))
  }

  // Handler for new supplier form submission
  const handleAddNewSupplier = () => {
    if (!newSupplierForm.name.trim() || !newSupplierForm.contactEmail.trim()) return

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplierForm.name,
      location: newSupplierForm.location || newSupplierForm.country,
      country: newSupplierForm.country,
      contactName: newSupplierForm.contactName || "To be confirmed",
      contactEmail: newSupplierForm.contactEmail,
      status: "potential",
      currentSupplier: false,
      subCategoriesSupplied: [],
      canSupply: newSupplierForm.canSupply,
      otherRetailers: [],
      financialHealth: {
        revenue: 0,
        rating: "Good",
        trend: "stable",
      },
      accreditation: {
        brcGrade: "Pending",
        auditScore: 0,
        lastAuditDate: "",
        certifications: [],
      },
      otifPerformance: null,
      notes: [`Added manually on ${new Date().toLocaleDateString("en-GB")}`],
    }
    setSuppliers([...suppliers, newSupplier])
    setNewSupplierForm({
      name: "",
      contactName: "",
      contactEmail: "",
      location: "",
      country: "United Kingdom",
      canSupply: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleToggleCanSupply = (category: string) => {
    setNewSupplierForm((prev) => ({
      ...prev,
      canSupply: prev.canSupply.includes(category)
        ? prev.canSupply.filter((c) => c !== category)
        : [...prev.canSupply, category],
    }))
  }

  // Filter and score suppliers
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.canSupply.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
      const matchesCountry = countryFilter === "all" || supplier.country === countryFilter

      const matchesCategory =
        !categorySearch ||
        categorySearch === "all" ||
        supplier.canSupply.some((p) => p.toLowerCase().includes(categorySearch.toLowerCase()))

      return matchesSearch && matchesStatus && matchesCountry && matchesCategory
    })

    // If searching by category, calculate and sort by inclusion score
    if (categorySearch && categorySearch !== "all") {
      filtered = filtered
        .map((supplier) => ({
          ...supplier,
          inclusionData: calculateInclusionScore(supplier, categorySearch),
        }))
        .sort((a, b) => (b.inclusionData?.score || 0) - (a.inclusionData?.score || 0))
    }

    return filtered
  }, [suppliers, searchTerm, statusFilter, countryFilter, categorySearch])

  // Stats
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const currentSuppliers = suppliers.filter((s) => s.currentSupplier).length
  const avgOtif =
    suppliers.filter((s) => s.otifPerformance !== null).reduce((sum, s) => sum + (s.otifPerformance || 0), 0) /
    suppliers.filter((s) => s.otifPerformance !== null).length

  const handleAddNote = (supplierId: string) => {
    if (!newNote.trim()) return
    setSuppliers(suppliers.map((s) => (s.id === supplierId ? { ...s, notes: [...s.notes, newNote] } : s)))
    if (selectedSupplier?.id === supplierId) {
      setSelectedSupplier({
        ...selectedSupplier,
        notes: [...selectedSupplier.notes, newNote],
      })
    }
    setNewNote("")
  }

  const handleToggleSelectForTender = (supplierId: string) => {
    setSelectedForTender((prev) =>
      prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId],
    )
  }

  const handleTenderTypeSelect = (type: "rapid" | "tender") => {
    sessionStorage.setItem("tenderSuppliers", JSON.stringify(selectedForTender))
    if (categorySearch && categorySearch !== "all") {
      sessionStorage.setItem("tenderCategory", categorySearch)
    }
    sessionStorage.setItem("tenderType", type)
    setShowTenderTypeDialog(false)
    router.push("/tender")
  }

  const handleLaunchTenderClick = () => {
    if (selectedForTender.length > 0) {
      setShowTenderTypeDialog(true)
    } else {
      router.push("/tender")
    }
  }

  const getFinancialHealthColor = (rating: string) => {
    switch (rating) {
      case "Strong":
        return "text-emerald-600 bg-emerald-50"
      case "Good":
        return "text-blue-600 bg-blue-50"
      case "Fair":
        return "text-amber-600 bg-amber-50"
      case "Weak":
        return "text-red-600 bg-red-50"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-emerald-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getBrcBadgeColor = (grade: string) => {
    switch (grade) {
      case "AA":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "A":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "B":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "C":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getOtifColor = (otif: number) => {
    if (otif >= 95) return "text-emerald-600"
    if (otif >= 90) return "text-blue-600"
    if (otif >= 85) return "text-amber-600"
    return "text-red-600"
  }

  const getInclusionScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-blue-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="page-header-gradient sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-lg font-semibold text-white">Add / Review Suppliers</h1>
            </div>
            <div className="flex items-center gap-3">
              <Dialog
                open={isFindSupplierOpen}
                onOpenChange={(open) => {
                  setIsFindSupplierOpen(open)
                  if (!open) {
                    setFoundSuppliers([])
                    setHasSearched(false)
                    setFindCategory("")
                    setFindCountry("")
                    setFindCertification("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                    <Sparkles className="h-4 w-4" />
                    Find New Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Supplier Discovery
                    </DialogTitle>
                    <DialogDescription>
                      Search the web for potential new suppliers based on your criteria
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Search Criteria */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Product Category</Label>
                        <Select value={findCategory} onValueChange={setFindCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Celebration Cakes">Celebration Cakes</SelectItem>
                            <SelectItem value="Everyday Cakes">Everyday Cakes</SelectItem>
                            <SelectItem value="Multipack Cakes">Multipack Cakes</SelectItem>
                            <SelectItem value="Tarts">Tarts</SelectItem>
                            <SelectItem value="Pastries">Pastries</SelectItem>
                            <SelectItem value="Cookies">Cookies</SelectItem>
                            <SelectItem value="Brownies">Brownies</SelectItem>
                            <SelectItem value="Donuts">Donuts</SelectItem>
                            <SelectItem value="Breads">Breads</SelectItem>
                            <SelectItem value="Seasonal Bakery">Seasonal Bakery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Country Preference</Label>
                        <Select value={findCountry} onValueChange={setFindCountry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any Country</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Poland">Poland</SelectItem>
                            <SelectItem value="Netherlands">Netherlands</SelectItem>
                            <SelectItem value="Denmark">Denmark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Min. Certification</Label>
                        <Select value={findCertification} onValueChange={setFindCertification}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any certification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any Certification</SelectItem>
                            <SelectItem value="BRC Grade AA">BRC Grade AA</SelectItem>
                            <SelectItem value="BRC Grade A">BRC Grade A</SelectItem>
                            <SelectItem value="BRC">Any BRC</SelectItem>
                            <SelectItem value="Organic">Organic Certified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleAISearch} disabled={isSearching} className="w-full">
                      {isSearching ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching the web...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Search for Suppliers
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Results */}
                  {hasSearched && (
                    <div className="flex-1 overflow-y-auto border-t border-border pt-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        {isSearching ? "Searching..." : `Found ${foundSuppliers.length} potential suppliers`}
                      </h4>

                      {!isSearching && foundSuppliers.length > 0 && (
                        <div className="space-y-3">
                          {foundSuppliers.map((supplier, index) => (
                            <Card key={index} className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <h5 className="font-semibold text-foreground">{supplier.name}</h5>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{supplier.description}</p>

                                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {supplier.location}, {supplier.country}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <PoundSterling className="h-3 w-3" />
                                      {supplier.estimatedRevenue}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {supplier.certifications.map((cert) => (
                                      <Badge key={cert} variant="outline" className="text-xs">
                                        {cert}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Visit
                                    </a>
                                  </Button>
                                  <Button size="sm" onClick={() => handleAddFoundSupplier(supplier)}>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Supplier</DialogTitle>
                    <DialogDescription>Enter details for a new potential supplier</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="supplier-name">Company Name *</Label>
                        <Input
                          id="supplier-name"
                          placeholder="e.g., Artisan Bakes Ltd"
                          value={newSupplierForm.name}
                          onChange={(e) => setNewSupplierForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact-name">Contact Name</Label>
                        <Input
                          id="contact-name"
                          placeholder="e.g., John Smith"
                          value={newSupplierForm.contactName}
                          onChange={(e) => setNewSupplierForm((prev) => ({ ...prev, contactName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="e.g., contact@supplier.com"
                          value={newSupplierForm.contactEmail}
                          onChange={(e) => setNewSupplierForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location / City</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Manchester"
                          value={newSupplierForm.location}
                          onChange={(e) => setNewSupplierForm((prev) => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={newSupplierForm.country}
                        onValueChange={(value) => setNewSupplierForm((prev) => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Poland">Poland</SelectItem>
                          <SelectItem value="Netherlands">Netherlands</SelectItem>
                          <SelectItem value="Denmark">Denmark</SelectItem>
                          <SelectItem value="Belgium">Belgium</SelectItem>
                          <SelectItem value="Ireland">Ireland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>What can they supply? (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto border border-border rounded-md p-3">
                        {[
                          "Celebration Cakes",
                          "Everyday Cakes",
                          "Multipack Cakes",
                          "Tarts",
                          "Pastries",
                          "Cookies",
                          "Brownies",
                          "Donuts",
                          "Breads",
                          "Seasonal Bakery",
                        ].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`supply-${category}`}
                              checked={newSupplierForm.canSupply.includes(category)}
                              onCheckedChange={() => handleToggleCanSupply(category)}
                            />
                            <label
                              htmlFor={`supply-${category}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                      {newSupplierForm.canSupply.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {newSupplierForm.canSupply.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddNewSupplier}
                      disabled={!newSupplierForm.name.trim() || !newSupplierForm.contactEmail.trim()}
                    >
                      Add Supplier
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <WorkflowStepIndicator
          currentStep={2}
          nextStepLabel="Launch Price Discovery"
          nextStepHref="/tender"
          onNextClick={handleLaunchTenderClick}
          selectedCount={selectedForTender.length}
        />

        {selectedForTender.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {selectedForTender.length} supplier{selectedForTender.length !== 1 ? "s" : ""} selected for tender
              </span>
              {categorySearch && categorySearch !== "all" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {categorySearch}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedForTender([])}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </Button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Suppliers</p>
                <p className="text-2xl font-semibold">{activeSuppliers}</p>
              </div>
              <Users className="h-8 w-8 text-primary/20" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Suppliers</p>
                <p className="text-2xl font-semibold">{currentSuppliers}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/20" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg OTIF</p>
                <p className="text-2xl font-semibold">{isNaN(avgOtif) ? 0 : avgOtif.toFixed(1)}%</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500/20" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accredited</p>
                <p className="text-2xl font-semibold">
                  {
                    suppliers.filter((s) => s.accreditation.brcGrade === "AA" || s.accreditation.brcGrade === "A")
                      .length
                  }
                </p>
              </div>
              <Shield className="h-8 w-8 text-amber-500/20" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name, location, or capability..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="w-48">
                <Select value={categorySearch} onValueChange={setCategorySearch}>
                  <SelectTrigger>
                    <Target className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Search for tender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="potential">Potential</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {allCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {categorySearch && categorySearch !== "all" && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium">
                Showing suppliers ranked by &quot;Strength of Inclusion&quot; score for tendering {categorySearch}
              </p>
            </div>
          )}
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredSuppliers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No suppliers found matching your criteria</p>
              </Card>
            ) : (
              filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedSupplier?.id === supplier.id ? "ring-2 ring-primary" : ""
                  } ${selectedForTender.includes(supplier.id) ? "bg-primary/5" : ""}`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedForTender.includes(supplier.id)}
                        onCheckedChange={() => handleToggleSelectForTender(supplier.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            supplier.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : supplier.status === "potential"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {supplier.status}
                        </Badge>
                        {supplier.currentSupplier && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Current Supplier
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.location}, {supplier.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {supplier.contactEmail}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`${getFinancialHealthColor(supplier.financialHealth.rating)} border`}
                        >
                          <span className="flex items-center gap-1">
                            {getTrendIcon(supplier.financialHealth.trend)}£{supplier.financialHealth.revenue}m
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getBrcBadgeColor(supplier.accreditation.brcGrade)}>
                          BRC {supplier.accreditation.brcGrade}
                        </Badge>
                        {supplier.otifPerformance !== null && (
                          <Badge variant="outline" className="bg-muted">
                            <span className={getOtifColor(supplier.otifPerformance)}>
                              OTIF {supplier.otifPerformance}%
                            </span>
                          </Badge>
                        )}
                      </div>

                      {/* Inclusion Score when searching by category */}
                      {"inclusionData" in supplier && supplier.inclusionData && (
                        <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">Strength of Inclusion</span>
                            <span className="text-xs font-semibold">{supplier.inclusionData.score}/100</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getInclusionScoreColor(supplier.inclusionData.score)}`}
                              style={{ width: `${supplier.inclusionData.score}%` }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {supplier.inclusionData.factors.map((factor: string, idx: number) => (
                              <span key={idx} className="text-[10px] text-muted-foreground">
                                {factor}
                                {idx < supplier.inclusionData!.factors.length - 1 ? " •" : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mt-2">
                        {supplier.canSupply.slice(0, 4).map((product) => (
                          <Badge key={product} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {supplier.canSupply.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{supplier.canSupply.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Supplier Detail Panel */}
          <div className="lg:col-span-1">
            {selectedSupplier ? (
              <Card className="p-4 sticky top-24">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedSupplier.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedSupplier.location}, {selectedSupplier.country}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Financial Health</p>
                      <p className="font-semibold">{selectedSupplier.financialHealth.rating}</p>
                      <p className="text-xs text-muted-foreground">£{selectedSupplier.financialHealth.revenue}m rev</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">BRC Grade</p>
                      <p className="font-semibold">{selectedSupplier.accreditation.brcGrade}</p>
                      <p className="text-xs text-muted-foreground">
                        Score: {selectedSupplier.accreditation.auditScore}%
                      </p>
                    </div>
                    {selectedSupplier.otifPerformance !== null && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">OTIF Performance</p>
                        <p className={`font-semibold ${getOtifColor(selectedSupplier.otifPerformance)}`}>
                          {selectedSupplier.otifPerformance}%
                        </p>
                      </div>
                    )}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Other Retailers</p>
                      <p className="font-semibold">{selectedSupplier.otherRetailers.length || "None"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Currently Supplies</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSupplier.subCategoriesSupplied.length > 0 ? (
                        selectedSupplier.subCategoriesSupplied.map((cat) => (
                          <Badge key={cat} variant="default" className="text-xs">
                            {cat}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Not a current supplier</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Can Supply</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSupplier.canSupply.map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSupplier.accreditation.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedSupplier.otherRetailers.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Other Retailers</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSupplier.otherRetailers.map((retailer) => (
                          <Badge key={retailer} variant="outline" className="text-xs">
                            {retailer}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Notes</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedSupplier.notes.length > 0 ? (
                        selectedSupplier.notes.map((note, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {note}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No notes yet</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="text-sm min-h-[60px]"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => handleAddNote(selectedSupplier.id)}
                      disabled={!newNote.trim()}
                    >
                      Add Note
                    </Button>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Contact</p>
                    <p className="text-sm font-medium">{selectedSupplier.contactName}</p>
                    <p className="text-sm text-muted-foreground">{selectedSupplier.contactEmail}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">Select a supplier to view details</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showTenderTypeDialog} onOpenChange={setShowTenderTypeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Choose Tender Type</DialogTitle>
            <DialogDescription>
              Select how you want to engage with {selectedForTender.length} supplier
              {selectedForTender.length !== 1 ? "s" : ""}
              {categorySearch && categorySearch !== "all" ? ` for ${categorySearch}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card
              className="p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors"
              onClick={() => handleTenderTypeSelect("rapid")}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-amber-100">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Rapid Price Discovery</h4>
                  <p className="text-sm text-muted-foreground mt-1">Quick pricing check with minimal detail required</p>
                </div>
              </div>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors"
              onClick={() => handleTenderTypeSelect("tender")}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Full Tender</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive tender with detailed terms and specs
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={null}>
      <SuppliersContent />
    </Suspense>
  )
}
