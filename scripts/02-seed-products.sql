-- ─── RareGh0st Store: Seed initial products ───
-- Imports the 32 products from src/data/shop.js into the products table.
-- Idempotent: uses slug as the unique key, won't duplicate on re-run.

insert into products (slug, title, category, subcategory, description, price_cad, artwork, tags, colors, sizes, duration, is_active, display_order) values
-- Apparel
('kaleidoscope-hoodie', 'Kaleidoscope Hoodie', 'apparel', 'hoodies', 'Premium heavyweight hoodie featuring the Sanity Is In Rare Supply artwork. Printed on demand via Printful.', 65, 'Sanity Is In Rare Supply', '{hoodie,kaleidoscope,sanity,streetwear}', '{cyan,magenta}', 'S–3XL', null, true, 101),
('third-eye-hoodie', 'Third Eye Hoodie', 'apparel', 'hoodies', 'The Beast artwork wrapped around heavyweight cotton. Crown of thorns, third eye weeping.', 65, 'The Beast', '{hoodie,beast,sacred,streetwear}', '{red,steel}', 'S–3XL', null, true, 102),
('storm-walker-jacket', 'Storm Walker Jacket', 'apparel', 'jackets', 'Windbreaker jacket with storm motif. Every eye watches — but you walk.', 95, 'The Boy Who Walked Out of the Storm', '{jacket,storm,outerwear}', '{magenta,cyan}', 'S–2XL', null, true, 103),
('fractal-mind-tee', 'Fractal Mind Tee', 'apparel', 'shirts', 'Soft cotton tee with the Please Wake Up hand-and-mind graphic.', 35, 'Please Wake Up', '{shirt,tee,wake,casual}', '{purple,magenta}', 'S–3XL', null, true, 104),
('resistance-tee', 'Resistance Tee', 'apparel', 'shirts', 'Orbital rings of information. The universe is watching.', 35, 'The Great Resistance', '{shirt,tee,political,statement}', '{red,cyan}', 'S–3XL', null, true, 105),
('raregh0st-logo-tee', 'RareGh0st Logo Tee', 'apparel', 'shirts', 'Clean logo tee. Skull with horns and halo — shadow and light.', 30, null, '{shirt,tee,logo,minimal}', '{ghost,cyan}', 'S–3XL', null, true, 106),
('kaleidoscope-shorts', 'Kaleidoscope Shorts', 'apparel', 'shorts', 'Athletic shorts with fractal pattern sublimation.', 40, 'Sanity Is In Rare Supply', '{shorts,kaleidoscope,active}', '{cyan,magenta}', 'S–2XL', null, true, 107),
('void-walker-pants', 'Void Walker Pants', 'apparel', 'pants', 'Jogger pants with subtle RareGh0st embroidery. Abyss black.', 55, null, '{pants,minimal,streetwear}', '{steel,ghost}', 'S–2XL', null, true, 108),
-- Accessories
('sanity-blanket', 'Sanity Blanket', 'accessories', 'blankets', 'Plush throw blanket with full Sanity artwork. Wrap yourself in the fractal.', 75, 'Sanity Is In Rare Supply', '{blanket,sanity,home,kaleidoscope}', '{cyan,magenta}', null, null, true, 201),
('beast-blanket', 'Beast Blanket', 'accessories', 'blankets', 'Velveteen blanket featuring The Beast. Crown of thorns comfort.', 75, 'The Beast', '{blanket,beast,home,sacred}', '{red,steel}', null, null, true, 202),
('storm-phone-case', 'Storm Phone Case', 'accessories', 'phone cases', 'Tough phone case with Storm Walker artwork. Impact-resistant.', 28, 'The Boy Who Walked Out of the Storm', '{phone,case,storm,protection}', '{magenta,cyan}', null, null, true, 203),
('wake-up-phone-case', 'Wake Up Phone Case', 'accessories', 'phone cases', 'Snap case featuring the reaching hand. Every unlock is a reminder.', 28, 'Please Wake Up', '{phone,case,wake,mind}', '{purple,magenta}', null, null, true, 204),
('resistance-phone-case', 'Resistance Phone Case', 'accessories', 'phone cases', 'Orbital rings in your pocket. Information wants to be free.', 28, 'The Great Resistance', '{phone,case,political,orbital}', '{red,cyan}', null, null, true, 205),
-- Prints
('sanity-print', 'Sanity Is In Rare Supply — Print', 'prints', 'prints', 'Museum-quality giclée print on archival paper.', 45, 'Sanity Is In Rare Supply', '{print,sanity,kaleidoscope,wall art}', '{cyan,magenta}', '12×16 / 18×24 / 24×36', null, true, 301),
('please-wake-up-print', 'Please Wake Up — Print', 'prints', 'prints', 'Archival giclée print. The hand reaches.', 45, 'Please Wake Up', '{print,wake,surreal,wall art}', '{purple,magenta}', '12×16 / 18×24 / 24×36', null, true, 302),
('storm-print', 'The Boy Who Walked Out of the Storm — Print', 'prints', 'prints', 'Limited edition giclée. Did I lose my mind?', 50, 'The Boy Who Walked Out of the Storm', '{print,storm,identity,wall art}', '{magenta,cyan}', '12×16 / 18×24 / 24×36', null, true, 303),
('beast-print', 'The Beast — Print', 'prints', 'prints', 'Archival print. Crown of thorns, third eye, doves.', 55, 'The Beast', '{print,beast,sacred,wall art}', '{red,steel}', '12×16 / 18×24 / 24×36', null, true, 304),
('resistance-print', 'The Great Resistance — Print', 'prints', 'prints', 'Giclée print. Orbital rings of information.', 45, 'The Great Resistance', '{print,resistance,political,wall art}', '{red,cyan}', '12×16 / 18×24 / 24×36', null, true, 305),
('sanity-framed', 'Sanity Is In Rare Supply — Framed', 'prints', 'framed prints', 'Gallery-framed giclée in matte black frame. Ready to hang.', 120, 'Sanity Is In Rare Supply', '{framed,sanity,premium,wall art}', '{cyan,magenta}', '18×24 / 24×36', null, true, 306),
('beast-framed', 'The Beast — Framed', 'prints', 'framed prints', 'Museum-framed with UV-protective glass. The sacred, preserved.', 135, 'The Beast', '{framed,beast,premium,wall art}', '{red,steel}', '18×24 / 24×36', null, true, 307),
-- Digital
('kaleidoscope-texture-pack', 'Kaleidoscope Texture Pack', 'digital', 'textures', '50+ high-res textures extracted from the Kaleidoscope series. Grunge, glitch, fractal overlays.', 15, null, '{texture,pack,kaleidoscope,photoshop,resource}', '{amber,cyan}', null, null, true, 401),
('neon-glow-action-set', 'Neon Glow Action Set', 'digital', 'photoshop actions', '12 Photoshop actions for instant neon halos, chromatic aberration, and color bleed effects.', 12, null, '{action,photoshop,neon,glow,automation}', '{amber,magenta}', null, null, true, 402),
('sacred-geometry-brushes', 'Sacred Geometry Brush Pack', 'digital', 'asset packs', '40 custom Photoshop brushes — mandalas, fractals, orbital rings, sacred patterns.', 18, null, '{brushes,photoshop,geometry,sacred,resource}', '{amber,purple}', null, null, true, 403),
('dark-collage-plugin-suite', 'Dark Collage Plugin Suite', 'digital', 'plugins', 'Photoshop plugin for rapid dark-aesthetic compositing. Layer blending, mood grading, texture overlay.', 25, null, '{plugin,photoshop,collage,compositing,automation}', '{amber,ghost}', null, null, true, 404),
('raregh0st-stock-eyes', 'RareGh0st Stock Vol. 1 — Eyes', 'digital', 'stock photography', '30 high-resolution stock photographs — eyes, pupils, irises. Source material for collage work.', 20, null, '{stock,photography,eyes,texture,resource}', '{amber,green}', null, null, true, 405),
('glitch-decay-textures', 'Glitch & Decay Texture Pack', 'digital', 'textures', '60+ textures — digital glitch, analog decay, VHS artifacts, screen tears.', 15, null, '{texture,glitch,decay,grunge,resource}', '{amber,red}', null, null, true, 406),
-- Courses
('dark-collage-masterclass', 'Dark Collage Masterclass', 'courses', 'courses', '12-module deep dive into dark-aesthetic digital collage. From asset sourcing to final composite. Photoshop required.', 149, null, '{course,photoshop,collage,masterclass,technique}', '{green,cyan}', null, '8+ hours', true, 501),
('ai-art-pipeline', 'AI-Assisted Art Pipeline', 'courses', 'courses', 'Learn the RareGh0st workflow — Midjourney generation, Photoshop refinement, symbolic layering. The future of creation.', 99, null, '{course,ai,midjourney,photoshop,workflow}', '{green,purple}', null, '5 hours', true, 502),
('neon-sacred-color-theory', 'Neon & Sacred: Color Theory for Dark Art', 'courses', 'courses', 'Why cyan hits different at 3am. Color psychology, palette construction, and emotional grading for dark aesthetics.', 79, null, '{course,color,theory,neon,design}', '{green,magenta}', null, '4 hours', true, 503),
('composition-and-chaos', 'Composition & Chaos', 'courses', 'courses', 'High-level composition theory — how to make visual chaos feel intentional. Balance, tension, focal points, breathing room.', 89, null, '{course,composition,design,layout,advanced}', '{green,amber}', null, '5 hours', true, 504)
on conflict (slug) do nothing;

-- Mark digital products as is_digital=true
update products set is_digital = true where category = 'digital';
update products set is_digital = true where category = 'courses';
