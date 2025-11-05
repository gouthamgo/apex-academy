---
title: "SOQL Query Optimization and Best Practices"
category: "apex"
difficulty: "intermediate"
readTime: "20 min"
author: "Sarah Chen"
description: "Learn advanced SOQL optimization techniques, query selectivity patterns, and best practices for high-performance data retrieval in Salesforce."
tags: ["soql", "performance", "optimization", "best-practices", "governor-limits"]
prerequisites: ["soql-fundamentals", "collections-deep-dive"]
relatedTutorials: ["trigger-bulkification-best-practices", "asynchronous-apex-patterns"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# SOQL Query Optimization and Best Practices

Writing efficient SOQL queries is critical for building scalable Salesforce applications. This tutorial covers advanced optimization techniques, query selectivity patterns, and best practices that will help you avoid performance bottlenecks and governor limit issues.

## Understanding Query Performance

Query performance in Salesforce depends on several factors:
- **Selectivity**: How many records match your criteria
- **Indexing**: Whether your WHERE clause uses indexed fields
- **Field Count**: Number of fields retrieved
- **Relationships**: Depth and breadth of related data queried

> 💡 **KEY INSIGHT**: A selective query returns a small percentage of total records. Salesforce optimizes queries that return less than 10-15% of records.

---

## Query Selectivity Patterns

### Using Indexed Fields

Salesforce automatically indexes certain fields for better query performance.

```apex
public class QuerySelectivity {

    // ✅ SELECTIVE - Uses indexed Id field
    public static Account getAccountById(Id accountId) {
        return [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WHERE Id = :accountId
        ];
        // ^^^^^^^^^^^^^^^^^^^^
        // ID FIELD: Always indexed, extremely selective
        // → Best performance for single record retrieval
        // 💡 RESPONSE TIME: Milliseconds even with millions of records
    }

    // ✅ SELECTIVE - Uses indexed external Id
    public static Account getAccountByExternalId(String externalId) {
        return [
            SELECT Id, Name, Industry
            FROM Account
            WHERE External_Id__c = :externalId
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // EXTERNAL ID: Marked as External ID in field definition
        // → Automatically indexed by Salesforce
        // ✅ INTEGRATION: Perfect for external system lookups
    }

    // ✅ SELECTIVE - Combines indexed field with specific value
    public static List<Contact> getActiveContactsByEmail(String email) {
        return [
            SELECT Id, Name, Email, Phone
            FROM Contact
            WHERE Email = :email
            AND IsActive__c = true
        ];
        // ^^^^^^^^^^^^^^^^^^^
        // EMAIL FIELD: Standard indexed field
        // → Specific value makes query selective
        // 💡 COMPOUND: Additional filter increases selectivity
    }

    // ⚠️ LESS SELECTIVE - Non-indexed field with common value
    public static List<Account> getAccountsByIndustry(String industry) {
        return [
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE Industry = :industry
            LIMIT 2000
        ];
        // ^^^^^^^^^^^^^^^^^^^^
        // NON-INDEXED FIELD: Industry not indexed by default
        // → Full table scan if many records match
        // 💡 LIMIT: Always use LIMIT with non-selective queries
    }

    // ✅ IMPROVED SELECTIVITY - Multiple filters
    public static List<Account> getHighValueTechAccounts() {
        return [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WHERE Industry = 'Technology'
            AND AnnualRevenue > 10000000
            AND CreatedDate = LAST_N_MONTHS:6
            LIMIT 1000
        ];
        // ^^^^^^^^^^^^^^^^^^^^^
        // COMPOUND FILTERS: Multiple conditions increase selectivity
        // → Narrows result set significantly
        // ✅ PERFORMANCE: Indexed CreatedDate + specific values
    }

    // 💀 NON-SELECTIVE - Leading wildcard LIKE
    public static List<Account> searchAccountsByNameBad(String searchTerm) {
        return [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE '%' + searchTerm + '%'
            LIMIT 500
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // LEADING WILDCARD: Cannot use index
        // → Full table scan required
        // ⚠️ PERFORMANCE: Slow with large datasets
        // 💀 EXAM TRAP: Leading % prevents index usage
    }

    // ✅ BETTER - Trailing wildcard only
    public static List<Account> searchAccountsByNameGood(String searchTerm) {
        return [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE :searchTerm + '%'
            LIMIT 500
        ];
        // ^^^^^^^^^^^^^^^^^^
        // TRAILING WILDCARD: Can use index
        // → Much better performance
        // 💡 TIP: Users can search by beginning of name
    }

    // ✅ BEST - Use SOSL for text search
    public static List<List<SObject>> searchAllObjectsBest(String searchTerm) {
        return [
            FIND :searchTerm IN ALL FIELDS
            RETURNING Account(Id, Name), Contact(Id, Name), Lead(Id, Name)
        ];
        // ^^^^^^^^^^^^^^^^^^^
        // SOSL SEARCH: Optimized for text search across objects
        // → Uses Salesforce search index
        // ✅ BEST PRACTICE: Use SOSL for complex text searches
    }
}
```

### Indexed Fields Reference

Salesforce automatically indexes these standard fields:
- **Id** (always indexed)
- **Name** (on most objects)
- **OwnerId**
- **CreatedDate**
- **SystemModstamp**
- **RecordType**
- **Master-Detail Fields**
- **Lookup Fields**
- **External ID Fields** (when marked)
- **Unique Fields** (when marked)

---

## Query Optimization Techniques

### Minimize Fields Retrieved

```apex
public class FieldOptimization {

    // ❌ BAD - Querying unnecessary fields
    public static void processAccountsBad(Set<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id, Name, Type, Industry, Rating, Phone, Fax,
                   BillingStreet, BillingCity, BillingState, BillingPostalCode,
                   ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode,
                   Description, Website, NumberOfEmployees, AnnualRevenue,
                   Ownership, SLA__c, CustomerPriority__c, AccountNumber
            FROM Account
            WHERE Id IN :accountIds
        ];
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // OVER-QUERYING: Retrieving many unused fields
        // → Increases query time and memory usage
        // ⚠️ PERFORMANCE: Every field adds overhead

        // Only using Name
        for (Account acc : accounts) {
            System.debug('Account: ' + acc.Name);
        }
    }

    // ✅ GOOD - Query only needed fields
    public static void processAccountsGood(Set<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id, Name
            FROM Account
            WHERE Id IN :accountIds
        ];
        // ^^^^^^^^^^^^^^
        // MINIMAL FIELDS: Only query what you need
        // → Faster query execution
        // → Lower memory consumption
        // ✅ BEST PRACTICE: Query only necessary fields

        for (Account acc : accounts) {
            System.debug('Account: ' + acc.Name);
        }
    }

    // ✅ STRATEGY - Query in stages if needed
    public static void queryInStages(Set<Id> accountIds) {
        // First query: Basic info for filtering
        Map<Id, Account> basicAccounts = new Map<Id, Account>([
            SELECT Id, Name, Industry
            FROM Account
            WHERE Id IN :accountIds
        ]);

        // Filter to accounts we actually need
        Set<Id> techAccountIds = new Set<Id>();
        for (Account acc : basicAccounts.values()) {
            if (acc.Industry == 'Technology') {
                techAccountIds.add(acc.Id);
            }
        }

        // Second query: Detailed info only for filtered records
        if (!techAccountIds.isEmpty()) {
            List<Account> detailedAccounts = [
                SELECT Id, Name, Industry, AnnualRevenue, Rating,
                       Phone, Website, Description
                FROM Account
                WHERE Id IN :techAccountIds
            ];
            // ^^^^^^^^^^^^^^^^^^^^
            // STAGED QUERYING: Query details only when needed
            // → Reduces data retrieved
            // 💡 OPTIMIZATION: Two small queries better than one large
        }
    }
}
```

### Efficient Relationship Queries

```apex
public class RelationshipOptimization {

    // ❌ BAD - Multiple queries (N+1 problem)
    public static void processAccountsWithContactsBad(List<Account> accounts) {
        for (Account acc : accounts) {
            // SOQL in loop - governor limit disaster!
            List<Contact> contacts = [
                SELECT Id, Name, Email
                FROM Contact
                WHERE AccountId = :acc.Id
            ];
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // N+1 PROBLEM: One query per account
            // → 100 accounts = 100 SOQL queries = LIMIT EXCEEDED
            // 💀 EXAM TRAP: Classic governor limit violation

            processContacts(contacts);
        }
    }

    // ✅ GOOD - Single query with relationship
    public static void processAccountsWithContactsGood(Set<Id> accountIds) {
        List<Account> accounts = [
            SELECT Id, Name,
                (SELECT Id, Name, Email
                 FROM Contacts
                 WHERE Email != null
                 LIMIT 200)
            FROM Account
            WHERE Id IN :accountIds
        ];
        // ^^^^^^^^^^^^^^^^^^^^
        // RELATIONSHIP QUERY: Get parent and children together
        // → Single SOQL query regardless of account count
        // ✅ BULKIFIED: Efficient use of governor limits

        for (Account acc : accounts) {
            if (acc.Contacts != null && !acc.Contacts.isEmpty()) {
                processContacts(acc.Contacts);
            }
        }
    }

    // ✅ ALTERNATIVE - Build map from separate query
    public static void useMapApproach(Set<Id> accountIds) {
        // Query all contacts once
        Map<Id, List<Contact>> contactsByAccountId = new Map<Id, List<Contact>>();

        for (Contact con : [
            SELECT Id, Name, Email, AccountId
            FROM Contact
            WHERE AccountId IN :accountIds
            AND Email != null
        ]) {
            if (!contactsByAccountId.containsKey(con.AccountId)) {
                contactsByAccountId.put(con.AccountId, new List<Contact>());
            }
            contactsByAccountId.get(con.AccountId).add(con);
        }
        // ^^^^^^^^^^^^^^^^^^^^^
        // MAP BUILDING: Organize contacts by account
        // → O(1) lookup time vs O(n) with list
        // 💡 USE CASE: When child query limits are concern

        // Query accounts separately
        List<Account> accounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Id IN :accountIds
        ];

        // Process with mapped contacts
        for (Account acc : accounts) {
            List<Contact> contacts = contactsByAccountId.get(acc.Id);
            if (contacts != null) {
                processContacts(contacts);
            }
        }
    }

    // ✅ MULTI-LEVEL RELATIONSHIPS
    public static void queryMultiLevelRelationships() {
        List<Opportunity> opps = [
            SELECT Id, Name, Amount,
                   Account.Name,
                   Account.Industry,
                   Account.Owner.Name,
                   Account.Owner.Email,
                   (SELECT Id, FirstName, LastName, Title
                    FROM OpportunityContactRoles
                    LIMIT 10)
            FROM Opportunity
            WHERE Amount > 100000
            AND CloseDate = THIS_QUARTER
        ];
        // ^^^^^^^^^^^^^^^^^^^^
        // MULTI-LEVEL: Parent relationships + child subquery
        // → Maximum efficiency: one query, multiple relationships
        // 💡 LIMIT: Can span 5 parent levels, subqueries count toward limits
    }

    private static void processContacts(List<Contact> contacts) {
        System.debug('Processing ' + contacts.size() + ' contacts');
    }
}
```

---

## Aggregate Query Optimization

```apex
public class AggregateOptimization {

    // ✅ Use aggregates instead of querying all records
    public static Integer countActiveAccountsEfficient() {
        return [
            SELECT COUNT()
            FROM Account
            WHERE Active__c = true
        ];
        // ^^^^^^^^^^^^^^^^^^
        // COUNT AGGREGATE: Returns count without record data
        // → Much faster than querying all records
        // ✅ EFFICIENCY: Minimal data transfer
    }

    // ❌ INEFFICIENT - Query all records to count
    public static Integer countActiveAccountsInefficient() {
        List<Account> accounts = [
            SELECT Id
            FROM Account
            WHERE Active__c = true
        ];
        return accounts.size();
        // ^^^^^^^^^^^^^^^^^^^
        // INEFFICIENT: Retrieves all records just to count
        // → Wastes heap space and query time
        // ⚠️ LIMITS: Counts toward query row limits
    }

    // ✅ Complex aggregation for business intelligence
    public static Map<String, Decimal> getRevenueByIndustry() {
        Map<String, Decimal> revenueMap = new Map<String, Decimal>();

        for (AggregateResult ar : [
            SELECT Industry ind, SUM(AnnualRevenue) total
            FROM Account
            WHERE Industry != null
            AND AnnualRevenue != null
            GROUP BY Industry
            HAVING SUM(AnnualRevenue) > 1000000
            ORDER BY SUM(AnnualRevenue) DESC
        ]) {
            String industry = (String) ar.get('ind');
            Decimal total = (Decimal) ar.get('total');
            revenueMap.put(industry, total);
        }
        // ^^^^^^^^^^^^^^^^^^^^^
        // AGGREGATE QUERY: Database performs calculation
        // → Much more efficient than Apex loops
        // 💡 PERFORMANCE: Leverage database computation power

        return revenueMap;
    }

    // ❌ INEFFICIENT - Calculate in Apex
    public static Map<String, Decimal> getRevenueByIndustryInefficient() {
        Map<String, Decimal> revenueMap = new Map<String, Decimal>();

        // Query all accounts
        for (Account acc : [
            SELECT Industry, AnnualRevenue
            FROM Account
            WHERE Industry != null
            AND AnnualRevenue != null
        ]) {
            Decimal current = revenueMap.get(acc.Industry);
            if (current == null) {
                current = 0;
            }
            revenueMap.put(acc.Industry, current + acc.AnnualRevenue);
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // APEX CALCULATION: Transfers all data, calculates in Apex
        // → Slower and uses more resources
        // ⚠️ LIMITS: All records count toward limits

        // Filter in Apex
        Map<String, Decimal> filtered = new Map<String, Decimal>();
        for (String industry : revenueMap.keySet()) {
            if (revenueMap.get(industry) > 1000000) {
                filtered.put(industry, revenueMap.get(industry));
            }
        }

        return filtered;
    }
}
```

---

## Query Limit Management

```apex
public class QueryLimitManagement {

    // ✅ Always use LIMIT with non-selective queries
    public static List<Account> getLargeAccountsSafely() {
        return [
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE AnnualRevenue > 1000000
            ORDER BY AnnualRevenue DESC
            LIMIT 2000
        ];
        // ^^^^^^^^^^^
        // EXPLICIT LIMIT: Prevents retrieving too many records
        // → Protects against query row limits
        // ✅ SAFETY: Always limit non-selective queries
    }

    // ✅ Query in batches for large datasets
    public static void processLargeDataset() {
        Integer batchSize = 200;
        Integer offset = 0;
        Boolean hasMore = true;

        while (hasMore) {
            List<Account> batch = [
                SELECT Id, Name, Industry
                FROM Account
                WHERE Industry = 'Technology'
                ORDER BY CreatedDate
                LIMIT :batchSize
                OFFSET :offset
            ];
            // ^^^^^^^^^^^^^^^^
            // OFFSET PAGINATION: Query in chunks
            // → Processes large datasets without hitting limits
            // 💡 BATCH: Process in manageable sizes

            if (batch.isEmpty()) {
                hasMore = false;
            } else {
                processBatch(batch);
                offset += batchSize;
            }
        }
    }

    // ✅ Use FOR UPDATE sparingly
    public static void updateWithLocking(Set<Id> accountIds) {
        // Lock records for update
        List<Account> accounts = [
            SELECT Id, Name, AnnualRevenue
            FROM Account
            WHERE Id IN :accountIds
            LIMIT 200
            FOR UPDATE
        ];
        // ^^^^^^^^^^^
        // FOR UPDATE: Locks records for exclusive access
        // → Prevents concurrent modifications
        // ⚠️ USE CAREFULLY: Can cause lock exceptions
        // 💡 LIMIT: Keep small to avoid long locks

        // Update safely
        for (Account acc : accounts) {
            acc.AnnualRevenue = acc.AnnualRevenue * 1.1;
        }
        update accounts;
    }

    // ✅ Cache frequently accessed data
    private static Map<Id, Account> accountCache = new Map<Id, Account>();

    public static Account getAccountCached(Id accountId) {
        // Check cache first
        if (accountCache.containsKey(accountId)) {
            return accountCache.get(accountId);
            // ^^^^^^^^^^^^^^^^^^^
            // CACHE HIT: Return without query
            // → Saves SOQL query
            // 💡 PERFORMANCE: Significant improvement for repeated access
        }

        // Query if not cached
        Account acc = [
            SELECT Id, Name, Industry, AnnualRevenue
            FROM Account
            WHERE Id = :accountId
        ];

        // Store in cache
        accountCache.put(accountId, acc);
        return acc;
    }

    private static void processBatch(List<Account> batch) {
        System.debug('Processing batch of ' + batch.size() + ' accounts');
    }
}
```

---

## Advanced Optimization Patterns

```apex
public class AdvancedPatterns {

    // ✅ Lazy loading pattern
    public class AccountData {
        private Id accountId;
        private Account account;
        private List<Contact> contacts;

        public AccountData(Id accId) {
            this.accountId = accId;
        }

        public Account getAccount() {
            if (this.account == null) {
                // Lazy load: Query only when needed
                this.account = [
                    SELECT Id, Name, Industry, AnnualRevenue
                    FROM Account
                    WHERE Id = :this.accountId
                ];
            }
            return this.account;
        }

        public List<Contact> getContacts() {
            if (this.contacts == null) {
                // Lazy load contacts
                this.contacts = [
                    SELECT Id, Name, Email
                    FROM Contact
                    WHERE AccountId = :this.accountId
                ];
            }
            return this.contacts;
        }
        // ^^^^^^^^^^^^^^^^^^^^^^^
        // LAZY LOADING: Query data only when accessed
        // → Avoids querying unused data
        // 💡 OPTIMIZATION: Defers expensive operations
    }

    // ✅ Query result caching with expiration
    public class QueryCache {
        private static final Integer CACHE_DURATION_MINUTES = 5;
        private static Map<String, CacheEntry> cache = new Map<String, CacheEntry>();

        public static List<Account> getAccounts(String cacheKey, String whereClause) {
            // Check cache
            if (cache.containsKey(cacheKey)) {
                CacheEntry entry = cache.get(cacheKey);
                if (!entry.isExpired()) {
                    return entry.records;
                }
            }

            // Query if not cached or expired
            String query = 'SELECT Id, Name, Industry FROM Account WHERE ' + whereClause;
            List<Account> records = Database.query(query);

            // Cache results
            cache.put(cacheKey, new CacheEntry(records, CACHE_DURATION_MINUTES));
            return records;
        }

        private class CacheEntry {
            public List<Account> records;
            public DateTime expiresAt;

            public CacheEntry(List<Account> records, Integer durationMinutes) {
                this.records = records;
                this.expiresAt = DateTime.now().addMinutes(durationMinutes);
            }

            public Boolean isExpired() {
                return DateTime.now() > this.expiresAt;
            }
        }
    }

    // ✅ Parallel query pattern (use carefully)
    public static void queryMultipleObjectsEfficiently() {
        // Query different objects to maximize parallel processing
        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 100];
        List<Contact> contacts = [SELECT Id, Name FROM Contact LIMIT 100];
        List<Opportunity> opps = [SELECT Id, Name FROM Opportunity LIMIT 100];
        // ^^^^^^^^^^^^^^^^^^^^
        // SEPARATE QUERIES: Each query independent
        // → Salesforce may process in parallel
        // 💡 OPTIMIZATION: Better than complex joins sometimes
    }
}
```

---

## Query Performance Checklist

✅ **Always Do:**
- Use indexed fields in WHERE clauses
- Add LIMIT to non-selective queries
- Query only fields you need
- Use relationship queries instead of multiple queries
- Prefer aggregates over querying all records
- Use bind variables for dynamic values
- Cache frequently accessed data

❌ **Never Do:**
- Put SOQL in loops
- Use leading wildcards in LIKE (e.g., `LIKE '%text'`)
- Query all fields when you need few
- Omit LIMIT on non-selective queries
- Use separate queries when relationship query works
- Forget to filter on indexed fields

⚠️ **Be Careful With:**
- OFFSET pagination (database impact)
- FOR UPDATE (locking issues)
- Complex relationship queries (child limits)
- Dynamic SOQL (security implications)

---

## Summary

Efficient SOQL queries are critical for scalable Salesforce applications:

1. **Selectivity First**: Use indexed fields with specific values
2. **Minimize Data**: Query only needed fields and records
3. **Bulkify Queries**: Use relationship queries, avoid loops
4. **Leverage Database**: Use aggregates instead of Apex calculations
5. **Manage Limits**: Always use LIMIT, consider pagination
6. **Cache Wisely**: Store frequently accessed data in memory

Master these patterns to build high-performance, scalable applications that handle any data volume efficiently!
