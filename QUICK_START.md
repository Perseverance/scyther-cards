# Quick Start Guide - Scyther Card Database

## 🚀 Getting Started

### Option 1: Open Directly in Browser

1. Navigate to the website directory:
   ```
   /home/george/clawd/canvas/scyther-cards/
   ```

2. Open `index.html` in your web browser:
   - Double-click `index.html`
   - Or drag `index.html` into a browser window
   - Or right-click and select "Open with" → Your browser

3. The interactive database will load with all 35 Scyther cards!

### Option 2: Serve via Local Web Server

For better file access, run a local server:

```bash
# Using Python 3
cd /home/george/clawd/canvas/scyther-cards/
python -m http.server 8000

# Then open: http://localhost:8000
```

```bash
# Using Node.js (http-server)
npm install -g http-server
cd /home/george/clawd/canvas/scyther-cards/
http-server

# Then open: http://localhost:8080
```

## 📊 What's Included

| File | Purpose |
|------|---------|
| `index.html` | Interactive database interface |
| `cards-data.json` | Complete card database (JSON format) |
| `scyther-cards-export.csv` | Card data in spreadsheet format |
| `README.md` | Comprehensive documentation |
| `METHODOLOGY.md` | Research process & scalability analysis |
| `QUICK_START.md` | This file |

## 🎯 Key Features

### Search & Filter
- **Search Box**: Find cards by name, set, or card number
- **Language Filter**: View English or Japanese cards
- **Year Filter**: Browse by release year (1999-2024)
- **Rarity Filter**: Show specific rarity levels

### View Modes
- **Grid View**: Visual card layout organized by language/year
- **Table View**: Comprehensive spreadsheet with all details

### Statistics
- Total unique cards: 35
- Sets represented: 20+
- Languages: English, Japanese
- Years covered: 1999-2024 (25 years)

## 💡 Usage Examples

### Find All Secret Rare Cards
1. Click "Rarity" filter → Select "Secret Rare"
2. Results: 1 card (Platinum #130/127)

### See All 1999 Releases
1. Click "Year" filter → Select "1999"
2. Results: Jungle expansion cards

### Compare Japanese vs. English
1. Click "Language" filter → Select "Japanese"
2. See Japanese-exclusive cards and variations
3. Switch back to "English" to compare

### Search for Specific Card
1. Type "base set" in search box
2. Instant results for any Base Set cards
3. Try: "holo", "rare", "ex", "team rocket"

### Export for Spreadsheet
1. Save `scyther-cards-export.csv` locally
2. Open in Excel, Google Sheets, or Numbers
3. Sort, filter, and customize as needed

## 📱 Mobile Usage

The database is fully responsive:
- Works on smartphones and tablets
- Touch-optimized controls
- Readable on all screen sizes
- Grid adapts to device width

## 🔍 Understanding the Data

### Card Information

Each card entry includes:
- **Name**: Pokémon name (with variants like "ex" or "Rocket's")
- **Set**: Expansion name and code
- **Card Number**: Position in set (e.g., "10/64")
- **Rarity**: Common, Uncommon, Rare, Holo, Secret Rare, Shiny Rare, Promo
- **Year**: First release year
- **Language**: English or Japanese
- **Variant**: Special variant type (Holofoil, EX, Team Rocket, etc.)
- **Artist**: Card artist (when available)
- **Notes**: Additional context

### Rarity Explanation

| Rarity | Color | Meaning |
|--------|-------|---------|
| Common | Blue | Most common, usually in set |
| Uncommon | Blue | Moderately rare |
| Rare | Yellow | Less common |
| Rare Holo | Red | Rare with holographic pattern |
| Rare Holo ex | Red | Highest tier, EX variant |
| Secret Rare | Purple | Numbered beyond set limit |
| Shiny Rare | Indigo | Alternate art/color variant |
| Promo | Green | Special promotional card |

## 📈 Statistics Dashboard

The header shows real-time statistics:

- **Total Cards**: Number of cards in current view
- **Sets**: How many different expansions
- **Languages**: English, Japanese, or both
- **Years Span**: Number of years covered

Updates instantly as you filter!

## 🎴 Card Database Structure

### By Year
- **1999**: Jungle debut (2 variants)
- **2000-2001**: Base Set 2, Neo era, Aquapolis
- **2003-2010**: EX Series through Undaunted
- **2012-2019**: Modern era begins, secret rares introduced
- **2020-2024**: Scarlet & Violet era

### By Rarity
- **Common**: 10 cards (newest/most available)
- **Uncommon**: 10 cards (various sets)
- **Rare**: 2 cards (special formats)
- **Rare Holographic**: 5 cards (classic era)
- **Secret Rare**: 1 card (Platinum)
- **Shiny Rare**: 2 cards (modern special variants)
- **Promo**: 2 cards (special releases)
- **EX Variants**: 2 cards (Pokémon-ex type)

### By Language
- **English**: Primary Western releases (30+ cards)
- **Japanese**: Japanese-specific and dual releases

## 🔄 Export Options

### As JSON
```bash
# Copy the data from cards-data.json
# Import to Node.js, Python, or any JSON-compatible system
```

### As CSV
```bash
# Open scyther-cards-export.csv in:
# - Excel
# - Google Sheets
# - LibreOffice Calc
# - Any database import tool
```

### As Markdown
```bash
# Use README.md for:
# - Detailed card descriptions
# - Timeline view
# - Set-by-set breakdown
# - Special notes about variants
```

## ❓ Frequently Asked Questions

### Q: Why are some cards labeled "Reprint"?
A: These are the same card design released in a different set later. For example, the Jungle Scyther was reprinted in Base Set 2.

### Q: What's the difference between "Holofoil" and "Non-Holofoil"?
A: Holofoil cards have a reflective holographic pattern. Non-Holofoil cards have no holographic effect.

### Q: What does "Secret Rare" mean?
A: A card numbered beyond the main set (e.g., #130 in a 127-card set). Usually rare and valuable.

### Q: Are there shiny Scyther cards?
A: Yes! Hidden Fates and Paldean Fates include Shiny Rare variants with alternate coloring.

### Q: How many Scyther cards are there total?
A: 35 unique card entries across all variants, languages, and print types.

### Q: Can I use this data for my own project?
A: Yes! The JSON and CSV files are yours to use. Data is sourced from Bulbapedia (Creative Commons).

## 🔧 Technical Details

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### File Sizes
- `index.html`: 23 KB (includes all CSS and JavaScript)
- `cards-data.json`: 19 KB (all card data)
- `scyther-cards-export.csv`: 5 KB (spreadsheet format)

### Performance
- Page load: <1 second
- Filter response: Instant (<100ms)
- Search response: Instant (<100ms)

## 📚 Full Documentation

For detailed information, see:

- **README.md** - Complete card catalog with descriptions
- **METHODOLOGY.md** - How the data was collected and organized
- **cards-data.json** - Raw data in JSON format
- **scyther-cards-export.csv** - Tabular data format

## 🎯 Next Steps

1. ✅ Open `index.html` in your browser
2. ✅ Explore the different view modes
3. ✅ Try the search and filter functions
4. ✅ Check out the statistics
5. ✅ Export data for your own use
6. ✅ Read README.md for detailed card info

## 📧 Support

### For more information:
- Check the README.md for detailed card descriptions
- Review METHODOLOGY.md for research details
- Examine cards-data.json for complete data structure

### To add more Pokémon:
This same methodology can be applied to any Pokémon:
1. Visit Bulbapedia's Pokémon (TCG) page
2. Extract card data following the same format
3. Create similar JSON and HTML files
4. Deploy alongside Scyther database

---

**Happy collecting! 🎴✨**

Enjoy browsing the complete Scyther card database!
