import { list } from '@vercel/blob';
import { readFileSync } from 'fs';

// List all blobs
const result = await list();

console.log(`Total blobs: ${result.blobs.length}\n`);
result.blobs.forEach((blob, i) => {
  console.log(`${i + 1}. ${blob.pathname}`);
  console.log(`   URL: ${blob.url}`);
  console.log(`   Size: ${(blob.size / 1024).toFixed(1)} KB`);
  console.log(`   Uploaded: ${blob.uploadedAt}`);
  console.log('');
});

// Now check which blob URLs are NOT in portfolio.js
const portfolioContent = readFileSync('./src/data/portfolio.js', 'utf-8');

console.log('\n--- BLOBS NOT FOUND IN PORTFOLIO.JS ---\n');
let missingCount = 0;
result.blobs.forEach((blob) => {
  if (!portfolioContent.includes(blob.url)) {
    missingCount++;
    console.log(`MISSING: ${blob.pathname}`);
    console.log(`  URL: ${blob.url}`);
    console.log(`  Size: ${(blob.size / 1024).toFixed(1)} KB`);
    console.log('');
  }
});

if (missingCount === 0) {
  console.log('All blob URLs are referenced in portfolio.js');
}

console.log(`\n--- SUMMARY ---`);
console.log(`Total blobs: ${result.blobs.length}`);
console.log(`Missing from portfolio.js: ${missingCount}`);
