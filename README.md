# Leo Ashcraft - Portfolio

A modern, performant single-page portfolio built with Astro, featuring an 80s arcade aesthetic and thoughtful security measures.

**Live Site:** [leoashcraft.com](https://leoashcraft.com)

## Tech Stack

### Core Framework
- **[Astro 5](https://astro.build)** - Static site generation with islands architecture for optimal performance
- **[React 19](https://react.dev)** - Interactive components via Astro's React integration
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development

### Styling & Animation
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS with custom theme configuration
- **Custom CSS Animations** - Floating geometric shapes, drift effects, wobble animations
- **Arcade Carpet Theme** - 80s-inspired neon color palette (pink, purple, cyan, yellow, green, orange)

### SEO
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - Automatic sitemap generation
- **JSON-LD Structured Data** - Schema.org markup for Person and WebSite
- **Open Graph & Twitter Cards** - Rich social media previews
- **Semantic Heading Structure** - Proper h1-h3 hierarchy for document outline
- **Accessible Hidden Text** - Screen reader content for SEO without visual clutter

### Performance
- **[astro-compress](https://github.com/astro-community/astro-compress)** - HTML, CSS, JS, and SVG minification
- **[Sharp](https://sharp.pixelplumbing.com)** - Image optimization
- **Critical CSS Inlining** - Fastest possible First Contentful Paint
- **Font Loading Strategy** - `display=optional` to prevent layout shift
- **Mobile Optimizations** - Disabled animations on mobile for reduced main thread work

## Features

### Animations & Interactions

#### Hero Section
- **Mascot Slide-in**: On desktop (768px+), mascot slides in from left with fade-in, decelerating toward the end; static on mobile
- **Typewriter Effect**: Job titles cycle through with typing/deleting animation
- **Word-by-Word Grow**: Tagline words scale up sequentially (103%) after page load
- **Re-triggerable**: Clicking the Home nav link or back-to-top button replays the title and tagline animations
- **4K Scaling**: Glowing orbs double in size and blur on screens above 2000px for consistent visual impact

#### Section Titles
- **Wave Animation**: Each letter scales up to 140% in sequence when scrolling into view
- **Sheen Effect**: Brightness sweep follows the wave animation
- **Subtitle Grow**: After title animation, subtitle words grow 103% sequentially
- **Re-triggerable**: Nav link clicks replay the animation for that section

#### About Section Tagline
- **Rotating Typewriter**: Cycles through first-person phrases with natural typing delays (random variance, pauses after spaces, occasional hesitation)
- **Final Phrase**: Stops on the last phrase, adds a period, and animates an underline
- **Blinking Cursor**: Matches hero section cursor style, blinks 3 times then hides after final phrase

#### Subsection Titles
"What I Offer", "Education & Certifications", and "More Work" also animate:
- **Wave + Sheen**: Same letter-by-letter animation as main section titles
- **Reset on Navigation**: All three reset when any nav link or back-to-top is clicked

#### Service Cards ("What I Offer")
- **Hover Lift**: Cards lift up with neon glow on hover (fast 0.4s), smooth 5s return on mouse leave
- **Icon Flip**: 3D flip animation on service icons when hovering the card
- **Staggered Features**: Checkmark items slide right with staggered delays
- **Title Glow**: Service titles gain a subtle pink glow on hover

#### Timeline Eyes
The Experience section features animated eye emojis that travel down the timeline:
- **Direction Flip**: Eyes look toward the content - they flip direction each time they pass a timeline dot
- **Blinking**: Eyes blink when crossing the midpoint between dots
- **Dual Travelers**: Two eye emojis travel with offset timing for visual interest

#### Education Year Counters
- **Count-Up Animation**: Years count up from 2000 to their target year (e.g., 2007, 2021, 2022, 2023)
- **Viewport Trigger**: Animation starts 1 second after scrolling into view
- **Smooth Easing**: Cubic ease-out for natural deceleration
- **Re-triggerable**: Resets to 2000 on nav clicks, re-animates when scrolling back into view

#### Project Cards
- **Random Icon Flip**: Project folder icons randomly flip at intervals
- **Hover Lift**: Cards lift with enhanced glow on hover (fast 0.4s), smooth 5s return on mouse leave
- **Clickable Images**: Featured project images are clickable - opens sub-project modal or links to live site
- **Nested Modals**: Sub-projects can contain their own sub-projects (e.g., Parker.edu umbrella)
- **Back Navigation**: Nested modals include a back button to return to parent modal

#### External Link Confirmation
- **Exit Warning Modal**: Clicking external links shows a confirmation modal
- **URL Preview**: Displays the destination URL before navigating
- **New Tab Opening**: External links open in a new tab after confirmation
- **Consistent UX**: All external links (Live Site buttons, sub-project tiles, GitHub links) use the same modal

#### Floating Arcade Decorations
Each section features floating geometric shapes inspired by 80s arcade carpet patterns:
- Triangles, squares, circles, and diamond shapes
- Zigzag and squiggly SVG patterns
- Glowing orbs with blur effects
- Various drift, wobble, spin, and pulse animations

#### Custom Cursor & Mouse Heatmap (Desktop)
- **Custom Cursor**: Neon cyan dot with trailing ring that expands on interactive elements
- **Mouse Heatmap**: Subtle glowing dots trail behind cursor, fading out over 8 seconds

#### Button Hover Effects
- **Primary Button**: Cyan glow chases counter-clockwise around border on hover
- **Secondary Button**: Pink glow chases clockwise around border on hover

### Security Measures

#### Contact Info Obfuscation
Email and phone are stored reversed and reconstructed at runtime to prevent bot scraping:
```typescript
// Stored as reversed strings in profile data
contact: {
  email: { user: 'oel', website: 'hcet.tfarchsa' },
  phone: { area: ')309(', number: '2874-836' },
}

// Reconstructed when displayed
const email = user.reverse() + '@' + website.reverse();  // leo@ashcraft.tech
const phone = area.reverse() + ' ' + number.reverse();   // (903) 638-4782
```

#### Contact Form Protection
- Server-side reCAPTCHA v3 validation
- Mailtrap integration for secure email delivery
- Input sanitization and validation

### Responsive Navigation
- Scroll-aware navbar with dynamic opacity
- Arcade carpet gradient background on scroll
- Mobile hamburger menu with chasing pink border animation on expanded nav
- Heat glow effect follows cursor on desktop

### GitHub Integration
- Live contribution heatmap via GitHub GraphQL API
- Auto-scrolls to show recent activity on mobile
- Cached responses for performance
- **Shimmer Animation**: Active tiles randomly shimmer with diagonal light sweep
- **Inactive Tile Pulse**: Empty tiles subtly pulse opacity (100% to 50%) over 3 seconds

## Project Structure

```
src/
├── components/
│   ├── common/          # Header, Footer, SocialIcons, SectionHeader, ArcadeDecorations
│   ├── contact/         # Contact form (React)
│   ├── github/          # GitHub heatmap (React)
│   ├── hero/            # Hero section with typewriter & word animations
│   ├── sections/        # About, Experience, Projects, Contact
│   └── ui/              # Reusable UI components (Icon)
├── data/
│   ├── experience.ts    # Work history & education
│   ├── navigation.ts    # Nav menu items
│   ├── profile.ts       # Personal info & contact (obfuscated)
│   ├── projects.ts      # Featured projects (supports nested sub-projects)
│   └── skills.ts        # Technical skills & services
├── layouts/
│   └── BaseLayout.astro # Main layout with SEO
├── lib/
│   ├── contact.ts       # Email/phone unscrambling utilities
│   ├── icon-flip.ts     # Shared icon flip animation logic
│   └── timeline-eyes.ts # Timeline eye direction & blink logic
├── pages/
│   ├── api/             # Server endpoints (contact form)
│   └── index.astro      # Single-page portfolio
└── styles/
    └── global.css       # Theme, animations & chasing border utilities
```

## CSS Architecture

### Chasing Border System
Reusable animated border utility with CSS custom properties:

```css
/* Base class - apply to element */
.chase-border {
  --chase-color: rgba(255, 0, 255, 0.6);  /* Border glow color */
  --chase-inset: -1px;                     /* Pseudo-element inset */
  --chase-bg: rgba(23, 16, 36, 0.98);     /* Inner background */
  --chase-radius: 0.75rem;                 /* Border radius */
  --chase-speed: 3s;                       /* Animation duration */
}

/* Color variants */
.chase-cyan { --chase-color: rgba(0, 255, 247, 0.6); }
.chase-pink { --chase-color: rgba(255, 0, 255, 0.6); }
.chase-yellow { --chase-color: rgba(255, 255, 0, 0.7); }

/* Modifiers */
.chase-always   /* Always animate (no hover required) */
.chase-reverse  /* Reverse rotation direction */
```

Usage example:
```html
<!-- Hover-activated chasing border -->
<div class="chase-border modal-tile">...</div>

<!-- Always-on chasing border with cyan color -->
<div class="chase-border chase-always chase-cyan modal-container">...</div>
```

### Glow Utilities
```css
.glow-sm      /* 10px pink glow */
.glow-md      /* 20px pink glow */
.glow-lg      /* 30px pink + purple glow */
.glow-cyan-sm /* 10px cyan glow */
.glow-cyan-md /* 20px cyan glow */
.glow-cyan-lg /* 30px cyan glow */
```

## Image Guidelines

### Project Images
Recommended sizes for optimal display and retina support:

| Image Type | Display Size | Recommended Size | Aspect Ratio |
|------------|--------------|------------------|--------------|
| Featured Projects | ~550px | 1400 x 800px | 7:4 |
| Other Projects | ~350px | 800 x 600px | 4:3 |
| Sub-Projects (Modal) | ~260px | 600 x 338px | 16:9 |
| Nested Sub-Projects | ~260px | 600 x 338px | 16:9 |

- Use AVIF format for best compression
- Quality: 80-85% compression
- Keep consistent aspect ratios within each category

## Design Philosophy

### Visual Theme
The design draws inspiration from 80s arcade carpet patterns, featuring:
- Deep purple/black backgrounds (`#0a0015`)
- Neon accent colors (pink `#ff00ff`, cyan `#00fff7`, yellow `#ffff00`)
- Floating geometric shapes (triangles, squares, circles, squiggly lines)
- Glassmorphism cards with gradient borders
- Subtle glow effects and animations

### Performance First
- Static generation for instant page loads
- Islands architecture - JavaScript only where needed
- Lazy loading for below-fold content
- Optimized Core Web Vitals (LCP, FID, CLS)

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- `prefers-reduced-motion` respect
- High contrast color choices

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```env
# GitHub API (for contribution heatmap)
GITHUB_TOKEN=ghp_xxx

# reCAPTCHA v3
PUBLIC_RECAPTCHA_SITE_KEY=6Lxxx
RECAPTCHA_SECRET=6Lxxx

# Mailtrap (email delivery)
MAILTRAP_TOKEN=xxx
```

## License

This project is open source and available for reference. Feel free to use it as inspiration for your own portfolio.

---

Built with Astro and lots of caffeine.
