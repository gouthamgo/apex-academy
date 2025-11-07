---
title: "Batch Apex"
section: "apex"
order: 11
difficulty: "intermediate"
readTime: "25 min"
description: "Master Batch Apex for processing large data volumes asynchronously while respecting governor limits."
overview: "Learn how to build scalable batch jobs to process millions of records, chain batches, monitor execution, and handle errors effectively."
concepts: ["batch-apex", "database-batchable", "start-method", "execute-method", "finish-method", "batch-size", "stateful", "governor-limits"]
prerequisites: ["collections-deep-dive", "soql-fundamentals", "dml-operations", "exception-handling"]
relatedTopics: ["queueable-apex", "scheduled-apex", "governor-limits"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Batch Apex is one of the most important asynchronous processing patterns in Salesforce. It allows you to process large volumes of data that would otherwise hit governor limits.

## When to Use Batch Apex

**Perfect For:**
- Processing thousands/millions of records
- Data cleanup and maintenance jobs
- Bulk updates across large datasets
- Complex calculations on large record sets
- Data migration and archival

**Key Benefits:**
- Each batch gets fresh governor limits (200 SOQL, 10k DML, etc.)
- Can process up to 50 million records per day
- Runs asynchronously without blocking users
- Built-in scheduling capabilities
- Automatic chunking of records

## The Batch Lifecycle

Every batch job goes through three phases:

1. **Start**: Query records to process (returns QueryLocator or Iterable)
2. **Execute**: Process each batch (called multiple times)
3. **Finish**: Cleanup/final actions (called once)

---

# Code Examples

## Basic Batch Structure

Understanding the fundamental structure is crucial for building any batch job.

```apex
public class AccountBatchExample implements Database.Batchable<SObject> {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // DATABASE.BATCHABLE INTERFACE: Required for all batch classes
    // → Must implement: start(), execute(), finish()
    // → <SObject> is the generic type being processed
    // 💡 WHY? Salesforce uses this interface to control batch execution

    // PHASE 1: START METHOD
    public Database.QueryLocator start(Database.BatchableContext bc) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // START: Runs once at the beginning
        // → Returns records to process via SOQL query
        // → bc parameter provides job info (job ID, etc.)

        return Database.getQueryLocator([
            SELECT Id, Name, AnnualRevenue, Industry
            FROM Account
            WHERE AnnualRevenue = null
            LIMIT 10000
        ]);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // QUERY LOCATOR: Can retrieve up to 50 million records
        // → More efficient than list for large datasets
        // ⚠️ WARNING: LIMIT is optional, use for testing
    }

    // PHASE 2: EXECUTE METHOD
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // EXECUTE: Runs once per batch of records
        // → 'scope' contains current batch (default 200 records)
        // → Gets fresh governor limits each time
        // ✅ BEST PRACTICE: Keep logic here simple and bulkified

        List<Account> accountsToUpdate = new List<Account>();

        for (Account acc : scope) {
            if (acc.Industry == 'Technology') {
                acc.AnnualRevenue = 1000000;
            } else {
                acc.AnnualRevenue = 500000;
            }
            accountsToUpdate.add(acc);
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
            // ^^^^^^^^^^^^^^^^^^^^^^
            // DML IN BATCH: Each batch gets 10,000 DML limit
            // → This batch could process 200 records per execution
        }
    }

    // PHASE 3: FINISH METHOD
    public void finish(Database.BatchableContext bc) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // FINISH: Runs once after all batches complete
        // → Perfect for cleanup, notifications, or chaining
        // → Can send emails, chain another batch, etc.

        System.debug('Batch job completed: ' + bc.getJobId());

        // Send notification email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] {'admin@company.com'});
        email.setSubject('Batch Job Completed');
        email.setPlainTextBody('Account revenue update completed successfully.');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
    }
}

// EXECUTING THE BATCH
// Database.executeBatch(new AccountBatchExample(), 200);
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// EXECUTE BATCH: Starts the batch job
// → First param: Batch instance
// → Second param: Batch size (default 200, max 2000)
// 💡 TIP: Use smaller batches (50-100) if hitting limits
```

## Stateful Batch (Maintaining State)

By default, batches don't maintain state between executions. Use `Database.Stateful` when you need to track data across batches.

```apex
public class AccountAggregationBatch implements Database.Batchable<SObject>, Database.Stateful {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^
    // DATABASE.STATEFUL: Maintains instance variables across batches
    // → Without this, variables reset between execute() calls
    // ⚠️ WARNING: Uses more heap memory

    // Instance variables that persist across batches
    private Integer totalProcessed = 0;
    private Integer totalErrors = 0;
    private List<String> errorMessages = new List<String>();

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE AnnualRevenue != null
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        try {
            // Process accounts
            for (Account acc : scope) {
                acc.AnnualRevenue = acc.AnnualRevenue * 1.1; // 10% increase
            }

            update scope;
            totalProcessed += scope.size();
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // STATEFUL COUNTER: Persists across all execute() calls
            // → Tracks total records processed

        } catch (Exception e) {
            totalErrors++;
            errorMessages.add('Batch error: ' + e.getMessage());
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ERROR TRACKING: Collects errors across all batches
        }
    }

    public void finish(Database.BatchableContext bc) {
        // Access accumulated state
        System.debug('Total processed: ' + totalProcessed);
        System.debug('Total errors: ' + totalErrors);

        if (totalErrors > 0) {
            // Send error report
            String errorReport = String.join(errorMessages, '\n');
            System.debug('Errors:\n' + errorReport);
        }
    }
}
```

## Dynamic Batch with Iterable

Use `Iterable` instead of `QueryLocator` for more complex scenarios or non-SOQL data sources.

```apex
public class CustomIterableBatch implements Database.Batchable<SObject> {

    // Using Iterable instead of QueryLocator
    public Iterable<SObject> start(Database.BatchableContext bc) {
        // ^^^^^^^^^^^^^^^^^^^^
        // ITERABLE: More flexible than QueryLocator
        // → Can process external data, custom logic
        // → Limited to 50,000 records (not 50 million)
        // 💡 WHY USE? When you need custom filtering/processing logic

        List<Account> accounts = [
            SELECT Id, Name, (SELECT Id FROM Contacts)
            FROM Account
        ];

        // Filter accounts with no contacts
        List<Account> accountsWithoutContacts = new List<Account>();
        for (Account acc : accounts) {
            if (acc.Contacts.isEmpty()) {
                accountsWithoutContacts.add(acc);
            }
        }

        return accountsWithoutContacts;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // RETURN LIST: Returns filtered list as Iterable
        // → More control but lower limits than QueryLocator
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // Process the filtered accounts
        delete scope;
        // ^^^^^^^^^^^^
        // CLEANUP: Delete accounts without contacts
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Cleanup completed');
    }
}
```

## Batch Chaining

Chain batches to create complex, multi-step processes.

```apex
public class Step1Batch implements Database.Batchable<SObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Name FROM Account]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // Step 1: Update accounts
        for (Account acc : scope) {
            acc.Description = 'Processed by Step 1';
        }
        update scope;
    }

    public void finish(Database.BatchableContext bc) {
        // Chain to next batch
        Database.executeBatch(new Step2Batch());
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BATCH CHAINING: Start next batch when this finishes
        // → Can chain up to 5 batches in finish()
        // ⚠️ WARNING: Watch out for daily async limits
    }
}

public class Step2Batch implements Database.Batchable<SObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id FROM Account
            WHERE Description = 'Processed by Step 1'
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // Step 2: Create contacts for each account
        List<Contact> contacts = new List<Contact>();
        for (Account acc : scope) {
            contacts.add(new Contact(
                AccountId = acc.Id,
                LastName = 'Auto Generated',
                FirstName = 'Contact'
            ));
        }
        insert contacts;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Multi-step batch process completed');
    }
}
```

## Error Handling in Batches

Proper error handling prevents one bad record from failing the entire batch.

```apex
public class ResilientBatch implements Database.Batchable<SObject>, Database.Stateful {

    private List<String> errors = new List<String>();

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Name, Phone FROM Contact]);
    }

    public void execute(Database.BatchableContext bc, List<Contact> scope) {
        // Use Database methods with allOrNone = false
        List<Database.SaveResult> results = Database.update(scope, false);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ALL OR NONE = FALSE: Allows partial success
        // → Some records can succeed even if others fail
        // ✅ BEST PRACTICE: Always use for batch operations

        // Check results and log errors
        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                String errorMsg = 'Record ' + scope[i].Id + ' failed: ';
                for (Database.Error err : results[i].getErrors()) {
                    errorMsg += err.getMessage() + '; ';
                }
                errors.add(errorMsg);
                // ^^^^^^^^^^^^^^^^^
                // ERROR LOGGING: Track which records failed
                // → Can store in custom object for reporting
            }
        }
    }

    public void finish(Database.BatchableContext bc) {
        if (!errors.isEmpty()) {
            // Log errors to custom object or send email
            System.debug('Batch completed with errors: ' + errors.size());
            for (String error : errors) {
                System.debug(error);
            }
        }
    }
}
```

---

# Common Gotchas

## Gotcha 1: Batch Size Too Large

**Problem:**
```apex
Database.executeBatch(new MyBatch(), 2000);
// Setting batch size to max 2000
```

**Why It's Bad:**
- Larger batches = more likely to hit governor limits
- Harder to debug and retry
- Can cause heap size or CPU timeout issues

**Solution:**
```apex
Database.executeBatch(new MyBatch(), 100);
// Use smaller batch sizes (50-100) for complex logic
// Only use large sizes for simple operations
```

## Gotcha 2: SOQL in Loops

**Problem:**
```apex
public void execute(Database.BatchableContext bc, List<Account> scope) {
    for (Account acc : scope) {
        List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
        // ❌ SOQL IN LOOP: Will hit 200 SOQL limit quickly
    }
}
```

**Solution:**
```apex
public void execute(Database.BatchableContext bc, List<Account> scope) {
    Set<Id> accountIds = new Set<Id>();
    for (Account acc : scope) {
        accountIds.add(acc.Id);
    }

    Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
    for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
        if (!contactsByAccount.containsKey(c.AccountId)) {
            contactsByAccount.put(c.AccountId, new List<Contact>());
        }
        contactsByAccount.get(c.AccountId).add(c);
    }
    // ✅ Single SOQL: Query all contacts at once
}
```

## Gotcha 3: Not Using Database Methods

**Problem:**
```apex
update scope; // If one record fails, entire batch fails
```

**Solution:**
```apex
Database.update(scope, false);
// Allows partial success and provides detailed error info
```

---

# Exam Tips

> 💀 **EXAM TRAP**: Batch Apex can only process up to **50 million records per execution**, not per day. Daily limit is based on Salesforce edition.

> ✅ **BEST PRACTICE**: Default batch size is **200 records**. You can set it between 1-2000, but smaller is often better (50-100).

> 💡 **TIP**: `Database.Stateful` is required to maintain instance variable values across execute() methods. Without it, variables reset.

> ⚠️ **WARNING**: You can chain up to **5 batches** from the finish() method. Beyond that, use Queueable Apex.

> 💡 **TIP**: `QueryLocator` can retrieve up to 50 million records. `Iterable` is limited to 50,000 records retrieved by SOQL.

> ⚠️ **WARNING**: Each org has a limit of **5 concurrent batch jobs**. Additional jobs are queued.

---

# Practice Exercises

## Exercise 1: Basic Batch Job
**Task**: Create a batch class that updates all Opportunities with Stage = 'Prospecting' and updates them to 'Qualification' if they're older than 30 days.

## Exercise 2: Stateful Aggregation
**Task**: Build a batch job that counts how many Contacts each Account has and stores the count in a custom field `Contact_Count__c`. Use Database.Stateful to track total contacts processed.

## Exercise 3: Batch with Error Handling
**Task**: Create a batch that updates Contact phone numbers to a standard format. Use Database.update with allOrNone=false and log any failures to a custom Error_Log__c object.

## Exercise 4: Batch Chaining
**Task**: Build a two-step batch process:
- Step 1: Find all Accounts without Opportunities
- Step 2: Create a default Opportunity for each of those Accounts

## Exercise 5: Scheduled Batch
**Task**: Create a batch job that runs every night at 2 AM to delete all Cases that are closed and older than 1 year.
