---
title: "Navigation Service"
section: "lwc"
order: 8
difficulty: "beginner"
readTime: "15 min"
description: "Master Lightning navigation using NavigationMixin for record pages, list views, related lists, and custom pages."
overview: "Learn how to navigate programmatically in Lightning Experience using the Navigation Service."
concepts: ["navigation", "navigation-mixin", "page-reference", "record-page", "list-view", "related-list"]
prerequisites: ["component-fundamentals", "javascript-in-lwc"]
relatedTopics: ["event-handling", "wire-service-and-apex"]
lastUpdated: "2025-01-15"
examWeight: "medium"
---

# Navigation Patterns

## NavigationMixin
Provides navigation methods for Lightning Experience

## Page Reference Types
- standard__recordPage
- standard__objectPage
- standard__namedPage
- standard__webPage
- standard__app

---

# Code Examples

```javascript
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavigationExample extends NavigationMixin(LightningElement) {
    
    // Navigate to record page
    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
    }
    
    // Navigate to list view
    navigateToListView() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            }
        });
    }
    
    // Navigate to new record page
    navigateToNew() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            }
        });
    }
}
```

---

# Related Topics

- **[Event Handling](event-handling-and-communication)**
