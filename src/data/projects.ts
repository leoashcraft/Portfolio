export interface SubSubProject {
  title: string;
  description: string;
  image: string;
  live?: string;
}

export interface SubProject {
  title: string;
  description: string;
  image: string;
  live?: string;
  subProjects?: SubSubProject[];
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  metrics: string[];
  github: string | null;
  live: string | null;
  featured: boolean;
  subProjects?: SubProject[];
}

export const projects: Project[] = [
  {
    title: 'Parker University Web Systems',
    description:
      'Full-stack development for multiple university domains including Parker.edu, ParkerSeminars.com, and TheInvictaProject.org',
    image: '/img/featured/featured-parker.avif',
    tags: ['PHP', 'WordPress', 'Salesforce', 'Twilio'],
    metrics: ['25% enrollment increase', '10DLC SMS campaigns'],
    github: null,
    live: null,
    featured: true,
    subProjects: [
      {
        title: 'Parker.edu',
        description: 'Main university website with student portal integration',
        image: '/img/featured/featured-parker.avif',
        subProjects: [
          {
            title: 'Main University Website',
            description: 'Primary web presence for Parker University',
            image: '/img/featured/featured-parker.avif',
            live: 'https://parker.edu',
          },
          {
            title: 'Career Pathways',
            description: 'Student career guidance and planning portal',
            image: '/img/featured/featured-pathways.avif',
            live: 'https://www.parker.edu/pathways',
          },
          {
            title: 'SearchStax Search Integration',
            description: 'Advanced search functionality across university content',
            image: '/img/featured/featured-search.avif',
            live: 'https://www.parker.edu/search',
          },
          {
            title: 'Parker Salesforce Integration',
            description: 'CRM integration for enrollment management',
            image: '/img/featured/featured-app.avif',
            live: 'https://parker.edu/application',
          },
        ],
      },
      {
        title: 'Parker Seminars',
        description: 'Continuing education and seminar registration platform',
        image: '/img/featured/featured-ps.avif',
        live: 'https://parkerseminars.com',
      },
      {
        title: 'The Invicta Project',
        description: 'Student wellness and mental health initiative',
        image: '/img/featured/featured-invicta.avif',
        live: 'https://theinvictaproject.org',
      },
      {
        title: 'Parker Performance Institute',
        description: 'Sports performance and athletic training center',
        image: '/img/featured/featured-ppi.avif',
        live: 'https://parkerperformanceinstitute.com',
      },
    ],
  },
  {
    title: 'Roadtrip Beaver',
    description:
      "The #1 Buc-ee's trip planner. Find all locations, plan your route, and never miss the brisket or beaver nuggets.",
    image: '/img/featured/featured-roadtrip.avif',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    metrics: ['50% performance boost', 'Real-time updates'],
    github: null,
    live: 'https://roadtripbeaver.com',
    featured: true,
  },
  {
    title: 'Navarro County Connect',
    description:
      'Community hub for Corsicana and surrounding areas. Discover local restaurants, events, jobs, and services.',
    image: '/img/featured/featured-navarro.avif',
    tags: ['TypeScript', 'Next.js', 'MongoDB', 'Docker'],
    metrics: ['99.9% uptime', 'Scalable architecture'],
    github: null,
    live: 'https://navarrocounty.com',
    featured: true,
  },
  {
    title: 'Clan Compass',
    description:
      'All-in-one family planner with shared calendar, meal planning, chore management, and smart lists.',
    image: '/img/featured/featured-clan.avif',
    tags: ['Vue.js', 'Python', 'Redis', 'GraphQL'],
    metrics: ['40% cost reduction', 'Automated workflows'],
    github: null,
    live: 'https://clancompass.com',
    featured: true,
  },
  {
    title: 'Personal Family Organizer',
    description:
      'React-based application for family task management and scheduling',
    image: '/img/portfolio/lists.webp',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    metrics: ['Real-time sync', 'Mobile responsive'],
    github: 'https://github.com/leoashcraft',
    live: null,
    featured: false,
  },
  {
    title: 'DOCX Search & Replace',
    description:
      'Python utility for batch processing and text replacement in Word documents',
    image: '/img/portfolio/docx-search-replace.webp',
    tags: ['Python', 'python-docx', 'CLI'],
    metrics: ['Batch processing', 'Regex support'],
    github: 'https://github.com/leoashcraft',
    live: null,
    featured: false,
  },
  {
    title: 'Radio Daddy Archive',
    description:
      'Web archive and streaming platform for vintage radio broadcasts',
    image: '/img/portfolio/radiodaddy.webp',
    tags: ['PHP', 'MySQL', 'Audio Streaming'],
    metrics: ['1000+ broadcasts', 'Search indexing'],
    github: null,
    live: null,
    featured: false,
  },
  {
    title: 'Lindale IT Services',
    description: 'WordPress website for local IT services company',
    image: '/img/portfolio/lindaleit.webp',
    tags: ['WordPress', 'Elementor', 'SEO'],
    metrics: ['Mobile optimized', 'Local SEO'],
    github: null,
    live: null,
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
