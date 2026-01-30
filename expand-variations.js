#!/usr/bin/env node
/**
 * Scyther Cards - Variation Expansion Script v2
 * Transforms cards with variations array into separate card entries
 * Each unique variation becomes its own selectable card
 * Fixes: Error info only applies to error variants
 */

const fs = require('fs');
const path = require('path');

// Load current data - need to reload original
const dataPath = path.join(__dirname, 'cards-data.json');

// Bulbapedia source URLs for Scyther cards
const sourceUrls = {
  'jungle': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Jungle_10)',
  'base set 2': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Jungle_10)',
  'gym heroes': 'https://bulbapedia.bulbagarden.net/wiki/Rocket%27s_Scyther_(Gym_Heroes_13)',
  'neo discovery': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Neo_Discovery_46)',
  'neo destiny': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Neo_Destiny_55)',
  'wizards black star promos': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Wizards_Promo_45)',
  'aquapolis': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Aquapolis_57)',
  'ex ruby & sapphire': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_ex_(EX_Ruby_%26_Sapphire_102)',
  'ex firered & leafgreen': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(EX_FireRed_%26_LeafGreen_29)',
  'ex team rocket returns': 'https://bulbapedia.bulbagarden.net/wiki/Rocket%27s_Scyther_ex_(EX_Team_Rocket_Returns_102)',
  'ex unseen forces': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(EX_Unseen_Forces_46)',
  'majestic dawn': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Majestic_Dawn_46)',
  'stormfront': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Stormfront_49)',
  'platinum': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Jungle_10)',
  'undaunted': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Undaunted_36)',
  'dark explorers': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Dark_Explorers_4)',
  'boundaries crossed': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Boundaries_Crossed_7)',
  'celestial storm': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Celestial_Storm_4)',
  'lost thunder': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Lost_Thunder_3)',
  'hidden fates': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Hidden_Fates_5)',
  'rebel clash': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Rebel_Clash_4)',
  'astral radiance': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Astral_Radiance_4)',
  'crown zenith': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Crown_Zenith_6)',
  '151': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(151_123)',
  'obsidian flames': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Obsidian_Flames_4)',
  'paldean fates': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Obsidian_Flames_4)',
  'temporal forces': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Temporal_Forces_1)',
  'pokémon trading card game classic': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Jungle_10)',
  'my first battle': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(My_First_Battle)',
  'shiny treasure ex': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Obsidian_Flames_4)',
  'start deck 100 battle collection': 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Temporal_Forces_1)'
};

// Helper to generate unique ID for variation
function generateVariationId(baseId, variation, language) {
  const variationSlug = variation.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9-]/g, '');
  const langSuffix = language !== 'English' ? `_${language.toLowerCase().substring(0,2)}` : '';
  return `${baseId}_${variationSlug}${langSuffix}`;
}

// Helper to get source URL
function getSourceUrl(set) {
  const setLower = set.toLowerCase();
  return sourceUrls[setLower] || 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(TCG)';
}

// Helper to determine if this is an error variant
function isErrorVariant(variation) {
  const errorVariants = [
    'no symbol error',
    'error',
    'misprint',
    'holo bleed',
    'registration shift',
    'crimped',
    'ink',
    'yellow shift'
  ];
  return errorVariants.some(e => variation.toLowerCase().includes(e));
}

// Read and parse the data
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error('Error reading cards-data.json:', e.message);
  process.exit(1);
}

// Process cards and expand variations
const expandedCards = [];

for (const card of data.cards) {
  // Get the variations array
  let variations = card.variations || [card.variant || 'Standard'];
  
  // Normalize variations array
  if (typeof variations === 'string') variations = [variations];
  
  // Skip cards that are already expanded (have variant but no variations array)
  if (card.variant && !card.variations) {
    const newCard = {
      ...card,
      sourceUrl: getSourceUrl(card.set)
    };
    
    // Only keep error info for actual error variants
    if (!isErrorVariant(card.variant)) {
      delete newCard.hasError;
      delete newCard.errorInfo;
    }
    
    expandedCards.push(newCard);
    continue;
  }
  
  // Expand variations into separate entries
  for (const variation of variations) {
    const newCard = {
      ...card,
      cardId: generateVariationId(card.cardId, variation, card.language),
      variant: variation,
      sourceUrl: getSourceUrl(card.set)
    };
    
    // Remove variations array since this is now a single entry
    delete newCard.variations;
    
    // Only keep error info for actual error variants
    if (!isErrorVariant(variation)) {
      delete newCard.hasError;
      delete newCard.errorInfo;
    }
    
    // Update rarity based on variation
    if (variation === '1st Edition') {
      newCard.rarity = card.rarity.includes('1st') ? card.rarity : `${card.rarity} (1st Edition)`;
    } else if (variation === 'Reverse Holo') {
      newCard.rarity = 'Rare Holo (Reverse)';
    } else if (isErrorVariant(variation)) {
      newCard.rarity = 'Error Print';
    }
    
    expandedCards.push(newCard);
  }
}

// Collect all unique variation types for metadata
const allVariations = [...new Set(expandedCards.map(c => c.variant).filter(Boolean))].sort();

// Build final data structure
const finalData = {
  cards: expandedCards,
  metadata: {
    enhancedAt: new Date().toISOString(),
    version: '3.0.0',
    totalCards: expandedCards.length,
    features: [
      'Each variation is a separate entry',
      'Bulbapedia source URLs for each card',
      '1st Edition / Unlimited / Reverse Holo tracked separately',
      'Error cards documented with sources',
      'Multi-language support'
    ],
    variationTypes: allVariations
  }
};

// Write output
fs.writeFileSync(dataPath, JSON.stringify(finalData, null, 2));

console.log(`✅ Expanded variations complete!`);
console.log(`   Original cards: ${data.cards.length}`);
console.log(`   Expanded cards: ${expandedCards.length}`);
console.log(`   Variation types found: ${allVariations.length}`);
console.log(`   Variations: ${allVariations.join(', ')}`);
