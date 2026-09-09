require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const prisma = require('../src/services/prisma');

async function importCSV() {
  const filePath = 'market_data.csv';

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File '${filePath}' not found in backend directory.`);
    process.exit(1);
  }

  console.log(`Reading ${filePath}...`);
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      if (data.ZipCode) {
        results.push({
          zipCode: String(data.ZipCode).trim(),
          city: data.City || 'Unknown',
          avgPricePerSqFt: parseFloat(data.PricePerSqFt) || 0,
          medianSalePrice: parseFloat(data.MedianSalePrice) || 0,
          inventoryCount: parseInt(data.Inventory, 10) || 10
        });
      }
    })
    .on('end', async () => {
      console.log(`Processing ${results.length} market entries into PostgreSQL...`);
      for (const item of results) {
        const existing = await prisma.marketTrend.findFirst({
          where: { zipCode: item.zipCode }
        });

        if (existing) {
          await prisma.marketTrend.update({
            where: { id: existing.id },
            data: item
          });
        } else {
          await prisma.marketTrend.create({
            data: item
          });
        }
      }
      console.log('CSV Import Completed Successfully!');
      await prisma.$disconnect();
    });
}

importCSV().catch(async (e) => {
  console.error('Import Error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
