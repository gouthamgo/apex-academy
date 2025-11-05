'use client';

import { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCode, parseCodeAnnotations } from '@/lib/syntax-highlighter';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  title?: string;
  annotations?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  title,
  annotations = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const { code: cleanCode, annotations: codeAnnotations } = annotations
    ? parseCodeAnnotations(code)
    : { code, annotations: [] };

  const highlightedCode = highlightCode(cleanCode, language);
  const lines = highlightedCode.split('\n');

  const copyToClipboard = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(cleanCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  return (
    <div className={cn('group relative', className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {language}
          </span>
        </div>
      )}

      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md opacity-90 hover:opacity-100 transition-all shadow-md z-10"
          title="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>

        <pre className={cn(
          'overflow-x-auto p-4 bg-code-bg text-gray-200 text-sm leading-relaxed',
          title ? 'rounded-b-lg' : 'rounded-lg',
          'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
        )}>
          <code ref={codeRef} className="font-mono">
            {lines.map((line, index) => {
              const annotation = codeAnnotations.find(a => a.line === index);

              return (
                <div key={index} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell pr-4 text-gray-500 select-none text-right">
                      {index + 1}
                    </span>
                  )}
                  <span
                    className="table-cell relative"
                    dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                  />
                  {annotation && (
                    <div className="absolute left-full ml-4 top-0 group/annotation">
                      <div className="flex items-center text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-700 whitespace-nowrap">
                        <span className="mr-1">{annotation.icon}</span>
                        <span className="uppercase font-medium">{annotation.type.replace('-', ' ')}</span>
                      </div>
                      <div className="hidden group-hover/annotation:block absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-md z-20">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {annotation.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {codeAnnotations.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Code Annotations
          </h4>
          {codeAnnotations.map((annotation, index) => (
            <div
              key={index}
              className={cn(
                'p-3 rounded-lg border-l-4',
                {
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500': annotation.type === 'info',
                  'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-500': annotation.type === 'tip',
                  'bg-orange-50 dark:bg-orange-900/20 border-orange-400 dark:border-orange-500': annotation.type === 'warning',
                  'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-500': annotation.type === 'error' || annotation.type === 'exam-trap',
                  'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500': annotation.type === 'best-practice',
                }
              )}
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg">{annotation.icon}</span>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {annotation.type.replace('-', ' ')} (Line {annotation.line + 1})
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {annotation.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}