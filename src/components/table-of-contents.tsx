'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, BookOpen, Code, AlertTriangle, Lightbulb, Target, FileText } from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  className?: string;
}

// Function to get appropriate icon for section
const getSectionIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('overview') || lowerTitle.includes('concept')) return BookOpen;
  if (lowerTitle.includes('code') || lowerTitle.includes('example')) return Code;
  if (lowerTitle.includes('gotcha') || lowerTitle.includes('warning') || lowerTitle.includes('pitfall')) return AlertTriangle;
  if (lowerTitle.includes('exam') || lowerTitle.includes('tip') || lowerTitle.includes('certification')) return Lightbulb;
  if (lowerTitle.includes('exercise') || lowerTitle.includes('practice')) return Target;

  return FileText; // Default icon
};

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that's currently visible
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );

    // Observe all headings
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className={cn('sticky top-24', className)}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            📑 Table of Contents
          </h3>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <nav className="p-2 max-h-96 overflow-y-auto">
            {items.map((item) => {
              const IconComponent = getSectionIcon(item.title);
              const isActive = activeId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    'toc-item flex items-center w-full text-left px-3 py-2 rounded-md transition-all duration-200 group',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    {
                      'ml-0': item.level === 1,
                      'ml-4': item.level === 2,
                      'ml-8': item.level === 3,
                      'ml-12': item.level === 4,
                      'ml-16': item.level === 5,
                      'ml-20': item.level === 6,
                    },
                    {
                      'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border-l-4 border-blue-500': isActive,
                      'text-gray-700 dark:text-gray-300': !isActive,
                    },
                    {
                      'text-base font-semibold': item.level === 1,
                      'text-sm': item.level === 2,
                      'text-xs': item.level >= 3,
                    }
                  )}
                >
                  <IconComponent
                    className={cn(
                      'h-4 w-4 mr-2 flex-shrink-0',
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    )}
                  />
                  <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}