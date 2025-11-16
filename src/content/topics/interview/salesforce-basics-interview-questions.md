---
title: "Salesforce Basics Interview Questions"
section: "interview"
order: 1
difficulty: "beginner"
readTime: "30 min"
description: "Essential Salesforce fundamentals interview questions covering platform, data model, security, and automation."
overview: "Master the foundational Salesforce interview questions that every candidate should know. Covers platform fundamentals, data model, objects, fields, relationships, security model, and declarative automation."
concepts: ["Platform Fundamentals", "Data Model", "Security", "Automation", "Relationships", "Reports"]
prerequisites: []
relatedTopics: ["apex-interview-questions", "lwc-interview-questions"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Salesforce Basics Interview Questions

Essential questions covering Salesforce fundamentals that every candidate should master.

## Platform Fundamentals

### Q1: What is Salesforce and why is it popular?

**Answer:**
Salesforce is a **cloud-based CRM (Customer Relationship Management) platform** that helps businesses manage customer relationships, sales, service, and marketing.

**Why it's popular:**
- **Cloud-based**: No infrastructure to maintain, accessible anywhere
- **Scalable**: Grows with your business
- **Customizable**: Extensive declarative and programmatic customization
- **Ecosystem**: Large AppExchange marketplace and developer community
- **Multi-tenant architecture**: Cost-effective, automatic upgrades
- **All-in-one platform**: CRM, automation, analytics, mobile, AI (Einstein)

**Interview Tip**: Mention specific clouds (Sales, Service, Marketing, Commerce) and how they serve different business needs.

---

### Q2: Explain Salesforce's multi-tenant architecture

**Answer:**
**Multi-tenant architecture** means multiple customers (tenants) share the same infrastructure and application code while keeping their data completely isolated.

**Key points:**
- **Shared resources**: One application instance serves all customers
- **Data isolation**: Each org's data is completely separate and secure
- **Automatic upgrades**: All orgs upgrade simultaneously (3 releases/year)
- **Cost-effective**: Shared costs across all tenants
- **Metadata-driven**: Each org customizes through metadata, not code

**Analogy**: Like an apartment building - shared infrastructure (elevators, utilities) but private units (your data).

**Interview Tip**: Contrast with single-tenant (dedicated instance per customer) to show understanding.

---

### Q3: What are the different types of Salesforce clouds?

**Answer:**
Salesforce offers industry-specific clouds:

**Core Clouds:**
- **Sales Cloud**: Sales force automation, lead/opportunity management
- **Service Cloud**: Customer service, case management, knowledge base
- **Marketing Cloud**: Email marketing, customer journeys, automation
- **Commerce Cloud**: E-commerce, B2B and B2C online stores

**Industry Clouds:**
- **Health Cloud**: Healthcare patient management
- **Financial Services Cloud**: Banking, wealth management
- **Education Cloud**: Educational institutions
- **Nonprofit Cloud**: Nonprofit organizations

**Platform:**
- **Platform (Force.com)**: Build custom apps on Salesforce

---

## Data Model

### Q4: What is the difference between an Object and a Record?

**Answer:**
- **Object**: The database table (e.g., Account, Contact, Opportunity)
- **Record**: A single row in that table (e.g., "ACME Corp" account)

**Analogy:**
```
Object = Spreadsheet (the whole table)
Record = Row in the spreadsheet
Field = Column in the spreadsheet
```

**Example:**
- Object: `Account`
- Record: ACME Corporation (one specific account)
- Fields: Name, Industry, Annual Revenue

---

### Q5: What are Standard vs Custom objects?

**Answer:**
**Standard Objects:**
- Pre-built by Salesforce
- Examples: Account, Contact, Lead, Opportunity, Case
- Cannot be deleted
- API name has NO `__c` suffix

**Custom Objects:**
- Created by you for your business needs
- API name MUST end with `__c`
- Examples: `Property__c`, `Project__c`, `Invoice__c`
- Can be deleted if no dependencies

**Interview Tip**: Mention that custom objects automatically get:
- Standard fields (Id, Name, Owner, Created Date, etc.)
- Standard UI (tabs, page layouts, list views)
- Standard functionality (reports, workflows, API access)

---

### Q6: What field types are available in Salesforce?

**Answer:**
**Common Field Types:**
- **Text**: Plain text (max 255 chars)
- **Text Area (Long)**: Multi-line text (up to 131,072 chars)
- **Rich Text Area**: Formatted text with HTML
- **Number**: Numeric values
- **Currency**: Money values
- **Percent**: Percentage values
- **Date / Date-Time**: Date and time tracking
- **Checkbox**: Boolean (true/false)
- **Picklist**: Dropdown list of values
- **Multi-Select Picklist**: Multiple selections
- **Email / Phone / URL**: Formatted special types
- **Lookup / Master-Detail**: Relationships to other objects
- **Formula**: Calculated fields
- **Roll-Up Summary**: Aggregate child records (M-D only)
- **Auto-Number**: Auto-incrementing unique IDs

**Interview Tip**: Be ready to explain when to use each type!

---

### Q7: Explain Lookup vs Master-Detail relationships

**Answer:**

| Feature | Lookup | Master-Detail |
|---------|--------|---------------|
| **Dependency** | Independent | Child depends on parent |
| **Required?** | Optional or required | Always required |
| **Cascade Delete?** | No | Yes (delete parent → deletes children) |
| **Sharing** | Independent | Inherits from parent |
| **Roll-up Summary** | No | Yes |
| **Reparenting** | Yes (usually) | Limited |
| **Max per object** | 40 | 2 (3 for junction objects) |

**When to use:**
- **Lookup**: Loose relationship, optional, independent security
- **Master-Detail**: Tight relationship, parent controls child, need roll-ups

**Example:**
- **Lookup**: `Account → Partner_Account__c` (optional partner)
- **Master-Detail**: `Order__c → Order_Line_Item__c` (line items MUST have an order)

---

### Q8: What is a Roll-Up Summary field?

**Answer:**
A **Roll-Up Summary** field calculates values from **child records** in a **master-detail relationship** and displays them on the **parent record**.

**Operations:**
- **COUNT**: Count child records
- **SUM**: Sum a number/currency field
- **MIN**: Minimum value
- **MAX**: Maximum value

**Example:**
```
Object: Opportunity (parent)
Roll-Up Field: Total_Contract_Value__c
Summarizes: Contract__c (child)
Operation: SUM(Contract__c.Amount__c)
Filter: Status__c = 'Signed'

Result: Shows total value of all signed contracts on the Opportunity
```

**Limitations:**
- Only works with Master-Detail relationships
- Cannot reference formula fields (with some exceptions)
- Calculated asynchronously for large data volumes

---

## Security Model

### Q9: Explain Salesforce's security layers

**Answer:**
Salesforce has **4 layers of security**:

**1. Organization Level**
- Login hours, IP restrictions
- Password policies, MFA

**2. Object Level**
- Profiles and Permission Sets
- CRUD permissions (Create, Read, Edit, Delete)

**3. Field Level**
- Field-Level Security (FLS)
- Visible, Read-Only, or Hidden per field

**4. Record Level**
- OWD (Organization-Wide Defaults)
- Role Hierarchy
- Sharing Rules
- Manual Sharing

**Key Principle**: **Start restrictive, open up as needed**

**Interview Tip**: Use the phrase "layered security model" - it shows you understand the concept.

---

### Q10: What is OWD (Organization-Wide Defaults)?

**Answer:**
**OWD** sets the **baseline** (most restrictive) access level for each object.

**Settings:**
- **Private**: Only owner and users above in role hierarchy can see
- **Public Read Only**: Everyone can view, only owner can edit
- **Public Read/Write**: Everyone can view and edit
- **Controlled by Parent**: For M-D children (inherit parent's security)

**Example:**
```
Account OWD: Private
- Sarah creates an Account
- Mike cannot see Sarah's Account (unless shared)
- Sarah's manager CAN see it (role hierarchy)
```

**Best Practice**: Use Private for sensitive objects, then open up access via sharing rules.

---

### Q11: What's the difference between Profile and Permission Set?

**Answer:**

| Feature | Profile | Permission Set |
|---------|---------|----------------|
| **Assignment** | One per user (required) | Multiple per user (optional) |
| **Purpose** | Baseline permissions | Additional permissions |
| **Flexibility** | Rigid (must clone to modify) | Flexible (assign/remove easily) |
| **Use Case** | Standard user access | Feature-specific or temporary access |

**Modern Best Practice**:
- **Minimal profiles** with basic access
- **Permission sets** for everything else

**Example:**
```
User: John Smith
Profile: Standard User (basic access)
Permission Sets:
  - Report Builder (can create reports)
  - API User (API access)
  - Opportunity Manager (full Opportunity access)
```

---

### Q12: What is Field-Level Security (FLS)?

**Answer:**
**Field-Level Security** controls access to individual **fields** on an object.

**Settings per profile/permission set:**
- **Visible**: User can see the field
- **Read-Only**: User can see but not edit
- **Hidden**: User cannot see (field doesn't exist for them)

**Critical Difference:**
```
Page Layout hiding: UI-only, NOT secure
Field-Level Security: TRUE security

⚠️ ALWAYS use FLS for security, NEVER rely on page layouts
```

**Example:**
```
Object: Account
Field: Annual_Revenue__c

Standard User Profile:
  - FLS: Hidden

Sales Manager Profile:
  - FLS: Read-Only

Executive Profile:
  - FLS: Visible & Editable
```

---

### Q13: Explain Role Hierarchy

**Answer:**
**Role Hierarchy** determines **record-level access** based on organizational structure.

**Key Points:**
- Users in **higher roles** can see records owned by users in **lower roles**
- Applies when OWD is **Private** or **Public Read Only**
- Can be disabled per object with "Grant Access Using Hierarchies"

**Example:**
```
CEO
├── VP Sales
│   ├── Sales Manager (West)
│   │   └── Sales Rep (CA)
│   └── Sales Manager (East)
│       └── Sales Rep (NY)
└── VP Service
    └── Service Manager
        └── Service Agent

Account OWD: Private

Result:
- Sales Rep (CA) only sees their own Accounts
- Sales Manager (West) sees all CA rep's Accounts
- VP Sales sees all sales-owned Accounts
- CEO sees EVERYTHING
```

**Remember**: Roles = record access, Profiles = permissions

---

## Automation

### Q14: What are the main declarative automation tools?

**Answer:**

**1. Flow Builder (Modern - use this!)**
- Record-Triggered Flows (replaces Process Builder & Workflows)
- Screen Flows (guided user processes)
- Scheduled Flows (batch processing)
- Autolaunched Flows

**2. Process Builder (Legacy - being retired)**
- Don't use for new automation
- Migrate existing to Flow

**3. Workflow Rules (Legacy)**
- Very old, limited functionality
- Still works but no new features

**4. Approval Processes**
- Still actively used
- Best for multi-step approvals

**Interview Answer**: "I use **Flow Builder** for all new automation, as Salesforce is retiring Process Builder. Approvals are still best handled with Approval Processes."

---

### Q15: What types of Flows are there?

**Answer:**

**1. Record-Triggered Flow**
- Runs when record created, updated, or deleted
- Entry conditions to filter which records
- Fast Field Updates (before save) or Actions (after save)

**2. Screen Flow**
- Interactive flows with user input
- Multi-step wizards, guided processes
- Can be launched from buttons, utility bar, etc.

**3. Scheduled Flow**
- Runs on a schedule (daily, weekly, etc.)
- Batch processing of records

**4. Autolaunched Flow**
- Triggered by other processes, Apex, or APIs
- No user interaction

**5. Platform Event Flow**
- Triggered by platform events

---

### Q16: Record-Triggered Flow vs Process Builder - when to use?

**Answer:**

**Always use Record-Triggered Flow** for new automation because:
- Better performance
- More features (loops, advanced logic)
- Active development (Process Builder is retired)
- Better debugging tools
- Can do everything Process Builder can do

**Only keep Process Builder** for existing processes until you migrate them.

**Migration**: Salesforce provides "Migrate to Flow" tool

---

## Reports & Dashboards

### Q17: What are the report types in Salesforce?

**Answer:**

**1. Tabular Report**
- Simple list (like Excel spreadsheet)
- No grouping
- Best for: Export to Excel, simple lists

**2. Summary Report**
- Groups and subtotals
- Most common type
- Best for: Categorized analysis (opportunities by stage)

**3. Matrix Report**
- Groups by rows AND columns (pivot table)
- Best for: Two-dimensional comparison

**4. Joined Report**
- Combines multiple report types
- Best for: Cross-object reporting

**Interview Tip**: Say "I use **Summary reports** most often because they provide grouping and subtotals."

---

### Q18: What's a Dashboard running user?

**Answer:**
The **running user** determines whose access permissions are used to display dashboard data.

**Options:**

**1. Run as specified user** (Static)
- All viewers see same data
- Based on ONE user's access
- Best for: Executive dashboards

**2. Run as logged-in user** (Dynamic)**
- Each viewer sees their own data
- Based on THEIR access/sharing
- Requires Enterprise+ edition
- Best for: Personal dashboards

**Security Consideration**: Running user must have access to ALL data shown, otherwise users with less access might see data they shouldn't.

---

## Best Practices Questions

### Q19: How do you ensure good data quality in Salesforce?

**Answer:**

**1. Validation Rules**
- Enforce data entry rules
- Example: Opportunity Amount required if Stage = "Closed Won"

**2. Required Fields**
- Make critical fields required
- Don't overdo it (user frustration)

**3. Picklists over Text**
- Standardizes values
- Prevents typos

**4. Default Field Values**
- Pre-populate common values

**5. Duplicate Rules**
- Prevent duplicate records
- Standard for Leads, Contacts, Accounts

**6. Field-Level Security**
- Protect sensitive data
- Make calculated fields read-only

**7. Training**
- User education on data importance

---

### Q20: What's the difference between Sandbox types?

**Answer:**

| Sandbox Type | Data Copy | Refresh | Use Case |
|--------------|-----------|---------|----------|
| **Developer** | No data | 1 day | Development, basic testing |
| **Developer Pro** | No data | 1 day | Development, larger storage |
| **Partial Copy** | Sample data | 5 days | Integration testing, training |
| **Full** | All data & metadata | 29 days | Performance testing, UAT, staging |

**Interview Tip**: Mention that you develop in Developer sandboxes and test in Full/Partial before production deployment.

---

## Scenario-Based Questions

### Q21: A user says they can't see a field. How do you troubleshoot?

**Answer:** Systematic troubleshooting approach:

**1. Check Field-Level Security**
```
Setup → Object Manager → [Object] → Fields → [Field] → Set Field-Level Security
Verify their profile has "Visible" checked
```

**2. Check Page Layout**
```
Setup → Object Manager → [Object] → Page Layouts
Ensure field is on the layout assigned to their profile
```

**3. Check Record Type** (if applicable)
```
Different record types may have different layouts
```

**4. Check Field Dependencies**
```
Controlling picklist value might hide dependent field
```

**5. Login as User**
```
Setup → Users → [User] → Login
See exactly what they see
```

**Interview Tip**: Show you use "Login as" feature to verify - demonstrates hands-on troubleshooting.

---

### Q22: How would you design a real estate app in Salesforce?

**Answer:**

**Objects:**
```
Property__c (Master)
├── Showings__c (Master-Detail)
├── Offers__c (Master-Detail)
└── Listing_Agent__c (Lookup to User)

Buyer__c (can be Contact)
└── Offer__c (Lookup)
```

**Key Features:**
- **Automation**: Email agent when new offer submitted (Flow)
- **Validation**: Offer amount must be > 0 (Validation Rule)
- **Roll-Ups**: Total Offers, Highest Offer on Property (Roll-Up Summary)
- **Reports**: Properties by status, offers by price range
- **Dashboard**: Active listings, scheduled showings
- **Security**: Private OWD for Properties (agents see only their listings)

**Interview Tip**: Walk through the complete data model, explain relationships, and mention automation/reporting.

---

## Tips for Answering Basics Questions

### ✅ DO:
- **Use correct terminology** (say "Record" not "entry", "Object" not "table")
- **Explain with examples** (real-world analogies)
- **Mention best practices** (shows experience)
- **Relate to business value** (why it matters)

### ❌ DON'T:
- Don't say "I don't know" - explain what you DO know
- Don't ramble - be concise
- Don't just say "yes/no" - always elaborate

---

## Common Follow-Up Questions

Be ready for these follow-ups:

**"Can you give me an example of when you used [concept]?"**
- Always have 2-3 real examples ready

**"What would you do differently now?"**
- Shows you learn from experience

**"What challenges did you face?"**
- Everyone faces challenges - explain how you solved them

**"How did you ensure data quality?"**
- Validation rules, duplicate management, training

---

## Interview Success Checklist

- [ ] Understand the 4 layers of security
- [ ] Can explain Lookup vs Master-Detail
- [ ] Know when to use each report type
- [ ] Understand Flow Builder basics
- [ ] Can explain Profiles vs Permission Sets
- [ ] Know what OWD does
- [ ] Can describe multi-tenant architecture
- [ ] Understand field types and when to use each
- [ ] Know sandbox types
- [ ] Can troubleshoot common issues

---

## Next Steps

- **Practice**: Answer these questions out loud
- **Prepare Examples**: Have 3-5 real project examples ready
- **Next Topic**: Apex Interview Questions
- **Mock Interview**: Practice with a friend or mentor

**Pro Tip**: Use the STAR method (Situation, Task, Action, Result) for scenario questions!
