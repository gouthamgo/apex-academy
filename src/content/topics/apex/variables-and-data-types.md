---
title: "Variables and Data Types"
section: "apex"
order: 1
difficulty: "beginner"
readTime: "20 min"
description: "Master Apex variables, primitive data types, and type conversion with comprehensive examples and best practices."
overview: "Learn the foundation of Apex programming: how to declare variables, work with different data types, and handle type conversions effectively."
concepts: ["variables", "primitives", "strings", "integers", "booleans", "decimals", "type-conversion", "constants"]
prerequisites: []
relatedTopics: ["collections-deep-dive", "control-flow-and-logic"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Variables are the fundamental building blocks of any Apex program. This section covers the essential concepts you need to understand before diving into code examples.

## Understanding Variables

A variable is a named storage location that holds data. In Apex, every variable must have a specific data type that determines what kind of information it can store.

**Key Principles:**
- **Strong Typing**: Apex requires you to specify the data type of every variable
- **Initialization**: Variables can be declared without a value, but they start as `null`
- **Scope**: Variables exist within the block where they're declared
- **Immutability**: Some data types like Strings are immutable (cannot be changed)

## Data Type Categories

### Primitive Types
These are the basic building blocks for storing simple values:
- **String**: Text data and character sequences
- **Integer**: Whole numbers within a specific range
- **Long**: Larger whole numbers for bigger values
- **Decimal**: Precise decimal numbers (ideal for currency)
- **Double**: Floating-point numbers with potential precision issues
- **Boolean**: True/false values (including null)

### Date and Time Types
For handling temporal data:
- **Date**: Year, month, and day only
- **DateTime**: Complete timestamp with timezone awareness
- **Time**: Hours, minutes, seconds, and milliseconds

### Special Considerations
- **Null Safety**: All primitive types can be null in Apex
- **Type Conversion**: Understanding implicit vs explicit conversions
- **Performance**: Choosing the right type for your use case

---

# Code Examples

Now let's see these concepts in action with comprehensive code examples and detailed explanations.

## Basic Variable Declaration

The foundation of working with variables is understanding how to declare and initialize them properly.

```apex
// Basic variable declaration
String accountName;
// ^^^^^^^^^^^^^^^^^^
// DECLARATION: Creates variable 'accountName' of type String
// → Variable exists but has null value until assigned
// 💡 WHY? Apex is strongly typed - must specify data type

Integer recordCount = 0;
// ^^^^^^^^^^^^^^^^^^^^^^
// DECLARATION + INITIALIZATION: Creates and assigns value in one step
// → More efficient than separate declaration and assignment
// ✅ BEST PRACTICE: Initialize variables when declaring if possible

Boolean isActive;
System.debug('isActive value: ' + isActive); // Prints: null
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// UNINITIALIZED VARIABLE: Contains null until assigned
// ⚠️ WARNING: Can cause NullPointerException if used in operations

// Proper initialization
Boolean isActive = true;
System.debug('isActive value: ' + isActive); // Prints: true
```

## Working with Strings

Strings are the most commonly used data type for handling text in Apex. Understanding string operations is crucial for data manipulation.

```apex
public class StringExamples {

    public static void demonstrateStrings() {
        // String literals and declaration
        String firstName = 'John';
        String lastName = "Doe";
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // SINGLE vs DOUBLE QUOTES: Both work in Apex
        // → Consistent style recommended (prefer single quotes)
        // 💡 TIP: Single quotes are Salesforce convention

        // String concatenation
        String fullName = firstName + ' ' + lastName;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CONCATENATION: Use + operator to join strings
        // → Creates new String object (immutable)
        // ⚠️ PERFORMANCE: Avoid in loops with many concatenations

        // String methods
        String upperName = fullName.toUpperCase();
        String lowerName = fullName.toLowerCase();
        Integer nameLength = fullName.length();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // STRING METHODS: Rich set of manipulation methods
        // → All methods return new String objects (immutable)
        // 💡 REMEMBER: Strings are immutable in Apex

        // String comparison
        if (firstName.equals('John')) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^
            // EQUALS METHOD: Null-safe string comparison
            // → Preferred over == operator for strings
            // 💀 EXAM TRAP: == checks reference equality, not content
            System.debug('Name matches John');
        }

        // Case-insensitive comparison
        if (firstName.equalsIgnoreCase('JOHN')) {
            System.debug('Name matches regardless of case');
        }

        // Null checking
        if (String.isNotBlank(firstName)) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // NULL-SAFE CHECK: Verifies string is not null, empty, or whitespace
            // → Use instead of manual null checks
            // ✅ BEST PRACTICE: Always check strings before operations
            System.debug('First name is valid: ' + firstName);
        }

        // String formatting
        String message = String.format('Hello {0}, you have {1} records',
                                      new List<Object>{firstName, recordCount});
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // STRING.FORMAT: Parameterized string construction
        // → More readable than concatenation for complex strings
        // 💡 PERFORMANCE: More efficient than multiple concatenations
    }

    private static Integer recordCount = 5; // Example variable
}
```

## Working with Numbers

Apex provides several numeric data types for different precision and range requirements. Choose the right type based on your specific needs.

```apex
public class NumericDataTypes {

    public static void demonstrateNumbers() {
        // Integer - whole numbers
        Integer maxRecords = 50000;
        Integer currentCount = 0;
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // INTEGER TYPE: 32-bit signed integers
        // → Range: -2,147,483,648 to 2,147,483,647
        // 💡 USE CASE: Record counts, IDs, simple calculations

        // Long - larger whole numbers
        Long largeNumber = 9223372036854775807L;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // LONG TYPE: 64-bit signed integers
        // → Range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
        // 💡 USE CASE: Timestamps, large record counts, file sizes

        // Decimal - precise decimal numbers
        Decimal price = 99.99;
        Decimal taxRate = 0.08;
        Decimal totalPrice = price * (1 + taxRate);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DECIMAL TYPE: Arbitrary precision decimal numbers
        // → No floating-point rounding errors
        // ✅ BEST PRACTICE: Use for currency and financial calculations

        // Double - floating-point numbers
        Double percentage = 85.7;
        Double scientificNumber = 1.23e-4; // 0.000123
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DOUBLE TYPE: 64-bit IEEE 754 floating-point
        // → Range: ~±1.7E±308 with 15-17 decimal digits precision
        // ⚠️ WARNING: Subject to floating-point precision issues

        // Mathematical operations
        Integer sum = maxRecords + currentCount;
        Decimal discountedPrice = price * 0.9;
        Double average = percentage / 100.0;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ARITHMETIC OPERATIONS: Standard math operators
        // → Type promotion: Integer + Decimal = Decimal
        // 💡 TIP: Be aware of type conversion in calculations

        // Type conversion
        Integer priceAsInt = (Integer) price; // Truncates: 99
        String priceAsString = String.valueOf(price); // '99.99'
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // TYPE CONVERSION: Explicit casting and conversion methods
        // → Casting truncates decimals, doesn't round
        // 💀 EXAM TRAP: (Integer) 99.99 becomes 99, not 100

        // Math class methods
        Integer absoluteValue = Math.abs(-42);
        Integer maximum = Math.max(10, 20);
        Double squareRoot = Math.sqrt(16.0);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // MATH CLASS: Rich set of mathematical functions
        // → All Math methods are static
        // 💡 USE CASE: Complex calculations, statistical operations
    }
}
```

## Boolean Logic and Conditionals

Booleans represent true/false values and are essential for conditional logic. Understanding boolean operations is crucial for control flow.

```apex
public class BooleanExamples {

    public static void demonstrateBooleans() {
        // Boolean declaration and initialization
        Boolean isValid = true;
        Boolean isCompleted = false;
        Boolean hasAccess; // null until assigned
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BOOLEAN VALUES: true, false, or null
        // → Three-valued logic in Apex (unlike Java)
        // 💀 EXAM TRAP: Uninitialized Boolean is null, not false

        // Logical operators
        Boolean bothTrue = isValid && isCompleted; // AND operator
        Boolean eitherTrue = isValid || isCompleted; // OR operator
        Boolean notValid = !isValid; // NOT operator
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // LOGICAL OPERATORS: Standard boolean algebra
        // → Short-circuit evaluation: && stops at first false, || stops at first true
        // 💡 PERFORMANCE: Order conditions by likelihood for efficiency

        // Comparison operators
        Integer score = 85;
        Boolean isPassing = score >= 70;
        Boolean isExcellent = score > 90;
        Boolean isExactly85 = score == 85;
        Boolean isNotZero = score != 0;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COMPARISON OPERATORS: Return boolean values
        // → == and != work with all data types
        // ⚠️ WARNING: Use .equals() for strings, not ==

        // Null handling in boolean context
        Boolean nullableBoolean = null;

        // Safe null checking
        if (nullableBoolean == true) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // EXPLICIT NULL CHECK: Compares to true, not just truthiness
            // → null == true is false
            // ✅ BEST PRACTICE: Explicit comparisons for nullable booleans
            System.debug('Boolean is explicitly true');
        }

        // Ternary operator
        String status = isPassing ? 'PASS' : 'FAIL';
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // TERNARY OPERATOR: Conditional expression
        // → condition ? valueIfTrue : valueIfFalse
        // 💡 USE CASE: Simple conditional assignments

        // Complex boolean expressions
        Boolean canProcess = (isValid && !isCompleted) ||
                           (score > 80 && hasAccess == true);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // COMPLEX EXPRESSIONS: Combine multiple conditions
        // → Use parentheses for clarity
        // ✅ BEST PRACTICE: Break complex conditions into variables
    }
}
```

## Date and Time Handling

Working with dates and times is crucial for business applications. Apex provides several types for different temporal needs.

```apex
public class DateTimeExamples {

    public static void demonstrateDates() {
        // Date - year, month, day only
        Date today = Date.today();
        Date specificDate = Date.newInstance(2025, 1, 15);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE TYPE: Year, month, day (no time component)
        // → newInstance(year, month, day) - month is 1-based
        // 💡 USE CASE: Birth dates, due dates, date-only comparisons

        // DateTime - date and time with timezone
        DateTime now = DateTime.now();
        DateTime specificDateTime = DateTime.newInstance(2025, 1, 15, 14, 30, 0);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATETIME TYPE: Complete timestamp with timezone awareness
        // → newInstance(year, month, day, hour, minute, second)
        // ⚠️ TIMEZONE: Always consider user's timezone in calculations

        // Time - hours, minutes, seconds only
        Time morningTime = Time.newInstance(9, 0, 0, 0);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // TIME TYPE: Hours, minutes, seconds, milliseconds (no date)
        // → newInstance(hour, minute, second, millisecond)
        // 💡 USE CASE: Business hours, time-only comparisons

        // Date arithmetic
        Date tomorrow = today.addDays(1);
        Date nextMonth = today.addMonths(1);
        Date nextYear = today.addYears(1);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE ARITHMETIC: Add/subtract time periods
        // → Returns new Date object (immutable)
        // 💡 TIP: Chain methods for complex calculations

        // DateTime arithmetic
        DateTime oneHourLater = now.addHours(1);
        DateTime nextWeek = now.addDays(7);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATETIME ARITHMETIC: More granular time operations
        // → addMinutes(), addSeconds(), addDays(), etc.

        // Date comparison
        Boolean isFuture = specificDate > today;
        Boolean isSameDay = specificDate == today;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE COMPARISON: Standard comparison operators
        // → Works with all date/time types
        // 💡 REMEMBER: == compares exact values, not ranges

        // Formatting
        String dateString = today.format();
        String customFormat = now.format('yyyy-MM-dd HH:mm:ss');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE FORMATTING: Convert to string representations
        // → format() uses user's locale settings
        // 💡 TIP: Use custom format for API integrations

        // Parsing from strings
        Date parsedDate = Date.valueOf('2025-01-15');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE PARSING: Convert strings to Date objects
        // → valueOf() expects YYYY-MM-DD format
        // 💀 EXAM TRAP: Wrong format throws exception
    }
}
```

---

# Type Conversion and Casting

Understanding how to convert between data types is essential for data manipulation and handling user input safely.

```apex
public class TypeConversion {

    public static void demonstrateConversions() {
        // String to numeric conversions
        String numberString = '42';
        String decimalString = '99.99';
        String invalidString = 'not-a-number';

        // Safe parsing with error handling
        try {
            Integer number = Integer.valueOf(numberString);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // INTEGER.VALUEOF: Converts string to Integer
            // → Throws exception for invalid format
            // 💡 ALWAYS: Wrap in try-catch for user input

            Decimal decimalValue = Decimal.valueOf(decimalString);
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // DECIMAL.VALUEOF: Converts string to Decimal
            // → More precise than Double for financial data

            System.debug('Converted values: ' + number + ', ' + decimalValue);

        } catch (TypeException e) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^
            // TYPE EXCEPTION: Thrown for invalid conversions
            // → Always handle for robust error handling
            // ✅ BEST PRACTICE: Provide user-friendly error messages
            System.debug('Invalid number format: ' + e.getMessage());
        }

        // Numeric to string conversions
        Integer count = 100;
        Decimal price = 29.99;

        String countString = String.valueOf(count);
        String priceString = String.valueOf(price);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // STRING.VALUEOF: Universal conversion to string
        // → Works with all data types, null-safe
        // 💡 PREFERRED: Over concatenation for single values

        // Explicit casting (truncation)
        Decimal originalPrice = 19.95;
        Integer wholeDollars = (Integer) originalPrice; // 19, not 20
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // EXPLICIT CASTING: Force type conversion
        // → Truncates decimals, doesn't round
        // 💀 EXAM TRAP: Casting truncates, valueOf() would round

        // Boolean conversions
        String boolString = 'true';
        Boolean boolValue = Boolean.valueOf(boolString);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // BOOLEAN.VALUEOF: Converts string to Boolean
        // → 'true' (case-insensitive) becomes true, everything else false
        // 💡 REMEMBER: Only 'true' string becomes true Boolean

        // Date conversions
        String dateString = '2025-01-15';
        Date convertedDate = Date.valueOf(dateString);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // DATE.VALUEOF: Converts YYYY-MM-DD string to Date
        // → Specific format required
        // ⚠️ FORMAT: Must be exactly YYYY-MM-DD or exception thrown

        // Null handling in conversions
        String nullString = null;
        String safeConversion = String.valueOf(nullString); // 'null'
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // NULL HANDLING: String.valueOf handles null gracefully
        // → Returns string 'null', not null value
        // 💡 SAFE: Unlike toString() which throws NullPointerException
    }
}
```

# Constants and Final Variables

Constants provide immutable values and improve code maintainability. They make your code more readable and easier to maintain.

```apex
public class Constants {

    // Class-level constants
    public static final Integer MAX_QUERY_LIMIT = 50000;
    public static final String DEFAULT_CURRENCY = 'USD';
    public static final Decimal TAX_RATE = 0.08;
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // STATIC FINAL: Class-level constants
    // → Initialized once, shared across all instances
    // ✅ NAMING: ALL_CAPS_WITH_UNDERSCORES convention

    private static final String API_ENDPOINT = 'https://api.example.com';
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // PRIVATE CONSTANTS: Internal implementation details
    // → Not accessible outside this class
    // 💡 ENCAPSULATION: Hide implementation-specific values

    public static void demonstrateConstants() {
        // Local final variables
        final String OPERATION_TYPE = 'INSERT';
        final List<String> VALID_STATUSES = new List<String>{'Active', 'Inactive'};
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // LOCAL FINAL: Method-scoped immutable variables
        // → Must be initialized when declared or in constructor
        // 💡 USE CASE: Configuration values, immutable references

        // Using constants in logic
        if (someRecordCount > MAX_QUERY_LIMIT) {
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // CONSTANT USAGE: Self-documenting code
            // → More readable than magic numbers
            // ✅ MAINTAINABILITY: Change in one place updates everywhere
            throw new QueryException('Query limit exceeded');
        }

        // Constants in calculations
        Decimal totalWithTax = calculatePrice() * (1 + TAX_RATE);
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // CALCULATION WITH CONSTANT: Clear business logic
        // → Tax rate changes only need one update
        // 💡 BUSINESS RULES: Constants document business logic

        // Immutable collections
        final Set<String> PROTECTED_FIELDS = new Set<String>{
            'CreatedDate', 'LastModifiedDate', 'SystemModstamp'
        };
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // IMMUTABLE REFERENCE: final keyword prevents reassignment
        // → Contents can still be modified unless using immutable collections
        // ⚠️ LIMITATION: final only prevents reassignment, not mutation
    }

    private static Decimal calculatePrice() {
        return 100.0; // Example implementation
    }
}
```

---

# Common Gotchas

These are the most frequent mistakes developers make when working with variables and data types. Understanding these pitfalls will save you hours of debugging.

## 💀 Null Pointer Exceptions

```apex
// BAD - Can cause NullPointerException
String name;
Integer length = name.length(); // NullPointerException!

// GOOD - Always check for null
String name;
Integer length = (name != null) ? name.length() : 0;

// BETTER - Use null-safe methods
Integer length = String.isBlank(name) ? 0 : name.length();
```

## ⚠️ String Comparison Pitfalls

```apex
// BAD - Reference comparison, not content
String name1 = 'John';
String name2 = getNameFromDatabase(); // Returns 'John'
if (name1 == name2) { // May be false even if content is same
    System.debug('Names match');
}

// GOOD - Content comparison
if (name1.equals(name2)) {
    System.debug('Names match');
}

// BETTER - Null-safe comparison
if (String.isNotBlank(name1) && name1.equals(name2)) {
    System.debug('Names match');
}
```

## 💡 Type Conversion Best Practices

```apex
// BAD - Casting truncates, doesn't round
Decimal price = 19.99;
Integer dollars = (Integer) price; // 19, not 20

// GOOD - Explicit rounding
Integer dollars = (Integer) Math.round(price); // 20

// BEST - Use appropriate method for intent
Integer dollars = price.round(); // 20, using Decimal's round method
```

---

# Exam Tips

This section focuses specifically on what you need to know for Salesforce certification exams. These concepts frequently appear in exam questions.

## High-Priority Concepts for Certification

1. **Variable Declaration**: Must specify data type, can initialize later
2. **String Methods**: equals() vs ==, null-safe operations
3. **Numeric Precision**: Decimal for currency, Integer for counts
4. **Boolean Logic**: Three-valued logic (true/false/null)
5. **Type Conversion**: valueOf() vs casting, exception handling

## Common Exam Scenarios

- **Null Handling**: Questions about uninitialized variables
- **String Comparison**: equals() vs == operator behavior
- **Type Casting**: Decimal to Integer truncation vs rounding
- **Boolean Logic**: Null boolean evaluation in conditions
- **Constants**: final keyword behavior and naming conventions

## Key Points to Remember

- Apex is strongly typed - must declare variable types
- Strings are immutable - methods return new objects
- Use Decimal for financial calculations to avoid rounding errors
- Always handle null values in user input and database queries
- Constants improve maintainability and self-document code

---

# Practice Exercises

Test your understanding with these hands-on exercises. Try to solve them before looking at the solutions.

## Exercise Overview

## Exercise 1: Variable Declaration and Initialization

Create a class that demonstrates proper variable declaration for a customer record:

```apex
public class Customer {
    // Declare appropriate variables for:
    // - Customer name (required)
    // - Email address (optional)
    // - Account balance (currency)
    // - Is active status (boolean)
    // - Registration date
    // - Last login timestamp
}
```

## Exercise 2: Type Conversion Challenge

Write a method that safely converts user input strings to appropriate data types:

```apex
public static Map<String, Object> parseUserInput(Map<String, String> inputData) {
    // Convert string inputs to appropriate types:
    // 'age' -> Integer
    // 'salary' -> Decimal
    // 'isManager' -> Boolean
    // 'startDate' -> Date
    // Handle invalid formats gracefully
}
```

## Exercise 3: Constants and Configuration

Create a configuration class with appropriate constants for a business application:

```apex
public class BusinessConfig {
    // Define constants for:
    // - Maximum file upload size
    // - Default pagination size
    // - Supported file types (List)
    // - Business hours (start/end times)
    // - Tax rates by region (Map)
}
```

---

# Related Topics

Understanding how this topic connects to other parts of the Apex curriculum will help you see the bigger picture.

## Prerequisites
- **None** - This is the foundation topic that all other Apex concepts build upon

## Next Steps in Your Learning Journey
- **[Collections Deep Dive](collections-deep-dive)** - Build on primitive types with Lists, Sets, and Maps
- **[Control Flow and Logic](control-flow-and-logic)** - Use variables in conditional statements and loops

## Advanced Topics You'll Encounter Later
- **[Object-Oriented Programming](object-oriented-programming)** - Create custom data types with classes
- **[Exception Handling](exception-handling)** - Handle type conversion errors gracefully

## Learning Path Summary
Variables and data types form the foundation of all Apex programming. Master these concepts thoroughly before moving to more complex topics. Every line of Apex code you write will use these fundamentals!

**Next Recommended Topic:** [Collections Deep Dive](collections-deep-dive) - Learn how to work with multiple values using Lists, Sets, and Maps.