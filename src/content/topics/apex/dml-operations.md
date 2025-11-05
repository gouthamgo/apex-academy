---
title: "DML Operations - Create, Read, Update, Delete"
section: "apex"
order: 7
difficulty: "beginner"
readTime: "25 min"
description: "Master DML (Data Manipulation Language) operations in Apex including insert, update, delete, upsert, and best practices for database operations."
overview: "Learn how to perform database operations safely and efficiently using DML statements and Database methods."
concepts: ["dml", "insert", "update", "delete", "upsert", "database-methods", "transactions", "dml-exceptions"]
prerequisites: ["variables-and-data-types", "collections-deep-dive", "exception-handling"]
relatedTopics: ["soql-fundamentals", "trigger-bulkification-best-practices"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

DML (Data Manipulation Language) operations allow you to create, modify, and delete records in the Salesforce database. Understanding DML is fundamental to building any Salesforce application.

## DML Operations

Salesforce provides these core DML operations:
- **INSERT**: Create new records
- **UPDATE**: Modify existing records
- **DELETE**: Remove records (move to recycle bin)
- **UPSERT**: Create or update based on external ID
- **UNDELETE**: Restore deleted records from recycle bin
- **MERGE**: Combine duplicate records

**Key Principles:**
- **Bulk Operations**: Always process multiple records together
- **Transactions**: DML is transactional - all or nothing by default
- **Governor Limits**: Maximum 150 DML statements per transaction
- **Error Handling**: Use try-catch or Database methods for partial success

---

# Code Examples

## INSERT Operations

Creating new records in the database.

```apex
public class InsertExamples {
    
    // ✅ Basic insert - single record
    public static void insertSingleAccount() {
        Account acc = new Account();
        acc.Name = 'ACME Corporation';
        acc.Industry = 'Technology';
        acc.AnnualRevenue = 1000000;
        
        insert acc;
        // ^^^^^^^^^^
        // INSERT: Saves record to database
        // → Record gets assigned an Id
        // 💡 AFTER INSERT: acc.Id is now populated
        
        System.debug('Created account with Id: ' + acc.Id);
    }
    
    // ✅ Bulk insert - multiple records
    public static void insertMultipleAccounts() {
        List<Account> accounts = new List<Account>();
        
        for (Integer i = 0; i < 200; i++) {
            Account acc = new Account(
                Name = 'Test Account ' + i,
                Industry = 'Technology',
                AnnualRevenue = 100000 * i
            );
            accounts.add(acc);
        }
        
        insert accounts;
        // ^^^^^^^^^^^^^^^
        // BULK INSERT: One DML for all records
        // → More efficient than loop with insert
        // ✅ BEST PRACTICE: Always bulkify
        
        System.debug('Inserted ' + accounts.size() + ' accounts');
        
        // All records now have Ids
        for (Account acc : accounts) {
            System.debug('Account Id: ' + acc.Id);
        }
    }
    
    // ✅ Insert with error handling
    public static void insertWithErrorHandling() {
        List<Account> accounts = new List<Account>();
        accounts.add(new Account(Name = 'Valid Account'));
        accounts.add(new Account()); // Missing required Name
        
        try {
            insert accounts;
        } catch (DmlException e) {
            // ^^^^^^^^^^^
            // DML EXCEPTION: Thrown on DML failures
            // → Contains detailed error information
            
            System.debug('DML Error: ' + e.getMessage());
            System.debug('Failed record index: ' + e.getDmlIndex(0));
            System.debug('Error fields: ' + e.getDmlFieldNames(0));
        }
    }
}
```

## UPDATE Operations

Modifying existing records.

```apex
public class UpdateExamples {
    
    // ✅ Update single record
    public static void updateSingleAccount(Id accountId) {
        Account acc = [SELECT Id, Name FROM Account WHERE Id = :accountId];
        
        acc.Industry = 'Healthcare';
        acc.AnnualRevenue = 2000000;
        
        update acc;
        // ^^^^^^^^^^
        // UPDATE: Modify existing record
        // → Id must be set
        // 💡 REQUIREMENT: Record must have Id field populated
        
        System.debug('Updated account: ' + acc.Name);
    }
    
    // ✅ Bulk update with map
    public static void bulkUpdateAccounts(Set<Id> accountIds) {
        // Query records to update
        Map<Id, Account> accountsMap = new Map<Id, Account>([
            SELECT Id, Name, Industry
            FROM Account
            WHERE Id IN :accountIds
        ]);
        
        // Modify records
        for (Account acc : accountsMap.values()) {
            acc.Industry = 'Technology';
        }
        
        // Bulk update
        update accountsMap.values();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // UPDATE FROM MAP: Update all values
        // → Efficient bulk operation
    }
    
    // ✅ Partial record update
    public static void partialUpdate(Id accountId) {
        // Don't need to query all fields
        Account acc = new Account(
            Id = accountId,
            Industry = 'Finance'
        );
        // ^^^^^^^^^^^^^^
        // PARTIAL UPDATE: Only set Id and fields to change
        // → More efficient than querying full record
        // ✅ OPTIMIZATION: Update only what's needed
        
        update acc;
    }
}
```

## Database Methods for Partial Success

```apex
public class DatabaseMethodExamples {
    
    // ✅ Database.insert with partial success
    public static void insertWithPartialSuccess() {
        List<Account> accounts = new List<Account>();
        accounts.add(new Account(Name = 'Valid Account 1'));
        accounts.add(new Account()); // Will fail - no name
        accounts.add(new Account(Name = 'Valid Account 2'));
        
        Database.SaveResult[] results = Database.insert(accounts, false);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATABASE.INSERT: Allow partial success
        // → false parameter means continue on error
        // ✅ RESILIENCE: Some records can succeed while others fail
        
        // Process results
        for (Integer i = 0; i < results.size(); i++) {
            if (results[i].isSuccess()) {
                System.debug('Success: ' + accounts[i].Name);
            } else {
                for (Database.Error err : results[i].getErrors()) {
                    System.debug('Error on record ' + i + ': ' + err.getMessage());
                    System.debug('Failed fields: ' + err.getFields());
                }
            }
        }
    }
    
    // ✅ Database.update with options
    public static void updateWithOptions() {
        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 100];
        
        for (Account acc : accounts) {
            acc.Description = 'Updated on ' + DateTime.now();
        }
        
        Database.SaveResult[] results = Database.update(accounts, false);
        
        Integer successCount = 0;
        Integer errorCount = 0;
        
        for (Database.SaveResult result : results) {
            if (result.isSuccess()) {
                successCount++;
            } else {
                errorCount++;
            }
        }
        
        System.debug('Success: ' + successCount + ', Errors: ' + errorCount);
    }
}
```

## UPSERT Operations

```apex
public class UpsertExamples {
    
    // ✅ Upsert with external Id
    public static void upsertAccounts() {
        List<Account> accounts = new List<Account>();
        
        Account acc1 = new Account(
            Name = 'Existing Corp',
            External_Id__c = 'EXT-001' // Custom external ID field
        );
        
        Account acc2 = new Account(
            Name = 'New Corp',
            External_Id__c = 'EXT-002'
        );
        
        accounts.add(acc1);
        accounts.add(acc2);
        
        upsert accounts External_Id__c;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // UPSERT: Insert if new, update if exists
        // → Matches on External_Id__c field
        // 💡 INTEGRATION: Perfect for data sync
        
        System.debug('Upserted ' + accounts.size() + ' accounts');
    }
    
    // ✅ Upsert with Id (default)
    public static void upsertWithId() {
        List<Account> accounts = new List<Account>();
        
        // Record with Id - will update
        accounts.add(new Account(
            Id = '001XXXXXXXXXXXXXXX',
            Name = 'Updated Name'
        ));
        
        // Record without Id - will insert
        accounts.add(new Account(
            Name = 'New Account'
        ));
        
        upsert accounts;
        // ^^^^^^^^^^^^^^
        // DEFAULT UPSERT: Uses Id field
        // → Updates if Id present, inserts if not
    }
}
```

## DELETE and UNDELETE

```apex
public class DeleteExamples {
    
    // ✅ Delete records
    public static void deleteAccounts(Set<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id
            FROM Account
            WHERE Id IN :accountIds
        ];
        
        delete accounts;
        // ^^^^^^^^^^^^^^^
        // DELETE: Move records to recycle bin
        // → Not permanently deleted
        // 💡 RECOVERY: Can undelete within 15 days
        
        System.debug('Deleted ' + accounts.size() + ' accounts');
    }
    
    // ✅ Delete without querying
    public static void deleteById(Set<Id> accountIds) {
        List<Account> accounts = new List<Account>();
        
        for (Id accId : accountIds) {
            accounts.add(new Account(Id = accId));
        }
        
        delete accounts;
        // ^^^^^^^^^^^^^^
        // DELETE BY ID: Don't need to query first
        // → More efficient
        // ✅ OPTIMIZATION: Skip unnecessary query
    }
    
    // ✅ Undelete records
    public static void undeleteAccounts() {
        List<Account> deletedAccounts = [
            SELECT Id, Name
            FROM Account
            WHERE IsDeleted = true
            ALL ROWS
        ];
        // ^^^^^^^^^
        // ALL ROWS: Include deleted records in query
        // → Required to query deleted records
        
        if (!deletedAccounts.isEmpty()) {
            undelete deletedAccounts;
            // ^^^^^^^^^^^^^^^^^^^^^
            // UNDELETE: Restore from recycle bin
            // → Records return to normal state
            
            System.debug('Undeleted ' + deletedAccounts.size() + ' accounts');
        }
    }
}
```

---

# Best Practices

```apex
// ❌ BAD - DML in loop
for (Account acc : accounts) {
    update acc; // 100 accounts = 100 DML statements!
}

// ✅ GOOD - Bulk DML
List<Account> accountsToUpdate = new List<Account>();
for (Account acc : accounts) {
    accountsToUpdate.add(acc);
}
update accountsToUpdate; // Single DML statement

// ✅ Use Database methods for partial success
Database.SaveResult[] results = Database.insert(records, false);

// ✅ Handle errors appropriately
try {
    insert records;
} catch (DmlException e) {
    // Log and handle error
}
```

---

# Common Gotchas

💀 **DML Limits**: Maximum 150 DML statements per transaction
⚠️ **DML on Same Object**: Can't mix insert and update in trigger on same object
💡 **Field Access**: Respect field-level security with Database methods

---

# Related Topics

- **[SOQL Fundamentals](soql-fundamentals)** - Query records before DML
- **[Trigger Bulkification](trigger-bulkification-best-practices)** - DML in triggers
- **[Exception Handling](exception-handling)** - Handle DML errors

**Next:** [Triggers and Trigger Frameworks](triggers-and-frameworks)
