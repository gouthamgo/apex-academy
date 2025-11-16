---
title: "Lightning Web Components Interview Questions"
section: "interview"
order: 3
difficulty: "intermediate"
readTime: "30 min"
description: "Master LWC interview questions covering component lifecycle, data binding, events, decorators, and best practices."
overview: "Comprehensive LWC interview preparation covering component fundamentals, decorators, data binding, event handling, Lightning Data Service, wire service, and integration with Apex."
concepts: ["LWC Fundamentals", "Decorators", "Data Binding", "Events", "Wire Service", "LDS", "Apex Integration"]
prerequisites: ["salesforce-basics-interview-questions", "apex-interview-questions"]
relatedTopics: ["integration-interview-questions"]
lastUpdated: "2024-01-15"
examWeight: "high"
---

# Lightning Web Components Interview Questions

Comprehensive questions for LWC developers covering fundamentals to advanced topics.

## LWC Fundamentals

### Q1: What are Lightning Web Components and why use them?

**Answer:**
**Lightning Web Components (LWC)** is a modern JavaScript framework built on web standards for building UI components in Salesforce.

**Key Characteristics:**
- Built on **web standards** (ES6+, Custom Elements, Shadow DOM)
- **Performance**: Faster than Aura components
- **Modern JavaScript**: Uses latest ECMAScript features
- **Small footprint**: Minimal framework overhead
- **Reusable**: Can run on Salesforce Platform and Experience Cloud

**Why use LWC over Aura:**
- Better performance (faster rendering, smaller payload)
- Modern syntax (no proprietary syntax)
- Easier to learn (standard JavaScript)
- Better tooling support (VS Code, npm, Jest)
- Future-proof (Salesforce's strategic direction)

**Interview Tip**: Mention that LWC coexists with Aura but is preferred for new development.

---

### Q2: Explain the LWC component structure

**Answer:**
Every LWC component has **3 files** (minimum):

**1. JavaScript (.js)**
```javascript
// helloWorld.js
import { LightningElement } from 'lwc';

export default class HelloWorld extends LightningElement {
    greeting = 'World';
}
```

**2. HTML Template (.html)**
```html
<!-- helloWorld.html -->
<template>
    <div>Hello, {greeting}!</div>
</template>
```

**3. Metadata (.js-meta.xml)**
```xml
<!-- helloWorld.js-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

**Optional Files:**
- **CSS (.css)**: Component styling
- **SVG (.svg)**: Custom icon
- **Test (.test.js)**: Jest tests

**Naming Convention**: camelCase for file name, PascalCase for class name

---

### Q3: What are the component lifecycle hooks?

**Answer:**
LWC lifecycle hooks execute in this order:

**1. constructor()**
- Called when component instance is created
- Cannot access element attributes
- Use for: Initialize component state

```javascript
constructor() {
    super(); // Must call super() first
    this.records = [];
}
```

**2. connectedCallback()**
- Component inserted into DOM
- Can access element attributes
- Use for: Fetch data, wire services, event listeners

```javascript
connectedCallback() {
    this.loadRecords();
}
```

**3. renderedCallback()**
- After component renders or re-renders
- Can access rendered DOM
- Use for: Third-party library integration, DOM manipulation

```javascript
renderedCallback() {
    if (!this.chartInitialized) {
        this.initializeChart();
        this.chartInitialized = true;
    }
}
```

**4. disconnectedCallback()**
- Component removed from DOM
- Use for: Cleanup (remove event listeners, cancel pending operations)

```javascript
disconnectedCallback() {
    clearInterval(this.intervalId);
}
```

**5. errorCallback(error, stack)**
- Catches errors in child components
- Use for: Error handling and logging

```javascript
errorCallback(error, stack) {
    console.error('Error:', error);
}
```

**Interview Tip**: Mention you avoid heavy operations in renderedCallback (can run multiple times).

---

## Decorators

### Q4: Explain @api, @track, and @wire decorators

**Answer:**

**@api - Public Properties**
```javascript
import { api } from 'lwc';

export default class MyComponent extends LightningElement {
    @api recordId; // Public property, set from parent
    @api title;

    @api
    refresh() { // Public method
        this.loadData();
    }
}
```
- Makes property/method **public** (accessible from parent)
- Used for component inputs
- Reactive: Changes cause re-render

**@track - Private Reactive Properties** (Less common now)
```javascript
import { track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track account = { Name: '', Industry: '' };

    updateName() {
        this.account.Name = 'ACME'; // Re-renders
    }
}
```
- Makes object properties reactive
- **Not needed** for primitive types (auto-reactive)
- Only needed for object/array mutation tracking

**@wire - Wire Service**
```javascript
import { wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class MyComponent extends LightningElement {
    @wire(getAccounts)
    accounts;
}
```
- Connects to Salesforce data
- Auto-refreshes
- Supports Apex, Lightning Data Service (LDS), UI API

**When to use:**
- **@api**: Input from parent, public methods
- **@track**: Object/array property changes (rare)
- **@wire**: Fetch Salesforce data reactively

---

### Q5: @wire with property vs function - what's the difference?

**Answer:**

**Wire to Property:**
```javascript
@wire(getAccounts)
accounts; // {data, error}

get accountList() {
    return this.accounts.data || [];
}
```
- Simplest form
- Access via `this.accounts.data` and `this.accounts.error`
- Good for: Display-only data

**Wire to Function:**
```javascript
@wire(getAccounts)
wiredAccounts({ data, error }) {
    if (data) {
        this.accounts = data;
        this.processAccounts(); // Additional logic
    } else if (error) {
        this.handleError(error);
    }
}
```
- More control
- Can transform data, handle errors
- Good for: Complex processing

**Dynamic Parameters:**
```javascript
@api recordId;

@wire(getRecord, { recordId: '$recordId', fields: FIELDS })
record;
```
- Use `$` to make parameter reactive
- Auto-refreshes when `recordId` changes

---

## Data Binding

### Q6: Explain one-way vs two-way data binding

**Answer:**

**One-Way Binding (Default):**
```html
<!-- Parent to child only -->
<template>
    <c-child-component message={greeting}></c-child-component>
</template>
```
- Data flows **parent → child**
- Child cannot modify parent's data
- Most common pattern

**Two-Way Binding (Rare):**
```html
<!-- Not native in LWC - must implement manually -->
<template>
    <lightning-input value={name} onchange={handleChange}></lightning-input>
</template>
```
```javascript
handleChange(event) {
    this.name = event.target.value; // Update local state
    // Dispatch event to parent if needed
}
```

**Best Practice**: LWC favors **unidirectional data flow** (one-way). Use events to communicate child → parent.

---

### Q7: How do you pass data from child to parent?

**Answer:**
Use **Custom Events**:

**Child Component:**
```javascript
// childComponent.js
import { LightningElement } from 'lwc';

export default class ChildComponent extends LightningElement {
    handleClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: { recordId: '001xxx', name: 'ACME Corp' }
        });
        this.dispatchEvent(selectedEvent);
    }
}
```

**Parent Component:**
```html
<!-- parentComponent.html -->
<template>
    <c-child-component onselected={handleSelection}></c-child-component>
</template>
```

```javascript
// parentComponent.js
handleSelection(event) {
    const { recordId, name } = event.detail;
    console.log('Selected:', recordId, name);
}
```

**Key Points:**
- Event name in child: `'selected'`
- Event handler in parent: `onselected` (lowercase, prefix `on`)
- Pass data via `detail` property
- Events bubble by default in same shadow tree

---

## Lightning Data Service (LDS)

### Q8: What is Lightning Data Service and its benefits?

**Answer:**
**Lightning Data Service (LDS)** is a data layer that manages Salesforce records in LWC.

**Benefits:**
- **Caching**: Single source of truth, reduces server calls
- **Auto-refresh**: UI updates when data changes
- **Offline support**: Works with offline data
- **No Apex needed**: Direct access to records
- **Respect sharing**: Honors user permissions automatically

**LDS Methods:**

**1. lightning-record-form** (Easiest)
```html
<lightning-record-form
    record-id={recordId}
    object-api-name="Account"
    fields={fields}
    mode="view">
</lightning-record-form>
```

**2. lightning-record-view-form** (Custom layout)
```html
<lightning-record-view-form record-id={recordId} object-api-name="Account">
    <lightning-output-field field-name="Name"></lightning-output-field>
    <lightning-output-field field-name="Industry"></lightning-output-field>
</lightning-record-view-form>
```

**3. lightning-record-edit-form** (Edit mode)
```html
<lightning-record-edit-form record-id={recordId} object-api-name="Account">
    <lightning-input-field field-name="Name"></lightning-input-field>
    <lightning-button type="submit" label="Save"></lightning-button>
</lightning-record-edit-form>
```

**4. getRecord (Wire Adapter)** (Programmatic)
```javascript
import { getRecord } from 'lightning/uiRecordApi';

@wire(getRecord, { recordId: '$recordId', fields: FIELDS })
account;
```

---

### Q9: getRecord vs Apex - when to use each?

**Answer:**

| Use Case | getRecord (LDS) | Apex |
|----------|-----------------|------|
| **Simple record fetch** | ✅ Preferred | ❌ Overkill |
| **Complex SOQL** | ❌ Limited | ✅ Use Apex |
| **Multiple objects** | ❌ One at a time | ✅ Use Apex |
| **Caching needed** | ✅ Auto-cached | ❌ Manual |
| **Custom logic** | ❌ Display only | ✅ Use Apex |
| **Security** | ✅ Auto-respects | ✅ with sharing |

**Example - Use getRecord:**
```javascript
// Simple: Get one Account record
@wire(getRecord, { recordId: '$recordId', fields: ['Account.Name', 'Account.Industry'] })
account;
```

**Example - Use Apex:**
```javascript
// Complex: Get Account with related Contacts and Opportunities
@wire(getAccountWithRelated, { accountId: '$recordId' })
accountData;
```

**Best Practice**: Start with LDS, use Apex when LDS limitations are reached.

---

## Communication Patterns

### Q10: How do unrelated components communicate?

**Answer:**
Use **Lightning Message Service (LMS)** or **Application Events** (pubsub).

**Lightning Message Service (Modern Approach):**

**1. Create Message Channel** (messageChannel.messageChannel-meta.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningMessageChannel xmlns="http://soap.sforce.com/2006/04/metadata">
    <masterLabel>Account Selected</masterLabel>
    <isExposed>true</isExposed>
    <description>Message when account is selected</description>
    <lightningMessageFields>
        <fieldName>recordId</fieldName>
        <description>Account Id</description>
    </lightningMessageFields>
</LightningMessageChannel>
```

**2. Publisher Component:**
```javascript
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/AccountSelected__c';

export default class Publisher extends LightningElement {
    @wire(MessageContext)
    messageContext;

    handleSelect() {
        publish(this.messageContext, ACCOUNT_CHANNEL, {
            recordId: '001xxx'
        });
    }
}
```

**3. Subscriber Component:**
```javascript
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/AccountSelected__c';

export default class Subscriber extends LightningElement {
    @wire(MessageContext)
    messageContext;

    subscription = null;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNT_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        console.log('Received:', message.recordId);
    }
}
```

**When to use LMS:**
- Components in different DOM trees
- Experience Cloud pages
- Components that don't know about each other

---

## Apex Integration

### Q11: How do you call Apex from LWC?

**Answer:**

**Imperative Apex Call:**
```javascript
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class MyComponent extends LightningElement {
    accounts;
    error;

    connectedCallback() {
        this.loadAccounts();
    }

    loadAccounts() {
        getAccounts()
            .then(result => {
                this.accounts = result;
            })
            .catch(error => {
                this.error = error;
            });
    }
}
```

**Wire Service:**
```javascript
@wire(getAccounts)
wiredAccounts({ data, error }) {
    if (data) {
        this.accounts = data;
    } else if (error) {
        this.error = error;
    }
}
```

**With Parameters:**
```javascript
@wire(getAccountById, { accountId: '$recordId' })
account;
```

**Apex Method Requirements:**
```apex
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 10];
    }

    @AuraEnabled
    public static void updateAccount(Id accountId, String name) {
        Account acc = new Account(Id = accountId, Name = name);
        update acc;
    }
}
```

**Key Points:**
- `@AuraEnabled` required
- `cacheable=true` for @wire (read-only methods)
- No `cacheable` for DML methods
- `with sharing` for security

---

## Error Handling & Best Practices

### Q12: How do you handle errors in LWC?

**Answer:**

**Apex Error Handling:**
```javascript
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

loadAccounts() {
    getAccounts()
        .then(result => {
            this.accounts = result;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.accounts = undefined;
            this.showToast('Error', this.getErrorMessage(error), 'error');
        });
}

getErrorMessage(error) {
    if (error.body) {
        if (Array.isArray(error.body)) {
            return error.body.map(e => e.message).join(', ');
        } else if (error.body.message) {
            return error.body.message;
        }
    }
    return error.message || 'Unknown error';
}

showToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
}
```

**Wire Error Handling:**
```javascript
@wire(getAccounts)
wiredAccounts({ data, error }) {
    if (data) {
        this.accounts = data;
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.accounts = undefined;
        console.error('Error:', JSON.stringify(error));
    }
}
```

---

## Advanced Topics

### Q13: What is Shadow DOM and why does it matter?

**Answer:**
**Shadow DOM** encapsulates component's DOM and CSS from the rest of the page.

**Benefits:**
- **CSS isolation**: Component styles don't leak out
- **DOM encapsulation**: External JS can't access internal DOM
- **Naming conflicts avoided**: IDs/classes are scoped

**Accessing Child Elements:**
```javascript
// ❌ Won't work (Shadow DOM boundary)
document.querySelector('.my-class');

// ✅ Works (within component)
this.template.querySelector('.my-class');
```

**Parent Accessing Child:**
```javascript
// Parent can't directly access child's DOM
// Must use @api methods

// Child component
@api
focus() {
    this.template.querySelector('input').focus();
}

// Parent component
this.template.querySelector('c-child').focus();
```

**CSS Considerations:**
```css
/* Only affects this component */
.my-class {
    color: blue;
}

/* To style slotted content */
::slotted(*) {
    margin: 10px;
}
```

---

### Q14: Explain slots in LWC

**Answer:**
**Slots** allow parent components to pass content into child components.

**Named Slots:**

**Child Component:**
```html
<!-- childComponent.html -->
<template>
    <div class="header">
        <slot name="header"></slot>
    </div>
    <div class="content">
        <slot></slot> <!-- Default slot -->
    </div>
    <div class="footer">
        <slot name="footer"></slot>
    </div>
</template>
```

**Parent Component:**
```html
<!-- parentComponent.html -->
<template>
    <c-child-component>
        <h1 slot="header">Title Here</h1>
        <p>Main content (default slot)</p>
        <div slot="footer">Footer content</div>
    </c-child-component>
</template>
```

**Use Cases:**
- Reusable card components
- Custom modals
- Flexible layouts

---

### Q15: How do you optimize LWC performance?

**Answer:**

**1. Use @wire for Caching**
```javascript
// ✅ Good: Cached, auto-refreshes
@wire(getRecord, { recordId: '$recordId', fields: FIELDS })
record;

// ❌ Bad: New server call every time
connectedCallback() {
    getRecord({ recordId: this.recordId, fields: FIELDS })
        .then(result => this.record = result);
}
```

**2. Avoid Expensive Operations in renderedCallback**
```javascript
// ❌ Bad: Runs on every render
renderedCallback() {
    this.expensiveCalculation();
}

// ✅ Good: Run once with flag
renderedCallback() {
    if (!this.isInitialized) {
        this.expensiveCalculation();
        this.isInitialized = true;
    }
}
```

**3. Use for:each Instead of iterator**
```html
<!-- ✅ Good: Faster -->
<template for:each={records} for:item="record">
    <div key={record.Id}>{record.Name}</div>
</template>

<!-- ❌ Slower (but more flexible) -->
<template iterator:it={records}>
    <div key={it.value.Id}>{it.value.Name}</div>
</template>
```

**4. Lazy Load Data**
```javascript
// Load only when needed
handleTabChange(event) {
    if (event.target.value === 'contacts' && !this.contactsLoaded) {
        this.loadContacts();
    }
}
```

**5. Use Lightning Base Components**
```html
<!-- ✅ Good: Optimized, accessible -->
<lightning-datatable
    data={records}
    columns={columns}>
</lightning-datatable>

<!-- ❌ Bad: Build from scratch -->
<table>...</table>
```

---

## Testing

### Q16: How do you test LWC components?

**Answer:**
Use **Jest** (JavaScript testing framework):

**Basic Test:**
```javascript
// helloWorld.test.js
import { createElement } from 'lwc';
import HelloWorld from 'c/helloWorld';

describe('c-hello-world', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays greeting', () => {
        const element = createElement('c-hello-world', {
            is: HelloWorld
        });
        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector('div');
        expect(div.textContent).toBe('Hello, World!');
    });
});
```

**Testing User Interaction:**
```javascript
it('updates on button click', () => {
    const element = createElement('c-hello-world', {
        is: HelloWorld
    });
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector('button');
    button.click();

    return Promise.resolve().then(() => {
        const div = element.shadowRoot.querySelector('div');
        expect(div.textContent).toBe('Clicked!');
    });
});
```

**Mocking Apex:**
```javascript
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

jest.mock('@salesforce/apex/AccountController.getAccounts', () => ({
    default: jest.fn()
}), { virtual: true });

it('displays accounts from Apex', async () => {
    getAccounts.mockResolvedValue([
        { Id: '001', Name: 'ACME' }
    ]);

    const element = createElement('c-account-list', {
        is: AccountList
    });
    document.body.appendChild(element);

    await Promise.resolve(); // Wait for async

    const items = element.shadowRoot.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('ACME');
});
```

---

## Common Scenarios

### Q17: How do you refresh data in LWC?

**Answer:**

**1. RefreshApex (for @wire):**
```javascript
import { refreshApex } from '@salesforce/apex';

export default class MyComponent extends LightningElement {
    wiredAccountsResult;

    @wire(getAccounts)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
    }

    refresh() {
        refreshApex(this.wiredAccountsResult);
    }
}
```

**2. Call Method Again (imperative):**
```javascript
refresh() {
    this.loadAccounts(); // Call same method again
}
```

**3. getRecordNotifyChange (for LDS):**
```javascript
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

handleUpdate() {
    // After updating record
    getRecordNotifyChange([{recordId: this.recordId}]);
}
```

---

### Q18: How do you navigate in LWC?

**Answer:**
Use **lightning/navigation**:

```javascript
import { NavigationMixin } from 'lightning/navigation';

export default class MyComponent extends NavigationMixin(LightningElement) {

    // Navigate to record page
    navigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '001xxx',
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }

    // Navigate to object home
    navigateToObjectHome() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            }
        });
    }

    // Navigate to custom tab
    navigateToTab() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Custom_Tab'
            }
        });
    }

    // Navigate to URL
    navigateToURL() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://www.salesforce.com'
            }
        });
    }
}
```

---

## Interview Tips

### ✅ DO:
- **Explain component lifecycle** clearly
- **Know decorator differences** (@api, @wire, @track)
- **Understand Shadow DOM** implications
- **Show error handling** in examples
- **Mention performance** considerations

### ❌ DON'T:
- Don't say "LWC is just like React" (it's web standards)
- Don't forget `super()` in constructor
- Don't use @track for primitives (unnecessary)
- Don't access child DOM directly from parent
- Don't ignore error handling

---

## Practice Checklist

- [ ] Can create a basic LWC component
- [ ] Understand all lifecycle hooks
- [ ] Know @api, @wire, @track usage
- [ ] Can call Apex imperatively and with @wire
- [ ] Understand parent-child communication
- [ ] Know how to use LDS (lightning-record-form, getRecord)
- [ ] Can handle errors properly
- [ ] Understand slots and composition
- [ ] Know navigation patterns
- [ ] Can write basic Jest tests

**Next**: Practice building components and explaining your design decisions! 🚀
