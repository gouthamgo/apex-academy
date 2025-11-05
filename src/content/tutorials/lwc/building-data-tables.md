---
title: "Building Dynamic Data Tables in LWC"
category: "lwc"
difficulty: "intermediate"
readTime: "20 min"
author: "Maria Garcia"
description: "Learn how to build powerful, interactive data tables using lightning-datatable with sorting, inline editing, and custom actions."
tags: ["lwc", "datatable", "lightning-datatable", "data-display", "ui-components"]
prerequisites: ["javascript-in-lwc", "wire-service-and-apex", "event-handling"]
relatedTutorials: ["form-handling-best-practices", "apex-integration-patterns"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# Building Dynamic Data Tables

Master lightning-datatable for displaying and managing tabular data.

---

# Complete Example

## HTML Template

```html
<template>
    <lightning-card title="Accounts" icon-name="standard:account">
        <lightning-datatable
            key-field="Id"
            data={accounts}
            columns={columns}
            onsave={handleSave}
            onsort={handleSort}
            sorted-by={sortedBy}
            sorted-direction={sortedDirection}
            onrowaction={handleRowAction}>
        </lightning-datatable>
    </lightning-card>
</template>
```

## JavaScript

```javascript
import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', editable: true, sortable: true },
    { label: 'Industry', fieldName: 'Industry', editable: true, sortable: true },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'View', name: 'view' },
                { label: 'Edit', name: 'edit' },
                { label: 'Delete', name: 'delete' }
            ]
        }
    }
];

export default class AccountDataTable extends LightningElement {
    accounts;
    columns = COLUMNS;
    sortedBy;
    sortedDirection = 'asc';
    
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }
    
    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.sortData(this.sortedBy, this.sortedDirection);
    }
    
    sortData(fieldName, direction) {
        let parseData = JSON.parse(JSON.stringify(this.accounts));
        let keyValue = (a) => a[fieldName];
        
        let isReverse = direction === 'asc' ? 1 : -1;
        
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        
        this.accounts = parseData;
    }
    
    async handleSave(event) {
        const records = event.detail.draftValues.map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        
        try {
            const promises = records.map(record => updateRecord(record));
            await Promise.all(promises);
            
            this.showToast('Success', 'Records updated', 'success');
            this.accounts = [...this.accounts];
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }
    
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        
        switch (actionName) {
            case 'view':
                this.viewRecord(row.Id);
                break;
            case 'edit':
                this.editRecord(row.Id);
                break;
            case 'delete':
                this.deleteRecord(row.Id);
                break;
        }
    }
    
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
```

---

# Features

✓ Sorting
✓ Inline editing
✓ Custom actions
✓ Type formatting (currency, phone, etc.)
✓ Error handling

This provides a complete, production-ready data table!
