---
title: "Queueable Apex"
section: "apex"
order: 12
difficulty: "intermediate"
readTime: "20 min"
description: "Master Queueable Apex for flexible asynchronous processing with the ability to chain jobs and return values."
overview: "Learn how to use Queueable Apex for async operations, job chaining, complex processing, and when to choose it over Future methods or Batch Apex."
concepts: ["queueable", "system-queueable", "async-apex", "job-chaining", "queueable-context", "async-limits"]
prerequisites: ["object-oriented-programming", "exception-handling", "collections-deep-dive"]
relatedTopics: ["batch-apex", "future-methods", "triggers-and-frameworks"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Queueable Apex is the modern way to run asynchronous operations in Salesforce. It combines the best features of Future methods and Batch Apex while adding more flexibility.

## Why Use Queueable Apex?

**Advantages Over Future Methods:**
- Can work with complex data types (sObjects, custom classes)
- Can chain jobs (start another Queueable from a Queueable)
- Returns a job ID for monitoring
- Better error handling and debugging
- Can be tested more easily

**Advantages Over Batch Apex:**
- Simpler for single async operations
- Lower overhead and faster execution
- Can process sObjects directly
- Better for transactional operations
- More flexible job chaining

**Perfect For:**
- Callouts to external services
- Processing after trigger operations
- Long-running calculations
- Chained async operations
- Working with large objects

## Key Differences from Future Methods

| Feature | Future | Queueable |
|---------|--------|-----------|
| Complex Types | ❌ No | ✅ Yes |
| Job Monitoring | ❌ No | ✅ Yes (returns ID) |
| Job Chaining | ❌ No | ✅ Yes |
| Testing | Limited | Full support |
| Parameters | Primitives only | Objects, sObjects, classes |

---

# Code Examples

## Basic Queueable Structure

Every Queueable class implements the `System.Queueable` interface with a single `execute` method.

```apex
public class AccountUpdateQueueable implements System.Queueable {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // SYSTEM.QUEUEABLE INTERFACE: Required for all queueable classes
    // → Must implement execute(QueueableContext) method
    // 💡 WHY? Salesforce uses this interface to manage async execution

    private List<Account> accountsToUpdate;

    // Constructor to pass data
    public AccountUpdateQueueable(List<Account> accounts) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CONSTRUCTOR: Accept complex types directly
        // → Can pass sObjects, custom classes, collections
        // ✅ ADVANTAGE: No need to serialize/deserialize like Future methods
        this.accountsToUpdate = accounts;
    }

    // The execute method that runs asynchronously
    public void execute(QueueableContext context) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // EXECUTE METHOD: Runs when job is processed from queue
        // → context parameter provides job ID and other metadata
        // → Gets full async governor limits

        System.debug('Job ID: ' + context.getJobId());

        for (Account acc : accountsToUpdate) {
            acc.Description = 'Updated via Queueable at ' + System.now();
        }

        update accountsToUpdate;
        // ^^^^^^^^^^^^^^^^^^^^
        // ASYNC DML: Gets 10,000 DML limit
        // → Runs in separate transaction from caller
    }
}

// ENQUEUING THE JOB
// ID jobId = System.enqueueJob(new AccountUpdateQueueable(accounts));
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ENQUEUE JOB: Adds job to async queue
// → Returns job ID immediately
// → Job executes when queue is ready
// 💡 TIP: Store jobId to monitor job progress
```

## Job Chaining

One of Queueable's killer features is the ability to chain jobs together.

```apex
public class Step1Queueable implements System.Queueable {

    private Set<Id> accountIds;

    public Step1Queueable(Set<Id> accIds) {
        this.accountIds = accIds;
    }

    public void execute(QueueableContext context) {
        // Step 1: Update accounts
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];

        for (Account acc : accounts) {
            acc.Rating = 'Hot';
        }
        update accounts;

        // Chain to next job
        System.enqueueJob(new Step2Queueable(accountIds));
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // JOB CHAINING: Start another Queueable from execute()
        // → Can chain up to 50 jobs from a single transaction
        // → Each job gets fresh governor limits
        // ✅ BEST PRACTICE: Use for multi-step async processes
    }
}

public class Step2Queueable implements System.Queueable {

    private Set<Id> accountIds;

    public Step2Queueable(Set<Id> accIds) {
        this.accountIds = accIds;
    }

    public void execute(QueueableContext context) {
        // Step 2: Create tasks for updated accounts
        List<Task> tasks = new List<Task>();

        for (Id accId : accountIds) {
            tasks.add(new Task(
                WhatId = accId,
                Subject = 'Follow up on hot account',
                Status = 'Not Started',
                Priority = 'High'
            ));
        }

        insert tasks;

        System.debug('Multi-step process completed');
        // No more chaining - process complete
    }
}

// USAGE IN TRIGGER OR CONTROLLER
// System.enqueueJob(new Step1Queueable(accountIds));
```

## Working with Complex Types

Unlike Future methods, Queueables can work with sObjects and custom classes directly.

```apex
// Custom wrapper class
public class OpportunityData {
    public Id oppId;
    public Decimal amount;
    public String stageName;
    public List<String> productNames;

    public OpportunityData(Id id, Decimal amt, String stage, List<String> products) {
        this.oppId = id;
        this.amount = amt;
        this.stageName = stage;
        this.productNames = products;
    }
}

public class ComplexDataQueueable implements System.Queueable {

    private List<OpportunityData> oppData;
    private Map<String, Decimal> discountMap;

    public ComplexDataQueueable(List<OpportunityData> data, Map<String, Decimal> discounts) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COMPLEX PARAMETERS: Accept custom classes, collections, maps
        // → This is NOT possible with Future methods
        // ✅ ADVANTAGE: No need for JSON serialization workarounds
        this.oppData = data;
        this.discountMap = discounts;
    }

    public void execute(QueueableContext context) {
        List<Opportunity> oppsToUpdate = new List<Opportunity>();

        for (OpportunityData data : oppData) {
            Decimal discount = 0;

            // Calculate discount based on products
            for (String productName : data.productNames) {
                if (discountMap.containsKey(productName)) {
                    discount += discountMap.get(productName);
                }
            }

            oppsToUpdate.add(new Opportunity(
                Id = data.oppId,
                Amount = data.amount * (1 - discount),
                Description = 'Discount applied: ' + (discount * 100) + '%'
            ));
        }

        update oppsToUpdate;
    }
}

// USAGE
// List<OpportunityData> data = buildOpportunityData();
// Map<String, Decimal> discounts = new Map<String, Decimal>{
//     'Product A' => 0.10,
//     'Product B' => 0.15
// };
// System.enqueueJob(new ComplexDataQueueable(data, discounts));
```

## HTTP Callouts in Queueable

Queueable is perfect for making HTTP callouts since they can't be done in triggers.

```apex
public class ExternalApiCallout implements System.Queueable, System.Callable {
    // ^^^^^^^^^^^^^^^^^^^^
    // SYSTEM.CALLABLE: Optional interface for testing
    // → Makes it easier to mock callouts in tests

    private List<Account> accountsToSync;
    private String endpoint;

    public ExternalApiCallout(List<Account> accounts, String apiEndpoint) {
        this.accountsToSync = accounts;
        this.endpoint = apiEndpoint;
    }

    public void execute(QueueableContext context) {
        // Make callout for each account
        for (Account acc : accountsToSync) {
            try {
                syncAccountToExternalSystem(acc);
            } catch (Exception e) {
                // Log error but continue processing
                System.debug('Failed to sync account ' + acc.Id + ': ' + e.getMessage());
                // ⚠️ BEST PRACTICE: Don't let one failure stop all processing
            }
        }
    }

    private void syncAccountToExternalSystem(Account acc) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        // Build JSON payload
        String jsonBody = JSON.serialize(new Map<String, Object>{
            'name' => acc.Name,
            'salesforce_id' => acc.Id,
            'industry' => acc.Industry
        });
        req.setBody(jsonBody);

        Http http = new Http();
        HttpResponse res = http.send(req);
        // ^^^^^^^^^^^^^^^^^^
        // CALLOUT: Allowed in Queueable context
        // → Not allowed in triggers or synchronous Apex
        // → Gets 100 callout limit

        if (res.getStatusCode() == 200) {
            System.debug('Successfully synced: ' + acc.Name);
        } else {
            throw new CalloutException('Failed with status: ' + res.getStatusCode());
        }
    }

    public Object call(String action, Map<String, Object> args) {
        // Callable interface for testing
        return null;
    }
}

// USAGE FROM TRIGGER
// trigger AccountTrigger on Account (after insert, after update) {
//     if (Trigger.isAfter) {
//         System.enqueueJob(new ExternalApiCallout(
//             Trigger.new,
//             'https://api.external-system.com/accounts'
//         ));
//     }
// }
```

## Error Handling and Monitoring

Proper error handling ensures your async jobs are resilient.

```apex
public class ResilientQueueable implements System.Queueable {

    private List<Contact> contactsToProcess;
    private Integer retryCount;

    public ResilientQueueable(List<Contact> contacts) {
        this(contacts, 0);
    }

    public ResilientQueueable(List<Contact> contacts, Integer retries) {
        this.contactsToProcess = contacts;
        this.retryCount = retries;
    }

    public void execute(QueueableContext context) {
        try {
            // Attempt processing
            processContacts();

        } catch (Exception e) {
            // Log the error
            System.debug('Queueable failed: ' + e.getMessage());
            System.debug('Stack trace: ' + e.getStackTraceString());

            // Retry logic (max 3 attempts)
            if (retryCount < 3) {
                System.debug('Retrying... Attempt: ' + (retryCount + 1));
                System.enqueueJob(new ResilientQueueable(contactsToProcess, retryCount + 1));
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // RETRY PATTERN: Re-queue with incremented retry counter
                // → Useful for transient errors (network issues, locks)
            } else {
                // Max retries reached - log to custom object
                createErrorLog(e, context.getJobId());
            }
        }
    }

    private void processContacts() {
        // Business logic here
        for (Contact c : contactsToProcess) {
            c.Description = 'Processed at ' + System.now();
        }
        update contactsToProcess;
    }

    private void createErrorLog(Exception e, Id jobId) {
        // Log error to custom Error_Log__c object
        Error_Log__c log = new Error_Log__c(
            Job_Id__c = String.valueOf(jobId),
            Error_Message__c = e.getMessage(),
            Stack_Trace__c = e.getStackTraceString(),
            Retry_Count__c = retryCount
        );
        insert log;
    }
}

// MONITORING JOB STATUS
// ID jobId = System.enqueueJob(new ResilientQueueable(contacts));
//
// // Query job status
// AsyncApexJob job = [
//     SELECT Id, Status, NumberOfErrors, JobItemsProcessed,
//            TotalJobItems, CreatedDate, CompletedDate
//     FROM AsyncApexJob
//     WHERE Id = :jobId
// ];
//
// System.debug('Status: ' + job.Status);
// System.debug('Errors: ' + job.NumberOfErrors);
```

## Conditional Chaining Pattern

Chain different jobs based on processing results.

```apex
public class ConditionalChainQueueable implements System.Queueable {

    private List<Opportunity> opportunities;

    public ConditionalChainQueueable(List<Opportunity> opps) {
        this.opportunities = opps;
    }

    public void execute(QueueableContext context) {
        // Process opportunities
        List<Id> closedWonIds = new List<Id>();
        List<Id> closedLostIds = new List<Id>();

        for (Opportunity opp : opportunities) {
            if (opp.StageName == 'Closed Won') {
                closedWonIds.add(opp.Id);
            } else if (opp.StageName == 'Closed Lost') {
                closedLostIds.add(opp.Id);
            }
        }

        // Chain different jobs based on results
        if (!closedWonIds.isEmpty()) {
            System.enqueueJob(new CreateInvoicesQueueable(closedWonIds));
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // CONDITIONAL CHAIN: Different job for won opportunities
        }

        if (!closedLostIds.isEmpty()) {
            System.enqueueJob(new CreateFollowUpTasksQueueable(closedLostIds));
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // CONDITIONAL CHAIN: Different job for lost opportunities
        }
    }
}

public class CreateInvoicesQueueable implements System.Queueable {
    private List<Id> opportunityIds;

    public CreateInvoicesQueueable(List<Id> oppIds) {
        this.opportunityIds = oppIds;
    }

    public void execute(QueueableContext context) {
        // Create invoices for won opportunities
        List<Invoice__c> invoices = new List<Invoice__c>();
        for (Id oppId : opportunityIds) {
            invoices.add(new Invoice__c(
                Opportunity__c = oppId,
                Status__c = 'Draft'
            ));
        }
        insert invoices;
    }
}

public class CreateFollowUpTasksQueueable implements System.Queueable {
    private List<Id> opportunityIds;

    public CreateFollowUpTasksQueueable(List<Id> oppIds) {
        this.opportunityIds = oppIds;
    }

    public void execute(QueueableContext context) {
        // Create follow-up tasks for lost opportunities
        List<Task> tasks = new List<Task>();
        for (Id oppId : opportunityIds) {
            tasks.add(new Task(
                WhatId = oppId,
                Subject = 'Follow up on lost opportunity',
                Priority = 'Normal'
            ));
        }
        insert tasks;
    }
}
```

---

# Common Gotchas

## Gotcha 1: Testing Without Test.stopTest()

**Problem:**
```apex
@isTest
static void testQueueable() {
    List<Account> accounts = new List<Account>{new Account(Name='Test')};
    insert accounts;

    System.enqueueJob(new AccountUpdateQueueable(accounts));
    // ❌ Job won't execute in test without Test.stopTest()

    Account result = [SELECT Description FROM Account WHERE Id = :accounts[0].Id];
    System.assertEquals('Updated...', result.Description); // Will fail
}
```

**Solution:**
```apex
@isTest
static void testQueueable() {
    List<Account> accounts = new List<Account>{new Account(Name='Test')};
    insert accounts;

    Test.startTest();
    System.enqueueJob(new AccountUpdateQueueable(accounts));
    Test.stopTest();
    // ✅ Test.stopTest() forces immediate execution of async jobs

    Account result = [SELECT Description FROM Account WHERE Id = :accounts[0].Id];
    System.assertNotEquals(null, result.Description);
}
```

## Gotcha 2: Chaining from Trigger Context

**Problem:**
```apex
// In trigger
for (Integer i = 0; i < 50; i++) {
    System.enqueueJob(new MyQueueable());
    // ❌ Can only enqueue 1 job from trigger context
}
```

**Solution:**
```apex
// In trigger - enqueue once
if (!hasEnqueued) {
    System.enqueueJob(new MyQueueable(Trigger.new));
    hasEnqueued = true;
}

// In Queueable - chain up to 50 times
public void execute(QueueableContext context) {
    // Process
    if (needsMoreProcessing) {
        System.enqueueJob(new MyQueueable(remainingRecords));
        // ✅ Can chain up to 50 times from Queueable context
    }
}
```

## Gotcha 3: Not Handling Exceptions

**Problem:**
```apex
public void execute(QueueableContext context) {
    update accountsToUpdate; // If this fails, job just dies
}
```

**Solution:**
```apex
public void execute(QueueableContext context) {
    try {
        update accountsToUpdate;
    } catch (Exception e) {
        // Log error, send notification, or retry
        System.debug('Error: ' + e.getMessage());
        createErrorLog(e);
    }
}
```

---

# Exam Tips

> 💡 **TIP**: You can enqueue **1 Queueable job** from a trigger. From within a Queueable, you can chain **up to 50 jobs**.

> ✅ **BEST PRACTICE**: Queueable is preferred over Future methods for new development because it supports complex types and job monitoring.

> 💀 **EXAM TRAP**: Queueables must implement `System.Queueable` interface, not `Database.Queueable`.

> ⚠️ **WARNING**: Each Queueable execution counts against your daily async limit (250,000 per org).

> 💡 **TIP**: `System.enqueueJob()` returns an AsyncApexJob ID that you can use to monitor job status.

> ✅ **BEST PRACTICE**: Use Queueable for single async operations, Batch for processing large datasets (1000s of records).

---

# Practice Exercises

## Exercise 1: Basic Queueable
**Task**: Create a Queueable class that takes a list of Case IDs and updates their Priority to 'High' if they've been open for more than 3 days.

## Exercise 2: Callout Integration
**Task**: Build a Queueable that makes an HTTP callout to send Order data to an external fulfillment system. Include error handling for failed callouts.

## Exercise 3: Job Chaining
**Task**: Create a 3-step Queueable chain:
1. Find all Accounts with >10 Opportunities
2. Mark those Accounts as 'Strategic'
3. Send an email notification to the Account owners

## Exercise 4: Complex Types
**Task**: Build a Queueable that accepts a custom class containing Opportunity data and related Product information, then creates OpportunityLineItems based on that data.

## Exercise 5: Conditional Chaining
**Task**: Create a Queueable that processes Leads. If they're converted, chain to a "Welcome Email" job. If not converted, chain to a "Follow-up Task" job.
