#!/usr/bin/env node

/**
 * Scyther Cards Enhancement Script
 * 
 * This script enhances the cards-data.json with:
 * 1. Proper card image URLs from pokemontcg.io
 * 2. Variations array (1st Edition, Unlimited, Reverse Holo, etc.)
 * 3. Official set codes from Bulbapedia
 * 4. Source links for error cards
 */

const fs = require('fs');
const path = require('path');

// Set code mapping (Bulbapedia official)
const SET_CODES = {
  'Jungle': 'JU',
  'Base Set 2': 'B2',
  'Neo Discovery': 'N2',
  'Neo Destiny': 'N4',
  'Wizards Black Star Promos': 'WP',
  'Aquapolis': 'AQ',
  'EX Ruby & Sapphire': 'RS',
  'EX FireRed & LeafGreen': 'RG',
  'EX Team Rocket Returns': 'TRR',
  'EX Unseen Forces': 'UF',
  'Gym Heroes': 'G1',
  'Majestic Dawn': 'MD',
  'Stormfront': 'SF',
  'Platinum': 'PL',
  'Undaunted': 'UD',
  'Dark Explorers': 'DEX',
  'Boundaries Crossed': 'BCR',
  'Celestial Storm': 'CES',
  'Hidden Fates': 'HIF',
  'Lost Thunder': 'LOT',
  'Rebel Clash': 'RCL',
  'Astral Radiance': 'ASR',
  'Crown Zenith': 'CRZ',
  'Obsidian Flames': 'OBF',
  'Paldean Fates': 'PAF',
  '151': 'MEW',
  'Temporal Forces': 'TEF',
  'Shiny Treasure ex': 'SV4a',  // Japanese set
  'My First Battle': 'MFB',
  'Start Deck 100 Battle Collection': 'S100'
};

// pokemontcg.io set ID mapping
const TCGIO_SET_IDS = {
  'Jungle': 'jungle',
  'Base Set 2': 'base2',
  'Neo Discovery': 'neo2',
  'Neo Destiny': 'neo4',
  'Wizards Black Star Promos': 'basep',
  'Aquapolis': 'ecard2',
  'EX Ruby & Sapphire': 'ex1',
  'EX FireRed & LeafGreen': 'ex5',
  'EX Team Rocket Returns': 'ex6',
  'EX Unseen Forces': 'ex9',
  'Gym Heroes': 'gym1',
  'Majestic Dawn': 'dp5',
  'Stormfront': 'dp7',
  'Platinum': 'pl1',
  'Undaunted': 'hgss3',
  'Dark Explorers': 'bw5',
  'Boundaries Crossed': 'bw7',
  'Celestial Storm': 'sm7',
  'Hidden Fates': 'sm115',
  'Lost Thunder': 'sm8',
  'Rebel Clash': 'swsh2',
  'Astral Radiance': 'swsh10',
  'Crown Zenith': 'swsh12pt5',
  'Obsidian Flames': 'sv3',
  'Paldean Fates': 'sv4pt5',
  '151': 'sv3pt5',
  'Temporal Forces': 'sv5',
  'Shiny Treasure ex': null,  // Japanese only
  'My First Battle': null,
  'Start Deck 100 Battle Collection': null
};

// Card number to image ID mapping (some sets need special handling)
const CARD_NUMBER_MAP = {
  // Jungle Scyther cards
  'jungle-10/64': '10',
  'jungle-26/64': '26',
  // Base Set 2
  'base2-17/130': '17',
  // Neo Discovery
  'neo2-46/75': '46',
  // Neo Destiny
  'neo4-55/105': '55',
  // Wizards Promo
  'basep-45': '45',
  // Aquapolis
  'ecard2-57/147': '57',
  'ecard2-106/147': '106',
  // EX Ruby & Sapphire (Scyther ex)
  'ex1-102/109': '102',
  // EX FireRed & LeafGreen
  'ex5-29/112': '29',
  // EX Team Rocket Returns (Rocket's Scyther ex)
  'ex6-102/109': '102',
  // EX Unseen Forces
  'ex9-46/115': '46',
  // Gym Heroes (Rocket's Scyther)
  'gym1-13/132': '13',
  // Majestic Dawn
  'dp5-46/100': '46',
  // Stormfront
  'dp7-49/100': '49',
  // Platinum (Secret Rare)
  'pl1-130/127': '130',
  // Undaunted
  'hgss3-36/90': '36',
  'hgss3-65/90': '65',
  // Dark Explorers
  'bw5-4/108': '4',
  // Boundaries Crossed
  'bw7-7/149': '7',
  // Celestial Storm
  'sm7-4/168': '4',
  // Hidden Fates
  'sm115-5/68': '5',
  'sm115-SV1/SV94': 'SV1',
  // Lost Thunder
  'sm8-3/214': '3',
  // Rebel Clash
  'swsh2-4/192': '4',
  // Astral Radiance
  'swsh10-4/189': '4',
  'swsh10-5/189': '5',
  // Crown Zenith
  'swsh12pt5-6/159': '6',
  // Obsidian Flames
  'sv3-4/197': '4',
  // Paldean Fates
  'sv4pt5-95/091': '95',
  // 151
  'sv3pt5-123/165': '123',
  // Temporal Forces
  'sv5-1/162': '1'
};

// Variations by set
const VARIATIONS_BY_SET = {
  'Jungle': {
    '10/64': ['1st Edition', 'Unlimited', 'No Symbol Error (Unlimited)'],
    '26/64': ['1st Edition', 'Unlimited']
  },
  'Base Set 2': {
    '17/130': ['Standard']  // No 1st Edition for Base Set 2
  },
  'Neo Discovery': {
    '46/75': ['1st Edition', 'Unlimited']
  },
  'Neo Destiny': {
    '55/105': ['1st Edition', 'Unlimited']
  },
  'Wizards Black Star Promos': {
    '45': ['Standard']
  },
  'Aquapolis': {
    '57/147': ['1st Edition', 'Unlimited', 'Reverse Holo'],
    '106/147': ['1st Edition', 'Unlimited', 'Reverse Holo']
  },
  'EX Ruby & Sapphire': {
    '102/109': ['Standard', 'Reverse Holo']
  },
  'EX FireRed & LeafGreen': {
    '29/112': ['Standard', 'Reverse Holo']
  },
  'EX Team Rocket Returns': {
    '102/109': ['Standard', 'Reverse Holo']
  },
  'EX Unseen Forces': {
    '46/115': ['Standard', 'Reverse Holo']
  },
  'Gym Heroes': {
    '13/132': ['1st Edition', 'Unlimited']
  },
  'Majestic Dawn': {
    '46/100': ['Standard', 'Reverse Holo']
  },
  'Stormfront': {
    '49/100': ['Standard', 'Reverse Holo']
  },
  'Platinum': {
    '130/127': ['Standard']  // Secret Rare reprint
  },
  'Undaunted': {
    '36/90': ['Standard', 'Reverse Holo'],
    '65/90': ['Standard', 'Reverse Holo']
  },
  'Dark Explorers': {
    '4/108': ['Standard', 'Reverse Holo']
  },
  'Boundaries Crossed': {
    '7/149': ['Standard', 'Reverse Holo']
  },
  'Celestial Storm': {
    '4/168': ['Standard', 'Reverse Holo']
  },
  'Hidden Fates': {
    '5/68': ['Standard'],
    'SV1/SV94': ['Shiny']  // Shiny Vault
  },
  'Lost Thunder': {
    '3/214': ['Standard', 'Reverse Holo']
  },
  'Rebel Clash': {
    '004/192': ['Standard', 'Reverse Holo'],
    '4/192': ['Standard', 'Reverse Holo']
  },
  'Astral Radiance': {
    '004/189': ['Standard', 'Reverse Holo'],
    '4/189': ['Standard', 'Reverse Holo'],
    '005/189': ['Standard', 'Reverse Holo'],
    '5/189': ['Standard', 'Reverse Holo']
  },
  'Crown Zenith': {
    '006/159': ['Standard', 'Reverse Holo'],
    '6/159': ['Standard', 'Reverse Holo']
  },
  'Obsidian Flames': {
    '004/197': ['Standard', 'Reverse Holo'],
    '4/197': ['Standard', 'Reverse Holo']
  },
  'Paldean Fates': {
    '095/091': ['Shiny Rare'],
    '95/091': ['Shiny Rare']
  },
  '151': {
    '123/165': ['Standard', 'Reverse Holo', 'Illustration Rare', 'Special Art Rare']
  },
  'Temporal Forces': {
    '001/162': ['Standard', 'Reverse Holo'],
    '1/162': ['Standard', 'Reverse Holo']
  },
  'Shiny Treasure ex': {
    '194/190': ['Shiny Rare']
  },
  'My First Battle': {
    'Unknown': ['Standard']
  },
  'Start Deck 100 Battle Collection': {
    '015/742': ['Standard']
  }
};

// Error cards and source links
const ERROR_CARDS = {
  'jungle-10/64': {
    hasError: true,
    errorName: 'No Symbol Error',
    errorDescription: 'Early Unlimited prints were printed without the Jungle set symbol. This was corrected later in the print run.',
    sources: [
      {
        name: 'Bulbapedia - Scyther (Jungle 10)',
        url: 'https://bulbapedia.bulbagarden.net/wiki/Scyther_(Jungle_10)',
        type: 'official'
      },
      {
        name: 'Bulbapedia - Error Cards',
        url: 'https://bulbapedia.bulbagarden.net/wiki/Error_cards#Jungle',
        type: 'official'
      }
    ]
  }
};

function getImageUrl(set, cardNumber, language) {
  const setId = TCGIO_SET_IDS[set];
  if (!setId) {
    // Fallback to generic artwork for Japanese-only sets
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png';
  }
  
  // Normalize card number
  let normalizedNumber = cardNumber.replace(/^0+/, '').split('/')[0];
  
  // Check for special mappings
  const mapKey = `${setId}-${cardNumber}`;
  if (CARD_NUMBER_MAP[mapKey]) {
    normalizedNumber = CARD_NUMBER_MAP[mapKey];
  }
  
  return `https://images.pokemontcg.io/${setId}/${normalizedNumber}_hires.png`;
}

function getVariations(set, cardNumber) {
  const setVariations = VARIATIONS_BY_SET[set];
  if (!setVariations) {
    return ['Standard'];
  }
  
  // Try exact match first
  if (setVariations[cardNumber]) {
    return setVariations[cardNumber];
  }
  
  // Try without leading zeros
  const normalizedNumber = cardNumber.replace(/^0+/, '');
  if (setVariations[normalizedNumber]) {
    return setVariations[normalizedNumber];
  }
  
  return ['Standard'];
}

function getErrorInfo(set, cardNumber) {
  const setId = TCGIO_SET_IDS[set] || set.toLowerCase().replace(/\s+/g, '-');
  const key = `${setId}-${cardNumber}`;
  return ERROR_CARDS[key] || null;
}

function enhanceCard(card) {
  const enhanced = { ...card };
  
  // Update set code
  if (SET_CODES[card.set]) {
    enhanced.setCode = SET_CODES[card.set];
  }
  
  // Update image URL (only for English cards to avoid duplicating images)
  if (card.language === 'English' || !card.language) {
    enhanced.image = getImageUrl(card.set, card.cardNumber, card.language);
  } else {
    // For non-English, try to find language-specific image or fall back
    // Most APIs only have English images, so we use the same
    enhanced.image = getImageUrl(card.set, card.cardNumber, 'English');
  }
  
  // Add variations
  enhanced.variations = getVariations(card.set, card.cardNumber);
  
  // Add error info if applicable
  const errorInfo = getErrorInfo(card.set, card.cardNumber);
  if (errorInfo) {
    enhanced.hasError = true;
    enhanced.errorInfo = {
      name: errorInfo.errorName,
      description: errorInfo.errorDescription,
      sources: errorInfo.sources
    };
  }
  
  return enhanced;
}

function main() {
  const inputPath = path.join(__dirname, 'cards-data.json');
  const outputPath = path.join(__dirname, 'cards-data-enhanced.json');
  
  console.log('Reading cards data...');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  console.log(`Processing ${data.cards.length} cards...`);
  
  const enhancedCards = data.cards.map(enhanceCard);
  
  const enhancedData = {
    ...data,
    cards: enhancedCards,
    metadata: {
      ...data.metadata,
      enhancedAt: new Date().toISOString(),
      version: '2.0.0',
      features: [
        'Official Bulbapedia set codes',
        'Card-specific images from pokemontcg.io',
        'Variation tracking (1st Edition, Unlimited, Reverse Holo, etc.)',
        'Error card documentation with source links'
      ]
    }
  };
  
  console.log('Writing enhanced data...');
  fs.writeFileSync(outputPath, JSON.stringify(enhancedData, null, 2));
  
  console.log(`Done! Enhanced ${enhancedCards.length} cards.`);
  console.log(`Output written to: ${outputPath}`);
  
  // Statistics
  const cardsWithErrors = enhancedCards.filter(c => c.hasError).length;
  const uniqueSets = [...new Set(enhancedCards.map(c => c.set))];
  const uniqueVariations = [...new Set(enhancedCards.flatMap(c => c.variations || []))];
  
  console.log('\nStatistics:');
  console.log(`  Total cards: ${enhancedCards.length}`);
  console.log(`  Unique sets: ${uniqueSets.length}`);
  console.log(`  Cards with errors: ${cardsWithErrors}`);
  console.log(`  Variation types: ${uniqueVariations.join(', ')}`);
}

main();
