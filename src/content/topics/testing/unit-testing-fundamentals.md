---
title: "Unit Testing Fundamentals"
section: "testing"
order: 1
difficulty: "beginner"
readTime: "22 min"
description: "Master Apex unit testing including test classes, test methods, assertions, test data, and code coverage requirements."
overview: "Learn how to write effective unit tests for Apex code with best practices and patterns."
concepts: ["unit-testing", "test-classes", "assertions", "test-data", "code-coverage", "test-setup"]
prerequisites: ["apex-basics", "dml-operations", "soql-fundamentals"]
relatedTopics: ["trigger-bulkification-best-practices", "exception-handling"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Unit testing verifies code behaves correctly. Salesforce requires 75% code coverage for production deployment.

## Test Class Basics

- **@isTest**: Marks class as test class
- **@isTest static**: Marks test method
- **Test.startTest() / Test.stopTest()**: Governor limit reset
- **System.assert()**: Verify expected results

---

# Code Examples

## Basic Test Class

```apex
@isTest
private class AccountServiceTest {
    
    @isTest
    static void testCreateAccount() {
        // Setup
        Account acc = new Account(Name = 'Test Account');
        
        // Execute
        Test.startTest();
        insert acc;
        Test.stopTest();
        
        // Verify
        Account result = [SELECT Id, Name FROM Account WHERE Id = :acc.Id];
        System.assertEquals('Test Account', result.Name, 'Name should match');
        System.assertNotEquals(null, result.Id, 'Id should be populated');
    }
    
    @isTest
    static void testBulkInsert() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            accounts.add(new Account(Name = 'Test ' + i));
        }
        
        Test.startTest();
        insert accounts;
        Test.stopTest();
        
        Integer count = [SELECT COUNT() FROM Account];
        System.assertEquals(200, count, 'Should insert all accounts');
    }
}
```

## Test Data Factory

```apex
@isTest
public class TestDataFactory {
    
    public static List<Account> createAccounts(Integer count) {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < count; i++) {
            accounts.add(new Account(
                Name = 'Test Account ' + i,
                Industry = 'Technology'
            ));
        }
        insert accounts;
        return accounts;
    }
    
    public static List<Contact> createContacts(Id accountId, Integer count) {
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < count; i++) {
            contacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact ' + i,
                AccountId = accountId
            ));
        }
        insert contacts;
        return contacts;
    }
}
```

## Testing Exceptions

```apex
@isTest
static void testInvalidData() {
    Account acc = new Account(); // Missing required Name
    
    try {
        Test.startTest();
        insert acc;
        Test.stopTest();
        
        System.assert(false, 'Should have thrown exception');
    } catch (DmlException e) {
        System.assert(e.getMessage().contains('REQUIRED_FIELD_MISSING'));
    }
}
```

---

# Best Practices

✅ Test bulk operations (200+ records)
✅ Use Test.startTest/stopTest for limits reset
✅ Test positive and negative scenarios
✅ Use meaningful assertions
✅ Create reusable test data factories

❌ Don't use @SeeAllData=true
❌ Don't test Salesforce standard functionality
❌ Don't hardcode record Ids

---

# Code Coverage

- **75% minimum** for production deployment
- **100% coverage** doesn't guarantee quality
- **Focus on logic**, not just coverage
- Test edge cases and error handling

---

# Related Topics

- **[DML Operations](dml-operations)**
- **[Exception Handling](exception-handling)**
- **[Trigger Testing](trigger-bulkification-best-practices)**
