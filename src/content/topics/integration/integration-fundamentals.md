---
title: "Integration Fundamentals"
section: "integration"
order: 1
difficulty: "beginner"
readTime: "20 min"
description: "Learn the fundamentals of integrating Salesforce with external systems including REST APIs, SOAP, Platform Events, and integration patterns."
overview: "Understand core integration concepts, patterns, and when to use each integration approach."
concepts: ["integration", "rest-api", "soap", "platform-events", "streaming-api", "callouts", "web-services"]
prerequisites: ["apex-basics", "asynchronous-apex-patterns"]
relatedTopics: ["rest-api-integration-patterns", "platform-events"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Integration connects Salesforce with external systems for data exchange and business process automation.

## Integration Patterns

- **Request-Response**: Synchronous data exchange (REST, SOAP)
- **Fire-and-Forget**: Asynchronous messaging (Platform Events)
- **Batch**: Large data volumes (Bulk API)
- **Streaming**: Real-time data push (Streaming API)

## When to Use Each

**REST APIs**: Modern, lightweight, JSON-based
**SOAP**: Enterprise, WSDL-based, XML
**Platform Events**: Event-driven architecture
**Streaming API**: Real-time notifications
**Bulk API**: Data migration, large volumes

---

# Integration Methods

## REST Callouts

```apex
HttpRequest req = new HttpRequest();
req.setEndpoint('https://api.example.com/data');
req.setMethod('GET');
req.setHeader('Authorization', 'Bearer token');

Http http = new Http();
HttpResponse res = http.send(req);

if (res.getStatusCode() == 200) {
    String body = res.getBody();
    // Process response
}
```

## Platform Events

```apex
// Publish event
Order_Event__e event = new Order_Event__e(
    Order_Number__c = '12345',
    Status__c = 'Shipped'
);
Database.SaveResult result = EventBus.publish(event);
```

## Best Practices

✅ Use Named Credentials for authentication
✅ Implement retry logic and error handling
✅ Make callouts asynchronously when possible
✅ Respect API rate limits
✅ Log integration activities

❌ Don't hardcode credentials
❌ Don't make callouts in loops
❌ Don't ignore timeout errors

---

# Related Topics

- **[REST API Integration](rest-api-integration-patterns)**
- **[Asynchronous Apex](asynchronous-apex-patterns)**
