---
title: "Styling and CSS in Lightning Web Components"
section: "lwc"
order: 9
difficulty: "beginner"
readTime: "18 min"
description: "Master CSS styling in LWC including component styles, SLDS, CSS custom properties, and styling best practices."
overview: "Learn how to style Lightning Web Components using CSS, Salesforce Lightning Design System, and modern CSS techniques."
concepts: ["css", "styling", "slds", "css-custom-properties", "shadow-dom", "styling-hooks"]
prerequisites: ["component-fundamentals", "html-templates-and-directives"]
relatedTopics: ["javascript-in-lwc"]
lastUpdated: "2025-01-15"
examWeight: "medium"
---

# Styling LWC

## CSS Scope
- Component styles are scoped
- Use SLDS for consistency
- Lightning Base Components are pre-styled

## Styling Approaches
- Component CSS files
- SLDS utility classes
- CSS custom properties
- Inline styles (use sparingly)

---

# Code Examples

## Component CSS

```css
/* myComponent.css */
.container {
    padding: 1rem;
    background-color: #f3f3f3;
}

.title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #080707;
}

.card {
    border: 1px solid #dddbda;
    border-radius: 0.25rem;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}
```

## Using SLDS

```html
<template>
    <div class="slds-box slds-theme_default">
        <h2 class="slds-text-heading_medium slds-m-bottom_small">
            Title
        </h2>
        <p class="slds-text-body_regular">
            Content here
        </p>
    </div>
</template>
```

## Dynamic Styling

```javascript
export default class DynamicStyling extends LightningElement {
    isActive = true;
    
    get containerClass() {
        return this.isActive ? 'container active' : 'container';
    }
    
    get cardStyle() {
        return this.isActive 
            ? 'background-color: #e8f4f8;' 
            : 'background-color: white;';
    }
}
```

```html
<template>
    <div class={containerClass} style={cardStyle}>
        Content
    </div>
</template>
```

---

# Best Practices

✅ Use SLDS for consistent styling
✅ Use CSS custom properties for theming
✅ Keep styles scoped to component
✅ Use utility classes for common patterns

❌ Don't use !important
❌ Don't override base component styles
❌ Don't use inline styles excessively

---

# Related Topics

- **[HTML Templates](html-templates-and-directives)**
- **[Component Fundamentals](component-fundamentals)**
