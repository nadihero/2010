const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultSettings = {
  id: "singleton",
  heroEyebrow: "// Developer & Tech Enthusiast.",
  heroHeadlines: ["Ideate.", "Execute.", "Scale."],
  heroName: "Asdarium D.",
  heroTagline:
    "Architecting scalable web applications, RESTful APIs, and production-ready systems for 4+ years.",
  statYears: "4+",
  statYearsLabel: "Years Exp",
  statProjects: "10+",
  statProjectsLabel: "Projects Done",
  statShipped: "100%",
  statShippedLabel: "Shipped",
  aboutParagraph1:
    "Hey! I'm Asdarium — a full-stack web developer passionate about dreaming up ideas and making them come true with elegant interfaces. I take great care in the experience, architecture, and code quality of everything I build. With 4+ years across the full software development lifecycle, I specialize in scalable web applications, business automation systems, and RESTful APIs from architecture through deployment and production maintenance.",
  aboutParagraph2:
    "My journey spans freelance full-stack delivery, high-traffic SMM panel platforms, internal HR systems for mining operations, and open-source projects ranging from e-voting platforms to digital invitation systems. I am an advocate for clean code, agile workflows, and building systems designed for scale and production resilience.",
  aboutParagraph3:
    "Outside of programming, I enjoy continuous learning — from AI engineering bootcamps to the latest in modern web tooling. I believe collaboration and knowledge sharing through open-source makes the entire industry stronger.",
  aboutSignature: "— Asdarium D., Full-Stack Web Developer",
  profileImageUrl: "/asdar.jpg",
  profileCaption: "Photo / Asdarium D. / 2026",
  contactHeadlines: ["Let's", "Work", "Together."],
  contactIntro:
    "Available for freelance & full-time opportunities. Based in Kolaka, Southeast Sulawesi, Indonesia — ready for remote or on-site work. Response within 24 hours.",
  contactWhoami: "Full-Stack Web Developer",
  contactStatus: "● ONLINE & READY TO BUILD",
  contactLocation: "Kolaka, Southeast Sulawesi, Indonesia",
  contactEmail: "asdarhmd24@gmail.com",
  cvUrl: "/CV_Asdarium.pdf",
  githubUrl: "https://github.com/nadihero",
  projectsGithubUrl: "https://github.com/nadihero",
  footerCopyright: "© 2026 Asdarium D. — The Asdarium Gazette. All rights reserved.",
};

const achievements = [
  {
    year: "2026",
    title: "Claude Code 101",
    description:
      "Certified by Anthropic. Credential ID: j9cs8ngovue9 — mastering AI-assisted development workflows.",
    sortOrder: 0,
  },
  {
    year: "2026",
    title: "AI Engineering Bootcamp",
    description:
      "Ruangguru Engineering Academy, Batch 12. Credential ID: REAENG12YBOSE — end-to-end AI system design.",
    sortOrder: 1,
  },
  {
    year: "2020",
    title: "SIAPkerja Training",
    description:
      "Basic computer & data processing certification through SIAPkerja (formerly BLK) — foundational IT skills.",
    sortOrder: 2,
  },
  {
    year: "2021–2022",
    title: "SMM Platform at Scale",
    description:
      "Built and maintained high-traffic SMM panel serving thousands of active users with real-time API integrations.",
    sortOrder: 3,
  },
  {
    year: "2022–2023",
    title: "Enterprise IT Support",
    description:
      "Maintained internal HR software ecosystem for mining operations with 99%+ system availability.",
    sortOrder: 4,
  },
  {
    year: "Ongoing",
    title: "Open Source Contributor",
    description:
      "Active on GitHub with public repositories spanning e-voting, inventory management, and digital invitations.",
    sortOrder: 5,
  },
];

const experiences = [
  {
    period: "July 2022 — April 2023",
    title: "IT Staff",
    company: "PT. Mineral Sultra Semesta",
    type: "FULL-TIME",
    description:
      "Maintained and supported the company's internal HR software ecosystem, ensuring high system availability for mining workflows. Identified, debugged, and resolved critical software errors, collaborated with internal departments for rapid hotfix deployment, and optimized application reliability through log analysis and workflow streamlining.",
    tags: ["IT SUPPORT", "DEBUGGING", "HR SYSTEMS"],
    sortOrder: 0,
  },
  {
    period: "March 2021 — December 2022",
    title: "Web Developer",
    company: "Liastakano.com",
    type: "FULL-TIME",
    description:
      "Developed and maintained a high-traffic SMM Panel platform with end-to-end full-stack ownership. Integrated multiple third-party provider APIs for real-time order processing, designed optimized database architectures for high-frequency transactions, and delivered a fast, responsive, minimalist UI for thousands of active users.",
    tags: ["NEXT.JS", "REST API", "MYSQL", "SCALABILITY"],
    sortOrder: 1,
  },
  {
    period: "October 2020 — March 2021",
    title: "Junior Web Developer",
    company: "Freelance",
    type: "FREELANCE",
    description:
      "Delivered end-to-end full-stack web solutions for diverse clients — from requirement gathering to deployment and hosting. Built responsive, pixel-perfect UIs, integrated robust backend architectures and third-party APIs, and maintained agile communication to deliver high-quality projects on strict timelines.",
    tags: ["FULL-STACK", "RESPONSIVE UI", "API INTEGRATION"],
    sortOrder: 2,
  },
];

const skills = [
  { label: "Frontend", value: "Next.js, Tailwind CSS, Bootstrap, HTML5, CSS3", sortOrder: 0 },
  { label: "Backend", value: "Node.js, FastAPI, PHP, JWT, NextAuth.js", sortOrder: 1 },
  { label: "Database", value: "PostgreSQL, MySQL, MongoDB, Prisma, Sequelize", sortOrder: 2 },
  { label: "Tools & QA", value: "Git, GitHub, Jest, Zustand, Unit Testing", sortOrder: 3 },
];

const projects = [
  {
    num: "01 / FEATURED",
    category: "WEB DEV",
    title: "E-Voting Platform for School",
    description:
      "A secure and responsive digital voting web application designed to automate and streamline the student council election process. Built with modern full-stack architecture ensuring transparency, accessibility, and real-time result tabulation.",
    tags: ["NEXT.JS", "NODE.JS", "POSTGRESQL"],
    repoUrl: "https://github.com/nadihero",
    sortOrder: 0,
  },
  {
    num: "02",
    category: "WEB DEV",
    title: "Ghibran Motor Management",
    description:
      "Comprehensive app management system engineered to streamline inventory tracking, parts procurement, and service workflows for an automotive business. End-to-end solution from stock management to service scheduling.",
    tags: ["FULL-STACK", "INVENTORY", "MYSQL"],
    repoUrl: "https://github.com/nadihero",
    sortOrder: 1,
  },
  {
    num: "03",
    category: "WEB DEV",
    title: "Tawaharu — Digital Invitations",
    description:
      "Digital invitation platform enabling users to dynamically customize, manage, and deploy personalized event invitations. Features template customization, RSVP management, and shareable invitation links.",
    tags: ["NEXT.JS", "TAILWIND", "MONGODB"],
    repoUrl: "https://github.com/nadihero",
    sortOrder: 2,
  },
  {
    num: "04",
    category: "SYSTEMS",
    title: "Operator & Driver HM Report",
    description:
      "Specialized digital tracking and reporting system for heavy equipment Hour Meter (HM) logging and operator timesheet management. Streamlines field data collection and generates actionable operational reports.",
    tags: ["TRACKING", "REPORTING", "FASTAPI"],
    repoUrl: "https://github.com/nadihero",
    sortOrder: 3,
  },
];

const contactLinks = [
  {
    label: "Email",
    href: "mailto:asdarhmd24@gmail.com",
    text: "asdarhmd24@gmail.com ↗",
    sortOrder: 0,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/asdarium",
    text: "linkedin.com/in/asdarium ↗",
    sortOrder: 1,
  },
  {
    label: "GitHub",
    href: "https://github.com/nadihero",
    text: "github.com/nadihero ↗",
    sortOrder: 2,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6282259680503",
    text: "+62 822-5968-0503 ↗",
    sortOrder: 3,
  },
];

const tilDefaults = [
  {
    date: new Date("2026-06-26"),
    title: "Claude Code workflows",
    description:
      "AI-assisted development can dramatically speed up boilerplate generation while keeping architecture decisions human-driven.",
    codeSnippet: null,
  },
  {
    date: new Date("2026-06-20"),
    title: "Prisma batch operations",
    description:
      "Using createMany with skipDuplicates for efficient bulk inserts in high-frequency transaction systems.",
    codeSnippet: "createMany",
  },
  {
    date: new Date("2026-06-12"),
    title: "Next.js App Router caching",
    description:
      "Understanding revalidatePath vs revalidateTag for granular ISR control.",
    codeSnippet: "revalidatePath | revalidateTag",
  },
  {
    date: new Date("2026-06-05"),
    title: "FastAPI dependency injection",
    description:
      "Leveraging Depends() for clean, testable auth middleware patterns.",
    codeSnippet: "Depends()",
  },
  {
    date: new Date("2026-05-30"),
    title: "CSS column layouts",
    description:
      "Newspaper-style multi-column text with column-rule for authentic print aesthetics on the web.",
    codeSnippet: "column-rule",
  },
];

async function seedCollection(name, count, createMany, data) {
  if (count > 0) {
    console.log(`${name} already exist, skipping.`);
    return;
  }
  await createMany({ data });
  console.log(`Seeded ${data.length} ${name}.`);
}

async function main() {
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({ data: defaultSettings });
    console.log("Seeded site settings.");
  } else {
    console.log("Site settings already exist, skipping.");
  }

  await seedCollection(
    "achievements",
    await prisma.achievement.count(),
    prisma.achievement.createMany.bind(prisma.achievement),
    achievements
  );
  await seedCollection(
    "experiences",
    await prisma.experience.count(),
    prisma.experience.createMany.bind(prisma.experience),
    experiences
  );
  await seedCollection(
    "skill groups",
    await prisma.skillGroup.count(),
    prisma.skillGroup.createMany.bind(prisma.skillGroup),
    skills
  );
  await seedCollection(
    "projects",
    await prisma.project.count(),
    prisma.project.createMany.bind(prisma.project),
    projects
  );
  await seedCollection(
    "contact links",
    await prisma.contactLink.count(),
    prisma.contactLink.createMany.bind(prisma.contactLink),
    contactLinks
  );
  await seedCollection(
    "TIL entries",
    await prisma.tilEntry.count(),
    prisma.tilEntry.createMany.bind(prisma.tilEntry),
    tilDefaults
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });