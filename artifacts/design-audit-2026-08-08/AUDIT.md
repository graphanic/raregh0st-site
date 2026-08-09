# 1RareGh0st visual design and UX audit

Audit date: 2026-08-08  
Scope: public landing experience, portfolio discovery, artwork detail, shop pre-launch, commission flow, and mobile navigation.  
User goal: understand the work, move naturally between related parts of the practice, and confidently collect, follow, or commission it.

## Overall verdict

The site already has a rare and recognizable visual identity: the abyss-black field, cyan/magenta/gold signal palette, strong artwork, and “inner worlds made visible” positioning feel authored rather than templated. The main weakness is not lack of beauty; it is that the interface around the art is often too faint, too small, and too fragmented to carry visitors through the world.

The highest-value direction is to preserve the atmosphere while making the system underneath calmer and more deliberate: stable type roles, readable support copy, fewer simultaneous overlays, and visible bridges between artwork, process, artist, shop, and commissions.

## Flow evidence

### 1. Desktop landing — healthy, with legibility and overlay friction

![Desktop landing](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/01-home-desktop.png)

Strengths: unmistakable hero, effective logo/art relationship, clear headline, and two useful primary actions. The restrained backdrop lets the mark and headline lead.

Risks: navigation and supporting copy are much fainter than the hero; the cookie card, music bar, and River control create three additional visual layers. The consent card partially competes with the primary conversion area.

### 2. Full homepage journey — mixed

![Full homepage](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/02-home-full.png)

Strengths: the page has a sensible story arc—identity, selected work, proof, collector meaning, then commission/shop/artist/signal pathways. The artwork grid supplies the strongest visual energy on the page.

Risks: very large quiet gaps alternate with dense, faint cards. The lower pathway grid is conceptually connected but visually reads as four separate dark panels. Repeated tiny uppercase labels make different levels of information feel equivalent.

### 3. Portfolio overview — healthy art direction, weak controls

![Portfolio overview](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/03-portfolio-desktop-top.png)

Strengths: art is given scale and the gallery immediately demonstrates range. The five discipline tabs give the practice a useful structure.

Risks: the discipline tabs, filter row, descriptions, and metadata are too small and faint compared with the images. The cookie panel covers a meaningful portion of the first card. Selected and unselected controls rely heavily on subtle color/opacity changes.

### 4. Artwork detail — mixed, with an unfinished production surface

![Artwork detail](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/04-artwork-detail.png)

Strengths: the large artwork view is excellent. Title, series, year, medium, and edition information create a promising collector-oriented structure.

Risks: the “Details & Close-ups” row renders generic dark placeholders and the implementation exposes an internal “REPLACE WITH CLOSE-UP CROPS FROM PHOTOSHOP” note. The lower page ends without strong next/previous work, related work, collector, or commission pathways. The release-list action is present but too visually recessive.

### 5. Shop pre-launch — unhealthy dead end

![Shop pre-launch](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/05-shop-desktop.png)

The hero’s primary “Collect the Work” action leads to a nearly empty “Opening Soon” page. The text asks visitors to join the signal, but the visible viewport contains no form or primary button. This breaks trust in the main action and makes the shop feel disconnected from the portfolio.

### 6. Commission flow — healthy structure, mixed hierarchy

![Commission flow](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/06-commission-desktop.png)

Strengths: this is the clearest product story in the site. The four-stage collaboration model reduces uncertainty, the writing feels personal, and the form matches the promise.

Risks: clicking “Commission” lands on `/contact` and highlights “Contact,” even though both Contact and Commission appear as separate navigation choices. This makes the site’s information architecture feel less intentional. Supporting copy and form guidance are again very small and low contrast.

### 7. Mobile landing — mixed

![Mobile landing](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/07-home-mobile.png)

Strengths: the hero reflows well, retains its identity, and keeps the main CTA tappable.

Risks: the consent panel occupies roughly one fifth of the viewport and obscures the second hero action. The music bar and River control further reduce usable space. Multiple fixed utilities make the first screen feel more like a stack of overlays than one composition.

### 8. Mobile menu — unhealthy

![Mobile menu](/mnt/c/Users/EricF/OneDrive/Documents/raregh0st-site/artifacts/design-audit-2026-08-08/08-mobile-menu-clean.png)

The fullscreen overlay sits above the fixed navigation, so the hamburger/close control disappears. Pressing Escape did not close the menu. A visitor can choose a destination, but cannot visibly dismiss the menu and return to the current screen. The trigger also lacks an exposed expanded state. This is the most urgent interaction issue.

## Highest-impact changes

### 1. Establish a calm, readable type system

- Keep the expressive pixel font for the wordmark, large headings, and occasional signal labels.
- Use Geist Sans or Georgia consistently for body copy; use Geist Mono/Courier for compact metadata and controls.
- Stop applying the five-font “river” to every nth child every 100 ms. Restrict morphing to a few authored moments so it reads as signature motion, not typographic instability.
- Set practical floors: about 14–16 px for body copy, 11–12 px for metadata, and 44 px minimum interactive height on touch surfaces.
- Promote support text from 0.15–0.45 opacity to a readable neutral token. Reserve very faint text for genuinely decorative material only.

### 2. Turn the palette into navigation logic

Use the existing colors semantically across every page:

- Cyan: explore, navigate, learn.
- Magenta: artwork, transformation, media.
- Gold: collect, commission, editions, commitments.
- Bone/ghost: reading and neutral interface text.

This lets color connect sections instead of decorating them independently. A visitor should recognize a gold action as a meaningful commercial/personal commitment everywhere.

### 3. Build an explicit connective layer

Make each artwork page a hub rather than a terminus:

- Series breadcrumb and previous/next work.
- “Related worlds” using shared symbols, palette, series, or source work.
- Clear “collect this work / join this release” state.
- A contextual commission bridge: “Want your own story made visible?”
- Links from AI adaptations back to the artist-authored original, and from media pieces back to related still work.

On the homepage, give the lower four pathways one shared visual spine or chapter treatment so Commission, Shop, Artist, and Signal feel like parts of the same practice.

### 4. Make the shop pre-launch page earn the hero CTA

Until products are live, the page should be a deliberate pre-launch portal:

- A visible email signup button/form in the first viewport.
- Three representative artwork/product previews.
- A clear explanation of open releases versus signed editions.
- A route back to collectible portfolio work.
- If nothing can be collected yet, change the homepage primary action from “Collect the Work” to “View Upcoming Releases” or route it to eligible artwork instead.

### 5. Replace unfinished placeholders with authored content

Remove the production note and generic close-up panels from public artwork pages. Add real crops that reveal texture, compositing, symbols, and hidden details. These close-ups can become one of the site’s most beautiful and credible recurring components.

### 6. Consolidate ambient controls into one quiet utility layer

River/calm mode and music belong together in a small “Signal Dock.” Keep consent separate, but reduce its footprint on mobile and ensure it never covers both primary hero actions. This preserves the experimental atmosphere while giving the composition one clear edge treatment.

### 7. Simplify Contact versus Commission

Either:

- keep Contact in navigation and use one gold “Commission” CTA that opens the commission state without also marking Contact as the active section; or
- replace both with a single “Work With Me” destination with General Contact and Personal Commission tabs.

The current duplicate destination weakens the otherwise clear information architecture.

### 8. Repair the mobile menu as a real dialog

- Put the close trigger above the overlay or include a dedicated close button inside it.
- Add `aria-expanded`, `aria-controls`, and an accurate changing label.
- Close on Escape and backdrop click.
- Trap focus while open and restore it to the trigger on close.
- Remove closed-menu links from the accessibility tree with `hidden`/conditional rendering, not opacity alone.
- Prevent background scrolling while open.

## Accessibility evidence and limits

The automated WCAG A/AA scan found one confirmed color-contrast violation affecting three nodes. It also returned manual/incomplete checks for 402 potential contrast nodes because gradients and images made automatic calculation uncertain. The screenshots independently show repeated 8–10 px text with opacity values as low as 0.07–0.35, so a manual contrast pass is warranted.

The scan also flagged checks needed for ARIA labels placed on unroled spans and for autoplay/caption behavior on video. The mobile capture and source inspection showed a hidden close trigger, no Escape dismissal, and closed/open overlay elements that remain in the accessibility snapshot.

This is not a full WCAG compliance claim. Screen-reader output, full keyboard order, focus visibility across every route, zoom/reflow, form error recovery, captions, and reduced-motion behavior still require dedicated testing.

## Suggested sequence

1. Interaction repair: mobile menu, visible shop action, remove public placeholders.
2. Legibility pass: type roles, minimum sizes, contrast tokens, focus styles.
3. Cohesion pass: semantic color roles, shared section/chapter components, consolidated utility dock.
4. Connection pass: related works, series navigation, collector/commission bridges, cross-links between original and adaptation.
5. Polish pass: real close-up crops, art-derived ambient backgrounds, and restrained signature motion.

