---
title: "Reports and Dashboards"
section: "basics"
order: 6
difficulty: "beginner"
readTime: "20 min"
description: "Learn to create powerful reports and dashboards to analyze your Salesforce data and make data-driven decisions."
overview: "Transform your Salesforce data into actionable insights with reports and dashboards. Learn to create tabular, summary, and matrix reports, use filters and formulas, add charts for visualization, create custom report types, build interactive dashboards, and schedule automated report delivery."
concepts: ["Reports", "Dashboards", "Report Types", "Filters", "Charts", "Report Formulas", "Scheduling"]
prerequisites: ["data-model-basics"]
relatedTopics: ["declarative-automation", "ui-customization"]
lastUpdated: "2024-01-15"
examWeight: "medium"
---

# Reports and Dashboards

Salesforce **Reports** and **Dashboards** transform your data into actionable insights. They're essential tools for analyzing performance, tracking metrics, and making data-driven decisions.

## Why Reports and Dashboards Matter

- **Visibility**: See what's happening in your business at a glance
- **Analysis**: Identify trends, patterns, and opportunities
- **Decision Making**: Make informed decisions based on data
- **Accountability**: Track performance against goals
- **Automation**: Schedule and distribute reports automatically

## Reports Overview

A **report** is a list of records that meet specified criteria, displayed in rows and columns.

### Report Types

Salesforce provides four types of reports:

1. **Tabular** - Simple list, like a spreadsheet
2. **Summary** - Groups and subtotals
3. **Matrix** - Groups by rows AND columns
4. **Joined** - Multiple report types combined (advanced)

### Creating Your First Report

```
1. Click App Launcher → Reports
2. Click "New Report"
3. Select Report Type (e.g., "Opportunities")
4. Click "Continue"
5. Add filters, group, and customize
6. Click "Save & Run"
```

## Tabular Reports

**Tabular reports** are the simplest format - just a list of records with columns.

### When to Use

- Simple lists
- Export to Excel
- No grouping or subtotals needed

### Example: All Open Opportunities

```
Report Type: Opportunities
Format: Tabular

Filters:
  - Stage ≠ Closed Won
  - Stage ≠ Closed Lost
  - Close Date = THIS_YEAR

Columns:
  - Opportunity Name
  - Account Name
  - Amount
  - Stage
  - Close Date
  - Owner

Sort: Close Date (ascending)
```

**Result**:
```
┌────────────────────────────────────────────────────────────────┐
│ Opportunity │ Account    │ Amount    │ Stage      │ Close Date │
├────────────────────────────────────────────────────────────────┤
│ ACME Deal   │ ACME Corp  │ $500,000  │ Negotiation│ 2024-03-15 │
│ Widget Sale │ Widget Inc │ $250,000  │ Proposal   │ 2024-03-20 │
│ Tech Project│ Tech Co    │ $750,000  │ Prospecting│ 2024-04-01 │
└────────────────────────────────────────────────────────────────┘
```

## Summary Reports

**Summary reports** group records and show subtotals.

### When to Use

- Analyze data by categories
- Show subtotals and totals
- Most common report type

### Example: Opportunities by Stage

```
Report Type: Opportunities
Format: Summary

Grouping:
  - Group by: Stage

Columns:
  - Opportunity Name
  - Account Name
  - Amount
  - Close Date

Subtotals:
  - Sum of Amount
  - Record Count
```

**Result**:
```
Stage: Prospecting (15 records)
┌─────────────────────────────────────────────┐
│ Opportunity │ Account    │ Amount          │
├─────────────────────────────────────────────┤
│ Deal A      │ Company A  │ $100,000        │
│ Deal B      │ Company B  │ $200,000        │
└─────────────────────────────────────────────┘
Subtotal: $300,000

Stage: Negotiation (8 records)
┌─────────────────────────────────────────────┐
│ Opportunity │ Account    │ Amount          │
├─────────────────────────────────────────────┤
│ Deal C      │ Company C  │ $500,000        │
│ Deal D      │ Company D  │ $400,000        │
└─────────────────────────────────────────────┘
Subtotal: $900,000

Grand Total: $1,200,000 (23 records)
```

### Multiple Groupings

You can add up to **3 grouping levels**:

```
Group 1: Owner
  Group 2: Stage
    Group 3: Close Date (by month)
      → Records

Example Result:
Sarah Johnson
  Prospecting
    March 2024: 5 opportunities, $500K
    April 2024: 3 opportunities, $300K
  Negotiation
    March 2024: 2 opportunities, $800K
```

## Matrix Reports

**Matrix reports** group by BOTH rows and columns, like a pivot table.

### When to Use

- Compare categories against each other
- See data from two dimensions
- Powerful visualizations

### Example: Opportunities by Owner and Stage

```
Report Type: Opportunities
Format: Matrix

Row Grouping: Owner
Column Grouping: Stage
Summary Field: Sum of Amount
```

**Result**:
```
                 Prospecting  Proposal  Negotiation  Closed Won  Total
────────────────────────────────────────────────────────────────────────
Sarah Johnson    $200,000     $400,000  $600,000     $1,500,000  $2,700,000
Mike Chen        $150,000     $300,000  $400,000     $1,200,000  $2,050,000
Lisa Anderson    $100,000     $200,000  $500,000     $900,000    $1,700,000
────────────────────────────────────────────────────────────────────────
Total            $450,000     $900,000  $1,500,000   $3,600,000  $6,450,000
```

## Filters

**Filters** determine which records appear in your report.

### Standard Filters

```
Show Me: My Opportunities (built-in filter)
Date Field: Close Date
Range: Current FQ (fiscal quarter)
```

### Custom Filters

```
Field          Operator         Value
─────────────────────────────────────────
Amount         greater than     100000
AND Stage      equals           Negotiation, Closed Won
AND Probability greater equal   75
```

### Filter Operators

- **Equals** / **Not Equal To**
- **Greater Than** / **Less Than**
- **Contains** / **Does Not Contain**
- **Starts With**
- **Includes** / **Excludes** (multi-select picklist)

### Date Filters

Powerful date ranges:

- **THIS_WEEK**, **LAST_WEEK**, **NEXT_WEEK**
- **THIS_MONTH**, **LAST_MONTH**, **NEXT_MONTH**
- **THIS_QUARTER**, **LAST_QUARTER**, **NEXT_QUARTER**
- **THIS_YEAR**, **LAST_YEAR**, **NEXT_YEAR**
- **LAST_90_DAYS**, **NEXT_90_DAYS**
- **Custom**: specific date range

## Formulas in Reports

Create **custom formulas** to calculate values.

### Example: Discount Percentage

```
Formula Name: Discount Percent
Formula:
  (List_Price__c - Amount) / List_Price__c

Format: Percent
Decimal Places: 2

Result: 25.00%
```

### Example: Days to Close

```
Formula Name: Days to Close
Formula:
  CloseDate - CreatedDate

Format: Number

Result: 45 (days)
```

### Common Formula Functions

- **IF()**: Conditional logic
- **CASE()**: Multiple conditions
- **AND()**, **OR()**, **NOT()**: Logical operators
- **TODAY()**: Current date
- **NOW()**: Current date/time
- **ROUND()**: Round numbers
- **TEXT()**: Convert to text

## Charts

Visualize report data with **charts**.

### Chart Types

1. **Bar Chart** - Compare categories horizontally
2. **Column Chart** - Compare categories vertically
3. **Line Chart** - Show trends over time
4. **Pie Chart** - Show proportions (max 10 slices)
5. **Donut Chart** - Like pie, with center hole
6. **Funnel Chart** - Show stages/progression
7. **Scatter Chart** - Show correlation

### Adding a Chart

```
Report Builder → Add Chart

Chart Type: Bar Chart
X-Axis: Stage
Y-Axis: Sum of Amount
```

### Chart Best Practices

- ✅ Use bar/column for comparisons
- ✅ Use line for trends over time
- ✅ Use pie for proportions (keep under 7 slices)
- ✅ Use funnel for pipeline/stages
- ⚠️ Don't use 3D charts (harder to read)
- ⚠️ Limit colors (too many is confusing)

## Report Types

**Report Types** determine which objects and fields are available in a report.

### Standard Report Types

Salesforce provides many standard report types:

- **Accounts & Contacts**
- **Opportunities**
- **Leads**
- **Cases**
- **Activities** (Tasks & Events)
- **Campaigns**

### Custom Report Types

Create custom report types to:
- Report on custom objects
- Combine objects in specific ways
- Control which fields are available

#### Creating a Custom Report Type

```
Setup → Report Types → New Custom Report Type

Primary Object: Property__c
Report Type Name: Properties with Showings

Related Objects:
  Add: Showings (Master-Detail)
  Each 'A' record must have at least one related 'B' record

Fields Available:
  [Select which fields users can add to reports]

Save
```

### Report Type Categories

Organize report types:

- **Sales Reports**
- **Service Reports**
- **Marketing Reports**
- **Custom Reports**

## Dashboards

**Dashboards** display multiple reports as visual components on one screen.

### Dashboard Components

1. **Chart** - Visual representation of a report
2. **Gauge** - Shows single value against target
3. **Metric** - Displays a single number
4. **Table** - Shows report data in table format

### Creating a Dashboard

```
1. App Launcher → Dashboards
2. Click "New Dashboard"
3. Name: Sales Performance Dashboard
4. Click "Create"
5. Click "+ Component"
6. Select Report
7. Choose Component Type (Chart, Gauge, etc.)
8. Configure and Save
```

### Example: Sales Dashboard

```
Dashboard: Sales Performance

Components:
┌──────────────────────────────────────┐
│ Revenue This Quarter (Metric)       │
│ $1,245,000                          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Pipeline by Stage (Funnel)          │
│ Prospecting:  $500K                 │
│ Qualification: $400K                │
│ Proposal:      $300K                │
│ Negotiation:   $200K                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Top Opportunities (Table)           │
│ ACME Deal      $500K    Negotiation │
│ Widget Project $400K    Proposal    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Revenue by Rep (Bar Chart)          │
│ Sarah  █████████████ $800K          │
│ Mike   ██████████   $600K           │
│ Lisa   ████████     $500K           │
└──────────────────────────────────────┘
```

### Running User

Dashboards have a **"Running User"** - whose access determines which data is displayed.

**Options:**

1. **Run as specified user** (Dashboard shows same data for everyone)
   - Good for: Executive dashboards
   - Security: Running user must have access to all data

2. **Run as logged-in user** (Each user sees their own data)
   - Good for: Personal dashboards
   - Security: Users only see data they have access to

**Dynamic Dashboards** (Enterprise+ feature) let each viewer see their own data.

### Dashboard Filters

Add **filters** to let users slice data dynamically:

```
Dashboard Filter: Close Date
Options: This Quarter, Last Quarter, This Year
Applies to: All components

Result: Users can filter entire dashboard by date range
```

### Dashboard Subscriptions

**Subscribe** to get dashboard emailed regularly:

```
Dashboard → Subscribe
Frequency: Weekly, every Monday at 8 AM
Recipients: Me, my team
```

## Report Folders

Organize reports in **folders** with different access levels.

### Folder Types

1. **Public Folders** - Everyone can access
2. **Hidden Folders** - Only folder managers can access
3. **Shared Folders** - Specific users/groups can access

### Folder Access Levels

- **Viewer** - Can view reports in folder
- **Editor** - Can edit reports in folder
- **Manager** - Can manage folder and its contents

### Organizing Reports

```
Reports
├── Sales Reports
│   ├── Pipeline Reports
│   ├── Won Opportunities
│   └── Lost Opportunities
├── Service Reports
│   ├── Open Cases
│   └── Case Metrics
└── My Personal Reports
```

## Report Scheduling

**Schedule reports** to run automatically and email results.

### Scheduling a Report

```
Report → Subscribe
Frequency: Daily / Weekly / Monthly
Run on: Specific days/times
Send to: Users, Groups, Roles
Format: Excel, CSV, PDF

Example:
  Weekly Pipeline Report
  Every Monday at 8:00 AM
  To: Sales Team
  Format: Excel
```

## Best Practices

### ✅ DO

1. **Name reports clearly**
   ```
   Good: "Open Opportunities - This Quarter"
   Bad: "Report 123"
   ```

2. **Add descriptions**
   - What the report shows
   - Who should use it
   - How to interpret it

3. **Use folders to organize**
   - By department
   - By function
   - By purpose

4. **Limit columns**
   - Only show what's needed
   - Too many columns = hard to read

5. **Use filters wisely**
   - Start with broad, add filters as needed
   - Use date filters for performance

6. **Add charts for clarity**
   - Visuals are easier to understand
   - But not every report needs a chart

7. **Test before sharing**
   - Run with different users
   - Verify data accuracy
   - Check permissions

8. **Schedule instead of running manually**
   - Automated delivery
   - Consistent timing
   - Less manual work

### ❌ DON'T

1. **Don't create duplicate reports**
   - Reuse and share existing reports
   - Organize in shared folders

2. **Don't show sensitive data publicly**
   - Use private or hidden folders
   - Check folder permissions

3. **Don't forget about running user on dashboards**
   - Verify who can see what
   - Test with different users

4. **Don't create overly complex reports**
   - If too complex, break into multiple reports
   - Consider if you need code/Apex instead

## Common Report Examples

### Sales Reports

**1. Sales Pipeline**
```
Type: Opportunities
Format: Summary
Group: Stage
Filter: Open Opportunities
Chart: Funnel
```

**2. Won Opportunities This Quarter**
```
Type: Opportunities
Format: Summary
Group: Owner
Filter: Stage = Closed Won, Close Date = THIS_QUARTER
Chart: Bar Chart
```

**3. Forecast Report**
```
Type: Opportunities
Format: Matrix
Rows: Owner
Columns: Close Date (by Month)
Values: Sum of Amount
Filter: Open Opportunities
```

### Service Reports

**4. Open Cases by Priority**
```
Type: Cases
Format: Summary
Group: Priority
Filter: Status ≠ Closed
Chart: Pie Chart
```

**5. Average Case Age**
```
Type: Cases
Format: Summary
Group: Owner
Formula: TODAY() - CreatedDate
Chart: Bar Chart
```

### Marketing Reports

**6. Campaign ROI**
```
Type: Campaigns with Opportunities
Format: Summary
Group: Campaign Name
Columns: Total Opportunities, Total Won, Sum of Amount
```

## Practice Exercises

### Exercise 1: Basic Tabular Report

Create a simple list of all Accounts:
1. Report Type: Accounts
2. Format: Tabular
3. Columns: Account Name, Industry, Annual Revenue, Owner
4. Sort by Annual Revenue (descending)

### Exercise 2: Summary Report with Chart

Create a report of Opportunities by Stage:
1. Format: Summary
2. Group by: Stage
3. Show: Sum of Amount, Record Count
4. Add: Funnel chart
5. Filter: Close Date = THIS_YEAR

### Exercise 3: Matrix Report

Create an Opportunities report:
1. Format: Matrix
2. Rows: Owner
3. Columns: Close Date (by Month)
4. Values: Sum of Amount
5. Filter: Current Fiscal Quarter

### Exercise 4: Dashboard

Create a sales dashboard with:
1. Metric: Total Pipeline Value
2. Funnel: Opportunities by Stage
3. Bar Chart: Opportunities by Owner
4. Table: Top 10 Opportunities

## Advanced Features

### Joined Reports

Combine multiple report types:

```
Joined Report: Sales and Service Overview
Block 1: Open Opportunities
Block 2: Open Cases
Common Field: Account Name
```

### Bucket Fields

Group values into categories:

```
Bucket Field: Deal Size
Small: Amount < $50,000
Medium: Amount $50,000 - $250,000
Large: Amount > $250,000
```

### Cross Filters

Show records WITH or WITHOUT related records:

```
Accounts WITH Opportunities
- Shows only accounts that have opportunities

Accounts WITHOUT Cases
- Shows accounts with no cases
```

## Next Steps

- **Next Topic**: UI Customization (Page Layouts, Lightning App Builder)
- **Practice**: Create reports in your Developer Org
- **Advanced**: Learn about Einstein Analytics for advanced BI

## Key Takeaways

🔑 **Four report types**: Tabular, Summary, Matrix, Joined
🔑 **Summary reports** are most common (grouping + subtotals)
🔑 **Matrix reports** show data in two dimensions
🔑 **Filters** control which records appear
🔑 **Charts** make data easier to understand
🔑 **Dashboards** combine multiple reports
🔑 **Schedule reports** for automated delivery
🔑 **Organize with folders** and clear naming
