-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" DOUBLE PRECISION NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "yearBuilt" INTEGER NOT NULL,
    "lotSize" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valuation" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "valuationFactors" JSONB NOT NULL,
    "modelVersion" TEXT NOT NULL DEFAULT 'v1.0.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Valuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketTrend" (
    "id" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "avgPricePerSqFt" DOUBLE PRECISION NOT NULL,
    "medianSalePrice" DOUBLE PRECISION NOT NULL,
    "inventoryCount" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketTrend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Valuation" ADD CONSTRAINT "Valuation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valuation" ADD CONSTRAINT "Valuation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
