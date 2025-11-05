---
title: "JavaScript in Lightning Web Components"
section: "lwc"
order: 4
difficulty: "beginner"
readTime: "25 min"
description: "Master JavaScript fundamentals for LWC including properties, methods, getters, decorators, and reactive programming patterns."
overview: "Learn modern JavaScript ES6+ features and how they're used in Lightning Web Components for building reactive UIs."
concepts: ["javascript", "properties", "methods", "getters", "decorators", "track", "api", "reactive"]
prerequisites: ["component-fundamentals", "html-templates-and-directives"]
relatedTopics: ["component-lifecycle-hooks", "wire-service-and-apex"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

LWC uses modern JavaScript (ES6+) for component logic. Understanding JavaScript fundamentals is essential for building powerful components.

## Key JavaScript Features in LWC

- **Properties**: Component state and data
- **Methods**: Component behavior and logic
- **Getters**: Computed properties
- **Decorators**: @api, @track, @wire
- **Arrow Functions**: Concise function syntax
- **Destructuring**: Extract values from objects/arrays

---

# Code Examples

## Properties and Reactivity

```javascript
import { LightningElement } from 'lwc';

export default class PropertiesExample extends LightningElement {
    // Private property - reactive
    message = 'Hello LWC!';
    count = 0;
    
    // Array property - reactive for reassignment
    items = ['Apple', 'Banana', 'Orange'];
    
    // Object property - reactive for reassignment
    user = { name: 'John', age: 30 };
    
    // Updating properties triggers re-render
    handleClick() {
        this.count++; // Triggers re-render
        this.message = 'Count: ' + this.count;
    }
    
    // Object mutation - requires reassignment for reactivity
    updateUser() {
        // ❌ Won't trigger re-render
        this.user.name = 'Jane';
        
        // ✅ Triggers re-render
        this.user = { ...this.user, name: 'Jane' };
    }
    
    // Array mutation - requires reassignment
    addItem() {
        // ❌ Won't trigger re-render
        this.items.push('Grape');
        
        // ✅ Triggers re-render
        this.items = [...this.items, 'Grape'];
    }
}
```

## Getters (Computed Properties)

```javascript
export default class GettersExample extends LightningElement {
    firstName = 'John';
    lastName = 'Doe';
    items = [
        { id: 1, price: 10, quantity: 2 },
        { id: 2, price: 20, quantity: 1 }
    ];
    
    // Getter - computed on access
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    // Getter with logic
    get greeting() {
        const hour = new Date().getHours();
        return hour < 12 ? 'Good morning' : 'Good afternoon';
    }
    
    // Getter for calculations
    get totalPrice() {
        return this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
    
    // Getter for conditional rendering
    get hasItems() {
        return this.items && this.items.length > 0;
    }
}
```

## Decorators

```javascript
import { LightningElement, api, track, wire } from 'lwc';

export default class DecoratorsExample extends LightningElement {
    
    // @api - Public property (accessible from parent)
    @api recordId;
    @api title = 'Default Title';
    
    // @api method - callable from parent
    @api
    refresh() {
        // Refresh logic
        console.log('Component refreshed');
    }
    
    // Private property (default)
    privateData = 'Not accessible from parent';
    
    // Properties are automatically reactive
    // No need for @track in modern LWC
    counter = 0;
    
    handleIncrement() {
        this.counter++; // Automatically triggers re-render
    }
}
```

## Methods and Event Handlers

```javascript
export default class MethodsExample extends LightningElement {
    searchTerm = '';
    results = [];
    
    // Event handler
    handleSearch(event) {
        this.searchTerm = event.target.value;
        this.performSearch();
    }
    
    // Private method
    performSearch() {
        if (this.searchTerm.length < 3) {
            this.results = [];
            return;
        }
        
        // Simulate search
        this.results = this.getAllItems().filter(item =>
            item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }
    
    // Helper method
    getAllItems() {
        return [
            { id: 1, name: 'Apple' },
            { id: 2, name: 'Banana' },
            { id: 3, name: 'Orange' }
        ];
    }
    
    // Arrow function preserves 'this' context
    handleClick = () => {
        console.log('Arrow function - this is:', this);
    }
    
    // Regular function (use with caution)
    handleRegular() {
        console.log('Regular function - this is:', this);
    }
}
```

## ES6+ Features

```javascript
export default class ES6Example extends LightningElement {
    
    // Destructuring
    handleData(data) {
        const { name, email, phone } = data;
        console.log(name, email, phone);
    }
    
    // Spread operator
    mergeObjects(obj1, obj2) {
        return { ...obj1, ...obj2 };
    }
    
    // Array spread
    combineArrays(arr1, arr2) {
        return [...arr1, ...arr2];
    }
    
    // Template literals
    getMessage(name, count) {
        return `Hello ${name}, you have ${count} items`;
    }
    
    // Default parameters
    greet(name = 'Guest', greeting = 'Hello') {
        return `${greeting}, ${name}!`;
    }
    
    // Arrow functions
    processItems(items) {
        return items
            .filter(item => item.active)
            .map(item => ({ ...item, processed: true }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Async/await
    async fetchData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
```

## Working with Arrays and Objects

```javascript
export default class DataManipulation extends LightningElement {
    contacts = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];
    
    // Filter array
    get activeContacts() {
        return this.contacts.filter(c => c.active === true);
    }
    
    // Map array
    get contactNames() {
        return this.contacts.map(c => c.name);
    }
    
    // Find in array
    findContactById(id) {
        return this.contacts.find(c => c.id === id);
    }
    
    // Reduce array
    get totalContacts() {
        return this.contacts.reduce((sum, c) => sum + 1, 0);
    }
    
    // Add to array (immutably)
    addContact(newContact) {
        this.contacts = [...this.contacts, newContact];
    }
    
    // Update array item (immutably)
    updateContact(id, updates) {
        this.contacts = this.contacts.map(contact =>
            contact.id === id ? { ...contact, ...updates } : contact
        );
    }
    
    // Remove from array (immutably)
    removeContact(id) {
        this.contacts = this.contacts.filter(c => c.id !== id);
    }
    
    // Clone object
    cloneContact(contact) {
        return { ...contact };
    }
    
    // Deep clone
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
```

---

# Best Practices

✅ Use arrow functions for event handlers to preserve context
✅ Use getters for computed values
✅ Immutably update arrays and objects for reactivity
✅ Use destructuring for cleaner code
✅ Use const for values that don't change

❌ Don't manipulate DOM directly
❌ Don't use @track (deprecated - automatic reactivity)
❌ Don't mutate arrays/objects in place
❌ Don't use var (use const or let)

---

# Common Patterns

```javascript
// Conditional rendering data
get displayData() {
    return this.data || [];
}

// Safe property access
get userName() {
    return this.user?.name ?? 'Unknown';
}

// Event delegation
handleAction(event) {
    const action = event.target.dataset.action;
    switch(action) {
        case 'edit': this.handleEdit(); break;
        case 'delete': this.handleDelete(); break;
    }
}
```

---

# Related Topics

- **[HTML Templates](html-templates-and-directives)**
- **[Component Lifecycle](component-lifecycle-hooks)**
- **[Wire Service](wire-service-and-apex)**
