# Leo Ashcraft - Portfolio

A modern, performant single-page portfolio built with Astro, featuring an 80s arcade aesthetic and thoughtful security measures.

**Live Site:** [ashcraft.tech](https://ashcraft.tech)

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

### Performance
- **[astro-compress](https://github.com/astro-community/astro-compress)** - HTML, CSS, JS, and SVG minification
- **[Sharp](https://sharp.pixelplumbing.com)** - Image optimization
- **Critical CSS Inlining** - Fastest possible First Contentful Paint
- **Font Loading Strategy** - `display=optional` to prevent layout shift
- **Mobile Optimizations** - Disabled animations on mobile for reduced main thread work

## Features

### Animations & Interactions

#### Timeline Eyes
The Experience section features animated eye emojis that travel down the timeline:
- **Direction Flip**: Eyes look toward the content - they flip direction each time they pass a timeline dot
- **Blinking**: Eyes blink when crossing the midpoint between dots
- **Dual Travelers**: Two eye emojis travel with offset timing for visual interest

#### Hero Section
- **Typewriter Effect**: Job titles cycle through with typing/deleting animation
- **Word-by-Word Grow**: Tagline words scale up sequentially (103%) after page load
- **Re-triggerable**: Clicking the Home nav link replays the tagline animation

#### Service Cards ("What I Offer")
- **Float Animation**: Cards gently float up/down with neon glow on hover
- **Icon Flip**: 3D flip animation on service icons when hovering the card
- **Staggered Features**: Checkmark items slide right with staggered delays
- **Title Glow**: Service titles gain a subtle pink glow on hover

#### Project Cards
- **Random Icon Flip**: Project folder icons randomly flip at intervals
- **Hover Float**: Cards float with enhanced glow effect on hover

#### Floating Arcade Decorations
Each section features floating geometric shapes inspired by 80s arcade carpet patterns:
- Triangles, squares, circles, and diamond shapes
- Zigzag and squiggly SVG patterns
- Glowing orbs with blur effects
- Various drift, wobble, spin, and pulse animations

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
- Mobile hamburger menu with blur backdrop

### GitHub Integration
- Live contribution heatmap via GitHub GraphQL API
- Auto-scrolls to show recent activity on mobile
- Cached responses for performance

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
│   ├── projects.ts      # Featured projects
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
    └── global.css       # Theme, animations & arcade styling
```

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
