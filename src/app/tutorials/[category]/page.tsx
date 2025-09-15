import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Filter } from 'lucide-react';
import { getTutorialsByCategory, getAllCategories, getAllTags } from '@/lib/content';
import { TutorialCard } from '@/components/tutorial-card';
import { cn } from '@/lib/utils';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = getAllCategories();
  const category = categories.find(cat => cat.id === params.category);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Tutorials`,
    description: `Learn ${category.description} with comprehensive tutorials and code examples.`,
    keywords: [category.name, 'Salesforce', 'tutorials', 'development'],
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categories = getAllCategories();
  const category = categories.find(cat => cat.id === params.category);

  if (!category) {
    notFound();
  }

  const tutorials = getTutorialsByCategory(params.category);
  const allTags = getAllTags();

  // Get tags relevant to this category
  const categoryTags = [...new Set(
    tutorials.flatMap(tutorial => tutorial.frontmatter.tags)
  )].sort();

  const stats = {
    total: tutorials.length,
    beginner: tutorials.filter(t => t.frontmatter.difficulty === 'beginner').length,
    intermediate: tutorials.filter(t => t.frontmatter.difficulty === 'intermediate').length,
    advanced: tutorials.filter(t => t.frontmatter.difficulty === 'advanced').length,
  };

  const categoryColors = {
    apex: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-900 dark:text-blue-100',
      accent: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    lwc: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-900 dark:text-purple-100',
      accent: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
    integration: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-900 dark:text-orange-100',
      accent: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
    },
    testing: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      text: 'text-pink-900 dark:text-pink-100',
      accent: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800',
    },
  };

  const colors = categoryColors[params.category as keyof typeof categoryColors] || categoryColors.apex;

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
            <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
              {category.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className={cn('border-b border-gray-200 dark:border-gray-700', colors.bg)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className={cn('text-4xl font-bold mb-4', colors.text)}>
              {category.name} Tutorials
            </h1>
            <p className={cn('text-xl max-w-3xl mx-auto mb-8', colors.text)}>
              {category.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className={cn('text-2xl font-bold', colors.accent)}>
                  {stats.total}
                </div>
                <div className={cn('text-sm', colors.text)}>Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.beginner}
                </div>
                <div className={cn('text-sm', colors.text)}>Beginner</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.intermediate}
                </div>
                <div className={cn('text-sm', colors.text)}>Intermediate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.advanced}
                </div>
                <div className={cn('text-sm', colors.text)}>Advanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-24">
              {/* Back to All Tutorials */}
              <Link
                href="/tutorials"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                All Tutorials
              </Link>

              {/* Category Navigation */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/tutorials/${cat.id}`}
                      className={cn(
                        'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        cat.id === params.category
                          ? cn('font-semibold', colors.bg, colors.text)
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
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
                        ({tutorials.filter(t => t.frontmatter.difficulty === difficulty).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.slice(0, 15).map((tag) => (
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.name} Tutorials ({tutorials.length})
                </h2>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Tutorials Grid */}
            {tutorials.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {tutorials.map((tutorial) => (
                  <TutorialCard
                    key={tutorial.slug}
                    tutorial={tutorial}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tutorials found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We're working on adding more {category.name.toLowerCase()} tutorials.
                </p>
                <Link
                  href="/tutorials"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Browse All Tutorials
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}