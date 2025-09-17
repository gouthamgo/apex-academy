import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, TrendingUp, CheckCircle, ArrowRight, BookOpen, Code2, Lightbulb } from 'lucide-react';
import { topicContent } from '@/data/topicContent';
import { PracticeSection } from '@/components/practice-section';
import { cn } from '@/lib/utils';

interface TopicPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all Apex topics
export async function generateStaticParams() {
  const topicSlugs = Object.keys(topicContent);

  return topicSlugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = topicContent[params.slug];

  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: `${topic.title} - Apex Fundamentals`,
    description: topic.overview,
    keywords: ['Apex', 'Salesforce', 'Programming'],
    authors: [{ name: 'Apex Academy' }],
    openGraph: {
      title: `${topic.title} - Apex Fundamentals`,
      description: topic.overview,
      type: 'article',
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = topicContent[params.slug];

  if (!topic) {
    notFound();
  }

  const allTopicSlugs = Object.keys(topicContent);

  // Find current topic index for navigation
  const currentIndex = allTopicSlugs.findIndex(slug => slug === params.slug);
  const previousSlug = currentIndex > 0 ? allTopicSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allTopicSlugs.length - 1 ? allTopicSlugs[currentIndex + 1] : null;

  const previousTopic = previousSlug ? { slug: previousSlug, title: topicContent[previousSlug].title } : null;
  const nextTopic = nextSlug ? { slug: nextSlug, title: topicContent[nextSlug].title } : null;

  // Estimated reading time based on content length
  const readingTime = Math.ceil((topic.overview.length + topic.codeExamples.reduce((acc, ex) => acc + ex.code.length + ex.explanation.length, 0)) / 1000);

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
              {topic.title}
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
                  {topic.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {topic.overview}
                </p>
              </div>

              {/* Topic Meta Bar */}
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Beginner Level
                  </span>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {readingTime} min read
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Topic {currentIndex + 1} of {allTopicSlugs.length}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                    High Exam Weight
                  </span>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Code2 className="h-4 w-4 mr-1" />
                    {topic.codeExamples.length} code examples
                  </div>
                </div>
              </div>

            </header>

            {/* Code Examples Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Code2 className="h-6 w-6 mr-2" />
                Code Examples
              </h2>
              <div className="space-y-8">
                {topic.codeExamples.map((example, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {example.title}
                      </h3>
                    </div>
                    <div className="bg-gray-900 p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {example.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Practice Questions */}
            <PracticeSection topicName={topic.title} questions={topic.practiceQuestions} />

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
                    {previousTopic.title}
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
                    {nextTopic.title}
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
            {/* Topic Progress */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Topic Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Code Examples</span>
                  <span className="text-gray-900 dark:text-white font-medium">{topic.codeExamples.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Practice Questions</span>
                  <span className="text-gray-900 dark:text-white font-medium">{topic.practiceQuestions.length}</span>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                  Mark as Complete
                </button>
              </div>
            </div>

            {/* All Topics Navigation */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Apex Topics
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allTopicSlugs.map((slug, index) => (
                  <Link
                    key={slug}
                    href={`/apex/${slug}`}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-colors',
                      slug === params.slug
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-2">{index + 1}.</span>
                      {topicContent[slug].title}
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