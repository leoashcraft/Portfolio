export interface SubProject {
  title: string;
  description: string;
  image: string;
  live: string;
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
    image: '/img/portfolio/dashboard.webp',
    tags: ['PHP', 'WordPress', 'Salesforce', 'Twilio'],
    metrics: ['25% enrollment increase', '10DLC SMS campaigns'],
    github: null,
    live: null,
    featured: true,
    subProjects: [
      {
        title: 'Parker.edu',
        description: 'Main university website with student portal integration',
        image: '/img/portfolio/parker-edu.webp',
        live: 'https://parker.edu',
      },
      {
        title: 'Parker Seminars',
        description: 'Continuing education and seminar registration platform',
        image: '/img/portfolio/parker-seminars.webp',
        live: 'https://parkerseminars.com',
      },
      {
        title: 'The Invicta Project',
        description: 'Student wellness and mental health initiative',
        image: '/img/portfolio/invicta-project.webp',
        live: 'https://theinvictaproject.org',
      },
      {
        title: 'Parker Performance Institute',
        description: 'Sports performance and athletic training center',
        image: '/img/portfolio/parker-performance.webp',
        live: 'https://parkerperformance.org',
      },
    ],
  },
  {
    title: 'Strategic Fulfillment Group',
    description:
      'Laravel backend development with HubSpot CRM integration for client project management',
    image: '/img/portfolio/lists.webp',
    tags: ['Laravel', 'PHP', 'HubSpot API', 'MySQL'],
    metrics: ['80% bug reduction', 'VBA automation'],
    github: null,
    live: 'https://thedefaultgroup.com',
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
