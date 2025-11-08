---
title: "Declarative Automation Tools"
section: "basics"
order: 5
difficulty: "beginner"
readTime: "25 min"
description: "Master Salesforce's point-and-click automation: Flows, Process Builder, and Workflow Rules."
overview: "Automate business processes without code using Flow Builder, Salesforce's primary automation tool. Learn to create record-triggered flows, screen flows for guided processes, scheduled flows for batch operations, and approval processes for multi-step approvals."
concepts: ["Flow Builder", "Automation", "Record-Triggered Flows", "Screen Flows", "Scheduled Flows", "Approval Processes"]
prerequisites: ["data-model-basics", "relationships-and-schema"]
relatedTopics: ["salesforce-security-model", "reports-and-dashboards"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Declarative Automation Tools

Salesforce provides powerful **declarative (point-and-click) automation** tools that let you automate business processes without writing code.

## Why Automation Matters

Automation allows you to:
- **Reduce manual work** - Let the system do repetitive tasks
- **Ensure consistency** - Rules are applied the same way every time
- **Improve data quality** - Auto-populate fields, validate data
- **Speed up processes** - Instant actions instead of waiting for users
- **Enhance user experience** - Users see relevant, timely information

## Salesforce Automation Tools

Salesforce offers several automation tools:

1. **Flow Builder** (Modern, most powerful) ⭐ **Use this!**
2. **Process Builder** (Being retired - migrate to Flow)
3. **Workflow Rules** (Legacy - no longer actively developed)
4. **Approvals** (Still used for approval processes)

### Which Tool to Use?

**Simple Answer**: Use **Flow Builder** for everything new.

```
Flow Builder
├── Record-Triggered Flows (replaces Process Builder & Workflow)
├── Screen Flows (user-guided processes)
├── Scheduled Flows (time-based actions)
└── Autolaunched Flows (called by other processes)
```

## Flow Builder Overview

**Flow Builder** is Salesforce's primary automation tool - a visual designer for building automated processes.

### Types of Flows

1. **Record-Triggered Flow** - Runs when a record is created, updated, or deleted
2. **Screen Flow** - Interactive flows with user input (wizards, guided processes)
3. **Scheduled Flow** - Runs at a specified time
4. **Autolaunched Flow** - Triggered by other processes or code
5. **Platform Event Flow** - Triggered by platform events

### Accessing Flow Builder

```
Setup → Flows → New Flow
```

## Record-Triggered Flows

The most common flow type - automatically runs when records change.

### Trigger Configuration

**When to Run:**
- **A record is created**
- **A record is updated**
- **A record is deleted**
- **A record is created or updated** (most common)

**Entry Conditions:**
Filter which records trigger the flow:
```
Example: Run only when:
- Opportunity.Stage = 'Closed Won'
- AND Opportunity.Amount > 100000
```

**Optimization:**
- **Fast Field Updates** - Very fast, limited actions (before save)
- **Actions and Related Records** - More flexible (after save)

### Example 1: Welcome Email for New Leads

**Goal**: Send welcome email when a Lead is created.

```
Trigger: Record-Triggered Flow
Object: Lead
When: A record is created
Entry Conditions: None (all new Leads)

Flow Elements:
1. Send Email
   - To: {!$Record.Email}
   - Subject: Welcome to ACME Corp!
   - Body: Hi {!$Record.FirstName}, Thanks for your interest...
```

### Example 2: Opportunity Stage Change Alert

**Goal**: Notify owner when Opportunity reaches "Closed Won".

```
Trigger: Record-Triggered Flow
Object: Opportunity
When: A record is updated
Entry Conditions:
  - Stage = 'Closed Won'
  - AND Prior Value: Stage ≠ 'Closed Won' (just changed to Closed Won)

Flow Elements:
1. Send Email
   - To: {!$Record.OwnerId}
   - Subject: 🎉 Opportunity Won: {!$Record.Name}
   - Body: Congratulations! You closed {!$Record.Name} for ${!$Record.Amount}
```

### Example 3: Auto-Create Follow-Up Task

**Goal**: Create a task when a Case is closed.

```
Trigger: Record-Triggered Flow
Object: Case
When: A record is updated
Entry Conditions:
  - Status = 'Closed'
  - AND Prior Value: Status ≠ 'Closed'

Flow Elements:
1. Create Records
   - Object: Task
   - Fields:
     • Subject: "Follow up on Case: {!$Record.CaseNumber}"
     • WhatId: {!$Record.Id}
     • OwnerId: {!$Record.OwnerId}
     • ActivityDate: {!$Flow.CurrentDate} + 7 days
     • Status: Not Started
```

## Flow Elements

Flow Builder provides building blocks called **elements**.

### Core Elements

1. **Assignment** - Set or change variable values
   ```
   Variable: totalValue
   Operator: Add
   Value: {!$Record.Amount}
   ```

2. **Decision** - Branch based on conditions (if/else logic)
   ```
   Outcome 1: High Value
     Condition: {!$Record.Amount} > 100000

   Outcome 2: Normal Value
     Condition: {!$Record.Amount} <= 100000

   Default Outcome: All other cases
   ```

3. **Loop** - Iterate through a collection
   ```
   Collection: {!Get_Opportunities}
   Direction: First item to last item
   Loop Variable: CurrentOpportunity
   ```

4. **Get Records** - Query Salesforce records
   ```
   Object: Contact
   Conditions:
     AccountId = {!$Record.Id}
     Email ≠ null
   Store in: ContactList
   ```

5. **Create Records** - Create new records
   ```
   Object: Task
   Fields:
     Subject: "Follow up"
     WhatId: {!$Record.Id}
   ```

6. **Update Records** - Modify existing records
   ```
   Records to Update: {!$Record}
   Fields:
     Status__c = "Processed"
     Last_Updated__c = {!$Flow.CurrentDateTime}
   ```

7. **Delete Records** - Remove records
   ```
   Records to Delete: {!RecordsToDelete}
   ```

### Interaction Elements

8. **Screen** - Display information and collect input
   ```
   Screen: Collect Customer Info
   Components:
     - Display Text: "Please enter your information"
     - Text Input: Customer Name
     - Email Input: Email Address
     - Checkbox: Agree to Terms
   ```

9. **Send Email** - Send email alerts
   ```
   Recipients: {!$Record.OwnerId}
   Subject: "Action Required"
   Body: "Please review the record..."
   ```

### Logic Elements

10. **Subflow** - Call another flow
    ```
    Flow: Calculate_Commission
    Input Variables:
      OpportunityId = {!$Record.Id}
    ```

11. **Action** - Call Apex, send custom notifications, post to Chatter, etc.
    ```
    Action: Send Custom Notification
    Title: "New High-Value Lead"
    Body: "Lead {!$Record.Name} is worth ${!$Record.AnnualRevenue}"
    ```

## Flow Example: Opportunity Discount Approval

Let's build a complete flow that requires approval for large discounts.

### Business Requirement

When an Opportunity has a discount > 20%, require manager approval.

### Flow Design

```
Trigger: Record-Triggered Flow
Object: Opportunity
When: A record is created or updated
Entry Conditions:
  - Discount_Percent__c > 20

Flow Steps:
1. Decision: Check if Already Approved
   - If Discount_Approved__c = true → Exit
   - Else → Continue

2. Get Records: Get Owner's Manager
   - Object: User
   - Condition: Id = {!$Record.Owner.ManagerId}
   - Store in: ManagerRecord

3. Action: Submit for Approval
   - Object: Opportunity
   - Record ID: {!$Record.Id}
   - Submitter: {!$Record.OwnerId}
   - Approver: {!ManagerRecord.Id}

4. Send Email: Notify Manager
   - To: {!ManagerRecord.Email}
   - Subject: Approval Needed: {!$Record.Name}
   - Body: Discount of {!$Record.Discount_Percent__c}% requires your approval
```

## Screen Flows

**Screen Flows** guide users through multi-step processes.

### Use Cases

- **Data collection wizards**
- **Guided troubleshooting**
- **Custom forms**
- **Multi-step processes**

### Example: New Customer Onboarding

```
Screen 1: Welcome
  - Display Text: "Welcome to ACME Customer Onboarding"
  - Button: Next

Screen 2: Collect Information
  - Text Input: Company Name
  - Email Input: Primary Contact Email
  - Picklist: Industry
  - Number Input: Expected Annual Revenue
  - Button: Next

Screen 3: Create Account
  - Action: Create Records
    Object: Account
    Fields from inputs

Screen 4: Success
  - Display Text: "Account created successfully!"
  - Display: Account Number: {!NewAccount.AccountNumber}
  - Button: Finish
```

### Launching Screen Flows

Screen flows can be launched from:
- **Lightning Page** - Add Flow component
- **Quick Action** - Launch from record page
- **Experience Cloud** - Embed in community
- **Utility Bar** - Quick access from app
- **URL** - Direct link

## Scheduled Flows

**Scheduled Flows** run at specific times to process records in batches.

### Use Cases

- Daily cleanup of old records
- Weekly report generation
- Monthly subscription renewals
- Nightly data synchronization

### Example: Daily Task Reminder

```
Scheduled Flow: Send Daily Task Reminders
Frequency: Daily at 8:00 AM

Flow Steps:
1. Get Records: Today's Tasks
   - Object: Task
   - Conditions:
     • ActivityDate = TODAY
     • Status ≠ Completed
   - Store in: TodaysTasks

2. Loop: Through Tasks
   - Collection: {!TodaysTasks}
   - Loop Variable: CurrentTask

3. Send Email (inside loop)
   - To: {!CurrentTask.OwnerId}
   - Subject: "Reminder: Task Due Today"
   - Body: "Your task '{!CurrentTask.Subject}' is due today"
```

### Scheduling a Flow

```
Setup → Flows → [Your Flow] → Activate
Click: Run
Select: Set a schedule
Frequency: Daily / Weekly / Monthly
Start Date: [Date]
End Date: [Optional]
```

## Process Builder (Legacy)

⚠️ **Process Builder is being retired** - Salesforce announced all new automation should use Flow Builder.

### Migration Path

If you have existing Process Builder processes:
1. **Continue using existing processes** (they still work)
2. **New automation** → Use Flow Builder
3. **Eventually migrate** to Flow Builder using "Migrate to Flow" tool

### Why Flow is Better

| Feature | Process Builder | Flow Builder |
|---------|----------------|--------------|
| User Interface | Older | Modern, easier |
| Performance | Slower | Faster |
| Debugging | Limited | Advanced debug tools |
| Features | Limited | Full featured |
| Future Updates | None | Active development |

## Workflow Rules (Legacy)

⚠️ **Workflow Rules are legacy** - No new features since 2016.

### When They Still Make Sense

Workflow Rules are simpler for very basic automation:
- Field updates
- Email alerts
- Task creation
- Outbound messages

### Example Workflow Rule

```
Object: Lead
Rule Name: Auto-Assign High Value Leads
Criteria: Annual Revenue > 1000000

Actions:
1. Field Update: Status = 'Hot'
2. Email Alert: Notify Sales Manager
3. Task: Follow up within 24 hours
```

### Migration to Flow

Convert Workflow Rules to Record-Triggered Flows for:
- Better performance
- More flexibility
- Modern tooling

## Approval Processes

**Approval Processes** are still actively used for multi-step approvals.

### Use Cases

- Discount approvals
- Expense report approvals
- Time-off requests
- Contract approvals
- Change requests

### Approval Process Structure

```
1. Entry Criteria
   ↓
2. Initial Submission Actions (optional)
   ↓
3. Approval Steps (can be multiple)
   ├── Approve → Approval Actions
   ├── Reject → Rejection Actions
   └── Recall → Recall Actions
   ↓
4. Final Actions
```

### Example: Discount Approval Process

```
Object: Opportunity
Process Name: Discount Approval

Entry Criteria:
  Discount_Percent__c > 15

Submission Actions:
  - Field Update: Status = 'Pending Approval'
  - Email: Notify submitter

Approval Step 1: Manager Approval (Discount 15-25%)
  Assigned To: Record Owner's Manager
  Criteria: Discount_Percent__c <= 25
  Approve → Field Update: Discount_Approved__c = true
  Reject → Field Update: Status = 'Discount Rejected'

Approval Step 2: Director Approval (Discount > 25%)
  Assigned To: Queue: Sales Directors
  Criteria: Discount_Percent__c > 25
  Approve → Field Update: Discount_Approved__c = true
  Reject → Field Update: Status = 'Discount Rejected'

Final Approval Actions:
  - Field Update: Status = 'Approved'
  - Email: Notify owner and approvers

Final Rejection Actions:
  - Email: Notify owner of rejection
```

### Creating Approval Processes

```
Setup → Approval Processes → Create New

1. Choose Object: Opportunity
2. Define Entry Criteria
3. Specify Approver
4. Select Submission & Approval Actions
5. Activate
```

## Automation Best Practices

### ✅ DO

1. **Use Flow Builder for new automation**
   - Modern, powerful, actively developed
   - Better performance and debugging

2. **Name flows descriptively**
   ```
   Good: "Opportunity - Create Follow-Up Task on Win"
   Bad: "Flow 1"
   ```

3. **Add descriptions**
   - Explain what the flow does
   - Document business requirements
   - Note any dependencies

4. **Use decision elements for clarity**
   - Even if only one branch
   - Makes logic easy to follow

5. **Bulkify your flows**
   - Use collections (lists) not single records
   - Loop through records efficiently
   - Avoid governor limits

6. **Test before activating**
   - Use Flow debug mode
   - Test with real data
   - Consider edge cases

7. **Handle errors gracefully**
   - Add fault paths
   - Log errors
   - Notify administrators

8. **Document your automation**
   - Flow description
   - Comments in complex areas
   - External documentation for complex processes

### ❌ DON'T

1. **Don't create infinite loops**
   - Flow triggers itself → triggers itself → crashes
   - Use flags to prevent re-entry

2. **Don't query inside loops**
   ```
   ❌ BAD:
   Loop through accounts
     → Get contacts for each account (query in loop!)

   ✅ GOOD:
   Get all contacts for all accounts first
   Loop through accounts
     → Filter contacts from collection
   ```

3. **Don't forget about governor limits**
   - Max 2000 records in a collection
   - Max 100 SOQL queries per transaction
   - Max 10MB heap size

4. **Don't use flows for everything**
   - Very complex logic → Use Apex
   - Simple field updates → Maybe still Workflow
   - But most things → Flow is great!

5. **Don't skip testing**
   - Always test flows before activating
   - Test with different user profiles
   - Test bulk scenarios

## Practice Exercises

### Exercise 1: New Lead Notification

Create a flow that:
1. Triggers when a Lead is created
2. Sends an email to the Lead owner
3. Creates a task to follow up in 2 days

### Exercise 2: Case Escalation

Create a flow that:
1. Runs daily
2. Finds Cases open for > 3 days
3. Updates Priority to 'High'
4. Sends email to Case owner and manager

### Exercise 3: Opportunity Validation

Create a flow that:
1. Triggers when Opportunity is updated
2. If Stage = 'Closed Won' AND Amount is blank
3. Prevents save with error message: "Amount is required for won opportunities"

### Exercise 4: Account Onboarding Screen Flow

Create a screen flow that:
1. Collects: Company Name, Industry, Annual Revenue
2. Creates an Account
3. Creates a Contact for the primary contact
4. Creates a Task for account setup
5. Shows success message with Account Number

## Debugging Flows

### Debug Mode

```
Flow Builder → Debug
- Test with real or sample data
- Step through each element
- See variable values
- Identify errors
```

### Common Errors

1. **Null Reference**: Trying to use a value that doesn't exist
   - Solution: Check for null before using

2. **SOQL Query Limit**: Too many queries
   - Solution: Query once, use collections

3. **Record Not Found**: Get Records returns nothing
   - Solution: Check record exists, handle empty results

4. **Field Not Accessible**: User doesn't have FLS
   - Solution: Adjust field-level security

## Next Steps

- **Next Topic**: Reports and Dashboards
- **Practice**: Build flows in your Developer Org
- **Advanced**: Learn about Flow Orchestration and Transaction Control

## Key Takeaways

🔑 **Use Flow Builder** for all new automation
🔑 **Record-Triggered Flows** replace Process Builder and Workflow Rules
🔑 **Screen Flows** create guided user experiences
🔑 **Scheduled Flows** automate batch processes
🔑 **Bulkify your flows** to handle multiple records efficiently
🔑 **Test thoroughly** before activating in production
🔑 **Document your automation** for future maintenance
🔑 **Approval Processes** are still the best for approvals
