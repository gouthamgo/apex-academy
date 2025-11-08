// Topic-based curriculum types
export interface TopicFrontmatter {
  title: string;
  section: 'basics' | 'apex' | 'lwc' | 'integration' | 'testing';
  order: number; // Order within section
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  description: string;
  overview: string;
  concepts: string[];
  prerequisites: string[];
  relatedTopics: string[];
  lastUpdated: string;
  examWeight: 'low' | 'medium' | 'high'; // Certification exam importance
}

export interface Topic {
  slug: string;
  frontmatter: TopicFrontmatter;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

// Legacy tutorial types (for migration)
export interface TutorialFrontmatter {
  title: string;
  category: 'apex' | 'lwc' | 'integration' | 'testing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  description: string;
  tags: string[];
  prerequisites: string[];
  relatedTutorials: string[];
  lastUpdated: string;
  featured: boolean;
}

export interface Tutorial {
  slug: string;
  frontmatter: TutorialFrontmatter;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface SearchResult {
  item: Tutorial;
  score: number;
  matches: Array<{
    indices: number[][];
    value: string;
    key: string;
  }>;
}

export interface CodeAnnotation {
  line: number;
  type: 'warning' | 'tip' | 'error' | 'info' | 'exam-trap' | 'best-practice';
  title: string;
  content: string;
  icon?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  tutorials: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserProgress {
  completedTutorials: string[];
  bookmarkedTutorials: string[];
  currentPath?: string;
  lastVisited: string;
}