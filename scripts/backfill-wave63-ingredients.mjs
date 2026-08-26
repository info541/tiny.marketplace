/**
 * Drop leftover merch from wave63 and backfill missing ingredients from product pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "data/catalog-products-raw.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const WAVE_START = 1249;
const WAVE_END = 1253;

const EXTRA_DROP =
  /\b(gift card|gift certificate|pulse point|protocol|barrier repair|beauty bundle|tinted tallow makeup|cheek tint|cheek balm|being cheeky|just glow|sample|4 pack|tinted lip|nude lip|pink lip|bronze lip|art print|chocolate|trio|mushroom essence|e-gift)\b/i;

function isWave(p) {
  const n = Number(String(p.brandId).replace(/^c/, ""));
  return n >= WAVE_START && n <= WAVE_END;
}

function stripHtml(html) {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseList(chunk) {
  if (!chunk) return [];
  const cleaned = chunk.replace(/\s+/g, " ").replace(/\*\*/g, "").trim();
  const parts = cleaned
    .split(/\s*(?:,|;|•|·|\n|(?:(?<=[a-z\)])\.(?=\s+[A-Z])))\s*/)
    .map((s) => s.trim().replace(/^[-–•*]\s*/, "").replace(/\.$/, ""))
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 160 &&
        !/^(and|or|with|contains|including|ingredients?|directions?|how to|warning|free from|what'?s not)$/i.test(s) &&
        !/^https?:/i.test(s),
    );
  return [...new Set(parts)].slice(0, 80);
}

function looksLikeMarketing(raw) {
  return /\b(how to (use|apply)|directions?|why (we|our|tallow)|add to cart|subscription|if you haven'?t tried|love & gratitude|i absolutely love|shipping|refund|free from|ours doesn'?t|four actives|sports.activity|smoothie|salad dressing|specimen plates|tsa-friendly|sixteen ingredients|fruiting body vs|best for:|gym bags)\b/i.test(
    raw || "",
  );
}

function looksLikeInci(parts, raw) {
  if (!parts.length || looksLikeMarketing(raw)) return false;
  if (parts.length > 24) return false;
  if (parts.length >= 5) return true;
  if (parts.length >= 3 && /water|aqua|glycerin|sodium|acid|extract|oil|oxide|protein|vitamin|tallow|wax|butter|zinc|salt|magnesium|potassium/i.test(raw)) {
    return true;
  }
  if (parts.length >= 2 && /tallow|oil|wax|butter|zinc|beeswax|whey|salt/i.test(raw) && /,/.test(raw)) return true;
  return parts.length >= 4;
}

function extractNamedSpans(html) {
  const names = [...html.matchAll(/class="[^"]*ingredients__name[^"]*"[^>]*>([^<]+)/gi)].map((m) =>
    m[1]
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .trim(),
  );
  return [...new Set(names.filter((s) => s.length > 1 && s.length < 80))];
}

function extractIngredients(html) {
  if (!html) return [];
  const named = extractNamedSpans(html);
  if (named.length >= 8) return named;
  const text = stripHtml(html);
  const markers = [
    /inactive ingredients?:\s*([^\n]{12,1500})/i,
    /(?:full\s+)?ingredients?\s*[:\-–]\s*([^\n]{12,1500})/i,
    /inci(?:\s+list)?\s*[:\-–]\s*([^\n]{12,1500})/i,
    /what(?:’|'|s)?s inside\s*[:\-–]?\s*([^\n]{12,1500})/i,
    /(?:other ingredients?|supplement facts)[:\s]+([\s\S]{12,900}?)(?:directions|suggested use|warning|$)/i,
  ];
  let best = [];
  for (const re of markers) {
    const m = text.match(re);
    if (!m) continue;
    const raw = m[1].trim();
    if (looksLikeMarketing(raw)) continue;
    const parts = parseList(raw);
    if (looksLikeInci(parts, raw) && parts.length >= best.length) best = parts;
  }
  if (best.length) return best;
  const inci = text.match(
    /\b(?:Aqua|Water|Eau|Tallow|Goat Whey)\b[^.]{0,40}(?:,\s*[A-Za-z0-9][^,]{1,100}){3,60}/i,
  );
  if (inci) {
    const parts = parseList(inci[0]);
    if (parts.length >= 3) return parts;
  }
  return [];
}

function reclassify(p) {
  const t = p.name.toLowerCase();
  const n = Number(String(p.brandId).replace(/^c/, ""));
  if (n === 1249) p.category = "oral";
  if (n === 1250) p.category = /\bdeodorant\b/.test(t) ? "deodorant" : "skincare";
  if (n === 1251) {
    if (/\b(sun tallow|signature sun|mineral tallow|zinc)\b/.test(t)) p.category = "sunscreen";
    else if (/\b(shampoo|scalp|hair|3-in-1|3 in 1)\b/.test(t)) p.category = "hair";
    else p.category = "skincare";
  }
  if (n === 1252) p.category = "electrolytes";
  if (n === 1253) p.category = "supplements";
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.text();
  } catch {
    return execFileSync("curl", ["-sS", "-L", "-A", UA, "--max-time", "20", url], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
  }
}

async function main() {
  const all = JSON.parse(fs.readFileSync(outJson, "utf8"));
  const kept = [];
  let dropped = 0;
  for (const p of all) {
    if (!isWave(p)) {
      kept.push(p);
      continue;
    }
    if (EXTRA_DROP.test(p.name)) {
      dropped += 1;
      continue;
    }
    reclassify(p);
    kept.push(p);
  }

  const wave = kept.filter(isWave);
  let filled = 0;
  for (const p of wave) {
    if (p.ingredients?.length) continue;
    if (!p.affiliateUrl) continue;
    try {
      const html = await fetchPage(p.affiliateUrl);
      const parts = extractIngredients(html);
      if (parts.length && !looksLikeMarketing(parts.join(" | "))) {
        p.ingredients = parts;
        filled += 1;
        console.log("inci", p.slug, parts.length);
      } else {
        console.log("none", p.slug);
      }
    } catch (e) {
      console.log("err", p.slug, e.message || e);
    }
  }

  for (const p of wave) {
    if (p.ingredients?.length && looksLikeMarketing(p.ingredients.join(" | "))) {
      p.ingredients = [];
    }
  }

  fs.writeFileSync(outJson, JSON.stringify(kept, null, 2));
  const withIng = wave.filter((p) => p.ingredients?.length).length;
  const report = {
    generatedAt: new Date().toISOString(),
    dropped,
    filled,
    waveProducts: wave.length,
    withIngredients: withIng,
  };
  fs.writeFileSync(path.join(root, "data/wave63-ingredients-backfill.json"), JSON.stringify(report, null, 2));
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
