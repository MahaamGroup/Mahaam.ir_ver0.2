/**
 * Core Types for Mahaam International Group Website
 */

export interface AudienceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  targetPersonas: string[];
  decisionStage: string;
  conversionObjective: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  challengesTitle: string;
  challenges: {
    title: string;
    description: string;
  }[];
  approachTitle: string;
  approachSteps: {
    title: string;
    description: string;
  }[];
  relevantJourneys: {
    slug: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  finalCta: {
    headline: string;
    description: string;
    buttonText: string;
  };
}

export interface JourneyItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  stageBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  targetAudience: string;
  decisionStage: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  overviewTitle: string;
  overviewDescription: string;
  steps: {
    stepNumber: string;
    title: string;
    description: string;
  }[];
  suitability: {
    suitableFor: string[];
    considerations: string[];
  };
  expectedOutcomes: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  finalCta: {
    headline: string;
    description: string;
    buttonText: string;
  };
}

export interface AssessmentQuestion {
  id: number;
  step: number;
  stageName: string;
  headline: string;
  question: string;
  options: {
    id: string;
    label: string;
    description?: string;
    category?: string;
    journeyTarget?: string;
  }[];
}

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  content: string[];
  keyTakeaways: string[];
  relatedJourneySlug?: string;
}

export interface ExperienceStory {
  id: string;
  slug: string;
  field: string;
  persona: string;
  title: string;
  initialSituation: string;
  explorationPhase: string;
  decisionMade: string;
  keyOutcome: string;
  reflection: string;
}

export interface FAQItem {
  id: string;
  category: 'general' | 'audiences' | 'journeys' | 'decision' | 'contact';
  question: string;
  answer: string;
}
