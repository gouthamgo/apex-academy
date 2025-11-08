---
title: "Salesforce Security Model"
section: "basics"
order: 3
difficulty: "beginner"
readTime: "25 min"
description: "Master Salesforce's layered security approach including profiles, permission sets, OWD, and sharing rules."
overview: "Understanding Salesforce's security model is crucial for every developer and administrator. Salesforce uses a layered security approach with four levels: Organization, Object, Field, and Record. Learn about profiles, permission sets, OWD, role hierarchy, sharing rules, and field-level security."
concepts: ["Security", "Profiles", "Permission Sets", "OWD", "Sharing Rules", "Field-Level Security", "Role Hierarchy"]
prerequisites: ["salesforce-platform-fundamentals", "data-model-basics"]
relatedTopics: ["relationships-and-schema", "ui-customization"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Salesforce Security Model

Understanding Salesforce's security model is crucial for every developer and administrator. Salesforce uses a **layered security approach** to control access to data and features.

## Security Layers Overview

Salesforce security works at multiple levels:

1. **Organization Level** - Login access, IP restrictions, session settings
2. **Object Level** - Control access to entire objects (CRUD permissions)
3. **Field Level** - Control access to specific fields
4. **Record Level** - Control access to individual records

## Organization-Wide Defaults (OWD)

OWD determines the **baseline level of access** users have to each other's records.

### OWD Settings

- **Private**: Only the record owner and users above them in the role hierarchy can view/edit
- **Public Read Only**: All users can view all records, but only owner can edit
- **Public Read/Write**: All users can view and edit all records
- **Controlled by Parent**: For child objects in master-detail relationships

### Example

```
Account OWD: Private
- User A creates an Account
- User B cannot see User A's Account (unless shared)

Contact OWD: Controlled by Parent
- Contacts inherit security from their parent Account
```

### Best Practices

- Start with most restrictive OWD, then open up access using sharing rules
- Use Private for sensitive objects (Accounts, Opportunities, Cases)
- Public Read/Write should be rare (internal collaboration objects only)

## Profiles

**Profiles** define what users can DO in Salesforce - their baseline permissions.

### What Profiles Control

1. **Object Permissions (CRUD)**
   - Create, Read, Edit, Delete access to objects
   - View All, Modify All (administrative access)

2. **Field-Level Security**
   - Visible or hidden
   - Read-only or editable

3. **App and Tab Visibility**
   - Which Lightning apps users can access
   - Which tabs are visible

4. **System Permissions**
   - Administrative privileges (Manage Users, Customize Application, etc.)
   - API access
   - View Setup

5. **Page and Component Access**
   - Apex classes
   - Visualforce pages
   - Lightning components

### Standard Profiles

Salesforce provides several standard profiles:

- **System Administrator**: Full access to everything
- **Standard User**: Standard access for most users
- **Marketing User**: Access to campaigns and marketing features
- **Contract Manager**: Manage contracts
- **Read Only**: View-only access
- **Minimum Access - Salesforce**: Extremely limited access

### Custom Profiles

You can create custom profiles by cloning existing ones:

1. Setup → Profiles → Clone
2. Modify permissions as needed
3. Assign to users

### Profile Limitations

❗ **Important**: Profiles are difficult to maintain because:
- You can only assign ONE profile per user
- Must clone to create variations
- Changes affect all users with that profile

**Modern Best Practice**: Use Permission Sets and Permission Set Groups instead!

## Permission Sets

**Permission Sets** grant ADDITIONAL permissions beyond the profile. Think of them as "add-ons" to profiles.

### Key Advantages

✅ Can assign multiple permission sets to one user
✅ Can be assigned and removed dynamically
✅ Easier to maintain than profiles
✅ Great for temporary or role-specific access

### Common Use Cases

1. **Temporary Admin Access**
   - Grant a user temporary admin rights
   - Remove when project is complete

2. **Feature-Specific Permissions**
   - "Opportunity Approver" permission set
   - "Report Builder" permission set
   - "API User" permission set

3. **Application Access**
   - Grant access to custom apps
   - Enable Apex classes and Visualforce pages

### Creating Permission Sets

```
Setup → Permission Sets → New

Name: Opportunity Manager
License: None (extends any user)

Permissions to Grant:
✓ Edit on Opportunities
✓ View All Data on Accounts
✓ Access to Opportunity Management App
```

### Permission Set Groups

**Permission Set Groups** bundle multiple permission sets together (introduced in Spring '20).

```
Permission Set Group: "Sales Manager"
├── Permission Set: "Opportunity Manager"
├── Permission Set: "Report Builder"
└── Permission Set: "Dashboard Viewer"
```

Assign the group, and users get all permissions from all included permission sets!

## Role Hierarchy

The **role hierarchy** determines record-level access based on organizational structure.

### How It Works

Users in higher roles can access records owned by users in lower roles.

```
CEO (sees everything)
├── VP Sales
│   ├── Sales Manager
│   │   └── Sales Rep
│   └── Sales Manager
│       └── Sales Rep
└── VP Service
    └── Service Manager
        └── Service Agent
```

### Key Points

- Roles are about **record access**, not permissions
- Users inherit access to records owned by subordinates
- Works with OWD of "Private" or "Public Read Only"
- Optional: "Grant Access Using Hierarchies" can be disabled per object

### Role vs Profile

❗ **Common Confusion**:
- **Role**: WHO you can see (record access)
- **Profile**: WHAT you can do (permissions)

Example:
- Sarah (Profile: Standard User, Role: Sales Rep)
  - Can create/edit opportunities (Profile)
  - Can only see her own opportunities (Role + OWD)

## Sharing Rules

**Sharing Rules** open up access to records for specific groups of users.

### Types of Sharing Rules

1. **Ownership-Based Sharing**
   - Share records owned by certain roles/users
   - Example: "Share all Accounts owned by Sales Team with Service Team"

2. **Criteria-Based Sharing**
   - Share records matching certain criteria
   - Example: "Share all Accounts in California with Western Region Team"

### Example: Ownership-Based

```
Object: Opportunity
Share opportunities owned by: Role: Sales Rep
With: Role and Subordinates: Sales Manager
Access Level: Read/Write
```

### Example: Criteria-Based

```
Object: Account
Share records matching:
  Industry equals 'Technology'
With: Public Group: Tech Account Team
Access Level: Read Only
```

### Access Levels

- **Read Only**: View records and related records
- **Read/Write**: View and edit records
- **Full Access**: View, edit, transfer, and delete (only available for Cases and Leads)

## Manual Sharing

Users can manually share individual records they own.

### How to Share a Record

1. Open the record
2. Click "Sharing" button
3. Add users or groups
4. Choose access level

### When to Use

- One-off exceptions
- Temporary collaboration
- Special access to specific records

## Public Groups

**Public Groups** are collections of users used for sharing rules and manual sharing.

### Members Can Include

- Individual users
- Roles and subordinates
- Other public groups
- Territories

### Example

```
Group Name: Western Sales Team
Members:
├── User: John Smith
├── Role: Western Region Sales Manager (and subordinates)
└── Public Group: California Reps
```

## Queues

**Queues** hold records that need to be worked on, like a shared inbox.

### Common Use Cases

- Lead assignment queues
- Case routing queues
- Opportunity assignment pools

### Example

```
Queue Name: High Priority Cases
Supported Objects: Case
Queue Members:
├── User: Sarah Johnson
├── Public Group: Tier 1 Support
└── Role: Support Manager
```

Users can view all queued records and assign them to themselves.

## Field-Level Security (FLS)

Control access to individual fields on objects.

### FLS Settings Per Field

- **Visible**: Users can see the field
- **Read-Only**: Users can see but not edit
- **Hidden**: Field is completely hidden

### Where to Set FLS

1. **From Field**: Setup → Object Manager → Field → Set Field-Level Security
2. **From Profile/Permission Set**: Edit profile/permission set → Field-Level Security

### Best Practices

- Hide sensitive fields (SSN, salary, etc.) from most users
- Make calculated fields read-only
- Use FLS instead of page layout hiding for true security

❗ **Critical**: Hiding a field on a page layout does NOT secure it! Always use FLS for security.

## Common Security Scenarios

### Scenario 1: Sales Rep Setup

```
Profile: Standard User
Role: Sales Rep
OWD: Account = Private, Opportunity = Private

Result:
- Can create/edit their own Accounts and Opportunities
- Cannot see other reps' records
- Their manager can see their records
```

### Scenario 2: Adding Report Building

```
Add Permission Set: "Report Builder"
Permissions:
✓ Create and Customize Reports
✓ Create and Customize Dashboards
✓ Manage Public Reports

Result:
- Sales rep can now build custom reports
- Still has all base profile permissions
- Can be easily removed when no longer needed
```

### Scenario 3: Regional Sharing

```
Sharing Rule: "Share Western Accounts"
Type: Criteria-Based
Criteria: Billing State equals 'CA' OR 'OR' OR 'WA'
Share with: Public Group: Western Sales Team
Access: Read/Write

Result:
- Western team members can collaborate on regional accounts
- Other regions cannot see Western accounts
- Maintains private OWD security
```

## Security Best Practices

### ✅ DO

1. **Start restrictive, then open up**
   - Use Private OWD
   - Grant access through sharing rules and permission sets

2. **Use Permission Sets over custom profiles**
   - Easier to maintain
   - More flexible
   - Can assign multiple per user

3. **Document your security model**
   - Who has access to what and why
   - Especially important for compliance

4. **Test with different user types**
   - Use "Login as" feature to test permissions
   - Create test users for each profile/role combination

5. **Use Field-Level Security for sensitive data**
   - Don't rely on page layouts
   - FLS is the only true security

### ❌ DON'T

1. **Don't use Public Read/Write OWD** unless absolutely necessary
2. **Don't grant "View All Data" or "Modify All Data" lightly** - these are powerful
3. **Don't use profiles for one-off access** - use permission sets instead
4. **Don't forget about API access** - security applies to API calls too
5. **Don't hide fields on page layouts for security** - always use FLS

## Security Testing Checklist

When implementing security:

- [ ] Verify OWD settings are appropriate for each object
- [ ] Test record access with Login As feature
- [ ] Confirm sharing rules grant correct access
- [ ] Verify field-level security on sensitive fields
- [ ] Test permission sets grant only intended permissions
- [ ] Check role hierarchy reflects org structure
- [ ] Ensure API users have minimal required permissions
- [ ] Test with multiple user personas

## Practice Exercises

### Exercise 1: Basic Security Setup

Set up security for a new custom object "Property__c":

1. OWD: Private
2. Create profile: "Property Agent" with Create, Read, Edit on Property__c
3. Create role hierarchy: Regional Manager → Property Agent
4. Test that agents only see their properties
5. Test that manager sees all agent properties

### Exercise 2: Permission Set

Create a permission set "Property Appraiser":

1. Grants: Read access to Property__c
2. Grants: Edit access to Appraisal_Value__c field only
3. No create or delete permissions
4. Assign to a test user and verify they can only update appraisal values

### Exercise 3: Sharing Rule

Create a criteria-based sharing rule:

1. Share all Property__c records where Status = "Listed"
2. With public group "Marketing Team"
3. Access: Read Only
4. Verify marketing team can see listed properties but not edit them

## Next Steps

Now that you understand security:

- **Next Topic**: Relationships and Schema Builder
- **Practice**: Set up security in your Developer Org
- **Advanced**: Learn about Territory Management and Enterprise Territory Management

## Key Takeaways

🔑 **Four layers of security**: Organization, Object, Field, Record
🔑 **OWD sets the baseline**, sharing rules open access
🔑 **Profiles control permissions**, roles control record access
🔑 **Permission sets** are more flexible than custom profiles
🔑 **Field-Level Security** is the only way to truly secure fields
🔑 **Start restrictive**, then grant access as needed
