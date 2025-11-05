---
title: "Governor Limits and Resource Management"
section: "apex"
order: 9
difficulty: "intermediate"
readTime: "28 min"
description: "Master Salesforce governor limits including SOQL, DML, CPU time, heap size, and strategies for efficient resource usage."
overview: "Learn how to work within governor limits and optimize code for scalability."
concepts: ["governor-limits", "soql-limits", "dml-limits", "cpu-time", "heap-size", "callout-limits", "optimization"]
prerequisites: ["soql-fundamentals", "dml-operations", "control-flow-and-logic"]
relatedTopics: ["trigger-bulkification-best-practices", "asynchronous-apex-patterns"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Governor Limits

Salesforce enforces limits to ensure multi-tenant platform stability.

## Key Limits (Synchronous)
- **SOQL Queries**: 100 per transaction
- **SOQL Records**: 50,000 per transaction
- **DML Statements**: 150 per transaction
- **DML Records**: 10,000 per transaction
- **CPU Time**: 10 seconds
- **Heap Size**: 6 MB
- **Callouts**: 100 per transaction

## Asynchronous Limits (Higher)
- **SOQL Queries**: 200
- **CPU Time**: 60 seconds
- **Heap Size**: 12 MB

---

# Code Examples

## Monitoring Limits

```apex
public class LimitMonitoring {
    
    public static void checkLimits() {
        System.debug('SOQL Queries: ' + Limits.getQueries() + '/' + Limits.getLimitQueries());
        System.debug('DML Statements: ' + Limits.getDmlStatements() + '/' + Limits.getLimitDmlStatements());
        System.debug('CPU Time: ' + Limits.getCpuTime() + '/' + Limits.getLimitCpuTime());
        System.debug('Heap Size: ' + Limits.getHeapSize() + '/' + Limits.getLimitHeapSize());
    }
    
    public static void displayAllLimits() {
        System.debug('=== GOVERNOR LIMITS ===');
        System.debug('SOQL: ' + Limits.getQueries() + '/' + Limits.getLimitQueries());
        System.debug('DML: ' + Limits.getDmlStatements() + '/' + Limits.getLimitDmlStatements());
        System.debug('Records: ' + Limits.getDmlRows() + '/' + Limits.getLimitDmlRows());
        System.debug('CPU: ' + Limits.getCpuTime() + 'ms/' + Limits.getLimitCpuTime() + 'ms');
        System.debug('Heap: ' + Limits.getHeapSize() + '/' + Limits.getLimitHeapSize() + ' bytes');
        System.debug('Callouts: ' + Limits.getCallouts() + '/' + Limits.getLimitCallouts());
    }
}
```

## Avoiding SOQL Limits

```apex
// ❌ BAD - SOQL in loop
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// ✅ GOOD - Single SOQL with IN clause
Set<Id> accountIds = new Set<Id>();
for (Account acc : accounts) {
    accountIds.add(acc.Id);
}
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    if (!contactsByAccount.containsKey(c.AccountId)) {
        contactsByAccount.put(c.AccountId, new List<Contact>());
    }
    contactsByAccount.get(c.AccountId).add(c);
}
```

## Managing CPU Time

```apex
// ✅ Optimize expensive operations
public static void efficientProcessing(List<Account> accounts) {
    // Pre-compute expensive values
    Map<String, Decimal> taxRates = getTaxRates();
    
    for (Account acc : accounts) {
        // Use pre-computed values
        Decimal rate = taxRates.get(acc.BillingState);
        
        // Avoid complex calculations in loops
        acc.Tax_Amount__c = acc.AnnualRevenue * rate;
    }
}

// ❌ Avoid expensive operations in loops
public static void inefficientProcessing(List<Account> accounts) {
    for (Account acc : accounts) {
        // Expensive operation repeated
        Decimal rate = calculateTaxRate(acc.BillingState);
        acc.Tax_Amount__c = acc.AnnualRevenue * rate;
    }
}
```

## Heap Size Management

```apex
// ✅ Process in chunks
public static void processLargeDataset(List<Account> accounts) {
    Integer batchSize = 200;
    
    for (Integer i = 0; i < accounts.size(); i += batchSize) {
        Integer endIndex = Math.min(i + batchSize, accounts.size());
        List<Account> batch = accounts.subList(i, endIndex);
        
        processBatch(batch);
        
        // Clear references to free memory
        batch.clear();
    }
}

// ❌ Loading too much data
public static void badHeapUsage() {
    // Don't query all fields if not needed
    List<Account> accounts = [SELECT Id, Name, Description, 
        BillingStreet, BillingCity, BillingState, 
        /* many more fields */ FROM Account];
}
```

---

# Optimization Strategies

✅ Bulkify all operations
✅ Use Maps for lookups (O(1) vs O(n))
✅ Query only needed fields
✅ Use aggregate queries when possible
✅ Move long-running code to async
✅ Cache frequently accessed data

❌ Don't query in loops
❌ Don't perform DML in loops
❌ Don't load unnecessary data
❌ Don't use nested loops with queries

---

# Related Topics

- **[Trigger Bulkification](trigger-bulkification-best-practices)**
- **[Asynchronous Apex](asynchronous-apex-patterns)**
- **[SOQL Best Practices](soql-best-practices)**
