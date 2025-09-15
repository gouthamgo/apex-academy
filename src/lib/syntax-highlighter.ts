import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';

// Custom Apex language definition
Prism.languages.apex = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  'string': {
    pattern: /(["'])(?:(?!\1)[^\\\r\n\\]|\\(?:\r\n|[\s\S]))*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:class|interface|new|implements|extends)\s+|\b(?:public|private|protected|global)\s+(?:class|interface)\s+)[A-Z]\w*/,
    lookbehind: true
  },
  'keyword': /\b(?:abstract|after|before|break|catch|class|continue|delete|do|else|enum|extends|final|finally|for|get|global|if|implements|insert|instanceof|interface|new|null|override|private|protected|public|return|set|static|super|testmethod|this|throw|try|trigger|undelete|update|upsert|virtual|void|webservice|while|with|without|sharing|inherited)\b/,
  'annotation': {
    pattern: /@\w+/,
    alias: 'punctuation'
  },
  'boolean': /\b(?:true|false)\b/,
  'function': /\w+(?=\s*\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};

// SOQL language definition
Prism.languages.soql = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  'string': {
    pattern: /(["'])(?:(?!\1)[^\\\r\n\\]|\\(?:\r\n|[\s\S]))*\1/,
    greedy: true
  },
  'keyword': /\b(?:SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|WITH|SECURITY_ENFORCED|FOR VIEW|FOR REFERENCE|UPDATE TRACKING|UPDATE VIEWSTAT|AND|OR|NOT|IN|LIKE|INCLUDES|EXCLUDES|ASC|DESC|NULLS FIRST|NULLS LAST|TODAY|YESTERDAY|THIS_WEEK|LAST_WEEK|THIS_MONTH|LAST_MONTH|THIS_QUARTER|LAST_QUARTER|THIS_YEAR|LAST_YEAR|CALENDAR_MONTH|CALENDAR_QUARTER|CALENDAR_YEAR)\b/i,
  'function': /\b(?:AVG|COUNT|COUNT_DISTINCT|MIN|MAX|SUM|CALENDAR_MONTH|CALENDAR_QUARTER|CALENDAR_YEAR|DAY_IN_MONTH|DAY_IN_WEEK|DAY_IN_YEAR|DAY_ONLY|FISCAL_MONTH|FISCAL_QUARTER|FISCAL_YEAR|HOUR_IN_DAY|WEEK_IN_MONTH|WEEK_IN_YEAR|FORMAT|CONVERTCURRENCY|TOLABEL|DISTANCE|GEOLOCATION)\b/i,
  'operator': /[<>]=?|[!=]=?|[+\-*/%]|&&?|\|\||!/,
  'punctuation': /[{}[\]();,.]/,
  'number': /\b\d+(?:\.\d+)?\b/,
  'boolean': /\b(?:true|false)\b/i
};

export function highlightCode(code: string, language: string): string {
  const normalizedLanguage = language.toLowerCase();

  // Map language aliases
  const languageMap: { [key: string]: string } = {
    'apex': 'apex',
    'java': 'java',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'html': 'markup',
    'xml': 'markup',
    'css': 'css',
    'json': 'json',
    'sql': 'sql',
    'soql': 'soql',
  };

  const prismLanguage = languageMap[normalizedLanguage] || 'markup';

  try {
    if (Prism.languages[prismLanguage]) {
      return Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage);
    }
  } catch (error) {
    console.warn(`Syntax highlighting failed for language: ${prismLanguage}`, error);
  }

  // Fallback to plain text with basic escaping
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type AnnotationType = 'tip' | 'warning' | 'error' | 'info' | 'exam-trap' | 'best-practice';

export function parseCodeAnnotations(code: string): {
  code: string;
  annotations: Array<{
    line: number;
    type: AnnotationType;
    content: string;
    icon?: string;
  }>;
} {
  // For now, return the code as-is with no annotations
  // This can be enhanced later with proper annotation parsing
  return {
    code,
    annotations: [],
  };
}

function getAnnotationIcon(type: string): string {
  const icons = {
    tip: '💡',
    warning: '⚠️',
    error: '💀',
    'exam-trap': '💀',
    info: 'ℹ️',
    'best-practice': '✅',
  };
  return icons[type as keyof typeof icons] || 'ℹ️';
}