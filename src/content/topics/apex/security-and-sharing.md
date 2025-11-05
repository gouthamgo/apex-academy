---
title: "Security and Sharing Rules in Apex"
section: "apex"
order: 10
difficulty: "advanced"
readTime: "24 min"
description: "Master Apex security including CRUD/FLS enforcement, with/without sharing, Security.stripInaccessible, and data access patterns."
overview: "Learn how to write secure Apex code that respects object permissions, field-level security, and sharing rules."
concepts: ["security", "crud", "fls", "sharing-rules", "with-sharing", "without-sharing", "stripInaccessible"]
prerequisites: ["soql-fundamentals", "dml-operations", "object-oriented-programming"]
relatedTopics: ["triggers-and-frameworks", "soql-best-practices"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Security in Apex

Apex code runs in system context by default, bypassing security.

## Security Layers
- **Object Permissions**: Create, read, update, delete
- **Field-Level Security (FLS)**: Field access
- **Sharing Rules**: Record access
- **with/without sharing**: Keywords for sharing enforcement

---

# Code Examples

## With Sharing vs Without Sharing

```apex
// Respects sharing rules
public with sharing class SecureController {
    public static List<Account> getAccounts() {
        // Only returns accounts user has access to
        return [SELECT Id, Name FROM Account];
    }
}

// Ignores sharing rules
public without sharing class SystemController {
    public static List<Account> getAllAccounts() {
        // Returns all accounts regardless of sharing
        return [SELECT Id, Name FROM Account];
    }
}

// Inherits sharing from caller
public inherited sharing class FlexibleController {
    // Uses caller's sharing context
}
```

## Enforcing CRUD and FLS

```apex
public class SecureDataAccess {
    
    // Check CRUD before query
    public static List<Account> getAccountsWithCRUD() {
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new SecurityException('No read access to Account');
        }
        
        return [SELECT Id, Name, Industry FROM Account];
    }
    
    // Check FLS before query
    public static List<Account> getAccountsWithFLS() {
        // Check object access
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new SecurityException('No access to Account');
        }
        
        // Check field access
        if (!Schema.sObjectType.Account.fields.Industry.isAccessible()) {
            throw new SecurityException('No access to Industry field');
        }
        
        return [SELECT Id, Name, Industry FROM Account];
    }
    
    // Strip inaccessible fields
    public static List<Account> getAccountsStripped() {
        List<Account> accounts = [SELECT Id, Name, Industry, AnnualRevenue FROM Account];
        
        // Strip fields user can't access
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.READABLE,
            accounts
        );
        
        return decision.getRecords();
    }
}
```

## Security.stripInaccessible

```apex
public class StripInaccessibleExample {
    
    public static void insertWithSecurity(Account acc) {
        // Strip fields user can't create
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.CREATABLE,
            new List<Account>{ acc }
        );
        
        insert decision.getRecords();
    }
    
    public static void updateWithSecurity(Account acc) {
        // Strip fields user can't update
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.UPDATABLE,
            new List<Account>{ acc }
        );
        
        update decision.getRecords();
    }
}
```

---

# Best Practices

✅ Use 'with sharing' by default
✅ Use Security.stripInaccessible for FLS
✅ Check CRUD permissions before DML
✅ Validate user input
✅ Use bind variables to prevent SOQL injection

❌ Don't use 'without sharing' unless necessary
❌ Don't bypass security in user-facing code
❌ Don't concatenate user input in queries

---

# Related Topics

- **[SOQL Fundamentals](soql-fundamentals)**
- **[DML Operations](dml-operations)**
