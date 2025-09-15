---
title: "@InvocableMethod Flow Integration Deep Dive"
category: "apex"
difficulty: "intermediate"
readTime: "12 min"
author: "Alex Thompson"
description: "Master Flow integration with Apex using @InvocableMethod annotation. Learn bulkification patterns, inner classes, and avoid common certification exam traps."
tags: ["invocable-method", "flow", "bulkification", "integration", "certification"]
prerequisites: ["apex-basics", "flow-fundamentals", "collections"]
relatedTutorials: ["trigger-bulkification", "flow-best-practices"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# @InvocableMethod Flow Integration Deep Dive

The `@InvocableMethod` annotation is one of the most powerful ways to integrate Apex with Salesforce Flow. This tutorial will teach you everything you need to know to master this integration pattern and avoid the common pitfalls that trip up developers in certification exams.

## What is @InvocableMethod?

The `@InvocableMethod` annotation allows you to expose Apex methods to Flow, Process Builder, and other declarative automation tools. When properly implemented, it enables seamless data exchange between your Apex code and visual workflows.

> 💡 **TIP**: @InvocableMethod is the preferred way to call Apex from Flow in modern Salesforce development, replacing the older approach of using global classes.

## Basic Implementation Pattern

Let's start with a complete example that demonstrates all the essential components:

```apex
public class SendCountryCodeToBot {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // "public class" = ACCESSIBLE FROM FLOW (required for @InvocableMethod)
    // "SendCountryCodeToBot" = CLASS NAME (MUST match filename)
    // 💡 WHY? Flow needs public access to see and execute this class

    public class Request {
        // ^^^^^^^^^^^^^^^^^^^^
        // "public class Request" = INNER CLASS (holds INPUT data FROM Flow)
        // 💀 EXAM TRAP: Forgetting this inner class = Flow can't send data
        @InvocableVariable(label='Input Data' description='Data from Flow' required=true)
        public String inputData;

        @InvocableVariable(label='User ID' description='ID of the user' required=false)
        public Id userId;
    }

    public class Response {
        // ^^^^^^^^^^^^^^^^^^^^^
        // "public class Response" = INNER CLASS (holds OUTPUT data TO Flow)
        // → REQUIRED for Flow to RECEIVE the response data
        @InvocableVariable(label='Country Code' description='Generated country code')
        // ^^^^^^^^^^^^^^^^^^
        // "ANNOTATION" = TELLS SALESFORCE: "This field goes TO Flow"
        // → REQUIRED for Flow to SEE the response field (EXAM #1 TRAP!)
        public String countryCode;

        @InvocableVariable(label='Success' description='Whether operation succeeded')
        public Boolean isSuccess;

        @InvocableVariable(label='Error Message' description='Error details if any')
        public String errorMessage;
    }

    @InvocableMethod(label='Send Country Code' description='Sends country code to bot' category='Integration')
    // ^^^^^^^^^^^^^^^
    // "ANNOTATION" = TELLS SALESFORCE: "Flow can CALL this method"
    // → NO @InvocableMethod = Flow CAN'T SEE THIS METHOD (EXAM FAIL)
    // ⚠️  MUST be static for Flow to access without instantiation
    public static List<Response> sendAU(List<Request> requests) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // "public static" = ACCESSIBLE without creating instance (Flow requirement)
        // "List<Response>" = RETURN TYPE (MUST be LIST - EXAM TRAP!)
        // "List<Request>" = INPUT TYPE (MUST be LIST for bulkification)
        // 💡 WHY? Flow ALWAYS works with collections for bulkification

        List<Response> results = new List<Response>();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // "List<Response>" = CONTAINER for ALL responses (BULK SAFE!)
        // 💀 CRITICAL: Must initialize list or get null pointer exception

        try {
            for (Request req : requests) {
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                // BULKIFICATION PATTERN: Process ALL records from Flow
                // → Flow can send 1-200 records in a single transaction
                // 💀 EXAM TRAP: NOT using for loop = only processes first record

                Response res = new Response();
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^
                // CREATE new Response for EACH request (1:1 mapping required)

                // Business logic here
                if (String.isNotBlank(req.inputData)) {
                    res.countryCode = 'AU';
                    res.isSuccess = true;
                    res.errorMessage = null;
                } else {
                    // ⚠️  EXAM TRAP: Always handle empty/null inputs
                    res.countryCode = null;
                    res.isSuccess = false;
                    res.errorMessage = 'Input data is required';
                }

                results.add(res);
                // ^^^^^^^^^^^^^^^^
                // ADD each response to results list (BULK PATTERN)
            }
        } catch (Exception e) {
            // ^^^^^^^^^^^^^^^^^^^^^^
            // EXCEPTION HANDLING: Flow needs error responses, not exceptions
            // 💀 EXAM TRAP: Unhandled exceptions crash the entire Flow

            Response errorResponse = new Response();
            errorResponse.countryCode = null;
            errorResponse.isSuccess = false;
            errorResponse.errorMessage = 'Error: ' + e.getMessage();
            results.add(errorResponse);
        }

        return results;
        // ^^^^^^^^^^^^^^
        // MUST return List<Response> (matches method signature)
        // 💡 Flow expects same number of responses as requests
    }
}
```

## Critical Requirements for @InvocableMethod

> 💀 **EXAM TRAP**: These requirements are frequently tested in certification exams!

### 1. Method Signature Requirements

```apex
// ✅ CORRECT - All requirements met
@InvocableMethod
public static List<ResponseClass> methodName(List<RequestClass> inputs) {
    // Must be: public, static, return List, accept List
}

// ❌ WRONG - Not static
@InvocableMethod
public List<ResponseClass> methodName(List<RequestClass> inputs) {
    // Flow cannot call non-static methods
}

// ❌ WRONG - Wrong return type
@InvocableMethod
public static ResponseClass methodName(List<RequestClass> inputs) {
    // Must return List, not single object
}

// ❌ WRONG - Wrong parameter type
@InvocableMethod
public static List<ResponseClass> methodName(RequestClass input) {
    // Must accept List, not single object
}
```

### 2. Inner Class Requirements

```apex
public class FlowIntegration {

    // ✅ CORRECT - Proper inner classes
    public class Request {
        @InvocableVariable(required=true)
        public String accountName;

        @InvocableVariable(required=false)
        public String accountType;
    }

    public class Response {
        @InvocableVariable
        public Id accountId;

        @InvocableVariable
        public Boolean success;
    }

    // ❌ WRONG - Missing @InvocableVariable annotations
    public class BadRequest {
        public String accountName; // Flow won't see this field
    }
}
```

## Advanced Bulkification Patterns

When Flow sends multiple records, your method must handle them efficiently:

```apex
public class BulkAccountProcessor {

    public class Request {
        @InvocableVariable(required=true)
        public String accountName;

        @InvocableVariable(required=true)
        public String industry;
    }

    public class Response {
        @InvocableVariable
        public Id accountId;

        @InvocableVariable
        public Boolean success;

        @InvocableVariable
        public String errorMessage;
    }

    @InvocableMethod(label='Bulk Create Accounts')
    public static List<Response> createAccounts(List<Request> requests) {
        List<Response> responses = new List<Response>();
        List<Account> accountsToInsert = new List<Account>();

        // 💡 BEST PRACTICE: Prepare all records before DML
        for (Request req : requests) {
            Account acc = new Account();
            acc.Name = req.accountName;
            acc.Industry = req.industry;
            accountsToInsert.add(acc);
        }

        try {
            // 💡 BEST PRACTICE: Single DML operation for all records
            Database.SaveResult[] saveResults = Database.insert(accountsToInsert, false);

            // Process results and create responses
            for (Integer i = 0; i < saveResults.size(); i++) {
                Response res = new Response();

                if (saveResults[i].isSuccess()) {
                    res.accountId = saveResults[i].getId();
                    res.success = true;
                    res.errorMessage = null;
                } else {
                    res.accountId = null;
                    res.success = false;
                    res.errorMessage = saveResults[i].getErrors()[0].getMessage();
                }

                responses.add(res);
            }

        } catch (Exception e) {
            // 💀 EXAM TRAP: Handle exceptions gracefully
            for (Request req : requests) {
                Response errorRes = new Response();
                errorRes.accountId = null;
                errorRes.success = false;
                errorRes.errorMessage = 'Unexpected error: ' + e.getMessage();
                responses.add(errorRes);
            }
        }

        return responses;
    }
}
```

## Common Certification Exam Traps

> ⚠️ **WARNING**: These are the most common mistakes that appear in certification exams!

### Trap #1: Forgetting @InvocableVariable

```apex
// ❌ WRONG - Flow won't see these fields
public class Request {
    public String name;     // Missing annotation
    public String type;     // Missing annotation
}

// ✅ CORRECT - Flow can see these fields
public class Request {
    @InvocableVariable
    public String name;

    @InvocableVariable
    public String type;
}
```

### Trap #2: Wrong Method Visibility

```apex
// ❌ WRONG - Flow can't call private methods
@InvocableMethod
private static List<Response> processData(List<Request> inputs) {}

// ❌ WRONG - Flow can't call non-static methods
@InvocableMethod
public List<Response> processData(List<Request> inputs) {}

// ✅ CORRECT - Flow can call this method
@InvocableMethod
public static List<Response> processData(List<Request> inputs) {}
```

### Trap #3: Incorrect Return Type

```apex
// ❌ WRONG - Must return List
@InvocableMethod
public static Response processData(List<Request> inputs) {
    return new Response();
}

// ✅ CORRECT - Returns List as required
@InvocableMethod
public static List<Response> processData(List<Request> inputs) {
    List<Response> results = new List<Response>();
    // Process all inputs...
    return results;
}
```

## Testing Your @InvocableMethod

Proper testing is crucial for @InvocableMethod implementations:

```apex
@isTest
private class SendCountryCodeToBotTest {

    @isTest
    static void testSendCountryCode_Success() {
        // Arrange
        List<SendCountryCodeToBot.Request> requests = new List<SendCountryCodeToBot.Request>();
        SendCountryCodeToBot.Request req = new SendCountryCodeToBot.Request();
        req.inputData = 'Test Data';
        req.userId = UserInfo.getUserId();
        requests.add(req);

        // Act
        Test.startTest();
        List<SendCountryCodeToBot.Response> responses = SendCountryCodeToBot.sendAU(requests);
        Test.stopTest();

        // Assert
        System.assertEquals(1, responses.size(), 'Should return one response');
        System.assertEquals('AU', responses[0].countryCode, 'Should return AU country code');
        System.assertEquals(true, responses[0].isSuccess, 'Should be successful');
        System.assertEquals(null, responses[0].errorMessage, 'Should have no error message');
    }

    @isTest
    static void testSendCountryCode_EmptyInput() {
        // Test error handling
        List<SendCountryCodeToBot.Request> requests = new List<SendCountryCodeToBot.Request>();
        SendCountryCodeToBot.Request req = new SendCountryCodeToBot.Request();
        req.inputData = '';  // Empty input
        requests.add(req);

        List<SendCountryCodeToBot.Response> responses = SendCountryCodeToBot.sendAU(requests);

        System.assertEquals(1, responses.size(), 'Should return one response');
        System.assertEquals(false, responses[0].isSuccess, 'Should fail with empty input');
        System.assertNotEquals(null, responses[0].errorMessage, 'Should have error message');
    }

    @isTest
    static void testSendCountryCode_BulkProcessing() {
        // Test bulkification
        List<SendCountryCodeToBot.Request> requests = new List<SendCountryCodeToBot.Request>();

        for (Integer i = 0; i < 200; i++) {
            SendCountryCodeToBot.Request req = new SendCountryCodeToBot.Request();
            req.inputData = 'Test Data ' + i;
            requests.add(req);
        }

        List<SendCountryCodeToBot.Response> responses = SendCountryCodeToBot.sendAU(requests);

        System.assertEquals(200, responses.size(), 'Should process all 200 records');

        for (SendCountryCodeToBot.Response response : responses) {
            System.assertEquals('AU', response.countryCode, 'All should return AU');
            System.assertEquals(true, response.isSuccess, 'All should be successful');
        }
    }
}
```

## Best Practices Summary

✅ **DO:**
- Always use `List<T>` for input and output parameters
- Make the method `public static`
- Include `@InvocableVariable` on all inner class fields
- Handle exceptions gracefully
- Test with bulk data (200+ records)
- Provide meaningful labels and descriptions

❌ **DON'T:**
- Use single objects instead of Lists
- Make the method non-static
- Forget annotations on inner class fields
- Let exceptions bubble up to Flow
- Assume only one record will be processed

## Flow Configuration

In Flow Builder, your @InvocableMethod appears as an Apex Action:

1. **Add Element** → **Action**
2. **Category**: Custom (or your specified category)
3. **Action**: Your method label
4. **Set Input Values**: Map Flow variables to your Request fields
5. **Store Output Values**: Map Response fields to Flow variables

> 💡 **TIP**: Use descriptive labels and descriptions in your annotations - they appear in Flow Builder and help other developers understand your method's purpose.

## Conclusion

The `@InvocableMethod` annotation is a powerful integration tool that requires careful attention to detail. By following the patterns and avoiding the traps outlined in this tutorial, you'll be able to create robust Flow integrations that handle bulk data efficiently and pass certification requirements.

Remember: Flow always works with Lists, your method must be public and static, and every field that Flow needs to see must have the `@InvocableVariable` annotation.