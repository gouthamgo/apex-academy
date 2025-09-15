import Link from 'next/link';
import { Clock, Tag, User, Calendar } from 'lucide-react';
import { Tutorial } from '@/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TutorialCardProps {
  tutorial: Tutorial;
  className?: string;
  featured?: boolean;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const categoryColors = {
  apex: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  lwc: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  integration: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  testing: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
};

export function TutorialCard({ tutorial, className, featured = false }: TutorialCardProps) {
  const { slug, frontmatter, readingTime } = tutorial;

  return (
    <article
      className={cn(
        'tutorial-card group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
        featured && 'ring-2 ring-blue-500 dark:ring-blue-400',
        className
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                categoryColors[frontmatter.category]
              )}
            >
              {frontmatter.category.toUpperCase()}
            </span>
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                difficultyColors[frontmatter.difficulty]
              )}
            >
              {frontmatter.difficulty}
            </span>
          </div>
          {featured && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={`/tutorials/${frontmatter.category}/${slug}`}>
            {frontmatter.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {frontmatter.description}
        </p>

        {/* Tags */}
        {frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {frontmatter.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {frontmatter.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{frontmatter.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Apex Academy
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readingTime.text}
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(frontmatter.lastUpdated)}
          </div>
        </div>
      </div>

      {/* Prerequisites indicator */}
      {frontmatter.prerequisites.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Prerequisites:</span>{' '}
            {frontmatter.prerequisites.join(', ')}
          </p>
        </div>
      )}
    </article>
  );
}