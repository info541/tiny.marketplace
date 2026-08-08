insert into public.ingredients (slug, name) values
  ('aluminum', 'Aluminum'),
  ('aqua', 'Aqua'),
  ('baking-soda', 'Baking Soda'),
  ('benzyl-benzoate', 'Benzyl Benzoate'),
  ('benzyl-benzoate-non-gmo', 'Benzyl Benzoate Non-GMO'),
  ('boswellia-serrata-frankincense-oil', 'Boswellia Serrata (Frankincense) Oil'),
  ('bursera-graveolens-palo-santo-wood-oil', 'Bursera Graveolens (Palo Santo) Wood Oil'),
  ('cananga-odorata-ylang-ylang-flower-oil', 'Cananga Odorata (Ylang Ylang) Flower Oil'),
  ('capryliccapric-triglyceride-mct', 'Caprylic/Capric Triglyceride (MCT)'),
  ('cedrus-atlantica-cedarwood-wood-oil', 'Cedrus Atlantica (Cedarwood) Wood Oil'),
  ('cera-alba-beeswax', 'Cera Alba (Beeswax)'),
  ('cinnamomum-camphora-ho-wood-branchleaf-oil', 'Cinnamomum Camphora (Ho Wood) Branch/Leaf Oil'),
  ('cistus-ladaniferus-labdanum-extract', 'Cistus Ladaniferus (Labdanum) Extract'),
  ('citral', 'Citral'),
  ('citronellol', 'Citronellol'),
  ('citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil', 'Citrus Aurantium Bergamia (Bergamot, Bergaptene Free) Peel Oil'),
  ('copaifera-species-copal-resin-oil', 'Copaifera Species (Copal) Resin Oil'),
  ('coumarin', 'Coumarin'),
  ('cymbopogon-flexuosus-lemongrass-oil', 'Cymbopogon Flexuosus (Lemongrass) Oil'),
  ('cymbopogon-winterianus-citronella-leaf-oil', 'Cymbopogon Winterianus (Citronella) Leaf Oil'),
  ('dipteryx-odorata-tonka-bean-seed-extract', 'Dipteryx Odorata (Tonka Bean) Seed Extract'),
  ('elettaria-cardamomum-cardamom-seed-oil', 'Elettaria Cardamomum (Cardamom) Seed Oil'),
  ('essential-oil-botanical-extract-for-fragrance-cistus-ladaniferus-cistus-oil', 'Essential Oil & Botanical Extract for Fragrance: Cistus Ladaniferus (Cistus) Oil'),
  ('eugenia-caryophillus-clove-flower-oil', 'Eugenia Caryophillus (Clove) Flower Oil'),
  ('eugenol', 'Eugenol'),
  ('euphorbia-cerifera-candelilla-wax', 'Euphorbia Cerifera (Candelilla) Wax'),
  ('geraniol', 'Geraniol'),
  ('harsh-surfactants', 'Harsh Surfactants'),
  ('jasminum-grandiflorum-jasmine-flower-extract', 'Jasminum Grandiflorum (Jasmine) Flower Extract'),
  ('lavandula-officinalis-lavender-flower-oil', 'Lavandula Officinalis (Lavender) Flower Oil'),
  ('limonene', 'Limonene'),
  ('linalool', 'Linalool'),
  ('magnesium-hydroxide', 'Magnesium Hydroxide'),
  ('mentha-piperita-peppermint-oil', 'Mentha Piperita (Peppermint) Oil'),
  ('mentha-spicata-spearmint-oil', 'Mentha Spicata (Spearmint) Oil'),
  ('naturally-occurring-in-essential-oils-and-botanical-extracts-limonene', 'Naturally Occurring in Essential Oils and Botanical Extracts: Limonene'),
  ('non-gmo-zea-mays-corn-starch', 'Non-GMO Zea Mays (Corn) Starch'),
  ('ocimum-sanctum-holy-basil-oil', 'Ocimum Sanctum (Holy Basil) Oil'),
  ('organic-cocos-nucifera-coconut-oil', 'Organic Cocos Nucifera (Coconut) Oil'),
  ('organic-fair-trade-certified-butyrospermum-parkii-shea-butter', 'Organic Fair Trade Certified Butyrospermum Parkii (Shea) Butter'),
  ('organic-helianthus-annuus-sunflower-seed-oil', 'Organic Helianthus Annuus (Sunflower) Seed Oil'),
  ('organic-olea-europaea-olive-oil', 'Organic Olea Europaea (Olive) Oil'),
  ('organic-rspo-certified-elaeis-guineensis-palm-oil', 'Organic RSPO Certified Elaeis Guineensis (Palm) Oil'),
  ('origanum-majorana-marjoram-flower-oil', 'Origanum Majorana (Marjoram) Flower Oil'),
  ('pelargonium-graveolens-geranium-oil', 'Pelargonium Graveolens (Geranium) Oil'),
  ('phthalates', 'Phthalates'),
  ('picea-mariana-black-spruce-oil', 'Picea Mariana (Black Spruce) Oil'),
  ('piper-nigrum-black-pepper-fruit-oil', 'Piper Nigrum (Black Pepper) Fruit Oil'),
  ('pogostemon-cablin-patchouli-leaf-oil', 'Pogostemon Cablin (Patchouli) Leaf Oil'),
  ('rosa-damascena-rose-extract', 'Rosa Damascena (Rose) Extract'),
  ('rosmarinus-officinalis-rosemary-leaf-extract', 'Rosmarinus Officinalis (Rosemary) Leaf Extract'),
  ('rosmarinus-officinalis-rosemary-leaf-oil', 'Rosmarinus Officinalis (Rosemary) Leaf Oil'),
  ('salvia-officinalis-sage-oil', 'Salvia Officinalis (Sage) Oil'),
  ('santalum-austrocaledonicum-sandalwood-wood-oil', 'Santalum Austrocaledonicum (Sandalwood) Wood Oil'),
  ('sodium-bicarbonate-baking-soda', 'Sodium Bicarbonate (Baking Soda)'),
  ('sodium-hydroxide', 'Sodium Hydroxide'),
  ('synthetic-fragrance', 'Synthetic Fragrance'),
  ('vetiveria-zizanoides-vetiver-root-oil', 'Vetiveria Zizanoides (Vetiver) Root Oil'),
  ('zea-mays-corn-starch', 'Zea Mays (Corn) Starch'),
  ('zingiber-officinale-ginger-root-oil', 'Zingiber Officinale (Ginger) Root Oil')
on conflict (slug) do update set name = excluded.name;

insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'bursera-graveolens-palo-santo-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'bursera-graveolens-palo-santo-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'pelargonium-graveolens-geranium-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'rosa-damascena-rose-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'cistus-ladaniferus-labdanum-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'picea-mariana-black-spruce-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'jasminum-grandiflorum-jasmine-flower-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'benzyl-benzoate'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'origanum-majorana-marjoram-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'mentha-piperita-peppermint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'mentha-spicata-spearmint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'cinnamomum-camphora-ho-wood-branchleaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'pelargonium-graveolens-geranium-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'rosa-damascena-rose-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'essential-oil-botanical-extract-for-fragrance-cistus-ladaniferus-cistus-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'cedrus-atlantica-cedarwood-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'elettaria-cardamomum-cardamom-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'vetiveria-zizanoides-vetiver-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'cananga-odorata-ylang-ylang-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'santalum-austrocaledonicum-sandalwood-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'piper-nigrum-black-pepper-fruit-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'eugenia-caryophillus-clove-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'naturally-occurring-in-essential-oils-and-botanical-extracts-limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'benzyl-benzoate-non-gmo'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rockrose-cedar-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'cymbopogon-flexuosus-lemongrass-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'salvia-officinalis-sage-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'cymbopogon-winterianus-citronella-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'sensitive-skin-mountain-lavender-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'bursera-graveolens-palo-santo-wood-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'palo-santo-frankincense-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'ocimum-sanctum-holy-basil-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lavender-holy-basil-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-palo-santo-frankincense-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-helianthus-annuus-sunflower-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-cocos-nucifera-coconut-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'aqua'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'sodium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-rspo-certified-elaeis-guineensis-palm-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-fair-trade-certified-butyrospermum-parkii-shea-butter'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'organic-olea-europaea-olive-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'harsh-surfactants'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-soap' and i.slug = 'synthetic-fragrance'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-helianthus-annuus-sunflower-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-cocos-nucifera-coconut-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'aqua'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'sodium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-rspo-certified-elaeis-guineensis-palm-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-fair-trade-certified-butyrospermum-parkii-shea-butter'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'organic-olea-europaea-olive-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'harsh-surfactants'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'mountain-lavender-soap' and i.slug = 'synthetic-fragrance'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'unscented-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-helianthus-annuus-sunflower-seed-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-cocos-nucifera-coconut-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'aqua'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'sodium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-rspo-certified-elaeis-guineensis-palm-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-fair-trade-certified-butyrospermum-parkii-shea-butter'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'organic-olea-europaea-olive-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'salvia-officinalis-sage-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'cymbopogon-flexuosus-lemongrass-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'harsh-surfactants'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-soap' and i.slug = 'synthetic-fragrance'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-moroccan-rose-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-mountain-lavender-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-bergamot-ginger-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'magnesium-hydroxide'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'euphorbia-cerifera-candelilla-wax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'baking-soda-free-sensitive-skin-unscented-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'zingiber-officinale-ginger-root-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'bergamot-ginger-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'cymbopogon-flexuosus-lemongrass-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'salvia-officinalis-sage-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'cymbopogon-winterianus-citronella-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'lemongrass-sage-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'cistus-ladaniferus-labdanum-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'picea-mariana-black-spruce-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'jasminum-grandiflorum-jasmine-flower-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'benzyl-benzoate'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'black-spruce-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'origanum-majorana-marjoram-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'mentha-piperita-peppermint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'mentha-spicata-spearmint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'cinnamomum-camphora-ho-wood-branchleaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-plastic-free-deodorant' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'pelargonium-graveolens-geranium-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'rosa-damascena-rose-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'citrus-aurantium-bergamia-bergamot-bergaptene-free-peel-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'citral'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'citronellol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'moroccan-rose-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'dipteryx-odorata-tonka-bean-seed-extract'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'pogostemon-cablin-patchouli-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'copaifera-species-copal-resin-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'boswellia-serrata-frankincense-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'coumarin'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'eugenol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'patchouli-copal-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'capryliccapric-triglyceride-mct'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'non-gmo-zea-mays-corn-starch'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'sodium-bicarbonate-baking-soda'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'cera-alba-beeswax'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'rosmarinus-officinalis-rosemary-leaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'origanum-majorana-marjoram-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'mentha-piperita-peppermint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'mentha-spicata-spearmint-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'cinnamomum-camphora-ho-wood-branchleaf-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'lavandula-officinalis-lavender-flower-oil'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'geraniol'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'limonene'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'contains'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'linalool'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'aluminum'
on conflict do nothing;
insert into public.product_ingredients (product_id, ingredient_id, kind)
select p.id, i.id, 'free_from'
from public.products p, public.ingredients i
where p.slug = 'rosemary-mint-travel-size' and i.slug = 'phthalates'
on conflict do nothing;
