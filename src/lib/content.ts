import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Tutorial, TutorialFrontmatter } from '@/types';
import { calculateReadingTime } from './utils';

const contentDirectory = path.join(process.cwd(), 'src/content/tutorials');

export function getAllTutorials(): Tutorial[] {
  const categories = ['apex', 'lwc', 'integration', 'testing'];
  const tutorials: Tutorial[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(contentDirectory, category);

    if (!fs.existsSync(categoryPath)) {
      return;
    }

    const files = fs.readdirSync(categoryPath);

    files.forEach((file) => {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        const tutorial = getTutorialBySlug(slug, category as any);
        if (tutorial) {
          tutorials.push(tutorial);
        }
      }
    });
  });

  return tutorials.sort((a, b) =>
    new Date(b.frontmatter.lastUpdated).getTime() -
    new Date(a.frontmatter.lastUpdated).getTime()
  );
}

export function getTutorialBySlug(slug: string, category?: string): Tutorial | null {
  const categories = category ? [category] : ['apex', 'lwc', 'integration', 'testing'];

  for (const cat of categories) {
    const fullPath = path.join(contentDirectory, cat, `${slug}.md`);

    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const frontmatter = data as TutorialFrontmatter;
      const readingTime = calculateReadingTime(content);

      return {
        slug,
        frontmatter: {
          ...frontmatter,
          category: cat as TutorialFrontmatter['category'],
        },
        content,
        readingTime,
      };
    }
  }

  return null;
}

export function getTutorialsByCategory(category: string): Tutorial[] {
  return getAllTutorials().filter(tutorial => tutorial.frontmatter.category === category);
}

export function getTutorialsByTag(tag: string): Tutorial[] {
  return getAllTutorials().filter(tutorial =>
    tutorial.frontmatter.tags.includes(tag)
  );
}

export function getFeaturedTutorials(): Tutorial[] {
  return getAllTutorials().filter(tutorial => tutorial.frontmatter.featured);
}

export function getRelatedTutorials(tutorialSlug: string, limit: number = 3): Tutorial[] {
  const currentTutorial = getTutorialBySlug(tutorialSlug);
  if (!currentTutorial) return [];

  const allTutorials = getAllTutorials();
  const related = allTutorials
    .filter(tutorial => tutorial.slug !== tutorialSlug)
    .filter(tutorial => {
      const hasCommonTags = tutorial.frontmatter.tags.some(tag =>
        currentTutorial.frontmatter.tags.includes(tag)
      );
      const sameCategory = tutorial.frontmatter.category === currentTutorial.frontmatter.category;
      return hasCommonTags || sameCategory;
    })
    .slice(0, limit);

  return related;
}

export function getAllTags(): string[] {
  const allTutorials = getAllTutorials();
  const tags = new Set<string>();

  allTutorials.forEach(tutorial => {
    tutorial.frontmatter.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export function getAllCategories() {
  return [
    { id: 'apex', name: 'Apex', description: 'Salesforce Apex programming language' },
    { id: 'lwc', name: 'Lightning Web Components', description: 'Modern UI framework for Salesforce' },
    { id: 'integration', name: 'Integration', description: 'Connecting Salesforce with external systems' },
    { id: 'testing', name: 'Testing', description: 'Testing strategies and best practices' },
  ];
}