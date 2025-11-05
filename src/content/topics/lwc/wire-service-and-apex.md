---
title: "Wire Service and Apex Integration"
section: "lwc"
order: 5
difficulty: "intermediate"
readTime: "22 min"
description: "Master the @wire decorator for reactive data loading, Apex method integration, and efficient data management in Lightning Web Components."
overview: "Learn how to fetch and manage data reactively using @wire with Apex methods, adapters, and best practices."
concepts: ["wire-service", "apex-integration", "imperative-apex", "reactive-data", "wire-adapter", "refreshApex"]
prerequisites: ["javascript-in-lwc", "component-lifecycle-hooks"]
relatedTopics: ["lightning-data-service", "event-handling"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

The @wire decorator provides reactive, read-only data to components. It's the preferred way to load data in LWC.

## Wire Service Benefits

- **Reactive**: Automatically updates when parameters change
- **Cached**: Data cached and shared across components
- **Efficient**: Reduces server calls
- **Read-only**: For displaying data

## Wire vs Imperative

- **@wire**: Reactive, automatic updates, read-only
- **Imperative**: Manual calls, full control, read-write

---

# Code Examples

## Wire Apex Methods

```javascript
import { LightningElement, api, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getAccountById from '@salesforce/apex/AccountController.getAccountById';

export default class WireExample extends LightningElement {
    @api recordId;
    accounts;
    error;
    
    // Wire without parameters
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }
    
    // Wire with parameter
    @wire(getAccountById, { accountId: '$recordId' })
    wiredAccount;
    
    // Access wired data in template
    get accountName() {
        return this.wiredAccount.data?.Name;
    }
}
```

## Apex Controller

```apex
public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            ORDER BY Name
            LIMIT 10
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static Account getAccountById(Id accountId) {
        return [
            SELECT Id, Name, Industry, Phone, Website
            FROM Account
            WHERE Id = :accountId
        ];
    }
}
```

## Imperative Apex Calls

```javascript
import { LightningElement } from 'lwc';
import createAccount from '@salesforce/apex/AccountController.createAccount';
import updateAccount from '@salesforce/apex/AccountController.updateAccount';

export default class ImperativeExample extends LightningElement {
    
    async handleCreate() {
        try {
            const result = await createAccount({
                name: 'New Account',
                industry: 'Technology'
            });
            console.log('Created:', result);
            // Handle success
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    }
    
    handleCreateWithPromise() {
        createAccount({ name: 'Test Account' })
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
```

## RefreshApex

```javascript
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class RefreshExample extends LightningElement {
    wiredAccountsResult;
    
    @wire(getAccounts)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            // Process data
        }
    }
    
    async handleRefresh() {
        // Refresh wired data
        await refreshApex(this.wiredAccountsResult);
    }
    
    async handleUpdate() {
        // Update data
        await updateAccount({ /*...*/ });
        
        // Refresh to show changes
        await refreshApex(this.wiredAccountsResult);
    }
}
```

## Error Handling

```javascript
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class ErrorHandling extends LightningElement {
    accounts;
    error;
    
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.handleError(error);
        }
    }
    
    handleError(error) {
        let message = 'Unknown error';
        if (Array.isArray(error.body)) {
            message = error.body.map(e => e.message).join(', ');
        } else if (typeof error.body.message === 'string') {
            message = error.body.message;
        }
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading data',
                message: message,
                variant: 'error'
            })
        );
    }
}
```

---

# Best Practices

✅ Use @wire for read-only data
✅ Use imperative for DML operations
✅ Always add cacheable=true for @wire methods
✅ Handle both data and error cases
✅ Use refreshApex after updates

❌ Don't use @wire for write operations
❌ Don't forget error handling
❌ Don't call Apex in loops

---

# Related Topics

- **[JavaScript in LWC](javascript-in-lwc)**
- **[Lightning Data Service](lightning-data-service)**
