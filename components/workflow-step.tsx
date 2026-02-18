"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkflowStep {
  number: number
  label: string
  completed?: boolean
  active?: boolean
}

interface WorkflowStepIndicatorProps {
  currentStep: number
  nextStepLabel: string
  nextStepHref: string
  steps?: WorkflowStep[]
  onNextClick?: () => void
  nextDisabled?: boolean
  selectedCount?: number
}

const defaultSteps: WorkflowStep[] = [
  { number: 1, label: "Prioritise Opportunities" },
  { number: 2, label: "Select Suppliers" },
  { number: 3, label: "Launch a Price Discovery" },
  { number: 4, label: "Launch a Tender" },
  { number: 5, label: "Manage a Tender" },
  { number: 6, label: "Approve and Close a Tender" },
]

export function WorkflowStepIndicator({
  currentStep,
  nextStepLabel,
  nextStepHref,
  steps = defaultSteps,
  onNextClick,
  nextDisabled,
  selectedCount,
}: WorkflowStepIndicatorProps) {
  const stepsWithStatus = steps.map((step) => ({
    ...step,
    completed: step.number < currentStep,
    active: step.number === currentStep,
  }))

  const NextButton = () => {
    const buttonClasses = cn(
      "flex items-center gap-2 px-5 rounded-lg font-semibold transition-colors whitespace-nowrap flex-shrink-0 shadow-md",
      selectedCount && selectedCount > 0 ? "py-2" : "py-2.5",
      nextDisabled
        ? "bg-muted text-muted-foreground cursor-not-allowed"
        : "bg-[#3b5bdb] hover:bg-[#364fc7] text-white",
    )

    const buttonContent = (
      <>
        <div className="flex flex-col items-center">
          <span className="text-sm leading-tight">{nextStepLabel}</span>
          {selectedCount !== undefined && selectedCount > 0 && (
            <span className="text-[10px] font-normal opacity-80 leading-tight">{selectedCount} {selectedCount === 1 ? "SKU" : "SKUs"} selected</span>
          )}
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0" />
      </>
    )

    if (onNextClick && !nextDisabled) {
      return (
        <button onClick={onNextClick} className={buttonClasses}>
          {buttonContent}
        </button>
      )
    }

    if (nextDisabled) {
      return (
        <span className={buttonClasses}>
          {buttonContent}
        </span>
      )
    }

    return (
      <Link href={nextStepHref} className={buttonClasses}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <div className="rounded-xl p-4 mb-6 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 border border-blue-100/60">
      <div className="flex items-center justify-between gap-4">
        {/* Progress Steps */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {stepsWithStatus.map((step, index) => {
            const isCompleted = step.completed ?? false
            const isActive = step.active ?? false

            return (
              <div key={step.number} className="flex items-center">
                {/* Step pill */}
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "px-2.5 py-1.5 text-[11px] bg-gradient-to-r from-[#2e9e54] to-[#45b369] text-white shadow-md z-10"
                      : isCompleted
                        ? "px-2 py-1 text-[10px] bg-gradient-to-r from-[#2e9e54] to-[#45b369] text-white shadow-sm"
                        : "px-2 py-1 text-[10px] bg-white/60 text-gray-400 border border-gray-200/60",
                  )}
                >
                  {/* Number circle or check */}
                  {isCompleted ? (
                    <span className="h-4 w-4 flex items-center justify-center rounded-full bg-green-900/30 text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-full font-bold",
                        isActive
                          ? "h-4 w-4 text-[9px] bg-green-900/30 text-white"
                          : "h-4 w-4 text-[9px] bg-gray-200 text-gray-400",
                      )}
                    >
                      {step.number}
                    </span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>

                {/* Arrow between steps */}
                {index < stepsWithStatus.length - 1 && (
                  <ArrowRight
                    className={cn(
                      "h-2.5 w-2.5 mx-0.5 flex-shrink-0",
                      isCompleted ? "text-green-400" : "text-gray-300",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Next Step CTA */}
        <NextButton />
      </div>
    </div>
  )
}
