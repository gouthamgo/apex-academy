---
title: "Trigger Bulkification Best Practices"
category: "apex"
difficulty: "advanced"
readTime: "18 min"
author: "Marcus Rodriguez"
description: "Master Apex trigger bulkification patterns to handle large data volumes efficiently. Learn collection-based processing, governor limit strategies, and testing approaches."
tags: ["triggers", "bulkification", "governor-limits", "performance", "best-practices"]
prerequisites: ["apex-triggers", "collections", "soql-basics"]
relatedTutorials: ["governor-limits", "trigger-patterns", "apex-testing"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# Trigger Bulkification Best Practices

Trigger bulkification is one of the most critical concepts in Salesforce development. This tutorial will teach you how to write triggers that efficiently handle both single records and large data loads without hitting governor limits.

## Understanding Bulkification

Bulkification means writing code that can efficiently process multiple records in a single transaction, rather than processing records one at a time.

> 💀 **EXAM TRAP**: Non-bulkified triggers are the #1 cause of governor limit exceptions in production Salesforce orgs!

### Why Bulkification Matters

```apex
// ❌ BAD - Non-bulkified trigger (NEVER do this!)
trigger AccountTrigger on Account (before insert, before update) {
    for (Account acc : Trigger.new) {
        // 💀 CRITICAL ERROR: SOQL inside loop
        List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // GOVERNOR LIMIT VIOLATION: Each iteration uses one SOQL query
        // → 100 accounts = 100 SOQL queries = EXCEPTION!
        // Maximum allowed: 100 SOQL queries per transaction

        acc.Number_of_Contacts__c = contacts.size();

        // 💀 CRITICAL ERROR: DML inside loop
        update acc;
        // ^^^^^^^^^^
        // GOVERNOR LIMIT VIOLATION: Each iteration uses one DML statement
        // → 100 accounts = 100 DML statements = EXCEPTION!
        // Maximum allowed: 150 DML statements per transaction
    }
}

// ✅ GOOD - Bulkified trigger
trigger AccountTrigger on Account (before insert, before update) {
    // Collect all Account IDs for single SOQL query
    Set<Id> accountIds = new Set<Id>();
    for (Account acc : Trigger.new) {
        if (acc.Id != null) {
            accountIds.add(acc.Id);
        }
    }

    // Single SOQL query for all accounts
    Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
    if (!accountIds.isEmpty()) {
        for (Contact con : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
            if (!contactsByAccount.containsKey(con.AccountId)) {
                contactsByAccount.put(con.AccountId, new List<Contact>());
            }
            contactsByAccount.get(con.AccountId).add(con);
        }
    }

    // Process all accounts with collected data
    for (Account acc : Trigger.new) {
        List<Contact> contacts = contactsByAccount.get(acc.Id);
        acc.Number_of_Contacts__c = contacts != null ? contacts.size() : 0;
    }
    // No DML needed - this is a before trigger modifying Trigger.new
}
```

## Core Bulkification Patterns

### Pattern 1: Collection-Based Processing

Always work with collections, never individual records:

```apex
public class AccountTriggerHandler {

    public static void updateAccountRatings(List<Account> accounts) {
        // ✅ PATTERN: Collect data first, process in bulk
        Set<Id> accountIds = new Set<Id>();
        Set<String> industries = new Set<String>();

        // Collect all identifiers in single loop
        for (Account acc : accounts) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // SINGLE LOOP: Collect all data needed for bulk operations
            // → More efficient than multiple loops over same data

            if (acc.Id != null) {
                accountIds.add(acc.Id);
            }
            if (String.isNotBlank(acc.Industry)) {
                industries.add(acc.Industry);
            }
        }

        // Single SOQL queries with collected identifiers
        Map<Id, Decimal> revenueByAccount = getRevenueByAccount(accountIds);
        Map<String, String> ratingByIndustry = getRatingByIndustry(industries);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BULK QUERIES: One query per data type, not per record
        // → Efficient use of SOQL governor limits

        // Process all accounts with bulk-fetched data
        for (Account acc : accounts) {
            Decimal totalRevenue = revenueByAccount.get(acc.Id);
            String industryRating = ratingByIndustry.get(acc.Industry);

            // Business logic using bulk-fetched data
            acc.Rating = calculateRating(totalRevenue, industryRating);
        }
    }

    private static Map<Id, Decimal> getRevenueByAccount(Set<Id> accountIds) {
        Map<Id, Decimal> revenueMap = new Map<Id, Decimal>();

        if (accountIds.isEmpty()) {
            return revenueMap; // Early return for empty set
        }

        // Single aggregate query for all accounts
        for (AggregateResult result : [
            SELECT AccountId, SUM(Amount) totalRevenue
            FROM Opportunity
            WHERE AccountId IN :accountIds
            AND StageName = 'Closed Won'
            GROUP BY AccountId
        ]) {
            Id accountId = (Id) result.get('AccountId');
            Decimal revenue = (Decimal) result.get('totalRevenue');
            revenueMap.put(accountId, revenue);
        }

        return revenueMap;
    }

    private static Map<String, String> getRatingByIndustry(Set<String> industries) {
        Map<String, String> ratingMap = new Map<String, String>();

        // Business logic to determine ratings by industry
        for (String industry : industries) {
            switch on industry {
                when 'Technology' {
                    ratingMap.put(industry, 'Hot');
                }
                when 'Healthcare' {
                    ratingMap.put(industry, 'Warm');
                }
                when else {
                    ratingMap.put(industry, 'Cold');
                }
            }
        }

        return ratingMap;
    }

    private static String calculateRating(Decimal revenue, String industryRating) {
        // Combined rating logic
        if (revenue != null && revenue > 1000000) {
            return 'Hot';
        } else if (industryRating == 'Hot') {
            return 'Warm';
        } else {
            return industryRating;
        }
    }
}
```

### Pattern 2: DML Bulkification

When you need to perform DML operations, collect all records first:

```apex
public class ContactTriggerHandler {

    public static void createWelcomeTasksAfterInsert(List<Contact> newContacts) {
        List<Task> tasksToInsert = new List<Task>();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COLLECTION PREPARATION: Gather all DML operations
        // → Single DML statement instead of loop with DML

        for (Contact con : newContacts) {
            // Only create tasks for contacts with email
            if (String.isNotBlank(con.Email)) {
                Task welcomeTask = new Task();
                welcomeTask.Subject = 'Send Welcome Email';
                welcomeTask.Description = 'Send welcome email to ' + con.Name;
                welcomeTask.WhoId = con.Id;
                welcomeTask.ActivityDate = Date.today().addDays(1);
                welcomeTask.Status = 'Not Started';
                welcomeTask.Priority = 'Normal';

                tasksToInsert.add(welcomeTask);
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^
                // COLLECT FOR BULK DML: Add to list instead of immediate insert
            }
        }

        // Single DML operation for all tasks
        if (!tasksToInsert.isEmpty()) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // DEFENSIVE CHECK: Only execute DML if there's data
            // → Prevents unnecessary DML operations

            try {
                insert tasksToInsert;
                // ^^^^^^^^^^^^^^^^^^^^
                // BULK DML: Insert all tasks in single operation
                // → Uses only 1 DML statement regardless of record count
            } catch (DmlException e) {
                // Handle DML errors gracefully
                System.debug('Error inserting welcome tasks: ' + e.getMessage());

                // 💡 BEST PRACTICE: Add errors to the original records
                for (Contact con : newContacts) {
                    con.addError('Failed to create welcome task: ' + e.getMessage());
                }
            }
        }
    }

    public static void updateAccountContactCountAfterInsert(List<Contact> newContacts) {
        updateAccountContactCount(newContacts, null);
    }

    public static void updateAccountContactCountAfterUpdate(List<Contact> newContacts, Map<Id, Contact> oldContactsMap) {
        updateAccountContactCount(newContacts, oldContactsMap);
    }

    public static void updateAccountContactCountAfterDelete(List<Contact> deletedContacts) {
        updateAccountContactCount(deletedContacts, null);
    }

    private static void updateAccountContactCount(List<Contact> contacts, Map<Id, Contact> oldContactsMap) {
        Set<Id> accountIds = new Set<Id>();

        // Collect all affected account IDs
        for (Contact con : contacts) {
            if (con.AccountId != null) {
                accountIds.add(con.AccountId);
            }

            // For updates, also check old account
            if (oldContactsMap != null && oldContactsMap.containsKey(con.Id)) {
                Contact oldContact = oldContactsMap.get(con.Id);
                if (oldContact.AccountId != null && oldContact.AccountId != con.AccountId) {
                    accountIds.add(oldContact.AccountId);
                }
            }
        }

        if (accountIds.isEmpty()) {
            return; // No accounts to update
        }

        // Get current contact counts for affected accounts
        Map<Id, Integer> contactCountsByAccount = new Map<Id, Integer>();
        for (AggregateResult result : [
            SELECT AccountId, COUNT(Id) contactCount
            FROM Contact
            WHERE AccountId IN :accountIds
            GROUP BY AccountId
        ]) {
            Id accountId = (Id) result.get('AccountId');
            Integer count = (Integer) result.get('contactCount');
            contactCountsByAccount.put(accountId, count);
        }

        // Prepare accounts for update
        List<Account> accountsToUpdate = new List<Account>();
        for (Id accountId : accountIds) {
            Account acc = new Account();
            acc.Id = accountId;
            acc.Number_of_Contacts__c = contactCountsByAccount.get(accountId);
            accountsToUpdate.add(acc);
        }

        // Bulk update all affected accounts
        if (!accountsToUpdate.isEmpty()) {
            try {
                update accountsToUpdate;
            } catch (DmlException e) {
                System.debug('Error updating account contact counts: ' + e.getMessage());
            }
        }
    }
}
```

### Pattern 3: Managing Related Records

Efficiently handle related record operations:

```apex
public class OpportunityTriggerHandler {

    public static void updateRelatedContactsAfterUpdate(
        List<Opportunity> newOpps,
        Map<Id, Opportunity> oldOppsMap
    ) {
        // Identify opportunities with stage changes
        Set<Id> closedWonOppIds = new Set<Id>();
        Set<Id> closedLostOppIds = new Set<Id>();

        for (Opportunity opp : newOpps) {
            Opportunity oldOpp = oldOppsMap.get(opp.Id);

            // Check for stage changes to closed states
            if (opp.StageName != oldOpp.StageName) {
                if (opp.StageName == 'Closed Won') {
                    closedWonOppIds.add(opp.Id);
                } else if (opp.StageName == 'Closed Lost') {
                    closedLostOppIds.add(opp.Id);
                }
            }
        }

        // Process related records only if needed
        if (!closedWonOppIds.isEmpty()) {
            createSuccessTasksForOpportunities(closedWonOppIds);
        }

        if (!closedLostOppIds.isEmpty()) {
            createFollowUpTasksForOpportunities(closedLostOppIds);
        }
    }

    private static void createSuccessTasksForOpportunities(Set<Id> opportunityIds) {
        // Get opportunity contacts in single query
        Map<Id, List<OpportunityContactRole>> contactsByOpp = new Map<Id, List<OpportunityContactRole>>();

        for (OpportunityContactRole ocr : [
            SELECT Id, OpportunityId, ContactId, Contact.Name, Contact.Email
            FROM OpportunityContactRole
            WHERE OpportunityId IN :opportunityIds
            AND IsPrimary = true
        ]) {
            if (!contactsByOpp.containsKey(ocr.OpportunityId)) {
                contactsByOpp.put(ocr.OpportunityId, new List<OpportunityContactRole>());
            }
            contactsByOpp.get(ocr.OpportunityId).add(ocr);
        }

        // Create tasks for all contacts
        List<Task> tasksToInsert = new List<Task>();

        for (Id oppId : opportunityIds) {
            List<OpportunityContactRole> contacts = contactsByOpp.get(oppId);

            if (contacts != null) {
                for (OpportunityContactRole ocr : contacts) {
                    Task successTask = new Task();
                    successTask.Subject = 'Celebrate Success with ' + ocr.Contact.Name;
                    successTask.WhatId = oppId;
                    successTask.WhoId = ocr.ContactId;
                    successTask.ActivityDate = Date.today().addDays(3);
                    successTask.Status = 'Not Started';
                    successTask.Priority = 'High';

                    tasksToInsert.add(successTask);
                }
            }
        }

        // Bulk insert all tasks
        if (!tasksToInsert.isEmpty()) {
            Database.insert(tasksToInsert, false); // Allow partial success
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // PARTIAL SUCCESS: false parameter allows some records to fail
            // → More resilient than all-or-nothing approach
        }
    }

    private static void createFollowUpTasksForOpportunities(Set<Id> opportunityIds) {
        // Similar pattern for follow-up tasks
        // Implementation would follow same bulkification principles
    }
}
```

## Governor Limit Considerations

### SOQL Query Limits

```apex
public class BulkificationLimits {

    // ✅ GOOD - Efficient SOQL usage
    public static void processAccountsEfficiently(List<Account> accounts) {
        Set<Id> accountIds = new Set<Id>();
        for (Account acc : accounts) {
            accountIds.add(acc.Id);
        }

        // Single query with relationship traversal
        Map<Id, Account> accountsWithContacts = new Map<Id, Account>([
            SELECT Id, Name,
                (SELECT Id, Name, Email FROM Contacts LIMIT 5000)
            FROM Account
            WHERE Id IN :accountIds
        ]);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // RELATIONSHIP QUERY: Gets parent and children in single query
        // → More efficient than separate queries for parent and children
        // Uses 1 SOQL query instead of 1 + N queries

        // Process with related data
        for (Account acc : accounts) {
            Account fullAccount = accountsWithContacts.get(acc.Id);
            if (fullAccount != null) {
                processAccountWithContacts(fullAccount);
            }
        }
    }

    // ❌ BAD - Inefficient SOQL usage
    public static void processAccountsInefficiently(List<Account> accounts) {
        for (Account acc : accounts) {
            // SOQL inside loop - governor limit risk
            List<Contact> contacts = [SELECT Id, Name FROM Contact WHERE AccountId = :acc.Id];
            // Each iteration = 1 SOQL query
            // 100 accounts = 100 SOQL queries = LIMIT EXCEEDED!

            processAccountWithContacts(acc, contacts);
        }
    }

    private static void processAccountWithContacts(Account acc) {
        // Process account with related contacts
        if (acc.Contacts != null) {
            for (Contact con : acc.Contacts) {
                // Business logic here
            }
        }
    }

    private static void processAccountWithContacts(Account acc, List<Contact> contacts) {
        // Legacy method signature for bad example
    }
}
```

### DML Statement Limits

```apex
public class DMLBulkification {

    // ✅ GOOD - Efficient DML usage
    public static void createContactsAndTasksBulk(List<Account> accounts) {
        List<Contact> contactsToInsert = new List<Contact>();
        List<Task> tasksToInsert = new List<Task>();

        // Prepare all DML operations
        for (Account acc : accounts) {
            // Create contact
            Contact con = new Contact();
            con.FirstName = 'Primary';
            con.LastName = 'Contact';
            con.AccountId = acc.Id;
            contactsToInsert.add(con);

            // Create task
            Task followUpTask = new Task();
            followUpTask.Subject = 'Follow up on new account';
            followUpTask.WhatId = acc.Id;
            followUpTask.ActivityDate = Date.today().addDays(7);
            tasksToInsert.add(followUpTask);
        }

        // Execute DML operations in bulk
        try {
            insert contactsToInsert;  // 1 DML statement
            insert tasksToInsert;     // 1 DML statement
            // Total: 2 DML statements regardless of record count
        } catch (DmlException e) {
            handleDMLErrors(e, accounts);
        }
    }

    // ❌ BAD - Inefficient DML usage
    public static void createContactsAndTasksInefficiently(List<Account> accounts) {
        for (Account acc : accounts) {
            // DML inside loop - governor limit risk
            Contact con = new Contact();
            con.FirstName = 'Primary';
            con.LastName = 'Contact';
            con.AccountId = acc.Id;
            insert con; // Each iteration = 1 DML statement

            Task followUpTask = new Task();
            followUpTask.Subject = 'Follow up on new account';
            followUpTask.WhatId = acc.Id;
            followUpTask.ActivityDate = Date.today().addDays(7);
            insert followUpTask; // Each iteration = 1 DML statement

            // 100 accounts = 200 DML statements = LIMIT EXCEEDED!
        }
    }

    private static void handleDMLErrors(DmlException e, List<Account> accounts) {
        // Add errors to original records so user sees them
        for (Account acc : accounts) {
            acc.addError('Failed to create related records: ' + e.getMessage());
        }
    }
}
```

## Testing Bulkified Triggers

Proper testing ensures your triggers work with large data volumes:

```apex
@isTest
private class AccountTriggerTest {

    @isTest
    static void testBulkAccountInsert() {
        // Test with bulk data to verify bulkification
        List<Account> testAccounts = new List<Account>();

        // Create test data in bulk
        for (Integer i = 0; i < 200; i++) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // BULK TEST DATA: Test with governor limit scale
            // → 200 records tests bulkification patterns
            Account acc = new Account();
            acc.Name = 'Test Account ' + i;
            acc.Industry = (Math.mod(i, 2) == 0) ? 'Technology' : 'Healthcare';
            acc.AnnualRevenue = 100000 * i;
            testAccounts.add(acc);
        }

        // Measure governor limits before operation
        Integer queriesBeforeInsert = Limits.getQueries();
        Integer dmlStatementsBeforeInsert = Limits.getDmlStatements();

        Test.startTest();
        insert testAccounts;
        Test.stopTest();

        // Verify governor limit usage
        Integer queriesAfterInsert = Limits.getQueries();
        Integer dmlStatementsAfterInsert = Limits.getDmlStatements();

        // Assert efficient governor limit usage
        System.assert(
            queriesAfterInsert - queriesBeforeInsert <= 5,
            'Trigger should use minimal SOQL queries for bulk operation'
        );
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // GOVERNOR LIMIT TESTING: Verify efficient resource usage
        // → Ensures trigger scales properly

        System.assert(
            dmlStatementsAfterInsert - dmlStatementsBeforeInsert <= 2,
            'Trigger should use minimal DML statements for bulk operation'
        );

        // Verify business logic worked correctly
        List<Account> insertedAccounts = [
            SELECT Id, Name, Rating, Number_of_Contacts__c
            FROM Account
            WHERE Id IN :testAccounts
        ];

        System.assertEquals(200, insertedAccounts.size(), 'All accounts should be inserted');

        for (Account acc : insertedAccounts) {
            System.assertNotEquals(null, acc.Rating, 'Rating should be calculated');
        }
    }

    @isTest
    static void testBulkAccountUpdate() {
        // Setup test data
        List<Account> testAccounts = createTestAccounts(100);
        insert testAccounts;

        // Create related contacts for testing
        List<Contact> testContacts = new List<Contact>();
        for (Account acc : testAccounts) {
            for (Integer i = 0; i < 3; i++) {
                Contact con = new Contact();
                con.FirstName = 'Test';
                con.LastName = 'Contact ' + i;
                con.AccountId = acc.Id;
                testContacts.add(con);
            }
        }
        insert testContacts;

        // Update accounts to trigger rating recalculation
        for (Account acc : testAccounts) {
            acc.Industry = 'Technology';
        }

        Test.startTest();
        update testAccounts;
        Test.stopTest();

        // Verify results
        List<Account> updatedAccounts = [
            SELECT Id, Rating, Number_of_Contacts__c
            FROM Account
            WHERE Id IN :testAccounts
        ];

        for (Account acc : updatedAccounts) {
            System.assertEquals(3, acc.Number_of_Contacts__c, 'Contact count should be updated');
            System.assertNotEquals(null, acc.Rating, 'Rating should be recalculated');
        }
    }

    @isTest
    static void testTriggerWithNoRelatedData() {
        // Test edge case with no related records
        List<Account> testAccounts = createTestAccounts(50);

        Test.startTest();
        insert testAccounts;
        Test.stopTest();

        // Verify trigger handles empty related data gracefully
        List<Account> insertedAccounts = [
            SELECT Id, Number_of_Contacts__c
            FROM Account
            WHERE Id IN :testAccounts
        ];

        for (Account acc : insertedAccounts) {
            System.assertEquals(0, acc.Number_of_Contacts__c, 'Should handle no contacts gracefully');
        }
    }

    // Helper method for creating test data
    private static List<Account> createTestAccounts(Integer count) {
        List<Account> accounts = new List<Account>();

        for (Integer i = 0; i < count; i++) {
            Account acc = new Account();
            acc.Name = 'Bulk Test Account ' + i;
            acc.Industry = 'Healthcare';
            acc.AnnualRevenue = 50000 + (i * 1000);
            accounts.add(acc);
        }

        return accounts;
    }
}
```

## Performance Optimization Tips

### Use Maps for Efficient Lookups

```apex
// ✅ EFFICIENT - Use Map for O(1) lookup time
Map<Id, Contact> contactsMap = new Map<Id, Contact>([
    SELECT Id, Name, AccountId FROM Contact WHERE AccountId IN :accountIds
]);

for (Account acc : accounts) {
    Contact relatedContact = contactsMap.get(acc.Primary_Contact__c);
    if (relatedContact != null) {
        // Process with contact data
    }
}

// ❌ INEFFICIENT - List iteration for O(n) lookup time
List<Contact> contactsList = [
    SELECT Id, Name, AccountId FROM Contact WHERE AccountId IN :accountIds
];

for (Account acc : accounts) {
    for (Contact con : contactsList) { // Nested loop = O(n²) complexity!
        if (con.Id == acc.Primary_Contact__c) {
            // Process with contact data
            break;
        }
    }
}
```

### Minimize Database Round Trips

```apex
// ✅ GOOD - Single query with subquery
List<Account> accountsWithOpps = [
    SELECT Id, Name,
        (SELECT Id, Amount, CloseDate FROM Opportunities WHERE StageName = 'Closed Won')
    FROM Account
    WHERE Id IN :accountIds
];

// ❌ BAD - Multiple queries
List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
Map<Id, List<Opportunity>> oppsByAccount = new Map<Id, List<Opportunity>>();
for (Account acc : accounts) {
    oppsByAccount.put(acc.Id, [
        SELECT Id, Amount FROM Opportunity
        WHERE AccountId = :acc.Id AND StageName = 'Closed Won'
    ]); // This creates N queries!
}
```

## Common Bulkification Mistakes

> 💀 **EXAM TRAPS**: These mistakes frequently appear in certification scenarios!

### Mistake 1: SOQL/DML Inside Loops

```apex
// ❌ WRONG
for (Account acc : Trigger.new) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id]; // SOQL in loop
    insert new Task(WhatId = acc.Id, Subject = 'Follow up'); // DML in loop
}

// ✅ CORRECT
Set<Id> accountIds = new Set<Id>();
List<Task> tasksToInsert = new List<Task>();

for (Account acc : Trigger.new) {
    accountIds.add(acc.Id);
    tasksToInsert.add(new Task(WhatId = acc.Id, Subject = 'Follow up'));
}

Map<Id, List<Contact>> contactsByAccount = getContactsByAccount(accountIds);
insert tasksToInsert;
```

### Mistake 2: Not Checking for Null/Empty Collections

```apex
// ❌ WRONG - No null checks
for (Account acc : accounts) {
    for (Contact con : acc.Contacts) { // NullPointerException if Contacts is null
        // Process contact
    }
}

// ✅ CORRECT - Proper null checking
for (Account acc : accounts) {
    if (acc.Contacts != null && !acc.Contacts.isEmpty()) {
        for (Contact con : acc.Contacts) {
            // Process contact safely
        }
    }
}
```

### Mistake 3: Inefficient Map Usage

```apex
// ❌ WRONG - Inefficient map building
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact con : allContacts) {
    if (contactsByAccount.containsKey(con.AccountId)) {
        contactsByAccount.get(con.AccountId).add(con);
    } else {
        contactsByAccount.put(con.AccountId, new List<Contact>{con});
    }
}

// ✅ CORRECT - Efficient map building
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact con : allContacts) {
    if (!contactsByAccount.containsKey(con.AccountId)) {
        contactsByAccount.put(con.AccountId, new List<Contact>());
    }
    contactsByAccount.get(con.AccountId).add(con);
}
```

## Summary

Bulkification is essential for scalable Salesforce development:

✅ **Always Remember:**
- Process collections, not individual records
- Perform SOQL/DML outside of loops
- Use Maps for efficient data lookups
- Test with bulk data (200+ records)
- Handle null/empty collections gracefully

💀 **Never Do:**
- SOQL queries inside loops
- DML operations inside loops
- Nested loops with database operations
- Assume collections are always populated

Master these patterns and your triggers will handle any data volume efficiently!