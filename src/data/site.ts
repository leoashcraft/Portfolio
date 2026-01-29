export const site = {
  footer: {
    tagline: 'Built with Astro and lots of caffeine.',
    disclaimer:
      'Not affiliated with Catch+Release, Hive Mind Social, Radio/TV Broadcast or any other individuals named Leo Ashcraft.',
  },
  sections: {
    about: {
      title: 'What I',
      titleHighlight: 'Offer',
      subtitle: 'Building digital solutions with 17+ years of tech experience',
      availabilityText: 'Open to freelance',
      skillsTitle: 'Technical',
      skillsTitleHighlight: 'Skills',
      servicesTitle: 'What I',
      servicesTitleHighlight: 'Offer',
    },
    experience: {
      title: 'Work',
      titleHighlight: 'Experience',
      subtitle: 'A timeline of my professional journey',
      educationTitle: 'Education &',
      educationTitleHighlight: 'Certifications',
    },
    projects: {
      title: 'Featured',
      titleHighlight: 'Projects',
      subtitle: 'A selection of work I\'m proud of',
      otherTitle: 'More',
      otherTitleHighlight: 'Work',
    },
    contact: {
      title: 'Get In',
      titleHighlight: 'Touch',
      subtitle: 'Have a project in mind? Let\'s talk about how I can help.',
      connectTitle: 'Let\'s Connect',
      connectDescription:
        'I\'m currently open to new opportunities and interesting projects. Whether you have a question or just want to say hi, I\'ll do my best to get back to you!',
      formTitle: 'Send a Message',
    },
  },
} as const;

export type Site = typeof site;
