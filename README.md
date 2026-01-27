# Leo Ashcraft - Portfolio

A modern, performant single-page portfolio built with Astro, featuring an 80s arcade aesthetic.

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
- **Mascot Positioning**: On desktop (768px+), mascot fades in and is positioned relative to centered content; on mobile, mascot appears behind content
- **Typewriter Effect**: Job titles cycle through with natural typing delays (random variance, extended pauses between words)
- **Word-by-Word Grow**: Tagline words scale up sequentially (103%) after page load
- **Re-triggerable**: Clicking the Home nav link or back-to-top button replays the title and tagline animations
- **4K Scaling**: Glowing orbs double in size and blur on screens above 2000px for consistent visual impact

#### Section Titles
- **Wave Animation**: Each letter scales up to 140% in sequence when scrolling into view
- **Sheen Effect**: Brightness sweep follows the wave animation
- **Subtitle Typewriter**: After title animation, subtitle types out character by character with natural delays
- **Cascade from Above**: Titles and subtitles slide down from above when scrolling into view
- **Re-triggerable**: Nav link clicks replay the animation for that section

#### Subsection Titles
"What I Offer", "Education & Certifications", and "More Work" also animate:
- **Wave + Sheen**: Same letter-by-letter animation as main section titles
- **Hidden Until Scroll**: Titles remain hidden until scrolling into view
- **Reset on Navigation**: All three reset when any nav link or back-to-top is clicked

#### About Me Content
- **Cascade Animation**: Bio, quick info, and CTA slide up and fade in sequentially as you scroll

#### Service Cards ("What I Offer")
- **Scroll Cascade**: Services appear one by one as you scroll:
  - "What I Offer" title hidden until scroll
  - Web & Software Development fades in first (at 40% viewport)
  - Cloud Solutions flies down from above
  - CRM slides out from behind Cloud (z-index layering)
  - Logo & Branding flies in last
- **Hover Lift**: Cards lift up with neon glow on hover (fast 0.4s), smooth 5s return on mouse leave
- **Icon Flip**: 3D flip animation on service icons when hovering the card
- **Staggered Features**: Checkmark items slide right with staggered delays
- **Title Glow**: Service titles gain a subtle pink glow on hover

#### Logo & Branding Section
- **Logo Gallery**: Displays portfolio logos (Golden Lighting Co., Honey Bee Window Cleaning, Eagle IT)
- **Shimmer Effect**: On hover, a single shimmer sweep plays across the visible (non-transparent) parts of each logo using CSS mask
- **Hover Scale**: Logos scale up 5% on hover
- **Lightbox Modal**: Clicking a logo opens an in-card modal overlay with larger view
- **High Contrast Support**: Shimmer disabled, logos display in grayscale, modal has solid background

#### Experience Cards
- **Slide Animations**: Cards slide in from alternating sides (left/right) as you scroll down
- **Slide Out**: Cards slide back out when scrolling up past the exit threshold
- **Dynamic Timeline**: Timeline line grows/shrinks based on visible cards

#### Education Cards
- **Diagonal Grow**: Cards grow diagonally from the center of all 4 cards
- **Hidden Title**: "Education & Certifications" title hidden until scroll

#### Timeline Eyes
The Experience section features an animated eye emoji that travels down the timeline:
- **Constrained Movement**: Eye travels only within the current timeline extent
- **Responsive Timeline**: Hidden below 768px; right-aligned 768-1024px; centered 1024px+
- **Direction Flip**: At 1024px+, eyes flip direction at the top of each experience container; at 768-1024px, eyes always look left toward content
- **Slow & Blink**: Eyes slow to 50% speed starting 3% before each dot, blink just before reaching the dot, continue slowly for 3 seconds, then blink again and resume full speed

#### Education Year Counters
- **Count-Up Animation**: Years count up from 2000 to their target year (e.g., 2007, 2021, 2022, 2023)
- **Viewport Trigger**: Animation starts 1 second after scrolling into view
- **Smooth Easing**: Cubic ease-out for natural deceleration
- **Re-triggerable**: Resets to 2000 on nav clicks, re-animates when scrolling back into view

#### Featured Project Cards
- **Scroll Cascade Animation**:
  - Image flies in first (from left or right based on layout)
  - Title and description slide out from behind the image
  - Metrics, chips, and buttons cascade from behind the description
  - When content is on the left, metrics/chips/buttons right-align
- **Clickable Images**: Featured project images are clickable - opens sub-project modal or links to live site
- **Nested Modals**: Sub-projects can contain their own sub-projects (e.g., Parker.edu umbrella)
- **Back Navigation**: Nested modals include a back button to return to parent modal

#### Other Project Cards ("More Work")
- **Hidden Title**: "More Work" title hidden until scroll
- **Sequential Fly-In**: Tiles fly in one by one from below as you scroll
- **Random Icon Flip**: Project folder icons randomly flip at intervals
- **Hover Lift**: Cards lift with enhanced glow on hover (fast 0.4s), smooth 5s return on mouse leave
- **Modal Tile Hover**: Sub-project tiles scale up slightly on hover; in high contrast modes, colors invert

#### External Link Confirmation
- **Exit Warning Modal**: Clicking external links shows a confirmation modal
- **URL Preview**: Displays the destination URL before navigating
- **New Tab Opening**: External links open in a new tab after confirmation
- **Consistent UX**: All external links (Live Site buttons, sub-project tiles, GitHub links) use the same modal

#### Contact Section
- **Cascade Animation**: "Let's Connect" title, description, contact details, and social links cascade in sequentially
- **Form Fly-In**: "Send a Message" form container flies in from the right
- **Disclaimer**: Disclaimer text flies in from the bottom after the form appears

#### Footer
- **Slide-Up Animation**: Footer content slides up from the bottom when scrolling into view

#### Floating Arcade Decorations
Each section features floating geometric shapes inspired by 80s arcade carpet patterns:
- Triangles, squares, circles, and diamond shapes
- Zigzag and squiggly SVG patterns
- Glowing orbs with blur effects
- Parallax scrolling with configurable speed and direction
- GPU-accelerated transforms with `will-change-transform`
- Respects `prefers-reduced-motion` accessibility preference

#### Custom Cursor & Mouse Heatmap (Desktop)
- **Custom Cursor**: Neon cyan dot with trailing ring that expands on interactive elements
- **Mouse Heatmap**: Subtle glowing dots trail behind cursor, fading out over 8 seconds

#### Button Hover Effects
- **Primary Button**: Cyan glow chases counter-clockwise around border on hover, lifts 3px
- **Secondary Button**: Pink glow chases clockwise around border on hover, lifts 3px
- **High Contrast**: Lift effect disabled in high contrast modes for accessibility

### Security Measures

#### Contact Info Obfuscation
Email and phone are stored reversed and reconstructed at runtime to prevent bot scraping:
```typescript
// Stored as reversed strings in profile data
contact: {
  email: { user: 'nhoj', website: 'moc.eod' },
  phone: { area: ')999(', number: '9035-768' },
}

// Reconstructed when displayed
const email = user.reverse() + '@' + website.reverse();  // john@doe.com
const phone = area.reverse() + ' ' + number.reverse();   // (999) 867-5309
```

#### Contact Form Protection
- Server-side reCAPTCHA v3 validation
- Mailtrap integration for secure email delivery
- Input sanitization and validation

### Responsive Navigation
- Scroll-aware navbar with dynamic opacity
- Arcade carpet gradient background on scroll
- Mobile hamburger menu with chasing pink border animation on expanded nav
- Heat glow effect follows cursor on desktop (contained within nav boundaries)
- Navigation links bold on hover; inverted colors in high contrast modes
- Navigation links: Home, About, Experience, Projects, GitHub, Contact

### GitHub Integration
- Live contribution heatmap via GitHub GraphQL API
- Auto-scrolls to show recent activity on mobile
- Cached responses for performance
- **Scroll Animations**:
  - Heatmap hidden until scroll, fades in at 60% viewport
  - "Recent Repositories" title hidden until scroll
  - Repository cards fly out one by one from below
- **Shimmer Animation**: Active tiles randomly shimmer with diagonal light sweep
- **Inactive Tile Pulse**: Empty tiles subtly pulse opacity (100% to 50%) over 3 seconds

## Project Structure

```
src/
├── components/
│   ├── common/          # Header, Footer, SocialIcons, SectionHeader, ArcadeDecorations, ThemeToggle
│   ├── contact/         # Contact form (React)
│   ├── github/          # GitHub heatmap (React)
│   ├── hero/            # Hero section with typewriter & word animations
│   ├── sections/        # About, Experience, Projects, Contact
│   └── ui/              # Reusable UI components (Icon, ToggleSwitch, SocialLink)
├── data/
│   ├── experience.ts    # Work history & education
│   ├── navigation.ts    # Nav menu items
│   ├── profile.ts       # Personal info & contact (obfuscated)
│   ├── projects.ts      # Featured projects (supports nested sub-projects)
│   └── skills.ts        # Technical skills & services (including Logo & Branding)
├── layouts/
│   └── BaseLayout.astro # Main layout with SEO
├── lib/
│   ├── contact.ts       # Email/phone unscrambling utilities
│   ├── icon-flip.ts     # Shared icon flip animation logic
│   ├── parallax.ts      # Section-based parallax for decorations
│   ├── theme.ts         # Theme & animations state management
│   ├── timeline-eyes.ts # Timeline eye direction & blink logic
│   └── typewriter.ts    # Natural typing delay utilities
├── pages/
│   ├── api/             # Server endpoints (contact form)
│   └── index.astro      # Single-page portfolio
└── styles/
    ├── global.css              # Theme, animations & chasing border utilities
    ├── high-contrast.css       # High contrast dark mode styles
    └── high-contrast-light.css # High contrast light mode styles
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

### Reusable UI Components

#### ToggleSwitch
A styled toggle switch component for boolean settings.

```astro
---
import ToggleSwitch from '@/components/ui/ToggleSwitch.astro';
---

<ToggleSwitch checked={false} class="my-custom-class" />
```

Props:
- `checked` (boolean, default: `false`) - Initial toggle state
- `class` (string, optional) - Additional CSS classes

State is managed via `data-checked` attribute. Update with JavaScript:
```javascript
const toggle = document.querySelector('.toggle-switch');
toggle.setAttribute('data-checked', 'true');
toggle.querySelector('.toggle-switch-knob').classList.add('translate-x-4');
```

#### SocialLink
A reusable social link button with platform-specific icons and hover colors.

```astro
---
import SocialLink from '@/components/ui/SocialLink.astro';
---

<SocialLink platform="github" href="https://github.com/user" size="md" />
<SocialLink platform="linkedin" href="https://linkedin.com/in/user" size="lg" />
<SocialLink platform="email" href="mailto:user@example.com" size="sm" />
```

Props:
- `platform` (`'github' | 'linkedin' | 'email'`) - Platform type (required)
- `href` (string) - Link URL (required)
- `size` (`'sm' | 'md' | 'lg'`, default: `'md'`) - Icon and container size
- `class` (string, optional) - Additional CSS classes

| Size | Container | Icon |
|------|-----------|------|
| sm | 32px (w-8) | 16px (w-4) |
| md | 40px (w-10) | 20px (w-5) |
| lg | 48px (w-12) | 24px (w-6) |

Platform hover colors:
- All platforms: Neon pink (`hover:text-neon-pink`) for consistent styling

External links (GitHub, LinkedIn) automatically include `target="_blank"` and `rel="noopener noreferrer"`.

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

#### High Contrast Modes
A theme toggle dropdown in the navigation provides three contrast options:

- **Normal**: Default arcade aesthetic with neon colors and animations
- **High Contrast Dark**: Black background, white text, grayscale images
- **High Contrast Light**: White background, black text, grayscale images

Features:
- **Theme Persistence**: Selection saved to localStorage (`portfolio-theme`), persists across sessions
- **No Flash**: Inline script in `<head>` applies theme before first paint
- **Smooth Transitions**: 1-second loading overlay with spinner during theme changes for smoother UX
- **Disabled Animations**: All decorative animations stopped for reduced distraction
- **Timeline Eyes Exception**: Eyes continue animating in grayscale for visual interest
- **Mobile Optimizations**: High contrast light mode adjusts hero section with gradient background
- **Keyboard Accessible**: Dropdown supports keyboard navigation and Escape to close
- **Menu Auto-Close**: Info menu and hamburger menu collapse when theme is changed
- **Inverted Hover Effects**: Nav links, social icons, and theme toggle invert colors with rounded background on hover

CSS files:
- `src/styles/high-contrast.css` - Dark high contrast theme
- `src/styles/high-contrast-light.css` - Light high contrast theme
- `src/lib/theme.ts` - Theme and animations state management

#### Animations Toggle
A toggle switch inside the contrast dropdown allows users to disable all animations:

- **Global Disable**: Stops all CSS animations and transitions site-wide
- **Static Backgrounds**: Parallax backgrounds remain visible but without parallax movement
- **Static Text**: Hero typewriter shows "Full Stack Software Developer" without typing animation
- **Static Titles**: Hero name and section title wave animations are disabled
- **Re-triggerable**: Turning animations back on restarts the typewriter effect
- **Timeline Eyes Hidden**: Animated eye emojis are removed from the timeline
- **Cursor Visibility**: Typewriter cursors are hidden when animations are disabled
- **Persistence**: Setting saved to localStorage (`portfolio-animations`), applies immediately on page load

Implementation:
```typescript
// src/lib/theme.ts
getAnimationsEnabled()    // Returns boolean
setAnimationsEnabled(enabled: boolean)
toggleAnimations()        // Returns new state

// Dispatches 'animations-change' custom event for React components
```

CSS uses `[data-animations="disabled"]` attribute on `<html>` to disable animations globally.

#### Other Accessibility Features
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- `prefers-reduced-motion` respect
- High contrast color choices in normal mode

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
