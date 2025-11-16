---
title: "Apex Interview Questions"
section: "interview"
order: 2
difficulty: "intermediate"
readTime: "35 min"
description: "Comprehensive Apex programming interview questions covering syntax, SOQL, DML, triggers, async Apex, and best practices."
overview: "Master Apex interview questions from basics to advanced topics. Covers data types, collections, SOQL, DML, triggers, batch Apex, queueable, future methods, and governor limits."
concepts: ["Apex Syntax", "SOQL", "DML", "Triggers", "Async Apex", "Governor Limits", "Best Practices"]
prerequisites: ["salesforce-basics-interview-questions"]
relatedTopics: ["lwc-interview-questions", "integration-interview-questions"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Apex Interview Questions

Comprehensive questions covering Apex programming for Salesforce developers.

## Apex Fundamentals

### Q1: What is Apex and why do we need it?

**Answer:**
**Apex** is Salesforce's proprietary, strongly-typed, object-oriented programming language for the platform.

**Why we need Apex:**
- **Complex business logic** beyond clicks (Flow/Process Builder)
- **Custom web services** (REST/SOAP APIs)
- **Triggers** for database operations
- **Batch processing** for large data volumes
- **Integration** with external systems
- **Custom controllers** for Visualforce/LWC

**Key Characteristics:**
- Executes on Salesforce servers (multi-tenant)
- Syntax similar to Java/C#
- Strongly typed
- Automatically upgrades with releases
- Governor limits (multi-tenant protection)

**Interview Tip**: Mention you use declarative tools (Flows) when possible, Apex when necessary.

---

### Q2: Apex vs Java - what are the differences?

**Answer:**

| Feature | Apex | Java |
|---------|------|------|
| **Execution** | Salesforce servers only | Any JVM |
| **Governor Limits** | Yes (multi-tenant) | No |
| **Threading** | No multi-threading | Full threading support |
| **File I/O** | No direct file access | Full file system access |
| **Database** | Built-in SOQL/DML | JDBC required |
| **Type System** | sObject, primitive types | Object-based |
| **Case Sensitivity** | Case-insensitive | Case-sensitive |

**Similarities:**
- Object-oriented
- Similar syntax
- Classes, interfaces, inheritance
- Exception handling

---

### Q3: What are the different types of Apex triggers?

**Answer:**

**By Timing:**
- **Before Triggers**: Execute before record saved to database
  - Use for: Validation, field updates on same record
  - Examples: `before insert`, `before update`, `before delete`

- **After Triggers**: Execute after record saved to database
  - Use for: Related record updates, calling external systems
  - Examples: `after insert`, `after update`, `after delete`, `after undelete`

**All Trigger Events:**
```apex
trigger AccountTrigger on Account (
    before insert, before update, before delete,
    after insert, after update, after delete, after undelete
) {
    // Trigger logic
}
```

**When to use which:**
- **before insert/update**: Modify same record (no DML needed)
- **after insert/update**: Update related records, call external APIs
- **before delete**: Prevent deletion
- **after delete**: Clean up related data
- **after undelete**: Restore related data

---

### Q4: What is Trigger.new vs Trigger.old?

**Answer:**

| Variable | Type | Available In | Contains |
|----------|------|--------------|----------|
| **Trigger.new** | List<sObject> | insert, update, undelete | New values |
| **Trigger.old** | List<sObject> | update, delete | Old values |
| **Trigger.newMap** | Map<Id, sObject> | before update, after insert/update/undelete | New values by Id |
| **Trigger.oldMap** | Map<Id, sObject> | update, delete | Old values by Id |

**Example:**
```apex
trigger OpportunityTrigger on Opportunity (after update) {
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = Trigger.oldMap.get(opp.Id);

        // Check if Stage changed to Closed Won
        if (opp.StageName == 'Closed Won' &&
            oldOpp.StageName != 'Closed Won') {
            // Stage just changed to Closed Won!
        }
    }
}
```

**Interview Tip**: Explain that `Trigger.newMap` is more efficient than looping to find old values.

---

## SOQL & DML

### Q5: What's the difference between SOQL and SQL?

**Answer:**

| Feature | SOQL | SQL |
|---------|------|-----|
| **Purpose** | Query Salesforce data | Query any database |
| **Operations** | SELECT only (no INSERT/UPDATE/DELETE) | Full CRUD |
| **Joins** | Relationship queries (dot notation) | JOIN statements |
| **Max Records** | 50,000 per query | Database-dependent |
| **Syntax** | Salesforce-specific | Standard SQL |
| **Functions** | Limited | Extensive |

**SOQL Example:**
```apex
// Parent to Child
SELECT Name, (SELECT FirstName, LastName FROM Contacts)
FROM Account
WHERE Industry = 'Technology'

// Child to Parent (dot notation)
SELECT FirstName, LastName, Account.Name, Account.Industry
FROM Contact
WHERE Account.AnnualRevenue > 1000000
```

**Interview Tip**: Mention that SOQL is **read-only** - use DML for write operations.

---

### Q6: Explain SOQL relationship queries

**Answer:**

**Parent-to-Child (Subquery):**
```apex
SELECT Name, (SELECT FirstName, LastName FROM Contacts)
FROM Account
WHERE Id = '001...'
```
- Returns Account with nested Contact list
- Max 20,000 child records

**Child-to-Parent (Dot Notation):**
```apex
SELECT FirstName, LastName, Account.Name, Account.Owner.Name
FROM Contact
WHERE Account.Industry = 'Technology'
```
- Can traverse up to 5 levels
- Access parent fields with dot notation

**Best Practice:**
```apex
// ❌ Bad: Query in loop
for (Contact c : contacts) {
    Account acc = [SELECT Name FROM Account WHERE Id = :c.AccountId];
}

// ✅ Good: Single query with relationship
List<Contact> contacts = [
    SELECT FirstName, LastName, Account.Name
    FROM Contact
    WHERE Id IN :contactIds
];
```

---

### Q7: What are SOQL governor limits?

**Answer:**

**Per Transaction:**
- **100 SOQL queries** max
- **50,000 records retrieved** total across all queries
- **10,000 records** returned per query (use LIMIT clause)

**Best Practices:**
```apex
// ❌ Bad: Query in loop (governor limit violation)
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// ✅ Good: Query outside loop, use Map
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    if (!contactsByAccount.containsKey(c.AccountId)) {
        contactsByAccount.put(c.AccountId, new List<Contact>());
    }
    contactsByAccount.get(c.AccountId).add(c);
}
```

**Interview Tip**: Show you **bulkify** code by querying outside loops!

---

### Q8: What's the difference between insert vs Database.insert?

**Answer:**

| Feature | insert | Database.insert |
|---------|--------|-----------------|
| **Partial Success** | No | Yes (with allOrNone=false) |
| **Error Handling** | Exception thrown | Returns Database.SaveResult |
| **Use Case** | All must succeed | Some can fail |

**Example:**
```apex
// insert - all or nothing
try {
    insert accounts; // If ANY fail, ALL fail
} catch (DmlException e) {
    // Handle error
}

// Database.insert - partial success
Database.SaveResult[] results = Database.insert(accounts, false);

for (Database.SaveResult sr : results) {
    if (sr.isSuccess()) {
        System.debug('Success: ' + sr.getId());
    } else {
        for (Database.Error err : sr.getErrors()) {
            System.debug('Error: ' + err.getMessage());
        }
    }
}
```

**When to use which:**
- **insert**: Transactional data (all must succeed)
- **Database.insert(records, false)**: Bulk imports (continue on errors)

---

### Q9: Explain DML governor limits

**Answer:**

**Per Transaction:**
- **150 DML statements** max
- **10,000 records** max across all DML

**Best Practices:**
```apex
// ❌ Bad: DML in loop
for (Account acc : accounts) {
    acc.Rating = 'Hot';
    update acc; // 1 DML per iteration!
}

// ✅ Good: Bulk DML outside loop
List<Account> accountsToUpdate = new List<Account>();
for (Account acc : accounts) {
    acc.Rating = 'Hot';
    accountsToUpdate.add(acc);
}
update accountsToUpdate; // Single DML for all records
```

**Upsert Example:**
```apex
// Upsert: Insert new, update existing
upsert accounts Account.External_Id__c;
```

---

## Trigger Best Practices

### Q10: What's the Trigger Handler pattern?

**Answer:**
The **Trigger Handler pattern** separates trigger logic from the trigger itself for better organization and testing.

**Structure:**
```apex
// Trigger (minimal logic)
trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    AccountTriggerHandler.handle();
}

// Handler Class (all logic)
public class AccountTriggerHandler {
    public static void handle() {
        if (Trigger.isBefore) {
            if (Trigger.isInsert) beforeInsert();
            if (Trigger.isUpdate) beforeUpdate();
        } else if (Trigger.isAfter) {
            if (Trigger.isInsert) afterInsert();
            if (Trigger.isUpdate) afterUpdate();
        }
    }

    private static void beforeInsert() {
        // Before insert logic
    }

    private static void beforeUpdate() {
        // Before update logic
    }
}
```

**Benefits:**
- Cleaner, more maintainable code
- Easier testing (can test handler without DML)
- Reusable logic
- One trigger per object (consolidation)

---

### Q11: How do you prevent recursion in triggers?

**Answer:**
Use a **static boolean flag** to track if trigger has already executed:

```apex
public class TriggerHelper {
    public static Boolean isFirstRun = true;
}

trigger AccountTrigger on Account (after update) {
    if (TriggerHelper.isFirstRun) {
        TriggerHelper.isFirstRun = false;

        // Your logic that might cause recursion
        // This will only run ONCE per transaction

        TriggerHelper.isFirstRun = true; // Reset for next transaction
    }
}
```

**Better Approach (Set of IDs):**
```apex
public class TriggerHelper {
    public static Set<Id> processedAccounts = new Set<Id>();
}

trigger AccountTrigger on Account (after update) {
    List<Account> accountsToProcess = new List<Account>();

    for (Account acc : Trigger.new) {
        if (!TriggerHelper.processedAccounts.contains(acc.Id)) {
            TriggerHelper.processedAccounts.add(acc.Id);
            accountsToProcess.add(acc);
        }
    }

    // Process only accounts not yet processed
}
```

---

## Asynchronous Apex

### Q12: What are the types of asynchronous Apex?

**Answer:**

| Type | Use Case | Limitations | Chaining |
|------|----------|-------------|----------|
| **Future** | Simple async callouts, avoid mixed DML | No complex types, no return value | No |
| **Batch** | Process millions of records | 5 concurrent, scheduled | Yes (finish method) |
| **Queueable** | Complex async logic, chaining | 50 queued per transaction | Yes |
| **Scheduled** | Run on schedule | 100 max scheduled | No |

**When to use which:**
- **@future**: Quick async operations, callouts
- **Batch**: Large data processing (100K+ records)
- **Queueable**: Complex async logic with chaining
- **Scheduled**: Nightly/weekly batch jobs

---

### Q13: What's a @future method and when to use it?

**Answer:**
**@future** methods run asynchronously in a separate thread with **higher governor limits**.

**Syntax:**
```apex
public class AccountService {
    @future
    public static void updateAccountsAsync(Set<Id> accountIds) {
        List<Account> accounts = [SELECT Id, Rating FROM Account WHERE Id IN :accountIds];
        for (Account acc : accounts) {
            acc.Rating = 'Hot';
        }
        update accounts;
    }
}

// Call it
AccountService.updateAccountsAsync(accountIds);
```

**Requirements:**
- Must be **static**
- Must be **void** (no return value)
- Parameters: **Primitives** or **collections of primitives** (no sObjects!)
- Cannot call another @future method

**Common Use Cases:**
- **Mixed DML** (setup objects + non-setup objects)
- **Web service callouts**
- **Avoid governor limits** (need more SOQL/DML)

**Interview Tip**: Mention that **Queueable** is now preferred for new development (more flexible).

---

### Q14: Explain Batch Apex with example

**Answer:**
**Batch Apex** processes **large datasets** by breaking them into smaller chunks.

**Structure:**
```apex
public class AccountBatch implements Database.Batchable<sObject> {

    // 1. start(): Return records to process
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Rating FROM Account WHERE Rating = NULL
        ]);
    }

    // 2. execute(): Process each batch
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            acc.Rating = 'Warm';
        }
        update scope;
    }

    // 3. finish(): Post-processing
    public void finish(Database.BatchableContext bc) {
        // Send email, chain another batch, etc.
        System.debug('Batch completed!');
    }
}

// Execute batch
AccountBatch batch = new AccountBatch();
Database.executeBatch(batch, 200); // Batch size (default 200)
```

**Governor Limits:**
- **50 million records** can be processed
- **200 batch size** default (1-2000 allowed)
- **5 concurrent batches** max

**Interview Tip**: Mention you can check batch status with `AsyncApexJob` object.

---

### Q15: What's Queueable Apex?

**Answer:**
**Queueable Apex** is like @future but with more features:

**Advantages over @future:**
- Can pass **complex types** (sObjects, custom classes)
- Can **chain** jobs (call another queueable from finish)
- Returns a **Job ID** (can monitor)
- **Non-primitive return types**

**Example:**
```apex
public class AccountQueueable implements Queueable {
    private List<Account> accounts;

    public AccountQueueable(List<Account> accounts) {
        this.accounts = accounts;
    }

    public void execute(QueueableContext context) {
        for (Account acc : accounts) {
            acc.Rating = 'Hot';
        }
        update accounts;

        // Chain another job
        if (someCondition) {
            System.enqueueJob(new AnotherQueueable());
        }
    }
}

// Execute
Id jobId = System.enqueueJob(new AccountQueueable(accounts));
System.debug('Job ID: ' + jobId);
```

**Limits:**
- **50 queueable jobs** per transaction
- **1 chained job** per execution (Spring '21+: depth of 5)

---

## Collections & Data Structures

### Q16: List vs Set vs Map - when to use each?

**Answer:**

| Collection | Ordered | Duplicates | Access | Use Case |
|------------|---------|------------|--------|----------|
| **List** | Yes | Yes | By index [0] | Ordered data, duplicates OK |
| **Set** | No | No | N/A | Unique values, membership checks |
| **Map** | No | No (keys) | By key | Key-value pairs, lookups |

**Examples:**
```apex
// List: Ordered, duplicates allowed
List<String> names = new List<String>{'John', 'Jane', 'John'};
String first = names[0]; // 'John'

// Set: Unique values only
Set<String> uniqueNames = new Set<String>{'John', 'Jane', 'John'};
System.debug(uniqueNames.size()); // 2 (duplicate removed)

// Map: Key-value pairs
Map<Id, Account> accountMap = new Map<Id, Account>(
    [SELECT Id, Name FROM Account LIMIT 100]
);
Account acc = accountMap.get(someId);
```

**Best Practice:**
```apex
// ❌ Bad: Loop to find record
for (Account acc : accounts) {
    if (acc.Id == searchId) {
        // Found it!
    }
}

// ✅ Good: Use Map for O(1) lookup
Map<Id, Account> accountMap = new Map<Id, Account>(accounts);
Account acc = accountMap.get(searchId);
```

---

## Governor Limits

### Q17: What are the most important governor limits?

**Answer:**

**Synchronous:**
- 100 SOQL queries
- 150 DML statements
- 10,000 DML records
- 50,000 SOQL records retrieved
- 6 MB heap size
- 10 seconds CPU time

**Asynchronous (@future, Batch, Queueable):**
- 200 SOQL queries
- 150 DML statements
- 10,000 DML records
- 12 MB heap size
- 60 seconds CPU time

**Per 24 Hours:**
- 250,000 async executions

**Interview Answer**: "I always bulkify my code - query outside loops, use collections, and batch DML operations."

---

### Q18: How do you avoid governor limits?

**Answer:**

**1. Bulkify SOQL:**
```apex
// ❌ Bad
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// ✅ Good
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    // Build map
}
```

**2. Bulkify DML:**
```apex
// ❌ Bad
for (Account acc : accounts) {
    update acc;
}

// ✅ Good
update accounts;
```

**3. Use Maps for lookups:**
```apex
Map<Id, Account> accountMap = new Map<Id, Account>(accounts);
Account acc = accountMap.get(someId); // O(1) instead of O(n)
```

**4. Use Batch Apex for large datasets:**
```apex
Database.executeBatch(new MyBatch(), 200);
```

**5. SOQL For Loops for large queries:**
```apex
for (List<Account> accounts : [SELECT Id FROM Account]) {
    // Process in chunks of 200
}
```

---

## Advanced Topics

### Q19: What's a custom exception in Apex?

**Answer:**
Custom exceptions let you create your own error types:

```apex
public class InsufficientFundsException extends Exception {}

public class BankAccount {
    public Decimal balance;

    public void withdraw(Decimal amount) {
        if (amount > balance) {
            throw new InsufficientFundsException(
                'Insufficient funds. Balance: ' + balance + ', Requested: ' + amount
            );
        }
        balance -= amount;
    }
}

// Usage
try {
    account.withdraw(1000);
} catch (InsufficientFundsException e) {
    System.debug('Cannot withdraw: ' + e.getMessage());
}
```

**Custom Exception Must:**
- End with `Exception`
- Extend `Exception` class

---

### Q20: Explain the order of execution in Salesforce

**Answer:**
When a record is saved, Salesforce executes in this order:

**1. System Validation** (required fields, data types)
**2. Before Triggers**
**3. Custom Validation Rules**
**4. Duplicate Rules**
**5. Record Saved** (not committed yet)
**6. After Triggers**
**7. Assignment Rules**
**8. Auto-Response Rules**
**9. Workflow Rules**
**10. Processes (Process Builder)**
**11. Escalation Rules**
**12. Record-Triggered Flows** (async paths)
**13. Commit to Database**
**14. Post-commit logic** (Email sends, etc.)

**Key Points:**
- **before triggers** can modify the record without DML
- **after triggers** see the saved record
- **Validation rules** run after before triggers
- Everything is in ONE transaction until commit

**Interview Tip**: Mention you can use `System.debug` and debug logs to trace execution order.

---

## Scenario Questions

### Q21: You need to update 500,000 Account records. How?

**Answer:**

**Use Batch Apex:**

```apex
public class MassAccountUpdate implements Database.Batchable<sObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Rating FROM Account
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            acc.Rating = 'Warm';
        }
        update scope;
    }

    public void finish(Database.BatchableContext bc) {
        // Send completion email
    }
}

// Execute
Database.executeBatch(new MassAccountUpdate(), 200);
```

**Why Batch?**
- Can process **50 million records**
- Chunks work into manageable batches (200 default)
- Higher governor limits per batch
- Can schedule or run manually

**Alternative for smaller datasets (<50K):**
- Use SOQL For Loop to avoid heap size issues

---

## Interview Tips

### ✅ DO:
- **Write clean code** on whiteboard (proper indentation)
- **Explain as you write** (thought process)
- **Mention governor limits** (shows you think about scale)
- **Ask clarifying questions** (requirements, data volume)

### ❌ DON'T:
- Don't write code in loops without bulkifying
- Don't forget error handling
- Don't hardcode IDs or values
- Don't ignore test coverage

---

## Common Follow-Ups

**"How would you test this?"**
```apex
@isTest
private class AccountServiceTest {
    @isTest
    static void testBulkInsert() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            accounts.add(new Account(Name = 'Test ' + i));
        }

        Test.startTest();
        insert accounts;
        Test.stopTest();

        // Verify
        System.assertEquals(200, [SELECT COUNT() FROM Account]);
    }
}
```

**"What happens if this fails?"**
- Show you use try-catch blocks
- Mention Database.insert with allOrNone=false for partial success
- Explain rollback behavior

---

## Practice Checklist

- [ ] Can write a trigger with handler pattern
- [ ] Understand SOQL governor limits
- [ ] Know when to use future vs queueable vs batch
- [ ] Can explain order of execution
- [ ] Understand bulkification
- [ ] Can write test classes
- [ ] Know Map/Set/List differences
- [ ] Understand DML vs Database methods
- [ ] Can prevent recursion in triggers
- [ ] Know custom exception syntax

**Next**: Practice coding these on whiteboard/screen share! 🚀
