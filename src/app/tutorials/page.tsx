import { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { getAllTutorials, getAllCategories, getAllTags, getFeaturedTutorials } from '@/lib/content';
import { TutorialCard } from '@/components/tutorial-card';

export const metadata: Metadata = {
  title: 'Salesforce Development Tutorials',
  description: 'Comprehensive Salesforce development tutorials covering Apex, Lightning Web Components, integration patterns, and testing strategies.',
};

export default function TutorialsPage() {
  const allTutorials = getAllTutorials();
  const featuredTutorials = getFeaturedTutorials();
  const categories = getAllCategories();
  const allTags = getAllTags();

  const stats = {
    total: allTutorials.length,
    beginner: allTutorials.filter(t => t.frontmatter.difficulty === 'beginner').length,
    intermediate: allTutorials.filter(t => t.frontmatter.difficulty === 'intermediate').length,
    advanced: allTutorials.filter(t => t.frontmatter.difficulty === 'advanced').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Salesforce Development Tutorials
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Master Salesforce development with comprehensive tutorials covering Apex, Lightning Web Components,
              integration patterns, and testing strategies.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tutorials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.beginner}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Beginner</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.intermediate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Intermediate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.advanced}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Advanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter Tutorials
                </h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/tutorials/${category.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {allTutorials.filter(t => t.frontmatter.category === category.id).length}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Difficulty Levels */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Difficulty
                </h4>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                    <label key={difficulty} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {difficulty}
                      </span>
                      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        ({allTutorials.filter(t => t.frontmatter.difficulty === difficulty).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Featured Tutorials */}
            {featuredTutorials.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Featured Tutorials
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                  {featuredTutorials.slice(0, 4).map((tutorial) => (
                    <TutorialCard
                      key={tutorial.slug}
                      tutorial={tutorial}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Tutorials */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    All Tutorials
                  </h2>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                  <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </div>
              </div>

              {/* Tutorials Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {allTutorials.map((tutorial) => (
                  <TutorialCard
                    key={tutorial.slug}
                    tutorial={tutorial}
                  />
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                  Load More Tutorials
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}