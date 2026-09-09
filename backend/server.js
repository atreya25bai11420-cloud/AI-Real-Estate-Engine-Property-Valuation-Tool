const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

function parseMarketCSV() {
  const filePath = path.join(__dirname, '..', 'database', 'market_data.csv');
  
  if (!fs.existsSync(filePath)) {
    console.log("❌ Error: 'market_data.csv' not found at: " + filePath);
    return [];
  }

  const rawContent = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '').trim();
  const lines = rawContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
  const parseRow = (str) => str.split(delimiter).map(cell => cell.replace(/^["']|["']$/g, '').trim());

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  let zipIdx = headers.findIndex(h => h.includes('zip') || h.includes('pin'));
  let rateIdx = headers.findIndex(h => h.includes('pricepersqft') || h.includes('rate') || h.includes('ppsqft'));
  let cityIdx = headers.findIndex(h => h.includes('city') || h.includes('location'));
  let invIdx = headers.findIndex(h => h.includes('inventory') || h.includes('count'));

  if (zipIdx === -1) zipIdx = 0;
  if (cityIdx === -1) cityIdx = 1;
  if (rateIdx === -1) rateIdx = 2;
  if (invIdx === -1) invIdx = 4;

  const cleanNum = (val) => {
    if (!val) return NaN;
    return parseFloat(String(val).replace(/[^0-9.]/g, ''));
  };

  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]);
    if (row.length <= zipIdx) continue;

    const rawZip = row[zipIdx] || '';
    const cleanZip = String(rawZip).replace(/\.0$/, '').trim();

    if (!cleanZip) continue;

    const rate = cleanNum(row[rateIdx]);
    const city = row[cityIdx] || `Zone ${cleanZip}`;
    const inventory = cleanNum(row[invIdx]);

    if (!isNaN(rate) && rate > 0) {
      records.push({
        zip: cleanZip,
        rate: Math.round(rate),
        city: city,
        inventory: !isNaN(inventory) ? Math.round(inventory) : 50
      });
    }
  }

  return records;
}

app.get('/api/valuation', (req, res) => {
  const reqZip = String(req.query.zipCode || '').replace(/\.0$/, '').trim();
  const reqSqFt = Number(req.query.sqFt) || 1200;

  if (!reqZip) {
    return res.status(400).json({ error: "ZIP Code / Pincode is required." });
  }

  const dataset = parseMarketCSV();

  if (dataset.length === 0) {
    return res.status(500).json({ error: "Could not parse market_data.csv from database folder." });
  }

  let matches = dataset.filter(r => r.zip.toLowerCase() === reqZip.toLowerCase());
  let matchedZip = reqZip;
  let isNearest = false;

  if (matches.length === 0) {
    const targetNum = parseInt(reqZip.replace(/\D/g, ''), 10);

    if (!isNaN(targetNum)) {
      let closestRecord = dataset[0];
      let minDiff = Infinity;

      for (const item of dataset) {
        const itemNum = parseInt(item.zip.replace(/\D/g, ''), 10);
        if (!isNaN(itemNum)) {
          const diff = Math.abs(itemNum - targetNum);
          if (diff < minDiff) {
            minDiff = diff;
            closestRecord = item;
          }
        }
      }

      matches = dataset.filter(r => r.zip === closestRecord.zip);
      matchedZip = closestRecord.zip;
      isNearest = true;
    } else {
      matches = [dataset[0]];
      matchedZip = dataset[0].zip;
      isNearest = true;
    }
  }

  const record = matches[0];
  const avgRate = record.rate;
  const estimatedValue = Math.round(avgRate * reqSqFt);
  const city = record.city;
  const inventoryCount = record.inventory;

  console.log(`[CSV MATCH] Input ZIP: ${reqZip} | Matched: ${matchedZip} (${city}) | Rate: ₹${avgRate}/sqft | Val: ₹${estimatedValue}`);

  res.json({
    requestedZip: reqZip,
    matchedZip: matchedZip,
    isNearest: isNearest,
    city: city,
    avgPricePerSqFt: avgRate,
    estimatedValue: estimatedValue,
    inventoryCount: inventoryCount
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
