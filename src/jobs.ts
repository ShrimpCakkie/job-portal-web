export type Job = {
  id: string;
  company: 'Google' | 'Airbnb' | 'Spotify';
  brand: 'google' | 'airbnb' | 'spotify';
  title: string;
  location: 'New York' | 'Sydney' | 'Remote';
  experience: string;
  schedule: 'Fulltime' | 'Part-time';
  posted: string;
  salary: string;
  preview: string;
  description: string;
  requirements: readonly string[];
  role: string;
  benefits: string;
  closed?: boolean;
};

const designPreview =
  "UX Designers are the synthesis of design and development. They take Google's most innovative product concepts";
const designDescription =
  "In a UX Designer job, you'll need both types of skills to develop the next generation of products. You'll partner with Researchers and Designers to define and deliver new features.";
const designRequirements = [
  '3 years experience',
  'Degree in Computer Science, Psychology, Design or any other related fields.',
  'Proficiency in User Personas, Competitive Analysis, Empathy Maps and Information Architecture.',
] as const;

const google: Job = {
  id: 'google-ux-designer',
  brand: 'google',
  company: 'Google',
  title: 'Sr. UX Designer',
  location: 'New York',
  experience: '3 years exp.',
  schedule: 'Fulltime',
  posted: 'Posted 2 days ago',
  salary: '$50K/mo',
  preview: designPreview,
  description: designDescription,
  requirements: designRequirements,
  role: 'Help evolve enterprise design systems at Google. Create shareable web components and collaborate with researchers, designers and engineers across product areas.',
  benefits: 'Flexible working arrangements, learning opportunities and time to support the teams you work with.',
};

const airbnb: Job = {
  id: 'airbnb-project-manager',
  brand: 'airbnb',
  company: 'Airbnb',
  title: 'Project Manager',
  location: 'Sydney',
  experience: '1-5 years exp.',
  schedule: 'Part-time',
  posted: 'Posted 5 days ago',
  salary: '$25K/mo',
  preview: 'Airbnb was born in 2007 when two Hosts welcomed three guests to their San Francisco home,',
  description: 'Help a cross-functional team plan and deliver projects that improve the experience for Airbnb hosts and guests. Keep ownership and milestones clear as the team moves from idea to launch.',
  requirements: [
    '1–5 years of project management or equivalent experience.',
    'Experience tracking milestones and coordinating cross-functional teams.',
    'Clear written communication and stakeholder management skills.',
  ],
  role: 'Maintain project plans, surface dependencies and communicate progress across design, operations and engineering.',
  benefits: 'A part-time schedule and opportunities to work with teams across markets.',
};

const spotify: Job = {
  id: 'spotify-graphic-designer',
  brand: 'spotify',
  company: 'Spotify',
  title: 'Graphic Designer',
  location: 'Remote',
  experience: 'Freshers',
  schedule: 'Fulltime',
  posted: 'Posted 2 days ago',
  salary: '$50K/mo',
  preview: designPreview,
  description: designDescription,
  requirements: designRequirements,
  role: 'Develop visuals for digital campaigns, playlists and editorial features. Adapt artwork across formats and collaborate with the teams that publish it.',
  benefits: 'Remote work, creative mentorship and opportunities to contribute to editorial and brand projects.',
};

const closedGoogle: Job = {
  ...google,
  id: 'google-interaction-designer',
  title: 'Interaction Designer',
  posted: 'Applications closed',
  closed: true,
};

export const jobs: readonly Job[] = [google, airbnb, spotify, closedGoogle];

export const locations = [...new Set(jobs.map(job => job.location))];
export const schedules = [...new Set(jobs.map(job => job.schedule))];
