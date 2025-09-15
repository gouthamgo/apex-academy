# Apex Academy - Complete Salesforce Development Curriculum

A comprehensive topic-based curriculum for mastering Salesforce development. Learn Apex, Lightning Web Components, integration patterns, and testing strategies through structured topics with detailed, annotated code examples.

## Features

- 📚 **Topic-Based Curriculum** - Structured learning paths from fundamentals to advanced concepts
- 🔥 **Detailed Code Examples** - Line-by-line explanations with comprehensive annotations
- 🎯 **Exam-Focused Content** - Certification exam traps, best practices, and key concepts
- 💡 **Real-World Patterns** - Practical examples and common development scenarios
- 🌙 **Dark/Light Mode** - System preference detection with manual toggle
- 📱 **Responsive Design** - Optimized for all devices and reading experiences
- 🔍 **Advanced Search** - Full-text search across all topics and code examples
- 📊 **Progress Tracking** - Track your learning journey through each curriculum
- ⚡ **Fast Performance** - Static generation with excellent Core Web Vitals

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown with frontmatter
- **Syntax Highlighting**: Prism.js with custom Apex language support
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/apex-academy.git
cd apex-academy
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── tutorials/         # Tutorial pages
├── components/            # Reusable components
│   ├── code-block.tsx     # Syntax highlighted code blocks
│   ├── tutorial-card.tsx  # Tutorial preview cards
│   ├── header.tsx         # Site header
│   └── footer.tsx         # Site footer
├── content/               # Markdown content
│   └── tutorials/         # Tutorial content
│       ├── apex/          # Apex tutorials
│       ├── lwc/           # Lightning Web Component tutorials
│       ├── integration/   # Integration tutorials
│       └── testing/       # Testing tutorials
├── lib/                   # Utility functions
│   ├── content.ts         # Content management system
│   ├── markdown.ts        # Markdown processing
│   ├── syntax-highlighter.ts # Code highlighting
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
```

## Content Management

### Adding New Tutorials

1. Create a new markdown file in the appropriate category folder:
```
src/content/tutorials/[category]/your-tutorial-slug.md
```

2. Add frontmatter at the top of the file:
```yaml
---
title: "Your Tutorial Title"
category: "apex" # apex | lwc | integration | testing
difficulty: "intermediate" # beginner | intermediate | advanced
readTime: "15 min"
author: "Your Name"
description: "Brief description of the tutorial"
tags: ["apex", "triggers", "best-practices"]
prerequisites: ["apex-basics", "soql-fundamentals"]
relatedTutorials: ["related-tutorial-slug"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true # Optional
---
```

3. Write your tutorial content using markdown with special annotation syntax:

```apex
public class ExampleClass {
    // 💡 TIP: This is a helpful tip annotation
    // → Appears as a tooltip and in the annotations section

    // 💀 EXAM TRAP: This is a certification exam warning
    // → Highlights common mistakes in certification scenarios

    @InvocableMethod
    public static List<Response> processData(List<Request> inputs) {
        // ✅ BEST PRACTICE: Always use bulkification patterns
        // → Shows recommended approaches
    }
}
```

### Annotation System

The platform supports several annotation types:

- `💡 TIP:` - Helpful tips and insights
- `💀 EXAM TRAP:` - Certification exam warnings
- `⚠️ WARNING:` - Important warnings
- `✅ BEST PRACTICE:` - Recommended approaches
- `ℹ️ INFO:` - Additional information
- `🎯 TARGET:` - Specific goals or objectives

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your deployment.

### Environment Variables

Set the following environment variables in your deployment:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Apex Academy"
NEXT_PUBLIC_SITE_DESCRIPTION="Master Salesforce Development"
```

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tutorial`
3. Add your tutorial following the content guidelines
4. Commit your changes: `git commit -m 'Add new Apex tutorial'`
5. Push to your branch: `git push origin feature/new-tutorial`
6. Submit a pull request

## Content Guidelines

### Writing Style

- Use clear, concise explanations
- Include real-world examples
- Highlight common pitfalls
- Provide context for why patterns are used
- Include comprehensive code comments

### Code Examples

- Always include working, tested code
- Use meaningful variable names
- Follow Salesforce best practices
- Include error handling where appropriate
- Explain governor limit considerations

### Annotations

- Use annotations sparingly but effectively
- Focus on learning opportunities
- Highlight certification-relevant content
- Explain the "why" behind patterns

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support:

- 📧 Email: support@apex-academy.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/apex-academy/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/apex-academy/discussions)

## Acknowledgments

- Salesforce Developer Community
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prism.js for syntax highlighting
- All contributors who help make this platform better

---

Built with ❤️ for the Salesforce Developer Community