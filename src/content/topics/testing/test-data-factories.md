---
title: "Test Data Factory Patterns"
section: "testing"
order: 2
difficulty: "intermediate"
readTime: "18 min"
description: "Master test data factory patterns for creating reusable, maintainable test data in Apex unit tests."
overview: "Learn how to build efficient test data factories that reduce code duplication and improve test maintainability."
concepts: ["test-data", "factory-pattern", "test-setup", "reusable-tests", "data-builder"]
prerequisites: ["unit-testing-fundamentals", "object-oriented-programming"]
relatedTopics: ["mocking-and-stubs", "code-coverage-strategies"]
lastUpdated: "2025-01-15"
examWeight: "medium"
---

# Test Data Factory Pattern

Centralize test data creation for reusability and maintainability.

## Benefits
- **DRY**: Don't repeat test data creation
- **Consistency**: Same data structure across tests
- **Maintainability**: One place to update
- **Flexibility**: Customizable defaults

---

# Code Examples

## Basic Factory

```apex
@isTest
public class TestDataFactory {
    
    public static Account createAccount(String name) {
        return new Account(
            Name = name,
            Industry = 'Technology',
            AnnualRevenue = 1000000
        );
    }
    
    public static List<Account> createAccounts(Integer count) {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < count; i++) {
            accounts.add(createAccount('Test Account ' + i));
        }
        return accounts;
    }
    
    public static Account createAccountWithInsert(String name) {
        Account acc = createAccount(name);
        insert acc;
        return acc;
    }
}
```

## Advanced Factory with Builder Pattern

```apex
@isTest
public class AccountFactory {
    
    private Account acc;
    
    public AccountFactory() {
        acc = new Account(
            Name = 'Default Account',
            Industry = 'Technology'
        );
    }
    
    public AccountFactory withName(String name) {
        acc.Name = name;
        return this;
    }
    
    public AccountFactory withIndustry(String industry) {
        acc.Industry = industry;
        return this;
    }
    
    public AccountFactory withRevenue(Decimal revenue) {
        acc.AnnualRevenue = revenue;
        return this;
    }
    
    public Account build() {
        return acc;
    }
    
    public Account create() {
        insert acc;
        return acc;
    }
}

// Usage in tests
@isTest
static void testWithFactory() {
    Account acc = new AccountFactory()
        .withName('ACME Corp')
        .withIndustry('Manufacturing')
        .withRevenue(5000000)
        .create();
    
    System.assertNotEquals(null, acc.Id);
}
```

---

# Best Practices

✅ Create factories for commonly used objects
✅ Provide sensible defaults
✅ Allow customization when needed
✅ Don't insert by default (let test decide)

---

# Related Topics

- **[Unit Testing Fundamentals](unit-testing-fundamentals)**
