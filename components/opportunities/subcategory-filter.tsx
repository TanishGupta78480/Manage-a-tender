"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, ChevronDown } from "lucide-react"

interface SubcategoryFilterProps {
  subcategories: string[]
  selectedSubcategories: Set<string>
  onToggle: (subcategory: string) => void
  onToggleAll: () => void
  onSetFiltered?: (subcategories: Set<string>) => void
}

export function SubcategoryFilter({
  subcategories,
  selectedSubcategories,
  onToggle,
  onToggleAll,
  onSetFiltered,
}: SubcategoryFilterProps) {
  const [open, setOpen] = useState(false)

  // size === 0 means "all shown" (no filter active)
  const allSelected = selectedSubcategories.size === 0
  const filterLabel = allSelected
    ? "All Subcategories"
    : selectedSubcategories.size === 1
      ? Array.from(selectedSubcategories)[0]
      : `${selectedSubcategories.size} Subcategories`

  const handleAllClick = () => {
    if (allSelected) {
      // "All" is currently on -> clear everything (show nothing, then user picks)
      // Actually toggle to no filter = reset to all
      // Clicking All when already All -> do nothing (it's already all)
      return
    }
    // Some are selected -> reset to all
    onToggleAll()
  }

  const handleItemClick = (sub: string) => {
    if (allSelected) {
      // All are shown (empty set). User unchecks one item -> show all except that one.
      if (onSetFiltered) {
        const remaining = new Set(subcategories.filter((s) => s !== sub))
        onSetFiltered(remaining)
      }
    } else if (selectedSubcategories.has(sub)) {
      // Item is checked -> uncheck it
      const next = new Set(selectedSubcategories)
      next.delete(sub)
      // If nothing left, revert to "all"
      if (next.size === 0) {
        onToggleAll()
      } else if (onSetFiltered) {
        onSetFiltered(next)
      } else {
        onToggle(sub)
      }
    } else {
      // Item is unchecked -> check it
      if (onSetFiltered) {
        const next = new Set(selectedSubcategories)
        next.add(sub)
        // If all are now selected, revert to "all" (empty set)
        if (next.size === subcategories.length) {
          onToggleAll()
        } else {
          onSetFiltered(next)
        }
      } else {
        onToggle(sub)
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
          <Filter className="h-3.5 w-3.5" />
          <span className="text-sm">{filterLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="space-y-1">
          {/* All option */}
          <button
            type="button"
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
            onClick={() => onToggleAll()}
          >
            <Checkbox
              checked={allSelected}
              className="h-4 w-4 pointer-events-none data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
              tabIndex={-1}
            />
            <span className={allSelected ? "font-medium" : ""}>All</span>
          </button>
          <div className="h-px bg-border my-1" />
          {/* Individual subcategories */}
          {subcategories.map((sub) => {
            const isChecked = allSelected || selectedSubcategories.has(sub)
            return (
              <button
                key={sub}
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
                onClick={() => handleItemClick(sub)}
              >
                <Checkbox
                  checked={isChecked}
                  className="h-4 w-4 pointer-events-none data-[state=checked]:bg-[#3b5bdb] data-[state=checked]:border-[#3b5bdb]"
                  tabIndex={-1}
                />
                <span className={isChecked ? "font-medium" : ""}>{sub}</span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
