"use client"

import React, { useState, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  CalendarDays,
  FileText,
  PoundSterling,
  Truck,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Loader2,
  X,
  ChevronDown,
  ChevronRight,
  Paperclip,
} from "lucide-react"

// =============================================
// TYPES
// =============================================
interface ContractFormData {
  supplierLegalName: string
  contractStart: string
  contractEnd: string
  breakClauseDate: string
  noticePeriod: string
  paymentDays: string
  deliveryDetails: string
  orderDetails: string
  cpiLinked: boolean
  cpiCommodity: string
  cpiCap: string
  cpiCollar: string
  exitRationale: string
  duration: string
  pricing: string
}

interface SupplierContractData {
  supplierId: string
  supplierName: string
  totalSaving: number
  unitPriceDDP?: number
  unitPriceEXW?: number
  annualSpend?: number
  fixedInvestment?: number
  promotionalInvestment?: number
  otherInvestment?: number
  forecastedVolume?: number
  paymentTerms?: string
  deliveryFrequency?: string
  skuDetails?: {
    skuName: string
    costPrice: number
    volume: number
    annualSpend: number
    saving: number
  }[]
}

interface GenerateContractModalProps {
  open: boolean
  onClose: () => void
  supplier: SupplierContractData | null
}

export function GenerateContractModal({ open, onClose, supplier }: GenerateContractModalProps) {
  const [form, setForm] = useState<ContractFormData>({
    supplierLegalName: "",
    contractStart: "",
    contractEnd: "",
    breakClauseDate: "",
    noticePeriod: "90",
    paymentDays: supplier?.paymentTerms?.replace(/\D/g, "") || "30",
    deliveryDetails: "",
    orderDetails: "",
    cpiLinked: false,
    cpiCommodity: "",
    cpiCap: "",
    cpiCollar: "",
    exitRationale: "",
    duration: "",
    pricing: "",
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contract: true,
    delivery: false,
    cpi: false,
    exit: false,
    options: false,
    appendix: false,
  })

  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const updateField = useCallback(<K extends keyof ContractFormData>(key: K, value: ContractFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleGenerate = useCallback(() => {
    setGenerating(true)
    // Simulate PDF generation
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2500)
  }, [])

  const handleDownload = useCallback(() => {
    // Build a text representation for the contract PDF
    const lines: string[] = []
    lines.push("=" .repeat(60))
    lines.push("SUPPLY AGREEMENT CONTRACT")
    lines.push("=" .repeat(60))
    lines.push("")
    lines.push(`Supplier: ${form.supplierLegalName || supplier?.supplierName || ""}`)
    lines.push(`Contract Period: ${form.contractStart} to ${form.contractEnd}`)
    lines.push(`Break Clause: ${form.breakClauseDate || "N/A"}`)
    lines.push(`Notice Period: ${form.noticePeriod} days`)
    lines.push(`Payment Terms: ${form.paymentDays} days`)
    lines.push("")
    lines.push("-".repeat(60))
    lines.push("DELIVERY & ORDER DETAILS")
    lines.push("-".repeat(60))
    lines.push(form.deliveryDetails || "As per standard terms")
    lines.push(form.orderDetails || "")
    lines.push("")
    if (form.cpiLinked) {
      lines.push("-".repeat(60))
      lines.push("CPI-LINKED CLAUSE")
      lines.push("-".repeat(60))
      lines.push(`Commodity: ${form.cpiCommodity}`)
      lines.push(`Cap: ${form.cpiCap}%`)
      lines.push(`Collar: ${form.cpiCollar}%`)
      lines.push("")
    }
    lines.push("-".repeat(60))
    lines.push("CONTRACT OPTIONS")
    lines.push("-".repeat(60))
    lines.push(`Duration: ${form.duration}`)
    lines.push(`Pricing: ${form.pricing}`)
    lines.push("")
    lines.push("-".repeat(60))
    lines.push("APPENDIX: COST PRICES & SUPPLIER FUNDING")
    lines.push("-".repeat(60))
    lines.push(`Total Saving: GBP ${Math.abs(supplier?.totalSaving || 0).toLocaleString()}`)
    lines.push(`Fixed Investment: GBP ${(supplier?.fixedInvestment || 0).toLocaleString()}`)
    lines.push(`Promotional Investment: GBP ${(supplier?.promotionalInvestment || 0).toLocaleString()}`)
    lines.push(`Other Investment: GBP ${(supplier?.otherInvestment || 0).toLocaleString()}`)
    lines.push("")
    if (supplier?.skuDetails) {
      lines.push("SKU Cost Breakdown:")
      lines.push("SKU Name | Unit Price | Volume | Annual Spend | Saving")
      supplier.skuDetails.forEach((sku) => {
        lines.push(`${sku.skuName} | GBP ${sku.costPrice.toFixed(2)} | ${sku.volume.toLocaleString()} | GBP ${sku.annualSpend.toLocaleString()} | GBP ${Math.abs(sku.saving).toLocaleString()}`)
      })
    }
    lines.push("")
    lines.push("EXIT RATIONALE")
    lines.push(form.exitRationale || "N/A")

    const blob = new Blob([lines.join("\n")], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contract-${supplier?.supplierName?.replace(/\s+/g, "-").toLowerCase() || "supplier"}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }, [form, supplier])

  const handleExcelDownload = useCallback(() => {
    const rows: string[][] = []
    rows.push(["SKU Name", "Unit Price (DDP)", "Volume", "Annual Spend", "Saving", "Fixed Inv.", "Promo Inv.", "Other Inv."])
    if (supplier?.skuDetails) {
      supplier.skuDetails.forEach((sku) => {
        rows.push([
          sku.skuName,
          `${sku.costPrice.toFixed(2)}`,
          `${sku.volume}`,
          `${sku.annualSpend}`,
          `${sku.saving}`,
          `${supplier.fixedInvestment || 0}`,
          `${supplier.promotionalInvestment || 0}`,
          `${supplier.otherInvestment || 0}`,
        ])
      })
    }
    // Summary row
    rows.push([])
    rows.push(["SUMMARY"])
    rows.push(["Supplier", supplier?.supplierName || ""])
    rows.push(["Total Saving", `${supplier?.totalSaving || 0}`])
    rows.push(["Annual Spend", `${supplier?.annualSpend || 0}`])
    rows.push(["Fixed Investment", `${supplier?.fixedInvestment || 0}`])
    rows.push(["Promotional Investment", `${supplier?.promotionalInvestment || 0}`])
    rows.push(["Other Investment", `${supplier?.otherInvestment || 0}`])
    rows.push(["Payment Terms", supplier?.paymentTerms || ""])
    rows.push(["Delivery Frequency", supplier?.deliveryFrequency || ""])

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `supplier-details-${supplier?.supplierName?.replace(/\s+/g, "-").toLowerCase() || "supplier"}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [supplier])

  if (!supplier) return null

  const SectionHeader = ({ sectionKey, icon: Icon, label }: { sectionKey: string; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center gap-2 w-full py-2 text-sm font-bold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
    >
      {expandedSections[sectionKey] ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
      <Icon className="h-4 w-4 text-[#3b5bdb]" />
      {label}
    </button>
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Generate Contract Docs</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {supplier.supplierName} -- Estimated savings{" "}
              <span className="font-bold text-[#3b5bdb]">{"\u00A3"}{Math.abs(supplier.totalSaving).toLocaleString()}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          {/* Section 1: Contract Details */}
          <SectionHeader sectionKey="contract" icon={CalendarDays} label="Contract Details" />
          {expandedSections.contract && (
            <div className="pl-8 pb-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700">Supplier Legal Name</Label>
                <Input
                  placeholder={supplier.supplierName}
                  value={form.supplierLegalName}
                  onChange={(e) => updateField("supplierLegalName", e.target.value)}
                  className="mt-1 text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Leave blank if same as supplier name</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Contract Start</Label>
                  <Input
                    type="date"
                    value={form.contractStart}
                    onChange={(e) => updateField("contractStart", e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Contract End</Label>
                  <Input
                    type="date"
                    value={form.contractEnd}
                    onChange={(e) => updateField("contractEnd", e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Break Clause Date</Label>
                  <Input
                    type="date"
                    value={form.breakClauseDate}
                    onChange={(e) => updateField("breakClauseDate", e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-700">Notice Period (days)</Label>
                  <Input
                    type="number"
                    value={form.noticePeriod}
                    onChange={(e) => updateField("noticePeriod", e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700">Payment Days</Label>
                <Input
                  type="number"
                  value={form.paymentDays}
                  onChange={(e) => updateField("paymentDays", e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Section 2: Delivery & Orders */}
          <SectionHeader sectionKey="delivery" icon={Truck} label="Delivery & Order Details" />
          {expandedSections.delivery && (
            <div className="pl-8 pb-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700">Delivery Details</Label>
                <Textarea
                  placeholder="e.g. DDP to all 12 distribution sites, Monday-Friday delivery..."
                  value={form.deliveryDetails}
                  onChange={(e) => updateField("deliveryDetails", e.target.value)}
                  className="mt-1 text-sm min-h-[60px]"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700">Order Details</Label>
                <Textarea
                  placeholder="e.g. Minimum order quantity, lead time requirements..."
                  value={form.orderDetails}
                  onChange={(e) => updateField("orderDetails", e.target.value)}
                  className="mt-1 text-sm min-h-[60px]"
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Section 3: CPI-Linked Clause */}
          <SectionHeader sectionKey="cpi" icon={PoundSterling} label="CPI-Linked Clause" />
          {expandedSections.cpi && (
            <div className="pl-8 pb-4 space-y-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.cpiLinked}
                  onCheckedChange={(v) => updateField("cpiLinked", v)}
                />
                <Label className="text-xs font-semibold text-gray-700">Enable CPI-linked pricing clause</Label>
              </div>
              {form.cpiLinked && (
                <div className="space-y-3 pt-1">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Which Commodity</Label>
                    <Select value={form.cpiCommodity} onValueChange={(v) => updateField("cpiCommodity", v)}>
                      <SelectTrigger className="mt-1 text-sm">
                        <SelectValue placeholder="Select commodity..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="sugar">Sugar</SelectItem>
                        <SelectItem value="cocoa">Cocoa</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="palm-oil">Palm Oil</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Cap (%)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        value={form.cpiCap}
                        onChange={(e) => updateField("cpiCap", e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Collar (%)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. -3"
                        value={form.cpiCollar}
                        onChange={(e) => updateField("cpiCollar", e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Section 4: Exit Rationale */}
          <SectionHeader sectionKey="exit" icon={ShieldCheck} label="Reasons / Rationale for Exit" />
          {expandedSections.exit && (
            <div className="pl-8 pb-4">
              <Textarea
                placeholder="Document the rationale for exiting the current supplier arrangement..."
                value={form.exitRationale}
                onChange={(e) => updateField("exitRationale", e.target.value)}
                className="text-sm min-h-[80px]"
              />
            </div>
          )}

          <Separator />

          {/* Section 5: Contract Options */}
          <SectionHeader sectionKey="options" icon={FileText} label="Contract Options" />
          {expandedSections.options && (
            <div className="pl-8 pb-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-700">Duration</Label>
                <Select value={form.duration} onValueChange={(v) => updateField("duration", v)}>
                  <SelectTrigger className="mt-1 text-sm">
                    <SelectValue placeholder="Select duration type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed-12">Fixed 12 Months</SelectItem>
                    <SelectItem value="fixed-24">Fixed 24 Months</SelectItem>
                    <SelectItem value="volume-based">Volume Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700">Pricing</Label>
                <Select value={form.pricing} onValueChange={(v) => updateField("pricing", v)}>
                  <SelectTrigger className="mt-1 text-sm">
                    <SelectValue placeholder="Select pricing model..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="index">Index-Linked</SelectItem>
                    <SelectItem value="open-book">Open Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />

          {/* Section 6: Appendix -- cost prices & funding */}
          <SectionHeader sectionKey="appendix" icon={FileSpreadsheet} label="Appendix: Cost Prices & Supplier Funding" />
          {expandedSections.appendix && (
            <div className="pl-8 pb-4 space-y-3">
              <p className="text-xs text-gray-500">
                The final unpacked offer data will be attached as an appendix. You can also download the full supplier details as an Excel/CSV file.
              </p>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Fixed Inv.</p>
                  <p className="text-sm font-bold text-gray-900">{"\u00A3"}{(supplier.fixedInvestment || 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Promo Inv.</p>
                  <p className="text-sm font-bold text-gray-900">{"\u00A3"}{(supplier.promotionalInvestment || 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Other Inv.</p>
                  <p className="text-sm font-bold text-gray-900">{"\u00A3"}{(supplier.otherInvestment || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* SKU detail table */}
              {supplier.skuDetails && supplier.skuDetails.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left font-semibold text-gray-700 px-3 py-2">SKU</th>
                        <th className="text-right font-semibold text-gray-700 px-3 py-2">Unit Price</th>
                        <th className="text-right font-semibold text-gray-700 px-3 py-2">Volume</th>
                        <th className="text-right font-semibold text-gray-700 px-3 py-2">Spend</th>
                        <th className="text-right font-semibold text-gray-700 px-3 py-2">Saving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.skuDetails.map((sku) => (
                        <tr key={sku.skuName} className="border-b border-gray-100 last:border-0">
                          <td className="px-3 py-1.5 text-gray-800 font-medium">{sku.skuName}</td>
                          <td className="px-3 py-1.5 text-right text-gray-800">{"\u00A3"}{sku.costPrice.toFixed(2)}</td>
                          <td className="px-3 py-1.5 text-right text-gray-600">{sku.volume.toLocaleString()}</td>
                          <td className="px-3 py-1.5 text-right text-gray-600">{"\u00A3"}{sku.annualSpend.toLocaleString()}</td>
                          <td className={`px-3 py-1.5 text-right font-semibold ${sku.saving >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                            {sku.saving >= 0 ? "+" : ""}{"\u00A3"}{Math.abs(sku.saving).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleExcelDownload}
                className="gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download Supplier Details (CSV)
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-3 flex items-center justify-end gap-2">
          {generated ? (
            <>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-semibold mr-auto">
                Contract generated successfully
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </Button>
              <Button
                size="sm"
                onClick={onClose}
                className="gap-1.5 bg-[#3b5bdb] hover:bg-[#364fc7] text-xs"
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={generating}
                className="gap-1.5 bg-[#3b5bdb] hover:bg-[#364fc7] text-xs min-w-[140px]"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    Generate Contract
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
