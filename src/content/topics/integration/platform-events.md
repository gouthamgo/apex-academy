---
title: "Platform Events and Event-Driven Architecture"
section: "integration"
order: 2
difficulty: "intermediate"
readTime: "25 min"
description: "Master Platform Events for event-driven integration, real-time messaging, and decoupled architecture patterns in Salesforce."
overview: "Learn how to publish and subscribe to Platform Events for building scalable, event-driven applications."
concepts: ["platform-events", "publish-subscribe", "event-bus", "trigger", "streaming", "change-data-capture"]
prerequisites: ["integration-fundamentals", "apex-basics", "triggers-and-frameworks"]
relatedTopics: ["streaming-api", "change-data-capture"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Platform Events enable event-driven architecture in Salesforce using a publish-subscribe model.

## Benefits
- **Decoupling**: Publishers and subscribers are independent
- **Scalability**: Handle high-volume messaging
- **Real-time**: Near-instant event delivery
- **Reliability**: Durable event delivery with replay

---

# Code Examples

## Define Platform Event

```xml
<!-- Order_Event__e.object-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <deploymentStatus>Deployed</deploymentStatus>
    <eventType>PlatformEvent</eventType>
    <label>Order Event</label>
    <pluralLabel>Order Events</pluralLabel>
</CustomObject>
```

## Publish Events (Apex)

```apex
public class OrderEventPublisher {
    
    public static void publishOrderEvent(String orderNumber, String status) {
        // Create event
        Order_Event__e event = new Order_Event__e(
            Order_Number__c = orderNumber,
            Status__c = status,
            Event_Time__c = DateTime.now()
        );
        
        // Publish event
        Database.SaveResult result = EventBus.publish(event);
        
        if (result.isSuccess()) {
            System.debug('Event published successfully');
        } else {
            for (Database.Error error : result.getErrors()) {
                System.debug('Error publishing event: ' + error.getMessage());
            }
        }
    }
    
    public static void publishBulkEvents(List<Order_Event__e> events) {
        List<Database.SaveResult> results = EventBus.publish(events);
        
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                // Handle error
            }
        }
    }
}
```

## Subscribe to Events (Trigger)

```apex
trigger OrderEventTrigger on Order_Event__e (after insert) {
    
    for (Order_Event__e event : Trigger.new) {
        System.debug('Received event: ' + event.Order_Number__c);
        
        // Process event
        processOrderUpdate(event.Order_Number__c, event.Status__c);
    }
}

public static void processOrderUpdate(String orderNumber, String status) {
    // Update related records
    List<Order__c> orders = [
        SELECT Id, Status__c
        FROM Order__c
        WHERE Order_Number__c = :orderNumber
    ];
    
    for (Order__c order : orders) {
        order.Status__c = status;
    }
    
    if (!orders.isEmpty()) {
        update orders;
    }
}
```

## Subscribe to Events (LWC)

```javascript
import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class OrderEventSubscriber extends LightningElement {
    channelName = '/event/Order_Event__e';
    subscription = {};
    
    connectedCallback() {
        this.handleSubscribe();
        this.registerErrorListener();
    }
    
    handleSubscribe() {
        const messageCallback = (response) => {
            console.log('Event received:', response);
            const event = response.data.payload;
            this.processEvent(event);
        };
        
        subscribe(this.channelName, -1, messageCallback)
            .then(response => {
                this.subscription = response;
                console.log('Subscribed to channel');
            });
    }
    
    handleUnsubscribe() {
        unsubscribe(this.subscription);
    }
    
    registerErrorListener() {
        onError(error => {
            console.error('Streaming error:', error);
        });
    }
    
    processEvent(event) {
        console.log('Order:', event.Order_Number__c);
        console.log('Status:', event.Status__c);
    }
    
    disconnectedCallback() {
        this.handleUnsubscribe();
    }
}
```

---

# Best Practices

✅ Use Platform Events for integration between systems
✅ Keep event payload small and focused
✅ Implement idempotent subscribers
✅ Handle replay for reliability
✅ Monitor event usage and delivery

❌ Don't use for synchronous processing
❌ Don't include sensitive data in events
❌ Don't rely on immediate delivery

---

# Related Topics

- **[Integration Fundamentals](integration-fundamentals)**
- **[Streaming API](streaming-api)**
