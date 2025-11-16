---
title: "Integration & API Interview Questions"
section: "interview"
order: 4
difficulty: "advanced"
readTime: "25 min"
description: "Master integration interview questions covering REST, SOAP, authentication, platform events, and API best practices."
overview: "Comprehensive integration interview prep covering REST and SOAP APIs, authentication methods (OAuth, JWT, Named Credentials), callouts, platform events, and integration patterns."
concepts: ["REST API", "SOAP API", "OAuth", "Authentication", "Callouts", "Platform Events", "Integration Patterns"]
prerequisites: ["apex-interview-questions"]
relatedTopics: ["lwc-interview-questions", "system-design-questions"]
lastUpdated: "2024-01-15"
examWeight: "medium"
---

# Integration & API Interview Questions

Essential questions for Salesforce integration scenarios and API development.

## REST API Basics

### Q1: What's the difference between REST and SOAP?

**Answer:**

| Feature | REST | SOAP |
|---------|------|------|
| **Protocol** | HTTP | HTTP, SMTP, TCP |
| **Format** | JSON, XML | XML only |
| **Simplicity** | Simple | Complex |
| **Performance** | Faster (less overhead) | Slower |
| **Standards** | Flexible | Strict (WSDL) |
| **Use Case** | Modern APIs, mobile | Enterprise, legacy systems |

**When to use REST:**
- Modern integrations
- Mobile applications
- Lightweight, fast responses
- JSON preferred

**When to use SOAP:**
- Enterprise legacy systems
- Strict standards required
- WS-Security needed
- Existing SOAP infrastructure

**Interview Tip**: "I prefer REST for new integrations due to simplicity and performance, but use SOAP when integrating with legacy systems."

---

### Q2: How do you make a REST callout from Apex?

**Answer:**

**HTTP GET Example:**
```apex
public class RestCalloutExample {
    public static void getAccount() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();

        request.setEndpoint('https://api.example.com/accounts/001');
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + getAccessToken());

        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            Map<String, Object> results = (Map<String, Object>)
                JSON.deserializeUntyped(response.getBody());
            System.debug('Account: ' + results.get('name'));
        } else {
            System.debug('Error: ' + response.getStatus());
        }
    }
}
```

**HTTP POST Example:**
```apex
public static void createAccount(String name, String industry) {
    Http http = new Http();
    HttpRequest request = new HttpRequest();

    request.setEndpoint('https://api.example.com/accounts');
    request.setMethod('POST');
    request.setHeader('Content-Type', 'application/json');

    Map<String, Object> body = new Map<String, Object>{
        'name' => name,
        'industry' => industry
    };
    request.setBody(JSON.serialize(body));

    HttpResponse response = http.send(request);

    if (response.getStatusCode() == 201) {
        System.debug('Created successfully');
    }
}
```

**Key Points:**
- Set **endpoint** (must be in Remote Site Settings)
- Set **method** (GET, POST, PUT, DELETE)
- Set **headers** (Content-Type, Authorization)
- Set **body** for POST/PUT
- Check **status code**
- Parse **response**

---

### Q3: What are Remote Site Settings and why needed?

**Answer:**
**Remote Site Settings** whitelist external URLs that Salesforce can call.

**Why Needed:**
- **Security**: Salesforce blocks all external callouts by default
- **Protection**: Prevents unauthorized data exfiltration
- **Control**: Admins control which sites are accessible

**How to Configure:**
```
Setup → Security → Remote Site Settings → New Remote Site

Name: External API
Remote Site URL: https://api.example.com
Active: ✓
```

**Best Practice:**
- Use specific URLs (not just domain)
- Document purpose in description
- Review periodically

**Alternative**: Use **Named Credentials** (recommended) - includes Remote Site Settings automatically.

---

## Authentication

### Q4: Explain OAuth 2.0 flow in Salesforce

**Answer:**
**OAuth 2.0** is the industry-standard protocol for authorization.

**OAuth Flows:**

**1. Web Server Flow (Most Common)**
```
User → Salesforce Login → Authorization → Access Token

1. Redirect user to Salesforce authorization URL
2. User logs in and grants permission
3. Salesforce redirects back with authorization code
4. Exchange code for access token
5. Use access token for API calls
```

**2. User-Agent Flow (JavaScript)**
- For single-page apps
- Token returned in URL fragment

**3. JWT Bearer Token Flow (Server-to-Server)**
- No user interaction
- Uses certificate

**4. Username-Password Flow (Not Recommended)**
- Legacy, less secure

**OAuth Components:**
- **Client ID**: App identifier
- **Client Secret**: App password
- **Authorization Code**: Temporary code
- **Access Token**: Used for API calls
- **Refresh Token**: Get new access token

**Example Access Token Usage:**
```apex
request.setHeader('Authorization', 'Bearer ' + accessToken);
```

---

### Q5: What are Named Credentials?

**Answer:**
**Named Credentials** securely store authentication details for external services.

**Benefits:**
- **No hardcoded credentials** in code
- **Automatic authentication** (OAuth, password, JWT)
- **Remote Site Settings** included automatically
- **Per-user or per-org** authentication
- **Centralized management**

**Creating Named Credential:**
```
Setup → Named Credentials → New

Label: External API
Name: External_API
URL: https://api.example.com
Identity Type: Named Principal / Per User
Authentication Protocol: OAuth 2.0 / Password / JWT
```

**Using in Apex:**
```apex
HttpRequest request = new HttpRequest();
request.setEndpoint('callout:External_API/accounts');
request.setMethod('GET');

// No need to set Authorization header!
// Salesforce handles it automatically
```

**Interview Tip**: Always recommend Named Credentials over hardcoded credentials!

---

## Inbound Integration

### Q6: How do you expose Apex as a REST API?

**Answer:**
Use **@RestResource** annotation:

```apex
@RestResource(urlMapping='/Accounts/*')
global with sharing class AccountRestService {

    // GET: /services/apexrest/Accounts/{id}
    @HttpGet
    global static Account getAccount() {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(
            req.requestURI.lastIndexOf('/') + 1
        );
        return [SELECT Id, Name, Industry FROM Account WHERE Id = :accountId];
    }

    // POST: /services/apexrest/Accounts
    @HttpPost
    global static String createAccount(String name, String industry) {
        Account acc = new Account(Name = name, Industry = industry);
        insert acc;
        return acc.Id;
    }

    // PUT: /services/apexrest/Accounts/{id}
    @HttpPut
    global static void updateAccount(Id accountId, String name) {
        Account acc = new Account(Id = accountId, Name = name);
        update acc;
    }

    // DELETE: /services/apexrest/Accounts/{id}
    @HttpDelete
    global static void deleteAccount() {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(
            req.requestURI.lastIndexOf('/') + 1
        );
        delete new Account(Id = accountId);
    }

    // PATCH: /services/apexrest/Accounts/{id}
    @HttpPatch
    global static void patchAccount() {
        // Partial update
    }
}
```

**Calling the API:**
```bash
curl https://yourinstance.salesforce.com/services/apexrest/Accounts/001xxx \
  -H "Authorization: Bearer {access_token}"
```

**Best Practices:**
- Use **with sharing** for security
- Return appropriate **HTTP status codes**
- Use **try-catch** for error handling
- Validate input
- Document your API

---

### Q7: How do you handle errors in REST services?

**Answer:**

**Set HTTP Status Code:**
```apex
@HttpPost
global static void createAccount(String name) {
    try {
        if (String.isBlank(name)) {
            RestContext.response.statusCode = 400; // Bad Request
            RestContext.response.responseBody = Blob.valueOf(
                JSON.serialize(new Map<String, String>{
                    'error' => 'Name is required'
                })
            );
            return;
        }

        Account acc = new Account(Name = name);
        insert acc;

        RestContext.response.statusCode = 201; // Created
        RestContext.response.responseBody = Blob.valueOf(
            JSON.serialize(new Map<String, String>{
                'id' => acc.Id,
                'message' => 'Account created successfully'
            })
        );

    } catch (DmlException e) {
        RestContext.response.statusCode = 500; // Internal Server Error
        RestContext.response.responseBody = Blob.valueOf(
            JSON.serialize(new Map<String, String>{
                'error' => e.getMessage()
            })
        );
    }
}
```

**Standard HTTP Status Codes:**
- **200 OK**: Successful GET
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication failed
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Platform Events

### Q8: What are Platform Events and when to use them?

**Answer:**
**Platform Events** are a publish-subscribe messaging system for event-driven architecture.

**Use Cases:**
- **Real-time notifications** (order placed, record updated)
- **Microservices communication**
- **External system integration**
- **Decouple processes**
- **Audit trail**

**Creating Platform Event:**
```
Setup → Platform Events → New Platform Event

Label: Order Placed
Plural Label: Orders Placed
API Name: Order_Placed__e

Fields:
- Order_Id__c (Text)
- Amount__c (Number)
- Customer_Name__c (Text)
```

**Publishing Event (Apex):**
```apex
public class OrderEventPublisher {
    public static void publishOrderEvent(Id orderId, Decimal amount, String customerName) {
        Order_Placed__e event = new Order_Placed__e(
            Order_Id__c = orderId,
            Amount__c = amount,
            Customer_Name__c = customerName
        );

        Database.SaveResult sr = EventBus.publish(event);

        if (!sr.isSuccess()) {
            for (Database.Error err : sr.getErrors()) {
                System.debug('Error: ' + err.getMessage());
            }
        }
    }
}
```

**Subscribing to Event (Trigger):**
```apex
trigger OrderPlacedTrigger on Order_Placed__e (after insert) {
    List<Task> tasks = new List<Task>();

    for (Order_Placed__e event : Trigger.new) {
        Task t = new Task(
            Subject = 'Follow up on order ' + event.Order_Id__c,
            Description = 'Customer: ' + event.Customer_Name__c +
                         '\nAmount: $' + event.Amount__c,
            Priority = 'High'
        );
        tasks.add(t);
    }

    insert tasks;
}
```

**Subscribing from External System:**
```javascript
// Using CometD
const subscription = client.subscribe('/event/Order_Placed__e', (message) => {
    console.log('Order received:', message.data.payload);
});
```

**Benefits:**
- **Decoupling**: Publisher doesn't know about subscribers
- **Real-time**: Immediate notification
- **Scalable**: Handle high volume
- **Reliable**: Guaranteed delivery

---

## Integration Patterns

### Q9: Explain common integration patterns

**Answer:**

**1. Request-Response (Synchronous)**
```
Salesforce → External System → Response

Use when: Need immediate response
Example: Address validation, credit check
```

**2. Fire-and-Forget (Asynchronous)**
```
Salesforce → @future callout → External System

Use when: No immediate response needed
Example: Send email via external service
```

**3. Batch Data Sync**
```
Scheduled Batch → Process records → External system

Use when: Large data volumes
Example: Nightly data export/import
```

**4. Remote Call-In**
```
External System → REST API → Salesforce

Use when: External system initiates
Example: E-commerce order creation
```

**5. UI Update**
```
User action → LWC → Apex → External API → Update UI

Use when: Real-time user interaction
Example: Check inventory availability
```

**6. Pub/Sub (Platform Events)**
```
Publisher → Event Bus → Subscribers

Use when: Event-driven, multiple consumers
Example: Order processing workflow
```

---

### Q10: Bulk API vs REST API - when to use each?

**Answer:**

| Feature | REST API | Bulk API |
|---------|----------|----------|
| **Record Limit** | ~200 per call | Millions |
| **Speed** | Fast for small batches | Optimized for large volumes |
| **Use Case** | Real-time, small batches | Data loads, migrations |
| **Processing** | Synchronous | Asynchronous |
| **Format** | JSON, XML | CSV, JSON, XML |

**REST API Example:**
```apex
// Good for: Create 10 records
@future(callout=true)
public static void createRecords(List<Account> accounts) {
    HttpRequest req = new HttpRequest();
    req.setEndpoint('callout:MyAPI/accounts');
    req.setMethod('POST');
    req.setBody(JSON.serialize(accounts));
    new Http().send(req);
}
```

**Bulk API Example:**
```java
// Good for: Load 100,000 records
BulkConnection conn = createBulkConnection();
JobInfo job = createJob("Account", "insert", conn);
List<BatchInfo> batches = createBatchesFromCSV(job, conn, csvFile);
awaitCompletion(conn, job, batches);
```

**Use Bulk API when:**
- Loading > 2,000 records
- Data migration
- Nightly batch sync
- Initial data load

---

## Best Practices

### Q11: How do you handle API governor limits?

**Answer:**

**Salesforce API Limits:**
- **24-hour limit**: 15,000 API calls (Enterprise) + 1,000 per license
- **Concurrent requests**: 25 max
- **Single API call**: 2,000 records max

**Strategies:**

**1. Use Composite API**
```apex
// Instead of 3 separate calls, use composite
// POST /services/data/v59.0/composite

{
    "compositeRequest": [
        {
            "method": "POST",
            "url": "/services/data/v59.0/sobjects/Account",
            "referenceId": "NewAccount",
            "body": { "Name": "ACME" }
        },
        {
            "method": "POST",
            "url": "/services/data/v59.0/sobjects/Contact",
            "referenceId": "NewContact",
            "body": {
                "LastName": "Smith",
                "AccountId": "@{NewAccount.id}"
            }
        }
    ]
}
```

**2. Use Batch API for Large Volumes**
```apex
// For 10,000+ records, use Bulk API
// Counts as 1 API call regardless of volume
```

**3. Optimize Queries**
```apex
// ❌ Bad: Multiple queries
for (Id accountId : accountIds) {
    Account acc = [SELECT Id, Name FROM Account WHERE Id = :accountId];
}

// ✅ Good: Single query
List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
```

**4. Cache Results**
```javascript
// Cache in LWC
@wire(getAccounts)
accounts; // Auto-cached by LDS
```

**5. Monitor Usage**
```apex
System.debug('Limits: ' + Limits.getCallouts() + '/' + Limits.getLimitCallouts());
```

---

### Q12: How do you secure integrations?

**Answer:**

**1. Use Named Credentials**
- No hardcoded credentials
- Encrypted storage
- Automatic auth

**2. OAuth 2.0**
```apex
// Don't use username/password
// Use OAuth tokens
request.setHeader('Authorization', 'Bearer ' + token);
```

**3. IP Whitelisting**
```
Setup → Security → Network Access
Add trusted IP ranges
```

**4. Certificate-Based Authentication**
```
Setup → Certificate and Key Management
Upload certificate for mutual TLS
```

**5. API Security**
```apex
@RestResource(urlMapping='/API/*')
global with sharing class SecureAPI {
    // 1. Validate input
    // 2. Check permissions
    // 3. Use with sharing
    // 4. Sanitize output
}
```

**6. Field-Level Encryption**
```
Setup → Platform Encryption
Encrypt sensitive fields at rest
```

**7. Session Settings**
```
Setup → Session Settings
- Timeout idle sessions
- Lock sessions to IP
- Require HTTPS
```

---

## Common Scenarios

### Q13: How do you retry failed callouts?

**Answer:**

**Exponential Backoff Pattern:**
```apex
public class CalloutWithRetry {
    private static final Integer MAX_RETRIES = 3;
    private static final Integer INITIAL_DELAY = 1000; // 1 second

    public static HttpResponse makeCalloutWithRetry(HttpRequest request) {
        Integer attempt = 0;
        Integer delay = INITIAL_DELAY;

        while (attempt < MAX_RETRIES) {
            try {
                Http http = new Http();
                HttpResponse response = http.send(request);

                if (response.getStatusCode() == 200) {
                    return response;
                } else if (response.getStatusCode() >= 500) {
                    // Server error - retry
                    attempt++;
                    if (attempt < MAX_RETRIES) {
                        System.debug('Retrying... Attempt ' + attempt);
                        // Sleep (not available in Apex, use platform events for true async retry)
                        delay *= 2; // Exponential backoff
                    }
                } else {
                    // Client error - don't retry
                    throw new CalloutException('Error: ' + response.getStatus());
                }

            } catch (Exception e) {
                attempt++;
                if (attempt >= MAX_RETRIES) {
                    throw e;
                }
            }
        }

        throw new CalloutException('Max retries exceeded');
    }
}
```

**Using Platform Events for Async Retry:**
```apex
// Publish retry event
Retry_Callout__e event = new Retry_Callout__e(
    Endpoint__c = endpoint,
    Payload__c = JSON.serialize(body),
    Attempt__c = attempt
);
EventBus.publish(event);

// Subscribe and retry
trigger RetryTrigger on Retry_Callout__e (after insert) {
    for (Retry_Callout__e event : Trigger.new) {
        if (event.Attempt__c < 3) {
            CalloutService.makeCallout(event.Endpoint__c, event.Payload__c);
        }
    }
}
```

---

## Interview Tips

### ✅ DO:
- **Explain trade-offs** (REST vs SOAP, sync vs async)
- **Mention security** (OAuth, Named Credentials)
- **Consider limits** (API calls, governor limits)
- **Know error handling** (status codes, retries)
- **Understand patterns** (request-response, pub/sub)

### ❌ DON'T:
- Don't hardcode credentials
- Don't forget Remote Site Settings
- Don't ignore error handling
- Don't use synchronous callouts in triggers
- Don't exceed API limits

---

## Practice Checklist

- [ ] Can make REST callouts (GET, POST, PUT, DELETE)
- [ ] Understand OAuth 2.0 flow
- [ ] Know Named Credentials benefits
- [ ] Can expose Apex as REST API
- [ ] Understand Platform Events
- [ ] Know integration patterns
- [ ] Can handle errors and retries
- [ ] Understand API limits
- [ ] Know security best practices
- [ ] Can choose right approach for scenario

**Next**: Practice building integrations and explaining architectural decisions! 🚀
