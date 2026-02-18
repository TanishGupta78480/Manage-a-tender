// ============================================
// DATASET 1: SUPPLIERS
// ============================================
export interface Supplier {
  id: string
  name: string
  country: string
  location: string
  currentSupplier: boolean
  subCategoriesSupplied: string[] // What they currently supply to Morrisons
  canSupply: string[] // All products they can supply
  otherRetailers: string[] // Other major retailers they supply
  // Metrics
  financialHealth: {
    revenue: number // in millions GBP
    rating: "Strong" | "Good" | "Fair" | "Weak"
    trend: "up" | "stable" | "down"
  }
  accreditation: {
    brcGrade: "AA" | "A" | "B" | "C" | "None"
    certifications: string[]
    lastAuditDate: string
    auditScore: number // percentage
  }
  otifPerformance: number | null // On Time In Full percentage, null if not current supplier
  reliabilityScore: number // 1-100
  // Contact & Admin
  contactEmail: string
  contactName: string
  notes: string[]
  status: "active" | "potential" | "inactive"
  leadTime: string
  minimumOrder: string
}

export const suppliers: Supplier[] = [
  {
    id: "SUP001",
    name: "Golden Crust Bakeries",
    country: "United Kingdom",
    location: "Manchester",
    currentSupplier: true,
    subCategoriesSupplied: ["Celebration Cakes", "Everyday Cakes", "Cookies"],
    canSupply: ["Celebration Cakes", "Everyday Cakes", "Multipack Cakes", "Cookies", "Brownies", "Seasonal Bakery"],
    otherRetailers: ["Tesco", "Sainsbury's"],
    financialHealth: {
      revenue: 45.2,
      rating: "Strong",
      trend: "up",
    },
    accreditation: {
      brcGrade: "A",
      certifications: ["BRC Grade A", "Organic", "Red Tractor"],
      lastAuditDate: "2024-09-15",
      auditScore: 94,
    },
    otifPerformance: 97.2,
    reliabilityScore: 95,
    contactEmail: "sales@goldencrust.co.uk",
    contactName: "Sarah Mitchell",
    notes: ["Excellent quality consistency", "Flexible on short notice orders"],
    status: "active",
    leadTime: "5-7 days",
    minimumOrder: "500 units",
  },
  {
    id: "SUP002",
    name: "Sunrise Artisan Foods",
    country: "United Kingdom",
    location: "Leeds",
    currentSupplier: true,
    subCategoriesSupplied: ["Celebration Cakes", "Tarts"],
    canSupply: ["Celebration Cakes", "Everyday Cakes", "Tarts", "Pastries", "Seasonal Bakery"],
    otherRetailers: ["Waitrose", "M&S"],
    financialHealth: {
      revenue: 38.5,
      rating: "Strong",
      trend: "up",
    },
    accreditation: {
      brcGrade: "AA",
      certifications: ["BRC Grade AA", "ISO 22000"],
      lastAuditDate: "2024-08-20",
      auditScore: 96,
    },
    otifPerformance: 98.1,
    reliabilityScore: 97,
    contactEmail: "orders@sunriseartisan.co.uk",
    contactName: "James Thompson",
    notes: ["Premium artisan positioning", "Excellent on pastries"],
    status: "active",
    leadTime: "4-6 days",
    minimumOrder: "300 units",
  },
  {
    id: "SUP003",
    name: "Heritage Oven Co",
    country: "United Kingdom",
    location: "Birmingham",
    currentSupplier: true,
    subCategoriesSupplied: ["Tarts", "Breads"],
    canSupply: ["Celebration Cakes", "Tarts", "Pastries", "Brownies", "Breads"],
    otherRetailers: ["Asda", "Co-op"],
    financialHealth: {
      revenue: 28.8,
      rating: "Good",
      trend: "stable",
    },
    accreditation: {
      brcGrade: "A",
      certifications: ["BRC Grade A", "SALSA"],
      lastAuditDate: "2024-10-01",
      auditScore: 91,
    },
    otifPerformance: 94.5,
    reliabilityScore: 92,
    contactEmail: "b2b@heritageoven.co.uk",
    contactName: "Marie Dubois",
    notes: ["Strong on traditional recipes", "Good bread supplier"],
    status: "active",
    leadTime: "3-5 days",
    minimumOrder: "400 units",
  },
  {
    id: "SUP004",
    name: "Sweet Street Bakers",
    country: "United Kingdom",
    location: "Bristol",
    currentSupplier: true,
    subCategoriesSupplied: ["Everyday Cakes", "Donuts", "Brownies"],
    canSupply: ["Everyday Cakes", "Multipack Cakes", "Tarts", "Cookies", "Brownies", "Donuts", "Seasonal Bakery"],
    otherRetailers: ["Sainsbury's", "Co-op"],
    financialHealth: {
      revenue: 52.3,
      rating: "Strong",
      trend: "up",
    },
    accreditation: {
      brcGrade: "A",
      certifications: ["BRC Grade A", "Fairtrade"],
      lastAuditDate: "2024-07-10",
      auditScore: 93,
    },
    otifPerformance: 96.8,
    reliabilityScore: 94,
    contactEmail: "wholesale@sweetstreet.co.uk",
    contactName: "Tom Richards",
    notes: ["Wide product range", "Strong in indulgent treats"],
    status: "active",
    leadTime: "4-6 days",
    minimumOrder: "350 units",
  },
  {
    id: "SUP005",
    name: "Daily Dough Ltd",
    country: "United Kingdom",
    location: "London",
    currentSupplier: true,
    subCategoriesSupplied: ["Pastries", "Donuts", "Breads"],
    canSupply: ["Everyday Cakes", "Multipack Cakes", "Pastries", "Cookies", "Donuts", "Breads"],
    otherRetailers: ["Tesco", "Lidl"],
    financialHealth: {
      revenue: 68.0,
      rating: "Strong",
      trend: "stable",
    },
    accreditation: {
      brcGrade: "A",
      certifications: ["BRC Grade A", "RSPO"],
      lastAuditDate: "2024-06-15",
      auditScore: 92,
    },
    otifPerformance: 95.5,
    reliabilityScore: 93,
    contactEmail: "trade@dailydough.co.uk",
    contactName: "Hans Mueller",
    notes: ["High volume capability", "Good on daily fresh products"],
    status: "active",
    leadTime: "2-4 days",
    minimumOrder: "1000 units",
  },
  {
    id: "SUP006",
    name: "Harvest Bakehouse",
    country: "United Kingdom",
    location: "Edinburgh",
    currentSupplier: false,
    subCategoriesSupplied: [],
    canSupply: ["Multipack Cakes", "Tarts", "Pastries", "Cookies", "Breads"],
    otherRetailers: ["Waitrose"],
    financialHealth: {
      revenue: 22.5,
      rating: "Good",
      trend: "up",
    },
    accreditation: {
      brcGrade: "A",
      certifications: ["BRC Grade A", "Scottish Quality"],
      lastAuditDate: "2024-08-05",
      auditScore: 89,
    },
    otifPerformance: null,
    reliabilityScore: 86,
    contactEmail: "sales@harvestbakehouse.co.uk",
    contactName: "Emma Watson",
    notes: ["Growing rapidly", "Strong Scottish heritage"],
    status: "potential",
    leadTime: "5-7 days",
    minimumOrder: "250 units",
  },
  {
    id: "SUP007",
    name: "Classic Crumb Co",
    country: "United Kingdom",
    location: "Nottingham",
    currentSupplier: true,
    subCategoriesSupplied: ["Cookies", "Brownies"],
    canSupply: ["Celebration Cakes", "Everyday Cakes", "Cookies", "Brownies", "Donuts", "Breads"],
    otherRetailers: ["Tesco", "Asda", "M&S"],
    financialHealth: {
      revenue: 41.2,
      rating: "Good",
      trend: "stable",
    },
    accreditation: {
      brcGrade: "A",
      certifications: ["BRC Grade A"],
      lastAuditDate: "2024-09-20",
      auditScore: 90,
    },
    otifPerformance: 95.2,
    reliabilityScore: 91,
    contactEmail: "commercial@classiccrumb.co.uk",
    contactName: "Angus MacLeod",
    notes: ["Reliable service", "Good value pricing"],
    status: "active",
    leadTime: "4-6 days",
    minimumOrder: "300 units",
  },
  {
    id: "SUP008",
    name: "Seasonal Delights Bakery",
    country: "United Kingdom",
    location: "Cardiff",
    currentSupplier: false,
    subCategoriesSupplied: [],
    canSupply: ["Celebration Cakes", "Seasonal Bakery"],
    otherRetailers: ["Ocado"],
    financialHealth: {
      revenue: 15.8,
      rating: "Fair",
      trend: "up",
    },
    accreditation: {
      brcGrade: "B",
      certifications: ["BRC Grade B", "Welsh Quality Mark"],
      lastAuditDate: "2024-05-22",
      auditScore: 84,
    },
    otifPerformance: null,
    reliabilityScore: 80,
    contactEmail: "info@seasonaldelights.co.uk",
    contactName: "Pierre Laurent",
    notes: ["Specialist in seasonal ranges", "Working towards BRC A"],
    status: "potential",
    leadTime: "7-10 days",
    minimumOrder: "200 units",
  },
]

// Helper function to calculate strength of inclusion score
export function calculateInclusionScore(
  supplier: Supplier,
  searchCategory: string,
): {
  score: number
  breakdown: {
    currentSupplier: number
    canSupplyProducts: number
    ukBased: number
    reliability: number
    accreditation: number
  }
  factors: string[]
} {
  const breakdown = {
    currentSupplier: supplier.currentSupplier ? 20 : 0,
    canSupplyProducts: (supplier.canSupply || []).some((p) => p.toLowerCase().includes(searchCategory.toLowerCase()))
      ? 25
      : 0,
    ukBased: supplier.country === "United Kingdom" ? 20 : 5,
    reliability: Math.round(((supplier.reliabilityScore || 80) / 100) * 20),
    accreditation:
      supplier.accreditation?.brcGrade === "AA"
        ? 15
        : supplier.accreditation?.brcGrade === "A"
          ? 12
          : supplier.accreditation?.brcGrade === "B"
            ? 8
            : 0,
  }

  const factors: string[] = []
  if (breakdown.currentSupplier > 0) factors.push("Current supplier")
  if (breakdown.canSupplyProducts > 0) factors.push("Can supply products")
  if (breakdown.ukBased >= 20) factors.push("UK based")
  if (breakdown.reliability >= 15) factors.push("High reliability")
  if (breakdown.accreditation >= 12) factors.push("Strong accreditation")

  return {
    score: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
    factors,
  }
}

// ============================================
// SUB-CATEGORIES - Updated to standard 8 categories
// ============================================
export interface SubCategory {
  id: string
  name: string
  category: string
}

export const subCategories: SubCategory[] = [
  { id: "SC001", name: "Celebration Cakes", category: "Bakery" },
  { id: "SC002", name: "Everyday Cakes", category: "Bakery" },
  { id: "SC003", name: "Multipack Cakes", category: "Bakery" },
  { id: "SC004", name: "Tarts", category: "Bakery" },
  { id: "SC005", name: "Pastries", category: "Bakery" },
  { id: "SC006", name: "Cookies", category: "Bakery" },
  { id: "SC007", name: "Brownies", category: "Bakery" },
  { id: "SC008", name: "Donuts", category: "Bakery" },
  { id: "SC009", name: "Breads", category: "Bakery" },
  { id: "SC010", name: "Seasonal Bakery", category: "Bakery" },
]

// ============================================
// DATASET 2: SKUS
// ============================================
export interface SKU {
  id: string
  name: string
  category: string
  subcategory: string
  packSize: string
  shelfLife: string
  storageTemp: string
  weeklyVolume: number
  currentSupplier: string
  currentCostPrice: number
  retailPrice: number
  specs: {
    weight: string
    ingredients: string[]
    allergens: string[]
    nutritionPer100g: {
      calories: number
      fat: number
      sugar: number
      protein: number
    }
  }
  contractTerms?: {
    supplierId: string
    supplierName: string
    contractStartDate: string
    contractEndDate: string
    contractDurationYears: number
    annualVolume: number
    agreedCostPrice: number
    paymentTerms: string
    notes?: string
  }
}

export const skus: SKU[] = [
  {
    id: "SKU001",
    name: "The Best Victoria Sponge",
    category: "Bakery",
    subcategory: "Celebration Cakes", // was "Sponge Cakes"
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Ambient",
    weeklyVolume: 2400,
    currentSupplier: "SUP002",
    currentCostPrice: 1.85,
    retailPrice: 3.5,
    specs: {
      weight: "400g",
      ingredients: ["Wheat Flour", "Sugar", "Eggs", "Butter", "Raspberry Jam", "Vanilla"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 380, fat: 18, sugar: 32, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP002",
      supplierName: "Sunrise Artisan Foods",
      contractStartDate: "2023-01-01",
      contractEndDate: "2025-12-31",
      contractDurationYears: 3,
      annualVolume: 124800,
      agreedCostPrice: 1.85,
      paymentTerms: "Net 30",
      notes: "Premium supplier for sponge cakes",
    },
  },
  {
    id: "SKU002",
    name: "The Best Lemon Drizzle Cake",
    category: "Bakery",
    subcategory: "Everyday Cakes", // was "Sponge Cakes"
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Ambient",
    weeklyVolume: 1800,
    currentSupplier: "SUP002",
    currentCostPrice: 1.92,
    retailPrice: 3.5,
    specs: {
      weight: "380g",
      ingredients: ["Wheat Flour", "Sugar", "Eggs", "Butter", "Lemon Zest", "Lemon Juice"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 365, fat: 16, sugar: 34, protein: 4 },
    },
    contractTerms: {
      supplierId: "SUP002",
      supplierName: "Sunrise Artisan Foods",
      contractStartDate: "2023-01-01",
      contractEndDate: "2025-12-31",
      contractDurationYears: 3,
      annualVolume: 93600,
      agreedCostPrice: 1.92,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU003",
    name: "The Best Chocolate Fudge Cake",
    category: "Bakery",
    subcategory: "Celebration Cakes", // was "Chocolate Cakes"
    packSize: "Single",
    shelfLife: "7 days",
    storageTemp: "Chilled",
    weeklyVolume: 2100,
    currentSupplier: "SUP004",
    currentCostPrice: 2.15,
    retailPrice: 4.0,
    specs: {
      weight: "450g",
      ingredients: ["Wheat Flour", "Cocoa Powder", "Sugar", "Eggs", "Butter", "Dark Chocolate"],
      allergens: ["Gluten", "Eggs", "Milk", "Soya"],
      nutritionPer100g: { calories: 420, fat: 22, sugar: 38, protein: 6 },
    },
    contractTerms: {
      supplierId: "SUP004",
      supplierName: "Sweet Street Bakers",
      contractStartDate: "2022-06-01",
      contractEndDate: "2026-03-31",
      contractDurationYears: 4,
      annualVolume: 109200,
      agreedCostPrice: 2.15,
      paymentTerms: "Net 45",
      notes: "Bulk chocolate cake supplier",
    },
  },
  {
    id: "SKU004",
    name: "The Best Triple Chocolate Gateau",
    category: "Bakery",
    subcategory: "Celebration Cakes", // was "Chocolate Cakes"
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Chilled",
    weeklyVolume: 1200,
    currentSupplier: "SUP004",
    currentCostPrice: 2.85,
    retailPrice: 5.5,
    specs: {
      weight: "500g",
      ingredients: ["Wheat Flour", "Cocoa", "Sugar", "Cream", "Dark Chocolate", "Milk Chocolate", "White Chocolate"],
      allergens: ["Gluten", "Eggs", "Milk", "Soya"],
      nutritionPer100g: { calories: 445, fat: 26, sugar: 42, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP004",
      supplierName: "Sweet Street Bakers",
      contractStartDate: "2022-06-01",
      contractEndDate: "2026-03-31",
      contractDurationYears: 4,
      annualVolume: 62400,
      agreedCostPrice: 2.85,
      paymentTerms: "Net 45",
    },
  },
  {
    id: "SKU005",
    name: "PL Pain au Chocolat 4pk",
    category: "Bakery",
    subcategory: "Pastries", // Already correct
    packSize: "4 pack",
    shelfLife: "3 days",
    storageTemp: "Ambient",
    weeklyVolume: 3200,
    currentSupplier: "SUP001",
    currentCostPrice: 0.95,
    retailPrice: 1.85,
    specs: {
      weight: "280g",
      ingredients: ["Wheat Flour", "Butter", "Dark Chocolate", "Sugar", "Yeast", "Milk"],
      allergens: ["Gluten", "Milk", "Soya"],
      nutritionPer100g: { calories: 410, fat: 24, sugar: 18, protein: 7 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 166400,
      agreedCostPrice: 0.95,
      paymentTerms: "Net 30",
      notes: "Main pastry supplier",
    },
  },
  {
    id: "SKU006",
    name: "PL Croissant 6pk",
    category: "Bakery",
    subcategory: "Pastries", // Already correct
    packSize: "6 pack",
    shelfLife: "3 days",
    storageTemp: "Ambient",
    weeklyVolume: 4500,
    currentSupplier: "SUP001",
    currentCostPrice: 1.1,
    retailPrice: 2.0,
    specs: {
      weight: "360g",
      ingredients: ["Wheat Flour", "Butter", "Sugar", "Yeast", "Milk", "Eggs"],
      allergens: ["Gluten", "Milk", "Eggs"],
      nutritionPer100g: { calories: 395, fat: 21, sugar: 8, protein: 8 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 234000,
      agreedCostPrice: 1.1,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU007",
    name: "The Best Carrot Cake",
    category: "Bakery",
    subcategory: "Everyday Cakes", // was "Specialty Cakes"
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Chilled",
    weeklyVolume: 1600,
    currentSupplier: "SUP003",
    currentCostPrice: 2.25,
    retailPrice: 4.25,
    specs: {
      weight: "420g",
      ingredients: ["Wheat Flour", "Carrots", "Sugar", "Eggs", "Walnuts", "Cream Cheese Frosting", "Cinnamon"],
      allergens: ["Gluten", "Eggs", "Milk", "Nuts"],
      nutritionPer100g: { calories: 350, fat: 16, sugar: 28, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP003",
      supplierName: "Heritage Oven Co",
      contractStartDate: "2024-01-01",
      contractEndDate: "2026-12-31",
      contractDurationYears: 3,
      annualVolume: 83200,
      agreedCostPrice: 2.25,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU008",
    name: "The Best Coffee & Walnut Cake",
    category: "Bakery",
    subcategory: "Everyday Cakes", // was "Specialty Cakes"
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Chilled",
    weeklyVolume: 1100,
    currentSupplier: "SUP003",
    currentCostPrice: 2.35,
    retailPrice: 4.5,
    specs: {
      weight: "400g",
      ingredients: ["Wheat Flour", "Sugar", "Eggs", "Butter", "Walnuts", "Coffee Extract", "Buttercream"],
      allergens: ["Gluten", "Eggs", "Milk", "Nuts"],
      nutritionPer100g: { calories: 390, fat: 20, sugar: 30, protein: 6 },
    },
    contractTerms: {
      supplierId: "SUP003",
      supplierName: "Heritage Oven Co",
      contractStartDate: "2024-01-01",
      contractEndDate: "2026-12-31",
      contractDurationYears: 3,
      annualVolume: 57200,
      agreedCostPrice: 2.35,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU009",
    name: "PL Bakewell Tart",
    category: "Bakery",
    subcategory: "Tarts", // was "Traditional Cakes"
    packSize: "Single",
    shelfLife: "7 days",
    storageTemp: "Ambient",
    weeklyVolume: 2000,
    currentSupplier: "SUP006",
    currentCostPrice: 1.45,
    retailPrice: 2.75,
    specs: {
      weight: "300g",
      ingredients: ["Wheat Flour", "Butter", "Sugar", "Almonds", "Raspberry Jam", "Eggs"],
      allergens: ["Gluten", "Eggs", "Milk", "Nuts"],
      nutritionPer100g: { calories: 410, fat: 20, sugar: 35, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP006",
      supplierName: "Harvest Bakehouse",
      contractStartDate: "2023-06-01",
      contractEndDate: "2026-05-31",
      contractDurationYears: 3,
      annualVolume: 104000,
      agreedCostPrice: 1.45,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU010",
    name: "PL Almond Croissant",
    category: "Bakery",
    subcategory: "Pastries", // Already correct
    packSize: "Single",
    shelfLife: "2 days",
    storageTemp: "Ambient",
    weeklyVolume: 2800,
    currentSupplier: "SUP001",
    currentCostPrice: 0.65,
    retailPrice: 1.3,
    specs: {
      weight: "90g",
      ingredients: ["Wheat Flour", "Butter", "Almonds", "Sugar", "Almond Paste", "Yeast"],
      allergens: ["Gluten", "Milk", "Nuts"],
      nutritionPer100g: { calories: 420, fat: 25, sugar: 20, protein: 9 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 145600,
      agreedCostPrice: 0.65,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU011",
    name: "PL Fruit Scones 4pk",
    category: "Bakery",
    subcategory: "Breads", // was "Traditional Cakes"
    packSize: "4 pack",
    shelfLife: "3 days",
    storageTemp: "Ambient",
    weeklyVolume: 3500,
    currentSupplier: "SUP005",
    currentCostPrice: 0.85,
    retailPrice: 1.6,
    specs: {
      weight: "320g",
      ingredients: ["Wheat Flour", "Butter", "Sugar", "Sultanas", "Milk", "Baking Powder"],
      allergens: ["Gluten", "Milk"],
      nutritionPer100g: { calories: 320, fat: 12, sugar: 18, protein: 6 },
    },
    contractTerms: {
      supplierId: "SUP005",
      supplierName: "Daily Dough Ltd",
      contractStartDate: "2023-09-01",
      contractEndDate: "2026-08-31",
      contractDurationYears: 3,
      annualVolume: 182000,
      agreedCostPrice: 0.85,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU012",
    name: "PL Danish Pastry Selection",
    category: "Bakery",
    subcategory: "Pastries", // Already correct
    packSize: "4 pack",
    shelfLife: "3 days",
    storageTemp: "Ambient",
    weeklyVolume: 2200,
    currentSupplier: "SUP001",
    currentCostPrice: 1.25,
    retailPrice: 2.5,
    specs: {
      weight: "340g",
      ingredients: ["Wheat Flour", "Butter", "Custard", "Fruit Compote", "Sugar", "Yeast"],
      allergens: ["Gluten", "Milk", "Eggs"],
      nutritionPer100g: { calories: 380, fat: 18, sugar: 22, protein: 6 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 114400,
      agreedCostPrice: 1.25,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU013",
    name: "PL Battenberg Cake",
    category: "Bakery",
    subcategory: "Everyday Cakes",
    packSize: "Single",
    shelfLife: "7 days",
    storageTemp: "Ambient",
    weeklyVolume: 1400,
    currentSupplier: "SUP001",
    currentCostPrice: 1.65,
    retailPrice: 3.0,
    specs: {
      weight: "350g",
      ingredients: ["Wheat Flour", "Sugar", "Butter", "Almond Paste", "Eggs", "Raspberry Jam", "Apricot Jam"],
      allergens: ["Gluten", "Eggs", "Milk", "Nuts"],
      nutritionPer100g: { calories: 370, fat: 15, sugar: 30, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 72800,
      agreedCostPrice: 1.65,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU014",
    name: "PL Madeira Loaf Cake",
    category: "Bakery",
    subcategory: "Everyday Cakes",
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Ambient",
    weeklyVolume: 1900,
    currentSupplier: "SUP001",
    currentCostPrice: 1.42,
    retailPrice: 2.5,
    specs: {
      weight: "380g",
      ingredients: ["Wheat Flour", "Sugar", "Butter", "Eggs", "Lemon Zest", "Milk"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 345, fat: 14, sugar: 26, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 98800,
      agreedCostPrice: 1.42,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU015",
    name: "PL Lemon Loaf Cake",
    category: "Bakery",
    subcategory: "Everyday Cakes",
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Ambient",
    weeklyVolume: 1600,
    currentSupplier: "SUP001",
    currentCostPrice: 1.38,
    retailPrice: 2.5,
    specs: {
      weight: "360g",
      ingredients: ["Wheat Flour", "Sugar", "Butter", "Eggs", "Lemon Juice", "Lemon Zest", "Icing Sugar"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 355, fat: 14, sugar: 28, protein: 4 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2023-02-01",
      contractEndDate: "2026-01-31",
      contractDurationYears: 3,
      annualVolume: 83200,
      agreedCostPrice: 1.38,
      paymentTerms: "Net 30",
    },
  },
  // Seasonal SKUs for TND005
  {
    id: "SKU091",
    name: "The Best Christmas Fruit Cake",
    category: "Bakery",
    subcategory: "Seasonal Bakery",
    packSize: "Single",
    shelfLife: "28 days",
    storageTemp: "Ambient",
    weeklyVolume: 800,
    currentSupplier: "SUP001",
    currentCostPrice: 3.64,
    retailPrice: 7.0,
    specs: {
      weight: "750g",
      ingredients: ["Sultanas", "Currants", "Raisins", "Wheat Flour", "Butter", "Brown Sugar", "Eggs", "Brandy", "Mixed Spice"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 340, fat: 12, sugar: 38, protein: 4 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2024-01-01",
      contractEndDate: "2026-12-31",
      contractDurationYears: 3,
      annualVolume: 41600,
      agreedCostPrice: 3.64,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU092",
    name: "PL Hot Cross Buns 6pk",
    category: "Bakery",
    subcategory: "Seasonal Bakery",
    packSize: "6 pack",
    shelfLife: "4 days",
    storageTemp: "Ambient",
    weeklyVolume: 5200,
    currentSupplier: "SUP001",
    currentCostPrice: 1.94,
    retailPrice: 1.75,
    specs: {
      weight: "450g",
      ingredients: ["Wheat Flour", "Sultanas", "Mixed Peel", "Sugar", "Butter", "Yeast", "Mixed Spice", "Cinnamon"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 290, fat: 6, sugar: 18, protein: 8 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2024-01-01",
      contractEndDate: "2026-12-31",
      contractDurationYears: 3,
      annualVolume: 270400,
      agreedCostPrice: 1.94,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU093",
    name: "The Best Mince Pies 6pk",
    category: "Bakery",
    subcategory: "Seasonal Bakery",
    packSize: "6 pack",
    shelfLife: "14 days",
    storageTemp: "Ambient",
    weeklyVolume: 3800,
    currentSupplier: "SUP001",
    currentCostPrice: 2.23,
    retailPrice: 4.0,
    specs: {
      weight: "360g",
      ingredients: ["Wheat Flour", "Butter", "Mincemeat", "Sugar", "Currants", "Sultanas", "Mixed Spice"],
      allergens: ["Gluten", "Eggs", "Milk"],
      nutritionPer100g: { calories: 380, fat: 16, sugar: 32, protein: 4 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2024-01-01",
      contractEndDate: "2026-12-31",
      contractDurationYears: 3,
      annualVolume: 197600,
      agreedCostPrice: 2.23,
      paymentTerms: "Net 30",
    },
  },
  {
    id: "SKU097",
    name: "The Best Christmas Yule Log",
    category: "Bakery",
    subcategory: "Seasonal Bakery",
    packSize: "Single",
    shelfLife: "5 days",
    storageTemp: "Chilled",
    weeklyVolume: 1200,
    currentSupplier: "SUP001",
    currentCostPrice: 3.14,
    retailPrice: 6.0,
    specs: {
      weight: "500g",
      ingredients: ["Wheat Flour", "Dark Chocolate", "Cream", "Sugar", "Eggs", "Butter", "Cocoa Powder"],
      allergens: ["Gluten", "Eggs", "Milk", "Soya"],
      nutritionPer100g: { calories: 420, fat: 24, sugar: 36, protein: 5 },
    },
    contractTerms: {
      supplierId: "SUP001",
      supplierName: "Golden Crust Bakeries",
      contractStartDate: "2024-01-01",
      contractEndDate: "2026-12-31",
      contractDurationYears: 3,
      annualVolume: 62400,
      agreedCostPrice: 3.14,
      paymentTerms: "Net 30",
    },
  },
]

// ============================================
// DATASET 3: CATEGORY PERFORMANCE
// ============================================
export interface CategoryPerformance {
  skuId: string
  period: string
  salesUnits: number
  salesValue: number
  costOfGoods: number
  grossMargin: number
  marginPercent: number
  wasteUnits: number
  wastePercent: number
  availability: number
  yoyGrowth: number
}

export const categoryPerformance: CategoryPerformance[] = [
  {
    skuId: "SKU001",
    period: "Last 4 Weeks",
    salesUnits: 9600,
    salesValue: 33600,
    costOfGoods: 17760,
    grossMargin: 15840,
    marginPercent: 47.1,
    wasteUnits: 180,
    wastePercent: 1.8,
    availability: 98.2,
    yoyGrowth: 3.2,
  },
  {
    skuId: "SKU002",
    period: "Last 4 Weeks",
    salesUnits: 7200,
    salesValue: 25200,
    costOfGoods: 13824,
    grossMargin: 11376,
    marginPercent: 45.1,
    wasteUnits: 150,
    wastePercent: 2.0,
    availability: 97.5,
    yoyGrowth: -1.5,
  },
  {
    skuId: "SKU003",
    period: "Last 4 Weeks",
    salesUnits: 12800,
    salesValue: 51200,
    costOfGoods: 26880,
    grossMargin: 24320,
    marginPercent: 47.5,
    wasteUnits: 210,
    wastePercent: 1.6,
    availability: 99.1,
    yoyGrowth: 8.4,
  },
  {
    skuId: "SKU004",
    period: "Last 4 Weeks",
    salesUnits: 6000,
    salesValue: 25500,
    costOfGoods: 13500,
    grossMargin: 12000,
    marginPercent: 47.1,
    wasteUnits: 95,
    wastePercent: 1.5,
    availability: 96.8,
    yoyGrowth: 5.2,
  },
  {
    skuId: "SKU005",
    period: "Last 4 Weeks",
    salesUnits: 22000,
    salesValue: 40700,
    costOfGoods: 20900,
    grossMargin: 19800,
    marginPercent: 48.6,
    wasteUnits: 320,
    wastePercent: 1.4,
    availability: 98.8,
    yoyGrowth: 12.1,
  },
  {
    skuId: "SKU006",
    period: "Last 4 Weeks",
    salesUnits: 24800,
    salesValue: 43400,
    costOfGoods: 21824,
    grossMargin: 21576,
    marginPercent: 49.7,
    wasteUnits: 290,
    wastePercent: 1.2,
    availability: 99.2,
    yoyGrowth: 6.8,
  },
  {
    skuId: "SKU007",
    period: "Last 4 Weeks",
    salesUnits: 19200,
    salesValue: 24000,
    costOfGoods: 13824,
    grossMargin: 10176,
    marginPercent: 42.4,
    wasteUnits: 480,
    wastePercent: 2.4,
    availability: 95.5,
    yoyGrowth: -2.3,
  },
  {
    skuId: "SKU008",
    period: "Last 4 Weeks",
    salesUnits: 8400,
    salesValue: 23100,
    costOfGoods: 12180,
    grossMargin: 10920,
    marginPercent: 47.3,
    wasteUnits: 160,
    wastePercent: 1.9,
    availability: 97.2,
    yoyGrowth: 1.8,
  },
  {
    skuId: "SKU009",
    period: "Last 4 Weeks",
    salesUnits: 7600,
    salesValue: 22420,
    costOfGoods: 11780,
    grossMargin: 10640,
    marginPercent: 47.5,
    wasteUnits: 110,
    wastePercent: 1.4,
    availability: 98.5,
    yoyGrowth: 4.1,
  },
  {
    skuId: "SKU010",
    period: "Last 4 Weeks",
    salesUnits: 13600,
    salesValue: 18360,
    costOfGoods: 10200,
    grossMargin: 8160,
    marginPercent: 44.4,
    wasteUnits: 200,
    wastePercent: 1.5,
    availability: 98.0,
    yoyGrowth: 2.5,
  },
  {
    skuId: "SKU011",
    period: "Last 4 Weeks",
    salesUnits: 11200,
    salesValue: 20160,
    costOfGoods: 10976,
    grossMargin: 9184,
    marginPercent: 45.6,
    wasteUnits: 175,
    wastePercent: 1.5,
    availability: 97.8,
    yoyGrowth: -0.8,
  },
  {
    skuId: "SKU012",
    period: "Last 4 Weeks",
    salesUnits: 8800,
    salesValue: 19800,
    costOfGoods: 10120,
    grossMargin: 9680,
    marginPercent: 48.9,
    wasteUnits: 45,
    wastePercent: 0.5,
    availability: 99.5,
    yoyGrowth: 3.9,
  },
]

// ============================================
// DATASET 4: TENDERS
// ============================================
export type TenderStatus = "draft" | "open" | "evaluating" | "pending_sign_off" | "completed" | "cancelled"
export type TenderType = "price_discovery" | "full_tender"

export interface ApprovalStage {
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvedDate?: string
  notes?: string
}

export interface ContractApproval {
  commercial: ApprovalStage
  finance: ApprovalStage
  kitchen: ApprovalStage
  contractUploaded: boolean
  contractUploadDate?: string
  contractFileName?: string
}

export interface Tender {
  id: string
  name: string
  description: string
  skuIds: string[]
  supplierIds: string[]
  status: TenderStatus
  type: TenderType
  linkedPriceDiscoveryId?: string // For full tenders that originated from a price discovery
  createdDate: string
  closeDate: string
  estimatedValue: number
  actualSavings?: number
  responses: number
  leadBuyer: string
  approval?: ContractApproval
  winningSupplierIds?: string[]
  timeline?: {
    firstSubmissionDeadline?: string
    commercialFeedbackDate?: string
    samplesRequiredBy?: string
    productPanelDate?: string
    expectedAwardDate?: string
    estimatedFirstDeliveryDate?: string
    supplyAgreementMonths?: number
  }
}

export const tenders: Tender[] = [
  {
    id: "TND001",
    name: "Q1 Sponge Cakes Tender",
    description: "Annual tender for Victoria Sponge and Lemon Drizzle supply",
    skuIds: ["SKU001", "SKU002"],
    supplierIds: ["SUP001", "SUP002", "SUP008"],
    status: "completed",
    type: "full_tender",
    createdDate: "2024-01-15",
    closeDate: "2024-02-15",
    estimatedValue: 245000,
    actualSavings: 8200,
    responses: 3,
    leadBuyer: "Sarah Mitchell",
    winningSupplierIds: ["SUP001"],
    approval: {
      commercial: {
        status: "approved",
        approvedBy: "David Thompson",
        approvedDate: "2024-02-18",
        notes: "Good value deal",
      },
      finance: { status: "approved", approvedBy: "Emma Richards", approvedDate: "2024-02-20" },
      kitchen: { status: "approved", approvedBy: "John Smith", approvedDate: "2024-02-19" },
      contractUploaded: true,
      contractUploadDate: "2024-02-22",
      contractFileName: "TND001_SongeCakes_Contract_Signed.pdf",
    },
  },
  {
    id: "TND002",
    name: "Morning Goods Pastries 2024",
    description: "Tender for Croissants and Pain au Chocolat",
    skuIds: ["SKU005", "SKU006"],
    supplierIds: ["SUP003", "SUP007", "SUP010"],
    status: "completed",
    type: "full_tender",
    createdDate: "2024-03-01",
    closeDate: "2024-04-01",
    estimatedValue: 380000,
    actualSavings: 12400,
    responses: 3,
    leadBuyer: "Sarah Mitchell",
    winningSupplierIds: ["SUP003"],
    approval: {
      commercial: { status: "approved", approvedBy: "David Thompson", approvedDate: "2024-04-05" },
      finance: { status: "approved", approvedBy: "Emma Richards", approvedDate: "2024-04-08" },
      kitchen: { status: "approved", approvedBy: "John Smith", approvedDate: "2024-04-06" },
      contractUploaded: true,
      contractUploadDate: "2024-04-10",
      contractFileName: "TND002_MorningGoods_Contract_Signed.pdf",
    },
  },
  {
    id: "TND003",
    name: "Everyday Cakes National Supply 2026",
    description: "National supply tender for everyday cake range including sponges and loaf cakes",
    skuIds: ["SKU011", "SKU012", "SKU013", "SKU014", "SKU015"],
    supplierIds: ["SUP001", "SUP002", "SUP004", "SUP005", "SUP007"],
    status: "open",
    type: "full_tender",
    createdDate: "2025-01-05",
    closeDate: "2025-02-15",
    estimatedValue: 485000,
    responses: 3,
    leadBuyer: "Sarah Mitchell",
    timeline: {
      firstSubmissionDeadline: "2025-02-15",
      commercialFeedbackDate: "2025-02-28",
      samplesRequiredBy: "2025-03-10",
      productPanelDate: "2025-03-18",
      expectedAwardDate: "2025-04-01",
      estimatedFirstDeliveryDate: "2025-05-12",
      supplyAgreementMonths: 24,
    },
  },
  {
    id: "TND004",
    name: "Pastries Promotional Tender Q3",
    description: "Q3 promotional tender for pastry range including croissants and pain au chocolat",
    skuIds: ["SKU005", "SKU006", "SKU010", "SKU012"],
    supplierIds: ["SUP002", "SUP003", "SUP005", "SUP006"],
    status: "open",
    type: "full_tender",
    createdDate: "2025-01-08",
    closeDate: "2025-02-20",
    estimatedValue: 520000,
    responses: 3,
    leadBuyer: "James Cooper",
    timeline: {
      firstSubmissionDeadline: "2025-02-20",
      commercialFeedbackDate: "2025-03-05",
      samplesRequiredBy: "2025-03-17",
      productPanelDate: "2025-03-25",
      expectedAwardDate: "2025-04-10",
      estimatedFirstDeliveryDate: "2025-05-26",
      supplyAgreementMonths: 18,
    },
  },
  {
    id: "TND005",
    name: "Seasonal Bakery Range Tender 2026",
    description: "Annual tender for seasonal bakery items including Christmas and Easter ranges",
    skuIds: ["SKU091", "SKU092", "SKU093", "SKU097"],
    supplierIds: ["SUP001", "SUP002", "SUP004", "SUP008"],
    status: "open",
    type: "full_tender",
    createdDate: "2025-01-10",
    closeDate: "2025-02-28",
    estimatedValue: 695000,
    responses: 3,
    leadBuyer: "Sarah Mitchell",
    timeline: {
      firstSubmissionDeadline: "2025-02-28",
      commercialFeedbackDate: "2025-03-14",
      samplesRequiredBy: "2025-03-28",
      productPanelDate: "2025-04-07",
      expectedAwardDate: "2025-04-21",
      estimatedFirstDeliveryDate: "2025-06-02",
      supplyAgreementMonths: 36,
    },
  },
  {
    id: "TND006",
    name: "Cookies Range Consolidation",
    description: "Consolidating supply for chocolate chip and oat cookie ranges",
    skuIds: ["SKU051", "SKU052"],
    supplierIds: ["SUP001", "SUP004", "SUP005"],
    status: "pending_sign_off",
    type: "full_tender",
    createdDate: "2024-11-20",
    closeDate: "2024-12-20",
    estimatedValue: 185000,
    actualSavings: 6200,
    responses: 3,
    leadBuyer: "James Cooper",
    winningSupplierIds: ["SUP001"],
    approval: {
      commercial: { status: "approved", approvedBy: "David Thompson", approvedDate: "2024-12-22" },
      finance: { status: "pending" },
      kitchen: { status: "approved", approvedBy: "Sarah Mitchell", approvedDate: "2024-12-23" },
      contractUploaded: false,
    },
  },
  {
    id: "TND007",
    name: "Brownies Annual Review",
    description: "Annual supply review for brownie range",
    skuIds: ["SKU061", "SKU062"],
    supplierIds: ["SUP001", "SUP003", "SUP004"],
    status: "pending_sign_off",
    type: "full_tender",
    createdDate: "2024-12-01",
    closeDate: "2025-01-05",
    estimatedValue: 156000,
    actualSavings: 5400,
    responses: 3,
    leadBuyer: "Sarah Mitchell",
    winningSupplierIds: ["SUP003"],
    approval: {
      commercial: { status: "pending" },
      finance: { status: "pending" },
      kitchen: { status: "pending" },
      contractUploaded: false,
    },
  },
  {
    id: "PD001",
    name: "Tarts Price Discovery",
    description: "Price discovery for custard and fruit tart range ahead of contract renewal",
    skuIds: ["SKU031", "SKU032"],
    supplierIds: ["SUP002", "SUP003", "SUP006"],
    status: "completed",
    type: "price_discovery",
    createdDate: "2024-11-01",
    closeDate: "2024-11-15",
    estimatedValue: 225000,
    responses: 3,
    leadBuyer: "Sarah Mitchell",
  },
  {
    id: "PD002",
    name: "Donuts Market Test",
    description: "Price discovery for ring donut and jam donut supply",
    skuIds: ["SKU071", "SKU072"],
    supplierIds: ["SUP004", "SUP005", "SUP007"],
    status: "completed",
    type: "price_discovery",
    createdDate: "2024-11-10",
    closeDate: "2024-11-25",
    estimatedValue: 340000,
    responses: 3,
    leadBuyer: "James Cooper",
  },
]

// ============================================
// DATASET 5: CATEGORY METRICS (Branded vs Own Brand)
// ============================================
export interface CategoryMetrics {
  category: string
  timePeriod: string
  branded: {
    marketShare: number
    marketShareChange: number
    salesVolume: number
    salesVolumeChange: number
    salesValue: number
    salesValueChange: number
    marginPounds: number
    marginPoundsChange: number
    marginPercent: number
    marginPercentChange: number
  }
  ownBrand: {
    marketShare: number
    marketShareChange: number
    salesVolume: number
    salesVolumeChange: number
    salesValue: number
    salesValueChange: number
    marginPounds: number
    marginPoundsChange: number
    marginPercent: number
    marginPercentChange: number
  }
}

export const categoryMetricsData: CategoryMetrics[] = [
  // Cakes - Last 4 Weeks
  {
    category: "Cakes",
    timePeriod: "Last 4 Weeks",
    branded: {
      marketShare: 62.3,
      marketShareChange: -1.2,
      salesVolume: 48500,
      salesVolumeChange: -2.8,
      salesValue: 194000,
      salesValueChange: -1.5,
      marginPounds: 58200,
      marginPoundsChange: -3.2,
      marginPercent: 30.0,
      marginPercentChange: -0.5,
    },
    ownBrand: {
      marketShare: 37.7,
      marketShareChange: 1.2,
      salesVolume: 35600,
      salesVolumeChange: 4.5,
      salesValue: 135700,
      salesValueChange: 5.2,
      marginPounds: 63578,
      marginPoundsChange: 6.1,
      marginPercent: 46.9,
      marginPercentChange: 0.4,
    },
  },
  // Cakes - Last 12 Weeks
  {
    category: "Cakes",
    timePeriod: "Last 12 Weeks",
    branded: {
      marketShare: 63.1,
      marketShareChange: -0.8,
      salesVolume: 142800,
      salesVolumeChange: -1.9,
      salesValue: 571200,
      salesValueChange: -0.6,
      marginPounds: 171360,
      marginPoundsChange: -2.1,
      marginPercent: 30.0,
      marginPercentChange: -0.4,
    },
    ownBrand: {
      marketShare: 36.9,
      marketShareChange: 0.8,
      salesVolume: 104200,
      salesVolumeChange: 3.8,
      salesValue: 397100,
      salesValueChange: 4.5,
      marginPounds: 186240,
      marginPoundsChange: 5.3,
      marginPercent: 46.9,
      marginPercentChange: 0.3,
    },
  },
  // Cakes - Last 52 Weeks
  {
    category: "Cakes",
    timePeriod: "Last 52 Weeks",
    branded: {
      marketShare: 64.5,
      marketShareChange: -2.1,
      salesVolume: 615000,
      salesVolumeChange: -3.2,
      salesValue: 2460000,
      salesValueChange: -2.0,
      marginPounds: 738000,
      marginPoundsChange: -4.5,
      marginPercent: 30.0,
      marginPercentChange: -0.8,
    },
    ownBrand: {
      marketShare: 35.5,
      marketShareChange: 2.1,
      salesVolume: 448500,
      salesVolumeChange: 6.2,
      salesValue: 1710000,
      salesValueChange: 7.8,
      marginPounds: 802000,
      marginPoundsChange: 9.1,
      marginPercent: 46.9,
      marginPercentChange: 0.6,
    },
  },
  // Cakes - YTD
  {
    category: "Cakes",
    timePeriod: "YTD",
    branded: {
      marketShare: 63.8,
      marketShareChange: -1.5,
      salesVolume: 520000,
      salesVolumeChange: -2.5,
      salesValue: 2080000,
      salesValueChange: -1.2,
      marginPounds: 624000,
      marginPoundsChange: -3.8,
      marginPercent: 30.0,
      marginPercentChange: -0.6,
    },
    ownBrand: {
      marketShare: 36.2,
      marketShareChange: 1.5,
      salesVolume: 380000,
      salesVolumeChange: 5.1,
      salesValue: 1449000,
      salesValueChange: 6.3,
      marginPounds: 679800,
      marginPoundsChange: 7.5,
      marginPercent: 46.9,
      marginPercentChange: 0.5,
    },
  },
]

export function getCategoryMetrics(category: string, timePeriod: string): CategoryMetrics | undefined {
  return categoryMetricsData.find((m) => m.category === category && m.timePeriod === timePeriod)
}

// ============================================
// DATASET 5: OFFERS
// ============================================
export interface Offer {
  id: string
  tenderId: string
  supplierId: string
  skuId: string
  round: number
  submittedDate: string
  // Offer details
  costPrice: number
  costPriceSaving: number // vs current cost price (percentage)
  additionalFunding: number // annual supplier funding in GBP
  promotionChange: "increased" | "same" | "decreased"
  promotionWeeks: number // number of promo weeks per year
  deliveryTerms: "delivered" | "ex-works" | "collect"
  deliveryFrequency: string
  paymentDays: number
  specSame: boolean
  specNotes?: string
  // Calculated scores
  supplierAttractivenessScore: number // 0-100
  overallScore: number // 0-100
}

// Demo offers for open tenders
export const offers: Offer[] = [
  // ===================================================================
  // TND003 - Everyday Cakes National Supply 2026
  // SKUs: SKU011 (Fruit Scones 4pk, curr: £0.85), SKU012 (Danish Pastry, curr: £1.25),
  //        SKU013 (Battenberg, curr: £1.65), SKU014 (Madeira Loaf, curr: £1.42), SKU015 (Lemon Loaf, curr: £1.38)
  // Suppliers: SUP001 (Golden Crust - current), SUP002 (Sunrise Artisan), SUP004 (Sweet Street), SUP005 (Daily Dough), SUP007 (Classic Crumb)
  // ===================================================================

  // --- SUP002 Sunrise Artisan Foods - Round 1 ---
  { id: "OFF101", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU011", round: 1, submittedDate: "2025-01-12", costPrice: 0.82, costPriceSaving: 3.5, additionalFunding: 4200, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 86 },
  { id: "OFF102", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU012", round: 1, submittedDate: "2025-01-12", costPrice: 1.18, costPriceSaving: 5.6, additionalFunding: 5500, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 88 },
  { id: "OFF103", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU013", round: 1, submittedDate: "2025-01-12", costPrice: 1.55, costPriceSaving: 6.1, additionalFunding: 3800, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 85 },
  { id: "OFF104", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU014", round: 1, submittedDate: "2025-01-12", costPrice: 1.34, costPriceSaving: 5.6, additionalFunding: 4000, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 87 },
  { id: "OFF105", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU015", round: 1, submittedDate: "2025-01-12", costPrice: 1.30, costPriceSaving: 5.8, additionalFunding: 3600, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 84 },

  // --- SUP002 Sunrise Artisan Foods - Round 2 (improved) ---
  { id: "OFF106", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU011", round: 2, submittedDate: "2025-01-28", costPrice: 0.79, costPriceSaving: 7.1, additionalFunding: 5000, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "4x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 90 },
  { id: "OFF107", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU012", round: 2, submittedDate: "2025-01-28", costPrice: 1.14, costPriceSaving: 8.8, additionalFunding: 6500, promotionChange: "increased", promotionWeeks: 14, deliveryTerms: "delivered", deliveryFrequency: "4x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 92 },
  { id: "OFF108", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU013", round: 2, submittedDate: "2025-01-28", costPrice: 1.50, costPriceSaving: 9.1, additionalFunding: 4500, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "4x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 89 },
  { id: "OFF109", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU014", round: 2, submittedDate: "2025-01-28", costPrice: 1.30, costPriceSaving: 8.5, additionalFunding: 4800, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "4x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 91 },
  { id: "OFF110", tenderId: "TND003", supplierId: "SUP002", skuId: "SKU015", round: 2, submittedDate: "2025-01-28", costPrice: 1.26, costPriceSaving: 8.7, additionalFunding: 4200, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "4x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 88 },

  // --- SUP004 Sweet Street Bakers - Round 1 ---
  { id: "OFF111", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU011", round: 1, submittedDate: "2025-01-13", costPrice: 0.83, costPriceSaving: 2.4, additionalFunding: 3500, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 85, overallScore: 79 },
  { id: "OFF112", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU012", round: 1, submittedDate: "2025-01-13", costPrice: 1.22, costPriceSaving: 2.4, additionalFunding: 4200, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 85, overallScore: 80 },
  { id: "OFF113", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU013", round: 1, submittedDate: "2025-01-13", costPrice: 1.60, costPriceSaving: 3.0, additionalFunding: 3200, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 85, overallScore: 78 },
  { id: "OFF114", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU014", round: 1, submittedDate: "2025-01-13", costPrice: 1.38, costPriceSaving: 2.8, additionalFunding: 3000, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 85, overallScore: 77 },
  { id: "OFF115", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU015", round: 1, submittedDate: "2025-01-13", costPrice: 1.35, costPriceSaving: 2.2, additionalFunding: 2800, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 85, overallScore: 76 },

  // --- SUP004 Sweet Street Bakers - Round 2 ---
  { id: "OFF116", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU011", round: 2, submittedDate: "2025-01-30", costPrice: 0.80, costPriceSaving: 5.9, additionalFunding: 4500, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 84 },
  { id: "OFF117", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU012", round: 2, submittedDate: "2025-01-30", costPrice: 1.17, costPriceSaving: 6.4, additionalFunding: 5500, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 85 },
  { id: "OFF118", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU013", round: 2, submittedDate: "2025-01-30", costPrice: 1.54, costPriceSaving: 6.7, additionalFunding: 4000, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 83 },
  { id: "OFF119", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU014", round: 2, submittedDate: "2025-01-30", costPrice: 1.33, costPriceSaving: 6.3, additionalFunding: 3800, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 82 },
  { id: "OFF120", tenderId: "TND003", supplierId: "SUP004", skuId: "SKU015", round: 2, submittedDate: "2025-01-30", costPrice: 1.30, costPriceSaving: 5.8, additionalFunding: 3500, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 81 },

  // --- SUP005 Daily Dough Ltd - Round 1 ---
  { id: "OFF121", tenderId: "TND003", supplierId: "SUP005", skuId: "SKU011", round: 1, submittedDate: "2025-01-14", costPrice: 0.84, costPriceSaving: 1.2, additionalFunding: 2800, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 74 },
  { id: "OFF122", tenderId: "TND003", supplierId: "SUP005", skuId: "SKU012", round: 1, submittedDate: "2025-01-14", costPrice: 1.24, costPriceSaving: 0.8, additionalFunding: 3200, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 72 },
  { id: "OFF123", tenderId: "TND003", supplierId: "SUP005", skuId: "SKU013", round: 1, submittedDate: "2025-01-14", costPrice: 1.62, costPriceSaving: 1.8, additionalFunding: 2500, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 71 },
  // SUP005 does NOT offer SKU014 and SKU015 in Round 1 -- partial SKU coverage

  // --- SUP005 Daily Dough Ltd - Round 2 ---
  { id: "OFF126", tenderId: "TND003", supplierId: "SUP005", skuId: "SKU011", round: 2, submittedDate: "2025-02-01", costPrice: 0.81, costPriceSaving: 4.7, additionalFunding: 3800, promotionChange: "increased", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 45, specSame: true, supplierAttractivenessScore: 80, overallScore: 79 },
  { id: "OFF127", tenderId: "TND003", supplierId: "SUP005", skuId: "SKU012", round: 2, submittedDate: "2025-02-01", costPrice: 1.20, costPriceSaving: 4.0, additionalFunding: 4200, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 45, specSame: true, supplierAttractivenessScore: 80, overallScore: 78 },
  { id: "OFF128", tenderId: "TND003", supplierId: "SUP005", skuId: "SKU013", round: 2, submittedDate: "2025-02-01", costPrice: 1.57, costPriceSaving: 4.8, additionalFunding: 3200, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 45, specSame: true, supplierAttractivenessScore: 80, overallScore: 76 },
  // SUP005 does NOT offer SKU014 and SKU015 in Round 2 -- partial SKU coverage

  // --- SUP007 Classic Crumb Co - Round 1 ---
  { id: "OFF131", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU011", round: 1, submittedDate: "2025-01-15", costPrice: 0.81, costPriceSaving: 4.7, additionalFunding: 3000, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 82, overallScore: 80 },
  { id: "OFF132", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU012", round: 1, submittedDate: "2025-01-15", costPrice: 1.19, costPriceSaving: 4.8, additionalFunding: 3800, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 82, overallScore: 81 },
  { id: "OFF133", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU013", round: 1, submittedDate: "2025-01-15", costPrice: 1.58, costPriceSaving: 4.2, additionalFunding: 2800, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 82, overallScore: 78 },
  { id: "OFF134", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU014", round: 1, submittedDate: "2025-01-15", costPrice: 1.36, costPriceSaving: 4.2, additionalFunding: 3000, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 82, overallScore: 79 },
  { id: "OFF135", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU015", round: 1, submittedDate: "2025-01-15", costPrice: 1.32, costPriceSaving: 4.3, additionalFunding: 2600, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 82, overallScore: 77 },

  // --- SUP007 Classic Crumb Co - Round 2 ---
  { id: "OFF136", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU011", round: 2, submittedDate: "2025-01-31", costPrice: 0.78, costPriceSaving: 8.2, additionalFunding: 4000, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 82, overallScore: 85 },
  { id: "OFF137", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU012", round: 2, submittedDate: "2025-01-31", costPrice: 1.15, costPriceSaving: 8.0, additionalFunding: 4800, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 82, overallScore: 86 },
  { id: "OFF138", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU013", round: 2, submittedDate: "2025-01-31", costPrice: 1.52, costPriceSaving: 7.9, additionalFunding: 3600, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 82, overallScore: 83 },
  { id: "OFF139", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU014", round: 2, submittedDate: "2025-01-31", costPrice: 1.32, costPriceSaving: 7.0, additionalFunding: 3800, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 82, overallScore: 84 },
  { id: "OFF140", tenderId: "TND003", supplierId: "SUP007", skuId: "SKU015", round: 2, submittedDate: "2025-01-31", costPrice: 1.28, costPriceSaving: 7.2, additionalFunding: 3200, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 82, overallScore: 82 },

  // ===================================================================
  // TND004 - Pastries Promotional Tender Q3
  // SKUs: SKU005 (Pain au Choc 4pk, curr: £0.95), SKU006 (Croissant 6pk, curr: £1.10),
  //        SKU010 (Almond Croissant, curr: £0.65), SKU012 (Danish Pastry, curr: £1.25)
  // Suppliers: SUP002, SUP003, SUP005, SUP006
  // ===================================================================

  // --- SUP002 Sunrise Artisan Foods - Round 1 ---
  { id: "OFF201", tenderId: "TND004", supplierId: "SUP002", skuId: "SKU005", round: 1, submittedDate: "2025-01-16", costPrice: 0.89, costPriceSaving: 6.3, additionalFunding: 6000, promotionChange: "increased", promotionWeeks: 14, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 88 },
  { id: "OFF202", tenderId: "TND004", supplierId: "SUP002", skuId: "SKU006", round: 1, submittedDate: "2025-01-16", costPrice: 1.02, costPriceSaving: 7.3, additionalFunding: 7200, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 90 },
  { id: "OFF203", tenderId: "TND004", supplierId: "SUP002", skuId: "SKU010", round: 1, submittedDate: "2025-01-16", costPrice: 0.60, costPriceSaving: 7.7, additionalFunding: 4500, promotionChange: "same", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 86 },
  { id: "OFF204", tenderId: "TND004", supplierId: "SUP002", skuId: "SKU012", round: 1, submittedDate: "2025-01-16", costPrice: 1.17, costPriceSaving: 6.4, additionalFunding: 5800, promotionChange: "increased", promotionWeeks: 12, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 92, overallScore: 87 },

  // --- SUP003 Heritage Oven Co - Round 1 ---
  { id: "OFF205", tenderId: "TND004", supplierId: "SUP003", skuId: "SKU005", round: 1, submittedDate: "2025-01-17", costPrice: 0.91, costPriceSaving: 4.2, additionalFunding: 4000, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 78, overallScore: 76 },
  { id: "OFF206", tenderId: "TND004", supplierId: "SUP003", skuId: "SKU006", round: 1, submittedDate: "2025-01-17", costPrice: 1.06, costPriceSaving: 3.6, additionalFunding: 4500, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 78, overallScore: 75 },
  { id: "OFF207", tenderId: "TND004", supplierId: "SUP003", skuId: "SKU010", round: 1, submittedDate: "2025-01-17", costPrice: 0.63, costPriceSaving: 3.1, additionalFunding: 2800, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 78, overallScore: 73 },
  { id: "OFF208", tenderId: "TND004", supplierId: "SUP003", skuId: "SKU012", round: 1, submittedDate: "2025-01-17", costPrice: 1.21, costPriceSaving: 3.2, additionalFunding: 3500, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 78, overallScore: 74 },

  // --- SUP005 Daily Dough Ltd - Round 1 ---
  { id: "OFF209", tenderId: "TND004", supplierId: "SUP005", skuId: "SKU005", round: 1, submittedDate: "2025-01-18", costPrice: 0.92, costPriceSaving: 3.2, additionalFunding: 3200, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 77 },
  { id: "OFF210", tenderId: "TND004", supplierId: "SUP005", skuId: "SKU006", round: 1, submittedDate: "2025-01-18", costPrice: 1.05, costPriceSaving: 4.5, additionalFunding: 3800, promotionChange: "increased", promotionWeeks: 10, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 79 },
  { id: "OFF211", tenderId: "TND004", supplierId: "SUP005", skuId: "SKU010", round: 1, submittedDate: "2025-01-18", costPrice: 0.62, costPriceSaving: 4.6, additionalFunding: 2500, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 76 },
  { id: "OFF212", tenderId: "TND004", supplierId: "SUP005", skuId: "SKU012", round: 1, submittedDate: "2025-01-18", costPrice: 1.20, costPriceSaving: 4.0, additionalFunding: 3200, promotionChange: "same", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "Daily", paymentDays: 30, specSame: true, supplierAttractivenessScore: 80, overallScore: 75 },

  // --- SUP006 Harvest Bakehouse - Round 1 ---
  { id: "OFF213", tenderId: "TND004", supplierId: "SUP006", skuId: "SKU005", round: 1, submittedDate: "2025-01-19", costPrice: 0.93, costPriceSaving: 2.1, additionalFunding: 2500, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 72, overallScore: 70 },
  { id: "OFF214", tenderId: "TND004", supplierId: "SUP006", skuId: "SKU006", round: 1, submittedDate: "2025-01-19", costPrice: 1.08, costPriceSaving: 1.8, additionalFunding: 2800, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: false, supplierAttractivenessScore: 72, overallScore: 68 },
  { id: "OFF215", tenderId: "TND004", supplierId: "SUP006", skuId: "SKU010", round: 1, submittedDate: "2025-01-19", costPrice: 0.64, costPriceSaving: 1.5, additionalFunding: 1800, promotionChange: "decreased", promotionWeeks: 4, deliveryTerms: "ex-works", deliveryFrequency: "Weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 72, overallScore: 65 },
  { id: "OFF216", tenderId: "TND004", supplierId: "SUP006", skuId: "SKU012", round: 1, submittedDate: "2025-01-19", costPrice: 1.23, costPriceSaving: 1.6, additionalFunding: 2200, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 72, overallScore: 67 },

  // ===================================================================
  // TND005 - Seasonal Bakery Range Tender 2026
  // SKUs: SKU091 (Christmas Fruit Cake, curr: £3.64), SKU092 (Hot Cross Buns, curr: £1.94),
  //        SKU093 (Mince Pies, curr: £2.23), SKU097 (Christmas Yule Log, curr: £3.14)
  // Suppliers: SUP001 (current), SUP002, SUP004, SUP008
  // ===================================================================

  // --- SUP002 Sunrise Artisan Foods - Round 1 ---
  { id: "OFF301", tenderId: "TND005", supplierId: "SUP002", skuId: "SKU091", round: 1, submittedDate: "2025-01-19", costPrice: 3.38, costPriceSaving: 7.1, additionalFunding: 22000, promotionChange: "increased", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 89 },
  { id: "OFF302", tenderId: "TND005", supplierId: "SUP002", skuId: "SKU092", round: 1, submittedDate: "2025-01-19", costPrice: 1.78, costPriceSaving: 8.2, additionalFunding: 16000, promotionChange: "increased", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "4x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 91 },
  { id: "OFF303", tenderId: "TND005", supplierId: "SUP002", skuId: "SKU093", round: 1, submittedDate: "2025-01-19", costPrice: 2.08, costPriceSaving: 6.7, additionalFunding: 18000, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 87 },
  { id: "OFF304", tenderId: "TND005", supplierId: "SUP002", skuId: "SKU097", round: 1, submittedDate: "2025-01-19", costPrice: 2.85, costPriceSaving: 9.2, additionalFunding: 25000, promotionChange: "increased", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 60, specSame: true, supplierAttractivenessScore: 92, overallScore: 93 },

  // --- SUP004 Sweet Street Bakers - Round 1 ---
  { id: "OFF305", tenderId: "TND005", supplierId: "SUP004", skuId: "SKU091", round: 1, submittedDate: "2025-01-20", costPrice: 3.48, costPriceSaving: 4.4, additionalFunding: 16000, promotionChange: "same", promotionWeeks: 6, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 80 },
  { id: "OFF306", tenderId: "TND005", supplierId: "SUP004", skuId: "SKU092", round: 1, submittedDate: "2025-01-20", costPrice: 1.86, costPriceSaving: 4.1, additionalFunding: 12000, promotionChange: "same", promotionWeeks: 4, deliveryTerms: "delivered", deliveryFrequency: "3x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 78 },
  { id: "OFF307", tenderId: "TND005", supplierId: "SUP004", skuId: "SKU093", round: 1, submittedDate: "2025-01-20", costPrice: 2.15, costPriceSaving: 3.6, additionalFunding: 14000, promotionChange: "increased", promotionWeeks: 8, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 79 },
  { id: "OFF308", tenderId: "TND005", supplierId: "SUP004", skuId: "SKU097", round: 1, submittedDate: "2025-01-20", costPrice: 2.98, costPriceSaving: 5.1, additionalFunding: 18000, promotionChange: "same", promotionWeeks: 4, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 45, specSame: true, supplierAttractivenessScore: 85, overallScore: 81 },

  // --- SUP008 Seasonal Delights Bakery - Round 1 ---
  { id: "OFF309", tenderId: "TND005", supplierId: "SUP008", skuId: "SKU091", round: 1, submittedDate: "2025-01-21", costPrice: 3.52, costPriceSaving: 3.3, additionalFunding: 14000, promotionChange: "same", promotionWeeks: 4, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 75, overallScore: 74 },
  { id: "OFF310", tenderId: "TND005", supplierId: "SUP008", skuId: "SKU092", round: 1, submittedDate: "2025-01-21", costPrice: 1.92, costPriceSaving: 1.0, additionalFunding: 8000, promotionChange: "decreased", promotionWeeks: 2, deliveryTerms: "ex-works", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: false, supplierAttractivenessScore: 75, overallScore: 68 },
  { id: "OFF311", tenderId: "TND005", supplierId: "SUP008", skuId: "SKU093", round: 1, submittedDate: "2025-01-21", costPrice: 2.22, costPriceSaving: 0.4, additionalFunding: 10000, promotionChange: "same", promotionWeeks: 4, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 75, overallScore: 70 },
  { id: "OFF312", tenderId: "TND005", supplierId: "SUP008", skuId: "SKU097", round: 1, submittedDate: "2025-01-21", costPrice: 3.05, costPriceSaving: 2.9, additionalFunding: 12000, promotionChange: "same", promotionWeeks: 4, deliveryTerms: "delivered", deliveryFrequency: "2x weekly", paymentDays: 30, specSame: true, supplierAttractivenessScore: 75, overallScore: 72 },
]

export function getOffersForTender(tenderId: string): Offer[] {
  return offers.filter((o) => o.tenderId === tenderId)
}

export function getOffersBySupplier(tenderId: string, supplierId: string): Offer[] {
  return offers.filter((o) => o.tenderId === tenderId && o.supplierId === supplierId)
}

export function getBestOfferForSku(tenderId: string, skuId: string): Offer | null {
  const skuOffers = offers.filter((o) => o.tenderId === tenderId && o.skuId === skuId)
  if (skuOffers.length === 0) return null
  return skuOffers.reduce((best, curr) => (curr.overallScore > best.overallScore ? curr : best))
}

export function calculateSupplierScore(supplierId: string): number {
  const supplier = suppliers.find((s) => s.id === supplierId)
  if (!supplier) return 0

  let score = 0
  // Current supplier bonus
  if (supplier.currentSupplier) score += 15
  // UK location
  if (supplier.country === "United Kingdom") score += 15
  // Reliability
  score += (supplier.reliabilityScore / 100) * 25
  // OTIF performance
  if (supplier.otifPerformance) score += (supplier.otifPerformance / 100) * 20
  // Financial health
  const healthScores = { Strong: 15, Good: 10, Fair: 5, Weak: 0 }
  score += healthScores[supplier.financialHealth.rating]
  // BRC Grade
  const brcScores = { AA: 10, A: 8, B: 5, C: 2, None: 0 }
  score += brcScores[supplier.accreditation.brcGrade]

  return Math.round(score)
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSourcingOpportunities() {
  // SKUs with below-target margin (<46%) or negative YoY growth
  return categoryPerformance
    .filter((perf) => perf.marginPercent < 46 || perf.yoyGrowth < 0)
    .map((perf) => ({
      ...perf,
      sku: skus.find((s) => s.id === perf.skuId),
    }))
}

export function getCompletedPriceDiscoveries(): Tender[] {
  return tenders.filter((t) => t.type === "price_discovery" && t.status === "completed")
}

export function getOpenTenders(type?: TenderType): Tender[] {
  return tenders.filter((t) => {
    const isOpen = t.status === "open"
    if (type) {
      return isOpen && t.type === type
    }
    return isOpen
  })
}

export function getPendingSignOffTenders() {
  return tenders.filter((t) => t.status === "pending_sign_off")
}

export function getCompletedTenders() {
  return tenders.filter((t) => t.status === "completed")
}

export function getTotalSavingsThisYear() {
  const currentYear = new Date().getFullYear()
  return tenders
    .filter((t) => t.status === "completed" && t.actualSavings && t.closeDate.startsWith(currentYear.toString()))
    .reduce((sum, t) => sum + (t.actualSavings || 0), 0)
}

export function getSupplierById(id: string) {
  return suppliers.find((s) => s.id === id)
}

export function getSkuById(id: string) {
  return skus.find((s) => s.id === id)
}

export function getPerformanceBySkuId(id: string) {
  return categoryPerformance.find((p) => p.skuId === id)
}

// ============================================
// DATASET 6: COMMODITY PRICES
// ============================================
export interface CommodityPrice {
  id: string
  name: string
  unit: string
  currentPrice: number
  priceChange12w: number // % change over 12 weeks
  priceHistory: { week: string; price: number }[]
}

export const commodityPrices: CommodityPrice[] = [
  {
    id: "COM001",
    name: "Wheat Flour",
    unit: "per kg",
    currentPrice: 0.42,
    priceChange12w: -3.2,
    priceHistory: [
      { week: "W1", price: 0.44 },
      { week: "W2", price: 0.44 },
      { week: "W3", price: 0.43 },
      { week: "W4", price: 0.43 },
      { week: "W5", price: 0.43 },
      { week: "W6", price: 0.42 },
      { week: "W7", price: 0.42 },
      { week: "W8", price: 0.42 },
      { week: "W9", price: 0.42 },
      { week: "W10", price: 0.42 },
      { week: "W11", price: 0.42 },
      { week: "W12", price: 0.42 },
    ],
  },
  {
    id: "COM002",
    name: "Sugar",
    unit: "per kg",
    currentPrice: 0.68,
    priceChange12w: 2.1,
    priceHistory: [
      { week: "W1", price: 0.66 },
      { week: "W2", price: 0.66 },
      { week: "W3", price: 0.67 },
      { week: "W4", price: 0.67 },
      { week: "W5", price: 0.67 },
      { week: "W6", price: 0.67 },
      { week: "W7", price: 0.68 },
      { week: "W8", price: 0.68 },
      { week: "W9", price: 0.68 },
      { week: "W10", price: 0.68 },
      { week: "W11", price: 0.68 },
      { week: "W12", price: 0.68 },
    ],
  },
  {
    id: "COM003",
    name: "Butter",
    unit: "per kg",
    currentPrice: 4.85,
    priceChange12w: -5.8,
    priceHistory: [
      { week: "W1", price: 5.15 },
      { week: "W2", price: 5.1 },
      { week: "W3", price: 5.05 },
      { week: "W4", price: 5.0 },
      { week: "W5", price: 4.98 },
      { week: "W6", price: 4.95 },
      { week: "W7", price: 4.92 },
      { week: "W8", price: 4.9 },
      { week: "W9", price: 4.88 },
      { week: "W10", price: 4.87 },
      { week: "W11", price: 4.86 },
      { week: "W12", price: 4.85 },
    ],
  },
  {
    id: "COM004",
    name: "Eggs (Free Range)",
    unit: "per dozen",
    currentPrice: 2.45,
    priceChange12w: 1.2,
    priceHistory: [
      { week: "W1", price: 2.42 },
      { week: "W2", price: 2.42 },
      { week: "W3", price: 2.43 },
      { week: "W4", price: 2.43 },
      { week: "W5", price: 2.44 },
      { week: "W6", price: 2.44 },
      { week: "W7", price: 2.44 },
      { week: "W8", price: 2.45 },
      { week: "W9", price: 2.45 },
      { week: "W10", price: 2.45 },
      { week: "W11", price: 2.45 },
      { week: "W12", price: 2.45 },
    ],
  },
  {
    id: "COM005",
    name: "Cocoa Powder",
    unit: "per kg",
    currentPrice: 8.2,
    priceChange12w: 12.5,
    priceHistory: [
      { week: "W1", price: 7.29 },
      { week: "W2", price: 7.35 },
      { week: "W3", price: 7.45 },
      { week: "W4", price: 7.55 },
      { week: "W5", price: 7.65 },
      { week: "W6", price: 7.75 },
      { week: "W7", price: 7.85 },
      { week: "W8", price: 7.95 },
      { week: "W9", price: 8.05 },
      { week: "W10", price: 8.1 },
      { week: "W11", price: 8.15 },
      { week: "W12", price: 8.2 },
    ],
  },
  {
    id: "COM006",
    name: "Raspberry Jam",
    unit: "per kg",
    currentPrice: 3.25,
    priceChange12w: -1.5,
    priceHistory: [
      { week: "W1", price: 3.3 },
      { week: "W2", price: 3.3 },
      { week: "W3", price: 3.28 },
      { week: "W4", price: 3.28 },
      { week: "W5", price: 3.27 },
      { week: "W6", price: 3.27 },
      { week: "W7", price: 3.26 },
      { week: "W8", price: 3.26 },
      { week: "W9", price: 3.25 },
      { week: "W10", price: 3.25 },
      { week: "W11", price: 3.25 },
      { week: "W12", price: 3.25 },
    ],
  },
  {
    id: "COM007",
    name: "Chocolate",
    unit: "per kg",
    currentPrice: 6.5,
    priceChange12w: 8.3,
    priceHistory: [
      { week: "W1", price: 6.0 },
      { week: "W2", price: 6.05 },
      { week: "W3", price: 6.1 },
      { week: "W4", price: 6.15 },
      { week: "W5", price: 6.22 },
      { week: "W6", price: 6.28 },
      { week: "W7", price: 6.35 },
      { week: "W8", price: 6.4 },
      { week: "W9", price: 6.45 },
      { week: "W10", price: 6.48 },
      { week: "W11", price: 6.49 },
      { week: "W12", price: 6.5 },
    ],
  },
  {
    id: "COM008",
    name: "Cream Cheese",
    unit: "per kg",
    currentPrice: 4.1,
    priceChange12w: -2.4,
    priceHistory: [
      { week: "W1", price: 4.2 },
      { week: "W2", price: 4.18 },
      { week: "W3", price: 4.17 },
      { week: "W4", price: 4.16 },
      { week: "W5", price: 4.15 },
      { week: "W6", price: 4.14 },
      { week: "W7", price: 4.13 },
      { week: "W8", price: 4.12 },
      { week: "W9", price: 4.11 },
      { week: "W10", price: 4.11 },
      { week: "W11", price: 4.1 },
      { week: "W12", price: 4.1 },
    ],
  },
  // After COM008 (Cream Cheese), add Lemon Curd commodity
  {
    id: "COM009",
    name: "Lemon Curd",
    unit: "per kg",
    currentPrice: 5.8,
    priceChange12w: 4.2,
    priceHistory: [
      { week: "W1", price: 5.57 },
      { week: "W2", price: 5.6 },
      { week: "W3", price: 5.62 },
      { week: "W4", price: 5.65 },
      { week: "W5", price: 5.68 },
      { week: "W6", price: 5.7 },
      { week: "W7", price: 5.72 },
      { week: "W8", price: 5.74 },
      { week: "W9", price: 5.76 },
      { week: "W10", price: 5.78 },
      { week: "W11", price: 5.79 },
      { week: "W12", price: 5.8 },
    ],
  },
]

// ============================================
// DATASET 7: RECIPE CARDS (Editable by user)
// ============================================
export interface RecipeIngredient {
  commodityId: string
  quantity: number // in grams or units
  unit: "g" | "kg" | "units"
}

export interface RecipeCard {
  skuId: string
  ingredients: RecipeIngredient[]
  overheadPercent: number // packaging, labour etc
}

export const defaultRecipeCards: RecipeCard[] = [
  {
    skuId: "SKU001",
    ingredients: [
      { commodityId: "COM001", quantity: 150, unit: "g" }, // Flour
      { commodityId: "COM002", quantity: 150, unit: "g" }, // Sugar
      { commodityId: "COM003", quantity: 150, unit: "g" }, // Butter
      { commodityId: "COM004", quantity: 3, unit: "units" }, // Eggs
      { commodityId: "COM006", quantity: 50, unit: "g" }, // Jam
    ],
    overheadPercent: 35,
  },
  // In defaultRecipeCards, update SKU002 entry:
  {
    skuId: "SKU002",
    ingredients: [
      { commodityId: "COM001", quantity: 140, unit: "g" }, // Flour - 37%
      { commodityId: "COM002", quantity: 110, unit: "g" }, // Sugar - 29%
      { commodityId: "COM003", quantity: 50, unit: "g" }, // Butter - 13%
      { commodityId: "COM004", quantity: 2, unit: "units" }, // Eggs
      { commodityId: "COM009", quantity: 57, unit: "g" }, // Lemon Curd - 15%
    ],
    overheadPercent: 35,
  },
  {
    skuId: "SKU003",
    ingredients: [
      { commodityId: "COM001", quantity: 200, unit: "g" },
      { commodityId: "COM002", quantity: 250, unit: "g" },
      { commodityId: "COM003", quantity: 200, unit: "g" },
      { commodityId: "COM004", quantity: 4, unit: "units" },
      { commodityId: "COM005", quantity: 50, unit: "g" },
      { commodityId: "COM007", quantity: 100, unit: "g" },
    ],
    overheadPercent: 35,
  },
  {
    skuId: "SKU004",
    ingredients: [
      { commodityId: "COM001", quantity: 200, unit: "g" },
      { commodityId: "COM002", quantity: 200, unit: "g" },
      { commodityId: "COM004", quantity: 3, unit: "units" },
      { commodityId: "COM008", quantity: 150, unit: "g" },
    ],
    overheadPercent: 38,
  },
  {
    skuId: "SKU005",
    ingredients: [
      { commodityId: "COM001", quantity: 200, unit: "g" },
      { commodityId: "COM003", quantity: 125, unit: "g" },
      { commodityId: "COM007", quantity: 80, unit: "g" },
    ],
    overheadPercent: 32,
  },
  {
    skuId: "SKU011",
    ingredients: [
      { commodityId: "COM001", quantity: 180, unit: "g" },
      { commodityId: "COM002", quantity: 150, unit: "g" },
      { commodityId: "COM004", quantity: 2, unit: "units" },
      { commodityId: "COM007", quantity: 100, unit: "g" },
    ],
    overheadPercent: 30,
  },
]

// ============================================
// DATASET 8: SKU COST PRICE HISTORY
// ============================================
export interface SkuCostHistory {
  skuId: string
  history: { week: string; costPrice: number }[]
}

export const skuCostHistory: SkuCostHistory[] = [
  {
    skuId: "SKU001",
    history: [
      { week: "W1", costPrice: 1.72 },
      { week: "W2", costPrice: 1.72 },
      { week: "W3", costPrice: 1.75 },
      { week: "W4", costPrice: 1.78 },
      { week: "W5", costPrice: 1.78 },
      { week: "W6", costPrice: 1.8 },
      { week: "W7", costPrice: 1.8 },
      { week: "W8", costPrice: 1.82 },
      { week: "W9", costPrice: 1.82 },
      { week: "W10", costPrice: 1.85 },
      { week: "W11", costPrice: 1.85 },
      { week: "W12", costPrice: 1.85 },
    ],
  },
  {
    skuId: "SKU002",
    history: [
      { week: "W1", costPrice: 1.8 },
      { week: "W2", costPrice: 1.82 },
      { week: "W3", costPrice: 1.84 },
      { week: "W4", costPrice: 1.86 },
      { week: "W5", costPrice: 1.88 },
      { week: "W6", costPrice: 1.88 },
      { week: "W7", costPrice: 1.9 },
      { week: "W8", costPrice: 1.9 },
      { week: "W9", costPrice: 1.92 },
      { week: "W10", costPrice: 1.92 },
      { week: "W11", costPrice: 1.92 },
      { week: "W12", costPrice: 1.92 },
    ],
  },
  {
    skuId: "SKU009",
    history: [
      { week: "W1", costPrice: 1.35 },
      { week: "W2", costPrice: 1.36 },
      { week: "W3", costPrice: 1.38 },
      { week: "W4", costPrice: 1.4 },
      { week: "W5", costPrice: 1.41 },
      { week: "W6", costPrice: 1.43 },
      { week: "W7", costPrice: 1.44 },
      { week: "W8", costPrice: 1.45 },
      { week: "W9", costPrice: 1.47 },
      { week: "W10", costPrice: 1.48 },
      { week: "W11", costPrice: 1.49 },
      { week: "W12", costPrice: 1.51 },
    ],
  },
  {
    skuId: "SKU003",
    history: [
      { week: "W1", costPrice: 1.85 },
      { week: "W2", costPrice: 1.88 },
      { week: "W3", costPrice: 1.9 },
      { week: "W4", costPrice: 1.92 },
      { week: "W5", costPrice: 1.95 },
      { week: "W6", costPrice: 1.98 },
      { week: "W7", costPrice: 2.0 },
      { week: "W8", costPrice: 2.02 },
      { week: "W9", costPrice: 2.05 },
      { week: "W10", costPrice: 2.08 },
      { week: "W11", costPrice: 2.1 },
      { week: "W12", costPrice: 2.1 },
    ],
  },
  {
    skuId: "SKU004",
    history: [
      { week: "W1", costPrice: 2.18 },
      { week: "W2", costPrice: 2.18 },
      { week: "W3", costPrice: 2.2 },
      { week: "W4", costPrice: 2.2 },
      { week: "W5", costPrice: 2.22 },
      { week: "W6", costPrice: 2.22 },
      { week: "W7", costPrice: 2.23 },
      { week: "W8", costPrice: 2.24 },
      { week: "W9", costPrice: 2.24 },
      { week: "W10", costPrice: 2.25 },
      { week: "W11", costPrice: 2.25 },
      { week: "W12", costPrice: 2.25 },
    ],
  },
  {
    skuId: "SKU005",
    history: [
      { week: "W1", costPrice: 0.85 },
      { week: "W2", costPrice: 0.86 },
      { week: "W3", costPrice: 0.87 },
      { week: "W4", costPrice: 0.88 },
      { week: "W5", costPrice: 0.89 },
      { week: "W6", costPrice: 0.9 },
      { week: "W7", costPrice: 0.91 },
      { week: "W8", costPrice: 0.92 },
      { week: "W9", costPrice: 0.93 },
      { week: "W10", costPrice: 0.94 },
      { week: "W11", costPrice: 0.95 },
      { week: "W12", costPrice: 0.95 },
    ],
  },
  {
    skuId: "SKU011",
    history: [
      { week: "W1", costPrice: 0.88 },
      { week: "W2", costPrice: 0.89 },
      { week: "W3", costPrice: 0.9 },
      { week: "W4", costPrice: 0.91 },
      { week: "W5", costPrice: 0.92 },
      { week: "W6", costPrice: 0.93 },
      { week: "W7", costPrice: 0.94 },
      { week: "W8", costPrice: 0.95 },
      { week: "W9", costPrice: 0.96 },
      { week: "W10", costPrice: 0.97 },
      { week: "W11", costPrice: 0.98 },
      { week: "W12", costPrice: 0.98 },
    ],
  },
]

// ============================================
// DATASET 9: COMPETITOR SPECS
// ============================================
export interface CompetitorSpec {
  skuId: string
  competitor: string
  productName: string
  quid: number
  packSize: string
  weight: number
  salt: number
  sugar: number
  price: number
  butterContent?: number
  lemonCurd?: number
  vanillaExtract?: number
}

export const competitorSpecs: CompetitorSpec[] = [
  // Victoria Sponge comparisons
  {
    skuId: "SKU001",
    competitor: "Tesco",
    productName: "Tesco Victoria Sponge",
    quid: 14, // Updated quid
    packSize: "Single",
    weight: 380,
    salt: 0.28, // Updated salt
    sugar: 24, // Updated sugar
    price: 3.5,
    vanillaExtract: 1.2, // Added vanillaExtract
  },
  {
    skuId: "SKU001",
    competitor: "Sainsburys",
    productName: "Sainsbury's Victoria Sponge",
    quid: 15, // Updated quid
    packSize: "Single",
    weight: 400,
    salt: 0.32, // Updated salt
    sugar: 26, // Updated sugar
    price: 3.75,
    vanillaExtract: 1.3, // Added vanillaExtract
  },
  {
    skuId: "SKU001",
    competitor: "Asda",
    productName: "Asda Victoria Sponge",
    quid: 13, // Updated quid
    packSize: "Single",
    weight: 370,
    salt: 0.25, // Updated salt
    sugar: 23, // Updated sugar
    price: 3.25,
    vanillaExtract: 1.1, // Added vanillaExtract
  },

  // Lemon Drizzle comparisons
  {
    skuId: "SKU002",
    competitor: "Tesco",
    productName: "Tesco Lemon Drizzle Cake",
    quid: 12,
    packSize: "Single",
    weight: 370,
    salt: 0.3,
    sugar: 33,
    price: 3.25,
    lemonCurd: 20, // Market standard is 20%
  },
  {
    skuId: "SKU002",
    competitor: "Sainsburys",
    productName: "Sainsbury's Lemon Drizzle",
    quid: 10,
    packSize: "Single",
    weight: 360,
    salt: 0.32,
    sugar: 32,
    price: 3.5,
    lemonCurd: 20, // Market standard is 20%
  },
  {
    skuId: "SKU002",
    competitor: "Asda",
    productName: "Asda Lemon Drizzle Cake",
    quid: 11,
    packSize: "Single",
    weight: 350,
    salt: 0.28,
    sugar: 34,
    price: 3.0,
    lemonCurd: 20, // Market standard is 20%
  },

  // Chocolate Fudge Cake comparisons
  {
    skuId: "SKU003",
    competitor: "Tesco",
    productName: "Tesco Chocolate Fudge Cake",
    quid: 22,
    packSize: "Single",
    weight: 430,
    salt: 0.5,
    sugar: 35,
    price: 3.75,
  },
  {
    skuId: "SKU003",
    competitor: "Sainsburys",
    productName: "Sainsbury's Chocolate Fudge",
    quid: 20,
    packSize: "Single",
    weight: 420,
    salt: 0.45,
    sugar: 34,
    price: 4.0,
  },
  {
    skuId: "SKU003",
    competitor: "Asda",
    productName: "Asda Chocolate Fudge Cake",
    quid: 18,
    packSize: "Single",
    weight: 400,
    salt: 0.48,
    sugar: 36,
    price: 3.5,
  },

  // Carrot Cake comparisons
  {
    skuId: "SKU004",
    competitor: "Tesco",
    productName: "Tesco Carrot Cake",
    quid: 25,
    packSize: "Single",
    weight: 400,
    salt: 0.6,
    sugar: 28,
    price: 8.25, // Increased competitor price to reduce price gap
  },
  {
    skuId: "SKU004",
    competitor: "Sainsburys",
    productName: "Sainsbury's Carrot Cake",
    quid: 23,
    packSize: "Single",
    weight: 390,
    salt: 0.55,
    sugar: 27,
    price: 8.5, // Increased competitor price to reduce price gap
  },
  {
    skuId: "SKU004",
    competitor: "Asda",
    productName: "Asda Carrot Cake",
    quid: 22,
    packSize: "Single",
    weight: 380,
    salt: 0.58,
    sugar: 29,
    price: 7.95, // Increased competitor price to reduce price gap
  },

  // Pain au Chocolat comparisons
  {
    skuId: "SKU005",
    competitor: "Tesco",
    productName: "Tesco Pain au Chocolat 4pk",
    quid: 20,
    packSize: "4 pack",
    weight: 240,
    salt: 0.8,
    sugar: 16,
    price: 1.65,
  },
  {
    skuId: "SKU005",
    competitor: "Sainsburys",
    productName: "Sainsbury's Pain au Chocolat 4pk",
    quid: 18,
    packSize: "4 pack",
    weight: 235,
    salt: 0.75,
    sugar: 15,
    price: 1.85,
  },
  {
    skuId: "SKU005",
    competitor: "Asda",
    productName: "Asda Pain au Chocolat 4pk",
    quid: 17,
    packSize: "4 pack",
    weight: 230,
    salt: 0.82,
    sugar: 17,
    price: 1.5,
  },

  // Chocolate Muffins comparisons
  {
    skuId: "SKU011",
    competitor: "Tesco",
    productName: "Tesco Chocolate Muffins 4pk",
    quid: 15,
    packSize: "4 pack",
    weight: 280,
    salt: 0.6,
    sugar: 30,
    price: 1.65,
  },
  {
    skuId: "SKU011",
    competitor: "Sainsburys",
    productName: "Sainsbury's Chocolate Muffins 4pk",
    quid: 14,
    packSize: "4 pack",
    weight: 275,
    salt: 0.55,
    sugar: 29,
    price: 1.8,
  },
  {
    skuId: "SKU011",
    competitor: "Asda",
    productName: "Asda Chocolate Muffins 4pk",
    quid: 13,
    packSize: "4 pack",
    weight: 270,
    salt: 0.58,
    sugar: 31,
    price: 1.5,
  },

  // Bakewell Tart comparisons - SKU006
  {
    skuId: "SKU006",
    competitor: "Tesco",
    productName: "Tesco Bakewell Tart",
    quid: 12,
    packSize: "Single",
    weight: 300,
    salt: 0.25,
    sugar: 28,
    price: 2.5,
  },
  {
    skuId: "SKU006",
    competitor: "Sainsburys",
    productName: "Sainsbury's Bakewell Tart",
    quid: 13,
    packSize: "Single",
    weight: 290,
    salt: 0.28,
    sugar: 27,
    price: 2.75,
  },
  {
    skuId: "SKU006",
    competitor: "Asda",
    productName: "Asda Bakewell Tart",
    quid: 11,
    packSize: "Single",
    weight: 280,
    salt: 0.22,
    sugar: 29,
    price: 2.25,
  },

  // Fruit Scones comparisons - SKU007
  {
    skuId: "SKU007",
    competitor: "Tesco",
    productName: "Tesco Fruit Scones 4pk",
    quid: 8,
    packSize: "4 pack",
    weight: 280,
    salt: 0.6,
    sugar: 12,
    price: 1.2,
  },
  {
    skuId: "SKU007",
    competitor: "Sainsburys",
    productName: "Sainsbury's Fruit Scones 4pk",
    quid: 9,
    packSize: "4 pack",
    weight: 290,
    salt: 0.55,
    sugar: 11,
    price: 1.35,
  },
  {
    skuId: "SKU007",
    competitor: "Asda",
    productName: "Asda Fruit Scones 4pk",
    quid: 7,
    packSize: "4 pack",
    weight: 270,
    salt: 0.58,
    sugar: 13,
    price: 1.1,
  },

  // Danish Pastry comparisons - SKU008
  {
    skuId: "SKU008",
    competitor: "Tesco",
    productName: "Tesco Danish Pastry 2pk",
    quid: 15,
    packSize: "2 pack",
    weight: 180,
    salt: 0.45,
    sugar: 22,
    price: 1.4,
  },
  {
    skuId: "SKU008",
    competitor: "Sainsburys",
    productName: "Sainsbury's Danish Pastry 2pk",
    quid: 16,
    packSize: "2 pack",
    weight: 185,
    salt: 0.42,
    sugar: 21,
    price: 1.55,
  },
  {
    skuId: "SKU008",
    competitor: "Asda",
    productName: "Asda Danish Pastry 2pk",
    quid: 14,
    packSize: "2 pack",
    weight: 175,
    salt: 0.48,
    sugar: 23,
    price: 1.3,
  },

  // Almond Croissant comparisons - SKU010
  {
    skuId: "SKU010",
    competitor: "Tesco",
    productName: "Tesco Almond Croissant",
    quid: 14,
    packSize: "Single",
    weight: 95,
    salt: 0.35,
    sugar: 18,
    price: 1.15,
  },
  {
    skuId: "SKU010",
    competitor: "Sainsburys",
    productName: "Sainsbury's Almond Croissant",
    quid: 15,
    packSize: "Single",
    weight: 100,
    salt: 0.32,
    sugar: 17,
    price: 1.25,
  },
  {
    skuId: "SKU010",
    competitor: "Asda",
    productName: "Asda Almond Croissant",
    quid: 13,
    packSize: "Single",
    weight: 90,
    salt: 0.38,
    sugar: 19,
    price: 1.05,
  },

  // Glazed Donuts comparisons
  {
    skuId: "SKU071",
    competitor: "Tesco",
    productName: "Tesco Glazed Ring Donuts 6pk",
    quid: 7,
    packSize: "6 pack",
    weight: 320,
    salt: 0.35,
    sugar: 22,
    price: 2.0,
  },
  {
    skuId: "SKU071",
    competitor: "Sainsburys",
    productName: "Sainsbury's Glazed Donuts 6pk",
    quid: 8,
    packSize: "6 pack",
    weight: 310,
    salt: 0.38,
    sugar: 22,
    price: 2.15,
  },
  {
    skuId: "SKU071",
    competitor: "Asda",
    productName: "Asda Glazed Ring Donuts 6pk",
    quid: 7,
    packSize: "6 pack",
    weight: 315,
    salt: 0.36,
    sugar: 22,
    price: 1.95,
  },
]

export interface MorrisonsSpec {
  skuId: string
  quid: number
  packSize: string
  weight: number
  salt: number
  sugar: number
  butterContent?: number
  chocolateContent?: number // Changed from butterContent
  lemonCurd?: number
  vanillaExtract?: number
}

export const morrisonsSpecs: MorrisonsSpec[] = [
  { skuId: "SKU001", quid: 14, salt: 0.3, sugar: 25, packSize: "8 inch", weight: 450, vanillaExtract: 2 }, // Updated vanillaExtract to 2%
  { skuId: "SKU002", quid: 14, salt: 0.35, sugar: 35, packSize: "Single", weight: 380, lemonCurd: 15 },
  { skuId: "SKU003", quid: 25, salt: 0.55, sugar: 38, packSize: "Single", weight: 450 },
  { skuId: "SKU004", quid: 28, salt: 0.65, sugar: 30, packSize: "Single", weight: 420 },
  { skuId: "SKU005", quid: 22, salt: 0.85, sugar: 18, packSize: "4 pack", weight: 280, chocolateContent: 12 }, // Changed from butterContent, updated metric name
  { skuId: "SKU011", quid: 18, salt: 0.65, sugar: 32, packSize: "4 pack", weight: 320 },
  { skuId: "SKU071", quid: 8, salt: 0.4, sugar: 25, packSize: "6 pack", weight: 330 },
]

// ============================================
// HELPER FUNCTIONS FOR OPPORTUNITIES
// ============================================

export function calculateCommodityCost(recipe: RecipeCard): number {
  let totalCost = 0
  recipe.ingredients.forEach((ing) => {
    const commodity = commodityPrices.find((c) => c.id === ing.commodityId)
    if (commodity) {
      let cost = 0
      if (ing.unit === "g") {
        cost = (ing.quantity / 1000) * commodity.currentPrice
      } else if (ing.unit === "kg") {
        cost = ing.quantity * commodity.currentPrice
      } else if (ing.unit === "units") {
        // For eggs, convert from dozen price
        cost = (ing.quantity / 12) * commodity.currentPrice
      }
      totalCost += cost
    }
  })
  return totalCost * (1 + recipe.overheadPercent / 100)
}

export function getCommodityCostHistory(recipe: RecipeCard): { week: string; cost: number }[] {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"]
  return weeks.map((week) => {
    let totalCost = 0
    recipe.ingredients.forEach((ing) => {
      const commodity = commodityPrices.find((c) => c.id === ing.commodityId)
      if (commodity) {
        const weekPrice = commodity.priceHistory.find((h) => h.week === week)?.price || commodity.currentPrice
        let cost = 0
        if (ing.unit === "g") {
          cost = (ing.quantity / 1000) * weekPrice
        } else if (ing.unit === "kg") {
          cost = ing.quantity * weekPrice
        } else if (ing.unit === "units") {
          cost = (ing.quantity / 12) * weekPrice
        }
        totalCost += cost
      }
    })
    return { week, cost: totalCost * (1 + recipe.overheadPercent / 100) }
  })
}

export function getInputPriceOpportunities() {
  const opportunities: {
    skuId: string
    skuName: string
    costPriceChange: number
    commodityCostChange: number
    gap: number
    opportunityValue: number
  }[] = []

  skuCostHistory.forEach((skuHistory) => {
    const sku = skus.find((s) => s.id === skuHistory.skuId)
    const recipe = defaultRecipeCards.find((r) => r.skuId === skuHistory.skuId)
    if (!sku || !recipe) return

    const costStart = skuHistory.history[0].costPrice
    const costEnd = skuHistory.history[skuHistory.history.length - 1].costPrice
    const costPriceChange = ((costEnd - costStart) / costStart) * 100

    const commodityHistory = getCommodityCostHistory(recipe)
    const commStart = commodityHistory[0].cost
    const commEnd = commodityHistory[commodityHistory.length - 1].cost
    const commodityCostChange = ((commEnd - commStart) / commStart) * 100

    const gap = costPriceChange - commodityCostChange

    if (gap > 2) {
      // Cost price increased more than commodity - opportunity
      const weeklyVolume = sku.weeklyVolume
      const potentialSaving = (gap / 100) * costEnd * weeklyVolume * 52
      opportunities.push({
        skuId: skuHistory.skuId,
        skuName: sku.name,
        costPriceChange,
        commodityCostChange,
        gap,
        opportunityValue: potentialSaving,
      })
    }
  })

  return opportunities
}

export function getSpecOpportunities() {
  const opportunities: {
    skuId: string
    sku: string
    subcategory: string
    specMetric: string
    ourSpec: number
    marketSpecMin: number
    specGapVsMin: number
    specPotentialSavingGBP: number
    isAboveSpec: boolean
  }[] = []

  // --- ABOVE SPEC (3 opportunities - we're over-specced, potential to reduce cost) ---

  // 1. Glazed Donuts - Sugar 25% vs market 22% (over-specced)
  const glazedDonutSku = skus.find((s) => s.id === "SKU071")
  if (glazedDonutSku) {
    opportunities.push({
      skuId: "SKU071",
      sku: glazedDonutSku.name,
      subcategory: "Donuts",
      specMetric: "Sugar %",
      ourSpec: 25,
      marketSpecMin: 22,
      specGapVsMin: 3,
      specPotentialSavingGBP: 8500,
      isAboveSpec: true,
    })
  }

  // 2. Victoria Sponge - QUID 32% vs market 28% (over-specced)
  const victoriaSku = skus.find((s) => s.id === "SKU001")
  if (victoriaSku) {
    opportunities.push({
      skuId: "SKU001",
      sku: victoriaSku.name,
      subcategory: "Celebration Cakes",
      specMetric: "QUID %",
      ourSpec: 32,
      marketSpecMin: 28,
      specGapVsMin: 4,
      specPotentialSavingGBP: 12400,
      isAboveSpec: true,
    })
  }

  // 3. Carrot Cake - Salt 1.8g vs market 1.5g (over-specced)
  const carrotSku = skus.find((s) => s.id === "SKU005")
  if (carrotSku) {
    opportunities.push({
      skuId: "SKU005",
      sku: carrotSku.name,
      subcategory: "Celebration Cakes",
      specMetric: "Salt (g)",
      ourSpec: 1.8,
      marketSpecMin: 1.5,
      specGapVsMin: 0.3,
      specPotentialSavingGBP: 4200,
      isAboveSpec: true,
    })
  }

  // --- BELOW SPEC (2 opportunities - we're under-specced, quality gap) ---

  // 4. Lemon Drizzle Cake - Lemon Curd 15% vs market 19% (under-specced)
  const lemonDrizzleSku = skus.find((s) => s.id === "SKU002")
  if (lemonDrizzleSku) {
    opportunities.push({
      skuId: "SKU002",
      sku: lemonDrizzleSku.name,
      subcategory: "Celebration Cakes",
      specMetric: "Lemon Curd",
      ourSpec: 15,
      marketSpecMin: 19,
      specGapVsMin: -4,
      specPotentialSavingGBP: 0,
      isAboveSpec: false,
    })
  }

  // 5. Pain au Chocolat - Chocolate 12% vs market 18% (under-specced)
  const painAuChocSku = skus.find((s) => s.id === "SKU005") // Assuming SKU005 is the primary Pain au Chocolat
  if (painAuChocSku) {
    opportunities.push({
      skuId: painAuChocSku.id,
      sku: painAuChocSku.name,
      subcategory: "Pastries",
      specMetric: "Chocolate %",
      ourSpec: 12,
      marketSpecMin: 18,
      specGapVsMin: -6,
      specPotentialSavingGBP: 0,
      isAboveSpec: false,
    })
  }

  return opportunities
}

export function getPriceMarginOpportunities() {
  const categoryAvgMargin = 46 // Target margin %
  const opportunities: {
    skuId: string
    skuName: string
    morrisonsPrice: number
    competitorAvgPrice: number
    priceVsMarket: number
    margin: number
    marginVsTarget: number
    opportunityType: string
    opportunityValue: number
  }[] = []

  skus.forEach((sku) => {
    const compSpecs = competitorSpecs.filter((c) => c.skuId === sku.id)
    const perf = categoryPerformance.find((p) => p.skuId === sku.id)
    if (compSpecs.length === 0 || !perf) return

    const avgCompPrice = compSpecs.reduce((sum, c) => sum + c.price, 0) / compSpecs.length
    const priceVsMarket = ((sku.retailPrice - avgCompPrice) / avgCompPrice) * 100
    const marginVsTarget = perf.marginPercent - categoryAvgMargin

    // Opportunity: Price is higher than competitors AND margin is below target
    if (priceVsMarket > 5 && marginVsTarget < 0) {
      const potentialSaving = Math.abs(marginVsTarget) * 0.01 * perf.salesValue * 0.25
      opportunities.push({
        skuId: sku.id,
        skuName: sku.name,
        morrisonsPrice: sku.retailPrice,
        competitorAvgPrice: avgCompPrice,
        priceVsMarket,
        margin: perf.marginPercent,
        marginVsTarget,
        opportunityType: "Overpriced with low margin",
        opportunityValue: potentialSaving,
      })
    }
    // Opportunity: Price is lower than competitors but margin is also low
    else if (priceVsMarket < -5 && marginVsTarget < -2) {
      const potentialSaving = Math.abs(marginVsTarget) * 0.01 * perf.salesValue * 0.2
      opportunities.push({
        skuId: sku.id,
        skuName: sku.name,
        morrisonsPrice: sku.retailPrice,
        competitorAvgPrice: avgCompPrice,
        priceVsMarket,
        margin: perf.marginPercent,
        marginVsTarget,
        opportunityType: "Underpriced with low margin",
        opportunityValue: potentialSaving,
      })
    }
  })

  return opportunities
}

export function getTotalSourcingOpportunities() {
  const inputOpps = getInputPriceOpportunities().length
  const specOpps = getSpecOpportunities().length
  const priceMarginOpps = getPriceMarginOpportunities().length
  const contractRenewalOpps = getContractRenewalOpportunities().length
  return inputOpps + specOpps + priceMarginOpps + contractRenewalOpps
}

export function getCommodityById(id: string) {
  return commodityPrices.find((c) => c.id === id)
}

export function getContractRenewalOpportunities() {
  const today = new Date()
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

  return skus
    .filter((sku) => {
      if (!sku.contractTerms) return false
      const endDate = new Date(sku.contractTerms.contractEndDate)
      return endDate >= today && endDate <= sixMonthsFromNow
    })
    .map((sku) => {
      const endDate = new Date(sku.contractTerms!.contractEndDate)
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const annualValue = sku.weeklyVolume * 52 * sku.currentCostPrice

      return {
        skuId: sku.id,
        skuName: sku.name,
        subcategory: sku.subcategory,
        supplierId: sku.contractTerms!.supplierId,
        supplierName: sku.contractTerms!.supplierName,
        contractEndDate: sku.contractTerms!.contractEndDate,
        daysUntilExpiry,
        annualValue,
        contractDurationYears: sku.contractTerms!.contractDurationYears,
        urgency:
          daysUntilExpiry <= 60
            ? "critical"
            : daysUntilExpiry <= 90
              ? "high"
              : daysUntilExpiry <= 150
                ? "warning"
                : ("normal" as "critical" | "high" | "warning" | "normal"),
      }
    })
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
}

export function getAllContractsForCalendar() {
  return skus
    .filter((sku) => sku.contractTerms)
    .map((sku) => {
      const endDate = new Date(sku.contractTerms!.contractEndDate)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      return {
        skuId: sku.id,
        skuName: sku.name,
        subcategory: sku.subcategory,
        supplierId: sku.contractTerms!.supplierId,
        supplierName: sku.contractTerms!.supplierName,
        contractStartDate: sku.contractTerms!.contractStartDate,
        contractEndDate: sku.contractTerms!.contractEndDate,
        daysUntilExpiry,
        annualValue: sku.weeklyVolume * 52 * sku.currentCostPrice,
        contractDurationYears: sku.contractTerms!.contractDurationYears,
        isExpiringSoon: daysUntilExpiry <= 180 && daysUntilExpiry > 0,
        isExpired: daysUntilExpiry < 0,
      }
    })
    .sort((a, b) => new Date(a.contractEndDate).getTime() - new Date(b.contractEndDate).getTime())
}
// ============================================
// DATASET 10: SPEC RECIPE CARDS (for Spec Opportunity comparison)
// ============================================
export interface SpecRecipeIngredient {
  name: string
  commodityId?: string
  percentage: number // percentage of total recipe
  commodityPrice: number // £/kg
  priceInSku: number // cost contribution to the SKU
  isQuid?: boolean // true if this ingredient is the QUID (declared) ingredient
  }

export interface SpecRecipeCardData {
  skuId: string
  skuName: string
  subcategory: string
  specMetric: string
  ingredients: SpecRecipeIngredient[]
  totalCost: number
}

// Current recipe cards (our actual specs)
export const specCurrentRecipes: SpecRecipeCardData[] = [
  {
    skuId: "SKU071",
    skuName: "PL Glazed Ring Donuts 6pk",
    subcategory: "Donuts",
    specMetric: "Sugar %",
    ingredients: [
      { name: "Wheat Flour", commodityId: "COM001", percentage: 35, commodityPrice: 0.42, priceInSku: 0.147 },
      { name: "Sugar", commodityId: "COM002", percentage: 25, commodityPrice: 0.68, priceInSku: 0.170 },
      { name: "Vegetable Oil", percentage: 15, commodityPrice: 1.20, priceInSku: 0.180 },
      { name: "Eggs", commodityId: "COM004", percentage: 10, commodityPrice: 2.45, priceInSku: 0.245 },
      { name: "Yeast", percentage: 5, commodityPrice: 2.10, priceInSku: 0.105 },
      { name: "Glaze (Sugar-based)", percentage: 8, commodityPrice: 1.85, priceInSku: 0.148 },
      { name: "Other (Salt, Flavouring)", percentage: 2, commodityPrice: 0.50, priceInSku: 0.010 },
    ],
    totalCost: 1.005,
  },
  {
    skuId: "SKU001",
    skuName: "The Best Victoria Sponge",
    subcategory: "Celebration Cakes",
    specMetric: "QUID %",
    ingredients: [
      { name: "Wheat Flour", commodityId: "COM001", percentage: 28, commodityPrice: 0.42, priceInSku: 0.118 },
      { name: "Sugar", commodityId: "COM002", percentage: 22, commodityPrice: 0.68, priceInSku: 0.150 },
      { name: "Butter", commodityId: "COM003", percentage: 18, commodityPrice: 4.85, priceInSku: 0.873 },
      { name: "Eggs", commodityId: "COM004", percentage: 14, commodityPrice: 2.45, priceInSku: 0.343 },
      { name: "Raspberry Jam", commodityId: "COM006", percentage: 12, commodityPrice: 3.25, priceInSku: 0.390, isQuid: true },
      { name: "Cream", percentage: 4, commodityPrice: 3.10, priceInSku: 0.124 },
      { name: "Vanilla & Raising Agent", percentage: 2, commodityPrice: 0.80, priceInSku: 0.016 },
    ],
    totalCost: 2.014,
  },
  {
    skuId: "SKU005",
    skuName: "PL Pain au Chocolat 4pk",
    subcategory: "Celebration Cakes",
    specMetric: "Salt (g)",
    ingredients: [
      { name: "Wheat Flour", commodityId: "COM001", percentage: 32, commodityPrice: 0.42, priceInSku: 0.134 },
      { name: "Butter", commodityId: "COM003", percentage: 28, commodityPrice: 4.85, priceInSku: 1.358 },
      { name: "Chocolate", commodityId: "COM007", percentage: 15, commodityPrice: 6.50, priceInSku: 0.975 },
      { name: "Sugar", commodityId: "COM002", percentage: 8, commodityPrice: 0.68, priceInSku: 0.054 },
      { name: "Eggs", commodityId: "COM004", percentage: 7, commodityPrice: 2.45, priceInSku: 0.172 },
      { name: "Yeast", percentage: 4, commodityPrice: 2.10, priceInSku: 0.084 },
      { name: "Salt", percentage: 3.5, commodityPrice: 0.30, priceInSku: 0.011 },
      { name: "Milk Powder", percentage: 2.5, commodityPrice: 3.60, priceInSku: 0.090 },
    ],
    totalCost: 2.878,
  },
  {
    skuId: "SKU002",
    skuName: "The Best Lemon Drizzle Cake",
    subcategory: "Celebration Cakes",
    specMetric: "Lemon Curd",
    ingredients: [
      { name: "Wheat Flour", commodityId: "COM001", percentage: 30, commodityPrice: 0.42, priceInSku: 0.126 },
      { name: "Sugar", commodityId: "COM002", percentage: 24, commodityPrice: 0.68, priceInSku: 0.163 },
      { name: "Butter", commodityId: "COM003", percentage: 16, commodityPrice: 4.85, priceInSku: 0.776 },
      { name: "Eggs", commodityId: "COM004", percentage: 12, commodityPrice: 2.45, priceInSku: 0.294 },
      { name: "Lemon Curd", commodityId: "COM009", percentage: 15, commodityPrice: 5.80, priceInSku: 0.870 },
      { name: "Lemon Zest & Juice", percentage: 2, commodityPrice: 2.40, priceInSku: 0.048 },
      { name: "Raising Agent", percentage: 1, commodityPrice: 1.20, priceInSku: 0.012 },
    ],
    totalCost: 2.289,
  },
  {
    skuId: "SKU005-pastries",
    skuName: "PL Pain au Chocolat 4pk",
    subcategory: "Pastries",
    specMetric: "Chocolate %",
    ingredients: [
      { name: "Wheat Flour", commodityId: "COM001", percentage: 36, commodityPrice: 0.42, priceInSku: 0.151 },
      { name: "Butter", commodityId: "COM003", percentage: 30, commodityPrice: 4.85, priceInSku: 1.455 },
      { name: "Chocolate", commodityId: "COM007", percentage: 12, commodityPrice: 6.50, priceInSku: 0.780 },
      { name: "Sugar", commodityId: "COM002", percentage: 8, commodityPrice: 0.68, priceInSku: 0.054 },
      { name: "Eggs", commodityId: "COM004", percentage: 6, commodityPrice: 2.45, priceInSku: 0.147 },
      { name: "Yeast", percentage: 4, commodityPrice: 2.10, priceInSku: 0.084 },
      { name: "Salt & Milk Powder", percentage: 4, commodityPrice: 1.80, priceInSku: 0.072 },
    ],
    totalCost: 2.743,
  },
]

// Competitor recipe cards (market benchmark)
export const specCompetitorRecipes: SpecRecipeCardData[] = [
  {
    skuId: "SKU071",
    skuName: "Competitor Glazed Ring Donuts 6pk",
    subcategory: "Donuts",
    specMetric: "Sugar %",
    ingredients: [
      { name: "Wheat Flour", percentage: 38, commodityPrice: 0.42, priceInSku: 0.160 },
      { name: "Sugar", percentage: 22, commodityPrice: 0.68, priceInSku: 0.150 },
      { name: "Vegetable Oil", percentage: 14, commodityPrice: 1.20, priceInSku: 0.168 },
      { name: "Eggs", percentage: 10, commodityPrice: 2.45, priceInSku: 0.245 },
      { name: "Yeast", percentage: 6, commodityPrice: 2.10, priceInSku: 0.126 },
      { name: "Glaze (Sugar-based)", percentage: 7, commodityPrice: 1.85, priceInSku: 0.130 },
      { name: "Other (Salt, Flavouring)", percentage: 3, commodityPrice: 0.50, priceInSku: 0.015 },
    ],
    totalCost: 0.994,
  },
  {
    skuId: "SKU001",
    skuName: "Competitor Victoria Sponge",
    subcategory: "Celebration Cakes",
    specMetric: "QUID %",
    ingredients: [
      { name: "Wheat Flour", percentage: 30, commodityPrice: 0.42, priceInSku: 0.126 },
      { name: "Sugar", percentage: 24, commodityPrice: 0.68, priceInSku: 0.163 },
      { name: "Butter", percentage: 16, commodityPrice: 4.85, priceInSku: 0.776 },
      { name: "Eggs", percentage: 14, commodityPrice: 2.45, priceInSku: 0.343 },
      { name: "Raspberry Jam", percentage: 8, commodityPrice: 3.25, priceInSku: 0.260, isQuid: true },
      { name: "Cream", percentage: 6, commodityPrice: 3.10, priceInSku: 0.186 },
      { name: "Vanilla & Raising Agent", percentage: 2, commodityPrice: 0.80, priceInSku: 0.016 },
    ],
    totalCost: 1.870,
  },
  {
    skuId: "SKU005",
    skuName: "Competitor Pain au Chocolat 4pk",
    subcategory: "Celebration Cakes",
    specMetric: "Salt (g)",
    ingredients: [
      { name: "Wheat Flour", percentage: 33, commodityPrice: 0.42, priceInSku: 0.139 },
      { name: "Butter", percentage: 28, commodityPrice: 4.85, priceInSku: 1.358 },
      { name: "Chocolate", percentage: 15, commodityPrice: 6.50, priceInSku: 0.975 },
      { name: "Sugar", percentage: 8, commodityPrice: 0.68, priceInSku: 0.054 },
      { name: "Eggs", percentage: 7, commodityPrice: 2.45, priceInSku: 0.172 },
      { name: "Yeast", percentage: 4, commodityPrice: 2.10, priceInSku: 0.084 },
      { name: "Salt", percentage: 2.5, commodityPrice: 0.30, priceInSku: 0.008 },
      { name: "Milk Powder", percentage: 2.5, commodityPrice: 3.60, priceInSku: 0.090 },
    ],
    totalCost: 2.880,
  },
  {
    skuId: "SKU002",
    skuName: "Competitor Lemon Drizzle Cake",
    subcategory: "Celebration Cakes",
    specMetric: "Lemon Curd",
    ingredients: [
      { name: "Wheat Flour", percentage: 28, commodityPrice: 0.42, priceInSku: 0.118 },
      { name: "Sugar", percentage: 22, commodityPrice: 0.68, priceInSku: 0.150 },
      { name: "Butter", percentage: 14, commodityPrice: 4.85, priceInSku: 0.679 },
      { name: "Eggs", percentage: 12, commodityPrice: 2.45, priceInSku: 0.294 },
      { name: "Lemon Curd", percentage: 19, commodityPrice: 5.80, priceInSku: 1.102 },
      { name: "Lemon Zest & Juice", percentage: 3, commodityPrice: 2.40, priceInSku: 0.072 },
      { name: "Raising Agent", percentage: 2, commodityPrice: 1.20, priceInSku: 0.024 },
    ],
    totalCost: 2.439,
  },
  {
    skuId: "SKU005-pastries",
    skuName: "Competitor Pain au Chocolat 4pk",
    subcategory: "Pastries",
    specMetric: "Chocolate %",
    ingredients: [
      { name: "Wheat Flour", percentage: 32, commodityPrice: 0.42, priceInSku: 0.134 },
      { name: "Butter", percentage: 26, commodityPrice: 4.85, priceInSku: 1.261 },
      { name: "Chocolate", percentage: 18, commodityPrice: 6.50, priceInSku: 1.170 },
      { name: "Sugar", percentage: 8, commodityPrice: 0.68, priceInSku: 0.054 },
      { name: "Eggs", percentage: 7, commodityPrice: 2.45, priceInSku: 0.172 },
      { name: "Yeast", percentage: 5, commodityPrice: 2.10, priceInSku: 0.105 },
      { name: "Salt & Milk Powder", percentage: 4, commodityPrice: 1.80, priceInSku: 0.072 },
    ],
    totalCost: 2.968,
  },
]

export function getSpecRecipeBySkuId(skuId: string, subcategory?: string) {
  const current = specCurrentRecipes.find((r) => {
    if (subcategory === "Pastries" && r.skuId === "SKU005-pastries") return true
    return r.skuId === skuId && (!subcategory || r.subcategory === subcategory)
  })
  const competitor = specCompetitorRecipes.find((r) => {
    if (subcategory === "Pastries" && r.skuId === "SKU005-pastries") return true
    return r.skuId === skuId && (!subcategory || r.subcategory === subcategory)
  })
  return { current, competitor }
}

// ============================================
// DATASET 11: AVAILABLE CATEGORIES & TIME PERIODS
// ============================================
// ============================================
// AVAILABLE CATEGORIES - Main category is Bakery
// ============================================
export const availableCategories = ["Bakery"]

export const availableTimePeriods = ["Last 4 Weeks", "Last 12 Weeks", "Last 52 Weeks", "YTD"]
