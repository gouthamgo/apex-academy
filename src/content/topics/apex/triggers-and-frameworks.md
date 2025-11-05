---
title: "Triggers and Trigger Frameworks"
section: "apex"
order: 8
difficulty: "intermediate"
readTime: "30 min"
description: "Master Apex triggers, trigger contexts, trigger events, and trigger framework design patterns for scalable Salesforce development."
overview: "Learn how to write efficient, maintainable triggers using best practices and framework patterns."
concepts: ["triggers", "trigger-context", "before-triggers", "after-triggers", "trigger-framework", "handler-pattern"]
prerequisites: ["dml-operations", "control-flow-and-logic", "object-oriented-programming"]
relatedTopics: ["trigger-bulkification-best-practices", "exception-handling"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Triggers are Apex code that execute before or after database events (insert, update, delete, undelete). They're essential for implementing complex business logic that can't be achieved with declarative tools.

## Trigger Events

**Before Events** (before insert, before update, before delete):
- Validate and modify records before saving
- Cannot perform DML on same object
- Records not yet in database

**After Events** (after insert, after update, after delete, after undelete):
- Perform operations after records saved
- Records have Ids assigned  
- Can perform DML operations

## Trigger Context Variables

- **Trigger.new**: List of new versions of records
- **Trigger.old**: List of old versions of records
- **Trigger.newMap**: Map of new versions by Id
- **Trigger.oldMap**: Map of old versions by Id
- **Trigger.isInsert, isUpdate, isDelete, isUndelete**: Event type booleans
- **Trigger.isBefore, isAfter**: Timing booleans

---

# Code Examples

## Basic Trigger Structure

```apex
trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    // Check trigger context
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            // Before insert logic
            for (Account acc : Trigger.new) {
                if (String.isBlank(acc.Description)) {
                    acc.Description = 'Created on ' + Date.today();
                }
            }
        }
        
        if (Trigger.isUpdate) {
            // Before update logic
            for (Account acc : Trigger.new) {
                Account oldAcc = Trigger.oldMap.get(acc.Id);
                if (acc.Industry != oldAcc.Industry) {
                    acc.Description = 'Industry changed to ' + acc.Industry;
                }
            }
        }
    }
    
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            // After insert - create related records
            List<Contact> contacts = new List<Contact>();
            for (Account acc : Trigger.new) {
                contacts.add(new Contact(
                    FirstName = 'Primary',
                    LastName = 'Contact',
                    AccountId = acc.Id
                ));
            }
            if (!contacts.isEmpty()) {
                insert contacts;
            }
        }
    }
}
```

## Trigger Handler Pattern

```apex
// Trigger (minimal logic)
trigger AccountTrigger on Account (before insert, before update, after insert, after update, after delete) {
    new AccountTriggerHandler().run();
}

// Handler class
public class AccountTriggerHandler {
    
    public void run() {
        if (Trigger.isBefore) {
            if (Trigger.isInsert) {
                handleBeforeInsert(Trigger.new);
            } else if (Trigger.isUpdate) {
                handleBeforeUpdate(Trigger.new, Trigger.oldMap);
            }
        }
        
        if (Trigger.isAfter) {
            if (Trigger.isInsert) {
                handleAfterInsert(Trigger.new);
            } else if (Trigger.isUpdate) {
                handleAfterUpdate(Trigger.new, Trigger.oldMap);
            } else if (Trigger.isDelete) {
                handleAfterDelete(Trigger.old);
            }
        }
    }
    
    private void handleBeforeInsert(List<Account> newAccounts) {
        for (Account acc : newAccounts) {
            setDefaultValues(acc);
        }
    }
    
    private void handleBeforeUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) {
        for (Account acc : newAccounts) {
            Account oldAcc = oldMap.get(acc.Id);
            if (fieldChanged(acc.Industry, oldAcc.Industry)) {
                // Handle industry change
            }
        }
    }
    
    private void handleAfterInsert(List<Account> newAccounts) {
        createDefaultContacts(newAccounts);
    }
    
    private void handleAfterUpdate(List<Account> newAccounts, Map<Id, Account> oldMap) {
        // Update related records
    }
    
    private void handleAfterDelete(List<Account> deletedAccounts) {
        // Cleanup logic
    }
    
    private void setDefaultValues(Account acc) {
        if (String.isBlank(acc.Description)) {
            acc.Description = 'New account';
        }
    }
    
    private Boolean fieldChanged(Object newValue, Object oldValue) {
        return newValue != oldValue;
    }
    
    private void createDefaultContacts(List<Account> accounts) {
        List<Contact> contacts = new List<Contact>();
        for (Account acc : accounts) {
            contacts.add(new Contact(
                FirstName = 'Primary',
                LastName = 'Contact',
                AccountId = acc.Id
            ));
        }
        insert contacts;
    }
}
```

## Advanced Trigger Framework

```apex
// Base trigger handler
public virtual class TriggerHandler {
    
    protected Boolean isTriggerExecuting;
    protected Integer batchSize;
    
    public TriggerHandler() {
        this.isTriggerExecuting = Trigger.isExecuting;
        this.batchSize = Trigger.size;
    }
    
    public void run() {
        if (!validateRun()) {
            return;
        }
        
        if (Trigger.isBefore) {
            if (Trigger.isInsert) beforeInsert();
            if (Trigger.isUpdate) beforeUpdate();
            if (Trigger.isDelete) beforeDelete();
        }
        
        if (Trigger.isAfter) {
            if (Trigger.isInsert) afterInsert();
            if (Trigger.isUpdate) afterUpdate();
            if (Trigger.isDelete) afterDelete();
            if (Trigger.isUndelete) afterUndelete();
        }
    }
    
    protected virtual Boolean validateRun() {
        return isTriggerExecuting;
    }
    
    protected virtual void beforeInsert() {}
    protected virtual void beforeUpdate() {}
    protected virtual void beforeDelete() {}
    protected virtual void afterInsert() {}
    protected virtual void afterUpdate() {}
    protected virtual void afterDelete() {}
    protected virtual void afterUndelete() {}
}

// Specific object handler
public class AccountTriggerHandler extends TriggerHandler {
    
    private List<Account> newAccounts;
    private List<Account> oldAccounts;
    private Map<Id, Account> newAccountMap;
    private Map<Id, Account> oldAccountMap;
    
    public AccountTriggerHandler() {
        super();
        this.newAccounts = (List<Account>) Trigger.new;
        this.oldAccounts = (List<Account>) Trigger.old;
        this.newAccountMap = (Map<Id, Account>) Trigger.newMap;
        this.oldAccountMap = (Map<Id, Account>) Trigger.oldMap;
    }
    
    protected override void beforeInsert() {
        setDefaultValues();
        validateRecords();
    }
    
    protected override void afterInsert() {
        createRelatedRecords();
        sendNotifications();
    }
    
    private void setDefaultValues() {
        for (Account acc : newAccounts) {
            if (String.isBlank(acc.Type)) {
                acc.Type = 'Prospect';
            }
        }
    }
    
    private void validateRecords() {
        for (Account acc : newAccounts) {
            if (acc.AnnualRevenue != null && acc.AnnualRevenue < 0) {
                acc.addError('Annual Revenue cannot be negative');
            }
        }
    }
    
    private void createRelatedRecords() {
        // Implementation
    }
    
    private void sendNotifications() {
        // Implementation
    }
}
```

---

# Best Practices

✅ **One Trigger Per Object**: Avoid multiple triggers on same object
✅ **Use Handler Classes**: Keep trigger logic in separate classes  
✅ **Bulkify Everything**: Process collections, not individual records
✅ **Avoid SOQL/DML in Loops**: Use collections and bulk operations
✅ **Use Before Triggers** for validation and field updates on same object

❌ **Don't** put complex logic directly in trigger
❌ **Don't** perform DML on same object in after trigger
❌ **Don't** create recursive triggers without prevention

---

# Related Topics

- **[Trigger Bulkification](trigger-bulkification-best-practices)**
- **[DML Operations](dml-operations)**
- **[Governor Limits](governor-limits)**
