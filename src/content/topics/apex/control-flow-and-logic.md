---
title: "Control Flow and Logic"
section: "apex"
order: 2
difficulty: "beginner"
readTime: "25 min"
description: "Master conditional statements, loops, and control flow patterns in Apex with comprehensive examples and best practices."
overview: "Learn how to control program execution flow using if statements, switch statements, loops, and advanced control patterns."
concepts: ["if-statements", "switch-statements", "for-loops", "while-loops", "do-while", "break-continue", "control-flow"]
prerequisites: ["variables-and-data-types"]
relatedTopics: ["collections-deep-dive", "exception-handling"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Control flow determines the order in which your code executes. Understanding these patterns is essential for implementing business logic and handling different scenarios in your applications.

## Understanding Control Flow

Control flow structures allow you to:
- **Make Decisions**: Execute different code based on conditions
- **Repeat Operations**: Process collections or perform tasks multiple times
- **Handle Edge Cases**: Skip or exit loops based on specific conditions
- **Optimize Performance**: Control execution paths for efficiency

**Key Principles:**
- **Readability**: Clear control flow makes code easier to understand
- **Performance**: Choose the right control structure for your use case
- **Safety**: Always handle edge cases and null values
- **Bulkification**: Consider bulk processing in loops

## Control Flow Categories

### Conditional Statements
Execute code based on boolean conditions:
- **if/else**: Basic conditional logic
- **if/else if/else**: Multiple condition branches
- **switch statement**: Pattern matching and type checking
- **Ternary operator**: Inline conditional expressions

### Loop Structures
Repeat operations efficiently:
- **for loop**: Iterate over collections or ranges
- **while loop**: Repeat while condition is true
- **do-while loop**: Execute at least once, then repeat
- **Enhanced for loop**: Simplified collection iteration

### Control Keywords
Modify loop behavior:
- **break**: Exit loop early
- **continue**: Skip to next iteration
- **return**: Exit method immediately

---

# Code Examples

Let's explore control flow patterns with detailed, annotated examples.

## If Statements and Conditional Logic

The foundation of decision-making in your code.

```apex
public class ConditionalLogic {

    public static void demonstrateIfStatements() {
        Integer score = 85;
        String result;

        // Basic if statement
        if (score >= 70) {
            // ^^^^^^^^^^^^^^^^
            // CONDITION: Boolean expression evaluated
            // → Code block executes only if condition is true
            // 💡 TIP: Always use clear, readable conditions
            result = 'Passing';
        }

        // If-else statement
        if (score >= 70) {
            result = 'Passing';
        } else {
            // ^^^^
            // ELSE BLOCK: Executes when condition is false
            // → Provides alternative execution path
            result = 'Failing';
        }

        // If-else if-else chain
        if (score >= 90) {
            result = 'Excellent';
        } else if (score >= 80) {
            // ^^^^^^^^^^^^^^^^^^^^^^
            // ELSE IF: Additional conditions checked in order
            // → First true condition executes, rest are skipped
            // 💡 PERFORMANCE: Order conditions by likelihood
            result = 'Very Good';
        } else if (score >= 70) {
            result = 'Good';
        } else if (score >= 60) {
            result = 'Pass';
        } else {
            result = 'Fail';
        }

        // Complex conditions with logical operators
        Boolean hasPrerequisites = true;
        Integer attendance = 95;

        if (score >= 70 && hasPrerequisites && attendance >= 80) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // COMPOUND CONDITION: Multiple conditions with AND
            // → All conditions must be true
            // ✅ BEST PRACTICE: Use parentheses for clarity in complex conditions
            result = 'Pass with prerequisites met';
        }

        // Nested if statements
        if (score >= 70) {
            if (attendance >= 90) {
                // ^^^^^^^^^^^^^^^^^^^^^
                // NESTED IF: Inner condition only checked if outer is true
                // → Use for dependent conditions
                // ⚠️ WARNING: Deep nesting reduces readability
                result = 'Pass with excellent attendance';
            } else {
                result = 'Pass';
            }
        }
    }

    public static String evaluateAccountStatus(Account acc) {
        // Real-world example: Account validation
        if (acc == null) {
            // ^^^^^^^^^^^^^^^
            // NULL CHECK: Always check for null first
            // → Prevents NullPointerException
            // 💀 EXAM TRAP: Forgetting null checks causes runtime errors
            return 'Invalid Account';
        }

        if (String.isBlank(acc.Name)) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^
            // STRING VALIDATION: Check for null, empty, or whitespace
            // → More comprehensive than acc.Name == null
            // ✅ BEST PRACTICE: Use String.isBlank() for string validation
            return 'Missing Account Name';
        }

        // Check account rating
        if (acc.Rating == 'Hot') {
            return 'High Priority Account';
        } else if (acc.Rating == 'Warm') {
            return 'Medium Priority Account';
        } else if (acc.Rating == 'Cold') {
            return 'Low Priority Account';
        } else {
            return 'Unrated Account';
        }
    }

    public static Boolean isValidOpportunity(Opportunity opp) {
        // Multiple validation checks
        if (opp == null || opp.Amount == null || opp.CloseDate == null) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // MULTI-CONDITION NULL CHECK: Validate multiple fields
            // → OR operator: returns false if any condition is true
            // 💡 TIP: Validate early and return quickly
            return false;
        }

        // Business rule validation
        if (opp.Amount <= 0) {
            return false;
        }

        if (opp.CloseDate < Date.today()) {
            return false;
        }

        if (String.isBlank(opp.StageName)) {
            return false;
        }

        return true; // All validations passed
    }
}
```

## Switch Statements

Modern pattern matching for cleaner conditional logic.

```apex
public class SwitchStatements {

    public static void demonstrateSwitchOnString() {
        String status = 'Active';

        // Switch on String
        switch on status {
            // ^^^^^^^^^^^^^^^^
            // SWITCH STATEMENT: Pattern matching for cleaner code
            // → More readable than long if-else chains
            // 💡 USE CASE: When checking same variable against multiple values

            when 'Active' {
                // ^^^^^^^^^^^^^^
                // WHEN BLOCK: Executes for exact match
                // → No break needed (unlike Java/C++)
                System.debug('Account is active');
            }
            when 'Inactive' {
                System.debug('Account is inactive');
            }
            when 'Pending' {
                System.debug('Account is pending approval');
            }
            when else {
                // ^^^^^^^^^^
                // DEFAULT CASE: Executes if no matches found
                // → Similar to else in if-else chain
                // ✅ BEST PRACTICE: Always include when else for unknown values
                System.debug('Unknown status: ' + status);
            }
        }

        // Multiple values in one when block
        switch on status {
            when 'Active', 'Pending' {
                // ^^^^^^^^^^^^^^^^^^^^^^^
                // MULTIPLE VALUES: Comma-separated matches
                // → Executes for any listed value
                // 💡 USE CASE: Same logic for multiple cases
                System.debug('Account requires attention');
            }
            when 'Inactive', 'Closed' {
                System.debug('Account is not operational');
            }
            when else {
                System.debug('Status: ' + status);
            }
        }
    }

    public static String getOpportunityCategory(Opportunity opp) {
        // Switch on SObject type with null checking
        if (opp == null) {
            return 'Invalid';
        }

        // Switch on field value
        switch on opp.StageName {
            when 'Prospecting', 'Qualification' {
                return 'Early Stage';
            }
            when 'Needs Analysis', 'Value Proposition' {
                return 'Mid Stage';
            }
            when 'Proposal/Price Quote', 'Negotiation/Review' {
                return 'Late Stage';
            }
            when 'Closed Won' {
                return 'Won';
            }
            when 'Closed Lost' {
                return 'Lost';
            }
            when else {
                return 'Unknown Stage';
            }
        }
    }

    public static void demonstrateSwitchOnInteger() {
        Integer dayOfWeek = 3;

        switch on dayOfWeek {
            // ^^^^^^^^^^^^^^^^^^^
            // SWITCH ON INTEGER: Works with numeric values
            // → Efficient for range checking
            when 1 {
                System.debug('Monday');
            }
            when 2 {
                System.debug('Tuesday');
            }
            when 3 {
                System.debug('Wednesday');
            }
            when 4 {
                System.debug('Thursday');
            }
            when 5 {
                System.debug('Friday');
            }
            when 6, 7 {
                System.debug('Weekend');
            }
            when else {
                System.debug('Invalid day');
            }
        }
    }

    public static String getAccountTier(Account acc) {
        // Switch with complex logic
        if (acc == null || acc.AnnualRevenue == null) {
            return 'Unknown';
        }

        Decimal revenue = acc.AnnualRevenue;

        // Use if-else for range checking (switch doesn't support ranges)
        if (revenue >= 10000000) {
            return 'Enterprise';
        } else if (revenue >= 1000000) {
            return 'Corporate';
        } else if (revenue >= 100000) {
            return 'Business';
        } else {
            return 'Small Business';
        }
        // ⚠️ NOTE: Switch statement doesn't support range conditions
        // → Use if-else for range checking
        // 💡 TIP: Choose the right control structure for your needs
    }

    public static void demonstrateSwitchOnEnum() {
        // Switch on Enum (if you define custom enums)
        Season currentSeason = Season.SUMMER;

        switch on currentSeason {
            when SPRING {
                System.debug('Spring: Renewal season');
            }
            when SUMMER {
                System.debug('Summer: Peak season');
            }
            when FALL {
                System.debug('Fall: Harvest season');
            }
            when WINTER {
                System.debug('Winter: Planning season');
            }
        }
    }

    // Custom enum definition
    public enum Season {
        SPRING, SUMMER, FALL, WINTER
    }
}
```

## For Loops

Iterate over collections and ranges efficiently.

```apex
public class ForLoops {

    public static void demonstrateForLoops() {
        // Traditional for loop (rarely used in Apex)
        for (Integer i = 0; i < 10; i++) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // TRADITIONAL FOR: Initialize, condition, increment
            // → Rarely needed in Apex (use enhanced for instead)
            // 💡 USE CASE: When you need the index value
            System.debug('Iteration: ' + i);
        }

        // Enhanced for loop with List
        List<String> names = new List<String>{'Alice', 'Bob', 'Charlie'};

        for (String name : names) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // ENHANCED FOR: Iterate over collection elements
            // → Simpler and more readable than traditional for
            // ✅ BEST PRACTICE: Preferred for collection iteration
            System.debug('Name: ' + name);
        }

        // For loop with Set
        Set<Integer> numbers = new Set<Integer>{1, 2, 3, 4, 5};

        for (Integer num : numbers) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // SET ITERATION: Works with any collection type
            // → Order not guaranteed with Sets
            // ⚠️ WARNING: Don't rely on Set iteration order
            System.debug('Number: ' + num);
        }

        // For loop with Map.keySet()
        Map<String, Integer> scores = new Map<String, Integer>{
            'Alice' => 85,
            'Bob' => 92,
            'Charlie' => 78
        };

        for (String key : scores.keySet()) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // MAP KEY ITERATION: Iterate over map keys
            // → Access values using map.get(key)
            Integer score = scores.get(key);
            System.debug(key + ': ' + score);
        }

        // For loop with Map.values()
        for (Integer score : scores.values()) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // MAP VALUE ITERATION: Iterate over map values
            // → No access to keys in this approach
            System.debug('Score: ' + score);
        }

        // For loop with Map.entrySet() - most efficient
        for (String key : scores.keySet()) {
            Integer value = scores.get(key);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // KEY-VALUE ACCESS: Get both key and value
            System.debug('Student: ' + key + ', Score: ' + value);
        }
    }

    public static void processBulkRecords(List<Account> accounts) {
        // Real-world example: Bulk processing
        List<Contact> contactsToInsert = new List<Contact>();

        for (Account acc : accounts) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^
            // BULK PROCESSING: Collect records for bulk DML
            // → Never put DML inside loops!
            // 💀 EXAM TRAP: DML in loops causes governor limit exceptions

            if (String.isNotBlank(acc.Name)) {
                Contact con = new Contact();
                con.FirstName = 'Primary';
                con.LastName = 'Contact';
                con.AccountId = acc.Id;
                contactsToInsert.add(con);
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^
                // COLLECT FOR BULK INSERT: Add to list, insert later
                // ✅ BEST PRACTICE: Always bulkify your code
            }
        }

        // Single DML operation after loop
        if (!contactsToInsert.isEmpty()) {
            insert contactsToInsert;
            // ^^^^^^^^^^^^^^^^^^^^^
            // BULK DML: Insert all records at once
            // → Uses only 1 DML statement regardless of count
            // 💡 PERFORMANCE: Up to 10,000 records in single operation
        }
    }

    public static Map<Id, Decimal> calculateTotalRevenue(List<Opportunity> opportunities) {
        // Group and aggregate data using loops
        Map<Id, Decimal> revenueByAccount = new Map<Id, Decimal>();

        for (Opportunity opp : opportunities) {
            if (opp.AccountId == null || opp.Amount == null) {
                continue; // Skip invalid records
                // ^^^^^^^^^
                // CONTINUE: Skip to next iteration
                // → Use for filtering within loops
                // 💡 USE CASE: Skip invalid or unwanted records
            }

            if (opp.StageName != 'Closed Won') {
                continue; // Only count closed won opportunities
            }

            // Aggregate revenue by account
            if (!revenueByAccount.containsKey(opp.AccountId)) {
                revenueByAccount.put(opp.AccountId, 0);
            }

            Decimal currentTotal = revenueByAccount.get(opp.AccountId);
            revenueByAccount.put(opp.AccountId, currentTotal + opp.Amount);
        }

        return revenueByAccount;
    }

    public static List<Account> filterActiveAccounts(List<Account> accounts) {
        // Filter records using loop
        List<Account> activeAccounts = new List<Account>();

        for (Account acc : accounts) {
            // Multiple filter conditions
            if (acc.Active__c == true &&
                String.isNotBlank(acc.Industry) &&
                acc.AnnualRevenue != null &&
                acc.AnnualRevenue > 0) {

                activeAccounts.add(acc);
            }
        }

        return activeAccounts;
    }

    public static void demonstrateNestedLoops() {
        // Nested loops for complex processing
        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 10];
        Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();

        for (Account acc : accounts) {
            List<Contact> contacts = [
                SELECT Id, Name, Email
                FROM Contact
                WHERE AccountId = :acc.Id
            ];
            // ⚠️ WARNING: SOQL in loop - acceptable here with LIMIT
            // → Use relationship queries instead when possible

            for (Contact con : contacts) {
                // ^^^^^^^^^^^^^^^^^^^^^^^
                // NESTED LOOP: Outer loop per account, inner per contact
                // → Watch for performance with large datasets
                // 💡 OPTIMIZATION: Use relationship queries when possible

                if (!contactsByAccount.containsKey(acc.Id)) {
                    contactsByAccount.put(acc.Id, new List<Contact>());
                }
                contactsByAccount.get(acc.Id).add(con);
            }
        }
    }
}
```

## While and Do-While Loops

Repeat operations based on conditions.

```apex
public class WhileLoops {

    public static void demonstrateWhileLoop() {
        Integer counter = 0;

        while (counter < 5) {
            // ^^^^^^^^^^^^^^^^^^
            // WHILE LOOP: Repeats while condition is true
            // → Condition checked before each iteration
            // ⚠️ WARNING: Ensure condition eventually becomes false!
            System.debug('Counter: ' + counter);
            counter++;
            // ^^^^^^^^^^
            // INCREMENT: Must update condition variable
            // → Forgetting this causes infinite loop
            // 💀 EXAM TRAP: Infinite loops cause timeout errors
        }

        // While loop with complex condition
        Integer attempts = 0;
        Boolean success = false;

        while (!success && attempts < 3) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // COMPOUND CONDITION: Multiple exit conditions
            // → Exits when success=true OR attempts>=3
            System.debug('Attempt: ' + attempts);

            // Simulate some operation
            success = performOperation();
            attempts++;
        }
    }

    public static void demonstrateDoWhileLoop() {
        Integer counter = 0;

        do {
            // ^^^
            // DO-WHILE: Executes at least once
            // → Condition checked after each iteration
            // 💡 USE CASE: When you need at least one execution
            System.debug('Counter: ' + counter);
            counter++;
        } while (counter < 5);
        // ^^^^^^^^^^^^^^^^^^^^^^
        // CONDITION CHECK: Evaluated after block execution
        // → Loop continues if condition is true
    }

    public static List<String> processUntilLimit(List<String> items) {
        // Real-world example: Process until limit reached
        List<String> processed = new List<String>();
        Integer index = 0;
        Integer maxItems = 100;

        while (index < items.size() && processed.size() < maxItems) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // DUAL CONDITIONS: Stop when out of items OR limit reached
            // → Whichever comes first
            // ✅ BEST PRACTICE: Always have safety limits

            String item = items[index];

            if (String.isNotBlank(item)) {
                processed.add(item.toUpperCase());
            }

            index++;
        }

        return processed;
    }

    public static Integer findFirstNegative(List<Integer> numbers) {
        // Find first element matching condition
        Integer index = 0;

        while (index < numbers.size()) {
            if (numbers[index] < 0) {
                return numbers[index];
                // ^^^^^^^^^^^^^^^^^^^^^
                // EARLY RETURN: Exit method immediately when found
                // → No need to continue loop
                // 💡 PERFORMANCE: More efficient than checking all
            }
            index++;
        }

        return null; // No negative number found
    }

    public static void demonstrateBreakAndContinue() {
        List<Integer> numbers = new List<Integer>{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        Integer sum = 0;

        for (Integer num : numbers) {
            if (num == 5) {
                continue;
                // ^^^^^^^^^
                // CONTINUE: Skip this iteration, move to next
                // → Number 5 won't be added to sum
                // 💡 USE CASE: Skip specific values in processing
            }

            if (num > 7) {
                break;
                // ^^^^^^
                // BREAK: Exit loop entirely
                // → No further iterations after num=8
                // 💡 USE CASE: Stop when target found or limit reached
            }

            sum += num;
        }
        // Result: 1 + 2 + 3 + 4 + 6 + 7 = 23 (skips 5, stops after 7)
    }

    private static Boolean performOperation() {
        // Simulate operation with random success
        return Math.random() > 0.5;
    }
}
```

---

# Common Patterns and Best Practices

## Early Return Pattern

```apex
public static Boolean isValidRecord(Account acc) {
    // ✅ GOOD - Early returns for validation
    if (acc == null) {
        return false;
    }

    if (String.isBlank(acc.Name)) {
        return false;
    }

    if (acc.AnnualRevenue == null || acc.AnnualRevenue <= 0) {
        return false;
    }

    // All validations passed
    return true;
}

// ❌ BAD - Nested if statements
public static Boolean isValidRecordNested(Account acc) {
    if (acc != null) {
        if (String.isNotBlank(acc.Name)) {
            if (acc.AnnualRevenue != null && acc.AnnualRevenue > 0) {
                return true;
            }
        }
    }
    return false;
}
```

## Guard Clauses

```apex
public static void processAccount(Account acc) {
    // ✅ Guard clauses at the top
    if (acc == null) {
        System.debug('Account is null');
        return;
    }

    if (String.isBlank(acc.Name)) {
        System.debug('Account name is missing');
        return;
    }

    // Main processing logic here
    System.debug('Processing account: ' + acc.Name);
}
```

## Avoiding Infinite Loops

```apex
// ❌ BAD - Potential infinite loop
public static void badWhileLoop() {
    Integer counter = 0;
    while (counter < 10) {
        System.debug('Processing...');
        // Forgot to increment counter - INFINITE LOOP!
    }
}

// ✅ GOOD - Safe loop with exit condition
public static void goodWhileLoop() {
    Integer counter = 0;
    Integer maxIterations = 10;

    while (counter < maxIterations) {
        System.debug('Processing: ' + counter);
        counter++; // Always update loop variable
    }
}
```

---

# Common Gotchas

## 💀 DML in Loops

```apex
// ❌ WRONG - DML inside loop
for (Account acc : accounts) {
    update acc; // GOVERNOR LIMIT EXCEPTION with 150+ records
}

// ✅ CORRECT - Bulk DML after loop
List<Account> accountsToUpdate = new List<Account>();
for (Account acc : accounts) {
    accountsToUpdate.add(acc);
}
update accountsToUpdate; // Single DML statement
```

## ⚠️ SOQL in Loops

```apex
// ❌ WRONG - SOQL inside loop
for (Account acc : accounts) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
    // GOVERNOR LIMIT EXCEPTION with 100+ records
}

// ✅ CORRECT - Single SOQL with IN clause
Set<Id> accountIds = new Set<Id>();
for (Account acc : accounts) {
    accountIds.add(acc.Id);
}
List<Contact> contacts = [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds];
```

## 💡 Switch vs If-Else

```apex
// Use switch when checking same variable against multiple values
switch on status {
    when 'Active' { processActive(); }
    when 'Inactive' { processInactive(); }
    when else { processOther(); }
}

// Use if-else for range checks or complex conditions
if (amount > 1000000) {
    processTier1();
} else if (amount > 100000) {
    processTier2();
} else {
    processTier3();
}
```

---

# Exam Tips

## High-Priority Concepts

1. **Loop Bulkification**: Never put SOQL or DML inside loops
2. **Switch Statement**: Modern alternative to if-else chains
3. **Break vs Continue**: break exits loop, continue skips to next iteration
4. **Early Returns**: Improve readability and reduce nesting
5. **Null Checking**: Always validate before accessing properties

## Common Exam Scenarios

- Identifying non-bulkified code (SOQL/DML in loops)
- Choosing between switch and if-else
- Understanding break and continue behavior
- Recognizing infinite loop conditions
- Proper null checking patterns

## Key Points to Remember

- Enhanced for loops are preferred over traditional for loops
- Switch statements only work with exact value matching
- Always bulkify loop operations for governor limits
- Use early returns to reduce nesting
- Guard clauses improve code readability

---

# Practice Exercises

## Exercise 1: Refactor If-Else to Switch

Refactor this code to use a switch statement:

```apex
public static String getDiscountTier(String membershipLevel) {
    if (membershipLevel == 'Platinum') {
        return '30% discount';
    } else if (membershipLevel == 'Gold') {
        return '20% discount';
    } else if (membershipLevel == 'Silver') {
        return '10% discount';
    } else {
        return 'No discount';
    }
}
```

## Exercise 2: Fix the Bulkification Issue

Fix the governor limit issues in this code:

```apex
public static void updateAccountRatings(List<Account> accounts) {
    for (Account acc : accounts) {
        List<Opportunity> opps = [
            SELECT Amount
            FROM Opportunity
            WHERE AccountId = :acc.Id AND StageName = 'Closed Won'
        ];

        Decimal total = 0;
        for (Opportunity opp : opps) {
            total += opp.Amount;
        }

        if (total > 1000000) {
            acc.Rating = 'Hot';
        }

        update acc;
    }
}
```

## Exercise 3: Implement Early Return Pattern

Refactor this nested if logic using early returns:

```apex
public static Boolean canProcessOrder(Order__c order) {
    if (order != null) {
        if (order.Status__c == 'Pending') {
            if (order.Total_Amount__c > 0) {
                if (order.Customer__c != null) {
                    return true;
                }
            }
        }
    }
    return false;
}
```

---

# Related Topics

## Prerequisites
- **[Variables and Data Types](variables-and-data-types)** - Understanding boolean logic and conditions

## Next Steps
- **[Collections Deep Dive](collections-deep-dive)** - Work with Lists, Sets, and Maps in loops
- **[Exception Handling](exception-handling)** - Handle errors in control flow

## Advanced Topics
- **[Trigger Bulkification](trigger-bulkification-best-practices)** - Apply control flow in triggers
- **[Asynchronous Patterns](asynchronous-apex-patterns)** - Control flow in async context

**Next Recommended Topic:** [Collections Deep Dive](collections-deep-dive) - Master Lists, Sets, and Maps for powerful data manipulation.
