'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BookOpen,
  Code,
  Database,
  GitBranch,
  Layers,
  Timer,
  TestTube,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { topicContent } from '@/data/topicContent';

// Copy Button Component
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
      title="Copy code"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

// Content Component that renders from data
const TopicContent = ({ topicId }: { topicId: string }) => {
  const content = topicContent[topicId];

  if (!content) {
    return <div>Content not found for topic: {topicId}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
        <div className="prose prose-lg dark:prose-dark max-w-none">
          <p className="text-gray-700 dark:text-gray-300">{content.overview}</p>
        </div>
      </section>

      {/* Code Examples Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Code Examples</h2>
        <div className="space-y-8">
          {content.codeExamples.map((example, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {example.title}
              </h3>

              {/* Code Block */}
              <div className="relative group">
                <SyntaxHighlighter
                  language="apex"
                  style={vscDarkPlus}
                  className="rounded-lg"
                  showLineNumbers={true}
                  customStyle={{
                    background: '#0f0f0f',
                    padding: '1.5rem',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
                    border: '1px solid #2d2d2d',
                  }}
                >
                  {example.code}
                </SyntaxHighlighter>
                <CopyButton code={example.code} />
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-blue-900 dark:text-blue-100">{example.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Questions Section */}
      {content.practiceQuestions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Practice Questions ({content.practiceQuestions.length})
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Test your understanding with these comprehensive questions. Click to reveal answers with detailed explanations.
          </p>

          <div className="space-y-4">
            {content.practiceQuestions.map((question) => (
              <div key={question.number} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <details className="group">
                  <summary className="cursor-pointer p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Question {question.number}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            question.difficulty === 'beginner'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : question.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-3">{question.question}</p>

                        {question.code && (
                          <div className="bg-gray-900 rounded-lg p-4 mb-4">
                            <pre className="text-gray-100 text-sm overflow-x-auto">
                              <code>{question.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 transform transition-transform group-open:rotate-90" />
                    </div>
                  </summary>

                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Answer:</h4>
                      <p className="text-blue-800 dark:text-blue-200">{question.answer}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Explanation:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
                    </div>

                    {question.correctCode && (
                      <div className="bg-gray-900 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-100 mb-2">Correct Code:</h4>
                        <pre className="text-gray-100 text-sm overflow-x-auto">
                          <code>{question.correctCode}</code>
                        </pre>
                      </div>
                    )}

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Key Learning:</h4>
                      <p className="text-green-800 dark:text-green-200">{question.keyLearning}</p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Exam Tip:</h4>
                      <p className="text-purple-800 dark:text-purple-200">{question.examTip}</p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface Topic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const topics: Topic[] = [
  {
    id: 'variables-and-data-types',
    title: 'Variables and Data Types',
    icon: Code,
    description: 'Master Apex variables, primitive data types, and type conversion'
  },
  {
    id: 'collections-deep-dive',
    title: 'Collections Deep Dive',
    icon: Layers,
    description: 'Master Lists, Sets, Maps and bulkification patterns'
  },
  {
    id: 'control-flow-and-loops',
    title: 'Control Flow',
    icon: GitBranch,
    description: 'If/else, loops, switch statements and flow control'
  },
  {
    id: 'classes-and-objects',
    title: 'Classes and Methods',
    icon: Code,
    description: 'Object-oriented programming in Apex'
  },
  {
    id: 'soql-and-dml',
    title: 'SOQL and Database',
    icon: Database,
    description: 'Query data and database operations'
  },
  {
    id: 'triggers-and-automation',
    title: 'Triggers',
    icon: Timer,
    description: 'Apex triggers and automation patterns'
  },
  {
    id: 'asynchronous-apex',
    title: 'Async Apex',
    icon: TestTube,
    description: 'Future, batch, queueable and schedulable Apex'
  },
  {
    id: 'testing-and-debugging',
    title: 'Testing',
    icon: TestTube,
    description: 'Unit testing, test data, and test automation'
  }
];

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Apex Academy
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out pt-16 shadow-lg
          lg:translate-x-0 lg:static lg:inset-0 lg:pt-0 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Apex Fundamentals
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Master Salesforce development step by step
              </p>
            </div>

            <nav className="space-y-1">
              {topics.map((topic, index) => {
                const Icon = topic.icon;
                const isSelected = selectedTopic.id === topic.id;

                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full text-left p-4 rounded-lg transition-all duration-200 group border
                      ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-gray-200 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 p-2 rounded-md mt-0.5
                        ${isSelected
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`
                            text-sm font-medium truncate
                            ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}
                          `}>
                            {topic.title}
                          </h3>
                          {isSelected && (
                            <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className={`
                          text-xs mt-1 truncate
                          ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}
                        `}>
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Right Content Area */}
        <main className="flex-1 lg:ml-0 min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            {/* Topic Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <selectedTopic.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedTopic.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedTopic.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <TopicContent topicId={selectedTopic.id} />
              </div>

              {/* Navigation Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Topic {topics.findIndex(t => t.id === selectedTopic.id) + 1} of {topics.length}
                  </div>
                  <div className="flex space-x-3">
                    {topics.findIndex(t => t.id === selectedTopic.id) > 0 && (
                      <button
                        onClick={() => setSelectedTopic(topics[topics.findIndex(t => t.id === selectedTopic.id) - 1])}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    {topics.findIndex(t => t.id === selectedTopic.id) < topics.length - 1 && (
                      <button
                        onClick={() => setSelectedTopic(topics[topics.findIndex(t => t.id === selectedTopic.id) + 1])}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md transition-colors"
                      >
                        Next Topic
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}