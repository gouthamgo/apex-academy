---
title: "Event Handling and Component Communication"
section: "lwc"
order: 7
difficulty: "intermediate"
readTime: "24 min"
description: "Master component communication patterns using events, including custom events, parent-child communication, and pub-sub patterns."
overview: "Learn how to communicate between components using standard events, custom events, and the Lightning Message Service."
concepts: ["events", "custom-events", "event-bubbling", "event-composition", "parent-child-communication", "pubsub"]
prerequisites: ["javascript-in-lwc", "component-fundamentals"]
relatedTopics: ["navigation-service", "lightning-message-service"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Component Communication Patterns

## Parent to Child
- Public properties (@api)
- Public methods (@api)

## Child to Parent
- Custom events (CustomEvent)
- Event bubbling and composition

## Sibling to Sibling
- Events through common parent
- Lightning Message Service (LMS)

---

# Code Examples

## Custom Events

```javascript
// Child Component
import { LightningElement } from 'lwc';

export default class ChildComponent extends LightningElement {
    
    handleClick() {
        // Create custom event
        const event = new CustomEvent('selected', {
            detail: { recordId: '001XXXXXX', name: 'Account Name' }
        });
        
        // Dispatch event
        this.dispatchEvent(event);
    }
}
```

```html
<!-- Parent Component Template -->
<template>
    <c-child-component onselected={handleSelection}></c-child-component>
</template>
```

```javascript
// Parent Component
export default class ParentComponent extends LightningElement {
    
    handleSelection(event) {
        const recordId = event.detail.recordId;
        const name = event.detail.name;
        console.log('Selected:', recordId, name);
    }
}
```

## Event Bubbling and Composition

```javascript
export default class BubblingExample extends LightningElement {
    
    // Bubbles through DOM
    handleBubbling() {
        const event = new CustomEvent('notify', {
            detail: { message: 'Hello' },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}
```

## Parent-Child Communication

```javascript
// Parent Component
import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {
    message = 'Data from parent';
    
    handleRefresh() {
        // Call child method
        this.template.querySelector('c-child').refresh();
    }
}
```

```javascript
// Child Component
import { LightningElement, api } from 'lwc';

export default class Child extends LightningElement {
    // Public property
    @api message;
    
    // Public method
    @api
    refresh() {
        console.log('Child refreshed');
    }
}
```

---

# Best Practices

✅ Use bubbles:true for DOM events
✅ Use composed:true for shadow DOM
✅ Name events in lowercase with dashes
✅ Document custom events

---

# Related Topics

- **[JavaScript in LWC](javascript-in-lwc)**
- **[Component Communication Patterns Tutorial](component-communication-patterns)**
