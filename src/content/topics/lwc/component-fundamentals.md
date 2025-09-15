---
title: "Component Fundamentals"
section: "lwc"
order: 1
difficulty: "beginner"
readTime: "22 min"
description: "Master Lightning Web Component architecture, structure, and lifecycle with comprehensive examples and best practices."
overview: "Learn the core concepts of Lightning Web Components: file structure, component lifecycle, property binding, and fundamental patterns for building robust components."
concepts: ["component-structure", "lifecycle-hooks", "property-binding", "reactive-properties", "component-architecture", "file-organization"]
prerequisites: ["javascript-fundamentals", "html-css-basics"]
relatedTopics: ["data-binding-and-templates", "component-communication", "event-handling"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Component Fundamentals

Lightning Web Components (LWC) are the modern framework for building user interfaces in Salesforce. Understanding the component architecture, lifecycle, and fundamental patterns is essential for creating maintainable, performant applications.

## Overview

In this comprehensive topic, you'll master:
- LWC file structure and component architecture
- Component lifecycle hooks and when to use each
- Property binding and reactive programming patterns
- Component registration and deployment
- Best practices for component organization
- Common patterns and anti-patterns to avoid

## Core Concepts

### Component File Structure

Every Lightning Web Component consists of multiple files that work together to define the component's behavior, appearance, and metadata.

```
myComponent/
├── myComponent.js        // JavaScript class with component logic
├── myComponent.html      // HTML template for component UI
├── myComponent.css       // Styles scoped to this component
├── myComponent.svg       // Optional: Custom icon for App Builder
└── myComponent.js-meta.xml // Metadata configuration
```

#### JavaScript File - Component Logic

```javascript
// myComponent.js
import { LightningElement, api, track, wire } from 'lwc';

export default class MyComponent extends LightningElement {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // CLASS DECLARATION: Must extend LightningElement
    // → Provides component lifecycle and reactive system
    // 💡 NAMING: Class name should match component folder (camelCase)

    // Public properties (exposed to parent components)
    @api componentTitle = 'Default Title';
    @api maxRecords = 10;
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // @API DECORATOR: Makes properties public
    // → Parent components can set these values
    // ✅ BEST PRACTICE: Always provide default values

    // Private reactive properties
    @track privateData = { count: 0, items: [] };
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // @TRACK DECORATOR: Makes objects/arrays reactive
    // → Component rerenders when tracked data changes
    // ⚠️ PERFORMANCE: Only track what needs reactivity

    // Simple reactive properties (no decorator needed)
    message = 'Hello World';
    isVisible = true;
    recordCount = 0;
    // ^^^^^^^^^^^^^^
    // PRIMITIVE REACTIVITY: Primitives are automatically reactive
    // → No @track needed for String, Number, Boolean
    // 💡 SIMPLICITY: Prefer primitives when possible

    // Wire service for data
    @wire(getRecords, { maxRecords: '$maxRecords' })
    wiredRecords;
    // ^^^^^^^^^^^^
    // @WIRE DECORATOR: Connects to data services
    // → Automatically updates when parameters change
    // 💡 REACTIVE: $ prefix makes parameter reactive

    // Getters for computed properties
    get displayMessage() {
        return `${this.componentTitle}: ${this.message}`;
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // COMPUTED PROPERTIES: Calculated values based on other properties
    // → Automatically recalculated when dependencies change
    // ✅ PERFORMANCE: Cached until dependencies change

    get isDataEmpty() {
        return this.privateData.items.length === 0;
    }

    // Lifecycle hooks
    connectedCallback() {
        // ^^^^^^^^^^^^^^^^^^
        // CONNECTED CALLBACK: Component inserted into DOM
        // → Perfect for initialization, event listeners, data loading
        console.log('Component connected to DOM');
        this.loadInitialData();
    }

    disconnectedCallback() {
        // ^^^^^^^^^^^^^^^^^^^^
        // DISCONNECTED CALLBACK: Component removed from DOM
        // → Essential for cleanup: timers, event listeners, subscriptions
        console.log('Component disconnected from DOM');
        this.cleanup();
    }

    renderedCallback() {
        // ^^^^^^^^^^^^^^^^^^
        // RENDERED CALLBACK: After every render cycle
        // → Use for DOM manipulation, third-party library integration
        // ⚠️ PERFORMANCE: Called frequently, keep logic minimal
        console.log('Component rendered');
    }

    // Event handlers
    handleClick(event) {
        // ^^^^^^^^^^^^^^^^^^
        // EVENT HANDLERS: Respond to user interactions
        // → Always use handle* naming convention
        this.recordCount += 1;
        this.message = `Clicked ${this.recordCount} times`;
    }

    handleInputChange(event) {
        const newValue = event.target.value;
        this.message = newValue;
        // ^^^^^^^^^^^^^^^^^^^
        // REACTIVE UPDATE: Assignment triggers component rerender
        // → Framework automatically updates template
        // 💡 SIMPLICITY: No manual DOM manipulation needed
    }

    // Helper methods
    loadInitialData() {
        // Simulate data loading
        setTimeout(() => {
            this.privateData = {
                ...this.privateData,
                items: ['Item 1', 'Item 2', 'Item 3']
            };
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // OBJECT UPDATE: Spread operator creates new object
            // → Triggers reactivity for @track properties
            // ✅ IMMUTABILITY: Preferred pattern for object updates
        }, 1000);
    }

    cleanup() {
        // Cleanup logic here
        console.log('Cleaning up resources');
    }
}
```

#### HTML Template - Component UI

```html
<!-- myComponent.html -->
<template>
    <!--
         ^^^^^^^^
         TEMPLATE ROOT: Every LWC template must have single <template> root
         → Contains all component markup
         💡 CONSTRAINT: Only one root element allowed
    -->

    <div class="component-container">
        <!-- Property binding -->
        <h1 class="title">{displayMessage}</h1>
        <!--
             ^^^^^^^^^^^^^^
             PROPERTY BINDING: Displays computed property value
             → Automatically updates when dependencies change
             💡 SYNTAX: Curly braces for text interpolation
        -->

        <p class="description">Records to display: {maxRecords}</p>

        <!-- Conditional rendering -->
        <template if:true={isVisible}>
            <!--
                 ^^^^^^^^^^^^^^^^^^
                 CONDITIONAL RENDERING: Show/hide based on property
                 → if:true shows when property is truthy
                 → if:false shows when property is falsy
            -->
            <div class="visible-content">
                <p>This content is visible when isVisible is true</p>
                <p>Current message: {message}</p>
            </div>
        </template>

        <template if:false={isDataEmpty}>
            <div class="data-list">
                <h3>Available Items:</h3>
                <!-- List rendering -->
                <template for:each={privateData.items} for:item="item" for:index="index">
                    <!--
                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                         LIST RENDERING: Iterate over array property
                         → for:each specifies the array
                         → for:item defines variable name for each element
                         → for:index provides zero-based index (optional)
                         💀 EXAM TRAP: Must include key attribute for performance
                    -->
                    <div key={item} class="list-item">
                        <span>#{index}: {item}</span>
                    </div>
                </template>
            </div>
        </template>

        <!-- User input -->
        <div class="input-section">
            <lightning-input
                label="Message"
                value={message}
                onchange={handleInputChange}>
                <!--
                     ^^^^^^^^^^^^^^^^^^^^
                     EVENT BINDING: Connect DOM events to component methods
                     → onchange maps to handleInputChange method
                     💡 NAMING: on + eventname = handler method
                -->
            </lightning-input>

            <lightning-button
                label="Click Me"
                onclick={handleClick}
                class="action-button">
            </lightning-button>
        </div>

        <!-- Dynamic styling -->
        <div class={computedCssClass}>
            <!--
                 ^^^^^^^^^^^^^^^^^^
                 DYNAMIC CLASSES: CSS classes based on component state
                 → Can bind to property or getter for conditional styling
            -->
            <p>This div has dynamic styling based on component state</p>
        </div>

        <!-- Slot for content projection -->
        <div class="content-area">
            <slot name="header"></slot>
            <!--
                 ^^^^^^^^^^^^^^^^^^^
                 NAMED SLOT: Allows parent to inject specific content
                 → Parent uses slot="header" to target this slot
                 💡 FLEXIBILITY: Makes components more reusable
            -->

            <slot></slot>
            <!--
                 ^^^^^^
                 DEFAULT SLOT: Receives any unslotted content from parent
                 → Most flexible content projection pattern
            -->
        </div>
    </div>
</template>
```

#### CSS File - Component Styles

```css
/* myComponent.css */

/* Component-scoped styles */
.component-container {
    /*
       ^^^^^^^^^^^^^^^^^^^
       SCOPED STYLES: CSS automatically scoped to this component
       → Styles don't leak to other components
       → Other components can't override these styles
       ✅ ENCAPSULATION: Prevents style conflicts
    */
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.title {
    color: #0176d3; /* Salesforce blue */
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.visible-content {
    padding: 1rem;
    background-color: #e8f4f8;
    border-left: 4px solid #0176d3;
    margin: 1rem 0;
}

.data-list {
    margin: 1rem 0;
}

.list-item {
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
    /*
       ^^^^^^^^^^^^^^^^^^^^^^^^^
       LIST STYLING: Style individual list items
       → Automatically applied to each rendered item
       💡 CONSISTENCY: Uniform styling across dynamic content
    */
}

.list-item:last-child {
    border-bottom: none;
}

.input-section {
    margin: 1rem 0;
    display: flex;
    gap: 1rem;
    align-items: end;
}

.action-button {
    margin-left: 0.5rem;
}

/* Dynamic styling based on component state */
.highlight {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
}

.error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}

.content-area {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/*
   CSS CUSTOM PROPERTIES: Define reusable values
   → Can be overridden by parent components using CSS custom properties
*/
:host {
    --primary-color: #0176d3;
    --secondary-color: #666;
    --spacing-small: 0.5rem;
    --spacing-medium: 1rem;
    /*
       ^^^^^^^^^^^^^^^^^^^^
       CSS CUSTOM PROPERTIES: Component-level variables
       → Use throughout component for consistency
       → Can be overridden by parent components
       ✅ MAINTAINABILITY: Change values in one place
    */
}
```

#### Metadata Configuration

```xml
<!-- myComponent.js-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <!--
         ^^^^^^^^^^^^^^^^^^^^^^^
         METADATA ROOT: Defines component configuration
         → Controls where and how component can be used
    -->

    <apiVersion>61.0</apiVersion>
    <!--
         ^^^^^^^^^^^^^^^^^^^^
         API VERSION: Salesforce platform version
         → Should match your org's API version
         💡 COMPATIBILITY: Ensures component works with platform features
    -->

    <isExposed>true</isExposed>
    <!--
         ^^^^^^^^^^^^^^^^^^^
         EXPOSURE: Makes component available for use
         → false = only usable by other components in same namespace
         → true = available in App Builder, Experience Builder, etc.
    -->

    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
        <target>lightning__AppPage</target>
        <!--
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
             TARGETS: Define where component can be used
             → RecordPage: Record detail pages
             → HomePage: Home page layouts
             → AppPage: Custom app pages
             💡 PLACEMENT: Controls component availability in builders
        -->
    </targets>

    <targetConfigs>
        <targetConfig targets="lightning__RecordPage">
            <property name="componentTitle" type="String" default="Record Component" />
            <property name="maxRecords" type="Integer" default="5" min="1" max="50" />
            <!--
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                 CONFIGURABLE PROPERTIES: Admin can configure in App Builder
                 → type: String, Integer, Boolean, etc.
                 → default: Default value shown in builder
                 → min/max: Validation for numeric properties
                 ✅ FLEXIBILITY: Makes components adaptable without code changes
            -->
        </targetConfig>
    </targetConfigs>

    <masterLabel>My Custom Component</masterLabel>
    <!--
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         DISPLAY NAME: Human-readable name shown in builders
         → Appears in component palette and configuration
    -->

    <description>A comprehensive example component demonstrating LWC fundamentals</description>
    <!--
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         DESCRIPTION: Tooltip and help text in builders
         → Helps admins understand component purpose
    -->
</LightningComponentBundle>
```

## Component Lifecycle Deep Dive

Understanding the component lifecycle is crucial for proper initialization, cleanup, and performance optimization.

```javascript
// lifecycleExample.js
import { LightningElement, api, track } from 'lwc';

export default class LifecycleExample extends LightningElement {
    @api recordId;
    @track data = {};

    // 1. CONSTRUCTOR - Component instantiation
    constructor() {
        super();
        // ^^^^^^^^
        // SUPER CALL: Required to initialize LightningElement
        // → Must be first line in constructor
        // 💡 LIMITED USE: Most initialization should be in connectedCallback

        console.log('1. Constructor called');

        // Available in constructor:
        // - Initialize non-reactive properties
        // - Set up component state

        // NOT available in constructor:
        // - this.template (template not yet created)
        // - @api properties (not yet set by parent)
        // - DOM manipulation
    }

    // 2. CONNECTED CALLBACK - Component inserted into DOM
    connectedCallback() {
        console.log('2. Connected callback called');
        console.log('recordId:', this.recordId); // @api properties available

        // Perfect for:
        this.setupEventListeners();
        this.loadData();
        this.startTimers();
        // ^^^^^^^^^^^^^^^^^^
        // INITIALIZATION: Set up component functionality
        // → Event listeners, data loading, timers
        // ✅ BEST PRACTICE: Main initialization hook
    }

    // 3. RENDERED CALLBACK - After every render
    renderedCallback() {
        console.log('3. Rendered callback called');

        // Available:
        // - this.template (query DOM elements)
        // - All component properties

        // Use cases:
        this.initializeThirdPartyLibraries();
        this.updateDOMDirectly();
        this.measureElementSizes();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DOM OPERATIONS: Direct DOM manipulation after render
        // → Third-party library integration
        // ⚠️ PERFORMANCE: Called after every render, keep lightweight
    }

    // 4. DISCONNECTED CALLBACK - Component removed from DOM
    disconnectedCallback() {
        console.log('4. Disconnected callback called');

        // Essential for cleanup:
        this.removeEventListeners();
        this.clearTimers();
        this.unsubscribeFromServices();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CLEANUP: Prevent memory leaks and unwanted behavior
        // → Remove event listeners, clear timers, unsubscribe
        // 💀 CRITICAL: Forgetting cleanup causes memory leaks
    }

    // 5. ERROR CALLBACK - When component or child throws error
    errorCallback(error, stack) {
        console.log('5. Error callback called');
        console.error('Component error:', error.message);
        console.error('Stack trace:', stack);

        // Error handling:
        this.handleComponentError(error);
        this.logErrorToService(error, stack);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ERROR HANDLING: Graceful error recovery
        // → Log errors, show user-friendly messages
        // ✅ RESILIENCE: Prevent component crashes from breaking page
    }

    // Helper methods for lifecycle hooks
    setupEventListeners() {
        // Add event listeners for custom events, window events, etc.
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.handleResize);
    }

    loadData() {
        // Initial data loading
        if (this.recordId) {
            this.fetchRecordData(this.recordId);
        }
    }

    startTimers() {
        this.refreshTimer = setInterval(() => {
            this.refreshData();
        }, 30000); // Refresh every 30 seconds
    }

    clearTimers() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    initializeThirdPartyLibraries() {
        // Initialize libraries that require DOM elements
        const chartElement = this.template.querySelector('.chart-container');
        if (chartElement && !this.chartInitialized) {
            // Initialize chart library
            this.chartInitialized = true;
        }
    }

    updateDOMDirectly() {
        // Direct DOM manipulation when necessary
        const elements = this.template.querySelectorAll('.dynamic-element');
        elements.forEach(el => {
            // Apply direct DOM changes
        });
    }

    handleComponentError(error) {
        // Show user-friendly error message
        this.showToast('Error', 'Something went wrong. Please try again.', 'error');
    }

    // Event handlers
    handleResize() {
        // Handle window resize
        this.updateLayout();
    }

    // Placeholder methods
    fetchRecordData(recordId) { /* Implementation */ }
    refreshData() { /* Implementation */ }
    measureElementSizes() { /* Implementation */ }
    unsubscribeFromServices() { /* Implementation */ }
    logErrorToService(error, stack) { /* Implementation */ }
    showToast(title, message, variant) { /* Implementation */ }
    updateLayout() { /* Implementation */ }
}
```

## Reactive Properties and Data Binding

Understanding reactivity is key to building efficient, responsive components.

```javascript
// reactivityExample.js
import { LightningElement, api, track } from 'lwc';

export default class ReactivityExample extends LightningElement {

    // PUBLIC PROPERTIES - Reactive by default
    @api title = 'Default Title';
    @api isVisible = true;
    @api recordCount = 0;
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // PUBLIC REACTIVITY: @api properties automatically trigger rerenders
    // → Parent component changes cause child to rerender
    // 💡 AUTOMATIC: No manual tracking needed

    // PRIMITIVE PROPERTIES - Reactive by default
    message = 'Hello World';
    counter = 0;
    isActive = false;
    // ^^^^^^^^^^^^^^^^^^
    // PRIMITIVE REACTIVITY: String, Number, Boolean automatically reactive
    // → Assignment triggers component rerender
    // ✅ SIMPLICITY: Most common and efficient reactivity pattern

    // COMPLEX PROPERTIES - Need @track for deep reactivity
    @track userPreferences = {
        theme: 'light',
        language: 'en',
        notifications: {
            email: true,
            sms: false
        }
    };
    // ^^^^^^^^^^^^^^^^^^^^
    // DEEP REACTIVITY: @track makes object/array changes reactive
    // → Changing nested properties triggers rerenders
    // ⚠️ PERFORMANCE: Only use @track when needed

    @track itemList = ['Item 1', 'Item 2', 'Item 3'];

    // COMPUTED PROPERTIES - Getters
    get displayTitle() {
        return `${this.title} (${this.counter})`;
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // COMPUTED PROPERTIES: Automatically recalculated when dependencies change
    // → More efficient than methods for derived values
    // 💡 CACHING: Framework caches result until dependencies change

    get isCounterEven() {
        return this.counter % 2 === 0;
    }

    get sortedItems() {
        // Always return new array for reactivity
        return [...this.itemList].sort();
    }

    get hasItems() {
        return this.itemList.length > 0;
    }

    // METHODS vs GETTERS
    calculateTotal() {
        // METHOD: Called every time template renders
        console.log('calculateTotal called'); // This logs on every render!
        return this.itemList.length * 10;
    }

    get totalValue() {
        // GETTER: Cached until dependencies change
        console.log('totalValue getter called'); // Only logs when itemList changes
        return this.itemList.length * 10;
    }

    // REACTIVE UPDATES - Different patterns
    handleSimpleUpdate() {
        // Simple property update - automatically reactive
        this.counter += 1;
        this.message = `Counter: ${this.counter}`;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // AUTOMATIC REACTIVITY: Assignment triggers rerender
        // → Template automatically updates with new values
    }

    handleObjectUpdate() {
        // WRONG - Mutating tracked object doesn't trigger reactivity
        this.userPreferences.theme = 'dark'; // No rerender!

        // CORRECT - Replace entire object for reactivity
        this.userPreferences = {
            ...this.userPreferences,
            theme: 'dark'
        };
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // OBJECT REPLACEMENT: Create new object to trigger reactivity
        // → Spread operator preserves other properties
        // ✅ PATTERN: Always replace, never mutate @track objects
    }

    handleNestedObjectUpdate() {
        // WRONG - Deep mutation doesn't trigger reactivity
        this.userPreferences.notifications.email = false; // No rerender!

        // CORRECT - Replace nested object
        this.userPreferences = {
            ...this.userPreferences,
            notifications: {
                ...this.userPreferences.notifications,
                email: false
            }
        };
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // NESTED UPDATES: Replace all levels that change
        // → Verbose but ensures reactivity
        // 💡 ALTERNATIVE: Consider flatter data structures
    }

    handleArrayUpdate() {
        // WRONG - Array mutation doesn't always trigger reactivity
        this.itemList.push('New Item'); // Might not rerender!

        // CORRECT - Replace array for guaranteed reactivity
        this.itemList = [...this.itemList, 'New Item'];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ARRAY REPLACEMENT: Create new array to trigger reactivity
        // → Spread operator plus new elements
        // ✅ RELIABLE: Guarantees component rerender
    }

    handleArrayRemoval() {
        // Remove item by creating new array
        const indexToRemove = 1;
        this.itemList = this.itemList.filter((item, index) => index !== indexToRemove);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // FUNCTIONAL UPDATE: Use array methods that return new arrays
        // → filter(), map(), reduce() all return new arrays
        // 💡 IMMUTABILITY: Preferred pattern for array updates
    }

    // CONDITIONAL REACTIVITY
    handleConditionalUpdate() {
        // Only update if condition is met
        if (this.counter < 10) {
            this.counter += 1;
        } else {
            this.message = 'Counter limit reached';
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CONDITIONAL UPDATES: Logic before reactive assignment
        // → Prevents unnecessary rerenders
        // ✅ EFFICIENCY: Only update when needed
    }

    // BATCH UPDATES
    handleBatchUpdate() {
        // Multiple reactive properties updated together
        this.counter += 1;
        this.message = `Updated at ${new Date().toLocaleTimeString()}`;
        this.isActive = !this.isActive;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BATCHED RENDERING: Framework batches multiple updates
        // → Single rerender for multiple property changes
        // 💡 PERFORMANCE: Efficient even with multiple updates
    }
}
```

## Common Gotchas

### 💀 Template Reference Errors

```javascript
// BAD - Accessing template in constructor
constructor() {
    super();
    const element = this.template.querySelector('.my-element'); // Error!
    // Template not available yet
}

// GOOD - Access template in renderedCallback
renderedCallback() {
    const element = this.template.querySelector('.my-element');
    if (element) {
        // Safe to use element
    }
}
```

### ⚠️ @track Misuse

```javascript
// BAD - Using @track on primitives (unnecessary)
@track message = 'Hello'; // Primitives are already reactive

// GOOD - Use @track only for objects/arrays
@track data = { items: [] };

// BAD - Mutating @track objects
this.data.items.push(newItem); // Might not trigger rerender

// GOOD - Replace @track objects
this.data = { ...this.data, items: [...this.data.items, newItem] };
```

### 💡 Memory Leaks in Lifecycle

```javascript
// BAD - No cleanup
connectedCallback() {
    this.timer = setInterval(() => {
        this.refresh();
    }, 1000);
    // Timer keeps running even after component is destroyed!
}

// GOOD - Proper cleanup
connectedCallback() {
    this.timer = setInterval(() => {
        this.refresh();
    }, 1000);
}

disconnectedCallback() {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
}
```

## Exam Tips

### High-Priority Concepts for Certification

1. **Component Structure**: JavaScript, HTML, CSS, and metadata files
2. **Lifecycle Hooks**: When to use connectedCallback vs renderedCallback
3. **Reactivity**: @api, @track, and automatic primitive reactivity
4. **Property Binding**: Template syntax and computed properties
5. **Component Cleanup**: Preventing memory leaks in disconnectedCallback

### Common Exam Scenarios

- **File Organization**: Questions about component file structure
- **Lifecycle Timing**: When DOM is available for manipulation
- **Reactive Updates**: How to properly update complex objects
- **Performance**: Difference between methods and getters in templates
- **Memory Management**: Proper cleanup of timers and event listeners

### Key Points to Remember

- Every component extends LightningElement
- @api makes properties public to parent components
- Primitives are automatically reactive, objects need @track
- Always clean up resources in disconnectedCallback
- Use getters for computed properties, not methods

## Practice Exercises

### Exercise 1: Component Structure

Create a complete component with proper file structure for displaying a counter with increment/decrement buttons.

### Exercise 2: Lifecycle Management

Build a component that loads data on connection, refreshes periodically, and properly cleans up on disconnection.

### Exercise 3: Reactive Data

Create a component with complex nested data that updates reactively when user interactions occur.

## Related Topics

### Prerequisites
- **JavaScript Fundamentals** - ES6 classes, destructuring, spread operator
- **HTML/CSS Basics** - Template syntax and styling concepts

### Next Topics in Learning Path
- **[Data Binding and Templates](data-binding-and-templates)** - Advanced template patterns
- **[Component Communication](component-communication)** - Parent-child and event patterns

### Advanced Topics
- **[Performance Optimization](performance-optimization)** - Advanced reactivity and rendering
- **[Testing Strategies](../testing/lwc-testing)** - Component testing patterns

Master these fundamentals and you'll have a solid foundation for building any Lightning Web Component!