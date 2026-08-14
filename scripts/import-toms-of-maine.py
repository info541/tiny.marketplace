#!/usr/bin/env python3
"""Parse Tom's of Maine Thunderbit scrape + PDP ingredients into catalog files."""

from __future__ import annotations

import html as html_lib
import json
import os
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path("/Users/Apps/tiny.marketplace")
THUNDERBIT = ROOT / "data/toms-of-maine.thunderbit.json"
OUT_PARSED = ROOT / "scripts/toms-of-maine-parsed.json"
SQL_DIR = ROOT / "scripts/toms-sql"
MIGRATION = ROOT / "supabase/migrations/20260814210000_toms_of_maine.sql"
DATA_FRAGMENT = ROOT / "scripts/toms-of-maine-data-fragment.ts"

BRAND_ID = "b9"
BRAND_UUID = "00000000-0000-0000-0000-000000000004"
ACCENT = "#2D6A4F"
PLACED_BY = "catoegy"
UA = "Mozilla/5.0 (compatible; tiny-marketplace/1.0)"

BRAND = {
    "id": BRAND_ID,
    "slug": "toms-of-maine",
    "name": "Tom's of Maine",
    "tagline": "Naturally sourced oral care since 1970",
    "story": "Kennebunk-born natural toothpaste and everyday care — fluoride and fluoride-free formulas without artificial flavors, dyes, or animal testing, made so you can choose what goes in (and what stays out).",
    "location": "Kennebunk, Maine",
    "founded": 1970,
    "categories": ["oral", "deodorant", "skincare"],
    "accent": ACCENT,
    "rating": 4.7,
    "reviewCount": 0,
    "followerCount": 0,
    "website": "https://www.tomsofmaine.com",
}

FLUORIDE_ING = re.compile(
    r"fluoride|monofluorophosphate", re.I
)
SKIP_FEATURE = re.compile(
    r"^(what's inside|includes one|regular price|4 oz|what's included)\b",
    re.I,
)


def slugify(name: str) -> str:
    s = name.lower().replace("'", "").replace("'", "").replace("&", " and ")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def first_image(raw: str) -> str:
    if not raw:
        return ""
    return raw.split("\n")[0].strip()


def strip_html(text: str) -> str:
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = html_lib.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def first_paragraph(body_html: str) -> str:
    if not body_html:
        return ""
    m = re.search(r"<p>(.*?)</p>", body_html, flags=re.I | re.S)
    chunk = m.group(1) if m else body_html
    text = strip_html(chunk)
    if len(text) > 280:
        cut = text[:280]
        if ". " in cut:
            text = cut.rsplit(". ", 1)[0] + "."
        else:
            text = cut.rsplit(" ", 1)[0] + "…"
    return text


def extract_first_ingredient_labels(page_html: str) -> list[str]:
    marker = '"ingredients": ['
    idx = page_html.find(marker)
    if idx < 0:
        return []
    start = idx + len(marker) - 1
    depth = 0
    end = None
    for i, ch in enumerate(page_html[start:], start):
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                end = i
                break
    if end is None:
        return []
    blob = page_html[start : end + 1]
    labels = re.findall(r'"label":\s*"([^"]+)"', blob)
    seen = set()
    out = []
    for label in labels:
        label = label.replace("Rebaudisoside A", "Rebaudioside A").strip()
        if label and label not in seen:
            seen.add(label)
            out.append(label)
    return out


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", "replace")


def fetch_json(url: str) -> dict:
    try:
        return json.loads(fetch(url))
    except Exception:
        return {}


def parse_details(raw: str) -> list[str]:
    if not raw:
        return []
    items = []
    for line in raw.split("\n"):
        line = re.sub(r"^[\*\-\s]+", "", line).strip()
        if not line or SKIP_FEATURE.search(line):
            continue
        if re.match(r"^\$?\d", line) or "Regular price" in line:
            continue
        if line.lower() in {"4 oz"}:
            continue
        items.append(line)
    return items


def infer_category(name: str, product_type: str, tags: str) -> str:
    blob = f"{name} {product_type} {tags}".lower()
    if "deodorant" in blob:
        return "deodorant"
    if any(w in blob for w in ("soap", "beauty bar")):
        return "skincare"
    return "oral"


def infer_free_from(name: str, details: list[str], ingredients: list[str], tags: str) -> list[str]:
    blob = " ".join([name, *details, tags]).lower()
    has_fluoride = any(FLUORIDE_ING.search(i) for i in ingredients)
    out: list[str] = []

    def add(item: str, *needles: str) -> None:
        if any(n in blob for n in needles) and item not in out:
            out.append(item)

    if not has_fluoride and (
        "fluoride-free" in blob
        or "fluoride free" in blob
        or re.search(r"\bfluoride-free\b", name, re.I)
    ):
        out.append("Fluoride")
    add("SLS", "sls free", "no sls", "without sls")
    add("Artificial Dyes", "no artificial dyes", "artificial dyes")
    add("Artificial Flavors", "no artificial flavors", "artificial flavors")
    add("Artificial Preservatives", "no artificial preservatives", "artificial preservatives")
    add("Peroxide", "no peroxide", "without peroxide")
    add("Animal testing", "not tested on animals", "cruelty")
    if "vegan" in blob and "Animal products" not in out:
        out.append("Animal products")
    return out


def features_from(details: list[str], tags: str) -> list[str]:
    feats = []
    for d in details:
        short = d.split(":")[0].strip()
        if len(short) > 60:
            continue
        if short.lower() in {
            "fluoride free",
            "natural",
            "sls free",
            "no artificial dyes, flavors, or preservatives",
        }:
            continue
        if short not in feats:
            feats.append(short)
        if len(feats) >= 6:
            break
    tag_bits = [t.strip() for t in tags.split(",") if t.strip()]
    for t in tag_bits:
        if t.lower() in {"vegan", "whitening", "anticavity", "fluoride free", "natural"}:
            if t not in feats and t.lower() != "natural":
                feats.append(t if t != "fluoride free" else "Fluoride-Free")
    return feats[:8]


def dollar(tag: str, value: str) -> str:
    if f"${tag}$" in value:
        tag = tag + "x"
    return f"${tag}${value}${tag}$"


def ts_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def ts_str_array(items: list[str], indent: str) -> str:
    if not items:
        return "[]"
    inner = ",\n".join(f"{indent}  {ts_str(i)}" for i in items)
    return f"[\n{inner},\n{indent}]"


def product_uuid(n: int) -> str:
    return f"c0000000-0000-0000-0000-00000000{n:04d}"


def main() -> None:
    rows = json.loads(THUNDERBIT.read_text())
    products = []
    SQL_DIR.mkdir(parents=True, exist_ok=True)

    for i, row in enumerate(rows, start=1):
        url = row["Product URL"].split("?")[0].rstrip("/")
        handle = url.rsplit("/products/", 1)[-1]
        name = row["Product Name"].strip()
        price = float(row.get("Price (USD)") or 0)
        size = (row.get("Product Size") or "").strip()
        image = first_image(row.get("Product Image") or "")
        details = parse_details(row.get("Product Details") or "")

        print(f"[{i:02d}/35] {handle}", flush=True)
        page_html = ""
        shop = {}
        try:
            page_html = fetch(url)
            time.sleep(0.25)
            shop = fetch_json(url + ".json").get("product") or {}
        except Exception as exc:
            print(f"  WARN fetch failed: {exc}")

        ingredients = extract_first_ingredient_labels(page_html) if page_html else []
        body_html = shop.get("body_html") or ""
        description = first_paragraph(body_html)
        if not description:
            description = details[0] if details else f"Natural {name} from Tom's of Maine."
        product_type = shop.get("product_type") or ""
        tags = shop.get("tags") or ""
        variants = shop.get("variants") or []
        if not size and variants:
            title = variants[0].get("title") or ""
            if title and title.lower() != "default title":
                size = title
        category = infer_category(name, product_type, tags)
        free_from = infer_free_from(name, details, ingredients, tags)
        features = features_from(details, tags)
        good_for = "; ".join(features[:3]) if features else ""

        if not image and shop.get("image"):
            src = shop["image"].get("src") or ""
            if src.startswith("//"):
                src = "https:" + src
            image = src.split("?")[0] + "?width=800" if src else ""

        prod = {
            "id": f"tm{i}",
            "uuid": product_uuid(i),
            "slug": handle,
            "brandId": BRAND_ID,
            "name": name,
            "category": category,
            "price": price,
            "description": description,
            "ingredients": ingredients,
            "freeFrom": free_from,
            "rating": 4.6,
            "reviewCount": 0,
            "accent": ACCENT,
            "imageUrl": image,
            "affiliateUrl": url,
            "size": size,
            "howToUse": "",
            "goodFor": good_for,
            "smellsLike": "",
            "finish": "",
            "features": features,
            "placedBy": PLACED_BY,
        }
        products.append(prod)
        print(f"  {len(ingredients)} ingredients, cat={category}, free={free_from}")

    parsed = {"brand": BRAND, "brandUuid": BRAND_UUID, "products": products}
    OUT_PARSED.write_text(json.dumps(parsed, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT_PARSED}")

    write_data_fragment(products)
    write_sql(products)
    print("done")


def write_data_fragment(products: list[dict]) -> None:
    brand_block = f"""  {{
    id: "{BRAND['id']}",
    slug: {ts_str(BRAND['slug'])},
    name: {ts_str(BRAND['name'])},
    tagline: {ts_str(BRAND['tagline'])},
    story:
      {ts_str(BRAND['story'])},
    location: {ts_str(BRAND['location'])},
    founded: {BRAND['founded']},
    categories: {json.dumps(BRAND['categories'])},
    accent: {ts_str(BRAND['accent'])},
    rating: {BRAND['rating']},
    reviewCount: {BRAND['reviewCount']},
    followerCount: {BRAND['followerCount']},
  }},
"""
    chunks = []
    for p in products:
        ings = ts_str_array(p["ingredients"], "    ")
        ff = ts_str_array(p["freeFrom"], "    ")
        desc = p["description"]
        if len(desc) > 90:
            desc_line = f"    description:\n      {ts_str(desc)},"
        else:
            desc_line = f"    description: {ts_str(desc)},"
        chunks.append(
            f"""  {{
    id: {ts_str(p['id'])},
    slug: {ts_str(p['slug'])},
    brandId: {ts_str(p['brandId'])},
    name: {ts_str(p['name'])},
    category: {ts_str(p['category'])},
    price: {p['price']},
{desc_line}
    ingredients: {ings},
    freeFrom: {ff},
    rating: {p['rating']},
    reviewCount: {p['reviewCount']},
    accent: {ts_str(p['accent'])},
    imageUrl: {ts_str(p['imageUrl'])},
    placedBy: {ts_str(p['placedBy'])},
  }},"""
        )
    DATA_FRAGMENT.write_text(
        "// BRAND_INSERT_AFTER_MOON_JUICE\n"
        + brand_block
        + "\n// PRODUCTS_INSERT_AFTER_MJ29\n"
        + "\n".join(chunks)
        + "\n"
    )
    print(f"wrote {DATA_FRAGMENT}")


def write_sql(products: list[dict]) -> None:
    brand_sql = f"""-- Tom's of Maine brand
-- https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

insert into public.brands (id, slug, name, tagline, story, location, founded, accent, rating, review_count, follower_count, website_url) values (
  '{BRAND_UUID}',
  {dollar('tm', BRAND['slug'])},
  {dollar('tm', BRAND['name'])},
  {dollar('tm', BRAND['tagline'])},
  {dollar('tm', BRAND['story'])},
  {dollar('tm', BRAND['location'])},
  {BRAND['founded']},
  {dollar('tm', BRAND['accent'])},
  {BRAND['rating']},
  {BRAND['reviewCount']},
  0,
  {dollar('tm', BRAND['website'])}
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  story = excluded.story,
  accent = excluded.accent,
  rating = excluded.rating,
  review_count = excluded.review_count,
  website_url = excluded.website_url;

insert into public.brand_categories (brand_id, category_id)
select b.id, c.id
from public.brands b
join public.categories c on c.slug in ('oral', 'deodorant', 'skincare')
where b.slug = 'toms-of-maine'
on conflict do nothing;
"""
    (SQL_DIR / "01_brand.sql").write_text(brand_sql)

    product_sqls = []
    for n, p in enumerate(products, start=1):
        feats = p["features"]
        if feats:
            feat_sql = (
                "array["
                + ", ".join(dollar("f", f) for f in feats)
                + "]::text[]"
            )
        else:
            feat_sql = "array[]::text[]"
        badge = "null"
        sql = f"""insert into public.products (
  id, slug, brand_id, name, category, category_id, price, description, accent,
  badge, affiliate_url, affiliate_network, image_url, rating, review_count,
  size, how_to_use, good_for, smells_like, finish, features, is_published, placed_by
) values
  (
    '{p['uuid']}',
    {dollar('tm', p['slug'])},
    (select id from public.brands where slug = 'toms-of-maine'),
    {dollar('tm', p['name'])},
    '{p['category']}',
    (select id from public.categories where slug = '{p['category']}'),
    {p['price']},
    {dollar('tm', p['description'])},
    {dollar('tm', p['accent'])},
    {badge},
    {dollar('tm', p['affiliateUrl'])},
    'direct',
    {dollar('tm', p['imageUrl'])},
    {p['rating']},
    {p['reviewCount']},
    {dollar('tm', p['size'])},
    {dollar('tm', p['howToUse'])},
    {dollar('tm', p['goodFor'])},
    {dollar('tm', '')},
    {dollar('tm', '')},
    {feat_sql},
    true,
    {dollar('tm', p['placedBy'])}
  )
on conflict (slug) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  category = excluded.category,
  category_id = excluded.category_id,
  price = excluded.price,
  description = excluded.description,
  accent = excluded.accent,
  badge = excluded.badge,
  affiliate_url = excluded.affiliate_url,
  affiliate_network = excluded.affiliate_network,
  image_url = excluded.image_url,
  rating = excluded.rating,
  review_count = excluded.review_count,
  size = excluded.size,
  how_to_use = excluded.how_to_use,
  good_for = excluded.good_for,
  features = excluded.features,
  is_published = excluded.is_published,
  placed_by = excluded.placed_by;
"""
        fname = SQL_DIR / f"02_product_{n:02d}.sql"
        fname.write_text(sql)
        product_sqls.append(sql)

    (SQL_DIR / "02_products.sql").write_text("\n".join(product_sqls) + "\n")

    seen_ing = {}
    links = []
    for p in products:
        for name in p["ingredients"]:
            s = slugify(name)
            seen_ing[s] = name
            links.append((p["slug"], s, "contains"))
        for name in p["freeFrom"]:
            s = slugify(name)
            seen_ing[s] = name
            links.append((p["slug"], s, "free_from"))

    ing_lines = [
        "-- Tom's of Maine ingredients\n-- Uses kind = 'contains' | 'free_from'\n"
    ]
    for s, name in sorted(seen_ing.items(), key=lambda x: x[0]):
        ing_lines.append(
            f"insert into public.ingredients (slug, name) values ({dollar('s', s)}, {dollar('n', name)}) on conflict (slug) do nothing;"
        )
    ing_lines.append("")
    for pslug, islug, kind in links:
        ing_lines.append(
            "insert into public.product_ingredients (product_id, ingredient_id, kind)\n"
            f"select pr.id, ing.id, '{kind}'\n"
            f"from public.products pr, public.ingredients ing\n"
            f"where pr.slug = {dollar('ps', pslug)} and ing.slug = {dollar('is', islug)}\n"
            "on conflict do nothing;"
        )
    (SQL_DIR / "03_ingredients.sql").write_text("\n".join(ing_lines) + "\n")

    combined = (
        "-- Tom's of Maine brand seed\n\n"
        + brand_sql
        + "\n\n"
        + "\n".join(product_sqls)
        + "\n\n"
        + "\n".join(ing_lines)
        + "\n"
    )
    MIGRATION.write_text(combined)
    print(f"wrote SQL to {SQL_DIR} and {MIGRATION}")


if __name__ == "__main__":
    main()
