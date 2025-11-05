---
title: "SOQL Fundamentals"
section: "apex"
order: 3
difficulty: "beginner"
readTime: "30 min"
description: "Master Salesforce Object Query Language (SOQL) with comprehensive examples covering queries, filters, relationships, and best practices."
overview: "Learn how to query Salesforce data efficiently using SOQL, including filtering, sorting, relationships, and aggregate functions."
concepts: ["soql", "queries", "filtering", "relationships", "aggregates", "governor-limits", "selective-queries"]
prerequisites: ["variables-and-data-types", "collections-deep-dive"]
relatedTopics: ["control-flow-and-logic", "trigger-bulkification-best-practices"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

SOQL (Salesforce Object Query Language) is the primary way to read data from Salesforce. Understanding SOQL is essential for any Apex developer.

## Understanding SOQL

SOQL is a SQL-like language designed specifically for Salesforce:
- **Read-Only**: SOQL only retrieves data, doesn't modify it
- **Type-Safe**: Returns strongly-typed Salesforce objects
- **Governor Limits**: Maximum 100 SOQL queries per transaction
- **Relationship Support**: Query related objects in single query
- **Filtered Results**: Built-in WHERE clause filtering

**Key Principles:**
- **Selectivity**: Use indexed fields for better performance
- **Efficiency**: Minimize queries and return only needed fields
- **Bulkification**: Query for collections, not individual records
- **Limits**: Always consider governor limit implications

## SOQL Structure

### Basic Components
Every SOQL query has these elements:
- **SELECT**: Fields to retrieve
- **FROM**: Object to query
- **WHERE**: Filter conditions (optional)
- **ORDER BY**: Sort results (optional)
- **LIMIT**: Maximum records to return (optional)

### Advanced Features
- **Relationships**: Parent-to-child and child-to-parent
- **Aggregates**: COUNT, SUM, AVG, MIN, MAX
- **GROUP BY**: Group aggregate results
- **HAVING**: Filter grouped results
- **FOR UPDATE**: Lock records for update

---

# Code Examples

Let's explore SOQL with detailed, annotated examples.

## Basic SOQL Queries

Understanding the foundation of data retrieval.

```apex
public class BasicSOQL {

    public static void demonstrateBasicQueries() {
        // Simple query - all accounts
        List<Account> allAccounts = [SELECT Id, Name FROM Account];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BASIC SOQL: Retrieve specific fields from object
        // → Always specify Id and fields you need
        // 💡 BEST PRACTICE: Never use SELECT * equivalent
        // → Returns List<Account>

        // Query with single filter
        List<Account> techAccounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Industry = 'Technology'
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // WHERE CLAUSE: Filter results by condition
        // → String values use single quotes
        // 💡 PERFORMANCE: Use indexed fields when possible

        // Query with multiple filters
        List<Account> filteredAccounts = [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WHERE Industry = 'Technology'
            AND AnnualRevenue > 1000000
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COMPOUND WHERE: Multiple conditions with AND
        // → Both conditions must be true
        // ✅ SELECTIVE QUERY: More filters = better performance

        // Query with OR conditions
        List<Account> orFilterAccounts = [
            SELECT Id, Name, Rating
            FROM Account
            WHERE Rating = 'Hot'
            OR Rating = 'Warm'
        ];
        // ^^^^^^^^^^^^^^^^^^
        // OR OPERATOR: Match either condition
        // → Less selective than AND

        // Better approach using IN
        List<Account> inFilterAccounts = [
            SELECT Id, Name, Rating
            FROM Account
            WHERE Rating IN ('Hot', 'Warm')
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // IN OPERATOR: Match any value in list
        // → More readable than multiple ORs
        // ✅ BEST PRACTICE: Use IN for multiple value matching

        // Query with LIMIT
        List<Account> limitedAccounts = [
            SELECT Id, Name
            FROM Account
            WHERE Industry = 'Technology'
            LIMIT 100
        ];
        // ^^^^^^^^^^
        // LIMIT CLAUSE: Maximum records to return
        // → Important for governor limits
        // 💡 TIP: Use LIMIT when you only need subset
    }

    public static void demonstrateSorting() {
        // Query with ORDER BY
        List<Account> sortedAccounts = [
            SELECT Id, Name, AnnualRevenue
            FROM Account
            ORDER BY AnnualRevenue DESC
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ORDER BY: Sort results
        // → DESC = descending, ASC = ascending (default)
        // 💡 PERFORMANCE: Sorting adds overhead

        // Multiple sort fields
        List<Account> multiSortAccounts = [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            ORDER BY Industry ASC, AnnualRevenue DESC
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // MULTIPLE SORT FIELDS: Primary and secondary sorting
        // → First by Industry ascending, then by Revenue descending

        // Query with NULLS FIRST/LAST
        List<Account> nullHandlingSort = [
            SELECT Id, Name, AnnualRevenue
            FROM Account
            ORDER BY AnnualRevenue DESC NULLS LAST
        ];
        // ^^^^^^^^^^^^^
        // NULLS HANDLING: Control where null values appear
        // → NULLS FIRST or NULLS LAST
        // 💡 DEFAULT: NULLS FIRST for ASC, NULLS LAST for DESC
    }

    public static Account getAccountById(Id accountId) {
        // Query expecting single record
        List<Account> accounts = [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];
        // ^^^^^^^^
        // BIND VARIABLE: Use :variableName for dynamic values
        // → Prevents SOQL injection
        // ✅ SECURITY: Always use bind variables for user input

        // Safe single record access
        if (!accounts.isEmpty()) {
            return accounts[0];
        }
        return null;
    }

    public static void demonstrateBindVariables() {
        // Bind variables in queries
        String targetIndustry = 'Technology';
        Decimal minRevenue = 1000000;
        Integer recordLimit = 50;

        List<Account> accounts = [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WHERE Industry = :targetIndustry
            AND AnnualRevenue > :minRevenue
            LIMIT :recordLimit
        ];
        // ^^^^^^^^^^^^^^^^^^
        // BIND VARIABLES: Reference Apex variables in SOQL
        // → Syntax: :variableName
        // 💡 DYNAMIC QUERIES: Build flexible, reusable queries

        // Bind variables with collections
        Set<String> industries = new Set<String>{'Technology', 'Healthcare', 'Finance'};
        List<Id> accountIds = new List<Id>{/* some IDs */};

        List<Account> multiValueAccounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Industry IN :industries
            AND Id IN :accountIds
        ];
        // ^^^^^^^^^^^^^^^^^^^^
        // COLLECTION BIND: Use collections in IN clause
        // → More efficient than building dynamic SOQL strings
    }
}
```

## Relationship Queries

Query related data efficiently.

```apex
public class RelationshipQueries {

    public static void demonstrateChildToParent() {
        // Child-to-parent relationship (lookup/master-detail)
        List<Contact> contacts = [
            SELECT Id, Name, Email,
                Account.Name,
                Account.Industry,
                Account.Owner.Name
            FROM Contact
            WHERE Account.Industry = 'Technology'
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^
        // PARENT RELATIONSHIP: Traverse to parent using relationship name
        // → Use dot notation: Parent.Field
        // 💡 SPAN: Can traverse up to 5 levels
        // → Contact → Account → Owner (User)

        // Access parent fields
        for (Contact con : contacts) {
            if (con.Account != null) {
                // ^^^^^^^^^^^^^^^^^^^^^^
                // NULL CHECK: Parent might not exist
                // → Always check before accessing parent fields
                // 💀 EXAM TRAP: NullPointerException if parent is null
                String accountName = con.Account.Name;
                String ownerName = con.Account.Owner.Name;
                System.debug('Contact: ' + con.Name + ', Account: ' + accountName);
            }
        }

        // Multi-level parent traversal
        List<Opportunity> opps = [
            SELECT Id, Name,
                Account.Name,
                Account.Owner.Name,
                Account.Owner.Profile.Name
            FROM Opportunity
            WHERE Amount > 100000
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // MULTI-LEVEL: Traverse multiple relationships
        // → Opportunity → Account → Owner → Profile
        // ⚠️ LIMIT: Maximum 5 relationship levels
    }

    public static void demonstrateParentToChild() {
        // Parent-to-child relationship (subquery)
        List<Account> accounts = [
            SELECT Id, Name, Industry,
                (SELECT Id, FirstName, LastName, Email
                 FROM Contacts
                 WHERE Email != null
                 ORDER BY LastName)
            FROM Account
            WHERE Industry = 'Technology'
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^
        // CHILD RELATIONSHIP QUERY: Subquery for related records
        // → Relationship name is plural: Contacts (not Contact)
        // 💡 RETURNS: List of related records for each parent

        // Access child records
        for (Account acc : accounts) {
            System.debug('Account: ' + acc.Name);

            if (acc.Contacts != null && !acc.Contacts.isEmpty()) {
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // CHILD RECORDS CHECK: Verify related records exist
                // → Returns empty list if no children, never null
                // 💡 ALWAYS: Check isEmpty() before processing

                System.debug('  Contact count: ' + acc.Contacts.size());

                for (Contact con : acc.Contacts) {
                    System.debug('  - ' + con.FirstName + ' ' + con.LastName);
                }
            } else {
                System.debug('  No contacts');
            }
        }

        // Multiple child relationships
        List<Account> accountsWithMultipleChildren = [
            SELECT Id, Name,
                (SELECT Id, FirstName, LastName FROM Contacts),
                (SELECT Id, Name, Amount FROM Opportunities WHERE StageName = 'Closed Won'),
                (SELECT Id, Subject, ActivityDate FROM Tasks WHERE Status = 'Open')
            FROM Account
            LIMIT 100
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^
        // MULTIPLE SUBQUERIES: Query multiple child relationships
        // → Each subquery counts toward query row limits
        // ⚠️ GOVERNOR LIMITS: Total child records across all parents limited
    }

    public static void demonstrateRelationshipNames() {
        // Standard relationship names
        List<Contact> standardRelationships = [
            SELECT Id, Name,
                Account.Name,           // Standard lookup: append .Name
                ReportsTo.Name          // Self-lookup: uses relationship name
            FROM Contact
        ];

        // Custom relationship names
        List<Opportunity> customRelationships = [
            SELECT Id, Name,
                Account.Name,                    // Standard object
                Custom_Related_Object__r.Name    // Custom object: append __r
            FROM Opportunity
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CUSTOM RELATIONSHIPS: Use __r for custom objects
        // → Field: Custom_Related_Object__c
        // → Relationship: Custom_Related_Object__r
        // 💡 CONVENTION: Replace __c with __r for relationship

        // Child relationship for custom objects
        List<Account> customChildRelationships = [
            SELECT Id, Name,
                (SELECT Id, Name FROM Custom_Children__r)
            FROM Account
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^
        // CUSTOM CHILD RELATIONSHIP: Use __r suffix
        // → Plural relationship name in subquery
    }

    public static Map<Id, Account> getAccountsWithContactCounts() {
        // Practical example: Accounts with related data
        Map<Id, Account> accountsMap = new Map<Id, Account>([
            SELECT Id, Name, Industry, AnnualRevenue,
                (SELECT Id, Name, Email FROM Contacts WHERE Email != null),
                (SELECT Id, Amount FROM Opportunities WHERE StageName = 'Closed Won')
            FROM Account
            WHERE Industry IN ('Technology', 'Healthcare')
            ORDER BY AnnualRevenue DESC
            LIMIT 1000
        ]);
        // ^^^^^^^^^^^^^^^^^^^^^
        // MAP CONSTRUCTION: Create map directly from query
        // → Key is record Id, value is full object
        // ✅ BEST PRACTICE: Efficient for lookups

        // Process with relationship data
        for (Account acc : accountsMap.values()) {
            Integer contactCount = acc.Contacts != null ? acc.Contacts.size() : 0;
            Decimal totalRevenue = 0;

            if (acc.Opportunities != null) {
                for (Opportunity opp : acc.Opportunities) {
                    totalRevenue += opp.Amount != null ? opp.Amount : 0;
                }
            }

            System.debug(acc.Name + ': ' + contactCount + ' contacts, $' + totalRevenue + ' revenue');
        }

        return accountsMap;
    }
}
```

## Aggregate Functions and GROUP BY

Perform calculations on query results.

```apex
public class AggregateQueries {

    public static void demonstrateAggregates() {
        // COUNT function
        Integer totalAccounts = [SELECT COUNT() FROM Account];
        // ^^^^^^^^^^^^^^^^^^^^^
        // COUNT(): Count total records
        // → Returns Integer, not List
        // 💡 EFFICIENT: More performant than querying all records

        Integer techAccountCount = [
            SELECT COUNT()
            FROM Account
            WHERE Industry = 'Technology'
        ];

        // COUNT with field
        Integer accountsWithRevenue = [
            SELECT COUNT(AnnualRevenue)
            FROM Account
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COUNT(field): Count non-null values
        // → Excludes null values from count

        // Aggregate functions in AggregateResult
        AggregateResult result = [
            SELECT
                COUNT(Id) totalCount,
                SUM(AnnualRevenue) totalRevenue,
                AVG(AnnualRevenue) avgRevenue,
                MIN(AnnualRevenue) minRevenue,
                MAX(AnnualRevenue) maxRevenue
            FROM Account
            WHERE Industry = 'Technology'
        ][0];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // AGGREGATE RESULT: Returns AggregateResult object
        // → Use get() method to access values
        // 💡 SINGLE RECORD: Always returns one result (use [0])

        Integer count = (Integer) result.get('totalCount');
        Decimal total = (Decimal) result.get('totalRevenue');
        Decimal average = (Decimal) result.get('avgRevenue');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // TYPE CASTING: AggregateResult returns Object type
        // → Must cast to appropriate type
        // 💀 EXAM TRAP: Forgetting to cast causes errors
    }

    public static void demonstrateGroupBy() {
        // GROUP BY single field
        List<AggregateResult> resultsByIndustry = [
            SELECT Industry, COUNT(Id) accountCount
            FROM Account
            GROUP BY Industry
        ];
        // ^^^^^^^^^^^^^^^^^^
        // GROUP BY: Aggregate results by field value
        // → Returns one result per unique field value
        // 💡 USE CASE: Category-level statistics

        // Process grouped results
        for (AggregateResult ar : resultsByIndustry) {
            String industry = (String) ar.get('Industry');
            Integer count = (Integer) ar.get('accountCount');
            System.debug(industry + ': ' + count + ' accounts');
        }

        // GROUP BY multiple fields
        List<AggregateResult> multiGroupResults = [
            SELECT Industry, Rating,
                COUNT(Id) accountCount,
                AVG(AnnualRevenue) avgRevenue
            FROM Account
            WHERE Industry != null AND Rating != null
            GROUP BY Industry, Rating
            ORDER BY Industry, Rating
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^
        // MULTIPLE GROUP BY: Group by multiple fields
        // → Creates groups for each unique combination
        // 💡 ANALYSIS: Multi-dimensional aggregation

        // GROUP BY with date functions
        List<AggregateResult> oppsByMonth = [
            SELECT
                CALENDAR_YEAR(CloseDate) year,
                CALENDAR_MONTH(CloseDate) month,
                COUNT(Id) oppCount,
                SUM(Amount) totalAmount
            FROM Opportunity
            WHERE CloseDate = THIS_YEAR
            GROUP BY CALENDAR_YEAR(CloseDate), CALENDAR_MONTH(CloseDate)
            ORDER BY CALENDAR_YEAR(CloseDate), CALENDAR_MONTH(CloseDate)
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE FUNCTIONS: Extract date components
        // → CALENDAR_YEAR, CALENDAR_MONTH, CALENDAR_QUARTER
        // 💡 REPORTING: Time-based analysis
    }

    public static void demonstrateHaving() {
        // HAVING clause - filter grouped results
        List<AggregateResult> highValueIndustries = [
            SELECT Industry, SUM(AnnualRevenue) totalRevenue
            FROM Account
            WHERE Industry != null
            GROUP BY Industry
            HAVING SUM(AnnualRevenue) > 10000000
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // HAVING: Filter after grouping
        // → Similar to WHERE but for aggregate results
        // 💡 DIFFERENCE: WHERE filters before grouping, HAVING filters after

        // HAVING with COUNT
        List<AggregateResult> industriesWithManyAccounts = [
            SELECT Industry, COUNT(Id) accountCount
            FROM Account
            GROUP BY Industry
            HAVING COUNT(Id) > 50
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // COUNT FILTER: Only groups with many records
        // → Useful for finding significant categories
    }

    public static Map<String, Decimal> calculateRevenueByIndustry() {
        // Practical example: Revenue analysis
        Map<String, Decimal> revenueByIndustry = new Map<String, Decimal>();

        List<AggregateResult> results = [
            SELECT Industry, SUM(AnnualRevenue) totalRevenue
            FROM Account
            WHERE Industry != null AND AnnualRevenue != null
            GROUP BY Industry
            ORDER BY SUM(AnnualRevenue) DESC
        ];

        for (AggregateResult ar : results) {
            String industry = (String) ar.get('Industry');
            Decimal revenue = (Decimal) ar.get('totalRevenue');
            revenueByIndustry.put(industry, revenue);
        }

        return revenueByIndustry;
    }

    public static void demonstrateComplexAggregates() {
        // Complex aggregate query
        List<AggregateResult> complexAnalysis = [
            SELECT
                Account.Industry industry,
                Account.Rating rating,
                StageName stage,
                COUNT(Id) oppCount,
                SUM(Amount) totalAmount,
                AVG(Amount) avgAmount,
                MIN(Amount) minAmount,
                MAX(Amount) maxAmount
            FROM Opportunity
            WHERE Amount != null
            AND CloseDate = THIS_YEAR
            AND Account.Industry != null
            GROUP BY Account.Industry, Account.Rating, StageName
            HAVING COUNT(Id) > 5
            ORDER BY Account.Industry, Account.Rating, StageName
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COMPREHENSIVE AGGREGATE: Multiple dimensions and calculations
        // → Combines parent relationships, grouping, and filtering
        // 💡 BUSINESS INTELLIGENCE: Detailed performance analysis

        for (AggregateResult ar : complexAnalysis) {
            System.debug(
                'Industry: ' + ar.get('industry') +
                ', Rating: ' + ar.get('rating') +
                ', Stage: ' + ar.get('stage') +
                ', Avg Amount: $' + ar.get('avgAmount')
            );
        }
    }
}
```

## Advanced SOQL Features

Powerful query capabilities for complex scenarios.

```apex
public class AdvancedSOQL {

    public static void demonstrateDateLiterals() {
        // Date literals
        List<Opportunity> thisYearOpps = [
            SELECT Id, Name, CloseDate
            FROM Opportunity
            WHERE CloseDate = THIS_YEAR
        ];
        // ^^^^^^^^^^^^^^^^
        // DATE LITERAL: Predefined date ranges
        // → THIS_YEAR, LAST_YEAR, THIS_MONTH, etc.
        // 💡 DYNAMIC: Automatically adjusts to current date

        // Common date literals
        List<Opportunity> recentOpps = [
            SELECT Id, Name, CloseDate
            FROM Opportunity
            WHERE CloseDate = LAST_N_DAYS:30
        ];
        // ^^^^^^^^^^^^^^^^^
        // RELATIVE DATE: N days/months/quarters/years ago
        // → LAST_N_DAYS:30, NEXT_N_MONTHS:6, etc.

        // Date range literals
        List<Opportunity> quarterOpps = [
            SELECT Id, Name, CloseDate
            FROM Opportunity
            WHERE CloseDate = THIS_QUARTER
        ];

        // Combining date filters
        List<Opportunity> dateRangeOpps = [
            SELECT Id, Name, CloseDate
            FROM Opportunity
            WHERE CloseDate >= LAST_N_MONTHS:6
            AND CloseDate <= NEXT_N_MONTHS:3
        ];
    }

    public static void demonstrateTextSearching() {
        // LIKE operator for pattern matching
        List<Account> nameSearchAccounts = [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE 'Acme%'
        ];
        // ^^^^^^^^^^^^^^^^^^
        // LIKE OPERATOR: Pattern matching with wildcards
        // → % matches any characters
        // → _ matches single character

        // Contains pattern
        List<Account> containsAccounts = [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE '%Technologies%'
        ];
        // ^^^^^^^^^^^^^^^^
        // CONTAINS: % before and after
        // → Matches anywhere in string
        // ⚠️ PERFORMANCE: Non-selective, can be slow

        // Multiple LIKE conditions
        List<Contact> emailSearchContacts = [
            SELECT Id, Name, Email
            FROM Contact
            WHERE Email LIKE '%@acme.com'
            OR Email LIKE '%@example.com'
        ];
    }

    public static void demonstrateNullChecking() {
        // NULL value checking
        List<Account> accountsWithoutIndustry = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Industry = null
        ];
        // ^^^^^^^^^^^^^^^^^^^
        // NULL CHECK: Find records with null values
        // → Use = null, not IS NULL

        // NOT NULL
        List<Account> accountsWithIndustry = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Industry != null
        ];
        // ^^^^^^^^^^^^^^^^^^^^
        // NOT NULL: Find records with values
        // → Excludes null records

        // Combining null checks
        List<Opportunity> validOpps = [
            SELECT Id, Name, Amount, CloseDate
            FROM Opportunity
            WHERE Amount != null
            AND CloseDate != null
            AND StageName != null
        ];
    }

    public static void demonstrateForUpdate() {
        // FOR UPDATE - lock records
        List<Account> accountsToUpdate = [
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE Industry = 'Technology'
            LIMIT 100
            FOR UPDATE
        ];
        // ^^^^^^^^^^^
        // FOR UPDATE: Lock records for exclusive access
        // → Prevents concurrent modifications
        // 💡 USE CASE: Critical updates requiring data consistency
        // ⚠️ WARNING: Can cause lock exceptions

        // Process and update locked records
        for (Account acc : accountsToUpdate) {
            acc.AnnualRevenue = acc.AnnualRevenue * 1.1; // 10% increase
        }
        update accountsToUpdate;
    }

    public static void demonstrateQueryScope() {
        // ALL ROWS - include deleted records
        List<Account> allAccountsIncludingDeleted = [
            SELECT Id, Name, IsDeleted
            FROM Account
            WHERE Name LIKE 'Test%'
            ALL ROWS
        ];
        // ^^^^^^^^^
        // ALL ROWS: Include deleted and archived records
        // → Useful for data recovery scenarios
        // 💡 RECYCLE BIN: Query recently deleted records

        // Access deleted status
        for (Account acc : allAccountsIncludingDeleted) {
            if (acc.IsDeleted) {
                System.debug('Deleted account: ' + acc.Name);
            }
        }
    }

    public static void demonstrateWithSecurity() {
        // WITH SECURITY_ENFORCED
        List<Account> secureAccounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Industry = 'Technology'
            WITH SECURITY_ENFORCED
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^
        // SECURITY ENFORCED: Respect user permissions
        // → Throws exception if user lacks field access
        // ✅ SECURITY: Enforce FLS and object permissions
        // 💡 MODERN: Preferred over manual permission checking
    }

    public static void demonstrateComplexWhere() {
        // Complex WHERE with parentheses
        List<Opportunity> complexFilterOpps = [
            SELECT Id, Name, Amount, StageName
            FROM Opportunity
            WHERE (Amount > 100000 AND StageName = 'Negotiation')
            OR (Amount > 500000 AND StageName = 'Proposal')
            OR (StageName = 'Closed Won' AND CloseDate = THIS_QUARTER)
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // COMPLEX CONDITIONS: Use parentheses for grouping
        // → Controls evaluation order
        // ✅ CLARITY: Makes complex logic readable

        // IN with subquery (not supported in Apex)
        // Use this pattern instead:
        Set<Id> accountIds = new Set<Id>();
        for (Account acc : [SELECT Id FROM Account WHERE Industry = 'Technology']) {
            accountIds.add(acc.Id);
        }

        List<Contact> contactsInTechAccounts = [
            SELECT Id, Name, Email
            FROM Contact
            WHERE AccountId IN :accountIds
        ];
        // ^^^^^^^^^^^^^^^^^^
        // SEMI-JOIN ALTERNATIVE: Two-step query
        // → SOQL doesn't support subqueries in FROM clause
    }
}
```

---

# Performance and Best Practices

## Query Selectivity

```apex
// ✅ SELECTIVE - Uses indexed field
List<Account> accounts = [
    SELECT Id, Name
    FROM Account
    WHERE Id = :accountId
];

// ✅ SELECTIVE - Uses indexed field with specific value
List<Contact> contacts = [
    SELECT Id, Name, Email
    FROM Contact
    WHERE Email = 'john@example.com'
];

// ⚠️ NON-SELECTIVE - LIKE with leading wildcard
List<Account> badQuery = [
    SELECT Id, Name
    FROM Account
    WHERE Name LIKE '%Technologies%'
];

// ✅ BETTER - More specific pattern
List<Account> betterQuery = [
    SELECT Id, Name
    FROM Account
    WHERE Name LIKE 'Acme%'
    AND Industry = 'Technology'
];
```

## Governor Limit Best Practices

```apex
// ❌ BAD - Query in loop
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
}

// ✅ GOOD - Single query before loop
Set<Id> accountIds = new Set<Id>();
for (Account acc : accounts) {
    accountIds.add(acc.Id);
}
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact con : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
    if (!contactsByAccount.containsKey(con.AccountId)) {
        contactsByAccount.put(con.AccountId, new List<Contact>());
    }
    contactsByAccount.get(con.AccountId).add(con);
}
```

## Field Selection

```apex
// ❌ BAD - Querying unnecessary fields
List<Account> accounts = [
    SELECT Id, Name, Description, BillingStreet, BillingCity,
           BillingState, BillingPostalCode, BillingCountry,
           ShippingStreet, ShippingCity, ShippingState,
           ShippingPostalCode, ShippingCountry, Phone, Fax
    FROM Account
];

// ✅ GOOD - Only query fields you need
List<Account> accounts = [
    SELECT Id, Name, Industry
    FROM Account
];
```

---

# Common Gotchas

## 💀 Query Limits

- Maximum 100 SOQL queries per transaction
- Maximum 50,000 records returned per query
- Aggregate queries limited to 2,000 rows

## ⚠️ Relationship Limits

- Maximum 5 levels of parent relationships
- Child relationship queries count toward total query row limits

## 💡 Query Optimization Tips

1. Always use WHERE clauses with indexed fields
2. Use LIMIT when you don't need all records
3. Query only fields you actually need
4. Use relationship queries instead of separate queries
5. Cache query results when possible

---

# Exam Tips

## High-Priority Concepts

1. **Governor Limits**: 100 SOQL queries per transaction
2. **Relationship Queries**: Parent-to-child (subqueries) vs child-to-parent (dot notation)
3. **Aggregate Functions**: COUNT, SUM, AVG with AggregateResult
4. **Selectivity**: Use indexed fields for better performance
5. **Bind Variables**: Use :variable syntax for dynamic values

## Common Exam Scenarios

- Identifying non-bulkified queries (SOQL in loops)
- Understanding relationship query syntax
- Proper use of aggregate functions and GROUP BY
- Date literal usage
- Query governor limit calculations

## Key Points to Remember

- SOQL is case-insensitive for keywords
- String values in WHERE clauses are case-sensitive
- Always use bind variables for dynamic values
- Use Maps for efficient query result access
- Check for null before accessing parent/child relationships

---

# Related Topics

## Prerequisites
- **[Variables and Data Types](variables-and-data-types)** - Understanding data types for query results
- **[Collections Deep Dive](collections-deep-dive)** - Working with query result collections

## Next Steps
- **[Control Flow and Logic](control-flow-and-logic)** - Processing query results
- **[Exception Handling](exception-handling)** - Handling query exceptions

## Advanced Topics
- **[Trigger Bulkification](trigger-bulkification-best-practices)** - Efficient querying in triggers
- **[SOQL Best Practices Tutorial](soql-best-practices)** - Advanced optimization techniques

**Next Recommended Topic:** [Exception Handling](exception-handling) - Learn to handle errors gracefully in your Apex code.
