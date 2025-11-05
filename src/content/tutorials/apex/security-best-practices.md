---
title: "Apex Security Best Practices"
category: "apex"
difficulty: "advanced"
readTime: "24 min"
author: "Jessica Williams"
description: "Master Apex security including CRUD/FLS enforcement, SOQL injection prevention, XSS protection, and secure coding patterns."
tags: ["security", "apex", "crud", "fls", "soql-injection", "best-practices"]
prerequisites: ["security-and-sharing", "soql-fundamentals", "dml-operations"]
relatedTutorials: ["trigger-framework-implementation"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# Apex Security Best Practices

Build secure Apex code that protects data and prevents vulnerabilities.

---

# Security Checklist

## ✅ Must-Do Security Practices

### 1. Enforce CRUD and FLS

```apex
public with sharing class SecureAccountController {
    
    @AuraEnabled
    public static List<Account> getAccounts() {
        // Check read permission
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new AuraHandledException('No access to Account');
        }
        
        List<Account> accounts = [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            LIMIT 100
        ];
        
        // Strip inaccessible fields
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.READABLE,
            accounts
        );
        
        return decision.getRecords();
    }
    
    @AuraEnabled
    public static void createAccount(String name, String industry) {
        // Check create permission
        if (!Schema.sObjectType.Account.isCreateable()) {
            throw new AuraHandledException('No create access');
        }
        
        // Check field permissions
        if (!Schema.sObjectType.Account.fields.Name.isCreateable() ||
            !Schema.sObjectType.Account.fields.Industry.isCreateable()) {
            throw new AuraHandledException('No field access');
        }
        
        Account acc = new Account(Name = name, Industry = industry);
        insert acc;
    }
}
```

### 2. Prevent SOQL Injection

```apex
// ❌ VULNERABLE to SOQL injection
public static List<Account> searchAccountsBad(String searchTerm) {
    String query = 'SELECT Id, Name FROM Account WHERE Name LIKE \'%' + searchTerm + '%\'';
    return Database.query(query);
}

// ✅ SAFE - Use bind variables
public static List<Account> searchAccountsSafe(String searchTerm) {
    String safeTerm = '%' + String.escapeSingleQuotes(searchTerm) + '%';
    return [SELECT Id, Name FROM Account WHERE Name LIKE :safeTerm];
}
```

### 3. Use with sharing

```apex
// ✅ Respects sharing rules
public with sharing class AccountService {
    public static List<Account> getAccessibleAccounts() {
        return [SELECT Id, Name FROM Account];
    }
}
```

### 4. Validate User Input

```apex
public static void processUserData(String userInput) {
    // Validate input
    if (String.isBlank(userInput)) {
        throw new IllegalArgumentException('Input cannot be blank');
    }
    
    // Sanitize
    String sanitized = String.escapeSingleQuotes(userInput);
    
    // Limit length
    if (sanitized.length() > 255) {
        throw new IllegalArgumentException('Input too long');
    }
    
    // Process safely
}
```

### 5. Secure Remote Site Settings

```apex
// ✅ Use Named Credentials
HttpRequest req = new HttpRequest();
req.setEndpoint('callout:My_Named_Credential/api/data');
// No hardcoded credentials!
```

---

# Security Anti-Patterns

## ❌ Never Do These

### Don't Hardcode Credentials

```apex
// ❌ NEVER DO THIS
String apiKey = 'abc123secretkey';
String password = 'mypassword123';
```

### Don't Use without sharing Unnecessarily

```apex
// ❌ Bypasses security
public without sharing class UnsafeController {
    // Only use when absolutely necessary
}
```

### Don't Concatenate User Input in Queries

```apex
// ❌ SOQL INJECTION RISK
String query = 'SELECT Id FROM Account WHERE Name = \'' + userInput + '\'';
```

---

# Complete Secure Controller Example

```apex
public with sharing class SecureController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchTerm) {
        // Validate input
        if (String.isBlank(searchTerm)) {
            return new List<Account>();
        }
        
        // Check permissions
        if (!Schema.sObjectType.Account.isAccessible()) {
            throw new AuraHandledException('No access');
        }
        
        // Sanitize input
        String safeTerm = '%' + String.escapeSingleQuotes(searchTerm) + '%';
        
        // Query with bind variable
        List<Account> accounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Name LIKE :safeTerm
            WITH SECURITY_ENFORCED
            LIMIT 50
        ];
        
        // Strip inaccessible fields
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.READABLE,
            accounts
        );
        
        return decision.getRecords();
    }
}
```

---

# Security Testing

```apex
@isTest
private class SecureControllerTest {
    
    @isTest
    static void testWithoutPermission() {
        // Create user without Account access
        User testUser = createUserWithoutAccess();
        
        System.runAs(testUser) {
            try {
                List<Account> accounts = SecureController.getAccounts('Test');
                System.assert(false, 'Should throw exception');
            } catch (AuraHandledException e) {
                System.assert(e.getMessage().contains('No access'));
            }
        }
    }
}
```

---

# Summary

✅ Always enforce CRUD and FLS
✅ Use bind variables, never concatenate
✅ Use 'with sharing' by default
✅ Validate and sanitize all user input
✅ Use Security.stripInaccessible
✅ Use Named Credentials
✅ Test security scenarios

Security isn't optional - build it in from the start!
