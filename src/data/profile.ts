export const profile = {
  name: 'Leo Ashcraft',
  title: 'Full Stack Software Developer',
  location: 'Dallas-Fort Worth, TX',
  tagline: 'I Cultivate Digital Excellence',
  description:
    'Full Stack Software Developer with 15+ years of IT experience, specializing in clean, maintainable PHP and JavaScript code. Currently developing solutions at Parker University.',
  bio: `I'm Leo Ashcraft, a software engineer with over 15 years of IT experience and 5+ years of dedicated development experience.

I've had the privilege of building solutions for organizations like The Smithsonian Institute, Mayo Clinic, and The New York Review of Books. My focus is on creating clean, efficient, and maintainable code that solves real business problems.

Currently at Parker University, I develop front-end and PHP-based back-end systems, create custom WordPress plugins, and architect API integrations that drive measurable results.`,

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
