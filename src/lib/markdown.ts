import { marked } from 'marked';
import { generateTableOfContents } from './utils';
import { highlightCode } from './syntax-highlighter';

// Configure marked with custom renderer
const renderer = new marked.Renderer();

// Custom heading renderer that adds IDs for table of contents
renderer.heading = function (text, level) {
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Add section-specific classes for major sections
  let sectionClass = '';
  if (level === 1) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('core concepts')) sectionClass = 'section-concepts';
    else if (lowerText.includes('code examples')) sectionClass = 'section-code';
    else if (lowerText.includes('common gotchas') || lowerText.includes('gotcha')) sectionClass = 'section-gotchas';
    else if (lowerText.includes('exam tips') || lowerText.includes('exam')) sectionClass = 'section-exam';
    else if (lowerText.includes('practice exercises') || lowerText.includes('exercise')) sectionClass = 'section-practice';
    else if (lowerText.includes('type conversion') || lowerText.includes('casting')) sectionClass = 'section-conversion';
    else if (lowerText.includes('constants') || lowerText.includes('final')) sectionClass = 'section-constants';
    else if (lowerText.includes('related topics')) sectionClass = 'section-related';
  }

  return `<h${level} id="${id}" class="heading-${level} ${sectionClass} group">
    <a href="#${id}" class="anchor-link opacity-0 group-hover:opacity-100 transition-opacity">
      ${text}
    </a>
  </h${level}>`;
};

// Custom code renderer with syntax highlighting
renderer.code = function (code, language) {
  const validLanguage = language && language.match(/^[a-zA-Z0-9_+-]*$/);
  const lang = validLanguage ? language : 'text';

  // Apply syntax highlighting
  const highlightedCode = highlightCode(code, lang);

  return `<div class="code-block-wrapper relative group my-6" data-language="${lang}">
    <div class="absolute top-3 right-3 z-10">
      <button class="copy-code-btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-all shadow-md opacity-90 hover:opacity-100 flex items-center gap-2" data-code="${code.replace(/"/g, '&quot;').replace(/\n/g, '\\n')}">
        <svg class="copy-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        <span class="copy-text">Copy</span>
        <svg class="check-icon w-4 h-4 hidden text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </button>
    </div>
    <pre class="bg-[#1e1e1e] dark:bg-[#0d1117] rounded-lg p-6 overflow-x-auto border border-gray-700 dark:border-gray-800 shadow-lg"><code class="language-${lang} text-sm leading-relaxed font-mono">${highlightedCode}</code></pre>
  </div>`;
};

// Custom blockquote renderer for callouts
renderer.blockquote = function (quote) {
  // Check for callout patterns
  const calloutMatch = quote.match(/^<p>(💡|⚠️|💀|ℹ️|✅|🎯)\s*(TIP|WARNING|ERROR|INFO|EXAM[-_]TRAP|BEST[-_]PRACTICE)[:]\s*(.*?)<\/p>/i);

  if (calloutMatch) {
    const [, icon, type, content] = calloutMatch;
    const calloutType = type.toLowerCase().replace('-', '-').replace('_', '-');

    const colorClasses = {
      tip: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500',
      warning: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500',
      error: 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500',
      'exam-trap': 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500',
      info: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500',
      'best-practice': 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-500',
    };

    const colorClass = colorClasses[calloutType as keyof typeof colorClasses] || colorClasses.info;

    return `<div class="callout ${colorClass} border-l-4 p-4 my-6 rounded-r-lg">
      <div class="flex items-start space-x-3">
        <span class="text-lg">${icon}</span>
        <div class="flex-1">
          <h5 class="font-semibold text-gray-900 dark:text-gray-100 capitalize mb-1">
            ${calloutType.replace('-', ' ')}
          </h5>
          <div class="text-gray-700 dark:text-gray-300">${content}</div>
        </div>
      </div>
    </div>`;
  }

  return `<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">${quote}</blockquote>`;
};

// Custom table renderer for better styling
renderer.table = function (header, body) {
  return `<div class="table-wrapper overflow-x-auto my-6">
    <table class="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <thead class="bg-gray-50 dark:bg-gray-800">${header}</thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">${body}</tbody>
    </table>
  </div>`;
};

renderer.tablerow = function (content) {
  return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">${content}</tr>`;
};

renderer.tablecell = function (content, flags) {
  const type = flags.header ? 'th' : 'td';
  const className = flags.header
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
    : 'px-6 py-4 text-sm text-gray-900 dark:text-gray-100';

  return `<${type} class="${className}">${content}</${type}>`;
};

// Configure marked options
marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
  pedantic: false,
});

export async function markdownToHtml(markdown: string): Promise<{
  html: string;
  tableOfContents: Array<{ id: string; title: string; level: number }>;
}> {
  // Generate table of contents before processing
  const tableOfContents = generateTableOfContents(markdown);

  // Convert markdown to HTML
  const html = await marked(markdown);

  return {
    html,
    tableOfContents,
  };
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/\n\s*\n/g, ' ') // Replace double newlines with space
    .replace(/\n/g, ' ') // Replace single newlines with space
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}