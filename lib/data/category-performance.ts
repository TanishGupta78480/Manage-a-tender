// Dataset 3: Category performance - sales and margin data for each SKU
export interface PerformanceData {
  skuId: string
  period: string
  unitsSold: number
  revenue: number
  cost: number
  margin: number
  marginPercent: number
  vsLastYear: number // percentage change
  vsBudget: number // percentage vs budget
  wastage: number // percentage
  availability: number // percentage
}

export const categoryPerformance: PerformanceData[] = [
  // Victoria Sponge - strong performer
  {
    skuId: "SKU001",
    period: "2024-W45",
    unitsSold: 12650,
    revenue: 44275,
    cost: 23403,
    margin: 20872,
    marginPercent: 47.1,
    vsLastYear: 5.2,
    vsBudget: 102,
    wastage: 2.1,
    availability: 98.5,
  },
  {
    skuId: "SKU001",
    period: "2024-W44",
    unitsSold: 12200,
    revenue: 42700,
    cost: 22570,
    margin: 20130,
    marginPercent: 47,
    vsLastYear: 4.5,
    vsBudget: 98,
    wastage: 2.3,
    availability: 97.8,
  },
]

export interface PrivateLabelMetrics {
  // Main Metrics
  marketShare: {
    value: number // percentage
    valueYoY: number
    volume: number // percentage
    volumeYoY: number
  }
  sales: {
    turnover: number // in £
    turnoverYoY: number
    volume: number // units
    volumeYoY: number
  }
  tradingMargin: {
    pounds: number // in £
    poundsYoY: number
    percent: number // percentage
    percentYoY: number
  }
  // Input Metrics
  customer: {
    baskets: number // thousands
    basketsYoY: number
    basketSize: number // £
    basketSizeYoY: number
    frequency: number // times per month
    frequencyYoY: number
  }
  price: {
    basePrice: number // £
    basePriceYoY: number
    averagePrice: number // £
    averagePriceYoY: number
    promoVolume: number // percentage
    promoVolumeYoY: number
  }
  quality: {
    inboundAvailability: number // percentage
    inboundAvailabilityYoY: number
    eodAvailability: number // percentage
    eodAvailabilityYoY: number
    cpmus: number // Customer Product Misses per Unit (lower is better)
    cpmusYoY: number
  }
  range: {
    skuCount: number
    skuCountYoY: number
    stockingPoints: number // average stores stocking
    stockingPointsYoY: number
  }
  wastage: {
    wasteMarkdownPercent: number
    wasteMarkdownPercentYoY: number
    yieldPercent: number
    yieldPercentYoY: number
  }
  cash: {
    averagePaymentDays: number
    averagePaymentDaysYoY: number
    averageStock: number // in £
    averageStockYoY: number
  }
}

export const privateLabelMetrics: Record<string, Record<string, PrivateLabelMetrics>> = {
  Bakery: {
    "Last 4 Weeks": {
      marketShare: { value: 42.3, valueYoY: 2.1, volume: 38.7, volumeYoY: 1.8 },
      sales: { turnover: 2847000, turnoverYoY: 5.4, volume: 847000, volumeYoY: 3.2 },
      tradingMargin: { pounds: 1138800, poundsYoY: 6.8, percent: 40.0, percentYoY: 0.5 },
      customer: {
        baskets: 425,
        basketsYoY: 2.3,
        basketSize: 6.7,
        basketSizeYoY: 3.0,
        frequency: 2.4,
        frequencyYoY: 0.8,
      },
      price: {
        basePrice: 3.25,
        basePriceYoY: 4.2,
        averagePrice: 2.89,
        averagePriceYoY: 2.1,
        promoVolume: 28.5,
        promoVolumeYoY: -2.3,
      },
      quality: {
        inboundAvailability: 97.2,
        inboundAvailabilityYoY: 0.8,
        eodAvailability: 94.5,
        eodAvailabilityYoY: 1.2,
        cpmus: 0.42,
        cpmusYoY: -8.7,
      },
      range: { skuCount: 48, skuCountYoY: 4.3, stockingPoints: 487, stockingPointsYoY: 2.1 },
      wastage: { wasteMarkdownPercent: 3.2, wasteMarkdownPercentYoY: -0.4, yieldPercent: 96.8, yieldPercentYoY: 0.4 },
      cash: { averagePaymentDays: 42, averagePaymentDaysYoY: -3.2, averageStock: 485000, averageStockYoY: -2.1 },
    },
    "Last 12 Weeks": {
      marketShare: { value: 41.8, valueYoY: 1.9, volume: 38.2, volumeYoY: 1.5 },
      sales: { turnover: 8340000, turnoverYoY: 4.8, volume: 2480000, volumeYoY: 2.9 },
      tradingMargin: { pounds: 3253000, poundsYoY: 5.9, percent: 39.0, percentYoY: 0.4 },
      customer: {
        baskets: 1245,
        basketsYoY: 2.0,
        basketSize: 6.65,
        basketSizeYoY: 2.8,
        frequency: 2.3,
        frequencyYoY: 0.5,
      },
      price: {
        basePrice: 3.2,
        basePriceYoY: 3.8,
        averagePrice: 2.85,
        averagePriceYoY: 1.8,
        promoVolume: 30.2,
        promoVolumeYoY: -1.8,
      },
      quality: {
        inboundAvailability: 96.8,
        inboundAvailabilityYoY: 0.6,
        eodAvailability: 93.8,
        eodAvailabilityYoY: 0.9,
        cpmus: 0.48,
        cpmusYoY: -6.2,
      },
      range: { skuCount: 46, skuCountYoY: 2.2, stockingPoints: 482, stockingPointsYoY: 1.8 },
      wastage: { wasteMarkdownPercent: 3.5, wasteMarkdownPercentYoY: -0.2, yieldPercent: 96.5, yieldPercentYoY: 0.2 },
      cash: { averagePaymentDays: 44, averagePaymentDaysYoY: -2.8, averageStock: 512000, averageStockYoY: -1.5 },
    },
    "Last 52 Weeks": {
      marketShare: { value: 40.5, valueYoY: 1.5, volume: 37.0, volumeYoY: 1.2 },
      sales: { turnover: 34200000, turnoverYoY: 4.2, volume: 10150000, volumeYoY: 2.5 },
      tradingMargin: { pounds: 13000000, poundsYoY: 5.1, percent: 38.0, percentYoY: 0.3 },
      customer: {
        baskets: 5100,
        basketsYoY: 1.8,
        basketSize: 6.55,
        basketSizeYoY: 2.4,
        frequency: 2.2,
        frequencyYoY: 0.3,
      },
      price: {
        basePrice: 3.15,
        basePriceYoY: 3.5,
        averagePrice: 2.8,
        averagePriceYoY: 1.5,
        promoVolume: 31.5,
        promoVolumeYoY: -1.2,
      },
      quality: {
        inboundAvailability: 96.2,
        inboundAvailabilityYoY: 0.4,
        eodAvailability: 93.2,
        eodAvailabilityYoY: 0.6,
        cpmus: 0.52,
        cpmusYoY: -4.5,
      },
      range: { skuCount: 44, skuCountYoY: 0.0, stockingPoints: 475, stockingPointsYoY: 1.2 },
      wastage: { wasteMarkdownPercent: 3.8, wasteMarkdownPercentYoY: 0.1, yieldPercent: 96.2, yieldPercentYoY: -0.1 },
      cash: { averagePaymentDays: 46, averagePaymentDaysYoY: -1.5, averageStock: 538000, averageStockYoY: 0.8 },
    },
    YTD: {
      marketShare: { value: 41.2, valueYoY: 1.7, volume: 37.8, volumeYoY: 1.4 },
      sales: { turnover: 28500000, turnoverYoY: 4.5, volume: 8450000, volumeYoY: 2.7 },
      tradingMargin: { pounds: 10830000, poundsYoY: 5.5, percent: 38.0, percentYoY: 0.4 },
      customer: {
        baskets: 4250,
        basketsYoY: 1.9,
        basketSize: 6.6,
        basketSizeYoY: 2.6,
        frequency: 2.25,
        frequencyYoY: 0.4,
      },
      price: {
        basePrice: 3.18,
        basePriceYoY: 3.6,
        averagePrice: 2.82,
        averagePriceYoY: 1.6,
        promoVolume: 30.8,
        promoVolumeYoY: -1.5,
      },
      quality: {
        inboundAvailability: 96.5,
        inboundAvailabilityYoY: 0.5,
        eodAvailability: 93.5,
        eodAvailabilityYoY: 0.7,
        cpmus: 0.5,
        cpmusYoY: -5.2,
      },
      range: { skuCount: 45, skuCountYoY: 1.1, stockingPoints: 478, stockingPointsYoY: 1.5 },
      wastage: { wasteMarkdownPercent: 3.6, wasteMarkdownPercentYoY: -0.1, yieldPercent: 96.4, yieldPercentYoY: 0.1 },
      cash: { averagePaymentDays: 45, averagePaymentDaysYoY: -2.2, averageStock: 525000, averageStockYoY: -0.5 },
    },
  },
}

export function getPrivateLabelMetrics(category: string, period: string): PrivateLabelMetrics | null {
  return privateLabelMetrics[category]?.[period] || null
}
