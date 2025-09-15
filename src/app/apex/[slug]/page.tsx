import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, TrendingUp, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { getTopicBySlug, getRelatedTopics, getTopicsBySection } from '@/lib/topics';
import { markdownToHtml } from '@/lib/markdown';
import { TableOfContents } from '@/components/table-of-contents';
import { CodeBlock } from '@/components/code-block';
import { cn } from '@/lib/utils';

interface TopicPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all Apex topics
export async function generateStaticParams() {
  const topics = getTopicsBySection('apex');

  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = getTopicBySlug(params.slug, 'apex');

  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  const { frontmatter } = topic;

  return {
    title: `${frontmatter.title} - Apex Fundamentals`,
    description: frontmatter.description,
    keywords: [...frontmatter.concepts, 'Apex', 'Salesforce', 'Programming'],
    authors: [{ name: 'Apex Academy' }],
    openGraph: {
      title: `${frontmatter.title} - Apex Fundamentals`,
      description: frontmatter.description,
      type: 'article',
      tags: frontmatter.concepts,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = getTopicBySlug(params.slug, 'apex');

  if (!topic) {
    notFound();
  }

  const { frontmatter, content, readingTime } = topic;
  const { html, tableOfContents } = await markdownToHtml(content);
  const relatedTopics = getRelatedTopics(params.slug);
  const allTopics = getTopicsBySection('apex');

  // Find current topic index for navigation
  const currentIndex = allTopics.findIndex(t => t.slug === params.slug);
  const previousTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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
              href="/apex"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Apex Fundamentals
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
            {/* Topic Header - Always Visible */}
            <header className="topic-header bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
              {/* Main Title Section */}
              <div className="p-8 pb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {frontmatter.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {frontmatter.description}
                </p>
              </div>

              {/* Topic Meta Bar */}
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full',
                      difficultyColors[frontmatter.difficulty]
                    )}
                  >
                    {frontmatter.difficulty.charAt(0).toUpperCase() + frontmatter.difficulty.slice(1)} Level
                  </span>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {readingTime.text}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Topic {currentIndex + 1} of {allTopics.length}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {frontmatter.examWeight === 'high' && (
                    <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                      High Exam Weight
                    </span>
                  )}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {frontmatter.concepts.length} key concepts
                  </div>
                </div>
              </div>

            </header>

            {/* Overview Section */}
            <section className="overview bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                📖 Overview
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  {frontmatter.overview}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Learning Objectives */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">You'll Learn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.concepts.map((concept) => (
                      <span
                        key={concept}
                        className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prerequisites & Meta */}
                <div className="space-y-4">
                  {frontmatter.prerequisites.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prerequisites:</h3>
                      <div className="space-y-1">
                        {frontmatter.prerequisites.map((prerequisite) => (
                          <div key={prerequisite} className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-md">
                            📚 {prerequisite}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center mb-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Updated {new Date(frontmatter.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Topic Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
              <div
                className="prose prose-lg dark:prose-dark max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>

            {/* Topic Navigation */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousTopic ? (
                <Link
                  href={`/apex/${previousTopic.slug}`}
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
                  href={`/apex/${nextTopic.slug}`}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Topic Progress
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
                    <div key={relatedTopic.slug} className="group">
                      <Link
                        href={`/apex/${relatedTopic.slug}`}
                        className="block"
                      >
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {relatedTopic.frontmatter.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {relatedTopic.frontmatter.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {relatedTopic.readingTime.text}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Topics Navigation */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Apex Topics
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allTopics.map((topicItem, index) => (
                  <Link
                    key={topicItem.slug}
                    href={`/apex/${topicItem.slug}`}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-colors',
                      topicItem.slug === params.slug
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-2">{index + 1}.</span>
                      {topicItem.frontmatter.title}
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