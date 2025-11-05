---
title: "Asynchronous Apex Patterns and Best Practices"
category: "apex"
difficulty: "advanced"
readTime: "22 min"
author: "David Martinez"
description: "Master asynchronous Apex patterns including future methods, queueable Apex, batch Apex, and scheduled Apex with practical examples and best practices."
tags: ["async", "future", "queueable", "batch", "scheduled", "governor-limits"]
prerequisites: ["apex-basics", "soql-fundamentals", "bulkification"]
relatedTutorials: ["trigger-bulkification-best-practices", "soql-best-practices"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# Asynchronous Apex Patterns and Best Practices

Asynchronous Apex allows you to run processes in the background, avoiding governor limit issues and improving user experience. This tutorial covers the four main asynchronous patterns and when to use each one.

## Why Asynchronous Apex?

Asynchronous processing provides several benefits:
- **Higher Limits**: More SOQL queries (200), DML statements (150), heap size (12MB)
- **Better UX**: Long-running operations don't block users
- **Callouts**: Make external API calls without blocking
- **Large Data**: Process millions of records with batch Apex

> 💡 **KEY INSIGHT**: Choose the right async pattern for your use case - each has specific strengths and limitations.

---

## Future Methods

The simplest async pattern for fire-and-forget operations.

```apex
public class FutureMethodExamples {

    // ✅ Basic future method
    @future
    public static void processRecordsAsync(Set<Id> recordIds) {
        // ^^^^^^^^^^^
        // @FUTURE ANNOTATION: Marks method as asynchronous
        // → Executes in separate transaction
        // → Must be static and void
        // 💡 USE CASE: Simple background operations

        List<Account> accounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Id IN :recordIds
        ];

        for (Account acc : accounts) {
            acc.Description = 'Processed on ' + DateTime.now();
        }

        update accounts;
        // ^^^^^^^^^^^^^^^
        // HIGHER LIMITS: Async context has increased governor limits
        // → 200 SOQL queries vs 100 in synchronous
        // → 150 DML statements vs 150 in synchronous
    }

    // ✅ Future method with callout
    @future(callout=true)
    public static void makeExternalCallout(String accountId) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // CALLOUT PARAMETER: Enables HTTP callouts
        // → Required for external API calls
        // 💡 LIMITATION: Cannot mix DML and callouts in same transaction

        // Make external API call
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.example.com/accounts/' + accountId);
        req.setMethod('GET');

        Http http = new Http();
        HttpResponse res = http.send(req);
        // ^^^^^^^^^^^^^^^^^^^^
        // EXTERNAL CALLOUT: Communicate with external systems
        // → Timeout: 120 seconds max
        // → Non-blocking: User doesn't wait

        if (res.getStatusCode() == 200) {
            // Process response
            String responseBody = res.getBody();
            System.debug('Response: ' + responseBody);

            // Update Salesforce with response data
            Account acc = [SELECT Id FROM Account WHERE Id = :accountId];
            acc.External_Data__c = responseBody;
            update acc;
        }
    }

    // ❌ LIMITATIONS - Future methods have restrictions
    @future
    public static void demonstrateLimitations(Set<Id> recordIds) {
        // LIMITATION 1: Only primitive parameters
        // → Cannot pass SObjects directly
        // → Must pass Ids and query inside method

        // LIMITATION 2: Cannot call another future method
        // processRecordsAsync(recordIds); // NOT ALLOWED

        // LIMITATION 3: No return values
        // → Fire-and-forget pattern only

        // LIMITATION 4: No chaining
        // → Cannot queue follow-up async work
    }

    // ✅ WORKAROUND - Pass complex data as JSON
    @future
    public static void processWithComplexData(String dataJson) {
        // Deserialize JSON to objects
        Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(dataJson);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^
        // JSON PARAMETER: Workaround for complex data
        // → Serialize before calling, deserialize inside
        // 💡 FLEXIBILITY: Pass complex structures

        String accountName = (String) data.get('name');
        Decimal revenue = (Decimal) data.get('revenue');

        // Process data
        System.debug('Processing: ' + accountName);
    }
}

// CALLING FUTURE METHODS
public class FutureMethodCaller {

    public static void triggerAsyncProcessing() {
        Set<Id> accountIds = new Set<Id>();
        for (Account acc : [SELECT Id FROM Account LIMIT 10]) {
            accountIds.add(acc.Id);
        }

        // Call future method
        FutureMethodExamples.processRecordsAsync(accountIds);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ASYNC EXECUTION: Queued for background processing
        // → Method returns immediately
        // → Actual execution happens later
        // 💡 USER EXPERIENCE: User doesn't wait for completion

        System.debug('Future method queued - continuing execution');
    }

    // ⚠️ ANTI-PATTERN - Future method in loop
    public static void badPattern() {
        for (Account acc : [SELECT Id FROM Account LIMIT 100]) {
            // DON'T DO THIS - one async job per record!
            FutureMethodExamples.processRecordsAsync(new Set<Id>{acc.Id});
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^
        // ANTI-PATTERN: Future method in loop
        // → Creates too many async jobs
        // → Hits daily async limit quickly
        // 💀 EXAM TRAP: Always bulkify future method calls
    }

    // ✅ CORRECT PATTERN - Bulkify the call
    public static void goodPattern() {
        Set<Id> accountIds = new Set<Id>();
        for (Account acc : [SELECT Id FROM Account LIMIT 100]) {
            accountIds.add(acc.Id);
        }

        // Single call with all Ids
        FutureMethodExamples.processRecordsAsync(accountIds);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BULKIFIED: One async job for all records
        // → Efficient use of daily limits
        // ✅ BEST PRACTICE: Always collect and batch
    }
}
```

---

## Queueable Apex

More flexible than future methods with chaining and complex types support.

```apex
public class QueueableExample implements Queueable {
    // ^^^^^^^^^^^^^^^
    // QUEUEABLE INTERFACE: Implement for queueable jobs
    // → More powerful than @future methods
    // 💡 BENEFITS: Can pass SObjects, chain jobs, monitor progress

    private List<Account> accounts;
    private String processingMode;

    // Constructor accepts complex types
    public QueueableExample(List<Account> accounts, String mode) {
        this.accounts = accounts;
        this.processingMode = mode;
        // ^^^^^^^^^^^^^^^^^^^^^^
        // INSTANCE VARIABLES: Can store complex objects
        // → Much more flexible than future methods
        // ✅ NO SERIALIZATION: Pass SObjects directly
    }

    // Required execute method
    public void execute(QueueableContext context) {
        // ^^^^^^^^^^^^^^^^^^^^^^
        // EXECUTE METHOD: Called when job runs
        // → QueueableContext provides job information
        // 💡 MONITORING: Can track job status

        System.debug('Job ID: ' + context.getJobId());

        // Process based on mode
        if (processingMode == 'UPDATE') {
            updateAccounts();
        } else if (processingMode == 'ENRICH') {
            enrichAccountData();
        }

        // Chain another job if needed
        if (shouldChainNextJob()) {
            // Queue follow-up job
            System.enqueueJob(new QueueableExample(accounts, 'ENRICH'));
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // JOB CHAINING: Queue additional work
            // → Can chain up to 50 jobs deep
            // 💡 USE CASE: Multi-step processing pipelines
        }
    }

    private void updateAccounts() {
        for (Account acc : accounts) {
            acc.Last_Processed__c = DateTime.now();
        }
        update accounts;
    }

    private void enrichAccountData() {
        // Simulate data enrichment
        System.debug('Enriching ' + accounts.size() + ' accounts');
    }

    private Boolean shouldChainNextJob() {
        return processingMode == 'UPDATE';
    }
}

// CALLING QUEUEABLE
public class QueueableExampleCaller {

    public static void processAccountsAsync(List<Account> accounts) {
        // Instantiate queueable class
        QueueableExample job = new QueueableExample(accounts, 'UPDATE');

        // Enqueue for execution
        Id jobId = System.enqueueJob(job);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ENQUEUE JOB: Submit for async execution
        // → Returns job Id for monitoring
        // 💡 TRACKING: Can query AsyncApexJob with this Id

        System.debug('Queued job: ' + jobId);
    }
}

// ✅ QUEUEABLE WITH CALLOUTS
public class QueueableCalloutExample implements Queueable, Database.AllowsCallouts {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ALLOWS CALLOUTS: Interface for HTTP callouts
    // → Must implement this interface for callouts
    // 💡 POWERFUL: Can mix DML and callouts (future cannot)

    private List<Id> accountIds;

    public QueueableCalloutExample(List<Id> accountIds) {
        this.accountIds = accountIds;
    }

    public void execute(QueueableContext context) {
        for (Id accId : accountIds) {
            // Make external call
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://api.example.com/accounts/' + accId);
            req.setMethod('GET');

            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                // Update Salesforce record
                Account acc = new Account(Id = accId);
                acc.External_Data__c = res.getBody();
                update acc;
                // ^^^^^^^^^^^
                // DML AFTER CALLOUT: Allowed in queueable
                // → Not allowed in future methods
                // ✅ FLEXIBILITY: Single job can do both
            }
        }
    }
}
```

---

## Batch Apex

Process millions of records in manageable chunks.

```apex
public class AccountBatchProcessor implements Database.Batchable<SObject> {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // BATCHABLE INTERFACE: Required for batch jobs
    // → Database.Batchable<SObject> for SOQL
    // → Database.Batchable<CustomType> for custom iterators

    private String industry;
    private Decimal increasePercentage;

    public AccountBatchProcessor(String industry, Decimal increase) {
        this.industry = industry;
        this.increasePercentage = increase;
    }

    // START METHOD - Define scope
    public Database.QueryLocator start(Database.BatchableContext bc) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // START: Returns records to process
        // → Called once at beginning
        // → Defines entire scope of batch

        System.debug('Batch starting - Job ID: ' + bc.getJobId());

        return Database.getQueryLocator([
            SELECT Id, Name, AnnualRevenue, Industry
            FROM Account
            WHERE Industry = :industry
            AND AnnualRevenue != null
        ]);
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // QUERY LOCATOR: Can process up to 50 million records
        // → More efficient than returning List
        // 💡 MASSIVE SCALE: No query row limit for batch
    }

    // EXECUTE METHOD - Process each batch
    public void execute(Database.BatchableContext bc, List<Account> scope) {
        // ^^^^^^^^^^^^^^^^^^^^
        // EXECUTE: Called once per batch
        // → scope contains records for this batch
        // → Default batch size: 200 records
        // 💡 PROCESSING: This is where your logic goes

        System.debug('Processing batch of ' + scope.size() + ' accounts');

        // Process records in this batch
        for (Account acc : scope) {
            if (acc.AnnualRevenue != null) {
                acc.AnnualRevenue = acc.AnnualRevenue * (1 + increasePercentage);
            }
        }

        // Update this batch
        try {
            update scope;
            // ^^^^^^^^^^^^
            // BATCH DML: Update entire batch at once
            // → Governor limits reset for each batch
            // ✅ BULKIFIED: Still use best practices

        } catch (DmlException e) {
            // Handle errors
            System.debug('Batch update failed: ' + e.getMessage());

            // Log errors but continue processing other batches
            for (Integer i = 0; i < e.getNumDml(); i++) {
                System.debug('Failed record: ' + scope[e.getDmlIndex(i)].Name);
            }
        }
    }

    // FINISH METHOD - Cleanup and follow-up
    public void finish(Database.BatchableContext bc) {
        // ^^^^^^^^^^^^^^^
        // FINISH: Called once after all batches complete
        // → Ideal for cleanup, notifications, chaining
        // 💡 COMPLETION: Perform post-processing here

        // Get job info
        AsyncApexJob job = [
            SELECT Id, Status, NumberOfErrors, JobItemsProcessed,
                   TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()
        ];

        System.debug('Batch complete!');
        System.debug('Total batches: ' + job.TotalJobItems);
        System.debug('Processed batches: ' + job.JobItemsProcessed);
        System.debug('Errors: ' + job.NumberOfErrors);

        // Send completion email
        sendCompletionEmail(job);

        // Chain another job if needed
        if (job.NumberOfErrors == 0) {
            // Start follow-up batch
            Database.executeBatch(new AnotherBatchJob(), 200);
        }
    }

    private void sendCompletionEmail(AsyncApexJob job) {
        // Email logic here
        System.debug('Sending completion email to ' + job.CreatedBy.Email);
    }
}

// INVOKING BATCH JOBS
public class BatchJobInvoker {

    public static void processTechAccounts() {
        // Instantiate batch class
        AccountBatchProcessor batch = new AccountBatchProcessor('Technology', 0.10);

        // Execute with custom batch size
        Id jobId = Database.executeBatch(batch, 100);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // EXECUTE BATCH: Start batch processing
        // → Second parameter: batch size (default 200, max 2000)
        // → Returns job Id for monitoring
        // 💡 BATCH SIZE: Balance between throughput and limits

        System.debug('Batch job queued: ' + jobId);
    }

    // ✅ Monitor batch progress
    public static void checkBatchStatus(Id jobId) {
        AsyncApexJob job = [
            SELECT Id, Status, NumberOfErrors,
                   JobItemsProcessed, TotalJobItems,
                   CreatedDate, CompletedDate
            FROM AsyncApexJob
            WHERE Id = :jobId
        ];

        System.debug('Status: ' + job.Status);
        System.debug('Progress: ' + job.JobItemsProcessed + '/' + job.TotalJobItems);
        System.debug('Errors: ' + job.NumberOfErrors);
        // ^^^^^^^^^^^^^^^^^^^^^^
        // JOB MONITORING: Track batch execution
        // → Status: Queued, Processing, Completed, Failed, Aborted
        // 💡 OPERATIONS: Monitor long-running processes
    }
}

// ✅ STATEFUL BATCH - Maintain state across batches
public class StatefulBatchExample implements Database.Batchable<SObject>, Database.Stateful {
    // ^^^^^^^^^^^^^^^^^^^
    // DATABASE.STATEFUL: Maintains instance variables across batches
    // → Without this, variables reset for each batch
    // 💡 USE CASE: Aggregate calculations across all batches

    private Integer totalProcessed = 0;
    private Decimal totalRevenue = 0;

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE AnnualRevenue != null
        ]);
    }

    public void execute(Database.BatchableContext bc, List<Account> scope) {
        for (Account acc : scope) {
            totalProcessed++;
            totalRevenue += acc.AnnualRevenue;
            // ^^^^^^^^^^^^^^
            // STATE MAINTAINED: Variables persist across batches
            // → Database.Stateful makes this possible
        }

        System.debug('Running total: ' + totalProcessed + ' accounts, $' + totalRevenue);
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Final results:');
        System.debug('Total accounts processed: ' + totalProcessed);
        System.debug('Total revenue: $' + totalRevenue);
        System.debug('Average revenue: $' + (totalRevenue / totalProcessed));
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // FINAL STATE: Access aggregated data
        // → Complete calculations after all batches
    }
}
```

---

## Scheduled Apex

Run code on a recurring schedule.

```apex
public class ScheduledAccountProcessor implements Schedulable {
    // ^^^^^^^^^^^^^^^^^^
    // SCHEDULABLE INTERFACE: Required for scheduled jobs
    // → Executes on defined schedule

    public void execute(SchedulableContext sc) {
        // ^^^^^^^^^^^^^^^^^^^^^^^
        // EXECUTE METHOD: Called when schedule fires
        // → SchedulableContext provides job info

        System.debug('Scheduled job executing: ' + sc.getTriggerId());

        // Perform scheduled operation
        processAccounts();

        // Can invoke other async jobs
        Database.executeBatch(new AccountBatchProcessor('Technology', 0.05), 200);
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // CHAIN TO BATCH: Scheduled job can start batch
        // → Common pattern for large data processing
        // 💡 FLEXIBILITY: Combine async patterns
    }

    private void processAccounts() {
        List<Account> accountsToUpdate = [
            SELECT Id, Last_Processed__c
            FROM Account
            WHERE Last_Processed__c < LAST_N_DAYS:30
            LIMIT 1000
        ];

        for (Account acc : accountsToUpdate) {
            acc.Last_Processed__c = DateTime.now();
        }

        update accountsToUpdate;
    }
}

// SCHEDULING JOBS
public class ScheduledJobManager {

    // ✅ Schedule using Cron expression
    public static void scheduleNightlyJob() {
        ScheduledAccountProcessor scheduledJob = new ScheduledAccountProcessor();

        // Cron expression: "Seconds Minutes Hours Day_of_month Month Day_of_week Year"
        String cronExp = '0 0 2 * * ?'; // Every day at 2 AM
        // ^^^^^^^^^^^^^^^^^^
        // CRON EXPRESSION: Define schedule
        // → 0 0 2 * * ? = 2:00 AM daily
        // 💡 SYNTAX: Similar to Unix cron

        String jobId = System.schedule('Nightly Account Processor', cronExp, scheduledJob);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SYSTEM.SCHEDULE: Register scheduled job
        // → First param: Job name
        // → Second param: Cron expression
        // → Third param: Schedulable instance

        System.debug('Scheduled job ID: ' + jobId);
    }

    // ✅ Common cron expressions
    public static void demonstrateCronPatterns() {
        // Every hour at :00
        String hourly = '0 0 * * * ?';

        // Every day at 3:30 AM
        String daily = '0 30 3 * * ?';

        // Every Monday at 9 AM
        String weekly = '0 0 9 ? * MON';

        // First day of month at midnight
        String monthly = '0 0 0 1 * ?';

        // Every 15 minutes
        String frequent = '0 0,15,30,45 * * * ?';
        // ^^^^^^^^^^^^^^^^^^
        // FLEXIBLE SCHEDULES: Cron supports complex patterns
        // → Can schedule hourly, daily, weekly, monthly, etc.
    }

    // ✅ Abort scheduled job
    public static void abortScheduledJob(Id jobId) {
        System.abortJob(jobId);
        // ^^^^^^^^^^^^^^^^^^^^
        // ABORT JOB: Cancel scheduled job
        // → Stops future executions
        // 💡 MANAGEMENT: Clean up unnecessary jobs
    }

    // ✅ Find and abort all scheduled jobs
    public static void abortAllScheduledJobs() {
        List<CronTrigger> scheduledJobs = [
            SELECT Id, CronJobDetail.Name
            FROM CronTrigger
            WHERE CronJobDetail.Name LIKE 'Account%'
        ];

        for (CronTrigger ct : scheduledJobs) {
            System.abortJob(ct.Id);
            System.debug('Aborted: ' + ct.CronJobDetail.Name);
        }
    }
}
```

---

## Choosing the Right Async Pattern

```apex
// DECISION MATRIX

// ✅ Use FUTURE when:
// - Simple fire-and-forget operation
// - Making callouts without DML
// - Minimal parameters (primitives only)
// Example: Sending confirmation email, external API call

// ✅ Use QUEUEABLE when:
// - Need to pass complex objects
// - Want job chaining capability
// - Need job monitoring
// - Mix DML and callouts
// Example: Multi-step enrichment pipeline

// ✅ Use BATCH when:
// - Processing large datasets (thousands to millions)
// - Need governor limit resets
// - Long-running operations
// - Can process in chunks
// Example: Data cleanup, mass updates, migrations

// ✅ Use SCHEDULED when:
// - Recurring operations
// - Time-based triggers
// - Regular maintenance tasks
// Example: Nightly cleanup, weekly reports, monthly processing
```

---

## Best Practices and Patterns

```apex
public class AsyncBestPractices {

    // ✅ PATTERN: Bulkify async calls
    public static void bulkifyAsyncCalls(List<Account> accounts) {
        Set<Id> accountIds = new Set<Id>();
        for (Account acc : accounts) {
            accountIds.add(acc.Id);
        }

        // Single async call for all records
        FutureMethodExamples.processRecordsAsync(accountIds);
    }

    // ✅ PATTERN: Error handling in async
    @future
    public static void asyncWithErrorHandling(Set<Id> recordIds) {
        try {
            // Risky operation
            List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :recordIds];
            update accounts;

        } catch (Exception e) {
            // Log error
            System.debug('Async error: ' + e.getMessage());

            // Create error record for tracking
            Error_Log__c log = new Error_Log__c(
                Error_Message__c = e.getMessage(),
                Stack_Trace__c = e.getStackTraceString()
            );
            insert log;
        }
    }

    // ✅ PATTERN: Testing async methods
    @isTest
    static void testAsyncMethod() {
        // Setup test data
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 10; i++) {
            testAccounts.add(new Account(Name = 'Test ' + i));
        }
        insert testAccounts;

        Set<Id> accountIds = new Map<Id, Account>(testAccounts).keySet();

        Test.startTest();
        // ^^^^^^^^^^^^^^^^
        // TEST.STARTTEST: Async jobs execute synchronously in test
        // → Async methods complete before Test.stopTest()
        FutureMethodExamples.processRecordsAsync(accountIds);
        Test.stopTest();
        // ^^^^^^^^^^^^^^^^

        // Verify results
        List<Account> updated = [
            SELECT Id, Description
            FROM Account
            WHERE Id IN :accountIds
        ];

        for (Account acc : updated) {
            System.assertNotEquals(null, acc.Description, 'Should be processed');
        }
    }
}
```

---

## Common Gotchas

💀 **Async Limits:**
- Maximum 250,000 async executions per 24 hours
- Maximum 5 synchronous batch jobs at once
- Maximum 100 batch jobs in queue
- Maximum 100 scheduled jobs

⚠️ **Testing Considerations:**
- Async methods run synchronously in tests
- Must use Test.startTest()/stopTest() for async
- Each test has async execution limit

💡 **Performance Tips:**
- Batch size impacts performance and limits
- Chain jobs carefully to avoid hitting limits
- Monitor job queues in production
- Use stateful batches sparingly

---

## Summary

Master these four async patterns:

1. **Future**: Simple background operations
2. **Queueable**: Flexible jobs with chaining
3. **Batch**: Process millions of records
4. **Scheduled**: Recurring operations

Choose the right pattern for your use case, always bulkify, handle errors gracefully, and monitor execution in production!
