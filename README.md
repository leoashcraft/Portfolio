# Leo Ashcraft - Portfolio

A modern, performant portfolio website built with Astro, featuring an 80s arcade aesthetic, interactive terminal, and thoughtful security measures.

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

### Content & SEO
- **[MDX](https://mdxjs.com)** - Markdown with JSX for blog posts and project case studies
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - Automatic sitemap generation
- **JSON-LD Structured Data** - Schema.org markup for Person, WebSite, and BlogPosting
- **Open Graph & Twitter Cards** - Rich social media previews

### Performance
- **[astro-compress](https://github.com/astro-community/astro-compress)** - HTML, CSS, JS, and SVG minification
- **[Sharp](https://sharp.pixelplumbing.com)** - Image optimization
- **Critical CSS Inlining** - Fastest possible First Contentful Paint
- **Font Loading Strategy** - `display=optional` to prevent layout shift
- **Mobile Optimizations** - Disabled animations on mobile for reduced main thread work

## Features

### Interactive Terminal
A fully functional terminal emulator with custom commands:
- `help` - List available commands
- `about` - Display bio information
- `skills` - Show technical skills
- `projects` - List portfolio projects
- `contact` - Display contact information
- `resume` - Download resume
- `github` - View GitHub activity
- `theme` - Toggle light/dark mode
- `clear` - Clear terminal
- Easter eggs: `sudo`, `rm -rf`, `matrix`, `hack`, `ls`, `cat`, and more

### Security Measures

#### Email Obfuscation
Email addresses are stored in reverse and reconstructed at runtime to prevent scraping:
```typescript
// Stored as reversed strings in profile data
email: {
  user: 'oel',      // 'leo' reversed
  website: 'moc.tfarcsahoel'  // 'leoashcraft.com' reversed
}

// Reconstructed when needed
const email = profile.contact.email.user.split('').reverse().join('')
  + '@'
  + profile.contact.email.website.split('').reverse().join('');
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
- Repository statistics display
- Cached responses for performance

## Project Structure

```
src/
├── components/
│   ├── common/          # Header, Footer, SEO
│   ├── contact/         # Contact form
│   ├── github/          # GitHub activity components
│   ├── hero/            # Hero section with floating shapes
│   ├── sections/        # About, Experience, Projects, Contact
│   └── terminal/        # Interactive terminal
├── content/
│   ├── blog/            # MDX blog posts
│   └── projects/        # MDX project case studies
├── data/
│   ├── experience.ts    # Work history & education
│   ├── profile.ts       # Personal info & contact
│   └── skills.ts        # Technical skills
├── layouts/
│   └── BaseLayout.astro # Main layout with SEO
├── pages/
│   ├── api/             # Server endpoints
│   ├── blog/            # Blog routes
│   ├── projects/        # Project routes
│   └── index.astro      # Homepage
└── styles/
    └── global.css       # Theme & animations
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
