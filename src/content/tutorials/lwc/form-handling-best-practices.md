---
title: "Form Handling and Validation in LWC"
category: "lwc"
difficulty: "intermediate"
readTime: "22 min"
author: "Robert Chen"
description: "Master form handling in Lightning Web Components including validation, error handling, custom inputs, and user experience patterns."
tags: ["lwc", "forms", "validation", "user-input", "ux"]
prerequisites: ["javascript-in-lwc", "lightning-data-service", "event-handling"]
relatedTutorials: ["building-data-tables", "component-communication-patterns"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# Form Handling Best Practices

Build robust forms with validation, error handling, and great UX.

---

# Complete Form Example

## HTML Template

```html
<template>
    <lightning-card title="Create Account">
        <div class="slds-p-around_medium">
            <lightning-input
                label="Account Name"
                name="accountName"
                value={accountName}
                onchange={handleInputChange}
                required>
            </lightning-input>
            
            <lightning-combobox
                name="industry"
                label="Industry"
                value={industry}
                placeholder="Select Industry"
                options={industryOptions}
                onchange={handleInputChange}
                required>
            </lightning-combobox>
            
            <lightning-input
                name="revenue"
                label="Annual Revenue"
                type="number"
                value={revenue}
                onchange={handleInputChange}
                formatter="currency">
            </lightning-input>
            
            <lightning-input
                name="phone"
                label="Phone"
                type="tel"
                value={phone}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                message-when-pattern-mismatch="Phone must be format: 123-456-7890"
                onchange={handleInputChange}>
            </lightning-input>
            
            <div class="slds-m-top_medium">
                <lightning-button
                    variant="brand"
                    label="Save"
                    onclick={handleSave}
                    disabled={isSaving}>
                </lightning-button>
                <lightning-button
                    label="Cancel"
                    onclick={handleCancel}
                    class="slds-m-left_small">
                </lightning-button>
            </div>
        </div>
    </lightning-card>
</template>
```

## JavaScript

```javascript
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createAccount from '@salesforce/apex/AccountController.createAccount';

export default class AccountForm extends LightningElement {
    accountName = '';
    industry = '';
    revenue = '';
    phone = '';
    isSaving = false;
    
    industryOptions = [
        { label: 'Technology', value: 'Technology' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Manufacturing', value: 'Manufacturing' }
    ];
    
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this[field] = value;
    }
    
    validateForm() {
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        
        if (!allValid) {
            this.showToast('Error', 'Please complete all required fields', 'error');
        }
        
        return allValid;
    }
    
    async handleSave() {
        if (!this.validateForm()) {
            return;
        }
        
        this.isSaving = true;
        
        try {
            const result = await createAccount({
                name: this.accountName,
                industry: this.industry,
                revenue: this.revenue,
                phone: this.phone
            });
            
            this.showToast('Success', 'Account created successfully', 'success');
            this.resetForm();
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        } finally {
            this.isSaving = false;
        }
    }
    
    handleCancel() {
        this.resetForm();
    }
    
    resetForm() {
        this.accountName = '';
        this.industry = '';
        this.revenue = '';
        this.phone = '';
        
        // Reset validation
        this.template.querySelectorAll('lightning-input, lightning-combobox')
            .forEach(input => input.value = '');
    }
    
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
```

---

# Key Features

✓ Real-time validation
✓ Custom error messages
✓ Loading states
✓ Type-specific inputs (tel, number, currency)
✓ Pattern validation
✓ Accessibility built-in

---

# Best Practices

✅ Validate on submit, not on every keystroke
✅ Provide clear error messages
✅ Show loading states during save
✅ Reset form after successful submit
✅ Handle both success and error cases

This pattern works for any form in your LWC applications!
