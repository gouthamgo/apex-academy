---
title: "HTTP Callouts"
section: "apex"
order: 13
difficulty: "intermediate"
readTime: "30 min"
description: "Master HTTP callouts to integrate Salesforce with external REST and SOAP services, including authentication, error handling, and best practices."
overview: "Learn how to make secure HTTP requests to external APIs, handle responses, implement authentication patterns, and build robust integrations."
concepts: ["http-callout", "rest-api", "http-request", "http-response", "named-credentials", "remote-site-settings", "oauth", "api-integration"]
prerequisites: ["exception-handling", "object-oriented-programming", "queueable-apex"]
relatedTopics: ["integration-fundamentals", "platform-events", "authentication-and-security"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

HTTP Callouts allow Salesforce to communicate with external systems via REST or SOAP web services. This is essential for integrations with third-party systems, microservices, and modern APIs.

## When to Use HTTP Callouts

**Perfect For:**
- Integrating with external REST APIs
- Sending data to external systems
- Retrieving data from web services
- Webhook implementations
- Payment gateway integrations
- Third-party service connections (Stripe, Twilio, etc.)

## Key Restrictions

**Critical Limitations:**
- ❌ Cannot be called from triggers (synchronous context)
- ✅ Must be called from `@future`, Queueable, or Batch Apex
- ⏱️ Timeout: 120 seconds maximum
- 📊 Limit: 100 callouts per Apex transaction
- 🔒 Must configure Remote Site Settings or use Named Credentials

## Callout vs Named Credentials

| Approach | Security | Maintenance | Best For |
|----------|----------|-------------|----------|
| **Remote Site** | Manual auth in code | Hard to maintain | Simple, public APIs |
| **Named Credential** | Centralized, encrypted | Easy to maintain | Enterprise, OAuth |

---

# Code Examples

## Basic GET Request

The simplest form of HTTP callout retrieves data from an external API.

```apex
public class BasicGetCallout {

    public static void fetchUserData() {
        // Create HTTP request
        HttpRequest req = new HttpRequest();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // HTTP REQUEST: Container for callout details
        // → Defines endpoint, method, headers, body

        req.setEndpoint('https://api.example.com/users/123');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ENDPOINT: Target URL for the callout
        // ⚠️ WARNING: Must be in Remote Site Settings or use Named Credential

        req.setMethod('GET');
        // ^^^^^^^^^^^^^^^^^^^^
        // HTTP METHOD: GET, POST, PUT, PATCH, DELETE, etc.
        // → GET = retrieve data (no body needed)

        req.setHeader('Content-Type', 'application/json');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // HEADERS: Specify content type, auth, etc.
        // → Common: Content-Type, Authorization, Accept

        req.setTimeout(120000);
        // ^^^^^^^^^^^^^^^^^^
        // TIMEOUT: Max 120 seconds (120000 milliseconds)
        // 💡 TIP: Set lower for faster failure detection

        // Send the request
        Http http = new Http();
        HttpResponse res = http.send(req);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SEND: Executes the callout and waits for response
        // → Blocks execution until response or timeout

        // Handle response
        if (res.getStatusCode() == 200) {
            String jsonResponse = res.getBody();
            System.debug('Success: ' + jsonResponse);

            // Parse JSON response
            Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonResponse);
            System.debug('User name: ' + data.get('name'));
        } else {
            System.debug('Error: ' + res.getStatusCode() + ' ' + res.getStatus());
        }
    }
}

// ⚠️ IMPORTANT: This cannot be called from a trigger
// Must use @future, Queueable, or Batch
```

## POST Request with JSON Body

Sending data to an external API requires a POST request with a request body.

```apex
public class PostCalloutExample {

    public static void createExternalUser(String name, String email) {
        // Build JSON payload
        Map<String, Object> payload = new Map<String, Object>{
            'name' => name,
            'email' => email,
            'role' => 'customer',
            'active' => true
        };

        String jsonBody = JSON.serialize(payload);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SERIALIZE: Convert Apex object to JSON string
        // → Alternative: JSON.serializePretty() for readable format

        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.example.com/users');
        req.setMethod('POST');
        // ^^^^^^^^^^^^^^^^^^
        // POST: Create new resource
        // → Requires body with data

        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/json');

        req.setBody(jsonBody);
        // ^^^^^^^^^^^^^^^^^^^^
        // SET BODY: Attach JSON payload to request
        // → Only for POST, PUT, PATCH methods

        req.setTimeout(120000);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 201) {
            // 201 = Created
            System.debug('User created successfully');

            // Parse response to get created user ID
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            String externalUserId = (String) result.get('id');
            System.debug('External ID: ' + externalUserId);

        } else {
            throw new CalloutException('Failed to create user: ' + res.getStatus());
        }
    }
}
```

## Using Named Credentials (Best Practice)

Named Credentials centralize authentication and endpoint configuration.

```apex
public class NamedCredentialCallout {

    public static void callWithNamedCredential() {
        HttpRequest req = new HttpRequest();

        // Use Named Credential in endpoint
        req.setEndpoint('callout:My_External_System/api/v1/users');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // NAMED CREDENTIAL: 'callout:' prefix + credential name
        // → Handles authentication automatically
        // → No need to set Authorization header manually
        // ✅ BEST PRACTICE: Always use Named Credentials in production

        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        req.setTimeout(120000);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            System.debug('Response: ' + res.getBody());
        } else {
            System.debug('Error: ' + res.getStatusCode());
        }
    }
}

// SETTING UP NAMED CREDENTIAL:
// Setup → Named Credentials → New
// - Label: My External System
// - Name: My_External_System
// - URL: https://api.example.com
// - Identity Type: Named Principal or Per User
// - Authentication Protocol: OAuth 2.0, Password, etc.
```

## OAuth 2.0 Authentication

For APIs requiring OAuth 2.0 (very common in modern integrations).

```apex
public class OAuth2Callout {

    // Step 1: Get access token
    public static String getAccessToken() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.example.com/oauth/token');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        // OAuth 2.0 Client Credentials flow
        String body = 'grant_type=client_credentials' +
                      '&client_id=YOUR_CLIENT_ID' +
                      '&client_secret=YOUR_CLIENT_SECRET';
        // ⚠️ WARNING: Never hardcode credentials in code
        // → Use Custom Metadata or Named Credentials

        req.setBody(body);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            Map<String, Object> authResponse = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) authResponse.get('access_token');
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ACCESS TOKEN: Use for subsequent API calls
            // → Typically expires in 1-24 hours
        } else {
            throw new CalloutException('Failed to get access token: ' + res.getStatus());
        }
    }

    // Step 2: Use access token in API call
    public static void makeAuthenticatedCall(String accessToken) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.example.com/api/v1/data');
        req.setMethod('GET');

        req.setHeader('Authorization', 'Bearer ' + accessToken);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BEARER TOKEN: Standard OAuth 2.0 authorization header
        // → Format: "Bearer {access_token}"

        req.setHeader('Content-Type', 'application/json');

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            System.debug('Data: ' + res.getBody());
        } else if (res.getStatusCode() == 401) {
            // Token expired - need to refresh
            System.debug('Token expired - refresh needed');
        } else {
            System.debug('Error: ' + res.getStatusCode());
        }
    }
}

// BETTER APPROACH: Use Named Credential with OAuth 2.0
// Salesforce handles token refresh automatically
```

## Asynchronous Callout with Queueable

Since callouts can't run in triggers, use Queueable Apex.

```apex
public class AsyncCalloutQueueable implements System.Queueable, System.Callable {
    // ^^^^^^^^^^^^^^^^^^^^^^^^
    // CALLABLE: Makes testing easier
    // → Can mock callouts in tests

    private List<Account> accountsToSync;
    private String apiEndpoint;

    public AsyncCalloutQueueable(List<Account> accounts) {
        this.accountsToSync = accounts;
        this.apiEndpoint = 'callout:External_CRM/api/accounts';
    }

    public void execute(QueueableContext context) {
        for (Account acc : accountsToSync) {
            try {
                syncAccountToExternal(acc);
            } catch (CalloutException e) {
                // Log error but continue processing
                System.debug('Callout failed for ' + acc.Name + ': ' + e.getMessage());
                createErrorLog(acc.Id, e.getMessage());
                // ⚠️ BEST PRACTICE: Don't let one failure stop all processing
            }
        }
    }

    private void syncAccountToExternal(Account acc) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(apiEndpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        // Serialize account data
        Map<String, Object> payload = new Map<String, Object>{
            'salesforce_id' => acc.Id,
            'name' => acc.Name,
            'industry' => acc.Industry,
            'phone' => acc.Phone
        };
        req.setBody(JSON.serialize(payload));

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() != 200 && res.getStatusCode() != 201) {
            throw new CalloutException('API returned ' + res.getStatusCode() + ': ' + res.getBody());
        }
    }

    private void createErrorLog(Id accountId, String errorMsg) {
        // Log to custom object for monitoring
        Integration_Error__c error = new Integration_Error__c(
            Account__c = accountId,
            Error_Message__c = errorMsg,
            Integration_Type__c = 'Account Sync'
        );
        insert error;
    }

    public Object call(String action, Map<String, Object> args) {
        return null;
    }
}

// TRIGGER USAGE
// trigger AccountTrigger on Account (after insert, after update) {
//     if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)) {
//         System.enqueueJob(new AsyncCalloutQueueable(Trigger.new));
//     }
// }
```

## Error Handling and Retry Logic

Production-ready callouts need robust error handling.

```apex
public class ResilientCallout {

    private static final Integer MAX_RETRIES = 3;
    private static final Integer RETRY_DELAY_MS = 1000;

    public static HttpResponse makeCalloutWithRetry(HttpRequest req) {
        return makeCalloutWithRetry(req, 0);
    }

    private static HttpResponse makeCalloutWithRetry(HttpRequest req, Integer attemptNumber) {
        Http http = new Http();

        try {
            HttpResponse res = http.send(req);

            // Check for retriable errors
            if (isRetriableError(res.getStatusCode())) {
                if (attemptNumber < MAX_RETRIES) {
                    System.debug('Retrying... Attempt ' + (attemptNumber + 1));

                    // Simple delay (in production, use exponential backoff)
                    Long startTime = System.currentTimeMillis();
                    while (System.currentTimeMillis() - startTime < RETRY_DELAY_MS) {
                        // Wait
                    }

                    return makeCalloutWithRetry(req, attemptNumber + 1);
                    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    // RECURSIVE RETRY: Try again with incremented counter
                } else {
                    throw new CalloutException('Max retries exceeded. Last status: ' + res.getStatusCode());
                }
            }

            return res;

        } catch (System.CalloutException e) {
            // Network errors (timeout, connection failed)
            if (attemptNumber < MAX_RETRIES) {
                System.debug('Network error, retrying: ' + e.getMessage());
                return makeCalloutWithRetry(req, attemptNumber + 1);
            } else {
                throw e;
            }
        }
    }

    private static Boolean isRetriableError(Integer statusCode) {
        // 429 = Too Many Requests
        // 500+ = Server errors
        // 408 = Request Timeout
        return statusCode == 429 ||
               statusCode == 408 ||
               statusCode >= 500;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // RETRIABLE ERRORS: Transient failures worth retrying
        // → 4xx client errors (except 429) usually aren't retriable
    }

    public static void handleErrorResponse(HttpResponse res) {
        Integer statusCode = res.getStatusCode();

        if (statusCode >= 200 && statusCode < 300) {
            // Success
            return;
        }

        // Parse error response
        String errorMessage = 'HTTP ' + statusCode + ': ' + res.getStatus();

        try {
            Map<String, Object> errorBody = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            if (errorBody.containsKey('message')) {
                errorMessage += ' - ' + errorBody.get('message');
            }
        } catch (Exception e) {
            // Response wasn't JSON, use raw body
            errorMessage += ' - ' + res.getBody();
        }

        // Handle specific status codes
        switch on statusCode {
            when 400 {
                throw new CalloutException('Bad Request: ' + errorMessage);
            }
            when 401 {
                throw new CalloutException('Unauthorized: Check credentials');
            }
            when 403 {
                throw new CalloutException('Forbidden: Insufficient permissions');
            }
            when 404 {
                throw new CalloutException('Not Found: ' + errorMessage);
            }
            when 429 {
                throw new CalloutException('Rate Limited: Too many requests');
            }
            when 500, 502, 503, 504 {
                throw new CalloutException('Server Error: ' + errorMessage);
            }
            when else {
                throw new CalloutException(errorMessage);
            }
        }
    }
}
```

## Parsing Complex JSON Responses

Real-world APIs often return nested JSON structures.

```apex
public class ComplexJsonParser {

    public static void parseNestedResponse() {
        // Assume we got this response from an API
        String jsonResponse = '{' +
            '"user": {' +
            '  "id": "12345",' +
            '  "name": "John Doe",' +
            '  "email": "john@example.com",' +
            '  "metadata": {' +
            '    "created": "2024-01-15",' +
            '    "role": "admin"' +
            '  },' +
            '  "orders": [' +
            '    {"id": "ORD-001", "total": 150.00},' +
            '    {"id": "ORD-002", "total": 275.50}' +
            '  ]' +
            '}' +
            '}';

        // APPROACH 1: Untyped parsing (flexible but type-unsafe)
        Map<String, Object> response = (Map<String, Object>) JSON.deserializeUntyped(jsonResponse);

        Map<String, Object> user = (Map<String, Object>) response.get('user');
        System.debug('User ID: ' + user.get('id'));

        Map<String, Object> metadata = (Map<String, Object>) user.get('metadata');
        System.debug('Role: ' + metadata.get('role'));

        List<Object> orders = (List<Object>) user.get('orders');
        for (Object orderObj : orders) {
            Map<String, Object> order = (Map<String, Object>) orderObj;
            System.debug('Order ID: ' + order.get('id'));
        }

        // APPROACH 2: Typed parsing (type-safe, requires wrapper class)
        ResponseWrapper typed = (ResponseWrapper) JSON.deserialize(jsonResponse, ResponseWrapper.class);
        System.debug('User name: ' + typed.user.name);
        System.debug('First order: ' + typed.user.orders[0].id);
    }

    // Wrapper classes for typed parsing
    public class ResponseWrapper {
        public UserData user;
    }

    public class UserData {
        public String id;
        public String name;
        public String email;
        public Metadata metadata;
        public List<OrderData> orders;
    }

    public class Metadata {
        public String created;
        public String role;
    }

    public class OrderData {
        public String id;
        public Decimal total;
    }
}

// ✅ BEST PRACTICE: Use typed parsing (wrapper classes) for production code
// → Type-safe, easier to maintain, better error handling
```

## Mock Callouts for Testing

Test callouts without making actual HTTP requests.

```apex
@isTest
public class CalloutTest {

    // Mock response class
    private class MockHttpResponse implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            // Create fake response
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setStatusCode(200);
            res.setBody('{"id": "12345", "name": "Test User"}');
            return res;
        }
    }

    @isTest
    static void testSuccessfulCallout() {
        // Set mock
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET MOCK: Intercepts all HTTP callouts in test
        // → No actual HTTP requests are made

        Test.startTest();
        BasicGetCallout.fetchUserData();
        Test.stopTest();

        // Assert results
        // (In real test, verify data was processed correctly)
    }

    @isTest
    static void testErrorHandling() {
        // Mock error response
        Test.setMock(HttpCalloutMock.class, new MockErrorResponse());

        Test.startTest();
        try {
            BasicGetCallout.fetchUserData();
            System.assert(false, 'Should have thrown exception');
        } catch (CalloutException e) {
            System.assert(true, 'Expected exception thrown');
        }
        Test.stopTest();
    }

    private class MockErrorResponse implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(500);
            res.setStatus('Internal Server Error');
            return res;
        }
    }
}
```

---

# Common Gotchas

## Gotcha 1: Callout in Trigger

**Problem:**
```apex
trigger AccountTrigger on Account (after insert) {
    HttpRequest req = new HttpRequest();
    req.setEndpoint('https://api.example.com');
    req.setMethod('GET');

    Http http = new Http();
    HttpResponse res = http.send(req);
    // ❌ Error: "Callout from triggers not allowed"
}
```

**Solution:**
```apex
trigger AccountTrigger on Account (after insert) {
    System.enqueueJob(new AccountCalloutQueueable(Trigger.new));
    // ✅ Use Queueable, @future, or Batch for callouts
}
```

## Gotcha 2: Missing Remote Site Setting

**Problem:**
```apex
req.setEndpoint('https://new-api.example.com/api');
// ❌ Error: "Unauthorized endpoint, please check Setup->Security->Remote site settings"
```

**Solution:**
Setup → Security → Remote Site Settings → New
- URL: `https://new-api.example.com`
- Or use Named Credentials (better)

## Gotcha 3: Not Handling Timeouts

**Problem:**
```apex
Http http = new Http();
HttpResponse res = http.send(req);
// If external system is slow, waits up to 120 seconds
```

**Solution:**
```apex
req.setTimeout(30000); // 30 seconds
// Set reasonable timeout based on expected response time
```

---

# Exam Tips

> 💀 **EXAM TRAP**: Callouts **cannot** be made from triggers, even from helper classes called by triggers. Must use async Apex.

> 💡 **TIP**: Maximum timeout is **120 seconds** (120,000 milliseconds). Cannot be exceeded.

> ✅ **BEST PRACTICE**: Always use **Named Credentials** for production integrations. Stores credentials securely.

> ⚠️ **WARNING**: You get **100 callout limit** per Apex transaction. Each HTTP request counts as one.

> 💡 **TIP**: In tests, use `Test.setMock(HttpCalloutMock.class, mockInstance)` to avoid actual callouts.

> ✅ **BEST PRACTICE**: Always implement **retry logic** for production callouts. External systems can fail.

---

# Practice Exercises

## Exercise 1: Basic REST Integration
**Task**: Create a class that makes a GET request to a weather API and returns the current temperature for a given city.

## Exercise 2: POST with Authentication
**Task**: Build a callout that sends Contact data to an external CRM using Basic Authentication (username:password in header).

## Exercise 3: OAuth Integration
**Task**: Implement a complete OAuth 2.0 flow including getting an access token and using it to fetch data.

## Exercise 4: Async Callout from Trigger
**Task**: Create a trigger that, when an Opportunity is Closed Won, makes an async callout to create an invoice in an external billing system.

## Exercise 5: Error Handling
**Task**: Build a resilient callout class with retry logic that handles 429 (rate limiting) and 5xx errors by retrying up to 3 times with exponential backoff.
