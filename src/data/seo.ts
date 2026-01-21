export const seo = {
  siteTitle: 'Leo Ashcraft | Software Engineer',
  siteDescription:
    'Leo Ashcraft is a software engineer and technology director with over 15 years of experience in web development, Salesforce integrations, and higher education systems.',
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
  },
  alumniOf: {
    type: 'EducationalOrganization' as const,
    name: 'Coding Temple',
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
