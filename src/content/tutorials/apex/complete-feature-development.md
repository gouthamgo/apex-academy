---
title: "Building a Complete Feature: Quote Approval System"
category: "apex"
difficulty: "advanced"
readTime: "60 min"
description: "Build a complete, production-ready Quote Approval System from scratch, connecting Apex, LWC, triggers, async processing, and external integrations."
overview: "Learn end-to-end Salesforce development by building a real-world feature with business logic, UI components, automation, testing, and integration."
tags: ["end-to-end", "apex", "lwc", "triggers", "integration", "testing", "real-world"]
author: "Apex Academy Team"
lastUpdated: "2025-01-15"
featured: true
prerequisites: ["variables-and-data-types", "triggers-and-frameworks", "component-fundamentals", "wire-service-and-apex"]
---

# Building a Complete Feature: Quote Approval System

## What You'll Build

A production-ready Quote Approval System with:
- ✅ Custom Apex business logic
- ✅ Trigger framework for automation
- ✅ LWC components for user interface
- ✅ Asynchronous processing with Queueable
- ✅ External API integration
- ✅ Comprehensive test coverage
- ✅ Error handling and logging

**Real-World Scenario**: Sales reps create quotes that require manager approval. When approved, the system:
1. Updates quote status
2. Creates PDF document (async)
3. Sends to external document management system
4. Notifies customer via email
5. Creates follow-up tasks

---

# Phase 1: Requirements & Design

## Business Requirements

1. **Quote Creation**: Sales reps create quotes for opportunities
2. **Approval Workflow**: Quotes >$10,000 require manager approval
3. **Document Generation**: Generate PDF on approval
4. **External Integration**: Send to DocuSign for e-signature
5. **Customer Notification**: Email customer when quote is ready
6. **Analytics**: Track approval times and patterns

## Data Model

```apex
// Custom Objects needed:
// 1. Quote__c (already exists in standard Salesforce)
// 2. Quote_Approval__c (custom approval tracking)
// 3. Quote_Line_Item__c (quote products)
// 4. Integration_Log__c (track external calls)

// Fields for Quote__c:
// - Status__c (Picklist): Draft, Pending Approval, Approved, Rejected, Sent
// - Total_Amount__c (Currency): Total quote value
// - Approval_Date__c (DateTime): When approved
// - Document_Id__c (Text): External document ID
```

---

# Phase 2: Apex Business Logic

## Step 1: Build the Service Layer

Create reusable business logic separate from triggers.

```apex
/**
 * Service class for Quote business logic
 * Handles approval, validation, and processing
 */
public with sharing class QuoteService {

    public class QuoteException extends Exception {}

    /**
     * Submit quote for approval
     * @param quoteId The quote to submit
     * @return Approval record created
     */
    public static Quote_Approval__c submitForApproval(Id quoteId) {
        // 1. Validate quote
        Quote__c quote = validateQuoteForApproval(quoteId);

        // 2. Determine if approval needed
        if (quote.Total_Amount__c < 10000) {
            throw new QuoteException('Quotes under $10,000 do not require approval');
        }

        // 3. Check for existing pending approval
        List<Quote_Approval__c> existingApprovals = [
            SELECT Id
            FROM Quote_Approval__c
            WHERE Quote__c = :quoteId
            AND Status__c = 'Pending'
            LIMIT 1
        ];

        if (!existingApprovals.isEmpty()) {
            throw new QuoteException('Quote already has a pending approval');
        }

        // 4. Get approver (quote owner's manager)
        User quoteOwner = [
            SELECT Id, ManagerId
            FROM User
            WHERE Id = :quote.OwnerId
            LIMIT 1
        ];

        if (quoteOwner.ManagerId == null) {
            throw new QuoteException('Quote owner has no manager assigned');
        }

        // 5. Create approval record
        Quote_Approval__c approval = new Quote_Approval__c(
            Quote__c = quoteId,
            Approver__c = quoteOwner.ManagerId,
            Status__c = 'Pending',
            Submitted_Date__c = System.now(),
            Quote_Amount__c = quote.Total_Amount__c
        );

        insert approval;

        // 6. Update quote status
        quote.Status__c = 'Pending Approval';
        update quote;

        // 7. Send notification email
        sendApprovalNotification(approval, quoteOwner.ManagerId);

        return approval;
    }

    /**
     * Approve a quote
     * @param approvalId The approval record
     * @param approverId User approving
     * @param comments Approval comments
     */
    public static void approveQuote(Id approvalId, Id approverId, String comments) {
        // 1. Validate approval record
        Quote_Approval__c approval = [
            SELECT Id, Quote__c, Approver__c, Status__c, Quote__r.Total_Amount__c
            FROM Quote_Approval__c
            WHERE Id = :approvalId
            LIMIT 1
        ];

        if (approval.Status__c != 'Pending') {
            throw new QuoteException('Approval is not in Pending status');
        }

        if (approval.Approver__c != approverId) {
            throw new QuoteException('Only the assigned approver can approve this quote');
        }

        // 2. Update approval record
        approval.Status__c = 'Approved';
        approval.Decision_Date__c = System.now();
        approval.Comments__c = comments;
        update approval;

        // 3. Update quote
        Quote__c quote = new Quote__c(
            Id = approval.Quote__c,
            Status__c = 'Approved',
            Approval_Date__c = System.now()
        );
        update quote;

        // 4. Trigger post-approval processing (async)
        System.enqueueJob(new QuotePostApprovalProcessor(approval.Quote__c));
    }

    /**
     * Reject a quote
     */
    public static void rejectQuote(Id approvalId, Id approverId, String reason) {
        Quote_Approval__c approval = [
            SELECT Id, Quote__c, Approver__c, Status__c
            FROM Quote_Approval__c
            WHERE Id = :approvalId
            LIMIT 1
        ];

        if (approval.Status__c != 'Pending') {
            throw new QuoteException('Approval is not in Pending status');
        }

        if (approval.Approver__c != approverId) {
            throw new QuoteException('Only the assigned approver can reject this quote');
        }

        approval.Status__c = 'Rejected';
        approval.Decision_Date__c = System.now();
        approval.Comments__c = reason;
        update approval;

        Quote__c quote = new Quote__c(
            Id = approval.Quote__c,
            Status__c = 'Rejected'
        );
        update quote;
    }

    // Helper method: Validate quote
    private static Quote__c validateQuoteForApproval(Id quoteId) {
        List<Quote__c> quotes = [
            SELECT Id, Status__c, Total_Amount__c, OwnerId
            FROM Quote__c
            WHERE Id = :quoteId
            LIMIT 1
        ];

        if (quotes.isEmpty()) {
            throw new QuoteException('Quote not found');
        }

        Quote__c quote = quotes[0];

        if (quote.Status__c != 'Draft') {
            throw new QuoteException('Only quotes in Draft status can be submitted for approval');
        }

        if (quote.Total_Amount__c == null || quote.Total_Amount__c <= 0) {
            throw new QuoteException('Quote must have a valid total amount');
        }

        return quote;
    }

    // Helper method: Send notification
    private static void sendApprovalNotification(Quote_Approval__c approval, Id managerId) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setTargetObjectId(managerId);
        email.setSubject('Quote Approval Required: $' + approval.Quote_Amount__c);
        email.setPlainTextBody('You have a new quote approval request. Please review.');
        email.setSaveAsActivity(false);

        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
    }
}
```

## Step 2: Async Processing

Handle post-approval tasks asynchronously.

```apex
/**
 * Queueable class to process quote after approval
 * Generates PDF and sends to external system
 */
public class QuotePostApprovalProcessor implements System.Queueable, Database.AllowsCallouts {

    private Id quoteId;

    public QuotePostApprovalProcessor(Id quoteId) {
        this.quoteId = quoteId;
    }

    public void execute(QueueableContext context) {
        try {
            // 1. Generate PDF (simulate)
            String pdfBase64 = generateQuotePdf();

            // 2. Send to external document system
            String externalDocId = sendToDocumentSystem(pdfBase64);

            // 3. Update quote with external ID
            Quote__c quote = new Quote__c(
                Id = quoteId,
                Document_Id__c = externalDocId,
                Status__c = 'Sent'
            );
            update quote;

            // 4. Create follow-up task
            createFollowUpTask();

            // 5. Send customer notification
            System.enqueueJob(new CustomerNotificationQueueable(quoteId));

        } catch (Exception e) {
            // Log error
            logError(e);

            // Update quote with error status
            Quote__c quote = new Quote__c(
                Id = quoteId,
                Status__c = 'Error',
                Error_Message__c = e.getMessage()
            );
            update quote;
        }
    }

    private String generateQuotePdf() {
        // In real implementation:
        // - Use Visualforce page rendered as PDF
        // - Or call Document Generation service
        // For now, simulate with base64 string
        return 'JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9UeXBlL1BhZ2U...'; // Sample PDF
    }

    private String sendToDocumentSystem(String pdfBase64) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Document_System/api/v1/documents');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        Map<String, Object> payload = new Map<String, Object>{
            'quoteId' => quoteId,
            'pdfData' => pdfBase64,
            'type' => 'quote'
        };

        req.setBody(JSON.serialize(payload));
        req.setTimeout(120000);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
            Map<String, Object> response = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) response.get('documentId');
        } else {
            throw new CalloutException('Document system returned: ' + res.getStatusCode());
        }
    }

    private void createFollowUpTask() {
        Quote__c quote = [SELECT Id, OwnerId FROM Quote__c WHERE Id = :quoteId LIMIT 1];

        Task followUp = new Task(
            WhatId = quoteId,
            OwnerId = quote.OwnerId,
            Subject = 'Follow up on approved quote',
            Priority = 'High',
            Status = 'Not Started',
            ActivityDate = System.today().addDays(3)
        );
        insert followUp;
    }

    private void logError(Exception e) {
        Integration_Log__c log = new Integration_Log__c(
            Quote__c = quoteId,
            Error_Message__c = e.getMessage(),
            Stack_Trace__c = e.getStackTraceString(),
            Type__c = 'Quote Post-Approval'
        );
        insert log;
    }
}
```

---

# Phase 3: Trigger Framework

Implement a clean trigger framework for automation.

```apex
/**
 * Quote Trigger Handler
 * Follows trigger framework pattern
 */
public class QuoteTriggerHandler {

    public static void beforeInsert(List<Quote__c> newQuotes) {
        setDefaultValues(newQuotes);
        validateQuotes(newQuotes);
    }

    public static void beforeUpdate(List<Quote__c> newQuotes, Map<Id, Quote__c> oldMap) {
        validateQuotes(newQuotes);
        preventStatusChangeIfApproved(newQuotes, oldMap);
    }

    public static void afterUpdate(List<Quote__c> newQuotes, Map<Id, Quote__c> oldMap) {
        List<Id> approvedQuoteIds = new List<Id>();

        for (Quote__c quote : newQuotes) {
            Quote__c oldQuote = oldMap.get(quote.Id);

            // Detect status change to Approved
            if (quote.Status__c == 'Approved' && oldQuote.Status__c != 'Approved') {
                approvedQuoteIds.add(quote.Id);
            }
        }

        // Trigger async processing for newly approved quotes
        if (!approvedQuoteIds.isEmpty()) {
            // Note: In real implementation, this would be triggered by
            // the approval process, not the quote status change
        }
    }

    private static void setDefaultValues(List<Quote__c> quotes) {
        for (Quote__c quote : quotes) {
            if (quote.Status__c == null) {
                quote.Status__c = 'Draft';
            }
        }
    }

    private static void validateQuotes(List<Quote__c> quotes) {
        for (Quote__c quote : quotes) {
            // Validate total amount
            if (quote.Total_Amount__c != null && quote.Total_Amount__c < 0) {
                quote.addError('Total amount cannot be negative');
            }

            // Validate status transitions
            if (quote.Status__c == 'Sent' && String.isBlank(quote.Document_Id__c)) {
                quote.addError('Cannot mark as Sent without a Document ID');
            }
        }
    }

    private static void preventStatusChangeIfApproved(List<Quote__c> newQuotes, Map<Id, Quote__c> oldMap) {
        for (Quote__c quote : newQuotes) {
            Quote__c oldQuote = oldMap.get(quote.Id);

            if (oldQuote.Status__c == 'Approved' && quote.Status__c != oldQuote.Status__c) {
                // Only allow Approved -> Sent
                if (quote.Status__c != 'Sent') {
                    quote.addError('Approved quotes can only be changed to Sent status');
                }
            }
        }
    }
}

// The actual trigger
trigger QuoteTrigger on Quote__c (before insert, before update, after update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            QuoteTriggerHandler.beforeInsert(Trigger.new);
        } else if (Trigger.isUpdate) {
            QuoteTriggerHandler.beforeUpdate(Trigger.new, Trigger.oldMap);
        }
    } else if (Trigger.isAfter) {
        if (Trigger.isUpdate) {
            QuoteTriggerHandler.afterUpdate(Trigger.new, Trigger.oldMap);
        }
    }
}
```

---

# Phase 4: LWC Components

Build the user interface with Lightning Web Components.

## Component 1: Quote Approval Card

```javascript
// quoteApprovalCard.js
import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import submitForApproval from '@salesforce/apex/QuoteService.submitForApproval';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import STATUS_FIELD from '@salesforce/schema/Quote__c.Status__c';
import TOTAL_FIELD from '@salesforce/schema/Quote__c.Total_Amount__c';

export default class QuoteApprovalCard extends LightningElement {
    @api recordId;

    isLoading = false;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [STATUS_FIELD, TOTAL_FIELD]
    })
    quote;

    get status() {
        return getFieldValue(this.quote.data, STATUS_FIELD);
    }

    get totalAmount() {
        return getFieldValue(this.quote.data, TOTAL_FIELD);
    }

    get canSubmit() {
        return this.status === 'Draft' && this.totalAmount >= 10000;
    }

    get statusVariant() {
        const variants = {
            'Draft': 'warning',
            'Pending Approval': 'warning',
            'Approved': 'success',
            'Rejected': 'error',
            'Sent': 'success'
        };
        return variants[this.status] || 'neutral';
    }

    async handleSubmitForApproval() {
        this.isLoading = true;

        try {
            await submitForApproval({ quoteId: this.recordId });

            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Quote submitted for approval',
                variant: 'success'
            }));

            // Refresh the page
            eval("$A.get('e.force:refreshView').fire();");

        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error.body.message || 'Failed to submit quote',
                variant: 'error'
            }));
        } finally {
            this.isLoading = false;
        }
    }
}
```

```html
<!-- quoteApprovalCard.html -->
<template>
    <lightning-card title="Quote Approval" icon-name="standard:approval">
        <div class="slds-p-around_medium">
            <!-- Status Badge -->
            <div class="slds-m-bottom_medium">
                <lightning-badge
                    label={status}
                    variant={statusVariant}>
                </lightning-badge>
            </div>

            <!-- Amount Display -->
            <div class="slds-m-bottom_medium">
                <p class="slds-text-heading_medium">
                    <lightning-formatted-number
                        value={totalAmount}
                        format-style="currency"
                        currency-code="USD">
                    </lightning-formatted-number>
                </p>
            </div>

            <!-- Submit Button -->
            <div if:true={canSubmit}>
                <lightning-button
                    variant="brand"
                    label="Submit for Approval"
                    onclick={handleSubmitForApproval}
                    disabled={isLoading}>
                </lightning-button>
            </div>

            <!-- Loading Spinner -->
            <div if:true={isLoading}>
                <lightning-spinner alternative-text="Loading" size="small"></lightning-spinner>
            </div>
        </div>
    </lightning-card>
</template>
```

## Component 2: Approval Manager Dashboard

```javascript
// approvalManagerDashboard.js
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getPendingApprovals from '@salesforce/apex/QuoteService.getPendingApprovals';
import approveQuote from '@salesforce/apex/QuoteService.approveQuote';
import rejectQuote from '@salesforce/apex/QuoteService.rejectQuote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from '@salesforce/user/Id';

const COLUMNS = [
    { label: 'Quote Number', fieldName: 'Name', type: 'text' },
    { label: 'Amount', fieldName: 'Quote_Amount__c', type: 'currency' },
    { label: 'Submitted Date', fieldName: 'Submitted_Date__c', type: 'date' },
    { label: 'Owner', fieldName: 'Quote__r.OwnerId', type: 'text' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'Approve', name: 'approve' },
                { label: 'Reject', name: 'reject' }
            ]
        }
    }
];

export default class ApprovalManagerDashboard extends LightningElement {
    columns = COLUMNS;
    approvals;
    wiredApprovalsResult;
    isLoading = false;

    @wire(getPendingApprovals, { approverId: USER_ID })
    wiredApprovals(result) {
        this.wiredApprovalsResult = result;
        if (result.data) {
            this.approvals = result.data;
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'approve':
                this.handleApprove(row);
                break;
            case 'reject':
                this.handleReject(row);
                break;
        }
    }

    async handleApprove(approval) {
        this.isLoading = true;

        try {
            await approveQuote({
                approvalId: approval.Id,
                approverId: USER_ID,
                comments: 'Approved'
            });

            this.showToast('Success', 'Quote approved successfully', 'success');
            await refreshApex(this.wiredApprovalsResult);

        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async handleReject(approval) {
        // Show modal for rejection reason
        // Then call rejectQuote
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
```

---

# Phase 5: Testing

Comprehensive test coverage for all components.

```apex
@isTest
private class QuoteServiceTest {

    @testSetup
    static void setup() {
        // Create test data
        Account acc = new Account(Name = 'Test Account');
        insert acc;

        Opportunity opp = new Opportunity(
            Name = 'Test Opp',
            AccountId = acc.Id,
            StageName = 'Prospecting',
            CloseDate = System.today().addDays(30)
        );
        insert opp;

        // Create manager
        User manager = createTestUser('Manager');
        insert manager;

        // Create rep with manager
        User rep = createTestUser('Rep');
        rep.ManagerId = manager.Id;
        insert rep;

        // Create quote owned by rep
        System.runAs(rep) {
            Quote__c quote = new Quote__c(
                Opportunity__c = opp.Id,
                Total_Amount__c = 15000,
                Status__c = 'Draft'
            );
            insert quote;
        }
    }

    @isTest
    static void testSubmitForApproval_Success() {
        Quote__c quote = [SELECT Id FROM Quote__c LIMIT 1];

        Test.startTest();
        Quote_Approval__c approval = QuoteService.submitForApproval(quote.Id);
        Test.stopTest();

        Assert.isNotNull(approval.Id, 'Approval should be created');
        Assert.areEqual('Pending', approval.Status__c, 'Status should be Pending');

        Quote__c updatedQuote = [SELECT Status__c FROM Quote__c WHERE Id = :quote.Id];
        Assert.areEqual('Pending Approval', updatedQuote.Status__c);
    }

    @isTest
    static void testSubmitForApproval_BelowThreshold() {
        Quote__c quote = [SELECT Id FROM Quote__c LIMIT 1];
        quote.Total_Amount__c = 5000;
        update quote;

        Test.startTest();
        try {
            QuoteService.submitForApproval(quote.Id);
            Assert.fail('Should have thrown exception');
        } catch (QuoteService.QuoteException e) {
            Assert.isTrue(e.getMessage().contains('under $10,000'));
        }
        Test.stopTest();
    }

    @isTest
    static void testApproveQuote_Success() {
        // Submit quote first
        Quote__c quote = [SELECT Id FROM Quote__c LIMIT 1];
        Quote_Approval__c approval = QuoteService.submitForApproval(quote.Id);

        User manager = [SELECT Id FROM User WHERE Name = 'Manager' LIMIT 1];

        Test.startTest();
        System.runAs(manager) {
            QuoteService.approveQuote(approval.Id, manager.Id, 'Looks good');
        }
        Test.stopTest();

        Quote_Approval__c updatedApproval = [
            SELECT Status__c, Decision_Date__c
            FROM Quote_Approval__c
            WHERE Id = :approval.Id
        ];
        Assert.areEqual('Approved', updatedApproval.Status__c);
        Assert.isNotNull(updatedApproval.Decision_Date__c);

        Quote__c updatedQuote = [SELECT Status__c FROM Quote__c WHERE Id = :quote.Id];
        Assert.areEqual('Approved', updatedQuote.Status__c);
    }

    @isTest
    static void testPostApprovalProcessing() {
        Quote__c quote = [SELECT Id FROM Quote__c LIMIT 1];

        // Set mock callout
        Test.setMock(HttpCalloutMock.class, new MockDocumentSystemResponse());

        Test.startTest();
        System.enqueueJob(new QuotePostApprovalProcessor(quote.Id));
        Test.stopTest();

        Quote__c processedQuote = [
            SELECT Status__c, Document_Id__c
            FROM Quote__c
            WHERE Id = :quote.Id
        ];

        Assert.areEqual('Sent', processedQuote.Status__c);
        Assert.isNotNull(processedQuote.Document_Id__c);
    }

    // Helper methods
    private static User createTestUser(String name) {
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        return new User(
            FirstName = name,
            LastName = 'Test',
            Email = name + '@test.com',
            Username = name + System.currentTimeMillis() + '@test.com',
            Alias = name.left(8),
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = p.Id,
            LanguageLocaleKey = 'en_US'
        );
    }

    private class MockDocumentSystemResponse implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"documentId": "DOC-12345"}');
            return res;
        }
    }
}
```

---

# Key Takeaways

## What You Learned

1. **Service Layer Pattern**: Separate business logic from triggers
2. **Async Processing**: Use Queueable for post-processing tasks
3. **Trigger Framework**: Clean, maintainable trigger code
4. **LWC Integration**: Connect UI to Apex with wire adapters
5. **Error Handling**: Graceful failure and logging
6. **Testing**: Comprehensive test coverage with mocks

## Best Practices Applied

✅ Bulkified code (handles multiple records)
✅ Separation of concerns (Service, Handler, Processor)
✅ Async for long-running tasks
✅ Named Credentials for external auth
✅ Proper exception handling
✅ Comprehensive testing
✅ User-friendly LWC components

## Next Steps

- Add batch processing for bulk approvals
- Implement scheduled job for reminder emails
- Add analytics dashboard
- Build mobile-responsive UI
- Add advanced error recovery
- Implement audit logging

---

**This is how real Salesforce development works!** From requirements to production-ready code, testing, and deployment.
