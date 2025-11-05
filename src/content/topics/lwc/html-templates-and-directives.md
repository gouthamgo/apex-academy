---
title: "HTML Templates and Directives"
section: "lwc"
order: 2
difficulty: "beginner"
readTime: "20 min"
description: "Master Lightning Web Component HTML templates, directives, conditional rendering, and list iteration for building dynamic user interfaces."
overview: "Learn how to create powerful, reactive templates using LWC HTML directives and best practices."
concepts: ["html-templates", "directives", "if-directive", "for-each", "iterator", "conditional-rendering", "data-binding"]
prerequisites: ["component-fundamentals"]
relatedTopics: ["javascript-in-lwc", "component-lifecycle"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

HTML templates in LWC provide the structure and presentation of your components. Understanding directives is essential for creating dynamic, reactive user interfaces.

## Template Directives

- **if:true, if:false**: Conditional rendering
- **for:each**: Iterate over arrays
- **iterator**: Advanced iteration with index
- **key**: Unique identifier for list items

## Data Binding

- **{property}**: One-way data binding from JS to template
- Property changes automatically update the UI

---

# Code Examples

## Basic Template Structure

```html
<template>
    <lightning-card title="My Component">
        <div class="slds-p-horizontal_small">
            <!-- Content here -->
            <p>{message}</p>
        </div>
    </lightning-card>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    message = 'Hello from LWC!';
}
```

## Conditional Rendering

```html
<template>
    <template if:true={isVisible}>
        <div>This content is visible</div>
    </template>
    
    <template if:false={isVisible}>
        <div>This content is hidden</div>
    </template>
    
    <!-- Conditional CSS classes -->
    <div class={computedClass}></div>
</template>
```

```javascript
export default class ConditionalExample extends LightningElement {
    isVisible = true;
    
    get computedClass() {
        return this.isVisible ? 'visible-class' : 'hidden-class';
    }
}
```

## List Iteration

```html
<template>
    <!-- for:each iteration -->
    <template for:each={contacts} for:item="contact">
        <div key={contact.Id} class="contact-item">
            <p>{contact.Name}</p>
            <p>{contact.Email}</p>
        </div>
    </template>
    
    <!-- iterator with index -->
    <template iterator:it={accounts}>
        <div key={it.value.Id}>
            <div>{it.index}</div>
            <div>{it.value.Name}</div>
            <div if:true={it.first}>First Item</div>
            <div if:true={it.last}>Last Item</div>
        </div>
    </template>
</template>
```

```javascript
export default class ListExample extends LightningElement {
    contacts = [
        { Id: '1', Name: 'John Doe', Email: 'john@example.com' },
        { Id: '2', Name: 'Jane Smith', Email: 'jane@example.com' }
    ];
    
    accounts = [
        { Id: '001', Name: 'Acme Corp' },
        { Id: '002', Name: 'Global Industries' }
    ];
}
```

## Event Handling

```html
<template>
    <lightning-button 
        label="Click Me" 
        onclick={handleClick}>
    </lightning-button>
    
    <lightning-input 
        label="Name" 
        value={name}
        onchange={handleChange}>
    </lightning-input>
</template>
```

```javascript
export default class EventExample extends LightningElement {
    name = '';
    
    handleClick() {
        console.log('Button clicked!');
    }
    
    handleChange(event) {
        this.name = event.target.value;
    }
}
```

---

# Best Practices

✅ Always use `key` directive in iterations
✅ Prefer `if:true/if:false` over CSS hiding
✅ Use getters for computed values
✅ Keep templates clean and readable

❌ Don't manipulate DOM directly
❌ Don't use complex logic in templates
❌ Avoid inline styles when possible

---

# Related Topics

- **[Component Fundamentals](component-fundamentals)**
- **[JavaScript in LWC](javascript-in-lwc)**
- **[Component Lifecycle](component-lifecycle)**
