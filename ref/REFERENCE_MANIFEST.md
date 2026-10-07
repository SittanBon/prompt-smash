# Prompt Smash! — Reference Manifest

Created in **Numbered Prompt 2** (2026-10-07). Updated with the user's **confirmed decisions** the same day.
The five reference images in this folder are unchanged: not renamed, moved or edited.

**Order of authority:**

1. The user's written requirements, including the confirmed decisions below
2. `ref3.jpg`, the confirmed primary homepage reference
3. References assigned to specific sections or components (`ref5.jpg`)
4. Burger-photography and motion references (`ref1.jpg`, `ref4.jpg`)
5. General inspiration (`ref2.jpg`)

Each supporting reference controls only the role assigned to it. The references are small (808 px wide at most), so we match **visual relationships, composition and atmosphere, not exact pixels**.

---

## Summary table

| Filename | Dimensions | Role | What to use from it | What not to copy | Relevant page / component | Priority | Confirmation status | Conflicts or questions |
|---|---|---|---|---|---|---|---|---|
| `ref3.jpg` | 736 × 552 px (4:3) | **Primary homepage reference** | Hero composition; oversized headline set behind the burger; burger position and scale; navigation structure (logo pill on the left, pill controls on the right); visual hierarchy; generous spacing; rounded interface language; editorial character; transition into the next section (rounded card rising under the hero) | The "Burgee" name, its wording, logo and "LOW FAT" badge text; its exact ingredients; its exact palette (we use our own, below); the presentation frame | Homepage hero, navigation, the visual language of every section below the hero | 1 | **Confirmed**: primary homepage reference | None open |
| `ref1.jpg` | 670 × 1200 px (≈ 9:16) | **Burger-photography and separated-state reference** | Warm editorial lighting; realistic food texture; warm background relationship; clean vertical separation; soft depth and shadows; premium styling rather than fast food | Its ingredient list and order (our seven-layer mapping is fixed); heavy steam behind readable content | Art direction for all seven ingredient assets; the separated state in the cinematic hero | 2 | **Confirmed**: photography and separated-state reference | None open |
| `ref4.jpg` | 736 × 1075 px (≈ 2:3) | **Focus-lighting reference only** | Dramatic ingredient lighting and contrast, as inspiration for how the active ingredient stands out and inactive ones recede | The black background, in any form, as the page background; its ingredients | Focus states in the cinematic hero | 3 | **Confirmed**: focus-lighting reference only | Resolved: the page stays warm cream during focus |
| `ref5.jpg` | 808 × 632 px (≈ 9:7) | **Component and progress-navigation reference** | Vertical-dot pagination, reused as the seven-step progress indicator; scroll cue under the CTA; the halfway separation state; placing labels beside the burger | Orange background; thin condensed font; cart and menu icons; price and shopping meaning; presentation frame | Progress indicator, scroll cue, ingredient labels | 3 | **Confirmed**: component and progress-navigation reference | Resolved: colour and type follow ref3 |
| `ref2.jpg` | 736 × 414 px (16:9) | **General brand-energy inspiration only** | Appetising, punchy energy; the wordmark-plus-tagline pattern as loose inspiration | The "BRUZOO" logo, slogan and agency watermark; hands; flat orange; crispy-chicken build (a later journey that must not be built now) | Brand mood only | 4 | **Confirmed**: general inspiration only | Lowest authority |

---

## Confirmed design decisions

### 1. Primary reference: `ref3.jpg`
This is the source of truth for:
- hero composition
- large-headline placement
- burger position and scale
- navigation structure
- visual hierarchy
- generous spacing
- rounded interface language
- editorial character
- transition into the next section

Do not copy its restaurant name, wording, logo, badge text or exact ingredients.

### 2. Headlines and copy
- **Oversized hero headline behind the burger:** "PROMPT SMASH!" It is partly hidden by the burger, as in ref3, but must remain recognisable and accessible. The real text stays in the HTML, not in an image.
- **Supporting headline (content area):** "Build better prompts, layer by layer."
- **Supporting text:** "A good prompt is like a good burger. Every layer has a job."

### 3. Round badge
- Keep the round badge, with the wording **"7 LAYERS / 1 BETTER PROMPT"**.
- Treat it as a small educational brand element, not a fast-food sticker. It must not compete with the headline or the burger.

### 4. Brand palette
Use ref3's colour relationships, not its exact values.

| Role | Colour |
|---|---|
| Main background | Warm cream |
| Typography | Deep charcoal or dark brown |
| Primary brand and CTA colour | Deep tomato red |
| Secondary accent | Mustard yellow |
| Small supporting accents only | Pickle green |
| Cards and content panels | Warm paper white |

The page should feel warmer and more distinctive than a generic restaurant site.

### 5. Wrapper: Rules and Boundaries
- **Material:** a realistic sheet of warm cream or natural waxed burger paper beneath the bottom bun.
- **Assembled state:** partly folded around or under the burger, with its edges visible, grounding the burger.
- **Separated state:** it unfolds and becomes its own seventh visual layer beneath the bottom bun.
- **Markings:** a subtle Prompt Smash pattern or simple red marks are allowed. **No important readable text in the generated image.** The interface label identifies it as "Rules and Boundaries".
- **Concept:** the wrapper protects, contains and sets the limits of the burger.

### 6. Sauce: Style and Quality
- A clearly visible photographic layer, not just implied.
- Shape: a controlled sauce ribbon, spread or curved swirl between the Toppings and the Bottom bun.
- It must be realistic, separate enough to animate, consistent with the other ingredients and easy to recognise when focused.
- It must not be so liquid that it is hard to cut out or animate.

### 7. Sections below the hero
- Continue ref3's visual language: warm cream backgrounds, strong editorial headlines, rounded cards, large spacing, food-inspired colours, pill-shaped controls, clear hierarchy and realistic burger imagery.
- Not every section should look identical.
- **Technique Lab** may use a deep charcoal or dark-brown background as a contrasting chapter, while staying within the same design system.
- **BITE**, the **responsible-AI review** and the **final prompt** return to the lighter editorial system.

### 8. Focus-state behaviour
The page background stays **warm cream**. It never turns black.

When an ingredient is active:
- **Active ingredient:** bright, sharp and fully saturated; moved slightly forward or enlarged; stronger soft shadow.
- **Inactive ingredients:** slightly darker, less saturated, faded or blurred, but still visible enough that the whole burger is understood.
- **Content:** the label and the handbook panel beside the burger update.

ref4 is used only as inspiration for dramatic ingredient lighting and contrast.

### 9. Progress indicator, adapted from ref5
- One dot per ingredient, seven in total.
- The active dot is clearly highlighted.
- The ingredient name appears on focus or hover.
- It is keyboard accessible.
- Dots are clickable to move between completed or available layers.
- There is a responsive alternative on mobile.

### 10. Burger photography, from ref1
- Warm editorial lighting, realistic texture, warm background relationship, clean separation, soft depth and shadows, premium styling.
- Use its composition as inspiration while keeping the fixed seven-layer mapping.

### Fixed seven-layer mapping (unchanged, from the brief)

| # | Ingredient | Prompt layer |
|---|---|---|
| 1 | Top bun | Goal |
| 2 | Patty | Task |
| 3 | Cheese | Context and Input |
| 4 | Toppings | Requirements and Details |
| 5 | Sauce | Style and Quality |
| 6 | Bottom bun | Output Format |
| 7 | Wrapper | Rules and Boundaries |

---

## Conflicts: all resolved

| Topic | Resolution |
|---|---|
| Page background (ref3 cream vs ref4 black, ref2 and ref5 orange) | Warm cream throughout. Technique Lab may use dark charcoal or brown as a planned contrasting chapter. |
| Display typography (ref3 heavy vs ref5 and ref2 condensed) | Follow ref3 |
| Burger build (each reference has different ingredients) | The fixed seven-layer mapping above |
| Wrapper and Sauce (absent or only implied in the references) | Defined in decisions 5 and 6 |

## Notes per reference

- **ref3.jpg:** a burger-restaurant landing page. It has a cream page, pill-shaped navigation, a huge heavy brown headline behind a tall assembled burger, a round badge, and cheese drips running into a yellow rounded card below.
- **ref1.jpg:** an exploded burger on a warm peach background, with soft light, light steam and a floor shadow.
- **ref4.jpg:** an exploded burger on pure black with strong rim lighting.
- **ref5.jpg:** an orange hamburger-site mockup with thin "BURGUER" type, a half-separated burger, vertical pagination dots, and a pill CTA with a down chevron.
- **ref2.jpg:** a 16:9 ad for a crispy-chicken burger held in two hands against flat orange.

---

## Screenshot-comparison rule (applies once implementation begins)

After every meaningful visual change:

1. Run the real site locally.
2. Take a headless screenshot at a **1920 × 1080 viewport**. This is a test size only, never the site's fixed size.
3. Save it to `qa/screenshots/`.
4. Build a side-by-side image of `ref3.jpg` and the implementation, and save it to `qa/comparisons/`.
5. Open and inspect the comparison, list the visible differences, fix the important ones, and repeat.

The site itself must stay fluid. It must not use a fixed 1920 × 1080 canvas, horizontal scrolling, text baked into images, or a desktop page simply scaled down for mobile.
