---
title: "Relationships and Schema Builder"
section: "basics"
order: 4
difficulty: "beginner"
readTime: "20 min"
description: "Learn how to connect objects using lookup and master-detail relationships, and build your data schema."
overview: "Relationships connect objects together in Salesforce, just like foreign keys in databases. Learn the difference between lookup and master-detail relationships, when to use each, how to create junction objects for many-to-many relationships, and use Schema Builder to visualize your data model."
concepts: ["Relationships", "Lookup", "Master-Detail", "Junction Objects", "Roll-Up Summary", "Schema Builder"]
prerequisites: ["data-model-basics"]
relatedTopics: ["salesforce-security-model", "declarative-automation"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Relationships and Schema Builder

In Salesforce, **relationships** connect objects together, just like foreign keys in traditional databases. Understanding relationships is crucial for building a proper data model.

## Why Relationships Matter

Relationships allow you to:
- Connect related data across objects
- Navigate between records
- Roll up data from child to parent
- Enforce data integrity
- Build rich, connected user experiences

### Example: Real Estate Application

```
Property__c
├── Related to: Agent (Lookup to User)
├── Has many: Showings__c (Master-Detail)
└── Has many: Offers__c (Master-Detail)

Showing__c
└── Belongs to: Property__c (Master-Detail)

Offer__c
└── Belongs to: Property__c (Master-Detail)
```

## Types of Relationships

Salesforce provides three main relationship types:

1. **Lookup Relationship** - Loosely coupled
2. **Master-Detail Relationship** - Tightly coupled
3. **External Lookup** - Links to external systems
4. **Hierarchical Relationship** - Self-relationship (User object only)

## Lookup Relationships

**Lookup relationships** create a loose connection between two objects.

### Characteristics

- **Independent records**: Child can exist without parent
- **No sharing inheritance**: Child doesn't inherit parent's sharing
- **No cascade delete**: Deleting parent doesn't delete children
- **No roll-up summaries**: Can't roll up child data to parent
- **Can be optional or required**
- **Can link up to 40 lookup relationships per object**

### Creating a Lookup

```
Object: Property__c
Field Name: Listing_Agent__c
Data Type: Lookup Relationship
Related To: User
Child Relationship Name: Managed_Properties

Result:
- Property can have an assigned agent
- Agent is not required (unless you make field required)
- Deleting the user doesn't delete their properties
- User record shows related list of Managed Properties
```

### Lookup Example in UI

On Property record:
```
Listing Agent: [John Smith]  (clickable link)
```

On User record (John Smith):
```
Related List: Managed Properties
┌─────────────────────────────────────┐
│ Property Name       │ Price         │
├─────────────────────────────────────┤
│ 123 Main St        │ $500,000      │
│ 456 Oak Ave        │ $650,000      │
└─────────────────────────────────────┘
```

### When to Use Lookup

Use lookup relationships when:
- ✅ Child should exist independently
- ✅ Relationship is optional
- ✅ No need to roll up data
- ✅ Parent and child have different ownership

Examples:
- Property → Agent (agent is optional or can change)
- Account → Partner Account (loose partnership)
- Case → Related Case (optional linkage)

## Master-Detail Relationships

**Master-Detail relationships** create a tight parent-child bond.

### Characteristics

- **Dependent records**: Child cannot exist without parent
- **Sharing inheritance**: Child inherits parent's sharing and security
- **Cascade delete**: Deleting parent deletes all children
- **Roll-up summaries**: Can aggregate child data on parent
- **Ownership inheritance**: Child's owner is always the parent's owner
- **Required field**: Master field is always required
- **Maximum 2 master-detail per object** (3 in some cases with junction objects)

### Creating Master-Detail

```
Object: Showing__c
Field Name: Property__c
Data Type: Master-Detail Relationship
Related To: Property__c
Child Relationship Name: Showings

Result:
- Showing MUST be related to a Property
- Showing inherits Property's sharing rules
- Delete Property → all Showings are deleted
- Property can have roll-up summary of Showings
- Showing's owner is the Property's owner
```

### Master-Detail Example

Property record:
```
Property: 123 Main St

Related List: Showings
┌───────────────────────────────────────────┐
│ Date       │ Attendee    │ Feedback      │
├───────────────────────────────────────────┤
│ 2024-01-15│ Jane Doe    │ Very interested│
│ 2024-01-18│ Bob Smith   │ Needs bigger   │
└───────────────────────────────────────────┘

Total Showings: 2  (Roll-up Summary Field)
```

### Roll-Up Summary Fields

Roll-up summaries aggregate child records on the parent.

**Types of Roll-Ups:**

1. **COUNT**: Count child records
   ```
   Total_Showings__c = COUNT(Showings)
   ```

2. **SUM**: Sum a number field
   ```
   Total_Offer_Amount__c = SUM(Offers.Amount)
   ```

3. **MIN**: Minimum value
   ```
   Earliest_Showing__c = MIN(Showings.Showing_Date__c)
   ```

4. **MAX**: Maximum value
   ```
   Highest_Offer__c = MAX(Offers.Amount)
   ```

#### Creating a Roll-Up Summary

```
Object: Property__c
Field Type: Roll-Up Summary
Summarized Object: Offer__c
Roll-Up Type: SUM
Field to Aggregate: Amount__c
Filter Criteria: Status__c equals "Accepted"

Result Field: Total_Accepted_Offers__c
```

### When to Use Master-Detail

Use master-detail when:
- ✅ Child has no meaning without parent
- ✅ Parent should control child's security
- ✅ Need to roll up child data
- ✅ Child should be deleted with parent

Examples:
- Order → Order Line Items
- Property → Showings
- Invoice → Invoice Line Items
- Account → Contacts (when contacts must belong to accounts)

## Lookup vs Master-Detail Comparison

| Feature | Lookup | Master-Detail |
|---------|--------|---------------|
| **Child can exist alone?** | Yes | No |
| **Required field?** | Optional or Required | Always Required |
| **Cascade delete?** | No | Yes |
| **Sharing inheritance?** | No | Yes |
| **Roll-up summaries?** | No | Yes |
| **Ownership** | Independent | Inherits from parent |
| **Maximum per object** | 40 | 2 (3 for junction) |
| **Can reparent?** | Yes (if allowed) | Limited |

## Self-Relationships

An object can have a relationship to itself using a **lookup** field.

### Example: Hierarchical Accounts

```
Account: ACME Corp
Parent Account: ACME Holdings

Account: ACME West
Parent Account: ACME Corp

Account: ACME East
Parent Account: ACME Corp

Hierarchy:
ACME Holdings
└── ACME Corp
    ├── ACME West
    └── ACME East
```

### Creating a Self-Lookup

```
Object: Account
Field Name: Parent Account
Data Type: Lookup Relationship
Related To: Account
```

### Hierarchical Relationship

The **User** object has a special self-relationship type called **Hierarchical**.

```
User: Sarah Johnson
Manager: Michael Chen

User: Michael Chen
Manager: Jennifer Liu
```

Used for:
- Manager hierarchies
- Roll-up summary on User object (unique to hierarchical)

## Many-to-Many Relationships (Junction Objects)

To create a **many-to-many** relationship, use a **junction object** with two master-detail relationships.

### Example: Students and Classes

```
Student__c          Junction Object: Enrollment__c          Class__c
(Many)    ←──────── (Master-Detail to both) ───────→ (Many)
```

Each student can take many classes.
Each class can have many students.

### Creating a Junction Object

```
1. Create junction object: Enrollment__c

2. Create first master-detail:
   Field: Student__c
   Type: Master-Detail
   Related To: Student__c

3. Create second master-detail:
   Field: Class__c
   Type: Master-Detail
   Related To: Class__c

4. Add additional fields:
   - Grade__c (Text)
   - Attendance__c (Number)
   - Completed__c (Checkbox)
```

### Junction Object Characteristics

- Junction object detail records are deleted if either parent is deleted
- First master-detail relationship determines ownership and sharing
- Can have roll-up summaries on both parents
- Shows as related lists on both parents

### Common Junction Object Use Cases

- **Students ↔ Classes** (Enrollment)
- **Products ↔ Projects** (Project Resources)
- **Accounts ↔ Campaigns** (Campaign Members - standard object!)
- **Properties ↔ Agents** (if agents can list multiple properties and properties can have multiple agents)

## External Lookup Relationships

**External Lookups** connect Salesforce objects to external data sources.

### Use Cases

- Link to external database records
- Connect to external systems via External Objects
- Integration scenarios

### Example

```
Salesforce Object: Order__c
External Object: External_Inventory__c (from SAP)
External Lookup Field: Inventory_Item__c

Result: Order links to SAP inventory item
```

## Schema Builder

**Schema Builder** is a visual tool to design and view your data model.

### Accessing Schema Builder

```
Setup → Schema Builder
```

### What You Can Do

1. **View existing schema**
   - See all objects and relationships visually
   - Understand data model at a glance
   - Filter by object type

2. **Create new objects**
   - Drag and drop object creation
   - Add fields visually
   - Create relationships by dragging

3. **Create new fields**
   - Add fields to existing objects
   - Configure field properties
   - See field types visually

4. **Create relationships**
   - Drag from one object to another
   - Select relationship type
   - Configure relationship settings

### Schema Builder Best Practices

- ✅ Use to **understand** existing schema before making changes
- ✅ Great for **planning** new objects and relationships
- ✅ Export as PNG for **documentation**
- ✅ Use filters to focus on specific areas
- ⚠️ For complex field configuration, use Object Manager instead

### Schema Builder View Example

```
┌────────────────┐            ┌────────────────┐
│   Account      │            │    Contact     │
├────────────────┤            ├────────────────┤
│ • Name         │◄───────────│ • First Name   │
│ • Industry     │  Lookup    │ • Last Name    │
│ • Revenue      │            │ • Email        │
└────────────────┘            │ • Account      │
                              └────────────────┘
       │
       │ Master-Detail
       │
       ▼
┌────────────────┐
│  Opportunity   │
├────────────────┤
│ • Name         │
│ • Amount       │
│ • Close Date   │
│ • Stage        │
│ • Account      │
└────────────────┘
```

## Relationship Best Practices

### ✅ DO

1. **Plan your data model first**
   - Sketch on paper or whiteboard
   - Identify entities and relationships
   - Decide on lookup vs master-detail

2. **Use meaningful API names**
   ```
   Good: Property_Listing__c
   Bad: Prop__c
   ```

3. **Set appropriate child relationship names**
   ```
   Good: Showings (for Property → Showing)
   Bad: Showings__r (auto-generated)
   ```

4. **Use master-detail for tightly coupled data**
   - Order Line Items
   - Invoice Items
   - Dependent child records

5. **Use lookup for loosely coupled data**
   - Optional relationships
   - Independent lifecycles

6. **Consider reporting needs**
   - Master-detail allows roll-ups
   - Lookup doesn't

7. **Think about security**
   - Master-detail inherits parent security
   - Lookup has independent security

### ❌ DON'T

1. **Don't exceed 2 master-detail per object** (unless junction object with 3)
2. **Don't use master-detail if child needs independent security**
3. **Don't use lookup if you need roll-up summaries** (use master-detail)
4. **Don't create circular relationships** (A → B → C → A)
5. **Don't forget to set "Allow reparenting" on master-detail** if needed

## Common Relationship Patterns

### Pattern 1: Standard Account-Contact-Opportunity

```
Account (Master)
├── Contacts (Lookup or Master-Detail)
└── Opportunities (Lookup or Master-Detail)

Opportunity
├── Opportunity Line Items (Master-Detail)
└── Account (Lookup or Master-Detail)
```

### Pattern 2: Order Management

```
Account
└── Orders (Master-Detail)
    └── Order Line Items (Master-Detail)
        └── Product (Lookup)
```

### Pattern 3: Project Management

```
Project__c
├── Tasks__c (Master-Detail)
├── Milestones__c (Master-Detail)
└── Account (Lookup)

Task__c
├── Project__c (Master-Detail)
└── Assigned_To__c (Lookup to User)
```

## Practice Exercises

### Exercise 1: Property Management Schema

Create a property management app schema:

1. Create objects:
   - Property__c
   - Showing__c
   - Offer__c

2. Create relationships:
   - Property → Showing (Master-Detail)
   - Property → Offer (Master-Detail)
   - Property → Listing Agent (Lookup to User)

3. Create roll-ups on Property:
   - Total Showings (COUNT)
   - Highest Offer (MAX of Amount)

### Exercise 2: Student-Class Junction Object

Create a many-to-many relationship:

1. Create objects:
   - Student__c
   - Class__c
   - Enrollment__c (junction)

2. Set up master-detail relationships on Enrollment:
   - To Student__c
   - To Class__c

3. Add fields to Enrollment:
   - Grade__c
   - Enrollment_Date__c

4. Create roll-up on Student:
   - Total Classes (COUNT of Enrollments)

### Exercise 3: Use Schema Builder

1. Open Schema Builder
2. View the standard Account-Contact-Opportunity schema
3. Add a custom object "Project__c"
4. Create a lookup relationship from Project to Account
5. Export the schema as a PNG

## Next Steps

- **Next Topic**: Declarative Automation (Flows, Process Builder)
- **Practice**: Build a schema in your Developer Org
- **Advanced**: Learn about External Objects and Big Objects

## Key Takeaways

🔑 **Lookup**: Loose coupling, independent child, no roll-ups
🔑 **Master-Detail**: Tight coupling, dependent child, roll-ups available
🔑 **Junction objects** enable many-to-many relationships
🔑 **Roll-up summaries** only work on master-detail
🔑 **Security inheritance** only happens with master-detail
🔑 **Schema Builder** is great for visualization and planning
🔑 **Choose the right relationship type** based on business requirements
