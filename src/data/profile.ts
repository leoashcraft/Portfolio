export const profile = {
  name: 'Leo Ashcraft',
  title: 'Full Stack Software Developer',
  location: 'Dallas-Fort Worth, TX',
  tagline: 'I Cultivate Digital Excellence',
  description:
    'Full Stack Software Developer with 17+ years of IT experience, specializing in clean, maintainable PHP and JavaScript code. Currently developing solutions at Parker University.',
  bio: `I'm a full-stack software developer with 5+ years of professional experience and 17+ years in tech. I specialize in clean, maintainable code and performance-driven web experiences, with a strong focus on smooth animations, intuitive UI/UX, SEO, Core Web Vitals, and AI search visibility. Currently, I work at Parker University, building fast, polished digital solutions that turn ideas into reality.`,

  availability: ['Open to freelance'],

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
    { value: 17, suffix: '+', label: 'Years Tech Experience' },
    { value: 5, suffix: '+', label: 'Years Development' },
    { value: 6, suffix: '+', label: 'Years Managerial' },
    { value: 33, suffix: '+', label: 'Products Launched' },
  ],

  resumeUrl: '/Ashcraft-Leo-Resume.pdf',
  photoUrl: '/img/Untitled-3.png',
  avatarUrl: '/img/pic.webp',
} as const;

export type Profile = typeof profile;
