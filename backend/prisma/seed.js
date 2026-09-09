require('dotenv').config();
const prisma = require('../src/services/prisma');

async function main() {
  console.log('Seeding real-world ZIP code market trends...');

  const realMarketData = [
    // --- Indian Pincodes (Prices in INR per sq.ft.) ---
    { zipCode: '560001', city: 'Bangalore (MG Road/Central)', avgPricePerSqFt: 14500, medianSalePrice: 18000000, inventoryCount: 85 },
    { zipCode: '560103', city: 'Bangalore (Bellandur/ORR)', avgPricePerSqFt: 10200, medianSalePrice: 13500000, inventoryCount: 140 },
    { zipCode: '560066', city: 'Bangalore (Whitefield)', avgPricePerSqFt: 8800, medianSalePrice: 11000000, inventoryCount: 210 },
    { zipCode: '400001', city: 'Mumbai (Fort/South Mumbai)', avgPricePerSqFt: 48000, medianSalePrice: 65000000, inventoryCount: 42 },
    { zipCode: '400051', city: 'Mumbai (Bandra East/BKC)', avgPricePerSqFt: 36000, medianSalePrice: 48000000, inventoryCount: 65 },
    { zipCode: '110001', city: 'Delhi (Connaught Place)', avgPricePerSqFt: 32000, medianSalePrice: 42000000, inventoryCount: 30 },
    { zipCode: '122002', city: 'Gurugram (DLF Phase 1-5)', avgPricePerSqFt: 18500, medianSalePrice: 26000000, inventoryCount: 110 },
    { zipCode: '500081', city: 'Hyderabad (HITECH City)', avgPricePerSqFt: 9200, medianSalePrice: 12500000, inventoryCount: 175 },
    { zipCode: '411057', city: 'Pune (Hinjawadi)', avgPricePerSqFt: 7100, medianSalePrice: 8500000, inventoryCount: 190 },

    // --- US ZIP Codes (Converted to INR per sq.ft. @ 1 USD = 85 INR) ---
    { zipCode: '78701', city: 'Austin Downtown', avgPricePerSqFt: 26350, medianSalePrice: 55250000, inventoryCount: 45 },
    { zipCode: '90210', city: 'Beverly Hills', avgPricePerSqFt: 72250, medianSalePrice: 204000000, inventoryCount: 12 },
    { zipCode: '10001', city: 'New York Central', avgPricePerSqFt: 78200, medianSalePrice: 157250000, inventoryCount: 28 },
    { zipCode: '94102', city: 'San Francisco (Hayes Valley)', avgPricePerSqFt: 68000, medianSalePrice: 127500000, inventoryCount: 38 },
    { zipCode: '33139', city: 'Miami Beach', avgPricePerSqFt: 51000, medianSalePrice: 93500000, inventoryCount: 52 }
  ];

  for (const trend of realMarketData) {
    const existing = await prisma.marketTrend.findFirst({
      where: { zipCode: trend.zipCode }
    });

    if (existing) {
      await prisma.marketTrend.update({
        where: { id: existing.id },
        data: trend
      });
    } else {
      await prisma.marketTrend.create({
        data: trend
      });
    }
  }

  console.log(`Successfully processed ${realMarketData.length} ZIP/Pincode market entries in PostgreSQL.`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
