'use client';

import { useState } from 'react';
import { ChevronDownIcon, CheckCircleIcon, ChevronRightIcon } from 'lucide-react';
import { PracticeQuestion } from '@/data/topicContent';

interface QuestionCardProps {
  question: PracticeQuestion;
  children?: React.ReactNode;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [isAnswered, setIsAnswered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Question {question.number}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          {isAnswered && (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 dark:text-gray-200 mb-3">{question.question}</p>

        {question.code && (
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <pre className="text-gray-100 text-sm overflow-x-auto">
              <code>{question.code}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setIsAnswered(true);
          }}
          className="w-full cursor-pointer flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
        >
          <span className="font-medium text-blue-900 dark:text-blue-100">
            Show Answer & Explanation
          </span>
          <div className="flex items-center">
            <div
              className={`question-arrow transition-transform duration-200 ease-in-out ${
                isOpen ? 'rotate-90' : 'rotate-0'
              }`}
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: isOpen ? '8px solid #3b82f6' : '8px solid #6b7280',
                marginRight: '4px'
              }}
            />
          </div>
        </button>

        {isOpen && (
          <div className="answer-content mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="answer-section p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Answer:</h4>
              <p className="text-blue-800 dark:text-blue-200">{question.answer}</p>
            </div>

            <div className="explanation-section p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Explanation:</h4>
              <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
            </div>

            {question.correctCode && (
              <div className="correct-code-section p-4 bg-gray-900 rounded-lg">
                <h4 className="font-semibold text-gray-100 mb-2">Correct Code:</h4>
                <pre className="text-gray-100 text-sm overflow-x-auto">
                  <code>{question.correctCode}</code>
                </pre>
              </div>
            )}

            <div className="learning-points p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Key Learning:</h4>
              <p className="text-green-800 dark:text-green-200">{question.keyLearning}</p>
            </div>

            <div className="exam-tip p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Exam Tip:</h4>
              <p className="text-purple-800 dark:text-purple-200">{question.examTip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface PracticeSectionProps {
  topicName: string;
  questions: PracticeQuestion[];
}

export function PracticeSection({ topicName, questions }: PracticeSectionProps) {
  return (
    <section className="mt-12 pt-8 border-t-2 border-blue-200 dark:border-blue-800">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Practice Questions ({questions.length})
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Test your understanding of <strong>{topicName}</strong> with these comprehensive questions.
          Click "Show Answer & Explanation" to reveal the solution with detailed explanations.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>💡 Study Tip:</strong> Try to answer each question in your head before revealing the answer.
            This active recall strengthens your understanding and prepares you for certification exams.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {questions.map((question) => (
          <QuestionCard key={question.number} question={question} />
        ))}
      </div>
    </section>
  );
}