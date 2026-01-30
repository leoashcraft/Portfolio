export const profile = {
  name: 'Leo Ashcraft',
  title: 'Full Stack Software Developer',
  location: 'Dallas-Fort Worth, TX',
  tagline: 'I Cultivate Digital Excellence',
  description:
    'Full Stack Software Developer with 17+ years of IT experience, specializing in clean, maintainable PHP and JavaScript code. Currently developing solutions at Parker University.',
  bio: `I'm a full-stack software developer with 5+ years of professional software development experience and 17+ years in technology overall, turning ideas into fast, polished digital experiences. I focus on clean, maintainable code, smooth animations, intuitive UI/UX, and performance-driven websites built with SEO, Core Web Vitals, and AI search visibility in mind. Currently at Parker University, building web solutions that matter.`,

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
