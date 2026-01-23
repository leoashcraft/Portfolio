export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'language' | 'framework' | 'tool' | 'platform';
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    name: 'Languages',
    skills: [
      { name: 'PHP', level: 85, category: 'language' },
      { name: 'JavaScript', level: 80, category: 'language' },
      { name: 'TypeScript', level: 70, category: 'language' },
      { name: 'HTML5', level: 90, category: 'language' },
      { name: 'CSS3/SASS', level: 90, category: 'language' },
      { name: 'SQL', level: 75, category: 'language' },
      { name: 'Python', level: 60, category: 'language' },
    ],
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'Laravel', level: 85, category: 'framework' },
      { name: 'React', level: 75, category: 'framework' },
      { name: 'Next.js', level: 70, category: 'framework' },
      { name: 'Vue.js', level: 65, category: 'framework' },
      { name: 'Node.js', level: 70, category: 'framework' },
      { name: 'WordPress', level: 85, category: 'framework' },
      { name: 'Tailwind CSS', level: 90, category: 'framework' },
    ],
  },
  {
    name: 'Tools & Platforms',
    skills: [
      { name: 'Git/GitHub', level: 85, category: 'tool' },
      { name: 'Docker', level: 70, category: 'tool' },
      { name: 'AWS', level: 65, category: 'platform' },
      { name: 'Salesforce', level: 75, category: 'platform' },
      { name: 'Jenkins', level: 60, category: 'tool' },
      { name: 'REST APIs', level: 90, category: 'tool' },
    ],
  },
];

export const technologies = [
  'Laravel',
  'React',
  'Next.js',
  'Vue.js',
  'Node.js',
  'PHP',
  'JavaScript',
  'TypeScript',
  'Python',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'Git',
  'GitHub',
  'WordPress',
  'Tailwind CSS',
  'Salesforce',
  'Twilio',
  'REST APIs',
  'GraphQL',
] as const;

export type Technology = (typeof technologies)[number];

export const services = [
  {
    title: 'Web & Software Development',
    description:
      '<span class="hover-underline-trigger">clean, maintainable code</span> for web applications, custom software solutions, and API integrations using modern frameworks like Laravel and React.',
    icon: 'code',
    features: [
      'Full-stack web applications',
      'Custom WordPress development',
      'API design & integration',
      'Database architecture',
    ],
  },
  {
    title: 'Cloud Solutions & DevOps',
    description:
      'AWS infrastructure setup, deployment pipelines, and containerization to ensure your applications <span class="hover-underline-trigger">scale reliably and securely</span>.',
    icon: 'cloud',
    features: [
      'AWS setup & management',
      'CI/CD pipelines',
      'Docker containerization',
      'Performance optimization',
    ],
  },
  {
    title: 'CRM & Integration Solutions',
    description:
      '<span class="hover-underline-trigger">Seamless integration</span> of Salesforce, HubSpot, and other business platforms to streamline your workflows and <span class="hover-underline-trigger">improve data consistency</span>.',
    icon: 'puzzle',
    features: [
      'Salesforce integration',
      'HubSpot automation',
      'Third-party API connections',
      'Data synchronization',
    ],
  },
];
