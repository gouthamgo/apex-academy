import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Zap, Target, Star, Users } from 'lucide-react';
import { getSectionData, getAllTopics } from '@/lib/topics';
import { getAllTutorials, getFeaturedTutorials } from '@/lib/content';
import { TutorialCard } from '@/components/tutorial-card';

export default function HomePage() {
  const featuredTutorials = getFeaturedTutorials().slice(0, 3);
  const allTopics = getAllTopics();
  const sections = getSectionData();

  const stats = {
    topics: allTopics.length,
    sections: sections.length,
    students: '10,000+',
    rating: 4.9,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-salesforce-blue via-blue-600 to-salesforce-lightblue text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Become a Salesforce Developer
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Complete learning path from absolute beginner to job-ready Salesforce developer.
              Start with Salesforce basics, master Apex & LWC, build real projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/basics"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
              >
                Start from Basics
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/tutorials"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
              >
                View All Tutorials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              ✨ 100% Free • {stats.topics}+ Topics • Real-World Projects • Job-Ready Skills
            </p>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20" />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.topics}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.sections}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.students}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.rating}
                <Star className="h-6 w-6 text-yellow-400 ml-1" fill="currentColor" />
              </div>
              <div className="text-gray-600 dark:text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Path to Becoming a Salesforce Developer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Follow this structured curriculum from absolute beginner to job-ready developer.
            </p>
            <div className="mt-6 text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                Basics → Apex → LWC → Integration → Projects → Get Hired! 🚀
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {sections.map((section, index) => (
              <Link
                key={section.id}
                href={`/${section.id}`}
                className="group bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {section.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {section.description}
                  </p>
                  <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {section.topics} topics
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Apex Academy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to become a Salesforce development expert.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Detailed Code Examples
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every tutorial includes comprehensive, annotated code examples with line-by-line explanations
                and best practice recommendations.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Exam-Focused Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn the patterns and pitfalls that commonly appear in Salesforce certification exams
                with our exam trap annotations.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Real-World Scenarios
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Move beyond basic examples with tutorials that tackle real enterprise development
                challenges and patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutorials */}
      {featuredTutorials.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Tutorials
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Hand-picked tutorials to get you started on your Salesforce development journey.
                </p>
              </div>
              <Link
                href="/tutorials"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View All Tutorials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.slug}
                  tutorial={tutorial}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learning Approach */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Structured Learning Approach
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our curriculum is designed to take you from beginner to expert with a systematic, topic-based approach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Topic-Based Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Each topic covers complete concepts with theory, examples, and practice exercises.
                Build knowledge systematically without gaps.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Comprehensive Examples
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every concept includes detailed, annotated code examples with explanations
                of why patterns are used and common pitfalls to avoid.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Exam-Focused Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn with certification exams in mind. Each topic highlights
                key concepts, common traps, and scenarios that appear in exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-salesforce-blue to-salesforce-lightblue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Salesforce Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Begin with Salesforce Basics and progress to building real-world applications.
            Everything you need is here, completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/basics"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start from Basics
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/tutorials"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Browse Tutorials
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}