import { streamText } from "ai"
import type { PrivateLabelMetrics } from "@/lib/data/category-performance"

export async function POST(request: Request) {
  const { category, period, metrics } = (await request.json()) as {
    category: string
    period: string
    metrics: PrivateLabelMetrics
  }

  const prompt = buildPrompt(category, period, metrics)

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: `You are a retail analytics expert specialising in private label performance for UK supermarkets. 
Provide concise, actionable insights in British English. Focus on:
- Key performance highlights and concerns
- Year-on-year trends that need attention
- Specific recommendations for improvement
Keep your response to 3-4 sentences maximum. Be direct and business-focused.`,
    prompt,
  })

  return result.toTextStreamResponse()
}

function buildPrompt(category: string, period: string, metrics: PrivateLabelMetrics): string {
  return `Analyse the following private label performance data for ${category} over ${period}:

**Market Position:**
- Value Share: ${metrics.marketShare.value.toFixed(1)}% (${metrics.marketShare.valueYoY > 0 ? "+" : ""}${metrics.marketShare.valueYoY.toFixed(1)}pts YoY)
- Volume Share: ${metrics.marketShare.volume.toFixed(1)}% (${metrics.marketShare.volumeYoY > 0 ? "+" : ""}${metrics.marketShare.volumeYoY.toFixed(1)}pts YoY)

**Sales Performance:**
- Turnover: £${(metrics.sales.turnover / 1000000).toFixed(2)}m (${metrics.sales.turnoverYoY > 0 ? "+" : ""}${metrics.sales.turnoverYoY.toFixed(1)}% YoY)
- Volume: ${(metrics.sales.volume / 1000).toFixed(0)}k units (${metrics.sales.volumeYoY > 0 ? "+" : ""}${metrics.sales.volumeYoY.toFixed(1)}% YoY)

**Profitability:**
- Trading Margin: ${metrics.tradingMargin.percent.toFixed(1)}% (${metrics.tradingMargin.percentYoY > 0 ? "+" : ""}${metrics.tradingMargin.percentYoY.toFixed(1)}pts YoY)
- Margin £: £${(metrics.tradingMargin.pounds / 1000).toFixed(0)}k (${metrics.tradingMargin.poundsYoY > 0 ? "+" : ""}${metrics.tradingMargin.poundsYoY.toFixed(1)}% YoY)

**Customer Metrics:**
- Baskets: ${metrics.customer.baskets}k (${metrics.customer.basketsYoY > 0 ? "+" : ""}${metrics.customer.basketsYoY.toFixed(1)}% YoY)
- Average Basket Size: £${metrics.customer.basketSize.toFixed(2)} (${metrics.customer.basketSizeYoY > 0 ? "+" : ""}${metrics.customer.basketSizeYoY.toFixed(1)}% YoY)

**Pricing:**
- Base Price: £${metrics.price.basePrice.toFixed(2)} (${metrics.price.basePriceYoY > 0 ? "+" : ""}${metrics.price.basePriceYoY.toFixed(1)}% YoY)
- Promo Volume: ${metrics.price.promoVolume.toFixed(1)}% (${metrics.price.promoVolumeYoY > 0 ? "+" : ""}${metrics.price.promoVolumeYoY.toFixed(1)}% YoY)

**Quality:**
- EOD Availability: ${metrics.quality.eodAvailability.toFixed(1)}% (${metrics.quality.eodAvailabilityYoY > 0 ? "+" : ""}${metrics.quality.eodAvailabilityYoY.toFixed(1)}% YoY)
- CPMUs: ${metrics.quality.cpmus.toFixed(2)} (${metrics.quality.cpmusYoY > 0 ? "+" : ""}${metrics.quality.cpmusYoY.toFixed(1)}% YoY)

**Wastage:**
- Waste & Markdown: ${metrics.wastage.wasteMarkdownPercent.toFixed(1)}% (${metrics.wastage.wasteMarkdownPercentYoY > 0 ? "+" : ""}${metrics.wastage.wasteMarkdownPercentYoY.toFixed(1)}% YoY)

Provide a brief executive summary highlighting the most important insights and any recommended actions.`
}
