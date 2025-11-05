'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface Annotation {
  line?: number;
  arrows: string;
  explanation: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  icon: string;
}

interface AnnotatedCodeProps {
  code: string;
  annotations: Annotation[];
  language?: string;
}

const getIconBgColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'danger':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export function AnnotatedCode({ code, annotations, language = 'apex' }: AnnotatedCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="my-6">
      {/* Code Block */}
      <div className="relative group">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          className="rounded-t-lg"
          customStyle={{
            background: '#0f0f0f',
            padding: '1.5rem',
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
            border: '1px solid #2d2d2d',
            borderBottom: annotations.length > 0 ? 'none' : '1px solid #2d2d2d',
            borderBottomLeftRadius: annotations.length > 0 ? '0' : '0.5rem',
            borderBottomRightRadius: annotations.length > 0 ? '0' : '0.5rem',
            margin: 0
          }}
          lineProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent',
              display: 'block'
            }
          }}
          codeTagProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent'
            }
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all opacity-90 hover:opacity-100 shadow-md"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Annotations */}
      {annotations.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-lg p-4 space-y-3">
          {annotations.map((annotation, index) => (
            <div key={index} className="font-mono text-sm">
              {/* Arrow indicators */}
              <div className="text-blue-500 dark:text-blue-400 mb-2 font-bold tracking-wider">
                {annotation.arrows}
              </div>

              {/* Explanation */}
              <div className="flex items-start space-x-3">
                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium flex-shrink-0 mt-0.5 ${getIconBgColor(annotation.type)}`}>
                  {annotation.icon}
                </div>
                <div className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {annotation.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}