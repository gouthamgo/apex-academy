---
title: "Component Lifecycle Hooks"
section: "lwc"
order: 3
difficulty: "intermediate"
readTime: "18 min"
description: "Master Lightning Web Component lifecycle hooks including constructor, connectedCallback, renderedCallback, and disconnectedCallback."
overview: "Learn when and how to use lifecycle hooks for initialization, rendering, and cleanup in LWC."
concepts: ["lifecycle", "constructor", "connectedCallback", "renderedCallback", "disconnectedCallback", "errorCallback"]
prerequisites: ["component-fundamentals", "html-templates-and-directives"]
relatedTopics: ["wire-service-and-apex", "event-handling"]
lastUpdated: "2025-01-15"
examWeight: "medium"
---

# Lifecycle Hooks

LWC provides lifecycle hooks that fire at specific times in a component's life:

## Lifecycle Order

1. **constructor()** - Component created
2. **connectedCallback()** - Component inserted into DOM
3. **renderedCallback()** - Component rendered/re-rendered
4. **disconnectedCallback()** - Component removed from DOM
5. **errorCallback()** - Error in component or child

---

# Code Examples

```javascript
import { LightningElement } from 'lwc';

export default class LifecycleExample extends LightningElement {
    
    // 1. Constructor - initialize properties
    constructor() {
        super(); // Must call super()
        console.log('Constructor called');
        this.message = 'Component created';
        // Cannot access this.template yet
    }
    
    // 2. Connected - component in DOM
    connectedCallback() {
        console.log('Connected to DOM');
        // Load data, register listeners
        this.loadData();
    }
    
    // 3. Rendered - after render
    renderedCallback() {
        console.log('Component rendered');
        // Access rendered elements
        const element = this.template.querySelector('.my-element');
    }
    
    // 4. Disconnected - cleanup
    disconnectedCallback() {
        console.log('Removed from DOM');
        // Remove listeners, clean up
    }
    
    // 5. Error handling
    errorCallback(error, stack) {
        console.error('Error occurred', error);
        console.error('Stack', stack);
    }
    
    loadData() {
        // API calls, etc
    }
}
```

## Best Practices

✅ Use `connectedCallback` for data loading
✅ Use `renderedCallback` for DOM manipulation (carefully)
✅ Clean up in `disconnectedCallback`
❌ Don't update state in `renderedCallback` (causes infinite loop)

---

# Related Topics

- **[Component Fundamentals](component-fundamentals)**
- **[Wire Service](wire-service-and-apex)**
