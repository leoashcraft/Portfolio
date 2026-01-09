export interface Experience {
  company: string;
  position: string;
  period: string;
  startDate: string;
  endDate: string | 'Current';
  location?: string;
  highlights: string[];
}

export const experience: Experience[] = [
  {
    company: 'Parker University',
    position: 'Software Developer',
    period: 'Sep 2024 - Current',
    startDate: '2024-09',
    endDate: 'Current',
    location: 'Dallas, TX',
    highlights: [
      'Constructed front-end and PHP-based back-end systems for Parker.edu, ParkerSeminars.com, and TheInvictaProject.org',
      'Fabricated custom WordPress plugins for Salesforce, Twilio, and SearchStax integration, boosting student enrollment by 25%',
      'Devised advanced student registration with Salesforce API/SOQL, integrating Jenzabar, TargetX, and Salesforce Communities',
      'Orchestrated SMS campaign API with 10DLC authorization via The Campaign Registry',
      'Introduced multi-domain search functionality via SearchStax API',
    ],
  },
  {
    company: 'Strategic Fulfillment Group',
    position: 'Software Developer',
    period: 'Jul 2022 - Apr 2024',
    startDate: '2022-07',
    endDate: '2024-04',
    location: 'Dallas, TX',
    highlights: [
      'Innovated bug tracking processes, resulting in 80% reduction in reported bugs for client projects',
      'Composed Laravel backend codebase for thedefaultgroup.com, integrating Hubspot CRM',
      'Fashioned internal WordPress plugins for a large client, streamlining project-specific needs',
      'Revitalized VBA Excel macros for Flowserve, drastically improving client workflow efficiency',
    ],
  },
  {
    company: 'Texas Health & Human Services',
    position: 'Network Specialist II',
    period: 'Apr 2017 - Jul 2022',
    startDate: '2017-04',
    endDate: '2022-07',
    location: 'Austin, TX',
    highlights: [
      'Piloted project planning, execution, and troubleshooting for the HHSC IT enterprise network',
      'Optimized monitoring systems for 40,000+ devices across 700 locations, identifying and resolving 150+ network issues monthly',
      'Oversaw major network outages and led recovery efforts, minimizing downtime and ensuring business continuity',
      'Directed ServiceNow ticket queues, coordinating with cross-functional teams for efficient issue resolution',
    ],
  },
  {
    company: 'Premier Eyecare',
    position: 'Director of Operations',
    period: 'Jan 2016 - Apr 2017',
    startDate: '2016-01',
    endDate: '2017-04',
    location: 'Austin, TX',
    highlights: [
      'Guided day-to-day operations of the optometry practice, including staff management and patient services',
      'Launched new electronic health records system, improving patient data management and accessibility',
      'Orchestrated marketing initiatives that increased patient base by 20%',
    ],
  },
  {
    company: 'GGIS, LTD, LLP',
    position: 'Director of IT Operations',
    period: 'Jan 2015 - Jan 2016',
    startDate: '2015-01',
    endDate: '2016-01',
    location: 'Remote',
    highlights: [
      'Directed IT operations for multiple geographically distributed sites',
      'Pioneered virtualization initiatives, reducing hardware costs by 40%',
      'Implemented disaster recovery protocols ensuring 99.9% uptime',
    ],
  },
  {
    company: 'Lifespan Resources of Texas',
    position: 'Director of IT Operations',
    period: 'Jan 2011 - Jan 2015',
    startDate: '2011-01',
    endDate: '2015-01',
    location: 'Austin, TX',
    highlights: [
      'Managed complete IT infrastructure for a healthcare nonprofit organization',
      'Deployed secure HIPAA-compliant systems for patient data protection',
      'Built custom reporting solutions that improved operational efficiency by 35%',
    ],
  },
];

export interface Education {
  institution: string;
  degree: string;
  year: string;
  description: string;
  skills: string[];
  credentialUrl?: string;
}

export const education: Education[] = [
  {
    institution: 'Meta',
    degree: 'Front-End Development Professional Certificate',
    year: '2023',
    description: 'Obtained React experience, enhancing UX/UI skills with HTML, CSS, JavaScript, and React.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'UX/UI'],
    credentialUrl: 'https://web.archive.org/web/20251116093515/https://www.coursera.org/account/accomplishments/specialization/certificate/PVARJGKHEXDX',
  },
  {
    institution: 'Coding Temple',
    degree: 'Data Analysis Bootcamp',
    year: '2022',
    description: 'Acquired skills in Python, SQL, MongoDB, and other technologies through real-world projects.',
    skills: ['Python', 'SQL', 'MongoDB', 'Data Analysis'],
    credentialUrl: 'https://web.archive.org/web/20251116093515/https://www.credly.com/users/leo-ashcraft/badges',
  },
  {
    institution: 'Coding Temple',
    degree: 'Software Engineering Bootcamp',
    year: '2021',
    description: 'Gained hands-on expertise in Docker, GitHub, TypeScript, React, MySQL, HTML5, and CSS3.',
    skills: ['Docker', 'TypeScript', 'React', 'MySQL', 'GitHub'],
    credentialUrl: 'https://web.archive.org/web/20251116093515/https://www.credly.com/users/leo-ashcraft/badges',
  },
  {
    institution: 'Penn Foster',
    degree: 'High School Diploma',
    year: '2007',
    description: 'Computer Programming and Information Technology/Computer Science were among my chosen electives.',
    skills: ['Computer Programming', 'Information Technology'],
  },
];

export const certifications = [
  {
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta (via Coursera)',
    year: '2023',
    credentialId: 'Verified',
  },
  {
    name: 'Salesforce Administrator',
    issuer: 'Salesforce',
    year: '2024',
    credentialId: 'In Progress',
  },
];

export const passions = [
  {
    name: 'Open Source',
    description: 'Contributing to and learning from the open source community',
    icon: '🌐',
  },
  {
    name: 'Automation',
    description: 'Building tools that eliminate repetitive tasks and improve workflows',
    icon: '🤖',
  },
  {
    name: 'Clean Code',
    description: 'Writing maintainable, readable, and well-documented code',
    icon: '✨',
  },
  {
    name: 'Continuous Learning',
    description: 'Always exploring new technologies and best practices',
    icon: '📚',
  },
  {
    name: 'Problem Solving',
    description: 'Finding elegant solutions to complex technical challenges',
    icon: '🧩',
  },
];
