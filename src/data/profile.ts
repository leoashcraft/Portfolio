export const profile = {
  name: 'Leo Ashcraft',
  title: 'Full Stack Software Developer',
  location: 'Dallas-Fort Worth, TX',
  tagline: 'I Cultivate Digital Excellence',
  description:
    'Full Stack Software Developer with 15+ years of IT experience, specializing in clean, maintainable PHP and JavaScript code. Currently developing solutions at Parker University.',
  bio: `I'm Leo Ashcraft, a full-stack developer with 15+ years in tech turning ideas into polished digital experiences. My focus: clean code, smooth animations, intuitive user interfaces, and seamless user experiences—all built with SEO and AI visibility in mind. Currently at Parker University building solutions that matter. Whether you have a project in mind or just want to connect—I'd love to hear from you.`,

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
