---
title: "Collections Deep Dive"
section: "apex"
order: 2
difficulty: "intermediate"
readTime: "25 min"
description: "Master Apex collections - Lists, Sets, and Maps - with real-world patterns, iteration techniques, and performance optimization strategies."
overview: "Deep dive into Apex collections: when to use each type, common operations, iteration patterns, and bulkification strategies for scalable code."
concepts: ["lists", "sets", "maps", "iteration", "bulkification", "performance", "generic-types", "collection-methods"]
prerequisites: ["variables-and-data-types"]
relatedTopics: ["control-flow-and-logic", "trigger-development", "database-operations"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Collections Deep Dive

Collections are fundamental to writing efficient, scalable Apex code. Understanding when and how to use Lists, Sets, and Maps is crucial for bulkification, performance optimization, and building maintainable applications.

## Overview

In this comprehensive topic, you'll master:
- When to use Lists, Sets, and Maps effectively
- Collection declaration, initialization, and manipulation
- Iteration patterns and performance considerations
- Real-world collection patterns for bulkification
- Advanced collection operations and nested structures
- Common pitfalls and how to avoid them

## Core Concepts

### Lists - Ordered Collections

Lists maintain insertion order and allow duplicate elements, making them perfect for ordered data and bulk operations.

```apex
public class ListExamples {

    public static void demonstrateLists() {
        // List declaration and initialization
        List<String> accountNames = new List<String>();
        List<Integer> recordCounts = new List<Integer>{0, 5, 10, 15};
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // LIST DECLARATION: Generic type in angle brackets
        // → List<DataType> ensures type safety
        // 💡 INITIALIZATION: Can declare empty or with initial values

        // Adding elements
        accountNames.add('Acme Corp');
        accountNames.add('Global Inc');
        accountNames.add('Tech Solutions');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ADD METHOD: Appends to end of list
        // → Maintains insertion order
        // 💡 PERFORMANCE: O(1) operation for adding to end

        // Adding at specific position
        accountNames.add(1, 'Priority Corp');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // POSITIONAL ADD: Inserts at specific index
        // → Shifts existing elements to the right
        // ⚠️ PERFORMANCE: O(n) operation due to shifting

        // Accessing elements
        String firstAccount = accountNames.get(0);
        String lastAccount = accountNames.get(accountNames.size() - 1);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // GET METHOD: Retrieves element by index (0-based)
        // → Throws exception if index out of bounds
        // 💀 EXAM TRAP: Check size() before accessing elements

        // Safe element access
        if (!accountNames.isEmpty() && accountNames.size() > 2) {
            String thirdAccount = accountNames.get(2);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // SAFE ACCESS: Check size before accessing
            // → Prevents IndexOutOfBoundsException
            // ✅ BEST PRACTICE: Always validate index bounds
        }

        // List size and capacity
        Integer listSize = accountNames.size();
        Boolean isEmpty = accountNames.isEmpty();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SIZE METHODS: Get collection metrics
        // → size() returns current element count
        // → isEmpty() more readable than size() == 0

        // Modifying elements
        accountNames.set(0, 'Updated Acme Corp');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET METHOD: Replaces element at specific index
        // → Does not change list size
        // 💡 USE CASE: Updating existing records in bulk operations

        // Removing elements
        accountNames.remove(0); // Remove by index
        Boolean wasRemoved = accountNames.remove('Tech Solutions'); // Remove by value
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // REMOVE METHODS: By index or by value
        // → remove(index) returns removed element
        // → remove(object) returns boolean success indicator

        // List contains and search
        Boolean hasGlobal = accountNames.contains('Global Inc');
        Integer globalIndex = accountNames.indexOf('Global Inc');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SEARCH METHODS: Find elements in list
        // → contains() returns boolean
        // → indexOf() returns -1 if not found
    }

    public static void demonstrateListPatterns() {
        // Collecting IDs from records - common bulkification pattern
        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 10];
        List<Id> accountIds = new List<Id>();

        for (Account acc : accounts) {
            accountIds.add(acc.Id);
            // ^^^^^^^^^^^^^^^^^^^^^
            // ID COLLECTION: Gather IDs for subsequent queries
            // → Essential pattern for bulkification
            // 💡 PERFORMANCE: Single collection loop vs multiple queries
        }

        // Alternative: Use a Set to ensure uniqueness
        Set<Id> uniqueAccountIds = new Set<Id>();
        for (Account acc : accounts) {
            uniqueAccountIds.add(acc.Id);
        }
        List<Id> accountIdList = new List<Id>(uniqueAccountIds);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET TO LIST CONVERSION: Remove duplicates then convert
        // → Useful when source data might have duplicates
        // 💡 PATTERN: Set for uniqueness, List for ordered operations

        // Building collections for DML operations
        List<Contact> contactsToInsert = new List<Contact>();
        for (Id accountId : accountIds) {
            Contact newContact = new Contact();
            newContact.AccountId = accountId;
            newContact.LastName = 'Auto-Generated';
            newContact.Email = 'contact@example.com';
            contactsToInsert.add(newContact);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // DML PREPARATION: Build collections for bulk operations
            // → Single insert operation instead of loop with DML
            // ✅ BULKIFICATION: Essential for governor limit compliance
        }

        // Bulk DML operation
        if (!contactsToInsert.isEmpty()) {
            try {
                insert contactsToInsert;
                // ^^^^^^^^^^^^^^^^^^^^^^
                // BULK DML: Process all records in single operation
                // → Uses only 1 DML statement regardless of record count
                // 💡 EFFICIENCY: Dramatically better than DML in loops
            } catch (DmlException e) {
                System.debug('Bulk insert failed: ' + e.getMessage());
            }
        }
    }
}
```

### Sets - Unique Element Collections

Sets automatically enforce uniqueness and provide fast lookup operations, perfect for deduplication and membership testing.

```apex
public class SetExamples {

    public static void demonstrateSets() {
        // Set declaration and initialization
        Set<String> uniqueNames = new Set<String>();
        Set<Id> processedIds = new Set<Id>{'001000000000001', '001000000000002'};
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET DECLARATION: Generic type with automatic uniqueness
        // → Duplicate values automatically ignored
        // 💡 USE CASE: Ensuring no duplicate processing

        // Adding elements (duplicates ignored)
        uniqueNames.add('John');
        uniqueNames.add('Jane');
        uniqueNames.add('John'); // Duplicate - ignored
        uniqueNames.add('Bob');
        // ^^^^^^^^^^^^^^^^^^^^
        // DUPLICATE HANDLING: Automatically maintains uniqueness
        // → Second 'John' silently ignored
        // 💡 BEHAVIOR: No error thrown for duplicates

        System.debug('Unique names count: ' + uniqueNames.size()); // 3, not 4
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // UNIQUENESS RESULT: Only distinct values counted
        // → Proves automatic deduplication

        // Set operations
        Boolean hasJohn = uniqueNames.contains('John');
        Boolean wasRemoved = uniqueNames.remove('Jane');
        Integer setSize = uniqueNames.size();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET OPERATIONS: Similar to List but optimized for uniqueness
        // → contains() is O(1) average time complexity
        // 💡 PERFORMANCE: Much faster than List.contains() for large collections

        // Converting between Sets and Lists
        List<String> namesList = new List<String>(uniqueNames);
        Set<String> namesFromList = new Set<String>(namesList);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COLLECTION CONVERSION: Easy conversion between types
        // → List to Set removes duplicates
        // → Set to List creates ordered collection

        // Set union, intersection, and difference
        Set<String> set1 = new Set<String>{'A', 'B', 'C'};
        Set<String> set2 = new Set<String>{'B', 'C', 'D'};

        // Union - all elements from both sets
        Set<String> unionSet = set1.clone();
        unionSet.addAll(set2); // {'A', 'B', 'C', 'D'}
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // UNION OPERATION: Combine sets while maintaining uniqueness
        // → addAll() adds all elements from another collection
        // 💡 RESULT: All unique elements from both sets

        // Intersection - common elements only
        Set<String> intersectionSet = set1.clone();
        intersectionSet.retainAll(set2); // {'B', 'C'}
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // INTERSECTION: Keep only elements present in both sets
        // → retainAll() removes elements not in the other set
        // 💡 USE CASE: Finding common elements between collections

        // Difference - elements in set1 but not in set2
        Set<String> differenceSet = set1.clone();
        differenceSet.removeAll(set2); // {'A'}
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DIFFERENCE: Remove elements that exist in other set
        // → removeAll() subtracts one set from another
        // 💡 USE CASE: Finding elements unique to one collection
    }

    public static void demonstrateSetPatterns() {
        // Duplicate prevention in processing
        Set<Id> processedAccountIds = new Set<Id>();
        List<Contact> allContacts = [SELECT Id, AccountId FROM Contact];

        for (Contact con : allContacts) {
            if (!processedAccountIds.contains(con.AccountId)) {
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // DUPLICATE PREVENTION: Check before processing
                // → Ensures each Account processed only once
                // 💡 PATTERN: Common in trigger and batch processing

                processAccount(con.AccountId);
                processedAccountIds.add(con.AccountId);
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // MARK AS PROCESSED: Add to Set after processing
                // → Prevents reprocessing in same transaction
            }
        }

        // Fast lookup for authorization checks
        Set<String> authorizedUsers = new Set<String>{
            'admin@company.com',
            'manager@company.com',
            'supervisor@company.com'
        };

        String currentUser = UserInfo.getUserEmail();
        if (authorizedUsers.contains(currentUser)) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // FAST AUTHORIZATION: O(1) lookup time
            // → Much faster than iterating through List
            // ✅ PERFORMANCE: Ideal for permission checking
            performAuthorizedAction();
        }

        // Collecting unique values from query results
        Set<String> uniqueIndustries = new Set<String>();
        for (Account acc : [SELECT Industry FROM Account WHERE Industry != null]) {
            uniqueIndustries.add(acc.Industry);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // UNIQUE COLLECTION: Automatically deduplicate query results
            // → Useful for building picklist values or filtering options
            // 💡 RESULT: Distinct industry values for further processing
        }
    }

    private static void processAccount(Id accountId) {
        // Example method for demonstration
        System.debug('Processing account: ' + accountId);
    }

    private static void performAuthorizedAction() {
        // Example method for demonstration
        System.debug('Performing authorized action');
    }
}
```

### Maps - Key-Value Associations

Maps provide efficient key-based lookups and are essential for relating data and building lookup tables.

```apex
public class MapExamples {

    public static void demonstrateMaps() {
        // Map declaration and initialization
        Map<String, Integer> departmentCounts = new Map<String, Integer>();
        Map<Id, String> accountNames = new Map<Id, String>{
            '001000000000001' => 'Acme Corp',
            '001000000000002' => 'Global Inc'
        };
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // MAP DECLARATION: Key type and Value type specified
        // → Key must be primitive type or String
        // 💡 INITIALIZATION: Can use => syntax for key-value pairs

        // Adding and updating entries
        departmentCounts.put('Sales', 25);
        departmentCounts.put('Marketing', 15);
        departmentCounts.put('Engineering', 40);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // PUT METHOD: Add or update key-value pairs
        // → Overwrites existing value if key exists
        // 💡 BEHAVIOR: Same method for insert and update

        // Accessing values
        Integer salesCount = departmentCounts.get('Sales');
        Integer unknownCount = departmentCounts.get('Unknown'); // Returns null
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // GET METHOD: Retrieve value by key
        // → Returns null if key doesn't exist
        // ⚠️ NULL HANDLING: Always check for null return values

        // Safe value access with default
        Integer hrCount = departmentCounts.get('HR');
        if (hrCount == null) {
            hrCount = 0; // Default value
        }
        // Better approach using containsKey
        Integer itCount = departmentCounts.containsKey('IT') ?
                         departmentCounts.get('IT') : 0;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SAFE ACCESS: Check existence before getting value
        // → Prevents null handling issues
        // ✅ BEST PRACTICE: Use containsKey() for conditional access

        // Map size and checking operations
        Integer mapSize = departmentCounts.size();
        Boolean hasEngineering = departmentCounts.containsKey('Engineering');
        Boolean hasCount25 = departmentCounts.containsValue(25);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // MAP OPERATIONS: Size and membership testing
        // → containsKey() checks for key existence
        // → containsValue() checks for value existence (less common)

        // Removing entries
        Integer removedCount = departmentCounts.remove('Marketing');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // REMOVE METHOD: Delete key-value pair
        // → Returns the removed value or null if key didn't exist
        // 💡 CLEANUP: Remove entries no longer needed

        // Getting keys and values
        Set<String> allDepartments = departmentCounts.keySet();
        List<Integer> allCounts = departmentCounts.values();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // KEY/VALUE EXTRACTION: Get collections of keys or values
        // → keySet() returns Set of all keys
        // → values() returns List of all values (may have duplicates)
    }

    public static void demonstrateMapPatterns() {
        // Building lookup maps from query results
        List<Account> accounts = [SELECT Id, Name, Industry FROM Account LIMIT 100];

        // Map by Id (most common pattern)
        Map<Id, Account> accountsById = new Map<Id, Account>();
        for (Account acc : accounts) {
            accountsById.put(acc.Id, acc);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ID MAPPING: Create lookup table by record Id
            // → Essential pattern for relating data efficiently
            // 💡 PERFORMANCE: O(1) lookup vs O(n) list iteration
        }

        // Shortcut for Id-based maps
        Map<Id, Account> accountsByIdShortcut = new Map<Id, Account>(accounts);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CONSTRUCTOR SHORTCUT: Automatically maps by Id
        // → Only works with SObject lists and Id keys
        // ✅ PREFERRED: More concise than manual loop

        // Map by field value (custom grouping)
        Map<String, List<Account>> accountsByIndustry = new Map<String, List<Account>>();
        for (Account acc : accounts) {
            String industry = acc.Industry != null ? acc.Industry : 'Unknown';

            if (!accountsByIndustry.containsKey(industry)) {
                accountsByIndustry.put(industry, new List<Account>());
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // LIST INITIALIZATION: Create empty list for new key
                // → Required before adding items to the list
                // 💡 PATTERN: Initialize collection before use
            }

            accountsByIndustry.get(industry).add(acc);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // GROUPING: Add account to appropriate industry list
            // → Creates grouped data structure for processing
            // 💡 RESULT: One list per industry with all related accounts
        }

        // Processing grouped data
        for (String industry : accountsByIndustry.keySet()) {
            List<Account> industryAccounts = accountsByIndustry.get(industry);
            System.debug(industry + ' has ' + industryAccounts.size() + ' accounts');
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // GROUP PROCESSING: Handle each group separately
            // → Common pattern for aggregation and reporting
            // 💡 EFFICIENCY: Process related records together
        }

        // Counting occurrences pattern
        Map<String, Integer> industryCounts = new Map<String, Integer>();
        for (Account acc : accounts) {
            String industry = acc.Industry != null ? acc.Industry : 'Unknown';

            Integer currentCount = industryCounts.get(industry);
            if (currentCount == null) {
                currentCount = 0;
            }
            industryCounts.put(industry, currentCount + 1);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // COUNTING PATTERN: Increment count for each occurrence
            // → Handle null values for new keys
            // 💡 RESULT: Frequency map of field values
        }

        // Related record lookup pattern
        Set<Id> accountIds = accountsById.keySet();
        List<Contact> contacts = [
            SELECT Id, Name, AccountId, Email
            FROM Contact
            WHERE AccountId IN :accountIds
        ];

        Map<Id, List<Contact>> contactsByAccountId = new Map<Id, List<Contact>>();
        for (Contact con : contacts) {
            if (!contactsByAccountId.containsKey(con.AccountId)) {
                contactsByAccountId.put(con.AccountId, new List<Contact>());
            }
            contactsByAccountId.get(con.AccountId).add(con);
        }

        // Processing parent-child relationships
        for (Id accountId : accountIds) {
            Account acc = accountsById.get(accountId);
            List<Contact> accountContacts = contactsByAccountId.get(accountId);

            if (accountContacts != null) {
                System.debug(acc.Name + ' has ' + accountContacts.size() + ' contacts');
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // RELATIONSHIP PROCESSING: Handle parent with related children
                // → Efficient alternative to SOQL relationship queries
                // 💡 SCALABILITY: Avoids query limits with large datasets
            }
        }
    }
}
```

## Advanced Collection Patterns

### Nested Collections and Complex Data Structures

Real-world applications often require complex nested collection structures.

```apex
public class AdvancedCollectionPatterns {

    public static void demonstrateNestedCollections() {
        // Three-level nesting: Region -> Department -> Employee List
        Map<String, Map<String, List<String>>> organizationStructure =
            new Map<String, Map<String, List<String>>>();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // NESTED MAPS: Complex hierarchical data structure
        // → Each region contains departments, each department contains employees
        // ⚠️ COMPLEXITY: Requires careful null checking at each level

        // Initialize structure
        organizationStructure.put('North America', new Map<String, List<String>>());
        organizationStructure.put('Europe', new Map<String, List<String>>());

        // Add departments to regions
        organizationStructure.get('North America').put('Sales', new List<String>());
        organizationStructure.get('North America').put('Engineering', new List<String>());

        // Add employees to departments
        organizationStructure.get('North America').get('Sales').addAll(
            new List<String>{'John Doe', 'Jane Smith', 'Bob Johnson'}
        );
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DEEP NESTING ACCESS: Multiple .get() calls to reach data
        // → Requires each level to be initialized
        // 💡 MAINTENANCE: Consider wrapper classes for complex structures

        // Safe access pattern for nested collections
        Map<String, List<String>> northAmericaDepts = organizationStructure.get('North America');
        if (northAmericaDepts != null) {
            List<String> salesTeam = northAmericaDepts.get('Sales');
            if (salesTeam != null && !salesTeam.isEmpty()) {
                String firstSalesPerson = salesTeam.get(0);
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // NULL-SAFE ACCESS: Check each level before accessing
                // → Prevents NullPointerException in complex structures
                // ✅ DEFENSIVE: Essential for nested collection safety
            }
        }
    }

    public static void demonstrateBulkificationPatterns() {
        // Scenario: Update Account fields based on related Opportunity data
        List<Account> accountsToUpdate = [SELECT Id, Name FROM Account LIMIT 100];
        Set<Id> accountIds = new Set<Id>();

        // Collect Account IDs
        for (Account acc : accountsToUpdate) {
            accountIds.add(acc.Id);
        }

        // Get related Opportunities in single query
        List<Opportunity> opportunities = [
            SELECT Id, AccountId, Amount, StageName, CloseDate
            FROM Opportunity
            WHERE AccountId IN :accountIds
        ];

        // Group Opportunities by Account
        Map<Id, List<Opportunity>> oppsByAccount = new Map<Id, List<Opportunity>>();
        for (Opportunity opp : opportunities) {
            if (!oppsByAccount.containsKey(opp.AccountId)) {
                oppsByAccount.put(opp.AccountId, new List<Opportunity>());
            }
            oppsByAccount.get(opp.AccountId).add(opp);
        }

        // Calculate aggregates for each Account
        Map<Id, Decimal> totalAmountsByAccount = new Map<Id, Decimal>();
        Map<Id, Integer> oppCountsByAccount = new Map<Id, Integer>();

        for (Id accountId : oppsByAccount.keySet()) {
            List<Opportunity> accountOpps = oppsByAccount.get(accountId);
            Decimal totalAmount = 0;

            for (Opportunity opp : accountOpps) {
                if (opp.Amount != null) {
                    totalAmount += opp.Amount;
                }
            }

            totalAmountsByAccount.put(accountId, totalAmount);
            oppCountsByAccount.put(accountId, accountOpps.size());
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // AGGREGATION PATTERN: Calculate values from related records
            // → Avoids aggregate SOQL queries and their limitations
            // 💡 FLEXIBILITY: Custom business logic in calculations
        }

        // Update Accounts with calculated values
        List<Account> accountsForUpdate = new List<Account>();
        for (Account acc : accountsToUpdate) {
            Decimal totalAmount = totalAmountsByAccount.get(acc.Id);
            Integer oppCount = oppCountsByAccount.get(acc.Id);

            if (totalAmount != null || oppCount != null) {
                Account updateAccount = new Account();
                updateAccount.Id = acc.Id;
                updateAccount.AnnualRevenue = totalAmount != null ? totalAmount : 0;
                updateAccount.Description = 'Opportunities: ' + (oppCount != null ? oppCount : 0);

                accountsForUpdate.add(updateAccount);
            }
        }

        // Bulk update
        if (!accountsForUpdate.isEmpty()) {
            try {
                update accountsForUpdate;
                // ^^^^^^^^^^^^^^^^^^^^^^^^
                // BULK UPDATE: Single DML operation for all changes
                // → Efficient use of governor limits
                // ✅ SCALABILITY: Handles large datasets without limit issues
            } catch (DmlException e) {
                System.debug('Bulk update failed: ' + e.getMessage());
            }
        }
    }
}
```

## Collection Performance and Best Practices

### Performance Considerations

```apex
public class CollectionPerformance {

    public static void demonstratePerformancePatterns() {
        // List vs Set performance for membership testing
        List<String> largeList = new List<String>();
        Set<String> largeSet = new Set<String>();

        // Populate collections (simulation)
        for (Integer i = 0; i < 10000; i++) {
            String value = 'item_' + i;
            largeList.add(value);
            largeSet.add(value);
        }

        // Performance comparison for contains operation
        String searchValue = 'item_5000';

        // List.contains() - O(n) linear search
        Boolean foundInList = largeList.contains(searchValue);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // LINEAR SEARCH: Checks each element until found
        // → Performance degrades with collection size
        // ⚠️ SCALABILITY: Slow for large collections

        // Set.contains() - O(1) average hash lookup
        Boolean foundInSet = largeSet.contains(searchValue);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // HASH LOOKUP: Direct access using hash table
        // → Constant time regardless of collection size
        // ✅ PERFORMANCE: Always prefer for membership testing

        // Map.get() vs List iteration for lookups
        Map<String, String> lookupMap = new Map<String, String>();
        for (Integer i = 0; i < 1000; i++) {
            lookupMap.put('key_' + i, 'value_' + i);
        }

        // Efficient lookup using Map
        String value = lookupMap.get('key_500'); // O(1)
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DIRECT LOOKUP: Immediate access by key
        // → Most efficient for key-based data retrieval

        // Inefficient lookup using List iteration
        String foundValue = null;
        for (String key : largeList) {
            if (key == 'item_500') {
                foundValue = key; // O(n)
                break;
            }
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // LINEAR ITERATION: Must check each element
        // → Avoid when Map lookup is possible
        // 💡 RULE: Use Map for key-based access, Set for membership, List for order
    }

    public static void demonstrateMemoryOptimization() {
        // Minimize object creation in loops
        List<String> results = new List<String>();

        // BAD - Creates many temporary objects
        for (Integer i = 0; i < 1000; i++) {
            results.add('Result: ' + String.valueOf(i) + ' - Complete');
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // OBJECT CREATION: Multiple string objects created per iteration
            // → Inefficient memory usage and garbage collection pressure
        }

        // BETTER - Minimize concatenation
        results.clear();
        for (Integer i = 0; i < 1000; i++) {
            results.add(String.format('Result: {0} - Complete', new Object[]{i}));
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // STRING.FORMAT: More efficient for complex string construction
            // → Reduces intermediate string object creation
        }

        // Collection sizing optimization
        List<String> optimizedList = new List<String>();
        // If you know approximate size, pre-size collections
        optimizedList = new List<String>(); // Dynamic resizing
        // vs
        // List with known capacity reduces memory reallocation
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CAPACITY PLANNING: Reduces dynamic resizing overhead
        // → More important for very large collections
        // 💡 OPTIMIZATION: Most beneficial when size is predictable
    }
}
```

## Common Gotchas

### 💀 Index Out of Bounds

```apex
// BAD - No bounds checking
List<String> names = new List<String>{'John', 'Jane'};
String thirdName = names.get(2); // IndexOutOfBoundsException!

// GOOD - Always check bounds
if (names.size() > 2) {
    String thirdName = names.get(2);
}

// BETTER - Use isEmpty() for better readability
if (!names.isEmpty() && names.size() > 2) {
    String thirdName = names.get(2);
}
```

### ⚠️ Null Map Values

```apex
// BAD - Assumes value exists
Map<String, Integer> counts = new Map<String, Integer>();
Integer salesCount = counts.get('Sales') + 10; // NullPointerException!

// GOOD - Check for null
Integer salesCount = counts.get('Sales');
if (salesCount == null) {
    salesCount = 0;
}
salesCount += 10;

// BETTER - Use containsKey
Integer salesCount = counts.containsKey('Sales') ? counts.get('Sales') : 0;
salesCount += 10;
```

### 💡 Collection Modification During Iteration

```apex
// BAD - Modifying collection while iterating
List<String> names = new List<String>{'John', 'Jane', 'Bob'};
for (String name : names) {
    if (name == 'Jane') {
        names.remove(name); // ConcurrentModificationException!
    }
}

// GOOD - Iterate backwards when removing by index
for (Integer i = names.size() - 1; i >= 0; i--) {
    if (names.get(i) == 'Jane') {
        names.remove(i);
    }
}

// BETTER - Collect items to remove, then remove them
List<String> toRemove = new List<String>();
for (String name : names) {
    if (name == 'Jane') {
        toRemove.add(name);
    }
}
for (String name : toRemove) {
    names.remove(name);
}
```

## Exam Tips

### High-Priority Concepts for Certification

1. **List Operations**: add(), get(), set(), remove(), size(), isEmpty()
2. **Set Uniqueness**: Automatic deduplication, contains() performance
3. **Map Lookups**: put(), get(), containsKey(), keySet(), values()
4. **Collection Conversions**: List to Set, Set to List, SObject List to Map
5. **Bulkification**: Using collections to avoid SOQL/DML in loops

### Common Exam Scenarios

- **Governor Limits**: Questions about collection-based bulkification
- **Performance**: When to use Set vs List for membership testing
- **Null Handling**: Map.get() returning null for missing keys
- **Index Bounds**: Preventing IndexOutOfBoundsException
- **Memory Usage**: Choosing appropriate collection type for use case

### Key Points to Remember

- Lists maintain order and allow duplicates
- Sets ensure uniqueness and provide fast lookups
- Maps associate keys with values for efficient data relationships
- Always check bounds and null values before accessing collection elements
- Use collections for bulkification to avoid governor limit exceptions

## Practice Exercises

### Exercise 1: Collection Type Selection

For each scenario, choose the most appropriate collection type and explain why:

1. Storing user IDs to prevent duplicate processing
2. Maintaining the order of records as they were processed
3. Creating a lookup table from record ID to record name
4. Collecting unique industry values from Account records
5. Building a list of records to insert in bulk

### Exercise 2: Bulkification Challenge

Refactor this inefficient code to use proper collection patterns:

```apex
// INEFFICIENT CODE - Fix the bulkification issues
trigger ContactTrigger on Contact (after insert) {
    for (Contact con : Trigger.new) {
        Account acc = [SELECT Id, Description FROM Account WHERE Id = :con.AccountId];
        acc.Description = 'Has contacts';
        update acc;
    }
}
```

### Exercise 3: Complex Data Grouping

Write a method that groups Opportunities by Account and Stage, returning a nested Map structure:

```apex
public static Map<Id, Map<String, List<Opportunity>>> groupOpportunities(List<Opportunity> opps) {
    // Return: Account ID -> Stage Name -> List of Opportunities
    // Handle null values appropriately
}
```

## Related Topics

### Prerequisites
- **[Variables and Data Types](variables-and-data-types)** - Understanding primitive types used in collections

### Next Topics in Learning Path
- **[Control Flow and Logic](control-flow-and-logic)** - Use collections in loops and conditional statements
- **[Database Operations](database-operations)** - Query results into collections and bulk DML

### Advanced Topics
- **[Trigger Development](trigger-development)** - Apply collection patterns for bulkification
- **[Performance Optimization](performance-optimization)** - Advanced collection performance strategies

Master collections and you'll have the foundation for writing scalable, efficient Apex code that handles any data volume!