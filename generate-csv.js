#!/usr/bin/env node

const fs = require('fs');

// Load cards data
const cardsData = JSON.parse(fs.readFileSync('cards-data.json', 'utf8'));

// CSV header
const headers = [
  'Name',
  'Card ID',
  'Set',
  'Set Code',
  'Card Number',
  'Type',
  'Rarity',
  'Year',
  'Language',
  'Variant',
  'Artist',
  'Japanese Expansion',
  'Japanese Card Number',
  'Notes'
];

// Escape CSV field
function escapeCSV(field) {
  if (field === undefined || field === null) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Generate CSV rows
const rows = [headers.join(',')];

for (const card of cardsData.cards) {
  const row = [
    escapeCSV(card.name),
    escapeCSV(card.cardId),
    escapeCSV(card.set),
    escapeCSV(card.setCode),
    escapeCSV(card.cardNumber),
    escapeCSV(card.type),
    escapeCSV(card.rarity),
    escapeCSV(card.year),
    escapeCSV(card.language),
    escapeCSV(card.variant),
    escapeCSV(card.artist),
    escapeCSV(card.japaneseExpansion),
    escapeCSV(card.japaneseCardNumber),
    escapeCSV(card.notes)
  ];
  rows.push(row.join(','));
}

// Write CSV file
const csv = rows.join('\n');
fs.writeFileSync('scyther-cards.csv', csv);

console.log(`✅ Generated scyther-cards.csv with ${cardsData.cards.length} cards`);
