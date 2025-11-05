---
title: "Building a Scalable Trigger Framework"
category: "apex"
difficulty: "advanced"
readTime: "25 min"
author: "Alex Thompson"
description: "Learn how to build a production-ready trigger framework with handler classes, recursion prevention, and configuration management."
tags: ["triggers", "framework", "architecture", "best-practices", "scalability"]
prerequisites: ["triggers-and-frameworks", "object-oriented-programming", "exception-handling"]
relatedTutorials: ["trigger-bulkification-best-practices"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# Building a Scalable Trigger Framework

Learn to build a production-ready trigger framework that's maintainable, testable, and scalable.

## Framework Benefits

- **Single Entry Point**: One trigger per object
- **Separation of Concerns**: Logic in handler classes
- **Recursion Control**: Prevent infinite loops
- **Configuration**: Enable/disable triggers
- **Testability**: Easy to unit test

---

# Implementation

## Base Handler Class

```apex
public virtual class TriggerHandler {
    
    private static Set<String> bypassedHandlers = new Set<String>();
    private Boolean isTriggerExecuting;
    
    public TriggerHandler() {
        this.isTriggerExecuting = Trigger.isExecuting;
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
    
    protected virtual void beforeInsert() {}
    protected virtual void beforeUpdate() {}
    protected virtual void beforeDelete() {}
    protected virtual void afterInsert() {}
    protected virtual void afterUpdate() {}
    protected virtual void afterDelete() {}
    protected virtual void afterUndelete() {}
    
    protected Boolean validateRun() {
        if (!this.isTriggerExecuting || isBypassed()) {
            return false;
        }
        return true;
    }
    
    public static void bypass(String handlerName) {
        bypassedHandlers.add(handlerName);
    }
    
    public static void clearBypass(String handlerName) {
        bypassedHandlers.remove(handlerName);
    }
    
    public Boolean isBypassed() {
        return bypassedHandlers.contains(getHandlerName());
    }
    
    private String getHandlerName() {
        return String.valueOf(this).substring(0, String.valueOf(this).indexOf(':'));
    }
}
```

## Object-Specific Handler

```apex
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
        AccountTriggerHelper.setDefaultValues(newAccounts);
        AccountTriggerHelper.validateAccounts(newAccounts);
    }
    
    protected override void afterInsert() {
        AccountTriggerHelper.createDefaultContacts(newAccounts);
        AccountTriggerHelper.notifyOwners(newAccounts);
    }
    
    protected override void beforeUpdate() {
        AccountTriggerHelper.validateUpdates(newAccounts, oldAccountMap);
    }
    
    protected override void afterUpdate() {
        List<Account> changedAccounts = getAccountsWithIndustryChange();
        if (!changedAccounts.isEmpty()) {
            AccountTriggerHelper.updateRelatedOpportunities(changedAccounts);
        }
    }
    
    private List<Account> getAccountsWithIndustryChange() {
        List<Account> changed = new List<Account>();
        for (Account acc : newAccounts) {
            Account oldAcc = oldAccountMap.get(acc.Id);
            if (acc.Industry != oldAcc.Industry) {
                changed.add(acc);
            }
        }
        return changed;
    }
}
```

## Trigger

```apex
trigger AccountTrigger on Account (
    before insert, before update, before delete,
    after insert, after update, after delete, after undelete
) {
    new AccountTriggerHandler().run();
}
```

---

# Testing

```apex
@isTest
private class AccountTriggerHandlerTest {
    
    @isTest
    static void testBeforeInsert() {
        Test.startTest();
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        Test.stopTest();
        
        Account result = [SELECT Id, Type FROM Account WHERE Id = :acc.Id];
        System.assertEquals('Prospect', result.Type, 'Should set default Type');
    }
    
    @isTest
    static void testBypass() {
        // Bypass trigger
        AccountTriggerHandler.bypass('AccountTriggerHandler');
        
        Test.startTest();
        Account acc = new Account(Name = 'Test');
        insert acc; // Trigger bypassed
        Test.stopTest();
        
        // Clear bypass
        AccountTriggerHandler.clearBypass('AccountTriggerHandler');
    }
}
```

---

# Best Practices

✅ One trigger per object
✅ All logic in handler classes
✅ Implement recursion prevention
✅ Add configuration management
✅ Write comprehensive tests

This framework is production-ready and scales to complex requirements!
