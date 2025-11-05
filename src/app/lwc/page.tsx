import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { getTopicsBySection, getSectionData, getTopicProgress } from '@/lib/topics';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'LWC Fundamentals - Master Lightning Web Components',
  description: 'Complete Lightning Web Components curriculum covering HTML templates, JavaScript, lifecycle hooks, data service, and component communication with detailed examples.',
  keywords: ['LWC', 'Lightning Web Components', 'Salesforce', 'JavaScript', 'Web Development'],
};

export default function LWCFundamentalsPage() {
  const topics = getTopicsBySection('lwc');
  const sectionData = getSectionData().find(s => s.id === 'lwc')!;
  const progress = getTopicProgress('lwc');

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  const examWeightColors = {
    high: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    low: 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl mr-4">{sectionData.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                {sectionData.name}
              </h1>
            </div>

            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              {sectionData.description}
            </p>

            {/* Progress Indicator */}
            <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Learning Progress</span>
                <span className="text-white font-medium">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <p className="text-purple-100 text-sm mt-2">
                {progress.completed} of {progress.total} topics completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Complete LWC Curriculum
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Master Lightning Web Components from basics to advanced patterns. Learn modern JavaScript,
            component communication, data services, and best practices for building scalable Lightning applications.
          </p>
        </div>

        <div className="grid gap-6">
          {topics.map((topic, index) => (
            <div
              key={topic.slug}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        <Link href={`/lwc/${topic.slug}`}>
                          {topic.frontmatter.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {topic.frontmatter.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full border',
                      difficultyColors[topic.frontmatter.difficulty]
                    )}>
                      {topic.frontmatter.difficulty}
                    </span>

                    {topic.frontmatter.examWeight === 'high' && (
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        examWeightColors[topic.frontmatter.examWeight]
                      )}>
                        High Exam Weight
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Concepts:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topic.frontmatter.concepts.slice(0, 6).map((concept) => (
                      <span
                        key={concept}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                      >
                        {concept}
                      </span>
                    ))}
                    {topic.frontmatter.concepts.length > 6 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{topic.frontmatter.concepts.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {topic.readingTime.text}
                    </div>

                    {topic.frontmatter.prerequisites.length > 0 && (
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {topic.frontmatter.prerequisites.length} prerequisites
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/lwc/${topic.slug}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
                  >
                    Start Topic
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {topic.frontmatter.prerequisites.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>Prerequisites:</strong> Complete {topic.frontmatter.prerequisites.join(', ')} before starting this topic.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Path Info */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-8">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Structured Learning Path
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              This curriculum is designed to take you from LWC beginner to expert. Topics are ordered by complexity
              and build upon each other. Follow the sequence for optimal learning outcomes.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-2">🌱</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Foundation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  HTML templates, JavaScript basics, and understanding the LWC component structure and lifecycle.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">🏗️</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Core Skills</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wire service, Lightning Data Service, event handling, and component communication patterns.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">🚀</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Advanced</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Navigation, advanced styling, form handling, data tables, and enterprise component patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
