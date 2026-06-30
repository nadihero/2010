import type {
  Achievement,
  ContactLink,
  Experience,
  Project,
  SiteSettings,
  SkillGroup,
} from "@prisma/client";

export type StringList = string[];

export type SiteSettingsPayload = {
  heroEyebrow: string;
  heroHeadlines: StringList;
  heroName: string;
  heroTagline: string;
  statYears: string;
  statYearsLabel: string;
  statProjects: string;
  statProjectsLabel: string;
  statShipped: string;
  statShippedLabel: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutParagraph3: string;
  aboutSignature: string;
  profileImageUrl: string;
  profileCaption: string;
  contactHeadlines: StringList;
  contactIntro: string;
  contactWhoami: string;
  contactStatus: string;
  contactLocation: string;
  contactEmail: string;
  cvUrl: string;
  githubUrl: string;
  projectsGithubUrl: string;
  footerCopyright: string;
};

export type AchievementPayload = {
  year: string;
  title: string;
  description: string;
  sortOrder?: number;
};

export type ExperiencePayload = {
  period: string;
  title: string;
  company: string;
  type: string;
  description: string;
  tags: string[];
  sortOrder?: number;
};

export type SkillPayload = {
  label: string;
  value: string;
  sortOrder?: number;
};

export type ProjectPayload = {
  num: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string | null;
  sortOrder?: number;
};

export type ContactLinkPayload = {
  label: string;
  href: string;
  text: string;
  sortOrder?: number;
};

function asStringList(value: unknown): StringList {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asTags(value: unknown): string[] {
  return asStringList(value);
}

export function serializeSettings(settings: SiteSettings): SiteSettingsPayload {
  return {
    heroEyebrow: settings.heroEyebrow,
    heroHeadlines: asStringList(settings.heroHeadlines),
    heroName: settings.heroName,
    heroTagline: settings.heroTagline,
    statYears: settings.statYears,
    statYearsLabel: settings.statYearsLabel,
    statProjects: settings.statProjects,
    statProjectsLabel: settings.statProjectsLabel,
    statShipped: settings.statShipped,
    statShippedLabel: settings.statShippedLabel,
    aboutParagraph1: settings.aboutParagraph1,
    aboutParagraph2: settings.aboutParagraph2,
    aboutParagraph3: settings.aboutParagraph3,
    aboutSignature: settings.aboutSignature,
    profileImageUrl: settings.profileImageUrl,
    profileCaption: settings.profileCaption,
    contactHeadlines: asStringList(settings.contactHeadlines),
    contactIntro: settings.contactIntro,
    contactWhoami: settings.contactWhoami,
    contactStatus: settings.contactStatus,
    contactLocation: settings.contactLocation,
    contactEmail: settings.contactEmail,
    cvUrl: settings.cvUrl,
    githubUrl: settings.githubUrl,
    projectsGithubUrl: settings.projectsGithubUrl,
    footerCopyright: settings.footerCopyright,
  };
}

export function serializeAchievement(item: Achievement) {
  return {
    id: item.id,
    year: item.year,
    title: item.title,
    description: item.description,
    sortOrder: item.sortOrder,
  };
}

export function serializeExperience(item: Experience) {
  return {
    id: item.id,
    period: item.period,
    title: item.title,
    company: item.company,
    type: item.type,
    description: item.description,
    tags: asTags(item.tags),
    sortOrder: item.sortOrder,
  };
}

export function serializeSkill(item: SkillGroup) {
  return {
    id: item.id,
    label: item.label,
    value: item.value,
    sortOrder: item.sortOrder,
  };
}

export function serializeProject(item: Project) {
  return {
    id: item.id,
    num: item.num,
    category: item.category,
    title: item.title,
    description: item.description,
    tags: asTags(item.tags),
    repoUrl: item.repoUrl,
    sortOrder: item.sortOrder,
  };
}

export function serializeContactLink(item: ContactLink) {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    text: item.text,
    sortOrder: item.sortOrder,
  };
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTagsInput(tags: string[]): string {
  return tags.join(", ");
}