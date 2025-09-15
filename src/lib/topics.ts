import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Topic, TopicFrontmatter } from '@/types';
import { calculateReadingTime } from './utils';

const topicsDirectory = path.join(process.cwd(), 'src/content/topics');

export function getAllTopics(): Topic[] {
  const sections = ['apex', 'lwc', 'integration', 'testing'];
  const topics: Topic[] = [];

  sections.forEach((section) => {
    const sectionPath = path.join(topicsDirectory, section);

    if (!fs.existsSync(sectionPath)) {
      return;
    }

    const files = fs.readdirSync(sectionPath);

    files.forEach((file) => {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        const topic = getTopicBySlug(slug, section as any);
        if (topic) {
          topics.push(topic);
        }
      }
    });
  });

  // Sort by section and order
  return topics.sort((a, b) => {
    const sectionOrder = ['apex', 'lwc', 'integration', 'testing'];
    const sectionComparison = sectionOrder.indexOf(a.frontmatter.section) - sectionOrder.indexOf(b.frontmatter.section);

    if (sectionComparison !== 0) {
      return sectionComparison;
    }

    return a.frontmatter.order - b.frontmatter.order;
  });
}

export function getTopicBySlug(slug: string, section?: string): Topic | null {
  const sections = section ? [section] : ['apex', 'lwc', 'integration', 'testing'];

  for (const sect of sections) {
    const fullPath = path.join(topicsDirectory, sect, `${slug}.md`);

    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const frontmatter = data as TopicFrontmatter;
      const readingTime = calculateReadingTime(content);

      return {
        slug,
        frontmatter: {
          ...frontmatter,
          section: sect as TopicFrontmatter['section'],
        },
        content,
        readingTime,
      };
    }
  }

  return null;
}

export function getTopicsBySection(section: string): Topic[] {
  return getAllTopics()
    .filter(topic => topic.frontmatter.section === section)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getSectionData() {
  return [
    {
      id: 'apex',
      name: 'Apex Fundamentals',
      description: 'Master Salesforce\'s powerful programming language from variables to advanced patterns',
      icon: '⚡',
      color: 'blue',
      topics: getTopicsBySection('apex').length,
    },
    {
      id: 'lwc',
      name: 'LWC Fundamentals',
      description: 'Build modern Lightning Web Components with comprehensive component patterns',
      icon: '⚛️',
      color: 'purple',
      topics: getTopicsBySection('lwc').length,
    },
    {
      id: 'integration',
      name: 'Integration Patterns',
      description: 'Connect Salesforce with external systems using REST, SOAP, and platform events',
      icon: '🔗',
      color: 'orange',
      topics: getTopicsBySection('integration').length,
    },
    {
      id: 'testing',
      name: 'Testing Strategies',
      description: 'Write comprehensive tests for bulletproof Salesforce applications',
      icon: '🧪',
      color: 'green',
      topics: getTopicsBySection('testing').length,
    },
  ];
}

export function getRelatedTopics(topicSlug: string, limit: number = 3): Topic[] {
  const currentTopic = getTopicBySlug(topicSlug);
  if (!currentTopic) return [];

  const allTopics = getAllTopics();
  const relatedTopics = allTopics
    .filter(topic => topic.slug !== topicSlug)
    .filter(topic => {
      // Same section topics
      const sameSection = topic.frontmatter.section === currentTopic.frontmatter.section;

      // Topics with overlapping concepts
      const hasCommonConcepts = topic.frontmatter.concepts.some(concept =>
        currentTopic.frontmatter.concepts.includes(concept)
      );

      // Explicitly related topics
      const explicitlyRelated = currentTopic.frontmatter.relatedTopics.includes(topic.slug);

      return sameSection || hasCommonConcepts || explicitlyRelated;
    })
    .slice(0, limit);

  return relatedTopics;
}

export function getTopicProgress(section: string): {
  completed: number;
  total: number;
  percentage: number;
} {
  const topics = getTopicsBySection(section);
  const total = topics.length;

  // This would integrate with user progress tracking in a real app
  // For now, return mock data
  const completed = 0;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getLearningPath(section: string): {
  current: Topic | null;
  next: Topic | null;
  previous: Topic | null;
  progress: number;
} {
  const topics = getTopicsBySection(section);

  // This would track user's actual progress
  // For now, assume they're on the first topic
  const currentIndex = 0;

  return {
    current: topics[currentIndex] || null,
    next: topics[currentIndex + 1] || null,
    previous: topics[currentIndex - 1] || null,
    progress: topics.length > 0 ? Math.round(((currentIndex + 1) / topics.length) * 100) : 0,
  };
}

export function searchTopics(query: string): Topic[] {
  const allTopics = getAllTopics();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return [];

  return allTopics.filter(topic => {
    const titleMatch = topic.frontmatter.title.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = topic.frontmatter.description.toLowerCase().includes(normalizedQuery);
    const conceptsMatch = topic.frontmatter.concepts.some(concept =>
      concept.toLowerCase().includes(normalizedQuery)
    );
    const contentMatch = topic.content.toLowerCase().includes(normalizedQuery);

    return titleMatch || descriptionMatch || conceptsMatch || contentMatch;
  });
}