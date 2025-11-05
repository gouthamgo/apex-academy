---
title: "REST API Integration Patterns in Salesforce"
category: "integration"
difficulty: "intermediate"
readTime: "20 min"
author: "Jennifer Lee"
description: "Learn REST API integration patterns including HTTP callouts, authentication, error handling, and best practices for integrating Salesforce with external systems."
tags: ["rest-api", "integration", "http-callouts", "authentication", "json"]
prerequisites: ["apex-basics", "exception-handling", "asynchronous-apex"]
relatedTutorials: ["asynchronous-apex-patterns", "error-handling-patterns"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# REST API Integration Patterns in Salesforce

Integrating Salesforce with external REST APIs is a common requirement in enterprise applications. This tutorial covers comprehensive patterns for making HTTP callouts, handling authentication, processing responses, and implementing robust error handling.

## Understanding REST Callouts

REST (Representational State Transfer) is the most common API architecture for integrations. Salesforce provides the Http class for making callouts.

> 💡 **KEY INSIGHT**: Callouts must be made asynchronously using @future or Queueable when triggered by DML operations.

---

## Basic HTTP Callout Pattern

```apex
public class BasicHTTPCallout {

    // ✅ Simple GET request
    public static String makeGetRequest(String endpoint) {
        // Create HTTP request
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setTimeout(60000); // 60 seconds
        // ^^^^^^^^^^^^^^^^^^^^
        // REQUEST CONFIGURATION: Set endpoint, method, timeout
        // → Timeout: 1-120 seconds (default 60)
        // 💡 IMPORTANT: Always set appropriate timeout

        // Make callout
        Http http = new Http();
        HttpResponse res = http.send(req);
        // ^^^^^^^^^^^^^^^
        // HTTP.SEND: Execute the callout
        // → Blocks until response received or timeout
        // ⚠️ SYNCHRONOUS: Must be in async context if after DML

        // Check response
        if (res.getStatusCode() == 200) {
            return res.getBody();
            // ^^^^^^^^^^^^^^^^
            // RESPONSE BODY: Retrieved data
            // → Usually JSON or XML format
        } else {
            throw new CalloutException('Request failed: ' + res.getStatus());
        }
    }

    // ✅ POST request with JSON body
    public static String makePostRequest(String endpoint, Map<String, Object> data) {
        // Prepare request
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CONTENT-TYPE HEADER: Specify request format
        // → application/json for JSON data
        // → application/xml for XML data

        // Serialize data to JSON
        String jsonBody = JSON.serialize(data);
        req.setBody(jsonBody);
        // ^^^^^^^^^^^^^^^^^^
        // REQUEST BODY: Data to send
        // → Use JSON.serialize for objects
        // 💡 BEST PRACTICE: Always serialize properly

        // Make callout
        Http http = new Http();
        HttpResponse res = http.send(req);

        // Handle response
        if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
            return res.getBody();
        } else {
            System.debug('Error: ' + res.getStatusCode() + ' - ' + res.getStatus());
            throw new CalloutException('POST request failed: ' + res.getStatus());
        }
    }

    // ✅ PUT request for updates
    public static void makePutRequest(String endpoint, String recordId, Map<String, Object> data) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint + '/' + recordId);
        req.setMethod('PUT');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(JSON.serialize(data));

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() != 200) {
            throw new CalloutException('Update failed: ' + res.getStatus());
        }
    }

    // ✅ DELETE request
    public static void makeDeleteRequest(String endpoint, String recordId) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint + '/' + recordId);
        req.setMethod('DELETE');

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() != 200 && res.getStatusCode() != 204) {
            throw new CalloutException('Delete failed: ' + res.getStatus());
        }
    }
}
```

---

## Authentication Patterns

### Basic Authentication

```apex
public class BasicAuthCallout {

    public static String callWithBasicAuth(String endpoint, String username, String password) {
        // Encode credentials
        String credentials = username + ':' + password;
        Blob credentialsBlob = Blob.valueOf(credentials);
        String encodedCredentials = EncodingUtil.base64Encode(credentialsBlob);
        // ^^^^^^^^^^^^^^^^^^^^^^^
        // BASE64 ENCODING: Required for Basic Auth
        // → Format: username:password encoded in Base64
        // 💡 SECURITY: Never hardcode credentials!

        // Create request with auth header
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setHeader('Authorization', 'Basic ' + encodedCredentials);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // AUTHORIZATION HEADER: Basic Auth format
        // → "Basic " + base64(username:password)
        // ✅ STANDARD: Supported by most APIs

        // Make callout
        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else if (res.getStatusCode() == 401) {
            throw new CalloutException('Authentication failed - invalid credentials');
        } else {
            throw new CalloutException('Request failed: ' + res.getStatus());
        }
    }
}
```

### OAuth 2.0 Authentication

```apex
public class OAuth2Callout {

    private static String accessToken;
    private static DateTime tokenExpiry;

    // ✅ Get OAuth token
    public static String getAccessToken(String tokenEndpoint, String clientId, String clientSecret) {
        // Check if we have valid cached token
        if (accessToken != null && tokenExpiry > DateTime.now()) {
            return accessToken;
            // ^^^^^^^^^^^^^^^
            // TOKEN CACHING: Reuse valid tokens
            // → Reduces API calls and improves performance
            // 💡 OPTIMIZATION: Don't request new token every time
        }

        // Request new token
        HttpRequest req = new HttpRequest();
        req.setEndpoint(tokenEndpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');

        // OAuth client credentials grant
        String body = 'grant_type=client_credentials' +
                     '&client_id=' + EncodingUtil.urlEncode(clientId, 'UTF-8') +
                     '&client_secret=' + EncodingUtil.urlEncode(clientSecret, 'UTF-8');
        req.setBody(body);
        // ^^^^^^^^^^^^^^^^^^
        // OAUTH REQUEST: Client credentials flow
        // → grant_type=client_credentials for server-to-server
        // 💡 URL ENCODING: Always encode parameters

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            // Parse token response
            Map<String, Object> tokenData = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            accessToken = (String) tokenData.get('access_token');

            // Calculate expiry (usually expires_in is in seconds)
            Integer expiresIn = (Integer) tokenData.get('expires_in');
            tokenExpiry = DateTime.now().addSeconds(expiresIn - 60); // 60s buffer
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // TOKEN EXPIRY: Cache with buffer
            // → Subtract buffer to refresh before actual expiry
            // ✅ RELIABILITY: Prevents using expired tokens

            return accessToken;
        } else {
            throw new CalloutException('Token request failed: ' + res.getStatus());
        }
    }

    // ✅ Make authenticated API call
    public static String callApiWithOAuth(String endpoint, String tokenEndpoint,
                                         String clientId, String clientSecret) {
        // Get valid token
        String token = getAccessToken(tokenEndpoint, clientId, clientSecret);

        // Make authenticated request
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setHeader('Authorization', 'Bearer ' + token);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BEARER TOKEN: OAuth 2.0 auth header
        // → "Bearer " + access_token
        // ✅ STANDARD: Most common OAuth pattern

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else if (res.getStatusCode() == 401) {
            // Token might be expired, clear cache and retry
            accessToken = null;
            throw new CalloutException('Authentication failed - token may be expired');
        } else {
            throw new CalloutException('API call failed: ' + res.getStatus());
        }
    }
}
```

### API Key Authentication

```apex
public class APIKeyCallout {

    public static String callWithAPIKey(String endpoint, String apiKey) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');

        // API key in header (most common)
        req.setHeader('X-API-Key', apiKey);
        // ^^^^^^^^^^^^^^^^^^^^^^^
        // API KEY HEADER: Simple authentication
        // → Header name varies by API (X-API-Key, Authorization, api-key, etc.)
        // 💡 CHECK DOCS: Verify correct header name for your API

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new CalloutException('API call failed: ' + res.getStatus());
        }
    }

    // Alternative: API key in query parameter
    public static String callWithAPIKeyInQuery(String endpoint, String apiKey) {
        String urlWithKey = endpoint + '?api_key=' + EncodingUtil.urlEncode(apiKey, 'UTF-8');
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // QUERY PARAMETER: API key in URL
        // → Less secure than header (visible in logs)
        // ⚠️ SECURITY: Prefer header-based auth when possible

        HttpRequest req = new HttpRequest();
        req.setEndpoint(urlWithKey);
        req.setMethod('GET');

        Http http = new Http();
        HttpResponse res = http.send(req);

        return res.getBody();
    }
}
```

---

## Response Processing

```apex
public class ResponseProcessing {

    // ✅ Parse JSON response to Map
    public static Map<String, Object> parseJsonResponse(String jsonResponse) {
        Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonResponse);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DESERIALIZE UNTYPED: Parse to generic Map
        // → Flexible but requires casting
        // 💡 USE CASE: Dynamic or unknown structure

        return data;
    }

    // ✅ Parse JSON to custom class (strongly typed)
    public class AccountResponse {
        public String id;
        public String name;
        public String industry;
        public Decimal revenue;
        public List<ContactResponse> contacts;
    }

    public class ContactResponse {
        public String id;
        public String firstName;
        public String lastName;
        public String email;
    }

    public static AccountResponse parseToClass(String jsonResponse) {
        AccountResponse account = (AccountResponse) JSON.deserialize(
            jsonResponse,
            AccountResponse.class
        );
        // ^^^^^^^^^^^^^^^^^^^^^^
        // DESERIALIZE TYPED: Parse to custom class
        // → Strongly typed, compile-time checking
        // ✅ BEST PRACTICE: Use for known structures

        return account;
    }

    // ✅ Handle nested JSON
    public static void processNestedJson(String jsonResponse) {
        Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonResponse);

        // Access nested properties
        Map<String, Object> account = (Map<String, Object>) data.get('account');
        String accountName = (String) account.get('name');

        // Access arrays
        List<Object> contactsList = (List<Object>) account.get('contacts');
        for (Object contactObj : contactsList) {
            Map<String, Object> contact = (Map<String, Object>) contactObj;
            String email = (String) contact.get('email');
            System.debug('Contact email: ' + email);
        }
    }

    // ✅ Handle XML response
    public static void parseXmlResponse(String xmlResponse) {
        Dom.Document doc = new Dom.Document();
        doc.load(xmlResponse);
        // ^^^^^^^^^^^^^^^^^^^^
        // XML PARSING: Use Dom.Document
        // → Navigate XML structure
        // 💡 ALTERNATIVE: Use XmlStreamReader for large files

        Dom.XmlNode root = doc.getRootElement();
        for (Dom.XmlNode child : root.getChildElements()) {
            String value = child.getText();
            System.debug('Value: ' + value);
        }
    }
}
```

---

## Error Handling and Retry Logic

```apex
public class RobustCalloutPattern {

    // ✅ Comprehensive error handling
    public static String makeRobustCallout(String endpoint) {
        Integer maxRetries = 3;
        Integer retryCount = 0;
        Integer retryDelay = 1000; // 1 second

        while (retryCount < maxRetries) {
            try {
                HttpRequest req = new HttpRequest();
                req.setEndpoint(endpoint);
                req.setMethod('GET');
                req.setTimeout(30000);

                Http http = new Http();
                HttpResponse res = http.send(req);

                // Handle different status codes
                if (res.getStatusCode() == 200) {
                    return res.getBody();
                    // ^^^^^^^^^^^^^^^
                    // SUCCESS: Return response
                    // → Exit retry loop

                } else if (res.getStatusCode() == 429) {
                    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    // RATE LIMIT: API throttling
                    // → Should retry with exponential backoff
                    System.debug('Rate limited, retrying...');
                    throw new CalloutException('Rate limited');

                } else if (res.getStatusCode() >= 500) {
                    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    // SERVER ERROR: Temporary issue
                    // → Retry may succeed
                    System.debug('Server error, retrying...');
                    throw new CalloutException('Server error: ' + res.getStatus());

                } else if (res.getStatusCode() == 401 || res.getStatusCode() == 403) {
                    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    // AUTH ERROR: Don't retry
                    // → Fix authentication and try again
                    throw new CalloutException('Authentication failed: ' + res.getStatus());

                } else {
                    // ^^^^^^^^^^^^^^^^^^^^^^^
                    // OTHER ERROR: Log and fail
                    throw new CalloutException('Request failed: ' + res.getStatus());
                }

            } catch (System.CalloutException e) {
                retryCount++;

                if (retryCount >= maxRetries) {
                    // Max retries reached
                    System.debug('Max retries reached: ' + e.getMessage());
                    throw e;
                }

                // Exponential backoff
                System.debug('Retry ' + retryCount + ' after ' + retryDelay + 'ms');
                // Sleep not available in Apex, would need queueable chaining
                // In queueable: re-enqueue after delay
                // ^^^^^^^^^^^^^^^^^^^^^^^^
                // RETRY LOGIC: Exponential backoff
                // → Wait longer between each retry
                // 💡 BEST PRACTICE: Prevents overwhelming failing service

                retryDelay = retryDelay * 2; // Exponential backoff
            }
        }

        throw new CalloutException('Failed after ' + maxRetries + ' retries');
    }

    // ✅ Timeout handling
    public static String calloutWithTimeout(String endpoint, Integer timeoutMs) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setTimeout(timeoutMs);

            Http http = new Http();
            HttpResponse res = http.send(req);

            return res.getBody();

        } catch (System.CalloutException e) {
            if (e.getMessage().contains('Read timed out')) {
                // ^^^^^^^^^^^^^^^^^^^^^^^^
                // TIMEOUT: Request took too long
                // → Consider increasing timeout or optimizing API
                System.debug('Request timed out after ' + timeoutMs + 'ms');
                throw new CalloutException('Request timeout');
            } else {
                throw e;
            }
        }
    }
}
```

---

## Asynchronous Callout Patterns

```apex
// ✅ Future method callout
public class AsyncCalloutFuture {

    @future(callout=true)
    public static void makeAsyncCallout(String accountId) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://api.example.com/accounts/' + accountId);
            req.setMethod('GET');
            req.setHeader('Authorization', 'Bearer ' + getApiToken());

            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                // Update Salesforce record
                Account acc = new Account(Id = accountId);
                acc.External_Data__c = res.getBody();
                update acc;
                // ^^^^^^^^^^^
                // DML AFTER CALLOUT: Allowed in future
                // → Update SF with external data
            }

        } catch (Exception e) {
            System.debug('Async callout failed: ' + e.getMessage());
            // Log error for monitoring
            createErrorLog(accountId, e);
        }
    }

    private static String getApiToken() {
        return 'dummy-token';
    }

    private static void createErrorLog(String recordId, Exception e) {
        // Error logging logic
    }
}

// ✅ Queueable callout (more flexible)
public class AsyncCalloutQueueable implements Queueable, Database.AllowsCallouts {

    private String endpoint;
    private String accountId;
    private Integer retryCount;

    public AsyncCalloutQueueable(String endpoint, String accountId) {
        this(endpoint, accountId, 0);
    }

    public AsyncCalloutQueueable(String endpoint, String accountId, Integer retryCount) {
        this.endpoint = endpoint;
        this.accountId = accountId;
        this.retryCount = retryCount;
    }

    public void execute(QueueableContext context) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');

            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                processSuccess(res.getBody());

            } else if (res.getStatusCode() >= 500 && retryCount < 3) {
                // Server error - retry
                System.debug('Server error, queuing retry ' + (retryCount + 1));
                System.enqueueJob(new AsyncCalloutQueueable(endpoint, accountId, retryCount + 1));
                // ^^^^^^^^^^^^^^^^^^^^^^^
                // RETRY WITH QUEUEABLE: Chain new job for retry
                // → More flexible than future method
                // 💡 RESILIENCE: Automatic retry on temporary failures

            } else {
                throw new CalloutException('Request failed: ' + res.getStatus());
            }

        } catch (Exception e) {
            System.debug('Callout failed: ' + e.getMessage());
            createErrorLog(accountId, e);
        }
    }

    private void processSuccess(String responseBody) {
        Account acc = new Account(Id = accountId);
        acc.External_Data__c = responseBody;
        update acc;
    }

    private void createErrorLog(String recordId, Exception e) {
        // Error logging
    }
}
```

---

## Remote Site Settings and Named Credentials

```apex
// ⚠️ IMPORTANT: Configure Remote Site Settings
// Setup → Remote Site Settings → New Remote Site

// ✅ BETTER: Use Named Credentials (no Remote Site needed)
public class NamedCredentialCallout {

    public static String callWithNamedCredential() {
        HttpRequest req = new HttpRequest();
        // Named credential URL includes authentication
        req.setEndpoint('callout:My_Named_Credential/api/accounts');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // NAMED CREDENTIAL: callout:CredentialName
        // → Handles authentication automatically
        // → No Remote Site Setting needed
        // ✅ BEST PRACTICE: Secure, no hardcoded credentials

        req.setMethod('GET');

        Http http = new Http();
        HttpResponse res = http.send(req);

        return res.getBody();
    }
}
```

---

## Testing Callouts

```apex
@isTest
public class CalloutTest {

    // ✅ Mock HTTP callout
    public class MockHttpResponse implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            // Create mock response
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"id": "123", "name": "Test Account"}');
            // ^^^^^^^^^^^^^^^^^^
            // MOCK RESPONSE: Simulated API response
            // → Tests don't make real callouts
            // 💡 TESTING: Fast, reliable, no external dependencies

            return res;
        }
    }

    @isTest
    static void testSuccessfulCallout() {
        // Set mock
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());
        // ^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET MOCK: Intercept HTTP callouts
        // → Returns mock response instead of real callout

        Test.startTest();
        String response = BasicHTTPCallout.makeGetRequest('https://api.example.com/accounts');
        Test.stopTest();

        // Verify
        System.assertNotEquals(null, response, 'Should receive response');
        System.assert(response.contains('Test Account'), 'Should contain account data');
    }

    @isTest
    static void testErrorHandling() {
        // Mock error response
        Test.setMock(HttpCalloutMock.class, new MockErrorResponse());

        try {
            Test.startTest();
            BasicHTTPCallout.makeGetRequest('https://api.example.com/accounts');
            Test.stopTest();

            System.assert(false, 'Should have thrown exception');
        } catch (CalloutException e) {
            System.assert(e.getMessage().contains('failed'), 'Should have error message');
        }
    }

    public class MockErrorResponse implements HttpCalloutMock {
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

## Best Practices Summary

✅ **Always Do:**
- Use Named Credentials for authentication
- Implement proper error handling and retries
- Set appropriate timeouts
- Make callouts asynchronously when triggered by DML
- Use mock callouts in tests
- Cache authentication tokens
- Log errors for monitoring

❌ **Never Do:**
- Make callouts in loops
- Hardcode credentials in code
- Ignore error responses
- Make synchronous callouts after DML
- Forget to set timeouts

⚠️ **Remember:**
- Maximum 100 callouts per transaction
- Maximum 120-second timeout
- Named Credentials don't count toward Remote Site limit
- Use queueable for retry logic
- Always handle rate limiting

Master these patterns to build robust, reliable integrations between Salesforce and external systems!
