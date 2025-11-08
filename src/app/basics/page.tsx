import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { getTopicsBySection, getSectionData, getTopicProgress } from '@/lib/topics';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Salesforce Basics - Start Your Journey Here',
  description: 'Learn Salesforce fundamentals from scratch. Understand the platform, data model, objects, fields, and get ready for Apex programming.',
  keywords: ['Salesforce', 'Basics', 'Fundamentals', 'Beginners', 'Platform', 'Data Model', 'Objects', 'Fields'],
};

export default function SalesforceBasicsPage() {
  const topics = getTopicsBySection('basics');
  const sectionData = getSectionData().find(s => s.id === 'basics')!;
  const progress = getTopicProgress('basics');

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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl mr-4">{sectionData.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                {sectionData.name}
              </h1>
            </div>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {sectionData.description}
            </p>

            {/* Progress Indicator */}
            <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Learning Progress</span>
                <span className="text-white font-medium">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <p className="text-blue-100 text-sm mt-2">
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
            Complete Salesforce Basics Curriculum
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start your Salesforce journey with fundamentals. Learn platform basics, data model, security, automation, and more.
            Each topic builds on previous concepts with comprehensive examples and real-world scenarios.
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
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link href={`/basics/${topic.slug}`}>
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
                    href={`/basics/${topic.slug}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                  >
                    Start Topic
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {topic.frontmatter.prerequisites.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Prerequisites:</strong> Complete {topic.frontmatter.prerequisites.join(', ')} before starting this topic.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Path Info */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Structured Learning Path
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              This curriculum is designed to take you from complete beginner to Salesforce-ready. Topics are ordered by complexity
              and build upon each other. Follow the sequence for optimal learning outcomes.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-2">🌱</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Platform Basics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understand Salesforce platform, data model, objects, fields, and relationships - the foundation.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">🏗️</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Configuration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Security model, automation with flows, reports and dashboards for data insights.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">🚀</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customization</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  UI customization, Lightning App Builder, and preparing for development with Apex and LWC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}