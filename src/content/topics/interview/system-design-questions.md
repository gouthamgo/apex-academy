---
title: "Salesforce System Design Questions"
section: "interview"
order: 6
difficulty: "advanced"
readTime: "35 min"
description: "Master system design interviews for Salesforce architects. Learn to design scalable, maintainable Salesforce solutions."
overview: "Comprehensive guide to Salesforce system design interviews. Covers architecture patterns, data modeling, scalability, integration design, and best practices for enterprise solutions."
concepts: ["System Design", "Architecture", "Data Modeling", "Scalability", "Integration Patterns", "Enterprise Architecture"]
prerequisites: ["apex-interview-questions", "integration-interview-questions"]
relatedTopics: ["scenario-based-challenges"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Salesforce System Design Questions

Master architectural thinking and design scalable Salesforce solutions.

## System Design Interview Basics

### What to Expect

**System design interviews test:**
- Architecture thinking
- Trade-off analysis
- Scalability considerations
- Best practices knowledge
- Communication skills

**Format:**
- 45-60 minutes
- Open-ended problem
- Whiteboard or virtual diagram
- Conversational, collaborative

**Not Expected:**
- Perfect solution (no "right" answer)
- All implementation details
- Complete ERD in 45 minutes

---

### How to Approach

**Framework (30 minutes):**

**1. Clarify Requirements (5 min)**
- Ask questions about scope
- Understand constraints
- Define success criteria

**2. High-Level Design (10 min)**
- Identify major components
- Draw architecture diagram
- Explain data flow

**3. Deep Dive (10 min)**
- Data model details
- Critical algorithms
- Technical challenges

**4. Scale & Optimize (5 min)**
- Handle growth
- Performance considerations
- Monitoring & maintenance

---

## Complete System Design Example

### Question: Design a Real Estate Platform on Salesforce

**Scenario:**
"Design a Salesforce-based platform for a real estate company with 500 agents managing 10,000+ properties. Agents need to list properties, schedule showings, manage offers, and close deals. The system should integrate with external mortgage and title companies."

---

#### Step 1: Clarify Requirements (5 min)

**Questions to Ask:**

**Q: "What's the expected scale?"**
A: 500 agents, 10,000 active listings, 50,000 showings/year

**Q: "What are the critical user flows?"**
A: List property → Schedule showings → Receive offers → Accept offer → Close deal

**Q: "Any integration requirements?"**
A: Yes - mortgage pre-approval API, title search service, DocuSign

**Q: "Performance requirements?"**
A: Page loads <2 seconds, mobile-first

**Q: "Reporting needs?"**
A: Agent performance, property analytics, sales pipeline

**Q: "Security requirements?"**
A: Agents see only their properties unless shared. Buyers can view public listings.

---

#### Step 2: High-Level Architecture (10 min)

**Components:**

```
┌─────────────────────────────────────────────────────────┐
│                    Salesforce Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐        ┌──────────────────┐        │
│  │  Experience     │        │  Core Objects    │        │
│  │  Cloud Site     │◄─────► │  - Property      │        │
│  │  (Buyers)       │        │  - Showing       │        │
│  └─────────────────┘        │  - Offer         │        │
│                             │  - Contract      │        │
│  ┌─────────────────┐        └──────────────────┘        │
│  │  Sales App      │                 ▲                  │
│  │  (Agents)       │─────────────────┘                  │
│  └─────────────────┘                                    │
│                                                           │
│  ┌────────────────────────────────────────────┐         │
│  │  Automation Layer                          │         │
│  │  - Flows (showing notifications)           │         │
│  │  - Triggers (offer validation)             │         │
│  │  - Batch (nightly cleanup)                 │         │
│  └────────────────────────────────────────────┘         │
│                                                           │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼───┐    ┌────▼────┐   ┌────▼─────┐
   │Mortgage│    │  Title  │   │ DocuSign │
   │   API  │    │ Service │   │   API    │
   └────────┘    └─────────┘   └──────────┘
```

---

#### Step 3: Data Model (10 min)

**Core Objects:**

```apex
Property__c (Custom Object)
├── Fields:
│   ├── Address__c (Text Area)
│   ├── Price__c (Currency)
│   ├── Square_Feet__c (Number)
│   ├── Bedrooms__c (Number)
│   ├── Bathrooms__c (Number)
│   ├── Status__c (Picklist: Active, Pending, Sold, Withdrawn)
│   ├── Listing_Date__c (Date)
│   ├── Listing_Agent__c (Lookup → User)
│   ├── Photos__c (Files)
│   └── Description__c (Rich Text Area)
│
├── Relationships:
│   └── Showings__c (Master-Detail, 1:Many)
│   └── Offers__c (Master-Detail, 1:Many)

Showing__c (Custom Object)
├── Fields:
│   ├── Property__c (Master-Detail → Property)
│   ├── Showing_Date__c (DateTime)
│   ├── Attendee_Name__c (Text)
│   ├── Attendee_Email__c (Email)
│   ├── Attendee_Phone__c (Phone)
│   ├── Status__c (Picklist: Scheduled, Completed, Cancelled)
│   └── Feedback__c (Long Text Area)
│
├── Roll-Ups on Property:
│   └── Total_Showings__c (COUNT)
│   └── Interested_Buyers__c (COUNT where Feedback = 'Interested')

Offer__c (Custom Object)
├── Fields:
│   ├── Property__c (Master-Detail → Property)
│   ├── Buyer_Contact__c (Lookup → Contact)
│   ├── Offer_Amount__c (Currency)
│   ├── Offer_Date__c (Date)
│   ├── Contingencies__c (Picklist Multi-select)
│   ├── Financing_Type__c (Picklist: Cash, Conventional, FHA, VA)
│   ├── Status__c (Picklist: Submitted, Under Review, Accepted, Rejected, Withdrawn)
│   ├── Pre_Approval_Amount__c (Currency)
│   └── Expiration_Date__c (Date)
│
├── Roll-Ups on Property:
│   └── Highest_Offer__c (MAX of Offer_Amount)
│   └── Total_Offers__c (COUNT)

Contract__c (Custom Object)
├── Fields:
│   ├── Property__c (Lookup → Property)
│   ├── Accepted_Offer__c (Lookup → Offer)
│   ├── Buyer__c (Lookup → Contact)
│   ├── Contract_Date__c (Date)
│   ├── Closing_Date__c (Date)
│   ├── Final_Price__c (Currency)
│   ├── Status__c (Picklist: Active, Contingencies Pending, Clear to Close, Closed, Terminated)
│   └── Document_URL__c (URL - DocuSign link)
```

---

#### Step 4: Security Model

**OWD Settings:**
```
Property__c: Private
Showing__c: Controlled by Parent
Offer__c: Controlled by Parent
Contract__c: Private
```

**Sharing Rules:**
```
Rule 1: Public Listings
├── Share: Property__c where Status = 'Active'
├── With: All Internal Users
└── Access: Read Only

Rule 2: Office Collaboration
├── Share: Property__c owned by agents in same office
├── With: Public Group: "Same Office Agents"
└── Access: Read/Write
```

**Profiles:**
```
Listing Agent
├── Create/Read/Edit/Delete: Property, Showing, Offer, Contract
├── Can modify: All property fields
└── Reports: Agent dashboard access

Buyer (Experience Cloud)
├── Read: Public properties only
├── Create: Showing requests
└── No access: Offers, Contracts (until theirs)

Office Manager
├── View All: All properties in their office
├── Modify All: Properties (override agent)
└── Reports: Office-wide analytics
```

---

#### Step 5: Automation

**Flows:**

**1. New Showing Notification**
```
Trigger: Showing__c created
Criteria: Status = 'Scheduled'

Actions:
1. Send Email Alert → Listing Agent
2. Send SMS → Listing Agent (via Twilio API)
3. Update Property → Last_Showing_Date__c
```

**2. Offer Validation & Notification**
```
Trigger: Offer__c created or updated
Criteria: Status = 'Submitted'

Actions:
1. Validation: Offer_Amount > 0
2. Validation: Expiration_Date > TODAY
3. Create Task → Review offer (assigned to agent)
4. Send Email → Listing Agent
5. Platform Event → Notify mobile app
```

**3. Contract Generation**
```
Trigger: Offer__c updated
Criteria: Status changed to 'Accepted'

Actions:
1. Create Contract__c record
2. Populate fields from Offer
3. Call DocuSign API → Generate contract
4. Update Property → Status = 'Pending'
5. Send Email → Buyer & Agent
```

**Scheduled Flows:**

**Nightly Cleanup**
```
Schedule: Daily at 2 AM

Logic:
1. Find expired showings (past date, status = 'Scheduled')
2. Update status to 'Cancelled'
3. Find expired offers (past expiration, status = 'Submitted')
4. Update status to 'Expired'
5. Send summary email to office managers
```

---

#### Step 6: Integration Architecture

**Mortgage Pre-Approval Integration:**

```apex
// Named Credential: Mortgage_API
public class MortgageService {
    @future(callout=true)
    public static void checkPreApproval(Id offerId) {
        Offer__c offer = [SELECT Buyer_Contact__c, Offer_Amount__c
                          FROM Offer__c WHERE Id = :offerId];

        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Mortgage_API/pre-approval');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        Map<String, Object> body = new Map<String, Object>{
            'contactId' => offer.Buyer_Contact__c,
            'loanAmount' => offer.Offer_Amount__c
        };
        req.setBody(JSON.serialize(body));

        HttpResponse res = new Http().send(req);

        if (res.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>)
                JSON.deserializeUntyped(res.getBody());

            offer.Pre_Approval_Status__c = (String)result.get('status');
            offer.Pre_Approval_Amount__c = (Decimal)result.get('amount');
            update offer;
        }
    }
}
```

**DocuSign Integration:**

```apex
// Platform Event for async processing
public class DocuSignService {
    public static void generateContract(Id contractId) {
        // Publish event for async processing
        Contract_Ready__e event = new Contract_Ready__e(
            Contract_Id__c = contractId
        );
        EventBus.publish(event);
    }
}

// Event trigger handles actual callout
trigger ContractReadyTrigger on Contract_Ready__e (after insert) {
    List<Id> contractIds = new List<Id>();
    for (Contract_Ready__e event : Trigger.new) {
        contractIds.add(event.Contract_Id__c);
    }
    DocuSignCallout.sendForSignature(contractIds);
}
```

---

#### Step 7: Scalability Considerations

**Data Volume:**
```
Current: 10,000 properties, 50,000 showings/year
Growth: 100,000 properties, 500,000 showings/year (5 years)

Solutions:
1. Archive old properties (Sold > 2 years) to Big Objects
2. Use Skinny Tables for frequently queried fields
3. Index custom fields used in queries
4. Implement pagination (1000 records max per page)
```

**Performance Optimizations:**

**Query Optimization:**
```apex
// ❌ Bad: Query in loop
for (Property__c prop : properties) {
    List<Showing__c> showings = [SELECT Id FROM Showing__c
                                  WHERE Property__c = :prop.Id];
}

// ✅ Good: Single query with Map
Map<Id, List<Showing__c>> showingsByProperty = new Map<Id, List<Showing__c>>();
for (Showing__c showing : [SELECT Id, Property__c
                           FROM Showing__c
                           WHERE Property__c IN :propertyIds]) {
    if (!showingsByProperty.containsKey(showing.Property__c)) {
        showingsByProperty.put(showing.Property__c, new List<Showing__c>());
    }
    showingsByProperty.get(showing.Property__c).add(showing);
}
```

**Caching Strategy:**
```javascript
// LWC - Use Platform Cache for frequently accessed data
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class PropertyDetails extends LightningElement {
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    property; // Auto-cached by LDS
}
```

---

#### Step 8: Reporting & Analytics

**Reports:**

**1. Agent Performance Dashboard**
```
- Total Listings (this quarter)
- Showings per Listing (average)
- Offer Acceptance Rate
- Average Days on Market
- Total Commission
```

**2. Property Analytics**
```
- Price per Square Foot (by neighborhood)
- Inventory Levels (trend chart)
- Days on Market (histogram)
- Offer-to-Ask Ratio
```

**3. Sales Pipeline**
```
Matrix Report:
Rows: Listing Agent
Columns: Property Status
Values: Count of Properties, Sum of Price
```

**Custom Report Type:**
```
Primary Object: Property
Related Objects:
- Showings (each property must have at least one showing)
- Offers (each property may have offers)

Fields Available:
- Property: All fields
- Showings: Date, Attendee, Feedback
- Offers: Amount, Status, Buyer
```

---

## Additional Design Questions

### Q1: Design a Case Escalation System

**Requirements:**
- Auto-escalate cases based on SLA
- Multi-tier support (L1, L2, L3)
- Integration with external ticketing

**High-Level Design:**

**Objects:**
```
Case (Standard)
├── SLA_Breach_Date__c
├── Escalation_Level__c (1, 2, 3)
└── Last_Escalation_Date__c

Support_Tier__c
├── Name (L1, L2, L3)
├── Response_Time__c (hours)
└── Queue_Id__c (Lookup to Queue)
```

**Escalation Flow:**
```
Scheduled Flow (Hourly):
1. Find cases where:
   - Status != Closed
   - CreatedDate + SLA_Breach_Date < NOW
   - Not escalated in last 24 hours

2. For each case:
   - If Escalation_Level = 1 → Move to L2 queue
   - If Escalation_Level = 2 → Move to L3 queue
   - If Escalation_Level = 3 → Send to manager

3. Create task for new owner
4. Send notification
5. Log escalation history
```

---

### Q2: Design a Multi-Currency Order Management System

**Requirements:**
- Support 50+ currencies
- Real-time exchange rates
- Quote in one currency, order in another

**Design Considerations:**

**Enable Multi-Currency:**
```
Setup → Company Settings → Enable Multi-Currency

Dated Exchange Rates:
- Store historical rates
- Lock orders to exchange rate at creation
```

**Data Model:**
```
Quote__c
├── Currency_Code__c (Picklist: USD, EUR, GBP...)
├── Total_Amount__c (Currency)
├── Exchange_Rate__c (Number - at time of quote)

Order__c
├── Quote__c (Lookup)
├── Currency_Code__c (from Quote)
├── Total_Amount__c (Currency)
├── Total_Amount_USD__c (Formula: Total * Exchange_Rate)
```

**Exchange Rate Service:**
```apex
@future(callout=true)
public static void updateExchangeRates() {
    HttpRequest req = new HttpRequest();
    req.setEndpoint('callout:Exchange_Rate_API/latest');
    req.setMethod('GET');

    HttpResponse res = new Http().send(req);
    Map<String, Object> rates = (Map<String, Object>)
        JSON.deserializeUntyped(res.getBody());

    List<DatedConversionRate> updates = new List<DatedConversionRate>();
    for (String currency : rates.keySet()) {
        DatedConversionRate dcr = new DatedConversionRate(
            IsoCode = currency,
            ConversionRate = (Decimal)rates.get(currency),
            StartDate = Date.today()
        );
        updates.add(dcr);
    }
    // Update via Metadata API
}
```

---

## Design Principles

### 1. Start with Standard Features

```
✅ Use standard objects when possible
✅ Leverage OOB functionality
✅ Customize only when needed

❌ Don't reinvent the wheel
❌ Don't over-customize
```

### 2. Design for Scale

```
Consider:
- Data volume (millions of records?)
- User concurrency (1000+ users?)
- API limits (15,000 calls/day)
- Storage limits (vary by edition)
```

### 3. Security First

```
Always address:
- Object-level security (Profiles/Permission Sets)
- Field-level security (FLS)
- Record-level security (OWD, Sharing, Hierarchy)
- Data encryption (Platform Encryption for sensitive fields)
```

### 4. Maintainability

```
Prioritize:
- Declarative over code (Flows > Process Builder > Apex)
- Modularity (separate concerns)
- Documentation (inline comments, wiki)
- Naming conventions (consistent, descriptive)
```

---

## Common Trade-Offs

### Declarative vs Code

**Use Declarative (Flow) When:**
- Simple logic
- Business users need to maintain
- No complex algorithms
- Standard operations

**Use Code (Apex) When:**
- Complex business logic
- Need transaction control
- Performance critical
- Integration with external systems

---

### Real-Time vs Batch

**Real-Time When:**
- User needs immediate feedback
- Small data volume (<200 records)
- Business process requires sync

**Batch When:**
- Large data volume (>10,000 records)
- Nightly/scheduled processing
- Long-running operations

---

### Custom Objects vs Standard

**Custom Objects When:**
- No standard object fits
- Need full control
- Complex relationships

**Standard Objects When:**
- Fits use case (Campaigns, Cases, etc.)
- Want OOB features
- Integration with other SF features

---

## Interview Tips

### ✅ DO:
- **Ask clarifying questions** (shows you think before designing)
- **Start high-level** (big picture first, details later)
- **Explain trade-offs** (why you chose one approach over another)
- **Think out loud** (interviewer wants to see your process)
- **Acknowledge limitations** ("This works for 10K records, but at 1M we'd need...")

### ❌ DON'T:
- Don't jump into details immediately
- Don't design in silence
- Don't assume requirements
- Don't claim one "perfect" solution
- Don't ignore interviewer's hints

---

## Practice Checklist

- [ ] Can design a data model for business requirements
- [ ] Understand when to use Master-Detail vs Lookup
- [ ] Know how to model 1:1, 1:N, and N:N relationships
- [ ] Can design security (OWD, sharing, profiles)
- [ ] Understand scalability considerations
- [ ] Know integration patterns
- [ ] Can explain trade-offs clearly
- [ ] Can estimate data volumes and limits

**Next**: Practice designing systems and explaining your decisions! 🏗️
