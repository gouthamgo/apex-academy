---
title: "Lightning Data Service (LDS)"
section: "lwc"
order: 6
difficulty: "intermediate"
readTime: "20 min"
description: "Master Lightning Data Service for CRUD operations without Apex code using lightning-record-form, lightning-record-view-form, and UI API."
overview: "Learn how to create, read, update, and delete Salesforce records using LDS components and adapters."
concepts: ["lds", "record-form", "record-view-form", "record-edit-form", "ui-api", "getRecord", "createRecord", "updateRecord"]
prerequisites: ["component-fundamentals", "javascript-in-lwc"]
relatedTopics: ["wire-service-and-apex", "form-handling"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Lightning Data Service provides components and adapters for working with Salesforce records without writing Apex code.

## LDS Benefits

- **No Apex Required**: Built-in CRUD operations
- **Automatic Updates**: Changes sync across components
- **Caching**: Improves performance
- **Security**: Respects sharing rules and FLS

---

# Code Examples

## Lightning Record Form

```html
<template>
    <lightning-record-form
        record-id={recordId}
        object-api-name="Account"
        fields={fields}
        mode="edit"
        onsuccess={handleSuccess}
        onerror={handleError}>
    </lightning-record-form>
</template>
```

```javascript
import { LightningElement, api } from 'lwc';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_INDUSTRY from '@salesforce/schema/Account.Industry';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';

export default class RecordFormExample extends LightningElement {
    @api recordId;
    
    fields = [ACCOUNT_NAME, ACCOUNT_INDUSTRY, ACCOUNT_PHONE];
    
    handleSuccess(event) {
        const recordId = event.detail.id;
        console.log('Record saved:', recordId);
    }
    
    handleError(event) {
        console.error('Error saving:', event.detail);
    }
}
```

## GetRecord Adapter

```javascript
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class GetRecordExample extends LightningElement {
    @api recordId;
    
    @wire(getRecord, {
        recordId: '$recordId',
        fields: [NAME_FIELD, INDUSTRY_FIELD]
    })
    account;
    
    get name() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }
    
    get industry() {
        return getFieldValue(this.account.data, INDUSTRY_FIELD);
    }
}
```

## Create and Update Records

```javascript
import { LightningElement } from 'lwc';
import { createRecord, updateRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';

export default class CreateUpdateExample extends LightningElement {
    
    async handleCreate() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = 'New Account';
        
        const recordInput = {
            apiName: ACCOUNT_OBJECT.objectApiName,
            fields
        };
        
        try {
            const account = await createRecord(recordInput);
            console.log('Created:', account.id);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    async handleUpdate(recordId) {
        const fields = {};
        fields['Id'] = recordId;
        fields[NAME_FIELD.fieldApiName] = 'Updated Name';
        
        const recordInput = { fields };
        
        try {
            await updateRecord(recordInput);
            console.log('Updated');
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
```

---

# Best Practices

✅ Use LDS for simple CRUD operations
✅ Use Apex for complex business logic
✅ Reference fields via schema imports
✅ Handle success and error events

❌ Don't use LDS for bulk operations
❌ Don't bypass security with Apex when LDS works

---

# Related Topics

- **[Wire Service](wire-service-and-apex)**
- **[Form Handling](form-handling-and-validation)**
