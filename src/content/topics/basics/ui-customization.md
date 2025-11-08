---
title: "UI Customization and Lightning App Builder"
section: "basics"
order: 7
difficulty: "beginner"
readTime: "25 min"
description: "Learn to customize the Salesforce UI with page layouts, record types, Lightning App Builder, and dynamic forms."
overview: "Customize the Salesforce user interface without code using declarative tools. Learn to create page layouts, use record types for different processes, build custom Lightning pages with App Builder, implement dynamic forms, create Lightning apps, configure actions, and optimize the user experience."
concepts: ["Page Layouts", "Record Types", "Lightning App Builder", "Dynamic Forms", "Lightning Apps", "Actions", "Compact Layouts"]
prerequisites: ["salesforce-platform-fundamentals", "data-model-basics"]
relatedTopics: ["salesforce-security-model", "reports-and-dashboards"]
lastUpdated: "2024-01-15"
examWeight: "medium"
---

# UI Customization and Lightning App Builder

Salesforce provides powerful **declarative tools** to customize the user interface without code. You can tailor the UI to match your business processes and user needs.

## Why UI Customization Matters

- **User Experience**: Create intuitive interfaces that users love
- **Productivity**: Show only relevant fields and actions
- **Process Alignment**: Match UI to business processes
- **Role-Based**: Different views for different user types
- **Adoption**: Well-designed UI increases user adoption

## Lightning Experience vs Classic

Salesforce has two user interfaces:

- **Lightning Experience** (Modern) ⭐ **Use this!**
  - Modern design
  - Better performance
  - Rich components
  - Active development

- **Salesforce Classic** (Legacy)
  - Older interface
  - Limited updates
  - Being phased out

## UI Customization Tools

Salesforce provides several tools for UI customization:

1. **Page Layouts** - Control fields, buttons, and related lists on record pages
2. **Lightning App Builder** - Build custom Lightning pages
3. **Record Types** - Different layouts and picklist values for different processes
4. **Lightning Apps** - Custom app navigation and branding
5. **Dynamic Forms** - Flexible field placement beyond page layouts

## Page Layouts

**Page Layouts** control which fields, related lists, and buttons appear on record detail and edit pages.

### What Page Layouts Control

- **Field visibility and order**
- **Field properties** (required, read-only)
- **Section organization**
- **Related lists** visibility and order
- **Buttons** (standard and custom)
- **Quick Actions**

### Accessing Page Layouts

```
Setup → Object Manager → [Object] → Page Layouts
```

### Page Layout Structure

```
┌─────────────────────────────────────────┐
│ SECTION 1: Account Information         │
├─────────────────────────────────────────┤
│ Account Name:    [Required field]       │
│ Account Number:  [Read-only field]      │
│ Phone:           [Editable field]       │
│ Industry:        [Picklist]             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SECTION 2: Address Information          │
├─────────────────────────────────────────┤
│ Billing Street:  [Editable field]       │
│ Billing City:    [Editable field]       │
│ Billing State:   [Editable field]       │
└─────────────────────────────────────────┘

Related Lists:
  • Contacts
  • Opportunities
  • Cases
```

### Editing Page Layouts

```
1. Setup → Object Manager → Account → Page Layouts
2. Click page layout name (e.g., "Account Layout")
3. Drag fields from palette to layout
4. Organize into sections
5. Set field properties
6. Add related lists
7. Save
```

### Field Properties on Layouts

- **Required**: User must enter a value
- **Read-Only**: User can see but not edit
- **Hidden**: Field is removed from layout (⚠️ NOT security)

❗ **Important**: Page layout hiding does NOT secure data. Use Field-Level Security for true security.

### Page Layout Sections

Organize fields into logical sections:

```
Section Properties:
  Name: "Contact Information"
  Columns: 1 or 2
  Display Section Header: Yes/No
  Collapsible: Yes/No
```

### Assigning Page Layouts

Assign different layouts to different profiles:

```
Setup → Object Manager → Account → Page Layouts
Click "Page Layout Assignment"

Profile              Layout
──────────────────────────────────
System Administrator → Full Account Layout
Standard User        → Standard Account Layout
Sales User           → Sales Account Layout
```

## Record Types

**Record Types** let you offer different business processes, picklist values, and page layouts to different users.

### When to Use Record Types

- Different sales processes (New Business vs Renewal)
- Different case types (Support vs Billing)
- Different account types (Customer vs Partner)
- Regional variations
- Industry-specific processes

### Record Type Features

1. **Different picklist values** per record type
2. **Different page layouts** per record type
3. **Different business processes** (for Cases and Leads)
4. **Different record pages** (Lightning)

### Creating a Record Type

```
Setup → Object Manager → Opportunity → Record Types
Click "New"

Record Type Label: New Business
Record Type Name: New_Business
Active: Checked
Available for Profiles: [Select profiles]
```

### Record Type Example: Opportunity Types

```
Record Type 1: New Business
├── Page Layout: New Business Layout
├── Sales Process: New Business Process
└── Stage Picklist Values:
    • Prospecting
    • Discovery
    • Proposal
    • Negotiation
    • Closed Won
    • Closed Lost

Record Type 2: Renewal
├── Page Layout: Renewal Layout
├── Sales Process: Renewal Process
└── Stage Picklist Values:
    • Renewal Identified
    • Renewal Proposal Sent
    • Renewal Negotiation
    • Renewed
    • Not Renewed
```

### Record Type Selection

When creating a record, users see:

```
┌────────────────────────────────────┐
│ Select Opportunity Type            │
├────────────────────────────────────┤
│ ○ New Business                     │
│   For new customer acquisitions    │
│                                    │
│ ○ Renewal                          │
│   For existing customer renewals   │
│                                    │
│ [Cancel]              [Next]       │
└────────────────────────────────────┘
```

## Lightning App Builder

**Lightning App Builder** is a point-and-click tool to build custom Lightning pages.

### Page Types

1. **App Page** - Custom page accessible via navigation
2. **Home Page** - Custom homepage
3. **Record Page** - Custom layout for record detail pages
4. **Email Application Pane** - For Einstein Activity Capture

### Creating a Lightning Page

```
Setup → Lightning App Builder → New

1. Select Page Type: Record Page
2. Select Object: Account
3. Choose Template: Header and Two Regions
4. Add Components
5. Set Component Properties
6. Activate
```

### Standard Components

Lightning App Builder provides many standard components:

**Data Components:**
- **Record Detail** - Display record fields
- **Related List** - Show related records
- **Related Record** - Show parent record info
- **Path** - Visual process guidance
- **Highlights Panel** - Key field values at top

**Reporting Components:**
- **Report Chart** - Embedded chart from report
- **Dashboard** - Embedded dashboard

**Content Components:**
- **Rich Text** - Formatted text and images
- **HTML** - Custom HTML content
- **Iframe** - Embedded external content

**Utility Components:**
- **Tabs** - Organize content in tabs
- **Accordion** - Collapsible sections
- **Button** - Custom action button

**Activity Components:**
- **Activity Timeline** - Unified view of activities
- **Activities** - Tasks and events

### Page Templates

Choose from pre-built templates:

```
Header and Two Regions
┌────────────────────────────────┐
│ Header                         │
├──────────────┬─────────────────┤
│              │                 │
│   Main       │    Sidebar      │
│   Region     │    Region       │
│              │                 │
└──────────────┴─────────────────┘

Three Regions
┌────────────────────────────────┐
│ Header                         │
├──────────────┬─────────────────┤
│              │                 │
│   Main       │    Sidebar      │
│   Region     │                 │
│              │                 │
├──────────────┴─────────────────┤
│ Footer                         │
└────────────────────────────────┘
```

### Building an Account Record Page

```
Page Type: Record Page
Object: Account
Template: Header and Two Regions

Header:
  • Highlights Panel (Name, Industry, Annual Revenue)
  • Path (if using sales path)

Main Region:
  • Record Detail (Account fields)
  • Related List: Contacts
  • Related List: Opportunities
  • Activity Timeline

Sidebar:
  • Related Record: Parent Account (if exists)
  • News (external component)
  • Chatter Feed
```

### Component Visibility Rules

Show/hide components based on conditions:

```
Component: Premium Support Details
Visibility Filter:
  Account Type = "Premium Customer"
  AND Annual Revenue > 1000000

Result: Only shown for premium, high-value accounts
```

### Page Activation

Assign Lightning pages to:

- **Org Default** - All users see this page
- **App Default** - Users of specific app see this page
- **App, Record Type, and Profile** - Granular assignment

```
Activation Settings:
─────────────────────────────────────
Sales App + Premium Account + Sales User
→ Premium Account Sales Page

Sales App + Standard Account + Sales User
→ Standard Account Sales Page

Service App + All Record Types + Service User
→ Service Account Page
```

## Dynamic Forms

**Dynamic Forms** provide more flexibility than traditional page layouts.

### Benefits of Dynamic Forms

- **Component-based**: Place fields anywhere on the page
- **Individual field visibility**: Control visibility per field
- **Better performance**: Load only visible fields
- **More flexible**: Not constrained by page layout sections

### Converting to Dynamic Forms

```
Lightning App Builder → Edit Record Page
Click "Upgrade Now" (on Record Detail component)

Result:
  Record Detail component → Individual Field Sections
  Each field is now independently configurable
```

### Field Section Component

```
Component: Field Section
  Name: Contact Information
  Columns: 2

  Fields:
    • First Name (Required)
    • Last Name (Required)
    • Email
    • Phone
    • Mobile
```

### Field-Level Visibility

```
Component: Field
  Field: Annual Revenue

Visibility:
  Profile = "Sales Manager"
  OR Profile = "System Administrator"

Result: Only managers and admins see Annual Revenue field
```

## Lightning Apps

**Lightning Apps** provide custom navigation and branding.

### What Lightning Apps Include

- **App name and branding**
- **Navigation bar items** (tabs)
- **Utility items** (bottom bar)
- **App-specific settings**
- **User/profile assignment**

### Creating a Lightning App

```
Setup → App Manager → New Lightning App

App Name: Property Management
Developer Name: Property_Management
App Options:
  • Show in Lightning Experience
  • Include standard Salesforce navigation

Navigation Items:
  • Home
  • Properties (custom object)
  • Showings (custom object)
  • Accounts
  • Contacts
  • Reports
  • Dashboards

Utility Items:
  • Notes
  • Recent Items

Assign to: Property Management Users
```

### App Manager Navigation

Users switch between apps:

```
┌──────────────────────────────┐
│ App Launcher                 │
├──────────────────────────────┤
│ Sales                        │
│ Service                      │
│ Marketing                    │
│ Property Management   ⭐     │
│ ...                          │
└──────────────────────────────┘
```

### App Branding

Customize app appearance:

- **App Logo**: Custom image
- **App Color**: Primary color theme
- **Brand Color**: Custom hex color

## Compact Layouts

**Compact Layouts** control which fields display in:

- Highlights panel
- Mobile cards
- Expanded lookup hover
- Activity timeline

### Configuring Compact Layout

```
Setup → Object Manager → Account → Compact Layouts

Primary Compact Layout: Account Compact Layout

Fields (up to 10):
  1. Name
  2. Account Owner
  3. Phone
  4. Industry
  5. Annual Revenue
```

### Where Compact Layouts Appear

```
┌────────────────────────────────────┐
│ Highlights Panel                   │
├────────────────────────────────────┤
│ ACME Corporation                   │
│ Owner: Sarah Johnson | Phone: ...  │
│ Industry: Technology | Rev: $5M    │
└────────────────────────────────────┘
```

## Actions

**Actions** let users quickly create or update records, log calls, send emails, etc.

### Types of Actions

1. **Object-Specific Actions** - Available on specific object
2. **Global Actions** - Available anywhere (via Global Actions menu)

### Action Types

- **Create a Record** - Quick create
- **Update a Record** - Quick update
- **Log a Call** - Quick call log
- **Send Email** - Quick email
- **Custom Visualforce**
- **Custom Lightning Component**
- **Flow**

### Creating an Action

```
Setup → Object Manager → Account → Buttons, Links, and Actions
New Action

Action Type: Create a Record
Target Object: Contact
Label: New Contact
Fields:
  • First Name
  • Last Name
  • Email
  • Phone
  • Account (pre-populated)
```

### Adding Actions to Page Layouts

```
Page Layout Editor → Salesforce Mobile and Lightning Actions
Drag actions from palette:
  • New Contact
  • New Opportunity
  • Log a Call
  • Send Email
```

### Global Actions

Available from any page:

```
Setup → Global Actions → New Action

Type: Create a Record
Object: Case
Label: Quick Case
Predefined Field Values:
  Origin = "Phone"
  Priority = "High"
```

## Search Layouts

**Search Layouts** control which fields appear in search results and lookups.

### Search Layout Types

1. **Search Results** - Search results page
2. **Lookup Dialogs** - Lookup popup
3. **Lookup Phone Dialogs** - Phone lookup
4. **Recent Records** - Recently viewed list

### Configuring Search Layouts

```
Setup → Object Manager → Account → Search Layouts
Edit: Search Results

Selected Fields:
  • Account Name
  • Account Owner
  • Phone
  • Industry
  • Annual Revenue
```

## List Views

**List Views** provide filtered lists of records.

### Creating a List View

```
Object Tab → List View: New

List Name: My High-Value Accounts
Who sees this list: Only I can see
Filter by Owner: My Accounts
Filters:
  Annual Revenue > 5000000

Columns:
  • Account Name
  • Industry
  • Annual Revenue
  • Owner
  • Phone
```

### List View Types

- **My Views** - Personal, only you can see
- **Shared Views** - Shared with specific groups
- **Public Views** - Everyone can see

### Pin List Views

Pin frequently used views for quick access:

```
Click "Pin" icon on list view
Result: Appears in "Pinned" section at top
```

## Best Practices

### ✅ DO

1. **Keep it simple**
   - Only show fields users need
   - Remove clutter
   - Group related fields

2. **Use sections logically**
   ```
   Good sections:
   • Account Information
   • Contact Details
   • Address
   • System Information
   ```

3. **Place important fields first**
   - Top of page = most visible
   - Above the fold

4. **Use required fields sparingly**
   - Only require what's truly necessary
   - Too many required fields frustrates users

5. **Test with real users**
   - Get feedback
   - Iterate based on usage
   - Monitor adoption

6. **Use record types for distinct processes**
   - Different sales processes
   - Different support types
   - Don't overuse (complexity)

7. **Leverage Lightning App Builder**
   - Custom record pages
   - Embedded components
   - Rich user experience

8. **Use visibility rules**
   - Show only relevant info
   - Based on profile, record type, field values

### ❌ DON'T

1. **Don't hide fields for security**
   - Use Field-Level Security instead
   - Page layouts are not security

2. **Don't create too many record types**
   - Adds complexity
   - Harder to maintain
   - Use when truly needed

3. **Don't create too many page layouts**
   - Start with one, add more only if needed
   - Use Lightning visibility instead

4. **Don't forget mobile users**
   - Test on mobile
   - Mobile page layout may differ
   - Keep mobile-friendly

5. **Don't ignore compact layouts**
   - Important for mobile
   - Shows in highlights panel
   - Configure for best fields

## Common UI Patterns

### Pattern 1: Sales App

```
Lightning App: Sales
Navigation:
  • Home
  • Accounts
  • Contacts
  • Leads
  • Opportunities
  • Reports
  • Dashboards

Account Record Page:
  Header: Highlights (Name, Industry, Revenue, Owner)
  Main: Details, Opportunities, Contacts, Activity
  Sidebar: Parent Account, Related News, Chatter
```

### Pattern 2: Service App

```
Lightning App: Service
Navigation:
  • Home
  • Cases
  • Accounts
  • Contacts
  • Knowledge
  • Reports

Case Record Page:
  Header: Highlights (Number, Status, Priority, Owner)
  Main: Details, Comments, Activity Timeline
  Sidebar: Account Info, Knowledge Articles, Related Cases
```

### Pattern 3: Custom App for Property Management

```
Lightning App: Property Management
Navigation:
  • Properties
  • Showings
  • Offers
  • Agents
  • Reports

Property Record Page:
  Header: Highlights (Address, Price, Status, Agent)
  Main: Property Details, Photos, Showings, Offers
  Sidebar: Listing Agent Info, Market Stats
```

## Practice Exercises

### Exercise 1: Customize Account Page Layout

1. Create new section "Financial Information"
2. Add fields: Annual Revenue, Number of Employees
3. Mark Annual Revenue as required
4. Move "Billing Address" section above "Additional Information"
5. Add Contacts related list
6. Save and assign to Standard User profile

### Exercise 2: Create Record Types

For Opportunity object:

1. Create "New Business" record type
2. Create "Renewal" record type
3. Create custom Stage picklist values for each
4. Create page layouts for each type
5. Assign to profiles

### Exercise 3: Build Lightning Record Page

Create custom Account record page:

1. Use "Header and Two Regions" template
2. Header: Highlights Panel
3. Main: Record Detail, Related List (Contacts, Opportunities)
4. Sidebar: Related Record (Parent Account), Chatter
5. Add visibility rule: Show "Premium Support" only if Type = "Customer"
6. Activate for Sales App

### Exercise 4: Create Lightning App

Build a custom app:

1. Name: "Real Estate Management"
2. Navigation: Properties, Showings, Offers, Accounts, Reports
3. Utility Items: Notes, Recent Items
4. Custom branding: Blue color theme
5. Assign to custom profile

## Next Steps

- **Next Topic**: Move to Apex Programming section
- **Practice**: Customize UI in your Developer Org
- **Advanced**: Learn about Lightning Web Components for custom UI

## Key Takeaways

🔑 **Page Layouts** control field visibility and organization
🔑 **Record Types** enable different processes for different users
🔑 **Lightning App Builder** creates custom record and app pages
🔑 **Dynamic Forms** provide more flexibility than page layouts
🔑 **Lightning Apps** customize navigation and branding
🔑 **Actions** enable quick record creation and updates
🔑 **Compact Layouts** control highlights panel and mobile cards
🔑 **Always use FLS** for security, not page layout hiding
🔑 **Test with real users** to ensure good UX
🔑 **Keep it simple** - only show what users need
