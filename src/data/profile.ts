export const profile = {
  name: 'Leo Ashcraft',
  title: 'Full Stack Software Developer',
  location: 'Dallas-Fort Worth, TX',
  tagline: 'I Cultivate Digital Excellence',
  description:
    'Full Stack Software Developer with 15+ years of IT experience, specializing in clean, maintainable PHP and JavaScript code. Currently developing solutions at Parker University.',
  bio: `I'm Leo Ashcraft, a software engineer with 15+ years of IT experience and 5+ years of dedicated software engineering.

I've been programming as a hobby since before my technical career began, and have written production PHP, JavaScript, HTML/CSS, and SQL across healthcare, education, government, and private-sector organizations - building intranets, portals, automation tools, and customer-facing applications that replaced manual workflows and delivered measurable outcomes. I've had the privilege of building solutions for organizations like The Smithsonian Institute, Mayo Clinic, and Texas Parks and Wildlife.

My career has consistently involved building and maintaining software systems, even before my roles were formally titled "Software Developer." Over the last 5–6 years, development became my primary focus, reflected in my roles at SFG and Parker University.

Currently at Parker University, I develop front-end and PHP-based back-end systems, create custom WordPress plugins, and architect API integrations. My focus is on creating clean, efficient, and maintainable code that solves real business problems.

Outside of work, I build React-based side projects to stay sharp and explore modern tooling - from trip planners to community platforms to family organizers.`,

  availability: ['Open to W2 Roles', 'Accepting Select Freelance'],

  // Obfuscated contact info (reversed for spam protection)
  contact: {
    phone: { area: ')309(', number: '2874-836' },
    email: { user: 'oel', website: 'hcet.tfarchsa' },
  },

  social: {
    linkedin: 'https://linkedin.com/in/leo3',
    github: 'https://github.com/leoashcraft',
  },

  stats: [
    { value: 15, suffix: '+', label: 'Years Tech Experience' },
    { value: 5, suffix: '+', label: 'Years Development' },
    { value: 6, suffix: '+', label: 'Years Managerial' },
    { value: 33, suffix: '+', label: 'Products Launched' },
  ],

  resumeUrl: '/Ashcraft-Leo-Resume.pdf',
  photoUrl: '/img/Untitled-3.png',
  avatarUrl: '/img/pic.webp',
} as const;

export type Profile = typeof profile;
