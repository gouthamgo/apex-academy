import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Clock, Calendar, User, Tag, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getTutorialBySlug, getRelatedTutorials, getAllTutorials } from '@/lib/content';
import { markdownToHtml } from '@/lib/markdown';
import { TableOfContents } from '@/components/table-of-contents';
import { TutorialCard } from '@/components/tutorial-card';
import { CodeBlock } from '@/components/code-block';
import { formatDate, cn } from '@/lib/utils';

interface TutorialPageProps {
  params: {
    category: string;
    slug: string;
  };
}

// Generate static params for all tutorials
export async function generateStaticParams() {
  const tutorials = getAllTutorials();

  return tutorials.map((tutorial) => ({
    category: tutorial.frontmatter.category,
    slug: tutorial.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const tutorial = getTutorialBySlug(params.slug, params.category);

  if (!tutorial) {
    return {
      title: 'Tutorial Not Found',
    };
  }

  const { frontmatter } = tutorial;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags.join(', '),
    authors: [{ name: 'Apex Academy' }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: 'article',
      modifiedTime: frontmatter.lastUpdated,
      authors: ['Apex Academy'],
      tags: frontmatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
    },
  };
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = getTutorialBySlug(params.slug, params.category);

  if (!tutorial) {
    notFound();
  }

  const { frontmatter, content, readingTime } = tutorial;
  const { html, tableOfContents } = await markdownToHtml(content);
  const relatedTutorials = getRelatedTutorials(params.slug);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Home
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <Link
              href="/tutorials"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Tutorials
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <Link
              href={`/tutorials/${frontmatter.category}`}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 capitalize"
            >
              {frontmatter.category}
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {frontmatter.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="flex-1 max-w-none">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full',
                      categoryColors[frontmatter.category]
                    )}
                  >
                    {frontmatter.category.toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full',
                      difficultyColors[frontmatter.difficulty]
                    )}
                  >
                    {frontmatter.difficulty}
                  </span>
                  {frontmatter.featured && (
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {frontmatter.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {frontmatter.description}
              </p>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Apex Academy
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {readingTime.text}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Updated {formatDate(frontmatter.lastUpdated)}
                </div>
              </div>

              {/* Tags */}
              {frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Prerequisites */}
              {frontmatter.prerequisites.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Prerequisites
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    {frontmatter.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />
                        {prerequisite}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </header>

            {/* Tutorial Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
              <div
                className="prose prose-lg dark:prose-dark max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <TableOfContents items={tableOfContents} />
            )}

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Related Tutorials
                </h3>
                <div className="space-y-4">
                  {relatedTutorials.map((relatedTutorial) => (
                    <div key={relatedTutorial.slug} className="group">
                      <Link
                        href={`/tutorials/${relatedTutorial.frontmatter.category}/${relatedTutorial.slug}`}
                        className="block"
                      >
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {relatedTutorial.frontmatter.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {relatedTutorial.frontmatter.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {relatedTutorial.readingTime.text}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tracker */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tutorial Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Reading Progress</span>
                  <span className="text-gray-900 dark:text-white font-medium">0%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="progress-bar bg-blue-600 h-2 rounded-full w-0"></div>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                  Mark as Complete
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Bookmark Tutorial
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Tutorials Section */}
        {relatedTutorials.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              More Tutorials Like This
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTutorials.map((relatedTutorial) => (
                <TutorialCard
                  key={relatedTutorial.slug}
                  tutorial={relatedTutorial}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}