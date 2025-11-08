---
title: "Salesforce Data Model Basics"
section: "basics"
order: 2
difficulty: "beginner"
readTime: "20 min"
description: "Learn how Salesforce stores data using objects, records, and fields - the foundation of everything you'll build."
overview: "Master the Salesforce data model - understand objects, records, fields, and how they work together to store your business data."
concepts: ["objects", "records", "fields", "data-model", "standard-objects", "custom-objects", "field-types"]
prerequisites: ["salesforce-platform-fundamentals"]
relatedTopics: ["relationships-and-lookups", "declarative-automation"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

The Salesforce data model is like a database, but designed for business applications. Understanding it is crucial for everything you'll build.

## The Database Analogy

If you're familiar with databases:

| Database Term | Salesforce Term | Example |
|--------------|-----------------|---------|
| Table | Object | Account, Contact |
| Row | Record | "Acme Corp", "John Doe" |
| Column | Field | Name, Email, Phone |
| Foreign Key | Relationship | Account → Contacts |

💡 **Key Difference**: Salesforce abstracts the complexity - you don't write CREATE TABLE statements!

---

# Objects: Your Data Tables

## What is an Object?

An **Object** is a table that stores a specific type of data.

**Think of it as**: A filing cabinet drawer labeled for a specific type of document.

## Types of Objects

### 1. Standard Objects (Built-in)
Salesforce provides these out-of-the-box:

**Core CRM Objects:**
- **Account** - Companies/Organizations
- **Contact** - People
- **Lead** - Potential customers
- **Opportunity** - Sales deals
- **Case** - Customer support tickets

**Supporting Objects:**
- **Task** - To-dos and activities
- **Event** - Calendar events
- **Campaign** - Marketing campaigns
- **Product** - Products/services you sell

✅ **You get these for free** - no setup required!

### 2. Custom Objects
Objects YOU create for your specific needs:

**Examples:**
- `Property__c` - Real estate properties
- `Invoice__c` - Custom billing
- `Project__c` - Project management
- `Course__c` - Educational courses

⚠️ **Naming Convention**: Custom objects end with `__c`

---

# Records: Your Data Rows

## What is a Record?

A **Record** is a single instance of an object - one row in the table.

**Examples:**
- "Acme Corporation" is an **Account** record
- "John Doe" is a **Contact** record
- "Q1 Deal" is an **Opportunity** record

## Record IDs

Every record has a unique **18-character ID**:
- Example: `001D000000Iru3EIAR`
- **Globally unique** across all Salesforce
- **Never changes** (even if record is renamed)
- **Case-insensitive** (Salesforce handles this)

💡 **Why 18 characters?** Backwards compatibility with 15-character IDs

---

# Fields: Your Data Columns

## What is a Field?

A **Field** stores a specific piece of data on a record.

**Example Account fields:**
- `Name` - Company name
- `Phone` - Phone number
- `Industry` - Industry type
- `Website` - Website URL

## Field Types

### Text Fields

**Text (up to 255 characters)**
```
Account Name: "Acme Corporation"
```

**Text Area (up to 32,000 characters)**
```
Description: "Long description of the company..."
```

**Text Area (Long) - up to 131,072 characters**
```
Notes: "Very long notes..."
```

**Text Area (Rich) - Formatted text**
```
Supports bold, italics, lists, etc.
```

### Number Fields

**Number**
```
Employees: 150
Price: 29.99
```

**Currency**
```
Annual Revenue: $1,000,000.00
```
- Respects user's currency settings
- Can have multiple currencies

**Percent**
```
Discount: 15%
```

**Auto Number**
```
Invoice #: INV-00001
```
- Automatically increments
- Format: `{prefix}-{number}`

### Date/Time Fields

**Date**
```
Close Date: 01/15/2025
```

**Date/Time**
```
Created Date: 01/15/2025 10:30 AM
```

**Time**
```
Start Time: 2:00 PM
```

### Picklist Fields

**Picklist (Single Select)**
```
Industry: [ Technology | Finance | Healthcare | Retail ]
```

**Multi-Select Picklist**
```
Interests: [ Apex; LWC; Integration ]
```
- Values separated by semicolons
- Can select multiple

### Boolean Fields

**Checkbox**
```
Is Active: ☑
```
- True/False
- Checked/Unchecked

### Relationship Fields

**Lookup**
```
Contact → Account (Which company does this person work for?)
```

**Master-Detail**
```
Opportunity → Account (This opportunity MUST belong to an account)
```

### Other Field Types

**Email**
```
Email: john@example.com
```
- Validates email format
- Clickable mailto: link

**Phone**
```
Phone: (555) 123-4567
```
- Click to call functionality

**URL**
```
Website: https://acme.com
```
- Clickable link

**Geolocation**
```
Address: 37.7749° N, 122.4194° W
```
- Latitude and longitude

---

# Standard vs Custom Fields

## Standard Fields

**Every object has these by default:**

`Id` - Unique identifier
- Example: `001D000000Iru3EIAR`
- Can't be changed
- Auto-generated

`Name` - Display name
- Example: "Acme Corp"
- Required on most objects
- Can be auto-number or text

`OwnerId` - Who owns this record
- Example: John Doe (User)
- Controls who can see/edit
- Can be reassigned

`CreatedById` - Who created it
- Set once, never changes
- Links to User object

`CreatedDate` - When created
- Auto-set
- Never changes

`LastModifiedById` - Who last edited
- Updates on every save
- Links to User object

`LastModifiedDate` - When last edited
- Auto-updates
- Useful for tracking changes

## Custom Fields

Fields YOU create:

`Account_Rating__c` - Custom rating field
`Preferred_Language__c` - Language preference
`Subscription_End_Date__c` - When subscription ends

⚠️ **Naming Convention**: Custom fields end with `__c`

---

# Creating Your First Custom Object

## Via Setup UI (Point-and-Click)

**Steps:**
1. Click **Setup** (⚙️ gear icon)
2. Quick Find: "Object Manager"
3. Click **Create → Custom Object**
4. Fill in details:
   - **Label**: Property (user-facing name)
   - **Plural Label**: Properties
   - **Object Name**: Property (API name becomes Property__c)
5. Click **Save**

**You now have a Property object!**

---

# Creating Custom Fields

## Via Setup UI

**Steps:**
1. Setup → Object Manager
2. Select your object (e.g., Property)
3. Click **Fields & Relationships**
4. Click **New**
5. Select field type (e.g., Currency)
6. Configure field:
   - **Field Label**: Price
   - **Field Name**: Price (becomes Price__c)
   - **Length**: 16
   - **Decimal Places**: 2
7. Click **Next** → **Next** → **Save**

**You now have a Price field!**

---

# Standard Object Examples

## Account Object

**Purpose**: Store company/organization data

**Key Fields:**
- `Name` - Company name (required)
- `Type` - Prospect, Customer, Partner
- `Industry` - Technology, Finance, etc.
- `Phone` - Main phone number
- `Website` - Company website
- `BillingAddress` - Billing address
- `ShippingAddress` - Shipping address
- `AnnualRevenue` - Yearly revenue
- `NumberOfEmployees` - Company size

**Use Case**: Track all companies you work with

## Contact Object

**Purpose**: Store people data

**Key Fields:**
- `FirstName` - First name
- `LastName` - Last name (required)
- `Email` - Email address
- `Phone` - Phone number
- `Title` - Job title
- `Department` - Department
- `AccountId` - Which company? (Lookup to Account)

**Use Case**: Track individuals at companies

## Opportunity Object

**Purpose**: Track sales deals

**Key Fields:**
- `Name` - Deal name (required)
- `AccountId` - Which company? (required)
- `Amount` - Deal value
- `CloseDate` - Expected close date (required)
- `StageName` - Where in sales process (required)
  - Prospecting
  - Qualification
  - Proposal
  - Negotiation
  - Closed Won
  - Closed Lost
- `Probability` - Likelihood to close

**Use Case**: Manage sales pipeline

## Lead Object

**Purpose**: Track potential customers

**Key Fields:**
- `FirstName` - First name
- `LastName` - Last name (required)
- `Company` - Company name (required)
- `Email` - Email address
- `Phone` - Phone number
- `Status` - Open, Contacted, Qualified, Unqualified
- `LeadSource` - Where did they come from?

**Use Case**: Manage leads before converting to accounts/contacts

---

# Data Organization Best Practices

## 1. Plan Your Data Model

**Before creating objects, ask:**
- What data do I need to store?
- How are things related?
- Who needs access?
- What reports do I need?

## 2. Use Standard Objects When Possible

✅ **Good**: Use Account for companies
❌ **Bad**: Create custom Customer__c object

**Why?** Standard objects have built-in features:
- Reports
- Dashboards
- Mobile app support
- Integration with other features

## 3. Naming Conventions

**Objects:**
- Singular: `Property__c` (not Properties__c)
- Descriptive: `Student_Course__c` (not SC__c)
- No special characters

**Fields:**
- Clear: `Student_Email__c` (not Email1__c)
- Consistent: Always use __c for custom
- Avoid reserved words: `Date__c` could be confusing

## 4. Field Types Matter

Choose the right type:
- ✅ Use **Currency** for money (not Number)
- ✅ Use **Email** for emails (not Text)
- ✅ Use **Checkbox** for yes/no (not Picklist)
- ✅ Use **Date** for dates (not Text)

**Why?** You get validation, formatting, and special features!

---

# Common Gotchas

## Gotcha 1: Object Limits

**Problem:**
```
You create hundreds of custom objects
```

**Limit:**
- Developer Edition: 400 custom objects
- Enterprise: 2,000 custom objects

**Solution:** Plan carefully, don't over-create

## Gotcha 2: Field Limits

**Problem:**
```
Adding 1000 fields to one object
```

**Limit:**
- ~800 fields per object (varies by org)

**Solution:** Use related objects instead of cramming everything into one

## Gotcha 3: Field Name Changes

**Problem:**
```
Change field API name after code is written
```

**Impact:** All code referencing that field breaks!

**Solution:** Choose names carefully from the start

---

# Exam Tips

> 💡 **TIP**: Custom objects and fields always end with `__c`. System fields don't have this suffix.

> ✅ **BEST PRACTICE**: Use standard objects whenever possible - they have more built-in functionality.

> 💀 **EXAM TRAP**: Record IDs are **18 characters** in UI but **15 characters** in APIs. Salesforce handles conversion.

> ⚠️ **WARNING**: Once created, you **cannot** change a field type (must create new field and migrate data).

> 💡 **TIP**: The `Name` field can be either **text** or **auto-number** - choose when creating the object.

---

# Practice Exercises

## Exercise 1: Explore Standard Objects
**Task**: Go to Setup → Object Manager and explore Account, Contact, and Opportunity objects.

**Look for:**
- Standard fields
- Field types
- Required fields

## Exercise 2: Create a Custom Object
**Task**: Create a "Book__c" object for tracking a library.

**Fields to add:**
- Title (Text) - required
- Author (Text)
- ISBN (Text)
- Published Date (Date)
- Price (Currency)
- Is Available (Checkbox)

## Exercise 3: Add Custom Fields to Account
**Task**: Add these custom fields to Account object:
- Customer_Since__c (Date)
- Contract_End_Date__c (Date)
- Loyalty_Tier__c (Picklist: Bronze, Silver, Gold, Platinum)

## Exercise 4: Create Records
**Task**: Create 5 Account records with different data.

## Exercise 5: Understand Record IDs
**Task**: Create an Account, note its ID, try to find it using Quick Find search.

---

# Next Steps

Now that you understand the data model, you're ready for:

1. **Relationships & Lookups** - Connect objects together
2. **Declarative Automation** - Automate without code
3. **Reports & Dashboards** - Visualize your data
4. **Security Model** - Control who sees what

**You're building the foundation for Salesforce development!** 🎯
