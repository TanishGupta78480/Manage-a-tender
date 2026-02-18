"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  TrendingUp,
  Mail,
  Upload,
  User,
  Calculator,
  XCircle,
  FileCheck,
  Send,
  ChefHat,
} from "lucide-react"
import Link from "next/link"
import { tenders, suppliers, skus, offers, type Tender, type ContractApproval } from "@/lib/data"
import { WorkflowStepIndicator } from "@/components/workflow-step"
import { approvers } from "@/lib/approvers"

export default function FinalisePage() {
  const [localTenders, setLocalTenders] = useState<Tender[]>(tenders)
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalType, setApprovalType] = useState<"commercial" | "finance" | "kitchen" | null>(null)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [reminderTarget, setReminderTarget] = useState<"commercial" | "finance" | "kitchen" | null>(null)
  const [reminderSent, setReminderSent] = useState(false)

  const pendingTenders = localTenders.filter((t) => t.status === "pending_sign_off")
  const completedTenders = localTenders.filter((t) => t.status === "completed")

  // Calculate total savings from completed tenders
  const totalSavings = completedTenders.reduce((sum, t) => sum + (t.actualSavings || 0), 0)

  const selectedTender = localTenders.find((t) => t.id === selectedTenderId)

  const getApprovalProgress = (approval?: ContractApproval) => {
    if (!approval) return 0
    let progress = 0
    if (approval.kitchen?.status === "approved") progress += 25
    if (approval.finance.status === "approved") progress += 25
    if (approval.commercial.status === "approved") progress += 25
    if (approval.contractUploaded) progress += 25
    return progress
  }

  // Get status badge for approval stage
  const getApprovalBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  // Handle approval
  const handleApprove = () => {
    if (!selectedTenderId || !approvalType) return

    setLocalTenders((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTenderId) return t

        const newApproval = { ...t.approval } as ContractApproval
        newApproval[approvalType] = {
          status: "approved" as const,
          approvedBy: approvers[approvalType].name,
          approvedDate: new Date().toISOString().split("T")[0],
          notes: approvalNotes || undefined,
        }

        const allComplete =
          newApproval.kitchen?.status === "approved" &&
          newApproval.finance.status === "approved" &&
          newApproval.commercial.status === "approved" &&
          newApproval.contractUploaded

        return {
          ...t,
          approval: newApproval,
          status: allComplete ? "completed" : t.status,
        } as Tender
      }),
    )
    setShowApprovalDialog(false)
    setSelectedTenderId(null)
    setApprovalType(null)
    setApprovalNotes("")
  }

  // Handle contract upload
  const handleUploadContract = () => {
    if (!selectedTenderId) return

    setLocalTenders((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTenderId) return t

        const newApproval = { ...t.approval } as ContractApproval
        newApproval.contractUploaded = true
        newApproval.contractUploadDate = new Date().toISOString().split("T")[0]
        newApproval.contractFileName = `${t.id}_Contract_Signed.pdf`

        const allComplete =
          newApproval.kitchen?.status === "approved" &&
          newApproval.finance.status === "approved" &&
          newApproval.commercial.status === "approved" &&
          newApproval.contractUploaded

        return {
          ...t,
          approval: newApproval,
          status: allComplete ? "completed" : t.status,
        } as Tender
      }),
    )
    setShowUploadDialog(false)
    setSelectedTenderId(null)
  }

  // Handle send reminder
  const handleSendReminder = () => {
    setReminderSent(true)
    setTimeout(() => {
      setShowReminderDialog(false)
      setReminderSent(false)
      setReminderTarget(null)
    }, 2000)
  }

  // Get best offers for a tender
  const getBestOffersForTender = (tenderId: string) => {
    const tender = localTenders.find((t) => t.id === tenderId)
    if (!tender) return []

    const tenderOffers = offers.filter((o) => o.tenderId === tenderId)
    const bestPerSku: Record<string, (typeof offers)[0]> = {}

    tender.skuIds.forEach((skuId) => {
      const skuOffers = tenderOffers.filter((o) => o.skuId === skuId)
      if (skuOffers.length > 0) {
        bestPerSku[skuId] = skuOffers.reduce((a, b) => (a.overallScore > b.overallScore ? a : b))
      }
    })

    return Object.values(bestPerSku)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="page-header-gradient px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-white">Finalise Agreements</h1>
            <p className="text-sm text-white/70">
              Manage approvals, upload contracts, and track completed deals
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Workflow Step Indicator */}
        <WorkflowStepIndicator currentStep={6} nextStepLabel="View Dashboard" nextStepHref="/" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Pending Sign-off</p>
                <p className="text-2xl font-semibold text-amber-800">{pendingTenders.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-700">Awaiting Kitchen</p>
                <p className="text-2xl font-semibold text-orange-800">
                  {pendingTenders.filter((t) => t.approval?.kitchen?.status !== "approved").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Awaiting Finance</p>
                <p className="text-2xl font-semibold text-purple-800">
                  {pendingTenders.filter((t) => t.approval?.finance.status !== "approved").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Awaiting Commercial</p>
                <p className="text-2xl font-semibold text-blue-800">
                  {pendingTenders.filter((t) => t.approval?.commercial.status !== "approved").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700">Total Savings YTD</p>
                <p className="text-2xl font-semibold text-green-800">£{(totalSavings / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Required Approvals:</span>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                <ChefHat className="h-3 w-3 text-orange-700" />
              </div>
              <span className="text-sm">Kitchen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                <Calculator className="h-3 w-3 text-purple-700" />
              </div>
              <span className="text-sm">Finance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-3 w-3 text-blue-700" />
              </div>
              <span className="text-sm">Commercial</span>
            </div>
            <div className="h-px w-6 bg-border" />
            <span className="text-xs text-muted-foreground">then</span>
            <div className="h-px w-6 bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                <FileCheck className="h-3 w-3 text-green-700" />
              </div>
              <span className="text-sm">Contract Upload</span>
            </div>
          </div>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending Sign-off ({pendingTenders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedTenders.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {pendingTenders.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No tenders are pending approval at the moment.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingTenders.map((tender) => {
                  const approval = tender.approval
                  const progress = getApprovalProgress(approval)
                  const tenderSkus = skus.filter((s) => tender.skuIds.includes(s.id))
                  const winningSuppliers =
                    tender.winningSupplierIds?.map((id) => suppliers.find((s) => s.id === id)).filter(Boolean) || []

                  return (
                    <Card key={tender.id} className="p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{tender.name}</h3>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {progress}% Complete
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tender.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Contract Value</p>
                          <p className="text-xl font-semibold">£{tender.estimatedValue.toLocaleString()}</p>
                          <p className="text-sm text-green-600 font-medium">
                            Savings: £{(tender.actualSavings || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card
                          className={`p-4 ${approval?.kitchen?.status === "approved" ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <ChefHat className="h-4 w-4 text-orange-700" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Kitchen</p>
                                <p className="text-xs text-muted-foreground">{approvers.kitchen.title}</p>
                              </div>
                            </div>
                            {getApprovalBadge(approval?.kitchen?.status || "pending")}
                          </div>

                          {approval?.kitchen?.status === "approved" ? (
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Approved by: {approval.kitchen.approvedBy}</p>
                              <p>Date: {new Date(approval.kitchen.approvedDate!).toLocaleDateString("en-GB")}</p>
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                                onClick={() => {
                                  setSelectedTenderId(tender.id)
                                  setApprovalType("kitchen")
                                  setShowApprovalDialog(true)
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent"
                                onClick={() => {
                                  setSelectedTenderId(tender.id)
                                  setReminderTarget("kitchen")
                                  setShowReminderDialog(true)
                                }}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </Card>

                        <Card
                          className={`p-4 ${approval?.finance.status === "approved" ? "bg-green-50 border-green-200" : "bg-purple-50 border-purple-200"}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Calculator className="h-4 w-4 text-purple-700" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Finance</p>
                                <p className="text-xs text-muted-foreground">{approvers.finance.title}</p>
                              </div>
                            </div>
                            {getApprovalBadge(approval?.finance.status || "pending")}
                          </div>

                          {approval?.finance.status === "approved" ? (
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Approved by: {approval.finance.approvedBy}</p>
                              <p>Date: {new Date(approval.finance.approvedDate!).toLocaleDateString("en-GB")}</p>
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                onClick={() => {
                                  setSelectedTenderId(tender.id)
                                  setApprovalType("finance")
                                  setShowApprovalDialog(true)
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent"
                                onClick={() => {
                                  setSelectedTenderId(tender.id)
                                  setReminderTarget("finance")
                                  setShowReminderDialog(true)
                                }}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </Card>

                        <Card
                          className={`p-4 ${approval?.commercial.status === "approved" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-700" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Commercial</p>
                                <p className="text-xs text-muted-foreground">{approvers.commercial.title}</p>
                              </div>
                            </div>
                            {getApprovalBadge(approval?.commercial.status || "pending")}
                          </div>

                          {approval?.commercial.status === "approved" ? (
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Approved by: {approval.commercial.approvedBy}</p>
                              <p>Date: {new Date(approval.commercial.approvedDate!).toLocaleDateString("en-GB")}</p>
                            </div>
                          ) : (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  setSelectedTenderId(tender.id)
                                  setApprovalType("commercial")
                                  setShowApprovalDialog(true)
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent"
                                onClick={() => {
                                  setSelectedTenderId(tender.id)
                                  setReminderTarget("commercial")
                                  setShowReminderDialog(true)
                                }}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </Card>

                        {(() => {
                          const allApproved =
                            approval?.kitchen?.status === "approved" &&
                            approval?.finance.status === "approved" &&
                            approval?.commercial.status === "approved"

                          return (
                            <Card
                              className={`p-4 ${approval?.contractUploaded ? "bg-green-50 border-green-200" : allApproved ? "bg-green-50 border-green-200" : "bg-muted/50 border-muted"}`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ${allApproved ? "bg-green-100" : "bg-muted"}`}
                                  >
                                    <FileCheck
                                      className={`h-4 w-4 ${allApproved ? "text-green-700" : "text-muted-foreground"}`}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Contract Upload</p>
                                    <p className="text-xs text-muted-foreground">Signed agreement</p>
                                  </div>
                                </div>
                                {!allApproved ? (
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                                    Waiting
                                  </Badge>
                                ) : approval?.contractUploaded ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Uploaded
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>

                              {approval?.contractUploaded ? (
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <p>File: {approval.contractFileName}</p>
                                  <p>Date: {new Date(approval.contractUploadDate!).toLocaleDateString("en-GB")}</p>
                                </div>
                              ) : allApproved ? (
                                <Button
                                  size="sm"
                                  className="w-full mt-2 bg-green-600 hover:bg-green-700"
                                  onClick={() => {
                                    setSelectedTenderId(tender.id)
                                    setShowUploadDialog(true)
                                  }}
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Upload Contract
                                </Button>
                              ) : (
                                <p className="text-xs text-muted-foreground mt-2">Awaiting all 3 approvals</p>
                              )}
                            </Card>
                          )
                        })()}
                      </div>

                      {/* SKU Details */}
                      <div className="border-t border-border pt-4">
                        <p className="text-sm font-medium mb-2">Contract Details</p>
                        <div className="flex flex-wrap gap-2">
                          {tenderSkus.map((sku) => (
                            <Badge key={sku.id} variant="outline">
                              {sku.name}
                            </Badge>
                          ))}
                          {winningSuppliers.length > 0 && (
                            <span className="text-sm text-muted-foreground ml-2">
                              Supplier: {winningSuppliers.map((s) => s?.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed">
            {completedTenders.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed deals yet</h3>
                <p className="text-muted-foreground">Completed agreements will appear here.</p>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tender Name</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>SKUs</TableHead>
                      <TableHead className="text-right">Contract Value</TableHead>
                      <TableHead className="text-right">Savings</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTenders.map((tender) => {
                      const winningSupplier = tender.winningSupplierIds
                        ? suppliers.find((s) => s.id === tender.winningSupplierIds![0])
                        : null

                      return (
                        <TableRow key={tender.id}>
                          <TableCell className="font-medium">{tender.name}</TableCell>
                          <TableCell>{winningSupplier?.name || "Multiple"}</TableCell>
                          <TableCell>{tender.skuIds.length} SKUs</TableCell>
                          <TableCell className="text-right">£{tender.estimatedValue.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            £{(tender.actualSavings || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {tender.approval?.contractUploadDate
                              ? new Date(tender.approval.contractUploadDate).toLocaleDateString("en-GB")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Contract
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Approve {approvalType === "kitchen" ? "Kitchen" : approvalType === "finance" ? "Finance" : "Commercial"}{" "}
              Sign-off
            </DialogTitle>
            <DialogDescription>
              You are approving this tender as {approvalType ? approvers[approvalType].name : ""} (
              {approvalType ? approvers[approvalType].title : ""})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Approval Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes for this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Contract Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Signed Contract</DialogTitle>
            <DialogDescription>Upload the final signed contract document to complete the agreement.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop your contract here, or click to browse</p>
              <Input type="file" className="max-w-xs mx-auto" accept=".pdf,.doc,.docx" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadContract} className="bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Approval Reminder</DialogTitle>
            <DialogDescription>
              Send a reminder email to {reminderTarget ? approvers[reminderTarget].name : ""} (
              {reminderTarget ? approvers[reminderTarget].email : ""})
            </DialogDescription>
          </DialogHeader>

          {reminderSent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-lg font-medium">Reminder Sent!</p>
              <p className="text-sm text-muted-foreground">
                Email sent to {reminderTarget ? approvers[reminderTarget].email : ""}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-1">Reminder will be sent to:</p>
                  <p className="text-sm text-muted-foreground">
                    {reminderTarget ? approvers[reminderTarget].name : ""} -{" "}
                    {reminderTarget ? approvers[reminderTarget].email : ""}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendReminder}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
