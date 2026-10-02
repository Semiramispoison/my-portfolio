export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  role: string;
  tools: string[];
  description: string;
  process?: string;
  result?: string;
  accent: string;
}

export interface Skill {
  name: string;
  level: number;
  tools: string[];
  description: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  category: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export const profile = {
  name: "JOHN BENEDICT VILLAMOR",
  roles: ["ARTIST", "DESIGNER", "CREATIVE"],
  status: "AVAILABLE FOR CREATIVE WORK",
  location: "PHILIPPINES",
  bio: [
    "I am a multidisciplinary creative bridging the gap between art, design, and technology. With a keen eye for aesthetics and a drive for storytelling, I create immersive digital experiences.",
    "My approach combines bold visual languages with smooth interactive elements, ensuring every project not only looks striking but feels intuitive and engaging."
  ],
  specialties: ["Illustration", "Character Design", "Motion Graphics", "UI/UX Design", "Web Development", "Storytelling"],
  skills: [
    { name: 'Digital Illustration', level: 90 },
    { name: 'Character Design', level: 85 },
    { name: 'UI/UX Design', level: 80 },
    { name: 'Motion Graphics', level: 75 }
  ]
};

export const projects: Project[] = [
  {
    id: "project-1",
    number: "01",
    title: "LAGGING OUT!",
    category: "Children's Ebook/Animation",
    year: "2026",
    role: "Art+Story",
    tools: ["Procreate", "After Effects", "Figma"],
    description: "An interactive children's book exploring digital well-being through captivating animations and storytelling.",
    accent: "#2B7FFF"
  },
  {
    id: "project-2",
    number: "02",
    title: "Placeholder 2",
    category: "Illustration/Design",
    year: "2025",
    role: "Lead Designer",
    tools: ["Photoshop", "Illustrator"],
    description: "A comprehensive brand identity and illustration system for a modern tech startup.",
    accent: "#00D4FF"
  },
  {
    id: "project-3",
    number: "03",
    title: "Placeholder 3",
    category: "Web/Interactive",
    year: "2025",
    role: "Frontend Developer",
    tools: ["React", "TypeScript", "Framer Motion"],
    description: "A high-performance interactive portfolio demonstrating complex animations and state management.",
    accent: "#FF3B7A"
  },
  {
    id: "project-4",
    number: "04",
    title: "Placeholder 4",
    category: "Motion/Video",
    year: "2024",
    role: "Motion Designer",
    tools: ["After Effects", "Premiere Pro"],
    description: "A series of kinetic typography and motion graphics pieces exploring rhythm and typography.",
    accent: "#FFB224"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: "ill",
    title: "ILLUSTRATION",
    skills: [
      { name: "Digital Painting", level: 90, tools: ["Procreate", "Photoshop"], description: "Creating detailed digital artworks." },
      { name: "Vector Art", level: 85, tools: ["Illustrator"], description: "Scalable graphics and iconography." }
    ]
  },
  {
    id: "des",
    title: "DESIGN",
    skills: [
      { name: "UI/UX", level: 80, tools: ["Figma"], description: "Crafting intuitive user interfaces." },
      { name: "Branding", level: 75, tools: ["Illustrator", "InDesign"], description: "Developing cohesive brand identities." }
    ]
  },
  {
    id: "ani",
    title: "ANIMATION",
    skills: [
      { name: "Motion Graphics", level: 85, tools: ["After Effects"], description: "Kinetic typography and 2D animation." },
      { name: "Frame-by-Frame", level: 70, tools: ["Procreate", "Animate"], description: "Traditional style digital animation." }
    ]
  },
  {
    id: "sto",
    title: "STORYTELLING",
    skills: [
      { name: "Storyboarding", level: 80, tools: ["Procreate", "Photoshop"], description: "Visualizing narratives." },
      { name: "Creative Writing", level: 75, tools: ["Notion"], description: "Developing engaging concepts." }
    ]
  },
  {
    id: "web",
    title: "WEB",
    skills: [
      { name: "Frontend", level: 85, tools: ["React", "TypeScript"], description: "Building interactive web applications." },
      { name: "Animations", level: 80, tools: ["Framer Motion", "CSS"], description: "Implementing smooth web transitions." }
    ]
  }
];

export const timeline: TimelineEntry[] = [
  {
    year: "2026",
    title: "Freelance Creative Director",
    description: "Leading creative projects for various international clients.",
    category: "Work"
  },
  {
    year: "2025",
    title: "Senior UI/UX Designer",
    description: "Designed enterprise-level applications with a focus on accessibility.",
    category: "Work"
  },
  {
    year: "2024",
    title: "Motion Designer",
    description: "Created marketing materials and explainer videos.",
    category: "Work"
  },
  {
    year: "2023",
    title: "Bachelor of Arts in Multimedia Arts",
    description: "Graduated with honors, specializing in digital illustration.",
    category: "Education"
  }
];

export const socialLinks: SocialLink[] = [
  { label: "EMAIL", url: "mailto:hello@example.com" },
  { label: "GITHUB", url: "https://github.com/placeholder" },
  { label: "LINKEDIN", url: "https://linkedin.com/in/placeholder" },
  { label: "INSTAGRAM", url: "https://instagram.com/placeholder" }
];
