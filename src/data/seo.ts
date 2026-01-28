export const seo = {
  siteTitle: 'Leo Ashcraft | Software Engineer',
  siteDescription:
    'Full Stack Software Developer with 15+ years experience in PHP, React, and Salesforce integrations. Based in Dallas-Fort Worth.',
  keywords:
    'Leo Ashcraft, Software Developer, Full Stack Developer, PHP, JavaScript, Laravel, React, Dallas, Web Development',
  themeColor: '#0a0a0f',
} as const;

export const schema = {
  personId: 'https://leoashcraft.com/#person',
  jobTitle: 'Software Engineer',
  worksFor: {
    type: 'Organization' as const,
    name: 'Parker University',
    url: 'https://parker.edu',
  },
  address: {
    type: 'PostalAddress' as const,
    addressLocality: 'Dallas',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  knowsAbout: [
    'Software Engineering',
    'Salesforce API Integration',
    'WordPress Development',
    'Higher Education Technology',
    'Laravel',
    'React',
    'Next.js',
    'Vue.js',
    'Node.js',
    'PHP',
    'JavaScript',
    'TypeScript',
    'Git',
    'GitHub',
    'Docker',
    'AWS',
    'Salesforce',
    'Jenkins',
    'MySQL',
    'PostgreSQL',
    'SEO',
    'Web Performance',
  ],
  sameAs: [
    'https://www.linkedin.com/in/leo3',
    'https://github.com/leoashcraft',
    'https://www.facebook.com/leoashcraft',
    'https://www.instagram.com/leoa_3',
    'https://stackoverflow.com/users/4625370/leo-ashcraft',
  ],
} as const;

export type SEO = typeof seo;
export type Schema = typeof schema;
