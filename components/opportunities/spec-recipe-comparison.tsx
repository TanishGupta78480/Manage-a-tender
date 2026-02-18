"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  FlaskConical,
  Plus,
  Trash2,
  ImagePlus,
  RotateCcw,
  UserPlus,
  AlertTriangle,
  Sparkles,
  } from "lucide-react"
import type { SpecRecipeCardData, SpecRecipeIngredient } from "@/lib/data"

interface SpecRecipeComparisonProps {
  skuName: string
  specMetric: string
  ourSpec: number
  marketSpec: number
  isAboveSpec: boolean
  currentRecipe: SpecRecipeCardData
  competitorRecipe: SpecRecipeCardData
  onBack: () => void
}

/* ------------------------------------------------------------------ */
/*  Static RecipeCardTable (read-only, used in the grid)               */
/* ------------------------------------------------------------------ */
function RecipeCardTable({
  title,
  recipe,
  showEditButton,
  onStartEdit,
  highlightMetric,
  variant,
  differenceFromCurrent,
  cardCount = 2,
}: {
  title: string
  recipe: SpecRecipeCardData
  showEditButton?: boolean
  onStartEdit?: () => void
  highlightMetric?: string
  variant: "current" | "competitor" | "custom"
  differenceFromCurrent?: number
  cardCount?: number
}) {
  const ingredients = recipe.ingredients
  const totalCost = ingredients.reduce((sum, ing) => sum + ing.priceInSku, 0)
  const totalPercentage = ingredients.reduce((sum, ing) => sum + ing.percentage, 0)

  const borderColor =
    variant === "current"
      ? "border-blue-400"
      : variant === "competitor"
        ? "border-orange-400"
        : "border-emerald-400"

  const headerBg =
    variant === "current"
      ? "bg-blue-100"
      : variant === "competitor"
        ? "bg-orange-100"
        : "bg-emerald-100"

  const headerText =
    variant === "current"
      ? "text-blue-950"
      : variant === "competitor"
        ? "text-orange-950"
        : "text-emerald-950"

  const badgeVariant =
    variant === "current"
      ? "bg-blue-200 text-blue-800 border-blue-400"
      : variant === "competitor"
        ? "bg-orange-200 text-orange-800 border-orange-400"
        : "bg-emerald-200 text-emerald-800 border-emerald-400"

  const editBtnClass =
    variant === "custom"
      ? "border-emerald-400 text-emerald-800 hover:bg-emerald-200"
      : "border-blue-400 text-blue-800 hover:bg-blue-200"

  return (
    <Card className={`${borderColor} border-2 min-w-0 flex flex-col overflow-hidden pt-0`}>
      <CardHeader className={`${headerBg} px-4 py-2 shrink-0 min-h-[56px] flex flex-col justify-center`}>
        <div className="flex items-center justify-between gap-x-2 gap-y-1 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <FlaskConical className={`h-4 w-4 shrink-0 ${headerText}`} />
            <CardTitle className={`text-sm font-semibold ${headerText} truncate`}>
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showEditButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onStartEdit}
                className={`bg-transparent h-7 text-xs ${editBtnClass}`}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            <Badge className={`${badgeVariant} shrink-0`}>
              {variant === "current"
                ? "Current"
                : variant === "competitor"
                  ? "Competitor"
                  : "Custom"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <div className="flex-1 overflow-auto min-w-0">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="font-semibold text-foreground pl-4">Ingredient</TableHead>
                <TableHead className="font-semibold text-foreground text-left w-[40px]">%</TableHead>
                <TableHead className="font-semibold text-foreground text-left w-[70px]"><span className="block leading-tight">Commodity<br/>Price</span></TableHead>
                <TableHead className="font-semibold text-foreground text-left pr-4 w-[60px]"><span className="block leading-tight">Cost in<br/>SKU</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ing, idx) => {
                const isQuid = ing.isQuid === true
                return (
                  <TableRow key={idx}>
                    <TableCell className={`pl-4 py-2 ${cardCount >= 3 ? "max-w-[140px]" : ""}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm ${cardCount >= 3 ? "truncate max-w-[100px]" : ""}`} title={ing.name}>{ing.name}</span>
                        {isQuid && (
                          <button
                            type="button"
                            className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400 bg-amber-100 text-amber-700 hover:bg-amber-200 active:bg-amber-300 transition-colors shadow-sm"
                            title={`QUID Spec: ${highlightMetric || "Declared ingredient"}`}
                          >
                            QUID
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-left py-2">
                      <span className="text-sm">{ing.percentage}%</span>
                    </TableCell>
                    <TableCell className="text-left py-2 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">{"\u00A3"}{ing.commodityPrice.toFixed(2)}/kg</span>
                    </TableCell>
                    <TableCell className="text-left py-2 pr-4 whitespace-nowrap">
                      <span className="text-sm font-medium">{"\u00A3"}{ing.priceInSku.toFixed(2)}</span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Total row -- pinned to bottom via shrink-0 so all cards align */}
        <div className="shrink-0 border-t-2 border-foreground/20">
          <Table className="w-full">
            <TableBody>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell className="pl-4 py-3 font-semibold text-foreground">Total</TableCell>
                <TableCell className={`text-left py-3 w-[40px] font-semibold ${Math.abs(totalPercentage - 100) > 0.1 ? "text-destructive" : "text-foreground"}`}>
                  {Math.abs(totalPercentage - 100) < 0.05 ? "100%" : `${totalPercentage.toFixed(1)}%`}
                </TableCell>
                <TableCell className="text-left py-3 w-[70px]"></TableCell>
                <TableCell className="text-left py-3 pr-4 w-[60px] font-bold text-foreground">
                  {"\u00A3"}{totalCost.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Difference from current -- shown on all cards for alignment */}
        <div className="shrink-0 border-t border-foreground/10 px-4 py-2 flex items-center justify-between bg-muted/30">
          {differenceFromCurrent !== undefined ? (
            <>
              <span className="text-xs text-muted-foreground">vs Current</span>
              <Badge
                className={`text-xs font-semibold ${
                  differenceFromCurrent < 0
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : differenceFromCurrent > 0
                      ? "bg-amber-100 text-amber-700 border-amber-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {differenceFromCurrent > 0 ? "+" : ""}{"\u00A3"}{differenceFromCurrent.toFixed(2)} (
                {differenceFromCurrent > 0 ? "+" : ""}
                {totalCost > 0
                  ? (((differenceFromCurrent) / (totalCost - differenceFromCurrent)) * 100).toFixed(1)
                  : "0.0"}
                %)
              </Badge>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">Baseline</span>
              <Badge className="text-xs font-semibold bg-blue-100 text-blue-700 border-blue-300">
                Reference
              </Badge>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Edit Recipe Dialog                                                 */
/* ------------------------------------------------------------------ */
function EditRecipeDialog({
  open,
  onClose,
  title,
  editValues,
  onEditChange,
  onAddIngredient,
  onRemoveIngredient,
  onSave,
  percentageError,
  highlightMetric,
}: {
  open: boolean
  onClose: () => void
  title: string
  editValues: SpecRecipeIngredient[]
  onEditChange: (index: number, field: keyof SpecRecipeIngredient, value: number) => void
  onAddIngredient: () => void
  onRemoveIngredient: (index: number) => void
  onSave: () => void
  percentageError: string | null
  highlightMetric?: string
}) {
  const totalCost = editValues.reduce((sum, ing) => sum + ing.priceInSku, 0)
  const totalPercentage = editValues.reduce((sum, ing) => sum + ing.percentage, 0)

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-3xl sm:max-w-3xl w-full max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-muted-foreground" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="font-semibold text-foreground pl-2 w-[40%]">Ingredient</TableHead>
                <TableHead className="font-semibold text-foreground text-right w-[12%]">%</TableHead>
                <TableHead className="font-semibold text-foreground text-right w-[18%]">Commodity Price</TableHead>
                <TableHead className="font-semibold text-foreground text-right w-[18%]">Cost in SKU</TableHead>
                <TableHead className="w-[12%]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {editValues.map((ing, idx) => {
                const isHighlighted =
                  highlightMetric &&
                  ing.name.toLowerCase().includes(highlightMetric.toLowerCase().split(" ")[0].toLowerCase())
                return (
                  <TableRow key={idx} className={isHighlighted ? "bg-amber-50/50" : ""}>
                    <TableCell className="pl-2 py-2">
                      <Input
                        type="text"
                        value={ing.name}
                        onChange={(e) => {
                          onEditChange(idx, "name" as keyof SpecRecipeIngredient, e.target.value as unknown as number)
                        }}
                        className="h-8 text-sm w-full"
                      />
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <Input
                        type="number"
                        value={ing.percentage}
                        onChange={(e) => onEditChange(idx, "percentage", Number(e.target.value))}
                        className="h-8 text-sm text-right w-full"
                        step="0.5"
                      />
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <Input
                        type="number"
                        value={ing.commodityPrice}
                        onChange={(e) => onEditChange(idx, "commodityPrice", Number(e.target.value))}
                        className="h-8 text-sm text-right w-full"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {"\u00A3"}{ing.priceInSku.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 pr-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveIngredient(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Add ingredient */}
          <div className="border-t border-dashed border-foreground/10 px-2 py-2 mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddIngredient}
              className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Ingredient
            </Button>
          </div>
        </div>

        {/* Error + totals + footer */}
        <div className="shrink-0 border-t">
          {/* Percentage warning */}
          {percentageError && (
            <div className="mx-6 mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-700">{percentageError}</p>
            </div>
          )}

          {/* Live totals row */}
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <div className="flex items-center gap-4">
            <span className={`text-sm font-semibold ${Math.abs(totalPercentage - 100) > 0.1 ? "text-destructive" : "text-foreground"}`}>
                {Math.abs(totalPercentage - 100) < 0.05 ? "100%" : `${totalPercentage.toFixed(1)}%`}
              </span>
            <span className="text-base font-bold text-foreground">{"\u00A3"}{totalCost.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter className="px-6 pb-5 pt-2">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------------------ */
/*  Manual Add Competitor Dialog (full ingredient editing)             */
/* ------------------------------------------------------------------ */
function ManualAddCompetitorDialog({
  open,
  onClose,
  onAdd,
  currentRecipeSkuId,
  currentRecipeSubcategory,
}: {
  open: boolean
  onClose: () => void
  onAdd: (recipe: SpecRecipeCardData) => void
  currentRecipeSkuId: string
  currentRecipeSubcategory: string
}) {
  const [skuName, setSkuName] = useState("")
  const [retailer, setRetailer] = useState("")
  const [ingredients, setIngredients] = useState<SpecRecipeIngredient[]>([
    { name: "", percentage: 0, commodityPrice: 0, priceInSku: 0 },
  ])
  const [percentageError, setPercentageError] = useState<string | null>(null)

  const totalCost = ingredients.reduce((sum, ing) => sum + ing.priceInSku, 0)
  const totalPercentage = ingredients.reduce((sum, ing) => sum + ing.percentage, 0)

  const handleIngredientChange = (
    index: number,
    field: keyof SpecRecipeIngredient,
    value: number | string,
  ) => {
    setIngredients((prev) => {
      const updated = [...prev]
      const item = { ...updated[index], [field]: value }

      if (field === "percentage" || field === "commodityPrice") {
        const pct = field === "percentage" ? (value as number) : item.percentage
        const price = field === "commodityPrice" ? (value as number) : item.commodityPrice
        item.priceInSku = Number(((pct / 100) * price).toFixed(4))
      }

      updated[index] = item
      return updated
    })
  }

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { name: "", percentage: 0, commodityPrice: 0, priceInSku: 0 },
    ])
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (ingredients.length > 0 && ingredients.some((i) => i.percentage > 0)) {
      const tp = ingredients.reduce((sum, ing) => sum + ing.percentage, 0)
      if (Math.abs(tp - 100) > 0.1) {
        const message =
          tp > 100
            ? `Total percentage is ${tp.toFixed(1)}% which exceeds 100%. Please adjust ingredient percentages.`
            : `Total percentage is ${tp.toFixed(1)}% which is below 100%. Please adjust ingredient percentages.`
        setPercentageError(message)
        return
      }
    }
    setPercentageError(null)
    const newTotalCost = ingredients.reduce((sum, ing) => sum + ing.priceInSku, 0)
    const newRecipe: SpecRecipeCardData = {
      skuId: currentRecipeSkuId,
      skuName: skuName.trim(),
      subcategory: currentRecipeSubcategory,
      specMetric: "",
      ingredients: ingredients
        .filter((i) => i.name.trim() !== "")
        .map((i) => ({ ...i })),
      totalCost: newTotalCost,
    }
    onAdd(newRecipe)
    // Reset form and close
    setSkuName("")
    setRetailer("")
    setIngredients([{ name: "", percentage: 0, commodityPrice: 0, priceInSku: 0 }])
    onClose()
  }

  const handleCancel = () => {
    setSkuName("")
    setRetailer("")
    setIngredients([{ name: "", percentage: 0, commodityPrice: 0, priceInSku: 0 }])
    setPercentageError(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleCancel() }}>
      <DialogContent className="max-w-3xl sm:max-w-3xl w-full max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            Add Competitor SKU Manually
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* SKU details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Competitor SKU Name</label>
              <Input
                placeholder="e.g. Tesco Finest Victoria Sponge"
                className="h-9"
                value={skuName}
                onChange={(e) => setSkuName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Retailer</label>
              <Input
                placeholder="e.g. Tesco"
                className="h-9"
                value={retailer}
                onChange={(e) => setRetailer(e.target.value)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recipe Ingredients</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Ingredients table */}
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="font-semibold text-foreground pl-2 w-[40%]">Ingredient</TableHead>
                <TableHead className="font-semibold text-foreground text-right w-[12%]">%</TableHead>
                <TableHead className="font-semibold text-foreground text-right w-[18%]">Commodity Price</TableHead>
                <TableHead className="font-semibold text-foreground text-right w-[18%]">Cost in SKU</TableHead>
                <TableHead className="w-[12%]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ing, idx) => (
                <TableRow key={idx}>
                  <TableCell className="pl-2 py-2">
                    <Input
                      type="text"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(idx, "name" as keyof SpecRecipeIngredient, e.target.value)}
                      placeholder="Ingredient name"
                      className="h-8 text-sm w-full"
                    />
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Input
                      type="number"
                      value={ing.percentage || ""}
                      onChange={(e) => handleIngredientChange(idx, "percentage", Number(e.target.value))}
                      className="h-8 text-sm text-right w-full"
                      step="0.5"
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Input
                      type="number"
                      value={ing.commodityPrice || ""}
                      onChange={(e) => handleIngredientChange(idx, "commodityPrice", Number(e.target.value))}
                      className="h-8 text-sm text-right w-full"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {"\u00A3"}{ing.priceInSku.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 pr-2 text-right">
                    {ingredients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveIngredient(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add ingredient */}
          <div className="border-t border-dashed border-foreground/10 px-2 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddIngredient}
              className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Ingredient
            </Button>
          </div>
        </div>

        {/* Error + totals + footer */}
        <div className="shrink-0 border-t">
          {percentageError && (
            <div className="mx-6 mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-700">{percentageError}</p>
            </div>
          )}

          {/* Live totals row */}
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-semibold ${Math.abs(totalPercentage - 100) > 0.1 && totalPercentage > 0 ? "text-destructive" : "text-foreground"}`}>
                {totalPercentage === 0 ? "0%" : Math.abs(totalPercentage - 100) < 0.05 ? "100%" : `${totalPercentage.toFixed(1)}%`}
              </span>
              <span className="text-base font-bold text-foreground">{"\u00A3"}{totalCost.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter className="px-6 pb-5 pt-2">
            <Button variant="outline" onClick={handleCancel} className="bg-transparent">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!skuName.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add Competitor SKU
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ------------------------------------------------------------------ */
/*  Mock competitor recipes for image upload simulation                 */
/* ------------------------------------------------------------------ */
const MOCK_COMPETITOR_RECIPES: Array<{
  skuName: string
  ingredients: SpecRecipeIngredient[]
}> = [
  {
    skuName: "Aldi Specially Selected Ring Donuts 5pk",
    ingredients: [
      { name: "Wheat Flour", percentage: 34, commodityPrice: 0.42, priceInSku: 0.1428, isQuid: false },
      { name: "Sugar", percentage: 19, commodityPrice: 0.58, priceInSku: 0.1102, isQuid: true },
      { name: "Palm Oil", percentage: 14, commodityPrice: 0.88, priceInSku: 0.1232 },
      { name: "Water", percentage: 18, commodityPrice: 0, priceInSku: 0 },
      { name: "Dried Whole Egg", percentage: 5, commodityPrice: 3.60, priceInSku: 0.18 },
      { name: "Yeast", percentage: 3, commodityPrice: 1.95, priceInSku: 0.0585 },
      { name: "Dried Skimmed Milk", percentage: 4, commodityPrice: 2.80, priceInSku: 0.112 },
      { name: "Salt", percentage: 1.5, commodityPrice: 0.25, priceInSku: 0.00375 },
      { name: "Emulsifier (E471)", percentage: 1.5, commodityPrice: 2.10, priceInSku: 0.0315 },
    ],
  },
  {
    skuName: "Lidl Rowan Hill Bakery Donuts 6pk",
    ingredients: [
      { name: "Wheat Flour", percentage: 36, commodityPrice: 0.40, priceInSku: 0.144, isQuid: false },
      { name: "Sugar", percentage: 22, commodityPrice: 0.55, priceInSku: 0.121, isQuid: true },
      { name: "Rapeseed Oil", percentage: 12, commodityPrice: 0.95, priceInSku: 0.114 },
      { name: "Water", percentage: 16, commodityPrice: 0, priceInSku: 0 },
      { name: "Pasteurised Egg", percentage: 6, commodityPrice: 2.40, priceInSku: 0.144 },
      { name: "Yeast", percentage: 2.5, commodityPrice: 1.90, priceInSku: 0.0475 },
      { name: "Skimmed Milk Powder", percentage: 3, commodityPrice: 2.65, priceInSku: 0.0795 },
      { name: "Salt", percentage: 1.2, commodityPrice: 0.25, priceInSku: 0.003 },
      { name: "Mono- and Diglycerides", percentage: 1.3, commodityPrice: 2.20, priceInSku: 0.0286 },
    ],
  },
  {
    skuName: "Tesco Finest Belgian Chocolate Donuts 4pk",
    ingredients: [
      { name: "Wheat Flour", percentage: 30, commodityPrice: 0.44, priceInSku: 0.132, isQuid: false },
      { name: "Sugar", percentage: 17, commodityPrice: 0.60, priceInSku: 0.102, isQuid: true },
      { name: "Belgian Chocolate", percentage: 10, commodityPrice: 5.20, priceInSku: 0.52 },
      { name: "Butter", percentage: 9, commodityPrice: 3.80, priceInSku: 0.342 },
      { name: "Water", percentage: 15, commodityPrice: 0, priceInSku: 0 },
      { name: "Whole Egg", percentage: 8, commodityPrice: 2.50, priceInSku: 0.20 },
      { name: "Cocoa Powder", percentage: 4, commodityPrice: 4.10, priceInSku: 0.164 },
      { name: "Yeast", percentage: 3, commodityPrice: 1.95, priceInSku: 0.0585 },
      { name: "Skimmed Milk Powder", percentage: 2.5, commodityPrice: 2.80, priceInSku: 0.07 },
      { name: "Salt", percentage: 1.5, commodityPrice: 0.25, priceInSku: 0.00375 },
    ],
  },
  {
    skuName: "Sainsbury's Taste the Difference Donuts 4pk",
    ingredients: [
      { name: "Wheat Flour", percentage: 33, commodityPrice: 0.43, priceInSku: 0.1419, isQuid: false },
      { name: "Sugar", percentage: 20, commodityPrice: 0.56, priceInSku: 0.112, isQuid: true },
      { name: "Sunflower Oil", percentage: 11, commodityPrice: 1.05, priceInSku: 0.1155 },
      { name: "Water", percentage: 17, commodityPrice: 0, priceInSku: 0 },
      { name: "Free Range Egg", percentage: 7, commodityPrice: 3.20, priceInSku: 0.224 },
      { name: "Yeast", percentage: 3.5, commodityPrice: 1.95, priceInSku: 0.06825 },
      { name: "Whole Milk Powder", percentage: 4, commodityPrice: 3.10, priceInSku: 0.124 },
      { name: "Vanilla Extract", percentage: 1, commodityPrice: 12.00, priceInSku: 0.12 },
      { name: "Salt", percentage: 1.5, commodityPrice: 0.25, priceInSku: 0.00375 },
      { name: "Lecithin (Soya)", percentage: 2, commodityPrice: 1.80, priceInSku: 0.036 },
    ],
  },
  {
    skuName: "M&S Extra Indulgent Ring Donuts 4pk",
    ingredients: [
      { name: "Wheat Flour", percentage: 31, commodityPrice: 0.45, priceInSku: 0.1395, isQuid: false },
      { name: "Sugar", percentage: 18, commodityPrice: 0.62, priceInSku: 0.1116, isQuid: true },
      { name: "Butter", percentage: 10, commodityPrice: 3.90, priceInSku: 0.39 },
      { name: "Double Cream", percentage: 8, commodityPrice: 2.60, priceInSku: 0.208 },
      { name: "Water", percentage: 14, commodityPrice: 0, priceInSku: 0 },
      { name: "Whole Egg", percentage: 7, commodityPrice: 2.80, priceInSku: 0.196 },
      { name: "Yeast", percentage: 3, commodityPrice: 1.95, priceInSku: 0.0585 },
      { name: "Milk Powder", percentage: 4, commodityPrice: 2.90, priceInSku: 0.116 },
      { name: "Madagascan Vanilla", percentage: 1.5, commodityPrice: 15.00, priceInSku: 0.225 },
      { name: "Salt", percentage: 1.5, commodityPrice: 0.25, priceInSku: 0.00375 },
      { name: "Emulsifier", percentage: 2, commodityPrice: 2.10, priceInSku: 0.042 },
    ],
  },
]

function getRandomMockRecipe(
  skuId: string,
  subcategory: string,
  excludeName?: string,
): SpecRecipeCardData {
  let pool = MOCK_COMPETITOR_RECIPES
  if (excludeName) {
    pool = pool.filter((r) => r.skuName !== excludeName)
  }
  const pick = pool[Math.floor(Math.random() * pool.length)]
  const totalCost = pick.ingredients.reduce((s, i) => s + i.priceInSku, 0)
  return {
    skuId,
    skuName: pick.skuName,
    subcategory,
    specMetric: "",
    ingredients: pick.ingredients.map((i) => ({ ...i })),
    totalCost,
  }
}

/* ------------------------------------------------------------------ */
/*  Add Competitor Dropdown                                            */
/* ------------------------------------------------------------------ */
function AddCompetitorDropdown({
  onAddCompetitor,
  currentRecipeSkuId,
  currentRecipeSubcategory,
}: {
  onAddCompetitor: (recipe: SpecRecipeCardData) => void
  currentRecipeSkuId: string
  currentRecipeSubcategory: string
}) {
  const [open, setOpen] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showManualForm, setShowManualForm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = () => {
    const mockRecipe = getRandomMockRecipe(
      currentRecipeSkuId,
      currentRecipeSubcategory,
    )
    onAddCompetitor(mockRecipe)
    setShowUploadDialog(false)
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload()
      e.dataTransfer.clearData()
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <>
      <div className="relative" ref={ref}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="bg-transparent text-xs"
        >
          <UserPlus className="h-3.5 w-3.5 mr-1" />
          Add new competitor SKU
        </Button>
        {open && (
          <div className="absolute right-0 top-full mt-1 z-20 w-72 rounded-lg border bg-background shadow-lg py-1">
            <button
              type="button"
              className="flex items-start gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
              onClick={() => { setOpen(false); setShowUploadDialog(true) }}
            >
              <ImagePlus className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>Upload image to create recipe card (via VisionARG)</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => { setOpen(false); setShowManualForm(true) }}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Add manually
            </button>
          </div>
        )}
      </div>

      {/* Upload Dialog for VisionARG */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              Upload Image for VisionARG
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Upload an image of the competitor product label or recipe card. VisionARG will extract the ingredient data automatically.
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <ImagePlus className={`h-10 w-10 mx-auto mb-3 ${isDragging ? "text-primary" : "text-muted-foreground/50"}`} />
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload()
                    e.target.value = ""
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="bg-transparent">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Add Form Dialog */}
      <ManualAddCompetitorDialog
        open={showManualForm}
        onClose={() => setShowManualForm(false)}
        onAdd={onAddCompetitor}
        currentRecipeSkuId={currentRecipeSkuId}
        currentRecipeSubcategory={currentRecipeSubcategory}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function SpecRecipeComparison({
  skuName,
  specMetric,
  ourSpec,
  marketSpec,
  isAboveSpec,
  currentRecipe,
  competitorRecipe,
  onBack,
}: SpecRecipeComparisonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTarget, setEditingTarget] = useState<"current" | "custom">("current")
  const [editValues, setEditValues] = useState<SpecRecipeIngredient[]>([])
  const [customRecipe, setCustomRecipe] = useState<SpecRecipeCardData | null>(null)
  const [overrideCompetitor, setOverrideCompetitor] = useState<SpecRecipeCardData | null>(null)
  const [percentageError, setPercentageError] = useState<string | null>(null)

  const activeCompetitor = overrideCompetitor ?? competitorRecipe

  const currentTotal = useMemo(
    () => currentRecipe.ingredients.reduce((sum, ing) => sum + ing.priceInSku, 0),
    [currentRecipe],
  )

  const competitorTotal = useMemo(
    () => activeCompetitor.ingredients.reduce((sum, ing) => sum + ing.priceInSku, 0),
    [activeCompetitor],
  )

  const hasCustomRecipe = customRecipe !== null

  const customTotal = hasCustomRecipe
    ? customRecipe.ingredients.reduce((s, i) => s + i.priceInSku, 0)
    : 0

  /* ---- Edit the Current recipe (first time) ---- */
  const handleStartEditCurrent = () => {
    setEditValues(currentRecipe.ingredients.map((ing) => ({ ...ing })))
    setEditingTarget("current")
    setPercentageError(null)
    setIsEditing(true)
  }

  /* ---- Edit the Custom recipe (subsequent edits) ---- */
  const handleStartEditCustom = () => {
    if (!customRecipe) return
    setEditValues(customRecipe.ingredients.map((ing) => ({ ...ing })))
    setEditingTarget("custom")
    setPercentageError(null)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditValues([])
    setPercentageError(null)
  }

  const handleEditChange = (
    index: number,
    field: keyof SpecRecipeIngredient,
    value: number,
  ) => {
    setEditValues((prev) => {
      const updated = [...prev]
      const item = { ...updated[index], [field]: value }

      if (field === "percentage" || field === "commodityPrice") {
        const pct = field === "percentage" ? value : item.percentage
        const price = field === "commodityPrice" ? value : item.commodityPrice
        item.priceInSku = Number(((pct / 100) * price).toFixed(4))
      }

      updated[index] = item
      return updated
    })
  }

  const handleAddIngredient = () => {
    setEditValues((prev) => [
      ...prev,
      { name: "New Ingredient", percentage: 0, commodityPrice: 0, priceInSku: 0 },
    ])
  }

  const handleRemoveIngredient = (index: number) => {
    setEditValues((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveChanges = () => {
    const totalPercentage = editValues.reduce((sum, ing) => sum + ing.percentage, 0)
    if (Math.abs(totalPercentage - 100) > 0.1) {
      const message =
        totalPercentage > 100
          ? `Total percentage is ${totalPercentage.toFixed(1)}% which exceeds 100%. Please reduce ingredient percentages before saving.`
          : `Total percentage is ${totalPercentage.toFixed(1)}% which is below 100%. Please increase ingredient percentages before saving.`
      setPercentageError(message)
      return
    }
    setPercentageError(null)
    const newTotalCost = editValues.reduce((sum, ing) => sum + ing.priceInSku, 0)
    setCustomRecipe({
      ...currentRecipe,
      skuName: `${currentRecipe.skuName} (Custom)`,
      ingredients: editValues.map((ing) => ({ ...ing })),
      totalCost: newTotalCost,
    })
    setIsEditing(false)
    setEditValues([])
  }

  const handleRevert = () => {
    setCustomRecipe(null)
    setOverrideCompetitor(null)
    setIsEditing(false)
    setEditValues([])
    setPercentageError(null)
  }

  const gridCols = hasCustomRecipe ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to SKU list
          </Button>
          <div className="h-5 w-px bg-border" />
          <div>
            <h3 className="font-semibold text-foreground">{skuName}</h3>
            <p className="text-sm text-muted-foreground">
              Recipe comparison for spec gaps
            </p>
          </div>
        </div>

        {/* Top-right: Add Competitor + Revert */}
        <div className="flex items-center gap-2">
          <AddCompetitorDropdown
            onAddCompetitor={(recipe) => setOverrideCompetitor(recipe)}
            currentRecipeSkuId={currentRecipe.skuId}
            currentRecipeSubcategory={currentRecipe.subcategory}
          />
          {(hasCustomRecipe || overrideCompetitor) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevert}
              className="bg-transparent text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Revert Changes
            </Button>
          )}
        </div>
      </div>

      {/* Recipe cards grid -- Current -> Custom -> Competitor */}
      <div className={`grid ${gridCols} gap-4 items-stretch`}>
        {/* Card 1: Current SKU name */}
        <RecipeCardTable
          title={skuName}
          recipe={currentRecipe}
          showEditButton={!hasCustomRecipe}
          onStartEdit={handleStartEditCurrent}
          highlightMetric={specMetric}
          variant="current"
          cardCount={hasCustomRecipe ? 3 : 2}
        />

        {/* Card 2: Custom SKU */}
        {hasCustomRecipe && (
          <RecipeCardTable
            title="Custom SKU"
            recipe={customRecipe}
            showEditButton={true}
            onStartEdit={handleStartEditCustom}
            highlightMetric={specMetric}
            variant="custom"
            differenceFromCurrent={customTotal - currentTotal}
            cardCount={3}
          />
        )}

        {/* Card 3: Competitor SKU name */}
        <RecipeCardTable
          title={activeCompetitor.skuName}
          recipe={activeCompetitor}
          highlightMetric={specMetric}
          variant="competitor"
          cardCount={hasCustomRecipe ? 3 : 2}
          differenceFromCurrent={competitorTotal - currentTotal}
        />
      </div>

      {/* Recipe Comparison Insight */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <h4 className="text-sm font-semibold text-amber-900">Why is this an opportunity?</h4>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">
          Your current recipe costs{" "}
          <strong className="text-amber-700">
            {"\u00A3"}{Math.abs(currentTotal - competitorTotal).toFixed(2)}{" "}
            {currentTotal - competitorTotal > 0 ? "more" : "less"}
          </strong>{" "}
          than the competitor recipe (
          {competitorTotal > 0
            ? Math.abs(((currentTotal - competitorTotal) / competitorTotal) * 100).toFixed(1)
            : "0.0"}
          % {currentTotal - competitorTotal > 0 ? "higher" : "lower"}).
        </p>
        {(() => {
          const currentIsMore = currentTotal > competitorTotal
          // Compare each ingredient's cost contribution between current and competitor
          const diffs = currentRecipe.ingredients
            .map((curIng) => {
              const compIng = activeCompetitor.ingredients.find(
                (c) => c.name.toLowerCase() === curIng.name.toLowerCase()
              )
              const diff = compIng ? curIng.priceInSku - compIng.priceInSku : 0
              return { name: curIng.name, diff }
            })

          // Pick the top drivers in the direction that explains which side costs more
          const drivers = currentIsMore
            ? diffs.filter((i) => i.diff > 0.005).sort((a, b) => b.diff - a.diff)
            : diffs.filter((i) => i.diff < -0.005).sort((a, b) => a.diff - b.diff)

          if (drivers.length > 0) {
            const names = drivers.map((i) => i.name)
            const formatted =
              names.length === 1
                ? names[0]
                : names.length === 2
                  ? `${names[0]} and ${names[1]}`
                  : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`

            const message = currentIsMore
              ? `${formatted} ${names.length === 1 ? "is" : "are"} contributing to a higher recipe cost compared to the competitor, presenting a potential savings opportunity.`
              : `The competitor uses higher-cost ${formatted}, making their recipe more expensive. Your current recipe is already cost-efficient on these ingredients.`

            return (
              <p className="text-sm text-amber-800 leading-relaxed mt-1">
                <strong className="text-amber-900">{formatted}</strong>{" "}
                {currentIsMore
                  ? `${names.length === 1 ? "is" : "are"} contributing to a higher recipe cost compared to the competitor, presenting a potential savings opportunity.`
                  : `${names.length === 1 ? "costs" : "cost"} more in the competitor recipe. Your current recipe is already cost-efficient on ${names.length === 1 ? "this ingredient" : "these ingredients"}.`
                }
              </p>
            )
          }
          return null
        })()}
      </div>

      {/* Edit dialog -- pops out as a modal */}
      <EditRecipeDialog
        open={isEditing}
        onClose={handleCancelEdit}
        title={editingTarget === "current" ? "Edit Current Recipe" : "Edit Custom Recipe"}
        editValues={editValues}
        onEditChange={handleEditChange}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
        onSave={handleSaveChanges}
        percentageError={percentageError}
        highlightMetric={specMetric}
      />
    </div>
  )
}
