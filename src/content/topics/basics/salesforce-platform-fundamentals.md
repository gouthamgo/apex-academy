---
title: "Salesforce Platform Fundamentals"
section: "basics"
order: 1
difficulty: "beginner"
readTime: "15 min"
description: "Understand what Salesforce is, its architecture, and why it's the world's #1 CRM platform."
overview: "Learn the foundation of Salesforce - what it is, how it works, and why companies use it. Perfect starting point for complete beginners."
concepts: ["salesforce-platform", "cloud-computing", "crm", "multi-tenant", "saas", "platform-architecture"]
prerequisites: []
relatedTopics: ["data-model-basics", "declarative-vs-programmatic"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Before diving into development, you need to understand what Salesforce is and how it works at a fundamental level.

## What is Salesforce?

**Salesforce** is a cloud-based Customer Relationship Management (CRM) platform that helps businesses manage:
- Customer data and interactions
- Sales processes and pipelines
- Marketing campaigns
- Customer service and support
- Analytics and reporting

**Key Point**: Salesforce is much more than just a CRM - it's a complete platform for building business applications.

## The Salesforce Platform

### Cloud-Based (SaaS)
- No servers to maintain
- Automatic updates (3 releases per year)
- Access from anywhere with internet
- Scalable infrastructure

### Multi-Tenant Architecture
- **Single Instance**: One codebase serves all customers
- **Logical Separation**: Your data is isolated from other customers
- **Shared Resources**: Efficient resource utilization
- **Automatic Upgrades**: Everyone gets new features simultaneously

💡 **Think of it like an apartment building**: Everyone lives in the same building (multi-tenant), but each apartment is private and secure.

---

# Understanding Salesforce Editions

## Different Editions for Different Needs

| Edition | Best For | Key Features |
|---------|----------|--------------|
| **Essentials** | Small businesses (up to 10 users) | Basic CRM, contact management |
| **Professional** | Growing businesses | Full CRM, workflow automation |
| **Enterprise** | Large organizations | Advanced customization, API access |
| **Unlimited** | Large enterprises | All features, premier support |
| **Developer** | Learning & Development | **FREE** - Full access for development |

✅ **For Learning**: Always use **Developer Edition** - it's completely free and has all features!

---

# Salesforce Products

## Core Clouds

### 1. Sales Cloud
- Lead and opportunity management
- Sales forecasting
- Account and contact management
- Sales analytics

### 2. Service Cloud
- Case management
- Knowledge base
- Live chat and chatbots
- Customer portals

### 3. Marketing Cloud
- Email marketing
- Journey builder
- Social media marketing
- Analytics

### 4. Commerce Cloud
- E-commerce platform
- Online stores
- Order management

---

# How Salesforce Works

## The Platform Approach

```
┌─────────────────────────────────────┐
│     YOUR APPLICATIONS               │
│  (Custom Apps & Configurations)     │
├─────────────────────────────────────┤
│     SALESFORCE PLATFORM             │
│  • Data Storage                     │
│  • Security                         │
│  • User Interface                   │
│  • Business Logic                   │
│  • API Access                       │
├─────────────────────────────────────┤
│     INFRASTRUCTURE                  │
│  (Servers, Databases, Network)      │
│  Managed by Salesforce              │
└─────────────────────────────────────┘
```

**You build on top** of the platform - no need to worry about infrastructure!

---

# Why Salesforce?

## Business Benefits

1. **Fast Implementation**: Build apps in days, not months
2. **No IT Overhead**: No servers, no maintenance
3. **Scalability**: Grows with your business
4. **Mobile-Ready**: Access from any device
5. **Ecosystem**: Thousands of pre-built apps on AppExchange

## Developer Benefits

1. **High Demand**: #1 CRM = lots of job opportunities
2. **Multiple Skills**: Declarative + coding options
3. **Great Community**: Trailblazer community support
4. **Continuous Learning**: New features every 4 months
5. **Good Compensation**: Salesforce developers are well-paid

---

# Getting Started

## Create Your Free Developer Account

1. Go to: https://developer.salesforce.com/signup
2. Fill out the form
3. Verify your email
4. Log in to your new org!

**Your Org = Your Salesforce Instance**

💡 **TIP**: You can create unlimited developer orgs for free!

---

# Salesforce Terminology

## Essential Terms to Know

**Org (Organization)**
- Your Salesforce instance
- Example: "I have 3 dev orgs"

**Object**
- A database table
- Example: Account, Contact, Opportunity

**Record**
- A row in a table (an instance of an object)
- Example: "Acme Corp" is an Account record

**Field**
- A column in a table (stores data)
- Example: Account Name, Email, Phone

**App**
- A collection of tabs (objects) grouped together
- Example: Sales App, Service App

**Tab**
- Navigation item that displays an object
- Example: Accounts tab, Contacts tab

---

# Navigating Salesforce

## Two Main Interfaces

### 1. Lightning Experience (Modern UI)
- Modern, fast interface
- Component-based
- Mobile-ready
- **This is what you'll use**

### 2. Salesforce Classic (Legacy UI)
- Older interface
- Still supported but deprecated
- Don't use for new work

## Key Navigation Areas

**App Launcher** (⋮⋮⋮ icon)
- Switch between apps
- Search for objects and features

**Setup** (⚙️ gear icon)
- Configure your org
- Add users
- Customize objects
- Install apps
- **This is where developers spend a lot of time**

**Global Search** (🔍 search bar)
- Find records
- Search across all objects

---

# Types of Salesforce Development

## 1. Declarative (Point-and-Click)
Build apps without code:
- Create objects and fields
- Build page layouts
- Create workflows
- Design reports
- **No coding required!**

## 2. Programmatic (Code)
Build custom functionality:
- **Apex**: Salesforce's Java-like programming language
- **Lightning Web Components (LWC)**: JavaScript framework for UI
- **Visualforce**: Older UI framework
- **SOQL**: Query language (like SQL)

**🎯 Best Approach**: Use declarative when possible, code when necessary

---

# Your Learning Path

## Recommended Progression

```
1. Salesforce Basics (You are here!)
   ↓
2. Data Model & Objects
   ↓
3. Declarative Tools (Flows, Validations)
   ↓
4. Apex Programming
   ↓
5. Lightning Web Components
   ↓
6. Integration & APIs
   ↓
7. Real-World Projects
```

---

# Common Use Cases

## What Do Companies Build on Salesforce?

### 1. Sales Management
- Track leads and opportunities
- Manage customer relationships
- Forecast revenue
- Monitor sales team performance

### 2. Customer Service
- Case management
- Knowledge base
- Live chat support
- Customer portals

### 3. Custom Applications
- Inventory management
- Project management
- Employee onboarding
- Contract management

### 4. Process Automation
- Approval workflows
- Email notifications
- Data validation
- Scheduled jobs

---

# Exam Tips

> 💡 **TIP**: Salesforce has **three major releases per year** - Spring, Summer, and Winter.

> ✅ **BEST PRACTICE**: Always use **Lightning Experience**, not Classic, for new work.

> 💀 **EXAM TRAP**: "Multi-tenant" doesn't mean multiple customers share the same data - data is always isolated!

> ⚠️ **WARNING**: Developer Edition orgs expire after 90 days of inactivity. Log in occasionally to keep them active.

> 💡 **TIP**: The **Setup menu** is your best friend - almost everything is configured there.

---

# Practice Exercises

## Exercise 1: Create Your Developer Org
**Task**: Sign up for a free Developer Edition org and log in. Explore the interface.

**Steps**:
1. Go to developer.salesforce.com/signup
2. Create your account
3. Log in to your new org
4. Click around and explore!

## Exercise 2: Explore Standard Objects
**Task**: Navigate to different standard objects and see what data they store.

**Objects to explore**:
- Accounts (companies)
- Contacts (people)
- Opportunities (sales deals)
- Leads (potential customers)

## Exercise 3: Switch Between Apps
**Task**: Use the App Launcher to switch between Sales and Service apps.

## Exercise 4: Navigate to Setup
**Task**: Find the Setup menu and explore:
- Object Manager
- Users
- Company Information

## Exercise 5: Global Search
**Task**: Use the global search to find:
- An Account record
- The Setup menu
- The App Builder

---

# Next Steps

Now that you understand what Salesforce is, you're ready to learn about:

1. **Data Model Basics** - How Salesforce stores data
2. **Objects & Fields** - Creating custom database tables
3. **Relationships** - Connecting data together
4. **Declarative Tools** - Building without code

**You've taken the first step to becoming a Salesforce Developer!** 🚀
