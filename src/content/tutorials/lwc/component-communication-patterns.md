---
title: "LWC Component Communication Patterns"
category: "lwc"
difficulty: "intermediate"
readTime: "15 min"
author: "Sarah Chen"
description: "Master Lightning Web Component communication patterns including parent-child properties, custom events, and Lightning Message Service for complex scenarios."
tags: ["lwc", "component-communication", "events", "lms", "properties"]
prerequisites: ["lwc-basics", "javascript-fundamentals", "dom-events"]
relatedTutorials: ["lwc-lifecycle", "lwc-wire-service"]
publishDate: "2025-01-15"
lastUpdated: "2025-01-15"
featured: true
---

# LWC Component Communication Patterns

Component communication is fundamental to building complex Lightning Web Component applications. This tutorial covers all the essential patterns you need to master, from simple parent-child communication to complex cross-component messaging.

## Overview of Communication Patterns

Lightning Web Components support several communication patterns:

1. **Parent to Child**: Properties and method calls
2. **Child to Parent**: Custom events
3. **Sibling Components**: Lightning Message Service (LMS)
4. **Cross-DOM Communication**: Lightning Message Service
5. **Component to Application**: Application events

> 💡 **TIP**: Choose the simplest pattern that meets your needs. Don't use LMS when a simple property or event will do.

## Pattern 1: Parent to Child Communication

### Using Properties

The most straightforward way to pass data from parent to child is through properties.

**Child Component (productCard.js):**

```javascript
import { LightningElement, api } from 'lwc';

export default class ProductCard extends LightningElement {
    // @api makes this property public
    // ^^^^
    // PUBLIC PROPERTY = Parent can SET this value
    // → REQUIRED for parent-to-child data flow
    @api product;

    @api isSelected = false;
    // ^^^^^^^^^^^^^^^^^^
    // DEFAULT VALUE = What happens if parent doesn't set it
    // 💡 BEST PRACTICE: Always provide sensible defaults

    @api maxPrice;
    // ^^^^^^^^^^
    // REACTIVE PROPERTY = Component rerenders when this changes
    // → Automatically triggers getter/setter if defined

    // Computed property based on @api properties
    get isDiscounted() {
        // ^^^^^^^^^^^^^^^^
        // COMPUTED PROPERTY = Calculated from other properties
        // → Automatically recalculates when dependencies change
        return this.product && this.product.originalPrice > this.product.currentPrice;
    }

    get displayPrice() {
        if (!this.product) return 'N/A';

        // 💡 BEST PRACTICE: Handle null/undefined gracefully
        return this.product.currentPrice ?
            `$${this.product.currentPrice.toFixed(2)}` :
            'Price not available';
    }

    // Property setter for validation
    @api
    get selectedQuantity() {
        return this._selectedQuantity || 1;
    }

    set selectedQuantity(value) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SETTER VALIDATION = Ensure data integrity
        // → Called whenever parent sets this property
        const numValue = parseInt(value, 10);
        this._selectedQuantity = numValue > 0 ? numValue : 1;

        // 💀 EXAM TRAP: Setters don't automatically trigger rerenders
        // You may need to call this.dispatchEvent() for reactive updates
    }
}
```

**Child Component Template (productCard.html):**

```html
<template>
    <div class="product-card" data-id={product.id}>
        <!-- 💡 CONDITIONAL RENDERING: Only show if product exists -->
        <template if:true={product}>
            <div class="product-image">
                <img src={product.imageUrl} alt={product.name} />
            </div>

            <div class="product-details">
                <h3 class="product-name">{product.name}</h3>

                <!-- 💡 COMPUTED PROPERTIES: Use getters for dynamic values -->
                <p class="product-price">{displayPrice}</p>

                <!-- 💡 CONDITIONAL CLASSES: Dynamic styling based on state -->
                <div class={productCardClass}>
                    <template if:true={isDiscounted}>
                        <span class="discount-badge">Sale!</span>
                    </template>

                    <template if:true={isSelected}>
                        <span class="selected-indicator">✓ Selected</span>
                    </template>
                </div>
            </div>
        </template>

        <!-- 💡 ERROR STATE: Always handle missing data -->
        <template if:false={product}>
            <div class="error-state">
                <p>Product information not available</p>
            </div>
        </template>
    </div>
</template>
```

**Parent Component (productList.js):**

```javascript
import { LightningElement, track } from 'lwc';

export default class ProductList extends LightningElement {
    @track products = [
        // 💡 SAMPLE DATA: Real applications would fetch from server
        {
            id: '1',
            name: 'Laptop',
            currentPrice: 999.99,
            originalPrice: 1299.99,
            imageUrl: '/images/laptop.jpg'
        },
        {
            id: '2',
            name: 'Phone',
            currentPrice: 799.99,
            originalPrice: 799.99,
            imageUrl: '/images/phone.jpg'
        }
    ];

    @track selectedProductId = '1';
    // ^^^^^^^^^^^^^^^^^^^^^^
    // TRACKED PROPERTY = Component rerenders when this changes
    // → Use @track for objects/arrays that change internally

    maxBudget = 1000;
    // ^^^^^^^^^^^^^^^^
    // SIMPLE PROPERTY = Passed to child as-is
    // → No @track needed for primitive values that don't change

    // Method that could be called by parent
    @api
    refreshProducts() {
        // ^^^^^^^^^^^^^^^^^
        // PUBLIC METHOD = Parent can call this method
        // → Use @api to expose methods to parent components
        // ⚠️  EXAM TRAP: Only @api methods are accessible to parents

        // Refresh logic here
        this.loadProducts();
    }

    loadProducts() {
        // ^^^^^^^^^^^^^^^
        // PRIVATE METHOD = Only this component can call
        // → Don't use @api for internal methods

        // Implementation would fetch fresh data
        console.log('Loading products...');
    }
}
```

**Parent Component Template (productList.html):**

```html
<template>
    <div class="product-list">
        <h2>Available Products</h2>

        <!-- 💡 ITERATION: Loop through products array -->
        <template for:each={products} for:item="product">
            <!--
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                 FOR:EACH LOOP = Iterate over array
                 → MUST include key attribute for performance
                 💀 EXAM TRAP: Missing key causes render issues
            -->
            <c-product-card
                key={product.id}
                product={product}
                is-selected={isProductSelected}
                max-price={maxBudget}
                selected-quantity="1">
                <!--
                     ^^^^^^^^^^^^^^^^^^
                     PROPERTY BINDING = Pass data to child
                     → kebab-case in template = camelCase in JavaScript
                     💡 WHY? HTML attributes are case-insensitive
                -->
            </c-product-card>
        </template>
    </div>
</template>
```

### Using Method Calls

Parents can also call child methods directly:

```javascript
// Parent component
export default class ProductManager extends LightningElement {

    handleRefreshClick() {
        // Get reference to child component
        const productCard = this.template.querySelector('c-product-card');

        if (productCard) {
            // Call child's public method
            productCard.refreshData();
            // ^^^^^^^^^^^^^^^^^^^^
            // METHOD CALL = Direct invocation of child method
            // → Only works with @api methods
            // ⚠️  EXAM TRAP: Non-@api methods are not accessible
        }
    }
}
```

## Pattern 2: Child to Parent Communication

### Using Custom Events

Custom events are the standard way for children to communicate with parents:

**Child Component (productCard.js):**

```javascript
import { LightningElement, api } from 'lwc';

export default class ProductCard extends LightningElement {
    @api product;

    handleAddToCart() {
        // Create custom event with data
        const addToCartEvent = new CustomEvent('addtocart', {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // CUSTOM EVENT = Child-to-parent communication
            // → Event name should be descriptive and lowercase

            detail: {
                // ^^^^^^^^
                // EVENT DETAIL = Data payload for parent
                // → All event data goes in the detail object
                productId: this.product.id,
                productName: this.product.name,
                quantity: this.selectedQuantity,
                timestamp: new Date().toISOString()
            },

            bubbles: true,
            // ^^^^^^^^^^^^^
            // BUBBLES = Event travels up the DOM tree
            // → Usually set to true for parent communication
            // 💡 WHY? Allows parent containers to catch the event

            composed: false
            // ^^^^^^^^^^^^^^
            // COMPOSED = Event crosses shadow DOM boundaries
            // → Usually false for component-to-component communication
            // ⚠️  EXAM TRAP: Setting composed=true can cause unwanted behavior
        });

        // Dispatch the event
        this.dispatchEvent(addToCartEvent);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DISPATCH EVENT = Send event to parent
        // → Parent must have matching event listener
    }

    handleQuantityChange(event) {
        const newQuantity = event.target.value;
        this.selectedQuantity = newQuantity;

        // Notify parent of quantity change
        this.dispatchEvent(new CustomEvent('quantitychange', {
            detail: {
                productId: this.product.id,
                newQuantity: parseInt(newQuantity, 10),
                oldQuantity: this.previousQuantity
            }
        }));

        this.previousQuantity = newQuantity;
    }

    handleProductSelect() {
        // Simple event without data
        this.dispatchEvent(new CustomEvent('productselect', {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // SIMPLE EVENT = No detail needed
            // → Sometimes you just need to notify parent of action

            detail: { productId: this.product.id }
        }));
    }
}
```

**Child Component Template (productCard.html):**

```html
<template>
    <div class="product-card">
        <div class="product-info">
            <h3>{product.name}</h3>
            <p>{product.price}</p>
        </div>

        <div class="product-actions">
            <!-- 💡 EVENT HANDLERS: Wire UI events to component methods -->
            <input
                type="number"
                value={selectedQuantity}
                onchange={handleQuantityChange}
                min="1" />
                <!--
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                     EVENT BINDING = Connect DOM events to component methods
                     → onchange, onclick, etc. map to handle* methods
                -->

            <button
                onclick={handleAddToCart}
                class="add-to-cart-btn">
                Add to Cart
            </button>

            <button
                onclick={handleProductSelect}
                class={selectButtonClass}>
                {selectButtonLabel}
            </button>
        </div>
    </div>
</template>
```

**Parent Component (productList.js):**

```javascript
import { LightningElement, track } from 'lwc';

export default class ProductList extends LightningElement {
    @track cartItems = [];
    @track selectedProducts = new Set();

    handleAddToCart(event) {
        // ^^^^^^^^^^^^^^^^^^^^^
        // EVENT HANDLER = Responds to child component events
        // → Method name should match the event type

        const productDetails = event.detail;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // EVENT DETAIL = Extract data from child event
        // → All event data is in the detail property

        console.log('Adding to cart:', productDetails);

        // Add to cart logic
        const cartItem = {
            id: productDetails.productId,
            name: productDetails.productName,
            quantity: productDetails.quantity,
            addedAt: productDetails.timestamp
        };

        this.cartItems = [...this.cartItems, cartItem];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // IMMUTABLE UPDATE = Create new array for reactivity
        // → @track requires new object reference to detect changes
        // 💀 EXAM TRAP: Mutating arrays directly won't trigger rerenders

        // Dispatch event to grandparent if needed
        this.dispatchEvent(new CustomEvent('cartupdate', {
            detail: {
                cartItems: this.cartItems,
                action: 'add'
            }
        }));
    }

    handleQuantityChange(event) {
        const { productId, newQuantity } = event.detail;

        // Update existing cart item
        this.cartItems = this.cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // FUNCTIONAL UPDATE = Pure function approach
        // → Creates new array with updated item
        // 💡 BEST PRACTICE: Prefer immutable updates for clarity
    }

    handleProductSelect(event) {
        const productId = event.detail.productId;

        // Toggle selection
        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.add(productId);
        }

        // Force reactivity for Set changes
        this.selectedProducts = new Set(this.selectedProducts);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // SET REACTIVITY = Create new Set to trigger rerenders
        // → @track doesn't detect changes inside Set/Map objects
        // 💀 EXAM TRAP: Mutating Set/Map without reassignment won't rerender
    }
}
```

**Parent Component Template (productList.html):**

```html
<template>
    <div class="product-list">
        <div class="cart-summary">
            <h3>Cart ({cartItems.length} items)</h3>
        </div>

        <div class="products">
            <template for:each={products} for:item="product">
                <c-product-card
                    key={product.id}
                    product={product}
                    onaddtocart={handleAddToCart}
                    onquantitychange={handleQuantityChange}
                    onproductselect={handleProductSelect}>
                    <!--
                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                         EVENT LISTENERS = Handle child component events
                         → on + eventname = handler method
                         💡 Event names are case-sensitive in JavaScript
                    -->
                </c-product-card>
            </template>
        </div>
    </div>
</template>
```

## Pattern 3: Lightning Message Service (LMS)

For sibling or cross-DOM communication, use Lightning Message Service:

**Message Channel (productEvents.messageChannel-meta.xml):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningMessageChannel xmlns="http://soap.sforce.com/2006/04/metadata">
    <masterLabel>Product Events</masterLabel>
    <isExposed>true</isExposed>
    <description>Channel for product-related events across components</description>
    <lightningMessageFields>
        <fieldName>action</fieldName>
        <description>The action being performed</description>
    </lightningMessageFields>
    <lightningMessageFields>
        <fieldName>productId</fieldName>
        <description>ID of the product</description>
    </lightningMessageFields>
    <lightningMessageFields>
        <fieldName>productData</fieldName>
        <description>Additional product data</description>
    </lightningMessageFields>
</LightningMessageChannel>
```

**Publisher Component (productActions.js):**

```javascript
import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_EVENTS_CHANNEL from '@salesforce/messageChannel/ProductEvents__c';

export default class ProductActions extends LightningElement {

    @wire(MessageContext)
    messageContext;
    // ^^^^^^^^^^^^^^^
    // MESSAGE CONTEXT = Required for LMS operations
    // → Wire this to get the messaging context
    // 💀 EXAM TRAP: Forgetting @wire(MessageContext) breaks LMS

    handleProductUpdate(event) {
        const productId = event.target.dataset.productId;

        // Publish message to all subscribers
        const message = {
            // ^^^^^^^^^^^^^^^
            // MESSAGE PAYLOAD = Data sent to all subscribers
            // → Structure must match messageChannel definition
            action: 'update',
            productId: productId,
            productData: {
                timestamp: new Date().toISOString(),
                updatedBy: 'ProductActions'
            }
        };

        publish(this.messageContext, PRODUCT_EVENTS_CHANNEL, message);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // PUBLISH = Send message to all subscribers
        // → Requires: messageContext, channel, message payload
        // 💡 BEST PRACTICE: Always check messageContext exists

        if (this.messageContext) {
            publish(this.messageContext, PRODUCT_EVENTS_CHANNEL, message);
        } else {
            console.error('Message context not available');
        }
    }

    handleProductDelete(event) {
        const productId = event.target.dataset.productId;

        publish(this.messageContext, PRODUCT_EVENTS_CHANNEL, {
            action: 'delete',
            productId: productId,
            productData: { deletedAt: new Date() }
        });
    }
}
```

**Subscriber Component (productNotifications.js):**

```javascript
import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_EVENTS_CHANNEL from '@salesforce/messageChannel/ProductEvents__c';

export default class ProductNotifications extends LightningElement {
    subscription = null;
    notifications = [];

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        // ^^^^^^^^^^^^^^^^^
        // LIFECYCLE HOOK = Component is inserted into DOM
        // → Perfect place to set up subscriptions
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        // ^^^^^^^^^^^^^^^^^^^^
        // LIFECYCLE HOOK = Component is removed from DOM
        // → CRITICAL: Unsubscribe to prevent memory leaks
        this.unsubscribeFromMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                PRODUCT_EVENTS_CHANNEL,
                this.handleProductEvent.bind(this)
            );
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // SUBSCRIBE = Listen for messages on channel
            // → Returns subscription object for later unsubscribe
            // 💀 EXAM TRAP: Forgetting .bind(this) loses component context
        }
    }

    unsubscribeFromMessageChannel() {
        if (this.subscription) {
            unsubscribe(this.subscription);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // UNSUBSCRIBE = Stop listening and free memory
            // → CRITICAL for preventing memory leaks
            this.subscription = null;
        }
    }

    handleProductEvent(message) {
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^
        // MESSAGE HANDLER = Process received messages
        // → Receives the full message payload

        console.log('Received product event:', message);

        const notification = {
            id: Date.now(),
            message: `Product ${message.action}: ${message.productId}`,
            timestamp: new Date().toLocaleTimeString(),
            type: message.action
        };

        // Add notification to list
        this.notifications = [notification, ...this.notifications];
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // IMMUTABLE UPDATE = Add to front of array
        // → Creates new array for reactivity

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 5000);
    }

    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(
            notif => notif.id !== notificationId
        );
    }
}
```

## Anti-Patterns to Avoid

> ⚠️ **WARNING**: These patterns are commonly misused and cause bugs!

### ❌ Don't: Use DOM Manipulation for Communication

```javascript
// BAD - Direct DOM manipulation
handleClick() {
    const siblingComponent = document.querySelector('c-sibling');
    siblingComponent.someProperty = 'new value'; // Fragile and unreliable
}

// GOOD - Use LMS or events
handleClick() {
    publish(this.messageContext, CHANNEL, { newValue: 'new value' });
}
```

### ❌ Don't: Mutate Props in Child Components

```javascript
// BAD - Mutating parent data
@api product;

handleUpdate() {
    this.product.name = 'Updated Name'; // Violates data flow principles
}

// GOOD - Dispatch event to parent
handleUpdate() {
    this.dispatchEvent(new CustomEvent('updateproduct', {
        detail: { id: this.product.id, newName: 'Updated Name' }
    }));
}
```

### ❌ Don't: Create Memory Leaks with LMS

```javascript
// BAD - No cleanup
connectedCallback() {
    subscribe(this.messageContext, CHANNEL, this.handler);
    // Missing unsubscribe = memory leak
}

// GOOD - Proper cleanup
connectedCallback() {
    this.subscription = subscribe(this.messageContext, CHANNEL, this.handler);
}

disconnectedCallback() {
    if (this.subscription) {
        unsubscribe(this.subscription);
    }
}
```

## Summary

Choose the right communication pattern based on your needs:

- **Parent → Child**: Use `@api` properties and method calls
- **Child → Parent**: Use custom events with `dispatchEvent`
- **Sibling/Cross-DOM**: Use Lightning Message Service
- **Complex Scenarios**: Combine patterns as needed

Remember to always clean up subscriptions and handle edge cases gracefully!