---
title: "Advanced Architect Interview Questions"
description: "Senior-level Salesforce architect interview questions covering integration architecture, enterprise design patterns, scalability, multi-cloud solutions, and technical leadership"
section: "interview"
difficulty: "advanced"
readTime: "50 min"
order: 10
overview: "Master senior-level Salesforce architecture concepts with 5+ comprehensive questions covering multi-cloud integration, extreme-scale data architecture, security architecture for multi-tenant SaaS, and technical leadership. Perfect for Solution Architects, Technical Architects, and Tech Leads."
concepts: ["Integration Architecture", "API-Led Connectivity", "Data Archival Strategies", "Big Objects", "Multi-Tenant Security", "Encryption", "Platform Limits", "Scalability Patterns", "Technical Leadership", "Architecture Review"]
prerequisites: ["medium-developer-questions", "integration-interview-questions", "system-design-questions"]
relatedTopics: ["scenario-based-challenges"]
lastUpdated: "2025-11-16"
examWeight: "high"
---

# Advanced Architect Interview Questions

Master senior-level Salesforce architecture concepts with these advanced questions. Perfect for Solution Architects, Technical Architects, Integration Architects, and Tech Leads preparing for leadership roles in 2025.

## Integration Architecture

### 1. Design an integration architecture for a multi-cloud enterprise connecting Salesforce with ERP, Marketing, and Legacy Systems.

**Answer:**

**Scenario:** Global company with:
- Salesforce (Sales Cloud, Service Cloud)
- SAP ERP (financial, inventory)
- Marketing Cloud (campaigns)
- Legacy mainframe (order processing)
- Mobile app (customer portal)

**Architecture Design:**

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│                     (MuleSoft/Dell Boomi)                   │
└─────────────────────────────────────────────────────────────┘
         ▲                  ▲                  ▲
         │                  │                  │
    ┌────┴────┐        ┌────┴────┐       ┌────┴────┐
    │Salesforce│        │   SAP   │       │ Legacy  │
    │  Cloud   │        │   ERP   │       │Mainframe│
    └──────────┘        └─────────┘       └─────────┘
         │                  │                  │
         └──────────┬───────┴──────────────────┘
                    │
              ┌─────┴──────┐
              │ Enterprise │
              │Service Bus │
              └────────────┘
```

**Layer 1: System APIs (Data Access)**
```
Salesforce System API:
- GET /accounts/{id}
- POST /opportunities
- PATCH /contacts/{id}

SAP System API:
- GET /orders/{id}
- POST /invoices
- GET /inventory

Legacy System API (Wrapper):
- GET /legacy-customers/{id}
- POST /legacy-orders
```

**Layer 2: Process APIs (Business Logic)**
```
Order Fulfillment API:
1. Receive order from Salesforce
2. Check inventory in SAP
3. Create order in Legacy system
4. Update Salesforce opportunity
5. Trigger Marketing Cloud journey
```

**Layer 3: Experience APIs (Consumer-Facing)**
```
Mobile App API:
- Aggregates data from multiple sources
- Provides unified customer view
- Handles authentication/authorization
```

**Integration Patterns by Use Case:**

**1. Real-Time Synchronization (Salesforce ↔ ERP)**
- **Pattern**: Platform Events + REST API
- **Use Case**: Order created in Salesforce → Real-time sync to SAP
- **Implementation**:
  ```apex
  // Salesforce - Publish Platform Event
  Order_Created__e event = new Order_Created__e(
      Order_Id__c = order.Id,
      Total_Amount__c = order.TotalAmount
  );
  EventBus.publish(event);
  ```
  ```
  // MuleSoft - Subscribe to Platform Event
  Subscriber listens → Transforms data → Calls SAP API
  ```

**2. Batch Synchronization (Legacy → Salesforce)**
- **Pattern**: Scheduled ETL
- **Use Case**: Nightly customer data sync
- **Implementation**:
  ```
  Scheduled Job (12:00 AM):
  1. Extract from Legacy DB
  2. Transform data format
  3. Bulk API 2.0 to Salesforce (5M records/day)
  ```

**3. Event-Driven (Marketing Cloud Integration)**
- **Pattern**: Broadcast Pattern
- **Use Case**: Opportunity closed → trigger email campaign
- **Implementation**:
  ```apex
  // Salesforce - Change Data Capture
  trigger OpportunityTrigger on Opportunity (after update) {
      List<Opportunity_Change_Event__c> changes = new List<Opportunity_Change_Event__c>();
      for (Opportunity opp : Trigger.new) {
          if (opp.StageName == 'Closed Won') {
              // Publish to Marketing Cloud
              MarketingCloudService.sendToJourney(opp);
          }
      }
  }
  ```

**Key Architectural Decisions:**

**1. API-Led Connectivity (3-Layer)**
- **System Layer**: Direct system access
- **Process Layer**: Business logic orchestration
- **Experience Layer**: Consumer-optimized APIs

**2. Middleware Selection**

| Factor | MuleSoft | Dell Boomi | Jitterbit |
|--------|----------|------------|-----------|
| **Cost** | $$$ High | $$ Medium | $ Low |
| **Complexity** | High | Medium | Low |
| **Scalability** | Excellent | Good | Good |
| **Pre-built Connectors** | 300+ | 250+ | 200+ |
| **Best For** | Enterprise, complex | Mid-market | Small-medium |

**3. Security Architecture**
```
External Request → API Gateway
                → OAuth 2.0 Validation
                → Named Credential (Salesforce)
                → External System
```

**4. Error Handling & Retry Logic**
```apex
public class IntegrationService {
    private static final Integer MAX_RETRIES = 3;
    private static final Integer RETRY_DELAY_MS = 2000;

    public static HttpResponse makeCalloutWithRetry(String endpoint) {
        Integer attempts = 0;
        HttpResponse response;

        while (attempts < MAX_RETRIES) {
            try {
                response = makeCallout(endpoint);

                if (response.getStatusCode() == 200) {
                    return response;
                } else if (response.getStatusCode() >= 500) {
                    // Server error, retry
                    attempts++;
                    if (attempts < MAX_RETRIES) {
                        // Exponential backoff
                        Integer delay = RETRY_DELAY_MS * Math.pow(2, attempts).intValue();
                        // Log and wait (async context)
                    }
                } else {
                    // Client error (400), don't retry
                    logError(response);
                    break;
                }
            } catch (Exception e) {
                attempts++;
                if (attempts >= MAX_RETRIES) {
                    throw e;
                }
            }
        }

        return response;
    }
}
```

**5. Monitoring & Observability**
- **Health Checks**: Ping endpoints every 5 minutes
- **Logging**: Centralized logging (Splunk, ELK)
- **Alerting**: PagerDuty for failures
- **Metrics**: Track latency, success rate, throughput

**Trade-offs:**

| Approach | Pros | Cons |
|----------|------|------|
| **Point-to-Point** | Simple, fast setup | Hard to maintain, brittle |
| **Middleware** | Scalable, maintainable | Cost, complexity |
| **API Gateway** | Security, monitoring | Single point of failure |
| **Direct Integration** | No middleware cost | Tight coupling |

**Recommendation for Enterprise:**
Use middleware (MuleSoft/Boomi) with API-led approach for:
- Loose coupling
- Reusable assets
- Easier maintenance
- Better monitoring

---

### 2. How would you design a bi-directional sync between Salesforce and an external database with millions of records?

**Answer:**

**Requirements:**
- 5 million customer records
- Bi-directional sync (Salesforce ↔ External DB)
- Near real-time updates (< 5 min latency)
- Conflict resolution
- Audit trail

**Architecture:**

**1. Master Data Management (MDM) Approach**

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Salesforce  │ ←────→  │     MDM      │ ←────→  │ External DB  │
│   (System A) │         │   Hub/ESB    │         │  (System B)  │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      └─────────────────────────┴─────────────────────────┘
                         Golden Record
```

**2. Data Model Design**

**Salesforce:**
```apex
// Custom object for external sync
External_Customer__c:
- External_ID__c (External ID, Unique) - DB primary key
- Last_Modified_Date__c (DateTime) - For conflict detection
- Sync_Status__c (Picklist) - Synced, Pending, Error
- Source_System__c (Text) - Origin of last change
```

**External Database:**
```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY,
    salesforce_id VARCHAR(18), -- Salesforce Record ID
    last_modified_timestamp TIMESTAMP,
    sync_status VARCHAR(20),
    source_system VARCHAR(50)
);

CREATE INDEX idx_last_modified ON customers(last_modified_timestamp);
CREATE INDEX idx_salesforce_id ON customers(salesforce_id);
```

**3. Real-Time Sync Pattern (Change Data Capture)**

**Salesforce → External DB:**
```apex
// Enable Change Data Capture for Custom Object
trigger CustomerCDCTrigger on CustomerChangeEvent (after insert) {
    List<Customer_Sync_Event__e> platformEvents = new List<Customer_Sync_Event__e>();

    for (CustomerChangeEvent event : Trigger.new) {
        platformEvents.add(new Customer_Sync_Event__e(
            Record_Id__c = event.recordId,
            Change_Type__c = String.valueOf(event.changeType),
            Changed_Fields__c = JSON.serialize(event.changedFields)
        ));
    }

    EventBus.publish(platformEvents);
}
```

**Middleware (MuleSoft) subscribes to Platform Events:**
```
1. Receive Platform Event
2. Transform Salesforce format → DB format
3. Call DB API (REST/SOAP)
4. Update Salesforce sync status
5. Log to audit trail
```

**External DB → Salesforce:**
```
Database Trigger (PostgreSQL example):
CREATE TRIGGER customer_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION notify_change();

Function publishes to message queue (Kafka/RabbitMQ)
→ Middleware consumes
→ Upsert to Salesforce via Bulk API 2.0
```

**4. Batch Sync for Historical Data**

**Initial Load (5M records):**
```apex
// Batch Apex for initial load
global class CustomerBatchSync implements Database.Batchable<SObject>, Database.AllowsCallouts {
    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, Name, Email, External_ID__c
            FROM Customer__c
            WHERE Sync_Status__c = 'Pending'
        ]);
    }

    global void execute(Database.BatchableContext bc, List<Customer__c> scope) {
        // Process 2000 records per batch
        ExternalDBService.syncCustomers(scope);
    }

    global void finish(Database.BatchableContext bc) {
        // Schedule next batch if needed
    }
}

// Execute with larger batch size for performance
Database.executeBatch(new CustomerBatchSync(), 2000);
```

**Bulk API 2.0 for High Volume:**
```java
// Middleware bulk insert (Java example)
BulkApiService bulkService = new BulkApiService();
String jobId = bulkService.createJob("Customer__c", "upsert", "External_ID__c");

// Upload CSV data in chunks
bulkService.uploadJobData(jobId, customersCsvData);

// Monitor job
JobInfo jobInfo = bulkService.getJobStatus(jobId);
// Process 150M records/day
```

**5. Conflict Resolution Strategy**

**Last-Write-Wins (LWW):**
```apex
public class ConflictResolver {
    public static void resolve(Customer__c sfRecord, ExternalCustomer dbRecord) {
        if (sfRecord.Last_Modified_Date__c > dbRecord.lastModifiedDate) {
            // Salesforce wins
            syncToExternalDB(sfRecord);
        } else if (dbRecord.lastModifiedDate > sfRecord.Last_Modified_Date__c) {
            // External DB wins
            syncToSalesforce(dbRecord);
        } else {
            // Same timestamp - use source system priority
            if (sfRecord.Source_System__c == 'Salesforce') {
                syncToExternalDB(sfRecord);
            } else {
                syncToSalesforce(dbRecord);
            }
        }
    }
}
```

**Multi-Version Concurrency Control (MVCC):**
```apex
public class MVCCResolver {
    public static void resolve(Customer__c current, Customer__c incoming) {
        Customer__c merged = new Customer__c(Id = current.Id);
        merged.Version__c = current.Version__c + 1;

        // Field-level merge
        if (incoming.Name != current.Name) {
            merged.Name = incoming.Name; // Take latest
        }

        if (incoming.Email != current.Email) {
            if (incoming.Last_Modified_Date__c > current.Email_Last_Modified__c) {
                merged.Email = incoming.Email;
            }
        }

        update merged;
    }
}
```

**6. Error Handling & Dead Letter Queue**

```apex
public class SyncErrorHandler {
    public static void handleSyncFailure(Customer__c record, String errorMessage) {
        // Log to custom object
        Sync_Error__c error = new Sync_Error__c(
            Record_Id__c = record.Id,
            Error_Message__c = errorMessage,
            Retry_Count__c = record.Retry_Count__c + 1,
            Timestamp__c = System.now()
        );
        insert error;

        // Update record status
        record.Sync_Status__c = 'Error';
        record.Retry_Count__c += 1;

        // If retries exceeded, move to dead letter queue
        if (record.Retry_Count__c > 3) {
            record.Sync_Status__c = 'Failed - Manual Review Required';
            // Alert admins
            sendAlertEmail(record, errorMessage);
        }

        update record;
    }
}
```

**7. Performance Optimization**

**Techniques:**

1. **Parallel Processing**
   ```apex
   // Process multiple batches concurrently
   for (Integer i = 0; i < 5; i++) {
       Database.executeBatch(new CustomerBatchSync(i), 2000);
   }
   ```

2. **Compression**
   ```java
   // Compress data before transmission
   byte[] compressed = compress(customerData);
   // Reduces network overhead by 70%
   ```

3. **Incremental Sync**
   ```sql
   -- Only sync changed records
   SELECT * FROM customers
   WHERE last_modified_timestamp > :lastSyncTime
   ORDER BY last_modified_timestamp
   LIMIT 10000;
   ```

4. **Bulk API 2.0 (150M records/day)**
   - 5x faster than Bulk API 1.0
   - Higher limits
   - Better error handling

**8. Monitoring Dashboard**

**Key Metrics:**
- Sync latency (avg, p50, p95, p99)
- Success rate (%)
- Failed records count
- Data drift (records out of sync)
- API call usage

**Alerts:**
- Sync latency > 5 minutes
- Error rate > 1%
- Failed records > 100

**Trade-offs:**

| Approach | Latency | Cost | Complexity |
|----------|---------|------|------------|
| Real-time CDC | < 1 min | High | High |
| Scheduled Batch | 5-15 min | Medium | Low |
| Hybrid | 1-5 min | High | Medium |

**Recommendation:**
- **Real-time**: Critical data (orders, inventory)
- **Batch**: Historical data, analytics
- **Hybrid**: Best of both (most common)

---

## Scalability & Performance

### 3. Your Salesforce org is hitting platform limits with 200M+ records. How do you architect for extreme scale?

**Answer:**

**Problem Statement:**
- 200 million Account records
- Slow queries (> 30 seconds)
- Hitting view state limits
- Reports timing out
- Users experiencing lag

**Solution Architecture:**

**1. Data Archival Strategy**

**Big Objects for Historical Data:**
```apex
// Create Big Object for archived accounts
Account_Archive__b {
    Account_Id__c (Primary Key)
    Account_Data__c (JSON - all fields)
    Archived_Date__c (DateTime)
}

// Archive accounts older than 5 years
global class AccountArchivalBatch implements Database.Batchable<SObject> {
    global Database.QueryLocator start(Database.BatchableContext bc) {
        Date archiveDate = Date.today().addYears(-5);
        return Database.getQueryLocator([
            SELECT Id, Name, Industry, (SELECT Id FROM Contacts)
            FROM Account
            WHERE CreatedDate < :archiveDate
        ]);
    }

    global void execute(Database.BatchableContext bc, List<Account> accounts) {
        List<Account_Archive__b> archives = new List<Account_Archive__b>();

        for (Account acc : accounts) {
            archives.add(new Account_Archive__b(
                Account_Id__c = acc.Id,
                Account_Data__c = JSON.serialize(acc),
                Archived_Date__c = System.now()
            ));
        }

        // Insert into Big Object (can store trillions of records)
        database.insertImmediate(archives);

        // Delete from standard object
        delete accounts;
    }
}
```

**External Archive (Data Lake):**
```
Salesforce → Heroku Connect → PostgreSQL (Hot data: 2 years)
                            → AWS S3 (Cold data: > 2 years)
                            → Snowflake (Analytics)
```

**2. Query Optimization**

**Skinny Tables:**
```
Request from Salesforce Support:
- Skinny table on Account with 10 most-used fields
- Automatically synced
- Up to 100 columns
- Faster queries (no joins)
```

**Custom Indexes:**
```sql
-- Request custom index on frequently queried field
Index on Account.Industry__c
Index on Account.Last_Activity_Date__c

-- Composite index for common query
Index on (Account.Industry__c, Account.Annual_Revenue__c)
```

**Query Optimization Example:**
```apex
// ❌ Bad - Full table scan
List<Account> accounts = [
    SELECT Id, Name, Description
    FROM Account
    WHERE Description LIKE '%keyword%'
]; // 30+ seconds on 200M records

// ✅ Good - Indexed field
List<Account> accounts = [
    SELECT Id, Name, Description
    FROM Account
    WHERE Industry = 'Technology'
    AND CreatedDate = LAST_N_DAYS:90
    LIMIT 2000
]; // < 1 second
```

**3. Partitioning Strategy**

**Record Type Partitioning:**
```apex
// Separate large tables logically
Account (200M records) →
    - Enterprise_Account (RecordType, 50M)
    - SMB_Account (RecordType, 100M)
    - Partner_Account (RecordType, 50M)

// Queries become faster with RecordType filter
List<Account> enterprises = [
    SELECT Id, Name
    FROM Account
    WHERE RecordTypeId = :enterpriseRTId
    AND CreatedDate = THIS_YEAR
]; // Queries only 50M partition
```

**4. Asynchrous Processing**

**Platform Events for Heavy Operations:**
```apex
// Instead of synchronous trigger
trigger AccountTrigger on Account (after insert) {
    List<Account_Processing_Event__e> events = new List<Account_Processing_Event__e>();

    for (Account acc : Trigger.new) {
        events.add(new Account_Processing_Event__e(
            Account_Id__c = acc.Id,
            Processing_Type__c = 'Enrichment'
        ));
    }

    EventBus.publish(events); // Non-blocking
}

// Process asynchronously
trigger AccountEventTrigger on Account_Processing_Event__e (after insert) {
    Set<Id> accountIds = new Set<Id>();
    for (Account_Processing_Event__e event : Trigger.new) {
        accountIds.add(event.Account_Id__c);
    }

    // Queue for processing
    System.enqueueJob(new AccountEnrichmentQueueable(accountIds));
}
```

**5. Caching Strategy**

**Platform Cache:**
```apex
public class AccountCacheService {
    private static final String CACHE_PARTITION = 'local.AccountCache';

    public static Account getAccount(Id accountId) {
        // Check cache first
        String cacheKey = 'account_' + accountId;
        Account cached = (Account) Cache.Org.get(CACHE_PARTITION, cacheKey);

        if (cached != null) {
            return cached; // Cache hit - no SOQL
        }

        // Cache miss - query and store
        Account acc = [SELECT Id, Name, Industry FROM Account WHERE Id = :accountId];
        Cache.Org.put(CACHE_PARTITION, cacheKey, acc, 3600); // 1 hour TTL

        return acc;
    }
}
```

**Session Cache for User-Specific Data:**
```apex
// Store user's recent accounts
Cache.Session.put('recent_accounts', accountList, 1800); // 30 min
```

**6. Lightning Component Optimization**

**Lazy Loading:**
```javascript
// accountList.js
import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends LightningElement {
    accounts = [];
    offset = 0;
    pageSize = 50;

    @wire(getAccounts, { offset: '$offset', pageSize: '$pageSize' })
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = [...this.accounts, ...data]; // Append
        }
    }

    loadMore() {
        this.offset += this.pageSize; // Trigger next page load
    }
}
```

**Apex Controller with OFFSET:**
```apex
@AuraEnabled(cacheable=true)
public static List<Account> getAccounts(Integer offset, Integer pageSize) {
    return [
        SELECT Id, Name, Industry
        FROM Account
        ORDER BY CreatedDate DESC
        LIMIT :pageSize
        OFFSET :offset
    ];
}
```

**7. Reporting Optimization**

**Filtered Reports with Buckets:**
```
Instead of:
Report on all 200M accounts

Use:
Report on accounts WHERE CreatedDate = THIS_YEAR (2M accounts)
+ Bucket field for historical comparison
```

**Einstein Analytics for Big Data:**
```
Salesforce → ETL → Einstein Analytics Dataset
- Pre-aggregated metrics
- Fast queries (< 1 second)
- Handles billions of rows
- Advanced visualizations
```

**8. Data Model Refactoring**

**Master-Detail vs Lookup:**
```apex
// ❌ Bad - Too many master-detail relationships
// Causes locks, slows down operations

Opportunity (Master)
  → Line Item (Detail)
  → Product Config (Detail)
  → Approval History (Detail) // Problem!

// ✅ Good - Use lookup for non-critical relationships
Opportunity (Master)
  → Line Item (Detail) // Keep
  → Product Config (Lookup) // Change to lookup
  → Approval History (External Object) // Move to external storage
```

**9. External Objects for Supplemental Data**

```apex
// Instead of storing 100M historical orders in Salesforce
// Use External Objects (OData/Salesforce Connect)

External_Order__x {
    Order_Id__c
    Order_Date__c
    Total_Amount__c
}

// Query on-demand from external DB
List<External_Order__x> orders = [
    SELECT Order_Id__c, Total_Amount__c
    FROM External_Order__x
    WHERE Customer_Id__c = :accountId
];
// Data stays in external system
```

**10. Monitoring & Alerts**

**Query Plan Tool:**
```
Developer Console → Query Plan
- Shows if query uses indexes
- Estimates query cost
- Suggests optimizations
```

**Event Monitoring:**
```apex
// Track slow queries
SELECT Query, Timestamp, Duration
FROM EventLogFile
WHERE EventType = 'ApexExecution'
AND Duration > 10000 // > 10 seconds
```

**Architecture Summary:**

```
┌─────────────────────────────────────────────┐
│         Salesforce (Hot Data)               │
│      Active records (2 years, 20M)          │
├─────────────────────────────────────────────┤
│         Big Objects (Warm Data)             │
│     Archived records (3-5 years, 50M)       │
├─────────────────────────────────────────────┤
│      External DB (Cold Data)                │
│    Historical records (> 5 years, 130M)     │
└─────────────────────────────────────────────┘
```

**Performance Improvements:**
- Query time: 30s → < 1s (97% improvement)
- Report generation: Timeout → 5s
- User experience: Lag → Instant
- Storage cost: High → Optimized

---

## Security Architecture

### 4. Design a comprehensive security model for a multi-tenant SaaS application built on Salesforce.

**Answer:**

**Requirements:**
- Multiple customers (tenants) sharing same org
- Complete data isolation between tenants
- Role-based access within each tenant
- Compliance (GDPR, HIPAA, SOC 2)
- Audit trail for all data access

**Architecture:**

**1. Data Isolation Layer**

**Account-Based Tenancy:**
```apex
// Each customer is a separate Account
Tenant_Account__c {
    Name (Tenant Name)
    Tenant_ID__c (Unique Identifier, External ID)
    Subscription_Level__c (Basic, Pro, Enterprise)
    Data_Residency__c (US, EU, APAC)
    Is_Active__c (Checkbox)
}

// All business records tied to tenant
Case__c {
    Tenant__c (Lookup to Tenant_Account__c, Required)
    Subject__c
    Description__c
}
```

**Organization-Wide Defaults (OWD):**
```
All custom objects: Private
- Users can only see records they own or have been shared with
- Opens up access via sharing rules
```

**2. Access Control Matrix**

**Profile-Based Foundation:**
```
SaaS Admin Profile:
- Full access to Tenant_Account__c
- ViewAllData, ModifyAllData (for support)
- API access

Tenant Admin Profile:
- CRUD on tenant-specific records
- Manage Users (within tenant)
- View Setup

Tenant User Profile:
- Read/Create on assigned records
- No Setup access
```

**Permission Sets for Features:**
```apex
// Feature-based permissions
Permission Set: "Advanced Analytics"
- Access to custom analytics objects
- Assigned based on subscription level

Permission Set: "API Access"
- External API user access
- Rate limiting applied
```

**3. Record-Level Security (Sharing Rules)**

**Sharing Rules by Tenant:**
```apex
// Automatic sharing via Apex Sharing
public class TenantSharingService {
    public static void shareWithTenantUsers(List<Case__c> cases) {
        List<Case__Share> shares = new List<Case__Share>();

        // Get all users for each tenant
        Map<Id, List<User>> usersByTenant = getUsersByTenant(cases);

        for (Case__c caseRecord : cases) {
            List<User> tenantUsers = usersByTenant.get(caseRecord.Tenant__c);

            for (User u : tenantUsers) {
                shares.add(new Case__Share(
                    ParentId = caseRecord.Id,
                    UserOrGroupId = u.Id,
                    AccessLevel = 'Read',
                    RowCause = Schema.Case__Share.RowCause.Tenant_Sharing__c
                ));
            }
        }

        Database.insert(shares, false);
    }
}
```

**4. Field-Level Security**

**Sensitive Data Protection:**
```apex
// PII fields - restricted by profile
Contact__c {
    SSN__c (Text Encrypted) - Only Tenant Admin
    Credit_Card__c (Masked) - Payment processors only
    Medical_History__c (Long Text Encrypted) - Healthcare role only
}
```

**Field Permissions:**
```
Tenant User:
- Contact.SSN__c: No Access
- Contact.Name: Read/Write

Tenant Admin:
- Contact.SSN__c: Read Only (encrypted)
- Contact.Name: Read/Write

Support Agent:
- Contact.SSN__c: No Access
- Contact.Name: Read Only
```

**5. Multi-Level Encryption**

**Platform Encryption:**
```apex
// Enable Shield Platform Encryption
Encrypted Fields:
- SSN__c (Deterministic - searchable)
- Credit_Card__c (Probabilistic - not searchable)
- API_Key__c (Deterministic)

// Rotate keys quarterly
TenantKeyManagementService.rotateEncryptionKey(tenantId);
```

**6. Tenant Isolation Enforcement**

**Trigger to Prevent Data Leakage:**
```apex
trigger EnforceTenantIsolation on Case__c (before insert, before update) {
    // Get current user's tenant
    User currentUser = [SELECT Tenant__c FROM User WHERE Id = :UserInfo.getUserId()];

    for (Case__c c : Trigger.new) {
        // Prevent users from creating records for other tenants
        if (c.Tenant__c != currentUser.Tenant__c && !PermissionSetUtil.hasAdminAccess()) {
            c.addError('You cannot create records for other tenants');
        }
    }
}
```

**SOQL Enforcement:**
```apex
// Automatically filter by tenant in all queries
public class SecureQueryBuilder {
    public static List<Case__c> getCases(Map<String, Object> filters) {
        User currentUser = [SELECT Tenant__c FROM User WHERE Id = :UserInfo.getUserId()];

        String query = 'SELECT Id, Subject FROM Case__c WHERE Tenant__c = :currentUser.Tenant__c';

        // Add additional filters
        // ...

        return Database.query(query);
    }
}
```

**7. API Security**

**Named Credentials per Tenant:**
```apex
// Each tenant has isolated API credentials
Named Credential: "TenantA_External_API"
- OAuth 2.0
- Separate client_id/secret per tenant
- Scoped to tenant data only

// Dynamic credential selection
HttpRequest req = new HttpRequest();
req.setEndpoint('callout:' + 'Tenant' + tenantId + '_External_API');
```

**API Rate Limiting:**
```apex
public class RateLimiter {
    // Platform Cache for rate limit tracking
    private static final String CACHE_PARTITION = 'local.RateLimits';

    public static Boolean checkRateLimit(Id tenantId, Integer maxRequests) {
        String cacheKey = 'api_calls_' + tenantId;
        Integer currentCalls = (Integer) Cache.Org.get(CACHE_PARTITION, cacheKey);

        if (currentCalls == null) {
            currentCalls = 0;
        }

        if (currentCalls >= maxRequests) {
            throw new RateLimitException('Rate limit exceeded');
        }

        Cache.Org.put(CACHE_PARTITION, cacheKey, currentCalls + 1, 3600); // 1 hour window
        return true;
    }
}
```

**8. Compliance & Audit Trail**

**GDPR Compliance:**
```apex
// Data Subject Request handling
public class GDPRService {
    // Right to Access
    public static Map<String, Object> exportUserData(Id userId) {
        Map<String, Object> userData = new Map<String, Object>();

        // Query all records associated with user
        List<Case__c> cases = [SELECT Id, Subject FROM Case__c WHERE Contact__c = :userId];
        List<Order__c> orders = [SELECT Id, Amount FROM Order__c WHERE Customer__c = :userId];

        userData.put('cases', cases);
        userData.put('orders', orders);

        return userData;
    }

    // Right to Erasure
    public static void anonymizeUserData(Id userId) {
        Contact c = [SELECT Id, Name, Email FROM Contact WHERE Id = :userId];
        c.Name = 'Anonymized User';
        c.Email = 'anonymized@example.com';
        c.Is_Anonymized__c = true;
        update c;

        // Delete related data
        // ...
    }
}
```

**Field Audit Trail:**
```
Enable Field History Tracking:
- Contact: Name, Email, SSN__c
- Case: Status, Owner, Tenant__c
- Track who changed what and when (up to 20 fields per object)
```

**Event Monitoring:**
```apex
// Track all API access
EventLogFile:
- Login History
- API Events
- Report Exports
- Apex Executions

// Alert on suspicious activity
if (loginAttempts > 5 in 10 minutes) {
    sendSecurityAlert(userId);
    lockAccount(userId);
}
```

**9. Infrastructure Security**

**IP Whitelisting:**
```
Login IP Ranges per Tenant:
Tenant A: 192.168.1.0/24
Tenant B: 10.0.0.0/8

// Block access outside IP range
```

**Session Security:**
```
Session Settings:
- Timeout: 30 minutes
- Lock session to IP address: Yes
- Enforce HTTPS: Yes
- Force logout on session timeout: Yes
```

**10. Incident Response**

**Security Incident Workflow:**
```
1. Detection (Real-time monitoring)
2. Isolation (Lock affected accounts)
3. Investigation (Event log analysis)
4. Remediation (Patch vulnerability)
5. Notification (Alert affected tenants)
6. Review (Post-mortem)
```

**Architecture Diagram:**

```
┌─────────────────────────────────────────────────┐
│           External Users (Tenants)              │
└──────────────┬──────────────────────────────────┘
               │
     ┌─────────▼──────────┐
     │   API Gateway      │
     │ (Rate Limiting)    │
     └─────────┬──────────┘
               │
     ┌─────────▼──────────┐
     │   Authentication   │
     │   (OAuth 2.0)      │
     └─────────┬──────────┘
               │
┌──────────────▼───────────────────────────────────┐
│         Salesforce Platform                      │
│  ┌────────────────────────────────────────────┐  │
│  │        Tenant Isolation Layer              │  │
│  │  (OWD, Sharing, Field Security)           │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │         Encryption Layer                   │  │
│  │  (Platform Encryption, TLS 1.2+)          │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │          Data Storage                      │  │
│  │  (Tenant A | Tenant B | Tenant C)         │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │        Audit & Monitoring                  │  │
│  │  (Event Logs, Field History, Alerts)      │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Compliance Certifications:**
- SOC 2 Type II
- ISO 27001
- GDPR
- HIPAA (for healthcare tenants)
- PCI DSS (for payment processing)

---

## Leadership & Communication

### 5. How would you lead the technical architecture review for a $5M Salesforce implementation project?

**Answer:**

**Project Context:**
- $5M budget
- 18-month timeline
- 5,000 users across 10 countries
- Multiple Salesforce Clouds (Sales, Service, Experience)
- Integration with 15+ systems
- Compliance requirements (GDPR, SOC 2)

**Architecture Review Process:**

**Phase 1: Discovery & Stakeholder Alignment (Weeks 1-4)**

**1. Stakeholder Identification:**
```
Executive Sponsors:
- CFO (budget approval)
- CIO (technical oversight)
- VP of Sales (business outcomes)

Technical Team:
- Salesforce Architects (3)
- Integration Architects (2)
- Security Architect (1)
- DevOps Engineers (2)

Business Leads:
- Sales Operations
- Customer Service
- IT Security
- Compliance Officer
```

**2. Requirements Gathering Framework:**

| Category | Questions | Deliverable |
|----------|-----------|-------------|
| **Business** | What are success metrics? | Business Requirements Doc |
| **Functional** | What processes to automate? | User Stories (100+) |
| **Technical** | What are integration points? | System Landscape Diagram |
| **Security** | What data is sensitive? | Security Requirements Matrix |
| **Performance** | What are SLAs? | Performance Benchmarks |

**3. Architecture Principles:**
```markdown
1. **API-First**: All integrations via documented APIs
2. **Security by Design**: Encryption, least privilege
3. **Scalability**: Support 10x user growth
4. **Modularity**: Loosely coupled components
5. **Automation**: CI/CD for all deployments
6. **Observability**: Comprehensive monitoring
```

**Phase 2: Architecture Design (Weeks 5-12)**

**1. High-Level Architecture:**

```
┌─────────────────────────────────────────────────────┐
│              External Systems                        │
│  ERP | Marketing | Billing | HR | Data Warehouse    │
└──────────────┬──────────────────────────────────────┘
               │
      ┌────────▼─────────┐
      │  Integration Hub │
      │   (MuleSoft)     │
      └────────┬─────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│            Salesforce Platform                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│  │Sales Cloud │ │Service     │ │Experience  │      │
│  │            │ │Cloud       │ │Cloud       │      │
│  └────────────┘ └────────────┘ └────────────┘      │
│  ┌───────────────────────────────────────────┐      │
│  │       Custom Applications (Apex/LWC)      │      │
│  └───────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

**2. Technical Decision Framework:**

**Build vs Buy Decision Matrix:**
```
For each requirement:
Score (1-5):
- Complexity
- Strategic importance
- Time to market
- Vendor availability
- Total cost of ownership

Decision:
- Buy: Standard CRM processes → Sales Cloud
- Build: Unique business logic → Custom Apex
- Customize: 80% fit → Configure Sales Cloud
- Integrate: Best-of-breed → MuleSoft + External
```

**Example:**
```markdown
Requirement: Quote Generation

Options:
A) Salesforce CPQ (Buy) - $150/user/month
B) Custom Development (Build) - $200K + maintenance
C) Third-party app (Integrate) - $50/user/month

Analysis:
- Complexity: High (product bundles, discounts)
- Strategic: Medium (not core differentiator)
- Time: CPQ = 3 months, Custom = 9 months
- Vendor: Salesforce CPQ (mature, supported)

Decision: **Salesforce CPQ** (Buy)
Rationale: Faster time to value, supported, scalable
```

**3. Architecture Diagram Creation:**

**Tools:**
- Lucidchart (for diagrams)
- Confluence (for documentation)
- GitHub (for architecture decision records)

**Key Diagrams:**
- System Context Diagram
- Container Diagram
- Component Diagram
- Deployment Diagram
- Data Flow Diagram
- Security Architecture

**4. Architecture Decision Records (ADRs):**

```markdown
# ADR-001: Use MuleSoft for Integration Platform

## Context
Need to integrate Salesforce with 15+ systems (ERP, Marketing, HR, etc.)

## Decision
Use MuleSoft as integration platform instead of point-to-point integrations

## Consequences
**Positive:**
- Reusable APIs (system, process, experience layers)
- Centralized monitoring and logging
- Easier to add new integrations
- Professional support

**Negative:**
- Additional license cost ($100K/year)
- Learning curve for team
- Another platform to maintain

## Alternatives Considered
1. Point-to-point (rejected - not scalable)
2. Dell Boomi (good, but MuleSoft better Salesforce integration)
3. Custom middleware (too much maintenance overhead)

## Status: Accepted
## Date: 2025-03-15
## Authors: Lead Architect, Integration Architect
```

**Phase 3: Technical Review Sessions (Weeks 13-16)**

**1. Review Meeting Structure:**

**Weekly Architecture Review Board:**
```
Attendees: 10-12 people
Duration: 2 hours
Agenda:
1. Review previous action items (15 min)
2. Deep dive on 1-2 architecture topics (60 min)
3. Risk review (20 min)
4. Decisions needed (20 min)
5. Next steps (5 min)
```

**2. Review Topics:**

| Week | Topic | Presenter | Output |
|------|-------|-----------|--------|
| 13 | Data Model & Relationships | Salesforce Architect | Approved ERD |
| 14 | Integration Architecture | Integration Architect | Approved Integration Design |
| 15 | Security & Compliance | Security Architect | Security Architecture Doc |
| 16 | DevOps & Deployment | DevOps Lead | CI/CD Pipeline Design |

**3. Review Checklist:**

```markdown
## Architecture Review Checklist

### Scalability
- [ ] Supports 5,000 current users
- [ ] Can scale to 50,000 users
- [ ] Handles 10M+ records
- [ ] Batch processing for bulk operations

### Performance
- [ ] Page load < 2 seconds
- [ ] API response < 500ms
- [ ] Report generation < 10 seconds
- [ ] No governor limit violations

### Security
- [ ] Encryption at rest and in transit
- [ ] Role-based access control
- [ ] Audit trail for sensitive data
- [ ] Compliance (GDPR, SOC 2)

### Maintainability
- [ ] Code documentation
- [ ] Architecture diagrams
- [ ] Runbooks for operations
- [ ] Knowledge transfer plan

### Integration
- [ ] Error handling & retry logic
- [ ] Monitoring & alerting
- [ ] API versioning strategy
- [ ] Idempotency for critical operations

### Compliance
- [ ] GDPR right to erasure
- [ ] Data residency requirements
- [ ] SOC 2 controls
- [ ] Audit log retention (7 years)
```

**Phase 4: Risk Management (Ongoing)**

**1. Risk Register:**

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| Data migration fails | High | Medium | Phased approach, extensive testing | Data Architect |
| Integration delays | High | High | Parallel development, early testing | Integration Lead |
| User adoption low | Medium | Medium | Change management, training | Business Lead |
| Performance issues | High | Low | Load testing, query optimization | Technical Architect |
| Security breach | Critical | Low | Penetration testing, audits | Security Architect |

**2. Mitigation Strategies:**

**Technical Risks:**
```apex
// Performance Risk Mitigation
- Implement caching (Platform Cache)
- Use asynchronous processing
- Optimize SOQL queries (query plan tool)
- Load test with 2x expected volume

// Integration Risk Mitigation
- Circuit breaker pattern for external systems
- Retry logic with exponential backoff
- Dead letter queue for failed messages
- Comprehensive error logging
```

**Phase 5: Communication & Documentation (Ongoing)**

**1. Stakeholder Communication Matrix:**

| Stakeholder | Frequency | Format | Content |
|-------------|-----------|--------|---------|
| Executive Sponsors | Monthly | Executive Summary | Progress, risks, budget |
| Project Steering Committee | Bi-weekly | Presentation | Milestones, decisions needed |
| Technical Team | Daily | Stand-up | Blockers, progress |
| Business Users | Monthly | Demo | New features, feedback |

**2. Documentation Deliverables:**

```markdown
## Required Documentation

### Architecture Documents
- [ ] Solution Architecture Document (50+ pages)
- [ ] Integration Architecture Document
- [ ] Security Architecture Document
- [ ] Data Model Diagram (ERD)
- [ ] System Landscape Diagram

### Technical Specifications
- [ ] Apex Class Specifications
- [ ] LWC Component Specifications
- [ ] Integration Specifications
- [ ] API Documentation (Swagger/OpenAPI)

### Operational Documents
- [ ] Deployment Runbook
- [ ] Monitoring & Alerting Guide
- [ ] Disaster Recovery Plan
- [ ] Incident Response Plan

### User Documents
- [ ] Admin Guide
- [ ] End User Training Materials
- [ ] FAQ Document
```

**3. Architecture Presentations:**

**Executive Presentation (30 min):**
- Business value
- High-level architecture
- Timeline & budget
- Key risks
- Success metrics

**Technical Deep Dive (2 hours):**
- Detailed architecture diagrams
- Technology stack
- Data model
- Integration flows
- Security model
- DevOps pipeline

**Phase 6: Validation & Approval (Weeks 17-18)**

**1. Architecture Approval Process:**

```
Step 1: Technical Review
- Peer review by senior architects
- External consultant review (optional)
- Red team security review

Step 2: Business Review
- Alignment with business requirements
- ROI validation
- Change impact assessment

Step 3: Executive Approval
- Present to steering committee
- Address concerns
- Get sign-off on budget & timeline

Step 4: Formal Documentation
- Finalize all architecture documents
- Store in enterprise repository
- Version control
```

**2. Success Criteria:**

```markdown
## Project Success Metrics

### Business Metrics
- 30% increase in sales productivity
- 50% reduction in case resolution time
- 95% user adoption rate
- ROI positive within 24 months

### Technical Metrics
- 99.9% uptime SLA
- < 2 second page load time
- Zero critical security vulnerabilities
- 90%+ code coverage

### Delivery Metrics
- On-time delivery (within 10% of timeline)
- Within budget (±5%)
- All P0 requirements delivered
- Successful UAT with <5% defect rate
```

**Leadership Best Practices:**

**1. Build Trust:**
- Be transparent about risks
- Admit when you don't know
- Follow through on commitments
- Give credit to team

**2. Facilitate Decisions:**
- Present options with pros/cons
- Recommend a path forward
- Document decisions
- Communicate outcomes

**3. Manage Conflict:**
- Listen to all perspectives
- Find common ground
- Escalate when needed
- Focus on data, not opinions

**4. Empower Team:**
- Delegate ownership
- Provide coaching
- Remove blockers
- Celebrate wins

**Red Flags to Watch:**

❌ **Warning Signs:**
- Scope creep without budget increase
- Key stakeholders not engaged
- Technical debt accumulating
- No testing strategy
- Unrealistic timelines

✅ **Course Corrections:**
- Weekly scope review
- Stakeholder re-engagement sessions
- Refactoring sprints
- Test automation investment
- Phased delivery approach

---

## Next Steps for Senior Professionals

To excel at architect-level roles:
1. Gain hands-on experience with multiple Salesforce Clouds
2. Master integration patterns and middleware platforms
3. Develop strong communication and presentation skills
4. Lead cross-functional teams on complex projects
5. Obtain Salesforce Architect certifications:
   - Application Architect
   - System Architect
   - Integration Architecture
   - Identity & Access Management
   - B2C Solution Architect
6. Stay current with platform releases and emerging technologies
7. Contribute to Salesforce community (blog posts, speaking)

**Recommended Reading:**
- "Salesforce Architecture Patterns" (Official Guide)
- "Enterprise Integration Patterns" by Gregor Hohpe
- "System Design Interview" by Alex Xu
- Salesforce Architect Journey (Trailhead)

Good luck with your architect-level interview! 🚀
