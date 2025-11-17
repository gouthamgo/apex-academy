---
title: "Medium-Level Developer Interview Questions"
description: "Intermediate Salesforce developer interview questions covering advanced Apex, triggers, asynchronous processing, governor limits, LWC, and real-world development scenarios"
section: "interview"
difficulty: "intermediate"
readTime: "45 min"
order: 9
overview: "Advance your Salesforce development career with 13+ intermediate-level questions covering bulkification, trigger patterns, governor limits, asynchronous Apex, SOQL optimization, LWC lifecycle, and testing best practices. Perfect for developers with 1-3 years of experience."
concepts: ["Bulkification", "Trigger Frameworks", "Governor Limits", "Asynchronous Apex", "Batch Apex", "Queueable Apex", "SOQL Optimization", "LWC Lifecycle Hooks", "Component Communication", "Testing Strategies"]
prerequisites: ["apex-interview-questions", "lwc-interview-questions"]
relatedTopics: ["integration-interview-questions", "scenario-based-challenges"]
lastUpdated: "2025-11-16"
examWeight: "high"
---

# Medium-Level Developer Interview Questions

Advance your Salesforce development career with these intermediate-level questions. Perfect for developers with 1-3 years of experience preparing for mid-level positions in 2025.

## Advanced Apex Concepts

### 1. Explain the importance of bulkification in Apex and how to achieve it.

**Answer:**
Bulkification is the practice of writing Apex code to efficiently handle multiple records simultaneously, respecting Salesforce governor limits.

**Why It's Critical:**
- Triggers can receive up to 200 records per transaction
- Batch jobs process records in bulk
- Integration scenarios often involve large datasets
- Non-bulkified code hits governor limits quickly

**Bad Practice (Non-Bulkified):**
```apex
trigger AccountTrigger on Account (after insert) {
    for (Account acc : Trigger.new) {
        // ❌ SOQL in loop - hits limit at 100 records
        List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];

        // ❌ DML in loop - hits limit at 150 records
        Contact c = new Contact(LastName = acc.Name, AccountId = acc.Id);
        insert c;
    }
}
```

**Good Practice (Bulkified):**
```apex
trigger AccountTrigger on Account (after insert) {
    Set<Id> accountIds = new Set<Id>();
    List<Contact> contactsToInsert = new List<Contact>();

    // Collect all IDs
    for (Account acc : Trigger.new) {
        accountIds.add(acc.Id);
    }

    // ✅ Single SOQL query outside loop
    Map<Id, List<Contact>> existingContacts = new Map<Id, List<Contact>>();
    for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
        if (!existingContacts.containsKey(c.AccountId)) {
            existingContacts.put(c.AccountId, new List<Contact>());
        }
        existingContacts.get(c.AccountId).add(c);
    }

    // Prepare records for DML
    for (Account acc : Trigger.new) {
        contactsToInsert.add(new Contact(LastName = acc.Name, AccountId = acc.Id));
    }

    // ✅ Single DML operation outside loop
    if (!contactsToInsert.isEmpty()) {
        insert contactsToInsert;
    }
}
```

**Key Principles:**
1. **No SOQL/DML in loops** - Query/manipulate all records at once
2. **Use collections** - Sets, Lists, Maps to aggregate data
3. **Batch operations** - Process records in groups
4. **Lazy loading** - Only query what you need

---

### 2. How do you prevent recursive triggers?

**Answer:**
Recursive triggers occur when a trigger's actions cause the same trigger to fire again, creating an infinite loop.

**Problem Scenario:**
```apex
trigger AccountTrigger on Account (after update) {
    for (Account acc : Trigger.new) {
        acc.Description = 'Updated';
        update acc; // ❌ Fires trigger again → infinite loop
    }
}
```

**Solution 1: Static Boolean Flag (Most Common)**
```apex
// Utility class
public class TriggerHandler {
    public static Boolean isFirstRun = true;
}

// Trigger
trigger AccountTrigger on Account (after update) {
    if (TriggerHandler.isFirstRun) {
        TriggerHandler.isFirstRun = false;

        for (Account acc : Trigger.new) {
            acc.Description = 'Updated';
        }
        update Trigger.new;
    }
}
```

**Solution 2: Set of Processed IDs**
```apex
public class TriggerHandler {
    public static Set<Id> processedAccountIds = new Set<Id>();
}

trigger AccountTrigger on Account (after update) {
    List<Account> accountsToProcess = new List<Account>();

    for (Account acc : Trigger.new) {
        if (!TriggerHandler.processedAccountIds.contains(acc.Id)) {
            accountsToProcess.add(acc);
            TriggerHandler.processedAccountIds.add(acc.Id);
        }
    }

    // Process only unprocessed accounts
    if (!accountsToProcess.isEmpty()) {
        // Your logic here
    }
}
```

**Solution 3: Check Old vs New Values**
```apex
trigger AccountTrigger on Account (after update) {
    List<Account> accountsToUpdate = new List<Account>();

    for (Account acc : Trigger.new) {
        Account oldAcc = Trigger.oldMap.get(acc.Id);

        // Only update if field hasn't been set yet
        if (acc.Description != 'Updated' && oldAcc.Description != 'Updated') {
            acc.Description = 'Updated';
            accountsToUpdate.add(acc);
        }
    }

    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate;
    }
}
```

**Best Practice:**
Use a trigger framework like `TriggerHandler` class to centralize recursion control.

---

### 3. What is the difference between Database.insert() and insert statement?

**Answer:**

| Aspect | insert (DML) | Database.insert() |
|--------|--------------|-------------------|
| **Partial Success** | ❌ All or nothing | ✅ Allows partial success |
| **Error Handling** | Exception thrown | Returns Database.SaveResult[] |
| **Rollback** | Entire transaction | Only failed records |
| **Use Case** | All records must succeed | Some failures acceptable |
| **allOrNone Parameter** | N/A | Optional (default true) |

**Example:**

**DML Statement:**
```apex
List<Account> accounts = new List<Account>{
    new Account(Name = 'Valid Account'),
    new Account() // ❌ Missing required Name
};

try {
    insert accounts; // Exception thrown, NO records inserted
} catch (DmlException e) {
    System.debug('Error: ' + e.getMessage());
}
// Result: 0 records inserted
```

**Database Method:**
```apex
List<Account> accounts = new List<Account>{
    new Account(Name = 'Valid Account'),
    new Account() // ❌ Missing required Name
};

Database.SaveResult[] results = Database.insert(accounts, false); // allOrNone = false

for (Integer i = 0; i < results.size(); i++) {
    if (results[i].isSuccess()) {
        System.debug('Record ' + i + ' inserted: ' + results[i].getId());
    } else {
        for (Database.Error err : results[i].getErrors()) {
            System.debug('Error on record ' + i + ': ' + err.getMessage());
        }
    }
}
// Result: 1 record inserted (the valid one)
```

**When to Use Database Methods:**
- Importing data from external systems
- Batch processing where some failures are expected
- When you need detailed error handling
- Integration scenarios

**When to Use DML Statements:**
- All records must succeed
- Simpler code with try-catch
- Critical business operations

---

### 4. Explain the order of execution in Salesforce.

**Answer:**
Understanding the order of execution is critical for debugging and designing triggers, validation rules, and workflows.

**Complete Order:**

1. **Load Original Record** (or initialize for new record)
2. **Load New Values** from UI or API
3. **System Validation Rules** (required fields, field types)
4. **Execute Before Triggers**
5. **Custom Validation Rules**
6. **Duplicate Rules**
7. **Save Record** (but don't commit)
8. **Execute After Triggers**
9. **Assignment Rules**
10. **Auto-Response Rules**
11. **Workflow Rules**
    - Field Updates (immediate)
12. **If field updated by workflow**, repeat steps 4-11
13. **Execute Processes** (Process Builder)
14. **Execute Escalation Rules**
15. **Execute Entitlement Rules**
16. **Execute Flows** (Record-Triggered Flows - After Save)
17. **Execute Parent Rollup Summary Fields**
18. **Execute Criteria-Based Sharing**
19. **Commit to Database**
20. **Execute Post-Commit Logic**
    - Email alerts
    - Outbound messages
    - Time-dependent workflow actions scheduled

**Real-World Scenario:**

You create an Opportunity with validation rule:
```
Order of Execution:
1. Load new Opportunity record
2. Set Amount = 50000, CloseDate = Today
3. Check required fields (Name, Stage, CloseDate)
4. BEFORE trigger: Set Discount__c = 0.1
5. Validation Rule: Amount > 100000? → FAIL, stop execution
→ User sees error, record not saved
```

If validation passes:
```
6. Duplicate Rules check
7. Save to database (temporary)
8. AFTER trigger: Create related Task
9. Workflow: If Amount > 10000, send email alert
10. Process Builder: Update Account.Last_Opportunity_Date__c
11. Commit to database
12. Send workflow email alert
```

**Why This Matters:**
- **Before Triggers**: Can modify field values before save
- **After Triggers**: Record already saved (can't modify Trigger.new)
- **Validation Rules**: Run after Before Triggers (can validate trigger-modified values)
- **Workflows**: Can cause re-evaluation if they update fields

---

## Governor Limits Deep Dive

### 5. What are the key governor limits you must know as a developer?

**Answer:**
As of 2025, Salesforce enforces strict governor limits per transaction to ensure multi-tenant platform stability.

**Critical Limits:**

| Resource | Synchronous Limit | Asynchronous Limit |
|----------|-------------------|-------------------|
| **Total SOQL queries** | 100 | 200 |
| **Total records retrieved by SOQL** | 50,000 | 50,000 |
| **Total DML statements** | 150 | 150 |
| **Total records processed by DML** | 10,000 | 10,000 |
| **Total heap size** | 6 MB | 12 MB |
| **CPU time** | 10 seconds | 60 seconds |
| **Total callouts** | 100 | 100 |
| **Callout timeout** | 120 seconds | 120 seconds |
| **SOSL queries** | 20 | 20 |

**How to Check Limits in Code:**
```apex
System.debug('SOQL Queries: ' + Limits.getQueries() + ' / ' + Limits.getLimitQueries());
System.debug('DML Statements: ' + Limits.getDmlStatements() + ' / ' + Limits.getLimitDmlStatements());
System.debug('CPU Time: ' + Limits.getCpuTime() + ' / ' + Limits.getLimitCpuTime());
System.debug('Heap Size: ' + Limits.getHeapSize() + ' / ' + Limits.getLimitHeapSize());
```

**Common Scenarios:**

**Scenario 1: SOQL in Loop (Bad)**
```apex
for (Account acc : [SELECT Id FROM Account LIMIT 200]) {
    // ❌ Each iteration = 1 SOQL query
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
} // 200 SOQL queries → LIMIT EXCEEDED
```

**Scenario 2: Bulkified (Good)**
```apex
Set<Id> accountIds = new Set<Id>();
for (Account acc : [SELECT Id FROM Account LIMIT 200]) {
    accountIds.add(acc.Id);
}
// ✅ Single SOQL query for all accounts
Map<Id, Contact[]> contactsByAccount = new Map<Id, Contact[]>();
for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    // Process...
} // 1 SOQL query total
```

**Avoiding Heap Size Limit:**
```apex
// ❌ Bad - Loads all 50,000 records into memory
List<Account> allAccounts = [SELECT Id, Name, Description, ... FROM Account];
// Heap size exceeded!

// ✅ Good - Process in batches
for (List<Account> accounts : [SELECT Id, Name FROM Account]) {
    // Processes 200 records at a time
    // Heap cleared after each iteration
}
```

---

### 6. How would you handle a scenario where you need to process more than 50,000 records?

**Answer:**
Use **Batch Apex** to process large datasets beyond governor limits.

**Batch Apex Implementation:**

```apex
global class AccountBatchProcessor implements Database.Batchable<SObject> {

    // Step 1: Query records (can return up to 50 million records)
    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT Id, Name, Annual_Revenue__c FROM Account WHERE CreatedDate = THIS_YEAR'
        );
    }

    // Step 2: Process batches (default 200 records per batch)
    global void execute(Database.BatchableContext bc, List<Account> scope) {
        List<Account> accountsToUpdate = new List<Account>();

        for (Account acc : scope) {
            if (acc.Annual_Revenue__c > 1000000) {
                acc.Rating = 'Hot';
                accountsToUpdate.add(acc);
            }
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }

    // Step 3: Finish - cleanup or post-processing
    global void finish(Database.BatchableContext bc) {
        // Send completion email
        AsyncApexJob job = [
            SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()
        ];

        System.debug('Job completed: ' + job.Status);
        System.debug('Processed: ' + job.TotalJobItems + ' batches');
    }
}
```

**Execute Batch:**
```apex
// Process in batches of 200 (default)
AccountBatchProcessor batch = new AccountBatchProcessor();
Id jobId = Database.executeBatch(batch);

// Or specify batch size (max 2000)
Id jobId2 = Database.executeBatch(batch, 1000);
```

**Monitor Batch Job:**
```apex
AsyncApexJob job = [
    SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems, CreatedDate
    FROM AsyncApexJob
    WHERE Id = :jobId
];
System.debug('Status: ' + job.Status); // Queued, Processing, Completed, Failed
```

**Alternative: Queueable Apex for Chaining**
```apex
public class AccountProcessor implements Queueable {
    private List<Id> accountIds;
    private Integer startIndex;

    public AccountProcessor(List<Id> ids, Integer start) {
        this.accountIds = ids;
        this.startIndex = start;
    }

    public void execute(QueueableContext context) {
        Integer endIndex = Math.min(startIndex + 200, accountIds.size());
        List<Id> batchIds = new List<Id>();

        for (Integer i = startIndex; i < endIndex; i++) {
            batchIds.add(accountIds[i]);
        }

        // Process current batch
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :batchIds];
        update accounts;

        // Chain next batch if more records exist
        if (endIndex < accountIds.size()) {
            System.enqueueJob(new AccountProcessor(accountIds, endIndex));
        }
    }
}
```

**When to Use What:**

| Scenario | Solution |
|----------|----------|
| 50,000+ records, scheduled | Batch Apex |
| Complex chaining logic | Queueable |
| Future processing needed | @future |
| Scheduled jobs | Schedulable |

---

## Asynchronous Apex

### 7. Compare and contrast @future, Queueable, and Batch Apex.

**Answer:**

| Feature | @future | Queueable | Batch Apex |
|---------|---------|-----------|------------|
| **Syntax** | Method annotation | Implements interface | Implements interface |
| **Return Type** | void only | Can return job ID | N/A |
| **Parameters** | Primitives, collections of primitives | sObjects, complex types | Database.QueryLocator or Iterable |
| **Chaining** | ❌ No | ✅ Yes (50 max) | ✅ Yes (5 max) |
| **Monitoring** | Limited | ✅ Full (ApexJob) | ✅ Full (AsyncApexJob) |
| **Max Records** | Standard limits | Standard limits | 50 million |
| **Use Case** | Simple callouts | Complex async logic | Bulk processing |

**@future Example:**
```apex
public class CalloutUtility {
    @future(callout=true)
    public static void makeCallout(String endpoint) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');

        Http http = new Http();
        HttpResponse res = http.send(req);

        System.debug('Response: ' + res.getBody());
    }
}

// Call from trigger
CalloutUtility.makeCallout('https://api.example.com/data');
```

**Limitations:**
- Cannot call one @future from another
- No way to monitor job progress
- Cannot pass sObjects

**Queueable Example:**
```apex
public class AccountIntegration implements Queueable, Database.AllowsCallouts {
    private List<Account> accounts;

    public AccountIntegration(List<Account> accs) {
        this.accounts = accs;
    }

    public void execute(QueueableContext context) {
        for (Account acc : accounts) {
            // Make callout
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://api.example.com/account/' + acc.Id);
            req.setMethod('POST');
            req.setBody(JSON.serialize(acc));

            Http http = new Http();
            HttpResponse res = http.send(req);
        }

        // Chain another job if needed
        if (/* more work */) {
            System.enqueueJob(new AnotherQueueableJob());
        }
    }
}

// Execute
System.enqueueJob(new AccountIntegration(accountsList));
```

**When to Use:**
- **@future**: Simple, fire-and-forget async operations
- **Queueable**: Need to chain jobs, pass complex objects, monitor progress
- **Batch Apex**: Process millions of records, scheduled jobs

---

### 8. What is the difference between Synchronous and Asynchronous Apex?

**Answer:**

| Aspect | Synchronous | Asynchronous |
|--------|-------------|--------------|
| **Execution** | Immediate | Queued, executes later |
| **User Wait** | User waits for completion | User continues working |
| **Governor Limits** | Stricter (10s CPU, 6MB heap) | Relaxed (60s CPU, 12MB heap) |
| **Use Cases** | Immediate updates, validation | Callouts, bulk processing |
| **Examples** | Triggers, VF controllers | @future, Batch, Queueable |

**Synchronous Example:**
```apex
// Runs immediately when user saves record
trigger OpportunityTrigger on Opportunity (before update) {
    for (Opportunity opp : Trigger.new) {
        if (opp.Amount > 100000) {
            opp.Approval_Required__c = true;
        }
    }
}
```

**Asynchronous Example:**
```apex
// Queued for later execution
trigger OpportunityTrigger on Opportunity (after insert) {
    Set<Id> oppIds = new Set<Id>();
    for (Opportunity opp : Trigger.new) {
        oppIds.add(opp.Id);
    }

    // Callout must be async (cannot make callouts from triggers directly)
    ExternalSystemIntegration.syncOpportunities(oppIds);
}

public class ExternalSystemIntegration {
    @future(callout=true)
    public static void syncOpportunities(Set<Id> oppIds) {
        List<Opportunity> opps = [SELECT Id, Name, Amount FROM Opportunity WHERE Id IN :oppIds];
        // Make HTTP callout
    }
}
```

**Why Asynchronous:**
1. **Callouts**: Cannot make HTTP callouts in synchronous context (triggers, VF controllers)
2. **Long-running processes**: Avoid timeout errors
3. **Better UX**: User doesn't wait for background processing
4. **Higher limits**: More CPU time and heap size

---

## Advanced SOQL

### 9. How do you optimize SOQL queries for performance?

**Answer:**
Query optimization is critical for maintaining application performance and avoiding governor limits.

**1. Use Selective Queries (Indexed Fields)**

**Automatically Indexed Fields:**
- Id
- Name
- OwnerId
- CreatedDate
- SystemModStamp
- RecordType
- Master-Detail fields
- Lookup fields
- External ID fields
- Unique fields

**Good:**
```apex
// Uses indexed field (Id)
List<Account> accounts = [
    SELECT Id, Name
    FROM Account
    WHERE Id = :accountId
];
```

**Bad:**
```apex
// Non-indexed field scan (slow for large data)
List<Account> accounts = [
    SELECT Id, Name
    FROM Account
    WHERE Description LIKE '%keyword%'
];
```

**2. Limit Result Sets**
```apex
// ✅ Good - Limit results
List<Account> accounts = [
    SELECT Id, Name
    FROM Account
    WHERE Industry = 'Technology'
    LIMIT 1000
];

// ❌ Bad - Could return 50,000 records
List<Account> accounts = [
    SELECT Id, Name, Description, BillingAddress, (SELECT Id FROM Contacts), (SELECT Id FROM Opportunities)
    FROM Account
];
```

**3. Use Query Locators for Large Datasets**
```apex
// For batch processing
for (List<Account> accounts : [SELECT Id, Name FROM Account WHERE CreatedDate = THIS_YEAR]) {
    // Processes 200 at a time
    // Doesn't count against 50,000 record limit
}
```

**4. Avoid Query Inside Loops**
```apex
// ❌ Bad
for (Account acc : accountsList) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// ✅ Good
Set<Id> accountIds = new Set<Id>();
for (Account acc : accountsList) {
    accountIds.add(acc.Id);
}
Map<Id, Contact[]> contactsByAccount = new Map<Id, Contact[]>();
for (Contact c : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    if (!contactsByAccount.containsKey(c.AccountId)) {
        contactsByAccount.put(c.AccountId, new List<Contact>());
    }
    contactsByAccount.get(c.AccountId).add(c);
}
```

**5. Query Only Required Fields**
```apex
// ❌ Bad - Retrieves all fields (heap size!)
List<Account> accounts = [SELECT FIELDS(ALL) FROM Account];

// ✅ Good - Only what you need
List<Account> accounts = [SELECT Id, Name, Industry FROM Account];
```

**6. Use Parent-Child Subqueries Wisely**
```apex
// ✅ Good - Single query with subquery
List<Account> accounts = [
    SELECT Id, Name, (SELECT Id, Name FROM Contacts)
    FROM Account
    WHERE Id IN :accountIds
];

// ❌ Bad - Two separate queries
List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
List<Contact> contacts = [SELECT Id, Name, AccountId FROM Contact WHERE AccountId IN :accountIds];
```

---

### 10. What is the difference between SOQL and SOSL?

**Answer:**

| Feature | SOQL | SOSL |
|---------|------|------|
| **Full Form** | Salesforce Object Query Language | Salesforce Object Search Language |
| **Purpose** | Query single object or related objects | Search across multiple objects |
| **Syntax** | SELECT...FROM...WHERE | FIND...IN...RETURNING |
| **Use Case** | Structured queries | Text search, search bars |
| **Performance** | Faster for specific queries | Optimized for text search |
| **Index Usage** | Database indexes | Search index |
| **Records** | Returns sObjects | Returns List<List<SObject>> |
| **Governor Limit** | 100 queries/transaction | 20 queries/transaction |

**SOQL Example:**
```apex
// Find all contacts at specific account
List<Contact> contacts = [
    SELECT Id, Name, Email
    FROM Contact
    WHERE AccountId = :accountId
    AND Email != null
    ORDER BY Name
    LIMIT 100
];
```

**SOSL Example:**
```apex
// Search for "John Smith" across multiple objects
List<List<SObject>> searchResults = [
    FIND 'John Smith'
    IN ALL FIELDS
    RETURNING Account(Id, Name), Contact(Id, Name, Email), Lead(Id, Name, Email)
];

List<Account> accounts = searchResults[0];
List<Contact> contacts = searchResults[1];
List<Lead> leads = searchResults[2];
```

**When to Use:**

**Use SOQL when:**
- Querying specific object
- Complex filtering needed
- Related records via relationships
- Exact match queries

**Use SOSL when:**
- Building global search
- Don't know which object contains data
- Text-based search
- Searching across multiple objects

**Real Scenario:**
```apex
// User types "Acme" in search bar → SOSL
List<List<SObject>> results = [
    FIND 'Acme*'
    IN NAME FIELDS
    RETURNING Account(Id, Name), Opportunity(Id, Name), Contact(FirstName, LastName)
];

// User selects specific Account → SOQL
Account acc = [
    SELECT Id, Name, Industry, (SELECT Id, Name FROM Contacts)
    FROM Account
    WHERE Id = :selectedAccountId
];
```

---

## Lightning Web Components (LWC)

### 11. Explain the LWC lifecycle hooks and when each is called.

**Answer:**

**Lifecycle Hooks (in order):**

**1. constructor()**
- **When**: Component instance created
- **Use**: Initialize properties, event listeners
- **Cannot**: Access DOM, access public properties
- **Must**: Call super()

```javascript
constructor() {
    super();
    this.internalProperty = 'initialized';
    console.log('Constructor called');
}
```

**2. connectedCallback()**
- **When**: Component inserted into DOM
- **Use**: Fetch data, subscribe to events, access public properties
- **Can**: Access DOM
- **Called**: Once (unless component removed and re-added)

```javascript
connectedCallback() {
    this.loadData();
    this.addEventListener('scroll', this.handleScroll);
    console.log('Component connected to DOM');
}
```

**3. renderedCallback()**
- **When**: After every render
- **Use**: DOM manipulation, third-party library initialization
- **Caution**: Avoid infinite loops (don't update reactive properties without checks)
- **Called**: Multiple times

```javascript
renderedCallback() {
    if (!this.chartInitialized) {
        this.initializeChart();
        this.chartInitialized = true; // Prevent re-initialization
    }
}
```

**4. disconnectedCallback()**
- **When**: Component removed from DOM
- **Use**: Cleanup, unsubscribe, remove listeners
- **Important**: Prevent memory leaks

```javascript
disconnectedCallback() {
    this.removeEventListener('scroll', this.handleScroll);
    unsubscribe(this.subscription);
    console.log('Component removed from DOM');
}
```

**5. errorCallback(error, stack)**
- **When**: Descendant component throws error
- **Use**: Error boundary, logging
- **Captures**: Errors in lifecycle hooks and event handlers

```javascript
errorCallback(error, stack) {
    console.error('Error occurred:', error);
    console.error('Stack:', stack);
    this.showErrorMessage = true;
}
```

**Complete Example:**
```javascript
import { LightningElement } from 'lwc';

export default class LifecycleDemo extends LightningElement {
    chartInitialized = false;

    constructor() {
        super();
        console.log('1. Constructor');
    }

    connectedCallback() {
        console.log('2. Connected to DOM');
        this.fetchData();
    }

    renderedCallback() {
        console.log('3. Rendered (called every render)');
        if (!this.chartInitialized) {
            this.initChart();
            this.chartInitialized = true;
        }
    }

    disconnectedCallback() {
        console.log('4. Disconnected from DOM');
        this.cleanup();
    }

    errorCallback(error, stack) {
        console.log('5. Error occurred');
    }
}
```

---

### 12. How do you communicate between LWC components?

**Answer:**

**1. Parent to Child (Public Properties)**

**Child Component:**
```javascript
// childComponent.js
import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {
    @api messageFromParent;
    @api recordId;
}
```

**Parent Component:**
```html
<!-- parentComponent.html -->
<template>
    <c-child-component
        message-from-parent={parentMessage}
        record-id={accountId}>
    </c-child-component>
</template>
```

**2. Child to Parent (Custom Events)**

**Child Component:**
```javascript
// childComponent.js
handleClick() {
    const event = new CustomEvent('itemselected', {
        detail: { itemId: this.selectedItemId }
    });
    this.dispatchEvent(event);
}
```

**Parent Component:**
```html
<!-- parentComponent.html -->
<c-child-component onitemselected={handleItemSelection}></c-child-component>
```

```javascript
// parentComponent.js
handleItemSelection(event) {
    const itemId = event.detail.itemId;
    console.log('Selected item:', itemId);
}
```

**3. Sibling to Sibling (via Parent)**

**Child 1 → fires event → Parent → passes to Child 2**

**4. Pub-Sub Pattern (Same DOM Tree)**

**Publisher:**
```javascript
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

@wire(CurrentPageReference) pageRef;

handlePublish() {
    fireEvent(this.pageRef, 'dataupdated', { recordId: this.recordId });
}
```

**Subscriber:**
```javascript
import { registerListener, unregisterAllListeners } from 'c/pubsub';

connectedCallback() {
    registerListener('dataupdated', this.handleDataUpdate, this);
}

disconnectedCallback() {
    unregisterAllListeners(this);
}

handleDataUpdate(event) {
    console.log('Received:', event.recordId);
}
```

**5. Lightning Message Service (LMS) - Across DOM Trees**

**Message Channel (messageChannel.messageChannel-meta.xml):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningMessageChannel xmlns="http://soap.sforce.com/2006/04/metadata">
    <masterLabel>Record Selected Channel</masterLabel>
    <isExposed>true</isExposed>
    <description>Message channel for record selection</description>
    <lightningMessageFields>
        <fieldName>recordId</fieldName>
        <description>Record Id</description>
    </lightningMessageFields>
</LightningMessageChannel>
```

**Publisher:**
```javascript
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/RecordSelectedChannel__c';
import { wire } from 'lwc';

@wire(MessageContext) messageContext;

handleRecordSelect() {
    const message = { recordId: this.selectedRecordId };
    publish(this.messageContext, RECORD_SELECTED_CHANNEL, message);
}
```

**Subscriber:**
```javascript
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED_CHANNEL from '@salesforce/messageChannel/RecordSelectedChannel__c';

@wire(MessageContext) messageContext;

connectedCallback() {
    this.subscription = subscribe(
        this.messageContext,
        RECORD_SELECTED_CHANNEL,
        (message) => this.handleMessage(message)
    );
}

handleMessage(message) {
    this.recordId = message.recordId;
}

disconnectedCallback() {
    unsubscribe(this.subscription);
}
```

**When to Use:**
- **@api**: Parent → Child
- **Custom Events**: Child → Parent
- **Pub-Sub**: Same page, related components
- **LMS**: Across different pages, unrelated components

---

## Testing Best Practices

### 13. How do you achieve good test coverage in Apex?

**Answer:**
Salesforce requires 75% code coverage for production deployment. Good tests go beyond coverage to ensure quality.

**Best Practices:**

**1. Test Positive and Negative Scenarios**
```apex
@isTest
private class AccountTriggerTest {

    @isTest
    static void testAccountCreation_Success() {
        // Positive test
        Account acc = new Account(Name = 'Test Account', Industry = 'Technology');

        Test.startTest();
        insert acc;
        Test.stopTest();

        Account inserted = [SELECT Id, Name, Rating FROM Account WHERE Id = :acc.Id];
        System.assertEquals('Hot', inserted.Rating, 'Rating should be Hot for Technology industry');
    }

    @isTest
    static void testAccountCreation_MissingName() {
        // Negative test
        Account acc = new Account(Industry = 'Technology'); // Missing required Name

        Test.startTest();
        try {
            insert acc;
            System.assert(false, 'Expected DmlException');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('Name'), 'Error should mention Name field');
        }
        Test.stopTest();
    }
}
```

**2. Test Bulk Operations (200+ records)**
```apex
@isTest
static void testBulkAccountInsert() {
    List<Account> accounts = new List<Account>();

    for (Integer i = 0; i < 200; i++) {
        accounts.add(new Account(
            Name = 'Bulk Test ' + i,
            Industry = 'Technology'
        ));
    }

    Test.startTest();
    insert accounts;
    Test.stopTest();

    List<Account> inserted = [SELECT Id, Rating FROM Account WHERE Name LIKE 'Bulk Test%'];
    System.assertEquals(200, inserted.size());

    for (Account acc : inserted) {
        System.assertEquals('Hot', acc.Rating);
    }
}
```

**3. Use @testSetup for Test Data**
```apex
@isTest
private class OpportunityServiceTest {

    @testSetup
    static void setupTestData() {
        // Runs once before all test methods
        Account acc = new Account(Name = 'Test Account');
        insert acc;

        List<Opportunity> opps = new List<Opportunity>();
        for (Integer i = 0; i < 10; i++) {
            opps.add(new Opportunity(
                Name = 'Test Opp ' + i,
                AccountId = acc.Id,
                StageName = 'Prospecting',
                CloseDate = Date.today().addDays(30)
            ));
        }
        insert opps;
    }

    @isTest
    static void testOpportunityUpdate() {
        // Test data already exists from @testSetup
        List<Opportunity> opps = [SELECT Id FROM Opportunity];
        System.assertEquals(10, opps.size());
    }
}
```

**4. Test with Different User Contexts**
```apex
@isTest
static void testAsStandardUser() {
    User standardUser = [SELECT Id FROM User WHERE Profile.Name = 'Standard User' LIMIT 1];

    System.runAs(standardUser) {
        Account acc = new Account(Name = 'Test');
        insert acc; // Tests with standard user permissions
    }
}
```

**5. Mock Callouts with Test Classes**
```apex
@isTest
global class MockHttpResponse implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"status":"success"}');
        res.setStatusCode(200);
        return res;
    }
}

@isTest
static void testCallout() {
    Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

    Test.startTest();
    String response = ExternalService.makeCallout();
    Test.stopTest();

    System.assert(response.contains('success'));
}
```

**6. Use Asserts Effectively**
```apex
// ✅ Good - Clear message
System.assertEquals(5, opps.size(), 'Should have exactly 5 opportunities');

// ❌ Bad - No message
System.assertEquals(5, opps.size());

// ✅ Good - Descriptive
System.assert(acc.Rating == 'Hot', 'Rating should be Hot for Technology accounts');
```

**Coverage != Quality:**
- Test business logic, not just coverage
- Test edge cases
- Test with realistic data volumes
- Test security/sharing rules
- Test error handling

---

## Interview Preparation Tips

### Key Areas to Focus On

**1. Real-World Scenarios:**
- Be prepared to solve problems on a whiteboard
- Explain your thought process
- Consider governor limits in solutions

**2. Code Review:**
- Explain what's wrong with code snippets
- Suggest improvements
- Identify anti-patterns

**3. Design Patterns:**
- Trigger frameworks
- Service layer pattern
- Selector pattern
- Factory pattern

**4. Recent Updates:**
- Stay current with Salesforce releases (2025 updates)
- Know about new features (Permission Set Groups, Flow improvements)
- Einstein AI capabilities

**5. Soft Skills:**
- Explain technical concepts to non-technical people
- Collaborate with team members
- Handle tight deadlines

### Common Mistakes to Avoid

❌ **Don't:**
- Jump into code without understanding requirements
- Ignore governor limits in solutions
- Over-complicate simple problems
- Say "I don't know" without trying
- Criticize Salesforce platform

✅ **Do:**
- Ask clarifying questions
- Think aloud while solving
- Consider scalability and maintainability
- Mention trade-offs in your solution
- Show enthusiasm for learning

---

## Next Steps

To advance to senior-level positions:
1. Master "Advanced-Level Architecture Questions"
2. Study "Integration Interview Questions" for API expertise
3. Practice "Scenario-Based Challenges" for coding skills
4. Build complex real-world projects
5. Contribute to open-source Salesforce projects
6. Pursue Platform Developer II certification

Good luck with your interview! 🚀
