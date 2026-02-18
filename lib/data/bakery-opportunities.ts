// Bakery Opportunity Analytics Dataset
// Based on the provided CSV with opportunity identification logic
// Now integrated with tender dataset for live tender signals

export interface BakeryTender {
  tenderId: string
  subcategory: string
  includedSkus: string[]
  tenderStatus: "Live" | "Planned" | "Closed"
  tenderStartDate: string
  tenderEndDate: string
  monthsToAward: number
  commercialFocus: string
  incumbentSupplier: string
}

export const bakeryTenders: BakeryTender[] = [
  {
    tenderId: "TND-001",
    subcategory: "Celebration Cakes",
    includedSkus: ["Lemon Drizzle Cake 8in", "Vanilla Sponge Cake 8in", "Carrot Cake 8in"],
    tenderStatus: "Live",
    tenderStartDate: "2026-01-16",
    tenderEndDate: "2026-04-16",
    monthsToAward: 3,
    commercialFocus: "Input cost reset, spec alignment, margin recovery",
    incumbentSupplier: "Supplier A",
  },
  {
    tenderId: "TND-002",
    subcategory: "Breads",
    includedSkus: ["White Bread Loaf", "Wholemeal Bread Loaf"],
    tenderStatus: "Planned",
    tenderStartDate: "2026-03-17",
    tenderEndDate: "2026-06-15",
    monthsToAward: 5,
    commercialFocus: "Cost reduction",
    incumbentSupplier: "Supplier B",
  },
  {
    tenderId: "TND-003",
    subcategory: "Pastries",
    includedSkus: ["Butter Croissant", "Pain au Chocolat"],
    tenderStatus: "Closed",
    tenderStartDate: "2025-07-20",
    tenderEndDate: "2025-11-17",
    monthsToAward: 0,
    commercialFocus: "Spec upgrade",
    incumbentSupplier: "Supplier C",
  },
]

export interface BakeryOpportunity {
  category: string
  subcategory: string
  sku: string
  skuId: string
  annualUnits: number
  ourPriceGBP: number
  marketPriceGBP: number
  priceIndex: number
  supplierUnitCostGBP: number
  supplierUnitCost12MAgoGBP: number
  supplierCostYoYPct: number
  grossMarginPct: number
  annualRevenueGBP: number
  annualSpendGBP: number
  annualGrossMarginGBP: number
  // Commodity 1
  commodity1: string
  commodity1Weight: number
  commodity1SeriesId: string
  commodity1Source: string
  commodity1Units: string
  commodity1PrevMonth: string
  commodity1PrevValue: number
  commodity1CurrMonth: string
  commodity1CurrValue: number
  commodity1YoYPct: number
  // Commodity 2
  commodity2: string
  commodity2Weight: number
  commodity2SeriesId: string
  commodity2Source: string
  commodity2Units: string
  commodity2PrevMonth: string
  commodity2PrevValue: number
  commodity2CurrMonth: string
  commodity2CurrValue: number
  commodity2YoYPct: number
  // Calculated fields
  commodityBasketYoYPct: number
  inputPriceGapPct: number
  // Spec fields (optional)
  specMetric: string | null
  ourSpec: number | null
  marketSpecMin: number | null
  marketSpecMax: number | null
  specGapVsMin: number | null
  specPotentialSavingGBP: number | null // Added specPotentialSavingGBP field
  // Contract
  monthsToTender: number
  // Flags
  inputPriceFlag: boolean
  specFlag: boolean
  priceMarginFlag: boolean
  contractFlag: boolean
  opportunityCount: number
  priority: "High" | "Medium" | "Low" | "None"
  // Value sizing
  potentialInputSavingGBP: number
  potentialMarginUpliftGBP: number
  totalValueAtStakeGBP: number
  narrative: string
  // Tender-related fields
  tenderStatus?: "Live" | "Planned" | "Closed" | null
  tenderId?: string | null
  monthsToAward?: number | null
  commercialFocus?: string | null
  isLiveTender?: boolean
}

// Helper function to enrich opportunities with tender data
function enrichWithTenderData(opportunities: BakeryOpportunity[]): BakeryOpportunity[] {
  return opportunities.map((opp) => {
    const tender = bakeryTenders.find((t) => t.subcategory === opp.subcategory || t.includedSkus.includes(opp.sku))

    if (tender) {
      const isLive = tender.tenderStatus === "Live"
      // If live tender, override contract flag and escalate priority
      const hasOtherLevers = opp.inputPriceFlag || opp.specFlag || opp.priceMarginFlag
      const newPriority = isLive && hasOtherLevers ? "High" : opp.priority
      const newContractFlag = isLive ? true : opp.contractFlag
      const newOpportunityCount = isLive && !opp.contractFlag ? opp.opportunityCount + 1 : opp.opportunityCount

      return {
        ...opp,
        tenderStatus: tender.tenderStatus,
        tenderId: tender.tenderId,
        monthsToAward: tender.monthsToAward,
        commercialFocus: tender.commercialFocus,
        isLiveTender: isLive,
        contractFlag: newContractFlag,
        priority: newPriority,
        opportunityCount: newOpportunityCount,
      }
    }
    return opp
  })
}

const rawBakeryOpportunities: BakeryOpportunity[] = [
  // Celebration Cakes
  {
    category: "Bakery",
    subcategory: "Celebration Cakes",
    sku: "Choc Fudge Cake 8in",
    skuId: "BAK-0001",
    annualUnits: 14052,
    ourPriceGBP: 9.4,
    marketPriceGBP: 9.16,
    priceIndex: 1.026,
    supplierUnitCostGBP: 5.82,
    supplierUnitCost12MAgoGBP: 5.01,
    supplierCostYoYPct: 0.162,
    grossMarginPct: 0.381,
    annualRevenueGBP: 132089,
    annualSpendGBP: 81783,
    annualGrossMarginGBP: 50306,
    commodity1: "Cocoa",
    commodity1Weight: 0.6,
    commodity1SeriesId: "WPU02540109",
    commodity1Source: "FRED (BLS Producer Price Index)",
    commodity1Units: "Index (Jun 1983=100)",
    commodity1PrevMonth: "2024-09-01",
    commodity1PrevValue: 628.945,
    commodity1CurrMonth: "2025-09-01",
    commodity1CurrValue: 796.586,
    commodity1YoYPct: 0.267,
    commodity2: "Butter",
    commodity2Weight: 0.4,
    commodity2SeriesId: "APU0000FS1101",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 4.728,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 4.408,
    commodity2YoYPct: -0.068,
    commodityBasketYoYPct: 0.133,
    inputPriceGapPct: 0.029,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 2,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: false,
    contractFlag: true,
    opportunityCount: 1,
    priority: "Medium",
    potentialInputSavingGBP: 2372,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 2372,
    narrative: "",
  },
  {
    category: "Bakery",
    subcategory: "Celebration Cakes",
    sku: "Vanilla Sponge Cake 8in",
    skuId: "BAK-0002",
    annualUnits: 29800,
    ourPriceGBP: 8.53,
    marketPriceGBP: 8.27,
    priceIndex: 1.031,
    supplierUnitCostGBP: 4.92,
    supplierUnitCost12MAgoGBP: 6.15,
    supplierCostYoYPct: -0.2,
    grossMarginPct: 0.423,
    annualRevenueGBP: 254194,
    annualSpendGBP: 146616,
    annualGrossMarginGBP: 107578,
    commodity1: "Eggs",
    commodity1Weight: 0.55,
    commodity1SeriesId: "APU0000708111",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per dozen",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 4.146,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 2.712,
    commodity1YoYPct: -0.346,
    commodity2: "Sugar",
    commodity2Weight: 0.45,
    commodity2SeriesId: "APU0000715211",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.992,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.985,
    commodity2YoYPct: -0.007,
    commodityBasketYoYPct: -0.193,
    inputPriceGapPct: -0.006,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 2,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: false,
    contractFlag: true,
    opportunityCount: 1,
    priority: "Medium",
    potentialInputSavingGBP: 0,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 0,
    narrative: "",
  },
  // Lemon Drizzle Cake - CASE STUDY (All 4 levers triggered + LIVE TENDER)
  {
    category: "Bakery",
    subcategory: "Celebration Cakes",
    sku: "Lemon Drizzle Cake 8in",
    skuId: "BAK-0006",
    annualUnits: 42000,
    ourPriceGBP: 5.25,
    marketPriceGBP: 5.0,
    priceIndex: 1.05,
    supplierUnitCostGBP: 4.1,
    supplierUnitCost12MAgoGBP: 3.84,
    supplierCostYoYPct: 0.067, // Updated supplier cost increase
    grossMarginPct: 0.26, // Updated margin to 26% (was 21.9%), comparing unfavorably to 30% target
    annualRevenueGBP: 220500,
    annualSpendGBP: 172200,
    annualGrossMarginGBP: 48300,
    commodity1: "Lemons",
    commodity1Weight: 0.55,
    commodity1SeriesId: "APU0000711412",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per lb",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 2.121,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 2.03,
    commodity1YoYPct: 0.005, // +0.5% increase
    commodity2: "Eggs",
    commodity2Weight: 0.45,
    commodity2SeriesId: "APU0000708111",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per dozen",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 4.02,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 4.0,
    commodity2YoYPct: -0.005, // -0.5% decrease
    commodityBasketYoYPct: 0.002, // +0.2% (0.55 * 0.5% + 0.45 * -0.5% ≈ 0.2%)
    inputPriceGapPct: 0.065, // 6.7% - 0.2% = 6.5% gap
    specMetric: "Lemon Curd",
    ourSpec: 15.0,
    marketSpecMin: 19.0,
    marketSpecMax: 19.0,
    specGapVsMin: -4.0,
    specPotentialSavingGBP: 0,
    monthsToTender: 3,
    inputPriceFlag: true,
    specFlag: true,
    priceMarginFlag: true,
    contractFlag: true,
    opportunityCount: 4,
    priority: "High",
    potentialInputSavingGBP: 15800,
    potentialMarginUpliftGBP: 6836,
    totalValueAtStakeGBP: 22636,
    narrative:
      "Case study: Supplier cost +6.7% YoY while commodity basket rose only +0.2% (lemons +0.5%, eggs -0.5%); lemon curd spec 15% vs market 19%; price index 1.05 with margin 26%; LIVE TENDER in progress.",
  },
  // Butter Croissant - High priority (4 levers)
  {
    category: "Bakery",
    subcategory: "Pastries",
    sku: "Butter Croissant",
    skuId: "BAK-0042",
    annualUnits: 99437,
    ourPriceGBP: 1.65,
    marketPriceGBP: 1.5,
    priceIndex: 1.1,
    supplierUnitCostGBP: 1.27,
    supplierUnitCost12MAgoGBP: 1.17,
    supplierCostYoYPct: 0.09,
    grossMarginPct: 0.23,
    annualRevenueGBP: 164071,
    annualSpendGBP: 126285,
    annualGrossMarginGBP: 37786,
    commodity1: "Butter",
    commodity1Weight: 0.6,
    commodity1SeriesId: "APU0000FS1101",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per lb",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 4.728,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 4.408,
    commodity1YoYPct: -0.068,
    commodity2: "Flour",
    commodity2Weight: 0.4,
    commodity2SeriesId: "APU0000701111",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.548,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.554,
    commodity2YoYPct: 0.011,
    commodityBasketYoYPct: -0.036,
    inputPriceGapPct: 0.126,
    specMetric: "Butter content %",
    ourSpec: 22.0,
    marketSpecMin: 25.0,
    marketSpecMax: 28.0,
    specGapVsMin: -3.0,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 5,
    inputPriceFlag: true,
    specFlag: true,
    priceMarginFlag: true,
    contractFlag: true,
    opportunityCount: 4,
    priority: "High",
    potentialInputSavingGBP: 15912,
    potentialMarginUpliftGBP: 3281,
    totalValueAtStakeGBP: 19193,
    narrative:
      "Cost up despite butter price falling; priced 10% above market with sub-25% margin; tender within 6 months.",
  },
  // White Bread Loaf - High priority (3 levers)
  {
    category: "Bakery",
    subcategory: "Breads",
    sku: "White Bread Loaf",
    skuId: "BAK-0081",
    annualUnits: 249255,
    ourPriceGBP: 1.56,
    marketPriceGBP: 1.5,
    priceIndex: 1.04,
    supplierUnitCostGBP: 1.25,
    supplierUnitCost12MAgoGBP: 1.12,
    supplierCostYoYPct: 0.12,
    grossMarginPct: 0.199,
    annualRevenueGBP: 388838,
    annualSpendGBP: 311569,
    annualGrossMarginGBP: 77269,
    commodity1: "Flour",
    commodity1Weight: 0.85,
    commodity1SeriesId: "APU0000701111",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per lb",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 0.548,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 0.554,
    commodity1YoYPct: 0.011,
    commodity2: "Sugar",
    commodity2Weight: 0.15,
    commodity2SeriesId: "APU0000715211",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.992,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.985,
    commodity2YoYPct: -0.007,
    commodityBasketYoYPct: 0.008,
    inputPriceGapPct: 0.112,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 3,
    inputPriceFlag: true,
    specFlag: false,
    priceMarginFlag: true,
    contractFlag: true,
    opportunityCount: 3,
    priority: "High",
    potentialInputSavingGBP: 34896,
    potentialMarginUpliftGBP: 19831,
    totalValueAtStakeGBP: 54727,
    narrative:
      "Supplier cost rising faster than flour/sugar basket; priced above market with low margin; tender in 3 months.",
  },
  // Chocolate Chip Cookies 12PK - Medium (2 levers)
  {
    category: "Bakery",
    subcategory: "Cookies",
    sku: "Chocolate Chip Cookies 12pk",
    skuId: "BAK-0051",
    annualUnits: 74393,
    ourPriceGBP: 3.34,
    marketPriceGBP: 3.27,
    priceIndex: 1.021,
    supplierUnitCostGBP: 1.98,
    supplierUnitCost12MAgoGBP: 1.74,
    supplierCostYoYPct: 0.14,
    grossMarginPct: 0.407,
    annualRevenueGBP: 248473,
    annualSpendGBP: 147298,
    annualGrossMarginGBP: 101175,
    commodity1: "Cocoa",
    commodity1Weight: 0.6,
    commodity1SeriesId: "WPU02540109",
    commodity1Source: "FRED (BLS Producer Price Index)",
    commodity1Units: "Index (Jun 1983=100)",
    commodity1PrevMonth: "2024-09-01",
    commodity1PrevValue: 628.945,
    commodity1CurrMonth: "2025-09-01",
    commodity1CurrValue: 796.586,
    commodity1YoYPct: 0.267,
    commodity2: "Butter",
    commodity2Weight: 0.4,
    commodity2SeriesId: "APU0000FS1101",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 4.728,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 4.408,
    commodity2YoYPct: -0.068,
    commodityBasketYoYPct: 0.133,
    inputPriceGapPct: 0.007,
    specMetric: "Chocolate content %",
    ourSpec: 12.0,
    marketSpecMin: 15.0,
    marketSpecMax: 18.0,
    specGapVsMin: -3.0,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 6,
    inputPriceFlag: false,
    specFlag: true,
    priceMarginFlag: false,
    contractFlag: true,
    opportunityCount: 2,
    priority: "Medium",
    potentialInputSavingGBP: 1031,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 1031,
    narrative:
      "Supplier cost rising faster than flour/cocoa basket; chocolate content below market; tender within 6 months.",
  },
  // Apple Tart - Medium (2 levers)
  {
    category: "Bakery",
    subcategory: "Tarts",
    sku: "Apple Tart",
    skuId: "BAK-0031",
    annualUnits: 33018,
    ourPriceGBP: 4.32,
    marketPriceGBP: 4.0,
    priceIndex: 1.08,
    supplierUnitCostGBP: 3.28,
    supplierUnitCost12MAgoGBP: 3.19,
    supplierCostYoYPct: 0.027,
    grossMarginPct: 0.241,
    annualRevenueGBP: 142638,
    annualSpendGBP: 108299,
    annualGrossMarginGBP: 34339,
    commodity1: "Flour",
    commodity1Weight: 0.55,
    commodity1SeriesId: "APU0000701111",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per lb",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 0.548,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 0.554,
    commodity1YoYPct: 0.011,
    commodity2: "Sugar",
    commodity2Weight: 0.45,
    commodity2SeriesId: "APU0000715211",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.992,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.985,
    commodity2YoYPct: -0.007,
    commodityBasketYoYPct: 0.003,
    inputPriceGapPct: 0.024,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 4,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: true,
    contractFlag: true,
    opportunityCount: 2,
    priority: "Medium",
    potentialInputSavingGBP: 2599,
    potentialMarginUpliftGBP: 1284,
    totalValueAtStakeGBP: 3883,
    narrative: "Priced above market with weak margin; tender within 6 months.",
  },
  // Jam Donuts 6PK - Low (1 lever - spec)
  {
    category: "Bakery",
    subcategory: "Donuts",
    sku: "Jam Donuts 6pk",
    skuId: "BAK-0074",
    annualUnits: 34094,
    ourPriceGBP: 3.63,
    marketPriceGBP: 3.5,
    priceIndex: 1.037,
    supplierUnitCostGBP: 2.33,
    supplierUnitCost12MAgoGBP: 2.36,
    supplierCostYoYPct: -0.011,
    grossMarginPct: 0.358,
    annualRevenueGBP: 123761,
    annualSpendGBP: 79439,
    annualGrossMarginGBP: 44322,
    commodity1: "Flour",
    commodity1Weight: 0.65,
    commodity1SeriesId: "APU0000701111",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per lb",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 0.548,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 0.554,
    commodity1YoYPct: 0.011,
    commodity2: "Sugar",
    commodity2Weight: 0.35,
    commodity2SeriesId: "APU0000715211",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.992,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.985,
    commodity2YoYPct: -0.007,
    commodityBasketYoYPct: 0.005,
    inputPriceGapPct: -0.016,
    specMetric: "Jam fill %",
    ourSpec: 10.0,
    marketSpecMin: 12.0,
    marketSpecMax: 14.0,
    specGapVsMin: -2.0,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 7,
    inputPriceFlag: false,
    specFlag: true,
    priceMarginFlag: false,
    contractFlag: false,
    opportunityCount: 1,
    priority: "Low",
    potentialInputSavingGBP: 0,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 0,
    narrative: "",
  },
  // Additional SKUs
  {
    category: "Bakery",
    subcategory: "Everyday Cakes",
    sku: "Plain Sponge Cake",
    skuId: "BAK-0011",
    annualUnits: 40112,
    ourPriceGBP: 5.17,
    marketPriceGBP: 5.34,
    priceIndex: 0.968,
    supplierUnitCostGBP: 3.73,
    supplierUnitCost12MAgoGBP: 4.33,
    supplierCostYoYPct: -0.139,
    grossMarginPct: 0.279,
    annualRevenueGBP: 207379,
    annualSpendGBP: 149618,
    annualGrossMarginGBP: 57761,
    commodity1: "Eggs",
    commodity1Weight: 0.55,
    commodity1SeriesId: "APU0000708111",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per dozen",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 4.146,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 2.712,
    commodity1YoYPct: -0.346,
    commodity2: "Sugar",
    commodity2Weight: 0.45,
    commodity2SeriesId: "APU0000715211",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.992,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.985,
    commodity2YoYPct: -0.007,
    commodityBasketYoYPct: -0.193,
    inputPriceGapPct: 0.054,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 10,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: false,
    contractFlag: false,
    opportunityCount: 0,
    priority: "None",
    potentialInputSavingGBP: 8079,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 8079,
    narrative: "",
  },
  {
    category: "Bakery",
    subcategory: "Brownies",
    sku: "Classic Chocolate Brownies 6pk",
    skuId: "BAK-0061",
    annualUnits: 65971,
    ourPriceGBP: 3.71,
    marketPriceGBP: 3.65,
    priceIndex: 1.016,
    supplierUnitCostGBP: 2.43,
    supplierUnitCost12MAgoGBP: 2.08,
    supplierCostYoYPct: 0.166,
    grossMarginPct: 0.345,
    annualRevenueGBP: 244752,
    annualSpendGBP: 160310,
    annualGrossMarginGBP: 84442,
    commodity1: "Cocoa",
    commodity1Weight: 0.6,
    commodity1SeriesId: "WPU02540109",
    commodity1Source: "FRED (BLS Producer Price Index)",
    commodity1Units: "Index (Jun 1983=100)",
    commodity1PrevMonth: "2024-09-01",
    commodity1PrevValue: 628.945,
    commodity1CurrMonth: "2025-09-01",
    commodity1CurrValue: 796.586,
    commodity1YoYPct: 0.267,
    commodity2: "Butter",
    commodity2Weight: 0.4,
    commodity2SeriesId: "APU0000FS1101",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 4.728,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 4.408,
    commodity2YoYPct: -0.068,
    commodityBasketYoYPct: 0.133,
    inputPriceGapPct: 0.033,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 2,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: false,
    contractFlag: true,
    opportunityCount: 1,
    priority: "Medium",
    potentialInputSavingGBP: 5290,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 5290,
    narrative: "",
  },
  {
    category: "Bakery",
    subcategory: "Multipack Cakes",
    sku: "Chocolate Muffins 4pk",
    skuId: "BAK-0024",
    annualUnits: 80605,
    ourPriceGBP: 3.47,
    marketPriceGBP: 3.35,
    priceIndex: 1.036,
    supplierUnitCostGBP: 2.19,
    supplierUnitCost12MAgoGBP: 1.92,
    supplierCostYoYPct: 0.138,
    grossMarginPct: 0.369,
    annualRevenueGBP: 279699,
    annualSpendGBP: 176525,
    annualGrossMarginGBP: 103174,
    commodity1: "Cocoa",
    commodity1Weight: 0.6,
    commodity1SeriesId: "WPU02540109",
    commodity1Source: "FRED (BLS Producer Price Index)",
    commodity1Units: "Index (Jun 1983=100)",
    commodity1PrevMonth: "2024-09-01",
    commodity1PrevValue: 628.945,
    commodity1CurrMonth: "2025-09-01",
    commodity1CurrValue: 796.586,
    commodity1YoYPct: 0.267,
    commodity2: "Butter",
    commodity2Weight: 0.4,
    commodity2SeriesId: "APU0000FS1101",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 4.728,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 4.408,
    commodity2YoYPct: -0.068,
    commodityBasketYoYPct: 0.133,
    inputPriceGapPct: 0.005,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 8,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: false,
    contractFlag: false,
    opportunityCount: 0,
    priority: "None",
    potentialInputSavingGBP: 883,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 883,
    narrative: "",
  },
  {
    category: "Bakery",
    subcategory: "Seasonal Bakery",
    sku: "Hot Cross Buns 4pk",
    skuId: "BAK-0091",
    annualUnits: 180540,
    ourPriceGBP: 1.84,
    marketPriceGBP: 1.85,
    priceIndex: 0.995,
    supplierUnitCostGBP: 1.15,
    supplierUnitCost12MAgoGBP: 1.08,
    supplierCostYoYPct: 0.065,
    grossMarginPct: 0.375,
    annualRevenueGBP: 332194,
    annualSpendGBP: 207621,
    annualGrossMarginGBP: 124573,
    commodity1: "Flour",
    commodity1Weight: 0.7,
    commodity1SeriesId: "APU0000701111",
    commodity1Source: "FRED (BLS Average Price Data)",
    commodity1Units: "USD per lb",
    commodity1PrevMonth: "2024-12-01",
    commodity1PrevValue: 0.548,
    commodity1CurrMonth: "2025-12-01",
    commodity1CurrValue: 0.554,
    commodity1YoYPct: 0.011,
    commodity2: "Sugar",
    commodity2Weight: 0.3,
    commodity2SeriesId: "APU0000715211",
    commodity2Source: "FRED (BLS Average Price Data)",
    commodity2Units: "USD per lb",
    commodity2PrevMonth: "2024-12-01",
    commodity2PrevValue: 0.992,
    commodity2CurrMonth: "2025-12-01",
    commodity2CurrValue: 0.985,
    commodity2YoYPct: -0.007,
    commodityBasketYoYPct: 0.006,
    inputPriceGapPct: 0.059,
    specMetric: null,
    ourSpec: null,
    marketSpecMin: null,
    marketSpecMax: null,
    specGapVsMin: null,
    specPotentialSavingGBP: null, // Added specPotentialSavingGBP field
    monthsToTender: 9,
    inputPriceFlag: false,
    specFlag: false,
    priceMarginFlag: false,
    contractFlag: false,
    opportunityCount: 0,
    priority: "None",
    potentialInputSavingGBP: 12249,
    potentialMarginUpliftGBP: 0,
    totalValueAtStakeGBP: 12249,
    narrative: "",
  },
]

// Export enriched opportunities with tender data
export const bakeryOpportunities = enrichWithTenderData(rawBakeryOpportunities)

// Helper function to get Lemon Drizzle Cake data for case study
export function getLemonDrizzleCakeData(): BakeryOpportunity | undefined {
  return bakeryOpportunities.find((o) => o.sku === "Lemon Drizzle Cake 8in")
}

// Helper function to get tender by subcategory
export function getTenderBySubcategory(subcategory: string): BakeryTender | undefined {
  return bakeryTenders.find((t) => t.subcategory === subcategory)
}

// Helper function to get all live tender SKUs
export function getLiveTenderOpportunities(): BakeryOpportunity[] {
  return bakeryOpportunities.filter((o) => o.isLiveTender)
}

// Helper function to get high priority opportunities (sorted by value)
export function getHighPriorityOpportunities(): BakeryOpportunity[] {
  return bakeryOpportunities
    .filter((o) => o.priority === "High")
    .sort((a, b) => b.totalValueAtStakeGBP - a.totalValueAtStakeGBP)
}

// Helper function to get spec opportunities (for spec-opportunities component)
export function getSpecOpportunities(): BakeryOpportunity[] {
  return bakeryOpportunities.filter(
    (o) => o.specFlag && o.specMetric !== null && o.ourSpec !== null && o.marketSpecMin !== null,
  )
}

// Get opportunities grouped by subcategory
export function getOpportunitiesBySubcategory(): Record<string, BakeryOpportunity[]> {
  return bakeryOpportunities.reduce(
    (acc, opp) => {
      if (!acc[opp.subcategory]) {
        acc[opp.subcategory] = []
      }
      acc[opp.subcategory].push(opp)
      return acc
    },
    {} as Record<string, BakeryOpportunity[]>,
  )
}
