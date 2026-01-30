#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load existing cards
const cardsData = JSON.parse(fs.readFileSync('cards-data.json', 'utf8'));

// Language mappings
const languageNames = {
  'de': 'German',
  'fr': 'French',
  'it': 'Italian',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'ru': 'Russian',
  'ko': 'Korean',
  'zh-TW': 'Chinese Traditional',
  'zh-CN': 'Chinese Simplified',
  'th': 'Thai',
  'id': 'Indonesian',
  'ja': 'Japanese'
};

const scytherNames = {
  'de': 'Sichlor',
  'fr': 'Insécateur',
  'it': 'Scyther',
  'es': 'Scyther',
  'pt': 'Scyther',
  'nl': 'Scyther',
  'ru': 'Сайтер',
  'ko': '스라크',
  'zh-TW': '飛天螳螂',
  'zh-CN': '飞天螳螂',
  'th': 'ไซเธอร์',
  'id': 'Scyther',
  'ja': 'ストライク'
};

// Set to language mapping based on LANGUAGE_COVERAGE.md
const setLanguages = {
  // Gen 1-2 Era
  'Jungle': ['de', 'fr', 'it', 'es', 'pt', 'nl', 'ru'],
  'Base Set 2': ['de', 'fr', 'it', 'es', 'nl'],
  'Gym Heroes': ['de', 'fr', 'it'],
  'Neo Discovery': ['de', 'fr', 'it'],
  'Neo Destiny': ['de', 'fr', 'it'],
  'Aquapolis': [], // English-only
  
  // EX Era
  'EX Ruby & Sapphire': ['de', 'fr', 'it', 'ja'],
  'EX Team Rocket Returns': ['de', 'fr', 'it', 'ja'],
  'EX FireRed & LeafGreen': ['de', 'fr', 'it', 'es'],
  'EX Unseen Forces': ['de', 'fr', 'it', 'es'],
  
  // Diamond & Pearl Era
  'Majestic Dawn': ['de', 'fr', 'it', 'es', 'pt'],
  'Stormfront': ['de', 'fr', 'it', 'es', 'pt'],
  'Platinum': ['de', 'fr', 'it', 'es'],
  'Undaunted': ['de', 'fr', 'it', 'es', 'pt'],
  
  // Black & White Era
  'Dark Explorers': ['de', 'fr', 'it', 'es', 'pt'],
  'Boundaries Crossed': ['de', 'fr', 'it', 'es', 'pt'],
  
  // XY / Sun & Moon Era
  'Celestial Storm': ['de', 'fr', 'it', 'es', 'pt', 'ko'],
  'Lost Thunder': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'zh-CN', 'th', 'id'],
  'Hidden Fates': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'th', 'id'],
  
  // Sword & Shield Era
  'Rebel Clash': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'zh-CN', 'th', 'id'],
  'Astral Radiance': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'zh-CN', 'th', 'id'],
  'Crown Zenith': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'th', 'id'],
  
  // Scarlet & Violet Era
  '151': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'zh-CN', 'th', 'id'],
  'Obsidian Flames': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'zh-CN', 'th', 'id'],
  'Paldean Fates': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'th', 'id'],
  'Temporal Forces': ['de', 'fr', 'it', 'es', 'pt', 'ko', 'zh-TW', 'zh-CN', 'th', 'id'],
  
  // Promos and special sets (regional only)
  'Wizards Black Star Promos': [],
  'My First Battle': [],
  'Start Deck 100 Battle Collection': [],
  'Shiny Treasure ex': []
};

// Special handling for Rocket's Scyther
const rocketsScytherNames = {
  'de': 'Rockets Sichlor',
  'fr': 'Insécateur de Rocket',
  'it': 'Scyther di Rocket',
  'es': 'Scyther de Rocket',
  'pt': 'Scyther de Rocket',
  'nl': 'Rocket\'s Scyther',
  'ja': 'ロケット団のストライク'
};

function generateInternationalVariants(baseCard) {
  const variants = [];
  const languages = setLanguages[baseCard.set] || [];
  
  // Determine if this is a Rocket's Scyther
  const isRockets = baseCard.name.includes('Rocket');
  const nameMap = isRockets ? rocketsScytherNames : scytherNames;
  
  for (const langCode of languages) {
    const variant = { ...baseCard };
    
    // Update name
    if (isRockets) {
      variant.name = nameMap[langCode] || `Rocket's Scyther (${languageNames[langCode]})`;
    } else if (baseCard.name === 'Scyther ex') {
      variant.name = `${nameMap[langCode]} ex`;
    } else {
      variant.name = nameMap[langCode] || 'Scyther';
    }
    
    // Update cardId with language suffix
    const baseId = baseCard.cardId.replace(/_en$/, '').replace(/_ja$/, '');
    variant.cardId = `${baseId}_${langCode}`;
    
    // Update language
    variant.language = languageNames[langCode];
    
    variants.push(variant);
  }
  
  return variants;
}

// Process all cards
const allCards = [];

console.log('Generating international variants...\n');

for (const card of cardsData.cards) {
  // Add original card
  allCards.push(card);
  
  // Generate international variants
  const variants = generateInternationalVariants(card);
  allCards.push(...variants);
  
  console.log(`${card.set} - ${card.cardNumber}: +${variants.length} variants (${card.language} → ${variants.length + 1} total)`);
}

// Sort cards by set year, then by card number, then by language
allCards.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  if (a.set !== b.set) return a.set.localeCompare(b.set);
  if (a.cardNumber !== b.cardNumber) return a.cardNumber.localeCompare(b.cardNumber);
  return (a.language || 'English').localeCompare(b.language || 'English');
});

// Write updated cards data
const updatedData = { cards: allCards };
fs.writeFileSync('cards-data.json', JSON.stringify(updatedData, null, 2));

console.log(`\n✅ Generated ${allCards.length} total cards (${cardsData.cards.length} original + ${allCards.length - cardsData.cards.length} international variants)`);
console.log(`📝 Updated cards-data.json`);

// Generate statistics
const languageStats = {};
allCards.forEach(card => {
  const lang = card.language || 'English';
  languageStats[lang] = (languageStats[lang] || 0) + 1;
});

console.log('\n📊 Cards by Language:');
Object.entries(languageStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([lang, count]) => {
    console.log(`   ${lang}: ${count}`);
  });
