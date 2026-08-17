import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Vibrant } from 'node-vibrant/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BG_DIR = path.join(__dirname, '../public/bg');
const OUTPUT_FILE = path.join(__dirname, '../lib/themes.ts');

function formatName(filename) {
  let name = filename.replace(/\.[^/.]+$/, "");
  name = name.replace(/[_-]/g, " ");
  name = name.trim();
  name = name.replace(/\b\w/g, (char) => char.toUpperCase());
  return name;
}

function generateId(filename) {
  let name = filename.replace(/\.[^/.]+$/, "");
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  console.log('Scanning public/bg for images and videos...');
  
  if (!fs.existsSync(BG_DIR)) {
    console.error('Directory public/bg does not exist.');
    process.exit(1);
  }

  const files = fs.readdirSync(BG_DIR).filter(f => /\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(f));
  
  if (files.length === 0) {
    console.error('No themes found in public/bg.');
    process.exit(1);
  }

  console.log(`Found ${files.length} files. Analyzing...`);

  const themes = [];

  for (const file of files) {
    const isVideo = /\.(mp4|webm)$/i.test(file);
    const imagePath = path.join(BG_DIR, file);
    
    let accent = '#666666'; // Default for video or fallback
    
    if (!isVideo) {
      try {
        const palette = await Vibrant.from(imagePath).getPalette();
        const swatch = palette.Vibrant || palette.DarkVibrant || palette.LightVibrant || palette.Muted;
        accent = swatch && swatch.hex ? swatch.hex : (swatch && swatch.getHex ? swatch.getHex() : '#ffffff');
      } catch (err) {
        console.error(`Failed to process color for ${file}:`, err);
      }
    }
    
    const bgPath = `/bg/${file}`;
    
    themes.push({
      id: generateId(file),
      name: formatName(file),
      type: isVideo ? 'video' : 'image',
      category: isVideo ? 'Cinematic Loops' : 'Nostalgic Stills',
      bgWide: bgPath,
      bgTall: bgPath,
      accent: accent,
      fallback: '#0d1117',
    });
    console.log(`✓ Processed ${file} -> Type: ${isVideo ? 'video' : 'image'}, Accent: ${accent}`);
  }

  console.log(`Generating ${OUTPUT_FILE}...`);

  // Group by category
  const categories = {};
  for (const t of themes) {
    if (!categories[t.category]) categories[t.category] = [];
    categories[t.category].push(t);
  }

  const themeCategoriesArr = Object.keys(categories).map(cat => ({
    name: cat,
    themes: categories[cat]
  }));

  const fileContent = `// AUTO-GENERATED FILE
// Do not edit manually. Run \`npm run generate-themes\` to update.

export type Theme = {
  id: string;
  name: string;
  type: 'image' | 'video';
  category: string;
  bgWide: string;
  bgTall: string;
  accent: string;
  fallback: string;
};

export type ThemeCategory = {
  name: string;
  themes: Theme[];
};

export const themes: Theme[] = ${JSON.stringify(themes, null, 2)};

export const themeCategories: ThemeCategory[] = ${JSON.stringify(themeCategoriesArr, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
  console.log('Done! Generated lib/themes.ts successfully.');
}

main().catch(console.error);
