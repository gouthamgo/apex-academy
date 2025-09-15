'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BookOpen,
  Code,
  Database,
  GitBranch,
  Layers,
  Search,
  Timer,
  TestTube,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import { AnnotatedCode } from '@/components/annotated-code';

interface Topic {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const topics: Topic[] = [
  {
    id: 'variables',
    title: 'Variables and Data Types',
    icon: BookOpen,
    description: 'Master Apex variables, primitive data types, and type conversion',
    content: (
      <div className="space-y-8">
        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <div className="prose prose-lg dark:prose-dark max-w-none">
            <p>
              Variables are the fundamental building blocks of any Apex program. Think of them as labeled containers that store information your code can use and manipulate. Understanding data types and how to work with them effectively is crucial for building robust Salesforce applications.
            </p>
            <p>
              In Apex, every variable must have a specific data type that determines what kind of information it can store. Apex is <strong>strongly typed</strong>, which means you must explicitly declare the type of every variable before you can use it.
            </p>
          </div>
        </section>

        {/* Core Concepts Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Concepts</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">What are Variables?</h3>
              <div className="prose dark:prose-dark max-w-none">
                <p>A variable is a named storage location in memory that holds data. In Apex, variables have three key characteristics:</p>
                <ul>
                  <li><strong>Name</strong>: A descriptive identifier you choose (like <code>customerName</code> or <code>totalPrice</code>)</li>
                  <li><strong>Type</strong>: What kind of data it can store (String, Integer, Boolean, etc.)</li>
                  <li><strong>Value</strong>: The actual data stored in the variable (can be null initially)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Data Types in Apex</h3>
              <div className="prose dark:prose-dark max-w-none">
                <p>Apex provides several built-in primitive data types:</p>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">String</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Text data and character sequences. Immutable with rich manipulation methods.</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Integer</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">Whole numbers (-2,147,483,648 to 2,147,483,647). Perfect for counts and IDs.</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">Boolean</h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200">True/false values with three-valued logic (true/false/null).</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100">Decimal</h4>
                    <p className="text-sm text-orange-800 dark:text-orange-200">Precise decimal numbers. Ideal for financial calculations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Variable Declaration Rules</h3>
              <div className="prose dark:prose-dark max-w-none">
                <ol>
                  <li>Must specify access modifier (public, private, global)</li>
                  <li>Must declare data type before variable name</li>
                  <li>Can optionally initialize with a value</li>
                  <li>Variable names must follow naming conventions</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Code Examples</h2>

          <div className="space-y-10">
            {/* Basic Variable Declaration - Complete Class */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Basic Variable Declaration (Complete Class)</h3>

              <AnnotatedCode
                code={`public class CustomerData {
    // Class-level variables (instance variables)
    private String customerName;
    // ✅ WHAT:
    //   - \`private\` = ACCESS MODIFIER (only this class can access)
    //   - \`String\` = TEXT data type
    //   - \`customerName\` = INSTANCE VARIABLE (camelCase naming)
    // ✅ WHY:
    //   - \`private\` = ENCAPSULATION (controlled access to data)
    //   - Instance variables store object state
    // 💥 EXAM TRAP:
    //   - Forgetting access modifier = COMPILATION ERROR
    //   - \`String customerName\` (no modifier) → COMPILE FAILS

    private Integer age;
    // ✅ WHAT:
    //   - \`Integer\` = WHOLE NUMBER container (no decimals)
    //   - Range: -2,147,483,648 to 2,147,483,647
    // ✅ WHY:
    //   - Age is always whole number, Integer prevents confusion
    //   - \`Integer\` safer than \`int\` (handles null values)
    // 💥 IF WRONG:
    //   - \`int age\` → COMPILE ERROR (Apex uses \`Integer\`, not \`int\`)
    //   - \`Double age\` → Allows decimals (25.5 years = confusing)

    private Boolean isActive;
    // ✅ WHAT:
    //   - \`Boolean\` = TRUE/FALSE container
    //   - \`isActive\` = DESCRIPTIVE name (starts with "is")
    // ✅ WHY:
    //   - \`Boolean\` = ONLY type for conditions (if/else)
    //   - Naming convention makes boolean instantly recognizable
    // 💥 IF WRONG:
    //   - \`boolean isActive\` → COMPILE ERROR (must be \`Boolean\`)
    //   - \`active\` (no "is" prefix) → unclear if boolean

    private Decimal accountBalance;
    // ✅ WHAT:
    //   - \`Decimal\` = PRECISE decimal numbers
    //   - Perfect for financial calculations
    // ✅ WHY:
    //   - \`Decimal\` avoids floating-point precision errors
    //   - Never loses cents in money calculations
    // 💥 EXAM TRAP:
    //   - Using \`Double\` for money = PRECISION LOSS
    //   - \`$19.99\` could become \`$19.990000000000002\`

    // Constructor
    public CustomerData(String name, Integer customerAge) {
        // ✅ WHAT:
        //   - \`public\` = ACCESSIBLE from outside class
        //   - \`CustomerData\` = CONSTRUCTOR (same name as class)
        //   - Parameters define required data for object creation
        // ✅ WHY:
        //   - Constructor INITIALIZES object state when created
        //   - Called automatically with \`new CustomerData('John', 25)\`
        // 💥 IF WRONG:
        //   - Wrong name → becomes regular method, not constructor
        //   - No constructor → objects created with null values

        this.customerName = name;
        // ✅ WHAT:
        //   - \`this.customerName\` = INSTANCE VARIABLE
        //   - \`name\` = PARAMETER VALUE
        //   - Assignment stores parameter in instance variable
        // ✅ WHY:
        //   - \`this.\` distinguishes between parameter and field
        //   - Required when parameter name conflicts with field name
        // 💥 IF WRONG:
        //   - \`customerName = name\` → might work but unclear
        //   - \`name = name\` → assigns parameter to itself (does nothing)

        this.age = customerAge;
        this.isActive = true;
        // ✅ WHAT:
        //   - Assign parameter value to instance variable
        //   - Set default status to active for new customers
        // ✅ WHY:
        //   - Explicit initialization prevents null values
        //   - Business rule: new customers start as active
        // 💥 IF SKIPPED:
        //   - Uninitialized variables default to NULL
        //   - Math with null = NULL POINTER EXCEPTION

        this.accountBalance = 0.0;
        // ✅ WHAT:
        //   - Initialize balance to zero decimal
        //   - \`0.0\` creates Decimal, not Integer
        // ✅ WHY:
        //   - Prevents null pointer exceptions in calculations
        //   - Safe starting point for financial operations
        // 💥 IF SKIPPED:
        //   - \`Decimal balance; balance += 100\` → NULL POINTER EXCEPTION
        //   - \`null + 100 = CRASH\` (not 100!)
    }

    // Getter methods
    public String getName() {
        return this.customerName;
        // ✅ WHAT:
        //   - \`public\` = ACCESSIBLE from outside class
        //   - \`return\` = SEND value back to caller
        // ✅ WHY:
        //   - Controlled access to private data (encapsulation)
        //   - Read-only access prevents unauthorized modifications
        // ✅ SECURITY:
        //   - Caller can read but not directly modify private field
    }

    public Integer getAge() {
        return this.age;
        // ✅ WHAT:
        //   - Simple getter for age field
        // ✅ WHY:
        //   - Consistent access pattern for all fields
        //   - Could add validation logic later if needed
    }
}`}
                annotations={[]}
              />
            </div>

            {/* String Operations - Complete Example */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">String Operations (Complete Example)</h3>

              <AnnotatedCode
                code={`public class StringDemo {
    public void demonstrateStrings() {
        String firstName = 'John';
        // ✅ WHAT:
        //   - \`String\` = TEXT container for character sequences
        //   - \`'John'\` = STRING LITERAL using single quotes
        // ✅ WHY:
        //   - \`String\` = ONLY type for text data in Apex
        //   - Single quotes = Apex string syntax (not double quotes)
        // 💥 IF WRONG:
        //   \`String name = "John"\` → COMPILE ERROR (must use single quotes)

        String lastName = 'Doe';
        String fullName = firstName + ' ' + lastName;
        // ✅ WHAT:
        //   - \`+\` = STRING CONCATENATION operator
        //   - \`' '\` = SPACE CHARACTER literal
        // ✅ WHY:
        //   - Simple way to join strings together
        //   - Result: 'John Doe' (combined string)
        // 💥 IF WRONG:
        //   Missing space → 'JohnDoe' (no separation)

        String companyName = firstName != null ? firstName + ' Corp' : 'Unknown';
        // ✅ WHAT:
        //   - \`!=\` = NULL CHECK (not equal to null)
        //   - \`? ... : ...\` = TERNARY OPERATOR (inline if/else)
        // ✅ WHY:
        //   - Prevents NullPointerException when field is empty
        //   - Shorter than full if/else block
        // 💥 IF SKIPPED:
        //   \`String companyName = firstName + ' Corp'\` → CRASH if firstName = null

        String message = String.format('Hello {0}, you are {1} years old',
                                       new List<String>{fullName, '25'});
        // ✅ WHAT:
        //   - \`String.format()\` = PARAMETERIZED string construction
        //   - \`{0}, {1}\` = PLACEHOLDERS for values
        //   - \`new List<String>{}\` = PARAMETER VALUES in order
        // ✅ WHY:
        //   - More readable than concatenation for complex strings
        //   - Template-based approach reduces errors
        // ✅ PERFORMANCE:
        //   - More efficient than multiple concatenations

        Boolean nameMatches = firstName.equals('John');
        // ✅ WHAT:
        //   - \`.equals()\` = STRING COMPARISON method
        //   - Compares string CONTENT, not object references
        // ✅ WHY:
        //   - Safe comparison that handles null values
        //   - Returns true/false based on actual text content
        // 💥 EXAM TRAP:
        //   - Using \`==\` compares references, not content
        //   - \`==\` gives unpredictable results for strings

        Boolean referenceCheck = firstName == 'John'; // DANGEROUS!
        // ✅ WHAT:
        //   - \`==\` = REFERENCE COMPARISON (object identity)
        //   - Checks if two variables point to same object
        // 💥 WHY DANGEROUS:
        //   - \`==\` checks memory addresses, not string content
        //   - Can return false even when strings look identical
        // 💥 IF USED:
        //   - Unpredictable results in production
        //   - Exam questions test this heavily (automatic points lost)

        Boolean nameExists = String.isNotBlank(fullName);
        // ✅ WHAT:
        //   - \`String.isNotBlank()\` = NULL-SAFE content check
        //   - Returns false for null, empty (''), or whitespace ('   ')
        // ✅ WHY:
        //   - Safer than \`fullName != null && fullName.length() > 0\`
        //   - Single method handles all edge cases
        // ✅ BEST PRACTICE:
        //   - Always use String.isBlank/isNotBlank for null-safe checks

        String upperName = fullName.toUpperCase();
        Integer nameLength = fullName.length();
        // ✅ WHAT:
        //   - \`.toUpperCase()\` = CONVERT to uppercase letters
        //   - \`.length()\` = GET character count
        // ✅ WHY:
        //   - Common operations for formatting and validation
        //   - \`length()\` useful for input validation

        System.debug('Full name: ' + fullName);
        System.debug('Message: ' + message);
        // ✅ WHAT:
        //   - \`System.debug()\` = OUTPUT to debug log
        //   - Concatenation for displaying variable values
        // ✅ WHY:
        //   - Essential for development and troubleshooting
        //   - Only appears in debug logs, not user interface
    }
}`}
                annotations={[]}
              />
            </div>

            {/* Type Conversion with Error Handling */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Type Conversion with Error Handling</h3>

              <AnnotatedCode
                code={`public class TypeConversionExample {
    public void convertAndValidate(String input) {
        try {
            // ✅ WHAT:
            //   - \`try\` = ATTEMPT potentially dangerous operations
            //   - Code inside try block might throw exceptions
            // ✅ WHY:
            //   - Type conversions can FAIL with invalid input
            //   - \`Integer.valueOf('abc')\` throws TypeException
            // ✅ BEST PRACTICE:
            //   - Always handle conversion exceptions in production
            //   - Never assume user input is valid

            Integer number = Integer.valueOf(input);
            // ✅ WHAT:
            //   - \`Integer.valueOf()\` = CONVERT string to integer
            //   - Takes string parameter, returns Integer object
            // ✅ WHY:
            //   - Safer than casting, provides clear error messages
            //   - Handles null input gracefully (returns null)
            // 💥 EXAM TRAP:
            //   - \`valueOf()\` throws TypeException for invalid input
            //   - '123' → 123 (success), 'abc' → TypeException (crash)
            // 💥 GOTCHA:
            //   - \`Integer.valueOf(null)\` returns null (doesn't crash)
            //   - \`Integer.valueOf('')\` throws exception (empty string fails)

            System.debug('Converted number: ' + number);

            String numberText = String.valueOf(number);
            // ✅ WHAT:
            //   - \`String.valueOf()\` = CONVERT any type to string
            //   - Universal conversion method for all data types
            // ✅ WHY:
            //   - Safe conversion, NEVER throws exceptions
            //   - Handles null values (returns 'null' string)
            // ✅ WORKS WITH:
            //   - Integer, Boolean, Decimal, Date, SObject, etc.
            //   - \`null\` becomes \`'null'\` (4-character string)

            System.debug('Back to string: ' + numberText);

            Decimal price = 19.99;
            Integer dollars = (Integer) Math.round(price);
            // ✅ WHAT:
            //   - \`Math.round()\` = ROUND decimal to nearest integer
            //   - \`(Integer)\` = TYPE CAST Double result to Integer
            // ✅ WHY:
            //   - Proper rounding BEFORE conversion to whole number
            //   - Financial calculations need precise rounding
            // 💥 DIFFERENCE:
            //   - Casting alone TRUNCATES: \`(Integer) 19.99\` → 19
            //   - Round then cast ROUNDS: \`(Integer) Math.round(19.99)\` → 20
            // ✅ FINANCIAL:
            //   - Always round currency before casting to Integer
            //   - Result: 19.99 → 20.0 → 20 (proper rounding)

            System.debug('Rounded price: ' + dollars);

            Boolean isValid = Boolean.valueOf('true');
            // ✅ WHAT:
            //   - \`Boolean.valueOf()\` = CONVERT string to Boolean
            //   - Case-insensitive conversion ('TRUE', 'True', 'true' all work)
            // ✅ WHY:
            //   - Handles 'true'/'false' strings properly
            //   - More explicit than manual string comparison
            // 💥 GOTCHA:
            //   - Only string 'true' (any case) returns true
            //   - EVERYTHING else returns false: 'false', 'yes', 'Y', '1', null
            //   - \`Boolean.valueOf('yes')\` → false (not true!)

            System.debug('Boolean value: ' + isValid);

        } catch (TypeException e) {
            // ✅ WHAT:
            //   - \`catch\` = HANDLE specific exception type
            //   - \`TypeException\` = Conversion/casting errors
            //   - \`e\` = Exception object with error details
            // ✅ WHY:
            //   - Graceful error handling prevents application crashes
            //   - Provides specific error information for debugging
            // ✅ PRODUCTION:
            //   - Log error details for developer analysis
            //   - Show user-friendly message (not technical details)

            System.debug('Conversion failed: ' + e.getMessage());
            // ✅ WHAT:
            //   - \`e.getMessage()\` = GET error description
            //   - Log the failure for debugging purposes
            // ✅ WHY:
            //   - Don't just ignore conversion failures silently
            //   - Error details help identify input validation issues
            // 💥 IF SKIPPED:
            //   - Silent failures make bugs impossible to track
            //   - Users get unexpected behavior with no explanation
        }
    }
}`}
                annotations={[]}
              />
            </div>
          </div>
        </section>

        {/* Common Gotchas Section */}
        <section>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">💀 Common Gotchas</h2>

          <div className="space-y-6">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Forgetting Access Modifiers</h3>
              <p className="text-red-800 dark:text-red-200 mb-4">Variables must have access modifiers (public/private/global). Omitting them causes compilation errors.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">❌ BAD</h4>
                  <AnnotatedCode
                    code="String name = 'John'; // Compilation error!"
                    annotations={[]}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✅ GOOD</h4>
                  <AnnotatedCode
                    code="private String name = 'John'; // Compiles successfully"
                    annotations={[]}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">String Quote Types</h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">Apex uses single quotes for string literals, not double quotes.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">❌ BAD</h4>
                  <AnnotatedCode
                    code='String message = "Hello World"; // Compilation error!'
                    annotations={[]}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✅ GOOD</h4>
                  <AnnotatedCode
                    code="String message = 'Hello World'; // Compiles successfully"
                    annotations={[]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Tips Section */}
        <section>
          <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">💡 Exam Tips</h2>

          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">High-Priority Certification Points</h3>

            <div className="prose dark:prose-dark max-w-none">
              <ul>
                <li><strong>Access Modifiers</strong>: Variables require explicit access modifiers (public/private/global)</li>
                <li><strong>String Literals</strong>: Use single quotes for string values in Apex</li>
                <li><strong>Integer Range</strong>: -2,147,483,648 to 2,147,483,647 (know the limits)</li>
                <li><strong>Boolean Logic</strong>: Three-valued logic (true/false/null) - common exam topic</li>
                <li><strong>Type Conversion</strong>: Always handle TypeException in production code</li>
              </ul>

              <h4 className="mt-6 mb-3">Common Exam Scenarios</h4>
              <ul>
                <li>Questions about uninitialized variable values (they're null, not default)</li>
                <li>String comparison using == vs .equals() (use .equals() for content)</li>
                <li>Type casting vs valueOf() methods (casting truncates, valueOf() may round)</li>
                <li>Null checking patterns for Boolean variables</li>
                <li>Access modifier requirements for class variables</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Practice Exercises Section */}
        <section>
          <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">🎯 Practice Exercises</h2>

          <div className="space-y-4">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Exercise 1: Variable Declaration</h3>
              <p className="text-purple-800 dark:text-purple-200">
                Create a class with properly declared variables for a customer record: Customer name (String), Age (Integer), Account balance (Decimal), Is VIP status (Boolean)
              </p>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Exercise 2: Safe Type Conversion</h3>
              <p className="text-purple-800 dark:text-purple-200">
                Write a method that safely converts a string to an integer with proper error handling.
              </p>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Exercise 3: Boolean Logic</h3>
              <p className="text-purple-800 dark:text-purple-200">
                Create a method that checks multiple Boolean conditions with null-safe logic.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">🎓 Key Takeaway</h3>
          <p className="text-blue-800 dark:text-blue-200">
            Understanding variables and data types is fundamental to all Apex programming. Master these concepts thoroughly - every line of Apex code you write will use these building blocks!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'collections',
    title: 'Collections Deep Dive',
    icon: Layers,
    description: 'Master Lists, Sets, Maps and bulkification patterns',
    content: (
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Collections are fundamental to writing efficient, scalable Apex code. Understanding when and how to use Lists, Sets, and Maps is crucial for bulkification, performance optimization, and building maintainable applications.
          </p>
        </section>
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">🚧 Coming Soon</h3>
          <p className="text-blue-800 dark:text-blue-200">
            Comprehensive coverage of Lists, Sets, Maps, and bulkification patterns with detailed code examples.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    icon: GitBranch,
    description: 'If/else, loops, switch statements and flow control',
    content: `# Control Flow

## Overview
Control flow statements determine the order in which your code executes. They allow you to make decisions, repeat actions, and branch execution based on conditions. Mastering control flow is essential for creating dynamic, responsive Apex applications.

Understanding when and how to use different control structures will make your code more efficient, readable, and maintainable.

## Core Concepts

### Conditional Statements
Control execution based on boolean conditions:

**If/Else**: Execute code based on conditions
**Switch**: Choose between multiple options efficiently
**Ternary Operator**: Inline conditional assignments

### Loop Statements
Repeat code execution:

**For Loops**: Iterate a specific number of times or over collections
**While Loops**: Repeat while a condition is true
**Do-While**: Execute at least once, then repeat while condition is true

### Flow Control
Alter normal execution flow:

**Break**: Exit loops early
**Continue**: Skip to next iteration
**Return**: Exit methods with optional return value

## Code Examples

### If/Else Statements

\`\`\`apex
public class ConditionalExamples {
    public static void demonstrateIfElse() {
        Integer score = 85;
        String grade;

        // Basic if/else
        if (score >= 90) {
            grade = 'A';
        } else if (score >= 80) {
            grade = 'B';
        } else if (score >= 70) {
            grade = 'C';
        } else if (score >= 60) {
            grade = 'D';
        } else {
            grade = 'F';
        }

        System.debug('Score: ' + score + ', Grade: ' + grade);

        // Complex conditions with logical operators
        Boolean isActive = true;
        Integer daysSinceLogin = 5;

        if (isActive && daysSinceLogin < 30) {
            System.debug('User is active and recently logged in');
        } else if (isActive && daysSinceLogin >= 30) {
            System.debug('User is active but needs to log in');
        } else {
            System.debug('User account is inactive');
        }

        // Null-safe conditions
        String userName = null;
        if (String.isNotBlank(userName)) {
            System.debug('Welcome, ' + userName);
        } else {
            System.debug('Welcome, Guest');
        }
    }
}
\`\`\`

### Switch Statements

\`\`\`apex
public class SwitchExamples {
    public static void demonstrateSwitch() {
        String dayOfWeek = 'Monday';
        String dayType;

        // Traditional switch with strings
        switch on dayOfWeek {
            when 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' {
                dayType = 'Weekday';
            }
            when 'Saturday', 'Sunday' {
                dayType = 'Weekend';
            }
            when else {
                dayType = 'Unknown';
            }
        }

        System.debug(dayOfWeek + ' is a ' + dayType);

        // Switch with enums
        System.LoggingLevel logLevel = System.LoggingLevel.INFO;

        switch on logLevel {
            when DEBUG {
                System.debug('Debug level logging enabled');
            }
            when INFO {
                System.debug('Info level logging enabled');
            }
            when WARN, ERROR {
                System.debug('Warning or Error level logging');
            }
            when else {
                System.debug('Unknown logging level');
            }
        }

        // Switch with integers
        Integer statusCode = 200;
        String statusMessage;

        switch on statusCode {
            when 200 {
                statusMessage = 'Success';
            }
            when 400, 401, 403 {
                statusMessage = 'Client Error';
            }
            when 500 {
                statusMessage = 'Server Error';
            }
            when else {
                statusMessage = 'Unknown Status';
            }
        }
    }
}
\`\`\`

### For Loops

\`\`\`apex
public class LoopExamples {
    public static void demonstrateForLoops() {
        // Traditional for loop
        for (Integer i = 0; i < 10; i++) {
            System.debug('Counter: ' + i);
        }

        // Enhanced for loop with List
        List<String> fruits = new List<String>{'Apple', 'Banana', 'Orange'};
        for (String fruit : fruits) {
            System.debug('Fruit: ' + fruit);
        }

        // Enhanced for loop with Set
        Set<Integer> uniqueNumbers = new Set<Integer>{1, 2, 3, 4, 5};
        for (Integer number : uniqueNumbers) {
            System.debug('Number: ' + number);
        }

        // For loop with Map
        Map<String, Integer> scoreMap = new Map<String, Integer>{
            'Alice' => 95,
            'Bob' => 87,
            'Carol' => 92
        };

        for (String student : scoreMap.keySet()) {
            Integer score = scoreMap.get(student);
            System.debug(student + ': ' + score);
        }

        // Nested for loops (be careful with performance)
        for (Integer i = 1; i <= 3; i++) {
            for (Integer j = 1; j <= 3; j++) {
                System.debug('i=' + i + ', j=' + j);
            }
        }
    }
}
\`\`\`

### While and Do-While Loops

\`\`\`apex
public class WhileLoopExamples {
    public static void demonstrateWhileLoops() {
        // While loop
        Integer counter = 0;
        while (counter < 5) {
            System.debug('While loop counter: ' + counter);
            counter++;
        }

        // Do-while loop (executes at least once)
        Integer attempts = 0;
        Boolean success = false;

        do {
            attempts++;
            System.debug('Attempt: ' + attempts);
            // Simulate some operation
            success = Math.random() > 0.7; // 30% chance of success
        } while (!success && attempts < 5);

        if (success) {
            System.debug('Operation succeeded after ' + attempts + ' attempts');
        } else {
            System.debug('Operation failed after ' + attempts + ' attempts');
        }

        // While loop with List processing
        List<String> items = new List<String>{'Item1', 'Item2', 'Item3'};
        Integer index = 0;

        while (index < items.size()) {
            String currentItem = items.get(index);
            System.debug('Processing: ' + currentItem);
            index++;
        }
    }
}
\`\`\`

### Flow Control (Break, Continue, Return)

\`\`\`apex
public class FlowControlExamples {
    public static void demonstrateFlowControl() {
        // Break - exit loop early
        for (Integer i = 0; i < 10; i++) {
            if (i == 5) {
                break; // Exit loop when i equals 5
            }
            System.debug('Break example - i: ' + i);
        }

        // Continue - skip current iteration
        for (Integer i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                continue; // Skip even numbers
            }
            System.debug('Continue example - odd number: ' + i);
        }

        // Break in nested loops
        outerLoop:
        for (Integer i = 0; i < 3; i++) {
            for (Integer j = 0; j < 3; j++) {
                System.debug('i=' + i + ', j=' + j);
                if (i == 1 && j == 1) {
                    break outerLoop; // Break out of both loops
                }
            }
        }
    }

    // Return examples
    public static String processGrade(Integer score) {
        if (score < 0 || score > 100) {
            return 'Invalid Score'; // Early return for invalid input
        }

        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    public static Boolean validateEmail(String email) {
        // Multiple early returns for different conditions
        if (String.isBlank(email)) {
            return false;
        }

        if (!email.contains('@')) {
            return false;
        }

        if (!email.contains('.')) {
            return false;
        }

        return true; // All validations passed
    }
}
\`\`\`

### Ternary Operator

\`\`\`apex
public class TernaryExamples {
    public static void demonstrateTernary() {
        Integer score = 85;

        // Basic ternary operator
        String result = (score >= 70) ? 'Pass' : 'Fail';
        System.debug('Result: ' + result);

        // Nested ternary (use sparingly)
        String grade = (score >= 90) ? 'A' :
                      (score >= 80) ? 'B' :
                      (score >= 70) ? 'C' : 'F';

        // Ternary with null checking
        String name = null;
        String displayName = (name != null) ? name : 'Guest';

        // Ternary for setting default values
        Integer maxRecords = null;
        Integer limit = (maxRecords != null) ? maxRecords : 100;

        // Ternary in method calls
        List<String> items = new List<String>();
        System.debug('List is ' + (items.isEmpty() ? 'empty' : 'not empty'));
    }
}
\`\`\`

## Key Points

- **Readability**: Choose the right control structure for clarity
- **Performance**: Switch statements are often faster than multiple if/else
- **Safety**: Always validate inputs before processing
- **Early Returns**: Use early returns to reduce nesting
- **Loop Safety**: Avoid infinite loops and watch governor limits
- **Break/Continue**: Use labeled breaks for nested loops when needed

## Best Practices

- Use **switch** for multiple discrete values
- Use **if/else** for range checking and complex conditions
- Prefer **enhanced for loops** over traditional for loops
- Use **early returns** to reduce complexity
- Always validate loop conditions to prevent infinite loops
- Consider **ternary operators** for simple conditional assignments
`
  },
  {
    id: 'classes',
    title: 'Classes and Methods',
    icon: Code,
    description: 'Object-oriented programming in Apex',
    content: `# Classes and Methods

Coming soon - comprehensive coverage of Apex classes, methods, constructors, and object-oriented programming concepts.`
  },
  {
    id: 'soql',
    title: 'SOQL and Database',
    icon: Database,
    description: 'Query data and database operations',
    content: `# SOQL and Database Operations

Coming soon - master SOQL queries, DML operations, and database best practices.`
  },
  {
    id: 'triggers',
    title: 'Triggers',
    icon: Timer,
    description: 'Apex triggers and automation patterns',
    content: `# Apex Triggers

Coming soon - trigger patterns, bulkification, and automation best practices.`
  },
  {
    id: 'async',
    title: 'Async Apex',
    icon: Search,
    description: 'Future methods, batch Apex, and queueable',
    content: `# Asynchronous Apex

Coming soon - future methods, batch Apex, queueable Apex, and scheduled Apex.`
  },
  {
    id: 'testing',
    title: 'Testing',
    icon: TestTube,
    description: 'Unit testing and test data management',
    content: `# Apex Testing

Coming soon - unit tests, test classes, test data factories, and testing best practices.`
  }
];

// Copy button component
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
      title="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = (content: string) => {
    const sections = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentCodeBlock = '';
    let inCodeBlock = false;
    let codeLanguage = '';

    sections.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <div key={index} className="my-6 relative group">
              <div className="relative">
                <SyntaxHighlighter
                  language={codeLanguage || 'apex'}
                  style={vscDarkPlus}
                  className="rounded-lg"
                  showLineNumbers={true}
                  customStyle={{
                    background: '#0f0f0f',
                    padding: '1.5rem',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
                    border: '1px solid #2d2d2d',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {currentCodeBlock.trim()}
                </SyntaxHighlighter>
                <CopyButton code={currentCodeBlock.trim()} />
              </div>
            </div>
          );
          currentCodeBlock = '';
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Start of code block
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        return;
      }

      if (inCodeBlock) {
        currentCodeBlock += line + '\n';
        return;
      }

      // Regular content parsing
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={index} className="font-semibold text-gray-900 dark:text-white mb-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-6 mb-1 text-gray-700 dark:text-gray-300">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.trim() && !line.startsWith('`')) {
        // Regular paragraph
        const processedLine = line
          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

        elements.push(
          <p
            key={index}
            className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Apex Academy
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out pt-16 shadow-lg
          lg:translate-x-0 lg:static lg:inset-0 lg:pt-0 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Apex Fundamentals
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Master Salesforce development step by step
              </p>
            </div>

            <nav className="space-y-1">
              {topics.map((topic, index) => {
                const Icon = topic.icon;
                const isSelected = selectedTopic.id === topic.id;
                const isCompleted = index < topics.findIndex(t => t.id === selectedTopic.id);

                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full text-left p-4 rounded-lg transition-all duration-200 group border
                      ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-gray-200 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 p-2 rounded-md mt-0.5
                        ${isSelected
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`
                            text-sm font-medium truncate
                            ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}
                          `}>
                            {topic.title}
                          </h3>
                          {isSelected && (
                            <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className={`
                          text-xs mt-1 truncate
                          ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}
                        `}>
                          {topic.description}
                        </p>

                        {/* Progress indicator */}
                        <div className="mt-2 flex items-center space-x-1">
                          <div className={`
                            h-1 w-full rounded-full
                            ${isCompleted
                              ? 'bg-green-400'
                              : isSelected
                              ? 'bg-blue-200 dark:bg-blue-700'
                              : 'bg-gray-200 dark:bg-gray-600'
                            }
                          `} />
                          {isCompleted && (
                            <div className="text-green-600 dark:text-green-400">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Learning Tip
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Work through topics in order. Each builds on previous concepts for optimal learning.
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Right Content Area */}
        <main className="flex-1 lg:ml-0 min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            {/* Topic Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <selectedTopic.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedTopic.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedTopic.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <div className="prose prose-lg dark:prose-dark max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:text-blue-900 dark:prose-blockquote:text-blue-100">
                  {typeof selectedTopic.content === 'string' ? renderContent(selectedTopic.content) : selectedTopic.content}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Topic {topics.findIndex(t => t.id === selectedTopic.id) + 1} of {topics.length}
                  </div>
                  <div className="flex space-x-3">
                    {topics.findIndex(t => t.id === selectedTopic.id) > 0 && (
                      <button
                        onClick={() => setSelectedTopic(topics[topics.findIndex(t => t.id === selectedTopic.id) - 1])}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        <span>Previous</span>
                      </button>
                    )}
                    {topics.findIndex(t => t.id === selectedTopic.id) < topics.length - 1 && (
                      <button
                        onClick={() => setSelectedTopic(topics[topics.findIndex(t => t.id === selectedTopic.id) + 1])}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>Next Topic</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}