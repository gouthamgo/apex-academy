---
title: "Scenario-Based Coding Challenges"
section: "interview"
order: 7
difficulty: "advanced"
readTime: "40 min"
description: "Practice real-world Salesforce coding challenges. Includes problems, solutions, and explanations for interview preparation."
overview: "Hands-on coding challenges for Salesforce interviews. Covers common scenarios like data manipulation, trigger optimization, bulk processing, and integration problems with detailed solutions."
concepts: ["Coding Challenges", "Problem Solving", "Algorithms", "Data Structures", "Optimization", "Bulkification"]
prerequisites: ["apex-interview-questions", "lwc-interview-questions"]
relatedTopics: ["system-design-questions"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Scenario-Based Coding Challenges

Practice solving real Salesforce development problems.

## How to Approach Coding Challenges

### Interview Format

**Typical Structure:**
- 30-45 minutes
- 1-3 problems
- Whiteboard or live coding
- Can ask clarifying questions

**What They're Evaluating:**
- Problem-solving approach
- Code quality (clean, readable)
- Handling of edge cases
- Knowledge of best practices
- Communication

---

### Problem-Solving Framework

**1. Clarify (2 min)**
- Understand requirements
- Ask about edge cases
- Confirm inputs/outputs
- Discuss constraints

**2. Plan (3 min)**
- Explain your approach
- Discuss trade-offs
- Outline solution

**3. Code (15-20 min)**
- Write clean code
- Think out loud
- Handle edge cases

**4. Test (5 min)**
- Walk through with examples
- Check edge cases
- Discuss improvements

---

## Challenge 1: Duplicate Detection

### Problem

Write a method that finds duplicate Accounts by Name and returns them grouped by name.

**Requirements:**
- Input: None (query all Accounts)
- Output: Map<String, List<Account>> where key is the duplicated name
- Only include names that have duplicates (2+ accounts)
- Case-insensitive comparison

**Example:**
```
Accounts in DB:
- Id: 001, Name: "ACME Corp"
- Id: 002, Name: "Acme Corp"
- Id: 003, Name: "Widget Inc"
- Id: 004, Name: "Tech Solutions"
- Id: 005, Name: "Tech Solutions"

Expected Output:
{
    "acme corp" => [Account{Id:001}, Account{Id:002}],
    "tech solutions" => [Account{Id:004}, Account{Id:005}]
}
```

---

### Solution

```apex
public class DuplicateDetector {
    public static Map<String, List<Account>> findDuplicateAccounts() {
        // Step 1: Query all accounts
        List<Account> allAccounts = [SELECT Id, Name
                                      FROM Account
                                      WHERE Name != null];

        // Step 2: Group by lowercase name
        Map<String, List<Account>> accountsByName = new Map<String, List<Account>>();

        for (Account acc : allAccounts) {
            String normalizedName = acc.Name.toLowerCase().trim();

            if (!accountsByName.containsKey(normalizedName)) {
                accountsByName.put(normalizedName, new List<Account>());
            }
            accountsByName.get(normalizedName).add(acc);
        }

        // Step 3: Filter only duplicates (2+ accounts)
        Map<String, List<Account>> duplicates = new Map<String, List<Account>>();

        for (String name : accountsByName.keySet()) {
            if (accountsByName.get(name).size() > 1) {
                duplicates.put(name, accountsByName.get(name));
            }
        }

        return duplicates;
    }
}
```

**Key Points:**
- Normalize names (lowercase, trim)
- Single SOQL query (avoid query in loop)
- Filter null names
- O(n) time complexity

---

### Follow-Up Questions

**Q: "How would you handle very large datasets (1M+ accounts)?"**

**A:** Use Batch Apex or Aggregate SOQL:

```apex
// Aggregate approach - finds duplicates efficiently
List<AggregateResult> duplicates = [
    SELECT Name, COUNT(Id) cnt
    FROM Account
    WHERE Name != null
    GROUP BY Name
    HAVING COUNT(Id) > 1
];

for (AggregateResult ar : duplicates) {
    String dupeName = (String)ar.get('Name');
    // Query accounts with this name
}
```

---

## Challenge 2: Trigger Optimization

### Problem

Given this poorly performing trigger, identify issues and refactor it.

**Problematic Code:**
```apex
trigger OpportunityTrigger on Opportunity (after insert, after update) {
    for (Opportunity opp : Trigger.new) {
        if (opp.StageName == 'Closed Won') {
            Account acc = [SELECT Id, Total_Revenue__c
                          FROM Account
                          WHERE Id = :opp.AccountId];

            acc.Total_Revenue__c = 0;

            List<Opportunity> allOpps = [SELECT Amount
                                         FROM Opportunity
                                         WHERE AccountId = :acc.Id
                                         AND StageName = 'Closed Won'];

            for (Opportunity o : allOpps) {
                acc.Total_Revenue__c += o.Amount;
            }

            update acc;
        }
    }
}
```

**Issues:**
- SOQL queries in loop (governor limit violation)
- DML in loop (governor limit violation)
- Recalculates for EVERY won opportunity (inefficient)
- No null checks
- No bulk handling

---

### Solution

```apex
// Trigger
trigger OpportunityTrigger on Opportunity (after insert, after update) {
    OpportunityTriggerHandler.updateAccountRevenue(Trigger.new, Trigger.oldMap);
}

// Handler Class
public class OpportunityTriggerHandler {
    public static void updateAccountRevenue(
        List<Opportunity> newOpps,
        Map<Id, Opportunity> oldMap
    ) {
        // Step 1: Find opportunities that became Closed Won
        Set<Id> accountIds = new Set<Id>();

        for (Opportunity opp : newOpps) {
            // Check if this is a new Closed Won or stage changed to Closed Won
            Opportunity oldOpp = oldMap != null ? oldMap.get(opp.Id) : null;
            Boolean isNewClosedWon = (oldOpp == null && opp.StageName == 'Closed Won');
            Boolean justClosedWon = (oldOpp != null &&
                                     opp.StageName == 'Closed Won' &&
                                     oldOpp.StageName != 'Closed Won');

            if (opp.AccountId != null && (isNewClosedWon || justClosedWon)) {
                accountIds.add(opp.AccountId);
            }
        }

        if (accountIds.isEmpty()) {
            return;
        }

        // Step 2: Query all won opportunities for these accounts
        Map<Id, Decimal> revenueByAccount = new Map<Id, Decimal>();

        for (AggregateResult ar : [
            SELECT AccountId, SUM(Amount) totalRevenue
            FROM Opportunity
            WHERE AccountId IN :accountIds
            AND StageName = 'Closed Won'
            AND Amount != null
            GROUP BY AccountId
        ]) {
            Id accId = (Id)ar.get('AccountId');
            Decimal total = (Decimal)ar.get('totalRevenue');
            revenueByAccount.put(accId, total);
        }

        // Step 3: Update accounts (single DML)
        List<Account> accountsToUpdate = new List<Account>();

        for (Id accId : revenueByAccount.keySet()) {
            accountsToUpdate.add(new Account(
                Id = accId,
                Total_Revenue__c = revenueByAccount.get(accId)
            ));
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
}
```

**Improvements:**
- ✅ Queries outside loop
- ✅ Single DML operation
- ✅ Uses aggregate SOQL for efficiency
- ✅ Only processes changed opportunities
- ✅ Bulkified (handles 200 records)
- ✅ Null checks

---

## Challenge 3: Recursive Hierarchy

### Problem

Write a method to find all child accounts in a hierarchy (any depth).

**Requirements:**
- Input: Parent Account Id
- Output: List of all descendant Account Ids
- Handle unlimited depth
- Avoid infinite loops

**Data Structure:**
```
Account A (Id: 001)
├── Account B (Id: 002, ParentId: 001)
│   └── Account D (Id: 004, ParentId: 002)
├── Account C (Id: 003, ParentId: 001)
    └── Account E (Id: 005, ParentId: 003)

Input: 001
Output: [002, 003, 004, 005]
```

---

### Solution

```apex
public class AccountHierarchyFinder {

    public static List<Id> getAllDescendants(Id parentAccountId) {
        Set<Id> allDescendants = new Set<Id>();
        Set<Id> currentLevelIds = new Set<Id>{ parentAccountId };

        // Prevent infinite loops
        Integer maxDepth = 10;
        Integer currentDepth = 0;

        while (!currentLevelIds.isEmpty() && currentDepth < maxDepth) {
            // Query children of current level
            List<Account> children = [
                SELECT Id
                FROM Account
                WHERE ParentId IN :currentLevelIds
            ];

            // Prepare next level
            currentLevelIds = new Set<Id>();

            for (Account child : children) {
                if (!allDescendants.contains(child.Id)) {
                    allDescendants.add(child.Id);
                    currentLevelIds.add(child.Id);
                }
            }

            currentDepth++;
        }

        return new List<Id>(allDescendants);
    }
}
```

**Alternative: Using Recursive Query (if depth is limited):**

```apex
public static List<Id> getAllDescendantsRecursive(Id parentAccountId) {
    Set<Id> descendants = new Set<Id>();
    collectDescendants(parentAccountId, descendants);
    return new List<Id>(descendants);
}

private static void collectDescendants(Id parentId, Set<Id> descendants) {
    List<Account> children = [
        SELECT Id
        FROM Account
        WHERE ParentId = :parentId
    ];

    for (Account child : children) {
        if (!descendants.contains(child.Id)) {
            descendants.add(child.Id);
            collectDescendants(child.Id, descendants);
        }
    }
}
```

**Trade-Offs:**
- **Iterative**: Better for deep hierarchies, avoids stack overflow
- **Recursive**: Cleaner code, but limited by stack depth

---

## Challenge 4: Batch Processing

### Problem

Write a Batch Apex class to archive old opportunities (closed > 1 year) to a custom object.

**Requirements:**
- Move opportunities closed > 1 year ago
- Copy to Archive_Opportunity__c object
- Delete original after successful archive
- Handle errors gracefully
- Process 200 records per batch

---

### Solution

```apex
public class OpportunityArchiveBatch implements Database.Batchable<sObject>, Database.Stateful {

    // Track statistics across batches
    public Integer successCount = 0;
    public Integer errorCount = 0;
    public List<String> errorMessages = new List<String>();

    // Step 1: Query old opportunities
    public Database.QueryLocator start(Database.BatchableContext bc) {
        Date oneYearAgo = Date.today().addYears(-1);

        return Database.getQueryLocator([
            SELECT Id, Name, AccountId, Amount, StageName, CloseDate, CreatedDate
            FROM Opportunity
            WHERE IsClosed = true
            AND CloseDate < :oneYearAgo
        ]);
    }

    // Step 2: Process each batch
    public void execute(Database.BatchableContext bc, List<Opportunity> scope) {
        List<Archive_Opportunity__c> archives = new List<Archive_Opportunity__c>();
        List<Opportunity> oppsToDelete = new List<Opportunity>();

        // Create archive records
        for (Opportunity opp : scope) {
            archives.add(new Archive_Opportunity__c(
                Original_Id__c = opp.Id,
                Name = opp.Name,
                Account__c = opp.AccountId,
                Amount__c = opp.Amount,
                Stage__c = opp.StageName,
                Close_Date__c = opp.CloseDate,
                Original_Created_Date__c = opp.CreatedDate
            ));
        }

        // Insert archives
        Database.SaveResult[] insertResults = Database.insert(archives, false);

        // Check which succeeded
        for (Integer i = 0; i < insertResults.size(); i++) {
            if (insertResults[i].isSuccess()) {
                oppsToDelete.add(scope[i]);
                successCount++;
            } else {
                errorCount++;
                String errors = '';
                for (Database.Error err : insertResults[i].getErrors()) {
                    errors += err.getMessage() + '; ';
                }
                errorMessages.add('Opp ' + scope[i].Id + ': ' + errors);
            }
        }

        // Delete successfully archived opportunities
        if (!oppsToDelete.isEmpty()) {
            Database.DeleteResult[] deleteResults = Database.delete(oppsToDelete, false);

            for (Integer i = 0; i < deleteResults.size(); i++) {
                if (!deleteResults[i].isSuccess()) {
                    errorCount++;
                    String errors = '';
                    for (Database.Error err : deleteResults[i].getErrors()) {
                        errors += err.getMessage() + '; ';
                    }
                    errorMessages.add('Delete failed for ' + oppsToDelete[i].Id + ': ' + errors);
                }
            }
        }
    }

    // Step 3: Send completion email
    public void finish(Database.BatchableContext bc) {
        // Get batch job info
        AsyncApexJob job = [
            SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()
        ];

        // Send email to admin
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[]{'admin@company.com'});
        email.setSubject('Opportunity Archive Batch Completed');

        String body = 'Batch Job Completed\n\n';
        body += 'Status: ' + job.Status + '\n';
        body += 'Batches Processed: ' + job.JobItemsProcessed + '\n';
        body += 'Successfully Archived: ' + successCount + '\n';
        body += 'Errors: ' + errorCount + '\n';

        if (!errorMessages.isEmpty()) {
            body += '\nError Details:\n' + String.join(errorMessages, '\n');
        }

        email.setPlainTextBody(body);

        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
    }
}

// Execute batch
Database.executeBatch(new OpportunityArchiveBatch(), 200);
```

**Key Features:**
- ✅ Stateful (tracks stats across batches)
- ✅ Error handling with Database.insert/delete (allOrNone=false)
- ✅ Completion email
- ✅ Detailed error logging

---

## Challenge 5: REST API Integration

### Problem

Create an Apex class to fetch weather data from an external API and update Account records.

**Requirements:**
- Use Named Credential
- Handle HTTP errors
- Update Account.Weather_Status__c field
- Make it bulkified (accept multiple Account Ids)

**API Endpoint:**
```
GET https://api.weather.com/current?zip={zipcode}

Response:
{
    "temperature": 72,
    "condition": "Sunny",
    "humidity": 45
}
```

---

### Solution

```apex
public class WeatherService {

    // Synchronous version (for single account)
    public static void updateWeather(Id accountId) {
        Account acc = [SELECT Id, BillingPostalCode FROM Account WHERE Id = :accountId];

        if (String.isBlank(acc.BillingPostalCode)) {
            throw new WeatherException('No zip code on account');
        }

        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Weather_API/current?zip=' + acc.BillingPostalCode);
        req.setMethod('GET');
        req.setTimeout(10000); // 10 seconds

        try {
            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                Map<String, Object> weatherData = (Map<String, Object>)
                    JSON.deserializeUntyped(res.getBody());

                acc.Weather_Status__c = (String)weatherData.get('condition');
                acc.Temperature__c = (Decimal)weatherData.get('temperature');
                update acc;

            } else if (res.getStatusCode() == 404) {
                throw new WeatherException('Zip code not found');
            } else {
                throw new WeatherException('API Error: ' + res.getStatus());
            }

        } catch (Exception e) {
            System.debug('Weather API Error: ' + e.getMessage());
            throw new WeatherException('Failed to fetch weather: ' + e.getMessage());
        }
    }

    // Async version (for multiple accounts)
    @future(callout=true)
    public static void updateWeatherAsync(Set<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id, BillingPostalCode
            FROM Account
            WHERE Id IN :accountIds
            AND BillingPostalCode != null
        ];

        List<Account> accountsToUpdate = new List<Account>();

        for (Account acc : accounts) {
            try {
                HttpRequest req = new HttpRequest();
                req.setEndpoint('callout:Weather_API/current?zip=' + acc.BillingPostalCode);
                req.setMethod('GET');
                req.setTimeout(10000);

                HttpResponse res = new Http().send(req);

                if (res.getStatusCode() == 200) {
                    Map<String, Object> data = (Map<String, Object>)
                        JSON.deserializeUntyped(res.getBody());

                    acc.Weather_Status__c = (String)data.get('condition');
                    acc.Temperature__c = (Decimal)data.get('temperature');
                    accountsToUpdate.add(acc);
                }

            } catch (Exception e) {
                System.debug('Error for account ' + acc.Id + ': ' + e.getMessage());
                // Continue processing other accounts
            }
        }

        if (!accountsToUpdate.isEmpty()) {
            Database.update(accountsToUpdate, false); // Partial success allowed
        }
    }

    public class WeatherException extends Exception {}
}
```

**Usage:**
```apex
// Single account (sync)
WeatherService.updateWeather(accountId);

// Multiple accounts (async)
WeatherService.updateWeatherAsync(new Set<Id>{acc1, acc2, acc3});
```

---

## Challenge 6: LWC Data Table

### Problem

Create an LWC component that displays Accounts with inline editing.

**Requirements:**
- Display all Accounts in a data table
- Allow inline editing of Name and Industry
- Save changes on edit
- Handle errors

---

### Solution

**HTML:**
```html
<!-- accountDataTable.html -->
<template>
    <lightning-card title="Accounts" icon-name="standard:account">
        <template if:true={accounts.data}>
            <lightning-datatable
                key-field="Id"
                data={accounts.data}
                columns={columns}
                onsave={handleSave}
                draft-values={draftValues}>
            </lightning-datatable>
        </template>

        <template if:true={accounts.error}>
            <p class="slds-m-around_medium">Error loading accounts: {accounts.error.body.message}</p>
        </template>
    </lightning-card>
</template>
```

**JavaScript:**
```javascript
// accountDataTable.js
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Industry', fieldName: 'Industry', type: 'picklistColumn', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' }
];

export default class AccountDataTable extends LightningElement {
    columns = COLUMNS;
    draftValues = [];
    accountsWiredResult;

    @wire(getAccounts)
    accounts(result) {
        this.accountsWiredResult = result;
    }

    async handleSave(event) {
        const records = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        this.draftValues = [];

        try {
            const recordUpdatePromises = records.map(record =>
                updateRecord(record)
            );
            await Promise.all(recordUpdatePromises);

            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Accounts updated successfully',
                variant: 'success'
            }));

            await refreshApex(this.accountsWiredResult);

        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error updating records',
                message: error.body.message,
                variant: 'error'
            }));
        }
    }
}
```

**Apex Controller:**
```apex
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Industry, Phone
                FROM Account
                ORDER BY Name
                LIMIT 100];
    }
}
```

---

## Tips for Coding Interviews

### ✅ DO:
- **Ask clarifying questions** before coding
- **Explain your approach** before writing code
- **Think out loud** while coding
- **Use meaningful variable names**
- **Handle edge cases** (null, empty, etc.)
- **Write clean, readable code**
- **Test with examples**

### ❌ DON'T:
- Don't code in silence
- Don't assume requirements
- Don't ignore edge cases
- Don't write sloppy code
- Don't skip testing
- Don't panic if stuck (think through it)

---

## Common Mistakes

**1. SOQL/DML in Loops**
```apex
// ❌ Bad
for (Account acc : accounts) {
    update acc;
}

// ✅ Good
update accounts;
```

**2. No Null Checks**
```apex
// ❌ Bad
acc.Name.toLowerCase();

// ✅ Good
if (acc.Name != null) {
    acc.Name.toLowerCase();
}
```

**3. Not Bulkified**
```apex
// ❌ Bad: Only handles 1 record
public static void doSomething(Id accountId) { }

// ✅ Good: Handles bulk
public static void doSomething(Set<Id> accountIds) { }
```

---

## Practice More

Try solving these on your own:

1. **Merge duplicate Contacts** based on email
2. **Calculate commission** based on opportunity amount tiers
3. **Build a queueable chain** for multi-step processing
4. **Create a REST endpoint** for external order creation
5. **Design a trigger** to prevent account deletion if has opportunities

---

## Interview Checklist

- [ ] Can solve problems step-by-step
- [ ] Write bulkified code
- [ ] Handle edge cases (null, empty, large datasets)
- [ ] Use proper error handling
- [ ] Explain trade-offs
- [ ] Test code with examples
- [ ] Write clean, readable code
- [ ] Communicate clearly throughout

**Keep practicing!** 💪
