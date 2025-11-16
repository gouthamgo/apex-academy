import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, ArrowRight, BookOpen, Target } from 'lucide-react';
import { getTopicBySlug, getTopicsBySection, getRelatedTopics } from '@/lib/topics';
import { markdownToHtml } from '@/lib/markdown';
import { TableOfContents } from '@/components/table-of-contents';
import { CodeCopyHandler } from '@/components/code-copy-handler';
import { cn } from '@/lib/utils';

interface TopicPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all Basics topics
export async function generateStaticParams() {
  const topics = getTopicsBySection('interview');

  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = getTopicBySlug(params.slug, 'interview');

  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: `${topic.frontmatter.title} - Interview Prep`,
    description: topic.frontmatter.description,
    keywords: topic.frontmatter.concepts.join(', '),
  };
}

export default async function InterviewTopicPage({ params }: TopicPageProps) {
  const topic = getTopicBySlug(params.slug, 'interview');

  if (!topic) {
    notFound();
  }

  const allTopics = getTopicsBySection('interview');
  const currentIndex = allTopics.findIndex(t => t.slug === params.slug);
  const previousTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;
  const relatedTopics = getRelatedTopics(params.slug, 3);

  const { html, tableOfContents } = await markdownToHtml(topic.content);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CodeCopyHandler />
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
              href="/interview"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Interview Prep
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {topic.frontmatter.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="flex-1 max-w-none">
            {/* Topic Header */}
            <header className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-8 pb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {topic.frontmatter.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {topic.frontmatter.description}
                </p>
              </div>

              {/* Topic Meta Bar */}
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    difficultyColors[topic.frontmatter.difficulty]
                  )}>
                    {topic.frontmatter.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {topic.readingTime.text}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Topic {currentIndex + 1} of {allTopics.length}
                  </span>
                </div>
                {topic.frontmatter.examWeight === 'high' && (
                  <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                    High Exam Weight
                  </span>
                )}
              </div>

              {/* Prerequisites */}
              {topic.frontmatter.prerequisites.length > 0 && (
                <div className="px-8 pb-6 pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Prerequisites
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      {topic.frontmatter.prerequisites.map((prerequisite, index) => (
                        <li key={index}>• {prerequisite}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Key Concepts */}
              <div className="px-8 pb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Key Concepts Covered:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topic.frontmatter.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Topic Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
              <div
                className="prose prose-lg dark:prose-dark max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>

            {/* Topic Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousTopic ? (
                <Link
                  href={`/interview/${previousTopic.slug}`}
                  className="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Previous Topic
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {previousTopic.frontmatter.title}
                  </h4>
                </Link>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg opacity-50">
                  <div className="text-sm text-gray-400 mb-2">No previous topic</div>
                  <h4 className="font-semibold text-gray-500">You're at the beginning!</h4>
                </div>
              )}

              {nextTopic ? (
                <Link
                  href={`/interview/${nextTopic.slug}`}
                  className="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all text-right"
                >
                  <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Next Topic
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {nextTopic.frontmatter.title}
                  </h4>
                </Link>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg opacity-50 text-right">
                  <div className="text-sm text-gray-400 mb-2">No next topic</div>
                  <h4 className="font-semibold text-gray-500">You've completed the curriculum!</h4>
                </div>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <TableOfContents items={tableOfContents} />
            )}

            {/* Topic Progress */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Topic Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    difficultyColors[topic.frontmatter.difficulty]
                  )}>
                    {topic.frontmatter.difficulty}
                  </span>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                  Mark as Complete
                </button>
              </div>
            </div>

            {/* Related Topics */}
            {relatedTopics.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Related Topics
                </h3>
                <div className="space-y-4">
                  {relatedTopics.map((relatedTopic) => (
                    <Link
                      key={relatedTopic.slug}
                      href={`/${relatedTopic.frontmatter.section}/${relatedTopic.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {relatedTopic.frontmatter.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {relatedTopic.frontmatter.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Topics Navigation */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Basics Topics
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allTopics.map((t, index) => (
                  <Link
                    key={t.slug}
                    href={`/apex/${t.slug}`}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-colors',
                      t.slug === params.slug
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-2">{index + 1}.</span>
                      {t.frontmatter.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
