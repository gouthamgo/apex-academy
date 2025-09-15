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
        {/* Connection to Previous Topic */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔗 Building on Variables</h2>
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>You just learned:</strong> Variables hold ONE value at a time (<code>String name = 'John'</code>)
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Now you'll learn:</strong> Collections hold MULTIPLE values of the same type (<code>List&lt;String&gt; names = new List&lt;String&gt;{`{'John', 'Jane', 'Bob'}`}</code>)
            </p>
          </div>
        </section>

        {/* Core Concepts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Concepts</h2>

          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Why Collections Matter</h3>
              <div className="prose dark:prose-dark max-w-none">
                <p><strong>Real-world problem:</strong> You need to process 200 Contact records. Without collections, you'd need 200 separate variables!</p>
                <ul>
                  <li><strong>Variables:</strong> Hold ONE value → <code>String contact1Name, contact2Name, contact3Name...</code> (impossible to manage)</li>
                  <li><strong>Collections:</strong> Hold MANY values → <code>List&lt;String&gt; allContactNames</code> (clean and manageable)</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Lists</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2"><strong>WHEN:</strong> Order matters, duplicates allowed</p>
                <p className="text-sm text-blue-800 dark:text-blue-200"><strong>EXAMPLE:</strong> Task priorities, transaction history</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Sets</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2"><strong>WHEN:</strong> Uniqueness required, fast lookup</p>
                <p className="text-sm text-purple-800 dark:text-purple-200"><strong>EXAMPLE:</strong> Unique email addresses, processed IDs</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🗺️ Maps</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-2"><strong>WHEN:</strong> Key-value relationships, fast retrieval</p>
                <p className="text-sm text-green-800 dark:text-green-200"><strong>EXAMPLE:</strong> Account ID → Account Name</p>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Code Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Code Examples</h2>

          <div className="space-y-10">
            {/* List Operations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Lists - Managing Multiple Values</h3>

              <AnnotatedCode
                code={`public class ListDemo {
    public void demonstrateLists() {
        // ✅ BUILDING ON: You know String variables hold one text value
        String singleName = 'John';
        // ✅ WHAT: One variable = one value (what you already know)

        // ✅ NEW CONCEPT: List holds MULTIPLE values of same type
        List<String> allNames = new List<String>();
        // ✅ WHAT:
        //   - \`List<String>\` = CONTAINER for multiple text values
        //   - \`new List<String>()\` = CREATE empty container
        // ✅ WHY List<String>:
        //   - Tells Apex "this list only holds text values"
        //   - Prevents mixing types (can't accidentally add numbers)
        // 💥 EXAM TRAP:
        //   - \`List names;\` (without <String>) = COMPILATION ERROR
        //   - Must specify what TYPE the list contains

        // ✅ ADDING VALUES: Build the list step by step
        allNames.add('John');
        allNames.add('Jane');
        allNames.add('Bob');
        // ✅ WHAT:
        //   - \`.add()\` = PUT values INTO the list
        //   - Each call adds one more value to the end
        // ✅ WHY:
        //   - Lists maintain ORDER: John=position 0, Jane=1, Bob=2
        //   - Order matters for processing sequences
        // 💥 IF WRONG:
        //   - \`allNames.add(25);\` → COMPILE ERROR (25 is Integer, not String)

        // ✅ ALTERNATIVE: Initialize with values directly
        List<String> quickNames = new List<String>{'Alice', 'Charlie', 'Diana'};
        // ✅ WHAT:
        //   - Creates list AND adds values in one line
        //   - Curly braces \`{}\` contain initial values
        // ✅ WHY:
        //   - More efficient than multiple .add() calls
        //   - Cleaner when you know values upfront

        // ✅ ACCESSING VALUES: Get specific items by position
        if (allNames.size() > 0) {
            // ✅ WHAT:
            //   - \`.size()\` = COUNT how many items in list
            //   - Check prevents "index out of bounds" errors
            // ✅ WHY size() check FIRST:
            //   - Empty list has size 0
            //   - \`.get(0)\` on empty list = CRASH
            // 💥 IF SKIPPED:
            //   - \`allNames.get(0)\` on empty list → LIST EXCEPTION

            String firstName = allNames.get(0);
            String lastName = allNames.get(allNames.size() - 1);
            // ✅ WHAT:
            //   - \`.get(0)\` = GET first item (position 0)
            //   - \`.get(size() - 1)\` = GET last item
            // ✅ WHY:
            //   - Lists start counting at 0, not 1
            //   - Last position = total count minus 1
            // 💥 EXAM TRAP:
            //   - \`.get(allNames.size())\` → INDEX OUT OF BOUNDS (too high by 1)

            System.debug('First: ' + firstName + ', Last: ' + lastName);
        }

        // ✅ PROCESSING ALL VALUES: Loop through entire list
        for (String currentName : allNames) {
            // ✅ WHAT:
            //   - \`for (String currentName : allNames)\` = ENHANCED FOR LOOP
            //   - \`currentName\` = TEMPORARY variable for each item
            // ✅ WHY:
            //   - Automatically goes through every item in order
            //   - No need to track positions or worry about boundaries
            // ✅ PERFORMANCE:
            //   - More efficient than traditional for loops
            //   - Reads each item exactly once

            System.debug('Processing name: ' + currentName);

            // Real-world example: Format each name
            String formattedName = currentName.toUpperCase();
            System.debug('Formatted: ' + formattedName);
        }

        // ✅ LIST METHODS: Common operations you'll use constantly
        Boolean hasJohn = allNames.contains('John');
        // ✅ WHAT: Check if specific value exists in list
        // ✅ WHY: Avoids manual loops for simple existence checks

        Integer position = allNames.indexOf('Jane');
        // ✅ WHAT: Find POSITION of value (returns -1 if not found)
        // ✅ WHY: Useful for conditional processing based on position

        allNames.remove(1); // Removes 'Jane' (position 1)
        // ✅ WHAT: Remove item at specific position
        // ✅ WHY: Lists automatically shift remaining items down
        // 💥 GOTCHA: After removal, all positions change!

        System.debug('Final list size: ' + allNames.size());
    }
}`}
                annotations={[]}
              />
            </div>

            {/* Set Operations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Sets - Enforcing Uniqueness</h3>

              <AnnotatedCode
                code={`public class SetDemo {
    public void demonstrateSets() {
        // ✅ BUILDING ON: Lists allow duplicates, Sets enforce uniqueness
        List<String> listWithDuplicates = new List<String>{'John', 'Jane', 'John'};
        // ✅ WHAT: This list happily contains 'John' twice
        // ✅ PROBLEM: Sometimes duplicates cause business logic errors

        // ✅ NEW CONCEPT: Set automatically prevents duplicates
        Set<String> uniqueNames = new Set<String>();
        // ✅ WHAT:
        //   - \`Set<String>\` = CONTAINER for unique text values only
        //   - No duplicates allowed, ever
        // ✅ WHY:
        //   - Perfect for tracking processed IDs
        //   - Ensures business rules about uniqueness
        // ✅ PERFORMANCE:
        //   - \`.contains()\` is MUCH faster than List (no loop needed)

        // ✅ ADDING VALUES: Duplicates ignored automatically
        uniqueNames.add('John');
        uniqueNames.add('Jane');
        uniqueNames.add('John'); // This is IGNORED (duplicate)
        uniqueNames.add('Bob');
        // ✅ WHAT:
        //   - \`.add()\` attempts to add value
        //   - Returns true if added, false if duplicate
        // ✅ WHY:
        //   - Set only contains: {'John', 'Jane', 'Bob'}
        //   - Size is 3, not 4 (second 'John' ignored)
        // 💥 EXAM TRAP:
        //   - Don't assume .add() always increases size!

        System.debug('Set size: ' + uniqueNames.size()); // Prints 3, not 4

        // ✅ REAL-WORLD EXAMPLE: Remove duplicates from List
        List<String> emailsWithDuplicates = new List<String>{
            'john@email.com', 'jane@email.com', 'john@email.com', 'bob@email.com'
        };
        // ✅ PROBLEM: Email list has duplicates (bad for marketing)

        Set<String> uniqueEmails = new Set<String>(emailsWithDuplicates);
        // ✅ WHAT:
        //   - \`new Set<String>(listVariable)\` = CONVERT List to Set
        //   - Automatically removes duplicates during conversion
        // ✅ WHY:
        //   - One line of code fixes duplicate problem
        //   - Much faster than manual loop checking

        List<String> cleanEmailList = new List<String>(uniqueEmails);
        // ✅ WHAT:
        //   - \`new List<String>(setVariable)\` = CONVERT Set back to List
        //   - Now you have List without duplicates
        // ✅ WHY:
        //   - Sometimes you need List features (ordering, indexing)
        //   - But want Set's duplicate removal

        System.debug('Original emails: ' + emailsWithDuplicates.size());
        System.debug('Unique emails: ' + cleanEmailList.size());

        // ✅ SET OPERATIONS: Fast lookups and membership testing
        Boolean hasJohn = uniqueNames.contains('John');
        // ✅ WHAT: Check if value exists in set
        // ✅ WHY: MUCH faster than List.contains() for large datasets
        // ✅ PERFORMANCE: O(1) vs O(n) - constant time vs linear time

        // ✅ PRACTICAL EXAMPLE: Track processed record IDs
        Set<Id> processedAccountIds = new Set<Id>();
        // ✅ WHAT: Track which Account records we've already handled
        // ✅ WHY: Prevents duplicate processing in complex business logic

        // Simulate processing accounts
        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 5];
        for (Account acc : accounts) {
            if (!processedAccountIds.contains(acc.Id)) {
                // ✅ WHAT: Only process if we haven't seen this ID before
                // ✅ WHY: Prevents infinite loops and duplicate work

                System.debug('Processing account: ' + acc.Name);
                processedAccountIds.add(acc.Id);
                // ✅ WHAT: Mark this ID as processed
                // ✅ WHY: Future checks will skip this account
            }
        }

        // ✅ SET ITERATION: Process each unique value
        for (String email : uniqueEmails) {
            // ✅ WHAT: Loop through each unique email
            // ✅ WHY: Guaranteed no duplicates to handle
            // 💥 GOTCHA: Sets have NO guaranteed order (unlike Lists)

            System.debug('Sending newsletter to: ' + email);
        }
    }
}`}
                annotations={[]}
              />
            </div>

            {/* Map Operations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Maps - Key-Value Relationships</h3>

              <AnnotatedCode
                code={`public class MapDemo {
    public void demonstrateMaps() {
        // ✅ BUILDING ON: Lists/Sets hold values, Maps connect keys to values
        List<String> accountNames = new List<String>{'Acme Corp', 'Global Inc'};
        // ✅ PROBLEM: How do you connect account ID to account name?
        // ✅ SOLUTION: Maps create key → value relationships

        // ✅ NEW CONCEPT: Map stores key-value pairs
        Map<Id, String> accountIdToName = new Map<Id, String>();
        // ✅ WHAT:
        //   - \`Map<Id, String>\` = ID keys pointing to String values
        //   - Each ID maps to exactly one name
        // ✅ WHY:
        //   - Fast lookup: give me ID, get back name instantly
        //   - Perfect for relating Salesforce records
        // ✅ PERFORMANCE:
        //   - Lookup by key is O(1) - constant time, super fast

        // ✅ ADDING KEY-VALUE PAIRS: Build relationships
        // Note: Using fake IDs for demonstration
        Id acmeId = '001000000000001';
        Id globalId = '001000000000002';

        accountIdToName.put(acmeId, 'Acme Corp');
        accountIdToName.put(globalId, 'Global Inc');
        // ✅ WHAT:
        //   - \`.put(key, value)\` = CREATE or UPDATE relationship
        //   - Key acmeId now points to 'Acme Corp'
        // ✅ WHY:
        //   - Maps store relationships, not just individual values
        //   - Each key can only have ONE value (overwrites if repeated)
        // 💥 EXAM TRAP:
        //   - \`map.put(sameKey, newValue)\` OVERWRITES old value

        // ✅ ALTERNATIVE: Initialize with values directly
        Map<String, Integer> scoreMap = new Map<String, Integer>{
            'John' => 95,
            'Jane' => 87,
            'Bob' => 92
        };
        // ✅ WHAT:
        //   - Creates map AND adds pairs in one line
        //   - \`=>\` connects key to value
        // ✅ WHY:
        //   - Cleaner syntax when you know relationships upfront
        //   - More readable than multiple .put() calls

        // ✅ RETRIEVING VALUES: Get value by providing key
        String acmeName = accountIdToName.get(acmeId);
        // ✅ WHAT:
        //   - \`.get(key)\` = RETRIEVE value associated with key
        //   - Returns the value, or null if key doesn't exist
        // ✅ WHY:
        //   - Instant lookup - no loops needed
        //   - Much faster than searching through Lists
        // 💥 GOTCHA:
        //   - \`.get(nonExistentKey)\` returns NULL (doesn't crash)

        // ✅ SAFE RETRIEVAL: Always check for null
        Id unknownId = '001000000000999';
        String unknownName = accountIdToName.get(unknownId);
        if (unknownName != null) {
            System.debug('Found account: ' + unknownName);
        } else {
            System.debug('Account not found for ID: ' + unknownId);
        }
        // ✅ WHAT:
        //   - Check if .get() returned actual value or null
        //   - Handle both cases appropriately
        // ✅ WHY:
        //   - Prevents null pointer exceptions
        //   - Makes code defensive and robust
        // 💥 IF SKIPPED:
        //   - \`unknownName.toUpperCase()\` → NULL POINTER EXCEPTION

        // ✅ ALTERNATIVE: containsKey() for existence checking
        if (accountIdToName.containsKey(acmeId)) {
            String safeName = accountIdToName.get(acmeId);
            System.debug('Definitely found: ' + safeName);
        }
        // ✅ WHAT:
        //   - \`.containsKey()\` = CHECK if key exists (true/false)
        //   - Only call .get() after confirming key exists
        // ✅ WHY:
        //   - More explicit than null checking
        //   - Separates existence check from value retrieval

        // ✅ REAL-WORLD BULKIFICATION PATTERN
        List<Contact> contacts = [SELECT Id, AccountId, Name FROM Contact LIMIT 100];

        // Step 1: Collect all unique Account IDs
        Set<Id> accountIds = new Set<Id>();
        for (Contact con : contacts) {
            if (con.AccountId != null) {
                accountIds.add(con.AccountId);
            }
        }
        // ✅ WHAT:
        //   - Extract all Account IDs from Contact records
        //   - Set automatically handles duplicates
        // ✅ WHY:
        //   - Prepare for bulk query (no loops in loops)
        //   - Only query for IDs we actually need

        // Step 2: Bulk query Account names
        Map<Id, Account> accountMap = new Map<Id, Account>(
            [SELECT Id, Name FROM Account WHERE Id IN :accountIds]
        );
        // ✅ WHAT:
        //   - \`new Map<Id, Account>(queryResult)\` = SOQL to Map conversion
        //   - Automatically creates ID → Account mappings
        // ✅ WHY:
        //   - ONE query instead of 100 separate queries
        //   - Governor limit friendly (max 100 SOQL per transaction)
        // ✅ PERFORMANCE:
        //   - Bulk query: ~5ms, Individual queries: ~500ms

        // Step 3: Process all Contacts with Account names
        for (Contact con : contacts) {
            Account relatedAccount = accountMap.get(con.AccountId);
            if (relatedAccount != null) {
                System.debug(con.Name + ' works at ' + relatedAccount.Name);
            } else {
                System.debug(con.Name + ' has no account');
            }
        }
        // ✅ WHAT:
        //   - Use map for instant Account lookup per Contact
        //   - No additional queries needed
        // ✅ WHY:
        //   - Processes 100 Contacts with 1 query, not 100 queries
        //   - Scalable pattern for any volume of data
        // 💥 WITHOUT MAPS:
        //   - Would need query inside loop = GOVERNOR LIMIT EXCEEDED

        // ✅ MAP UTILITY METHODS: Working with keys and values
        Set<Id> allAccountIds = accountIdToName.keySet();
        // ✅ WHAT: Get all keys from map as a Set
        // ✅ WHY: Useful for bulk operations on all keys

        List<String> allAccountNames = accountIdToName.values();
        // ✅ WHAT: Get all values from map as a List
        // ✅ WHY: Process all values without caring about keys

        System.debug('Map size: ' + accountIdToName.size());
        System.debug('Keys: ' + allAccountIds);
        System.debug('Values: ' + allAccountNames);
    }
}`}
                annotations={[]}
              />
            </div>
          </div>
        </section>

        {/* Common Gotchas */}
        <section>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">💀 Common Gotchas</h2>

          <div className="space-y-6">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Index Out of Bounds</h3>
              <p className="text-red-800 dark:text-red-200 mb-4">Lists crash when you try to access positions that don't exist.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">💀 DANGEROUS</h4>
                  <AnnotatedCode
                    code={`List<String> names = new List<String>{'John'};
String second = names.get(1); // CRASH! Only position 0 exists`}
                    annotations={[]}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✅ SAFE</h4>
                  <AnnotatedCode
                    code={`List<String> names = new List<String>{'John'};
if (names.size() > 1) {
    String second = names.get(1);
}`}
                    annotations={[]}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Map.get() Returns Null</h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">Maps don't crash for missing keys, they return null.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">💀 DANGEROUS</h4>
                  <AnnotatedCode
                    code={`Map<Id, String> names = new Map<Id, String>();
String name = names.get(someId);
Integer length = name.length(); // CRASH if someId not in map`}
                    annotations={[]}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✅ SAFE</h4>
                  <AnnotatedCode
                    code={`Map<Id, String> names = new Map<Id, String>();
String name = names.get(someId);
if (name != null) {
    Integer length = name.length();
}`}
                    annotations={[]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real World Application */}
        <section>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">🌍 Real-World Application</h2>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Why This Matters in Production</h3>

            <div className="prose dark:prose-dark max-w-none">
              <ul>
                <li><strong>Lists:</strong> Processing form submissions, managing workflow steps, storing calculation results</li>
                <li><strong>Sets:</strong> Preventing duplicate email sends, tracking processed records, enforcing business rules</li>
                <li><strong>Maps:</strong> Relating child records to parents, caching lookup values, building bulk operations</li>
              </ul>

              <p className="mt-4"><strong>Critical for Governor Limits:</strong> Collections enable bulk processing that stays within Salesforce's execution limits. Without them, your code crashes in production.</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">🚀 Next Steps</h2>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              <strong>You now have data in Lists, Sets, and Maps.</strong> Next, you'll learn <strong>Control Flow</strong> - how to make decisions and process that data efficiently with if/else statements and loops.
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              Control Flow will teach you: <em>"How do you process 200 Lead records and update only the qualified ones?"</em>
            </p>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    icon: GitBranch,
    description: 'If/else, loops, switch statements and flow control',
    content: (
      <div className="space-y-8">
        {/* Connection to Previous Topic */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔗 Building on Collections</h2>
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>You just learned:</strong> How to store multiple values in Lists, Sets, and Maps
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Now you'll learn:</strong> How to make decisions about that data and process it efficiently with if/else, loops, and flow control
            </p>
          </div>
        </section>

        {/* Core Concepts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Concepts</h2>

          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Why Control Flow Matters</h3>
              <div className="prose dark:prose-dark max-w-none">
                <p><strong>Real-world problem:</strong> "Process 200 Lead records, but only update the qualified ones with score greater than 50."</p>
                <p><strong>Solution:</strong> Control flow lets you make decisions (if/else) and repeat actions (loops) to handle complex business logic efficiently.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🤔 Decisions</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-2"><strong>IF/ELSE:</strong> Different actions based on conditions</p>
                <p className="text-sm text-green-800 dark:text-green-200"><strong>SWITCH:</strong> Multiple options efficiently</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🔄 Repetition</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2"><strong>FOR LOOPS:</strong> Process collections or count</p>
                <p className="text-sm text-blue-800 dark:text-blue-200"><strong>WHILE:</strong> Repeat until condition changes</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">⚡ Flow Control</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2"><strong>BREAK/CONTINUE:</strong> Alter loop behavior</p>
                <p className="text-sm text-purple-800 dark:text-purple-200"><strong>RETURN:</strong> Exit methods early</p>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Code Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Code Examples</h2>

          <div className="space-y-10">
            {/* If/Else Decisions */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Making Decisions with If/Else</h3>

              <AnnotatedCode
                code={`public class DecisionMaker {
    public void processLeadScores() {
        // ✅ BUILDING ON: You have a List of Lead records (from Collections)
        List<Lead> allLeads = [SELECT Id, Name, Score__c, Status FROM Lead LIMIT 100];
        // ✅ WHAT: Query returns List of Lead records with score data
        // ✅ WHY: Real-world scenario - process multiple leads efficiently

        // ✅ DECISION-MAKING: Process each lead with business logic
        for (Lead currentLead : allLeads) {
            // ✅ WHAT: Enhanced for loop processes each Lead in the List
            // ✅ WHY: Iterate through collection to apply business rules

            // ✅ BASIC IF/ELSE: Make decisions based on lead score
            if (currentLead.Score__c >= 80) {
                // ✅ WHAT:
                //   - \`if\` = CHECK condition first
                //   - \`currentLead.Score__c >= 80\` = BOOLEAN EXPRESSION
                // ✅ WHY:
                //   - High-value leads get priority treatment
                //   - Business rule: 80+ score = hot lead
                // 💥 EXAM TRAP:
                //   - Always check for null: \`if (currentLead.Score__c != null && currentLead.Score__c >= 80)\`

                currentLead.Status = 'Hot Lead';
                currentLead.Priority__c = 'High';
                System.debug('HOT: ' + currentLead.Name + ' (Score: ' + currentLead.Score__c + ')');

            } else if (currentLead.Score__c >= 50) {
                // ✅ WHAT:
                //   - \`else if\` = ADDITIONAL condition if first fails
                //   - Only checked if previous condition was false
                // ✅ WHY:
                //   - Different treatment for medium-value leads
                //   - Sequential decision making

                currentLead.Status = 'Warm Lead';
                currentLead.Priority__c = 'Medium';
                System.debug('WARM: ' + currentLead.Name + ' (Score: ' + currentLead.Score__c + ')');

            } else if (currentLead.Score__c > 0) {
                // ✅ WHAT: Handle low-value but positive scores
                // ✅ WHY: Still has some potential, different strategy

                currentLead.Status = 'Cold Lead';
                currentLead.Priority__c = 'Low';
                System.debug('COLD: ' + currentLead.Name + ' (Score: ' + currentLead.Score__c + ')');

            } else {
                // ✅ WHAT:
                //   - \`else\` = CATCH-ALL for any remaining cases
                //   - Executes if ALL previous conditions failed
                // ✅ WHY:
                //   - Handle edge cases (null scores, zero scores, negative)
                //   - Defensive programming - always have a fallback

                currentLead.Status = 'Unqualified';
                currentLead.Priority__c = 'None';
                System.debug('UNQUALIFIED: ' + currentLead.Name + ' (Score: ' + currentLead.Score__c + ')');
            }

            // ✅ COMPLEX CONDITIONS: Multiple criteria with logical operators
            Boolean isActive = currentLead.IsActive__c;
            Integer daysSinceContact = currentLead.Days_Since_Contact__c;

            if (isActive && daysSinceContact <= 7 && currentLead.Score__c >= 60) {
                // ✅ WHAT:
                //   - \`&&\` = LOGICAL AND (all conditions must be true)
                //   - Combines three different boolean expressions
                // ✅ WHY:
                //   - Complex business rules require multiple criteria
                //   - All conditions must pass for special treatment
                // 💥 EXAM TRAP:
                //   - \`&&\` vs \`||\` (AND vs OR) - different meanings!

                currentLead.Follow_Up_Required__c = true;
                System.debug('IMMEDIATE FOLLOW-UP: ' + currentLead.Name);

            } else if (isActive || currentLead.Score__c >= 90) {
                // ✅ WHAT:
                //   - \`||\` = LOGICAL OR (any condition can be true)
                //   - Either active OR high score triggers this
                // ✅ WHY:
                //   - Flexible criteria - multiple paths to qualification
                //   - Business rule: active leads OR super high scores get attention

                currentLead.Follow_Up_Required__c = true;
                currentLead.Follow_Up_Days__c = 3;
                System.debug('FOLLOW-UP SCHEDULED: ' + currentLead.Name);

            } else {
                // ✅ WHAT: Default action when complex conditions not met
                currentLead.Follow_Up_Required__c = false;
                System.debug('NO FOLLOW-UP: ' + currentLead.Name);
            }

            // ✅ NULL-SAFE CONDITIONS: Defensive programming
            if (String.isNotBlank(currentLead.Email)) {
                // ✅ WHAT:
                //   - \`String.isNotBlank()\` = NULL-SAFE string checking
                //   - Returns false for null, empty (''), or whitespace ('   ')
                // ✅ WHY:
                //   - Prevents null pointer exceptions
                //   - More robust than \`currentLead.Email != null\`
                // 💥 IF WRONG:
                //   - \`currentLead.Email.contains('@')\` → CRASH if Email is null

                System.debug('CAN EMAIL: ' + currentLead.Email);
                currentLead.Email_Valid__c = currentLead.Email.contains('@');

            } else {
                System.debug('NO EMAIL: ' + currentLead.Name);
                currentLead.Email_Valid__c = false;
            }
        }

        // ✅ BULK UPDATE: Apply all changes efficiently
        update allLeads;
        // ✅ WHAT: Single DML operation updates all modified records
        // ✅ WHY: Governor limit friendly - 1 DML instead of 100
        // ✅ PERFORMANCE: Bulk operations are much faster
    }
}`}
                annotations={[]}
              />
            </div>

            {/* Switch Statements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Switch Statements for Multiple Options</h3>

              <AnnotatedCode
                code={`public class StatusProcessor {
    public void processAccountsByType() {
        // ✅ BUILDING ON: You have Map of Account data (from Collections)
        Map<Id, Account> accountMap = new Map<Id, Account>(
            [SELECT Id, Name, Type, Industry FROM Account LIMIT 50]
        );
        // ✅ WHAT: Map enables fast lookups by Account ID
        // ✅ WHY: Efficient processing of related records

        // ✅ SWITCH STATEMENT: Efficient multi-way decisions
        for (Account acc : accountMap.values()) {
            String processingPriority;
            Decimal discountRate;

            // ✅ SWITCH ON STRING: Handle account types efficiently
            switch on acc.Type {
                // ✅ WHAT:
                //   - \`switch on variable\` = EVALUATE variable against cases
                //   - Much faster than multiple if/else for many options
                // ✅ WHY:
                //   - Cleaner syntax than long if/else chains
                //   - Better performance for 3+ options
                // ✅ PERFORMANCE:
                //   - O(1) lookup vs O(n) if/else chain

                when 'Customer - Direct' {
                    processingPriority = 'High';
                    discountRate = 0.15;
                    acc.Processing_Notes__c = 'Direct customer - priority support';
                }
                when 'Customer - Channel' {
                    processingPriority = 'Medium';
                    discountRate = 0.10;
                    acc.Processing_Notes__c = 'Channel customer - standard support';
                }
                when 'Prospect' {
                    processingPriority = 'Low';
                    discountRate = 0.05;
                    acc.Processing_Notes__c = 'Prospect - nurture campaign';
                }
                when 'Partner', 'Reseller' {
                    // ✅ WHAT:
                    //   - MULTIPLE VALUES in single case (comma-separated)
                    //   - Both 'Partner' and 'Reseller' execute this code
                    // ✅ WHY:
                    //   - Avoid code duplication for similar cases
                    //   - Clean handling of equivalent business scenarios

                    processingPriority = 'High';
                    discountRate = 0.20;
                    acc.Processing_Notes__c = 'Partner - special pricing';
                }
                when else {
                    // ✅ WHAT:
                    //   - \`when else\` = DEFAULT CASE (like final else)
                    //   - Handles any value not explicitly listed above
                    // ✅ WHY:
                    //   - Defensive programming - handle unexpected values
                    //   - Required for complete logic coverage
                    // 💥 IF MISSING:
                    //   - Code might not handle all possible values

                    processingPriority = 'Medium';
                    discountRate = 0.05;
                    acc.Processing_Notes__c = 'Unknown type - review needed';
                }
            }

            // ✅ NESTED SWITCH: Industry-specific processing
            switch on acc.Industry {
                when 'Technology' {
                    acc.Sales_Strategy__c = 'Tech-focused approach';
                    acc.Contract_Length__c = 12; // months
                }
                when 'Healthcare', 'Pharmaceuticals' {
                    acc.Sales_Strategy__c = 'Compliance-focused approach';
                    acc.Contract_Length__c = 24; // longer contracts for stability
                }
                when 'Financial Services', 'Banking' {
                    acc.Sales_Strategy__c = 'Security-focused approach';
                    acc.Contract_Length__c = 36; // enterprise contracts
                }
                when else {
                    acc.Sales_Strategy__c = 'Standard approach';
                    acc.Contract_Length__c = 12;
                }
            }

            // ✅ SET CALCULATED VALUES: Apply switch results
            acc.Processing_Priority__c = processingPriority;
            acc.Discount_Rate__c = discountRate;

            System.debug('PROCESSED: ' + acc.Name +
                        ' (Type: ' + acc.Type +
                        ', Priority: ' + processingPriority +
                        ', Discount: ' + discountRate + ')');
        }

        // ✅ SWITCH WITH ENUMS: Type-safe constant values
        System.LoggingLevel currentLevel = System.LoggingLevel.INFO;

        switch on currentLevel {
            when DEBUG {
                System.debug('Debug logging enabled - verbose output');
            }
            when INFO {
                System.debug('Info logging enabled - standard output');
            }
            when WARN, ERROR {
                // ✅ WHAT: Handle both warning and error levels together
                // ✅ WHY: Similar processing for both severity levels
                System.debug('High-severity logging enabled');
            }
            when else {
                System.debug('Unknown logging level');
            }
        }

        // ✅ BULK UPDATE: Apply all account changes
        update accountMap.values();
        // ✅ WHAT: \`accountMap.values()\` returns List of all Account records
        // ✅ WHY: Single DML operation for all processed accounts
    }
}`}
                annotations={[]}
              />
            </div>

            {/* Loops for Processing Collections */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Loops for Processing Collections</h3>

              <AnnotatedCode
                code={`public class CollectionProcessor {
    public void demonstrateLoops() {
        // ✅ BUILDING ON: You understand Lists, Sets, Maps from Collections topic
        List<Contact> contacts = [SELECT Id, Name, AccountId, Email FROM Contact LIMIT 100];
        Set<Id> accountIds = new Set<Id>();
        Map<Id, Integer> contactCounts = new Map<Id, Integer>();

        // ✅ ENHANCED FOR LOOP: Best practice for collections
        for (Contact con : contacts) {
            // ✅ WHAT:
            //   - \`for (Type variable : collection)\` = ENHANCED FOR LOOP
            //   - \`Contact con\` = TEMPORARY variable for each iteration
            // ✅ WHY:
            //   - Cleaner syntax than traditional for loops
            //   - Automatically handles collection boundaries
            //   - More efficient and less error-prone
            // ✅ PERFORMANCE:
            //   - Reads each element exactly once
            //   - No index calculations needed

            System.debug('Processing contact: ' + con.Name);

            // Collect Account IDs for bulk processing
            if (con.AccountId != null) {
                accountIds.add(con.AccountId);
                // ✅ WHAT: Add Account ID to Set (duplicates automatically ignored)
                // ✅ WHY: Prepare for bulk query - collect unique IDs first
            }

            // Count contacts per account
            Id accId = con.AccountId;
            if (contactCounts.containsKey(accId)) {
                // ✅ WHAT: Account already has contacts, increment count
                Integer currentCount = contactCounts.get(accId);
                contactCounts.put(accId, currentCount + 1);
            } else {
                // ✅ WHAT: First contact for this account, start count at 1
                contactCounts.put(accId, 1);
            }
        }

        // ✅ TRADITIONAL FOR LOOP: When you need index numbers
        for (Integer i = 0; i < contacts.size(); i++) {
            // ✅ WHAT:
            //   - \`Integer i = 0\` = INITIALIZE counter variable
            //   - \`i < contacts.size()\` = CONDITION to continue
            //   - \`i++\` = INCREMENT after each iteration
            // ✅ WHY:
            //   - Use when you need current position/index
            //   - Required for comparing adjacent elements
            //   - Useful for batch processing by position
            // 💥 GOTCHA:
            //   - Easy to create off-by-one errors
            //   - \`i <= contacts.size()\` would crash (too high by 1)

            Contact currentContact = contacts.get(i);
            System.debug('Contact #' + i + ': ' + currentContact.Name);

            // Example: Compare with next contact (why you need index)
            if (i + 1 < contacts.size()) {
                Contact nextContact = contacts.get(i + 1);
                System.debug('Comparing: ' + currentContact.Name + ' → ' + nextContact.Name);
            }
        }

        // ✅ PROCESSING MAP WITH LOOPS: Iterate through key-value pairs
        for (Id accountId : contactCounts.keySet()) {
            // ✅ WHAT:
            //   - \`contactCounts.keySet()\` = GET all keys as Set
            //   - Loop through each Account ID
            // ✅ WHY:
            //   - Process each account's contact count
            //   - keySet() gives you all the accounts that have contacts

            Integer count = contactCounts.get(accountId);
            System.debug('Account ' + accountId + ' has ' + count + ' contacts');

            // Business logic based on contact count
            if (count >= 10) {
                System.debug('HIGH VOLUME: Account has many contacts');
            } else if (count >= 5) {
                System.debug('MEDIUM VOLUME: Account has several contacts');
            } else {
                System.debug('LOW VOLUME: Account has few contacts');
            }
        }

        // ✅ WHILE LOOP: Repeat until condition changes
        Integer batchSize = 200;
        Integer processed = 0;
        List<Contact> allContacts = [SELECT Id FROM Contact];

        while (processed < allContacts.size()) {
            // ✅ WHAT:
            //   - \`while (condition)\` = REPEAT while condition is true
            //   - Check condition BEFORE each iteration
            // ✅ WHY:
            //   - Useful for batch processing with unknown total iterations
            //   - Continue until work is complete
            // 💥 DANGER:
            //   - Can create INFINITE LOOPS if condition never becomes false
            //   - Always ensure the condition will eventually change

            Integer endIndex = Math.min(processed + batchSize, allContacts.size());
            List<Contact> batch = new List<Contact>();

            // Process current batch
            for (Integer i = processed; i < endIndex; i++) {
                batch.add(allContacts.get(i));
            }

            System.debug('Processing batch: ' + processed + ' to ' + (endIndex - 1));
            // ... process batch ...

            processed = endIndex; // ✅ CRITICAL: Update condition variable
            // ✅ WHAT: Move to next batch starting position
            // ✅ WHY: Ensures while condition will eventually become false
            // 💥 IF MISSING: Infinite loop (processed never increases)
        }

        // ✅ DO-WHILE LOOP: Execute at least once, then check condition
        Integer attempts = 0;
        Boolean operationSucceeded = false;

        do {
            // ✅ WHAT:
            //   - \`do { ... } while (condition)\` = EXECUTE FIRST, check after
            //   - Guaranteed to run at least once
            // ✅ WHY:
            //   - Useful when you always need to try at least once
            //   - Common for retry logic

            attempts++;
            System.debug('Attempt #' + attempts);

            // Simulate operation that might fail
            operationSucceeded = Math.random() > 0.7; // 30% success rate

            if (!operationSucceeded) {
                System.debug('Operation failed, will retry...');
            }

        } while (!operationSucceeded && attempts < 5);
        // ✅ WHAT: Continue if operation failed AND we haven't exceeded max attempts
        // ✅ WHY: Retry logic with maximum attempt limit

        if (operationSucceeded) {
            System.debug('Operation succeeded after ' + attempts + ' attempts');
        } else {
            System.debug('Operation failed after ' + attempts + ' attempts');
        }
    }
}`}
                annotations={[]}
              />
            </div>

            {/* Flow Control */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Flow Control - Break, Continue, Return</h3>

              <AnnotatedCode
                code={`public class FlowControlDemo {
    public void demonstrateFlowControl() {
        List<Account> accounts = [SELECT Id, Name, AnnualRevenue, Type FROM Account LIMIT 20];

        // ✅ BREAK: Exit loop early when condition is met
        for (Account acc : accounts) {
            System.debug('Checking account: ' + acc.Name);

            if (acc.AnnualRevenue != null && acc.AnnualRevenue > 1000000) {
                // ✅ WHAT:
                //   - \`break\` = IMMEDIATELY EXIT the current loop
                //   - Skips all remaining iterations
                // ✅ WHY:
                //   - Found what we're looking for, no need to continue
                //   - Performance optimization - don't do unnecessary work
                // ✅ PRACTICAL:
                //   - "Find first high-value account and stop"

                System.debug('FOUND HIGH-VALUE ACCOUNT: ' + acc.Name);
                break; // Exit loop immediately
            }
        }

        // ✅ CONTINUE: Skip current iteration, proceed to next
        Integer validAccountCount = 0;
        for (Account acc : accounts) {
            // Skip accounts without revenue data
            if (acc.AnnualRevenue == null) {
                // ✅ WHAT:
                //   - \`continue\` = SKIP rest of current iteration
                //   - Jump directly to next account in loop
                // ✅ WHY:
                //   - Don't process incomplete data
                //   - Cleaner than nested if statements
                // ✅ PRACTICAL:
                //   - "Skip invalid records, process only good ones"

                System.debug('SKIPPING: ' + acc.Name + ' (no revenue data)');
                continue; // Skip to next account
            }

            // This code only runs for accounts WITH revenue data
            validAccountCount++;
            System.debug('PROCESSING: ' + acc.Name + ' (Revenue: ' + acc.AnnualRevenue + ')');

            // Business logic for valid accounts only
            if (acc.AnnualRevenue > 500000) {
                acc.Type = 'Enterprise';
            } else {
                acc.Type = 'SMB';
            }
        }

        System.debug('Processed ' + validAccountCount + ' valid accounts');

        // ✅ LABELED BREAK: Break out of nested loops
        outerLoop: // ✅ WHAT: Label for referencing specific loop
        for (Integer i = 0; i < 5; i++) {
            for (Integer j = 0; j < 5; j++) {
                System.debug('i=' + i + ', j=' + j);

                if (i == 2 && j == 2) {
                    // ✅ WHAT:
                    //   - \`break outerLoop\` = EXIT the labeled loop (not just inner)
                    //   - Breaks out of BOTH loops at once
                    // ✅ WHY:
                    //   - Sometimes you need to exit multiple nested levels
                    //   - Cleaner than boolean flags

                    System.debug('Breaking out of both loops');
                    break outerLoop; // Exit both loops
                }
            }
        }
        System.debug('Both loops exited');
    }

    // ✅ RETURN: Exit method and optionally return value
    public String categorizeAccount(Account acc) {
        // ✅ EARLY RETURNS: Validate inputs first
        if (acc == null) {
            // ✅ WHAT:
            //   - \`return\` = IMMEDIATELY EXIT method
            //   - Returns specified value to caller
            // ✅ WHY:
            //   - Guard clauses prevent null pointer exceptions
            //   - Fail fast for invalid inputs
            // ✅ PATTERN:
            //   - Check edge cases first, main logic last

            return 'Invalid'; // Exit method immediately
        }

        if (acc.AnnualRevenue == null) {
            return 'Unknown'; // Early return for missing data
        }

        // ✅ MAIN LOGIC: Only reached if inputs are valid
        if (acc.AnnualRevenue >= 10000000) {
            return 'Enterprise'; // ✅ WHAT: Early return for high-value
        }

        if (acc.AnnualRevenue >= 1000000) {
            return 'Large'; // ✅ WHAT: Early return for medium-value
        }

        if (acc.AnnualRevenue >= 100000) {
            return 'Medium'; // ✅ WHAT: Early return for small-value
        }

        return 'Small'; // ✅ WHAT: Default return (all other cases)
        // ✅ WHY: Method must return String in all code paths
    }

    public Boolean validateAndProcessLead(Lead lead) {
        // ✅ MULTIPLE EARLY RETURNS: Clean validation pattern
        if (lead == null) {
            System.debug('ERROR: Lead is null');
            return false;
        }

        if (String.isBlank(lead.Email)) {
            System.debug('ERROR: Lead has no email');
            return false;
        }

        if (!lead.Email.contains('@')) {
            System.debug('ERROR: Invalid email format');
            return false;
        }

        if (lead.Score__c == null || lead.Score__c < 0) {
            System.debug('ERROR: Invalid lead score');
            return false;
        }

        // ✅ ALL VALIDATIONS PASSED: Proceed with main logic
        System.debug('SUCCESS: Processing valid lead: ' + lead.Email);

        // Main processing logic here...
        lead.Status = 'Qualified';
        lead.Processed_Date__c = Date.today();

        return true; // ✅ WHAT: Success return after processing
        // ✅ WHY: Indicates successful completion to caller
    }
}`}
                annotations={[]}
              />
            </div>
          </div>
        </section>

        {/* Common Gotchas */}
        <section>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">💀 Common Gotchas</h2>

          <div className="space-y-6">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Infinite Loops</h3>
              <p className="text-red-800 dark:text-red-200 mb-4">While loops can run forever if the condition never changes.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">💀 DANGEROUS</h4>
                  <AnnotatedCode
                    code={`Integer i = 0;
while (i < 10) {
    System.debug(i);
    // FORGOT i++; - infinite loop!
}`}
                    annotations={[]}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✅ SAFE</h4>
                  <AnnotatedCode
                    code={`Integer i = 0;
while (i < 10) {
    System.debug(i);
    i++; // Always update condition variable
}`}
                    annotations={[]}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Off-by-One Errors</h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-4">Traditional for loops are prone to boundary errors.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">💀 DANGEROUS</h4>
                  <AnnotatedCode
                    code={`List<String> items = new List<String>{'a', 'b'};
for (Integer i = 0; i <= items.size(); i++) {
    System.debug(items.get(i)); // CRASH at i=2
}`}
                    annotations={[]}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✅ SAFE</h4>
                  <AnnotatedCode
                    code={`List<String> items = new List<String>{'a', 'b'};
for (String item : items) {
    System.debug(item); // Enhanced for loop is safer
}`}
                    annotations={[]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real World Application */}
        <section>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">🌍 Real-World Application</h2>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Why This Matters in Production</h3>

            <div className="prose dark:prose-dark max-w-none">
              <ul>
                <li><strong>If/Else:</strong> Lead scoring, opportunity qualification, discount calculations based on customer type</li>
                <li><strong>Switch:</strong> Processing different record types, handling various case statuses, routing workflows</li>
                <li><strong>For Loops:</strong> Bulk processing records, data migration, report generation, integration data processing</li>
                <li><strong>While Loops:</strong> Retry logic for external callouts, polling for completion status, batch processing</li>
                <li><strong>Break/Continue:</strong> Early termination for performance, skipping invalid records, error handling</li>
              </ul>

              <p className="mt-4"><strong>Governor Limit Impact:</strong> Efficient control flow prevents timeouts and limit exceptions. Poor loop design can consume all CPU time or SOQL queries.</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">🚀 Next Steps</h2>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              <strong>You now know how to make decisions and process data efficiently.</strong> Next, you'll learn <strong>Classes and Methods</strong> - how to organize your control flow logic into reusable, maintainable components.
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              Classes will teach you: <em>"How do you organize your Lead processing logic so other developers can reuse it?"</em>
            </p>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'classes',
    title: 'Classes and Methods',
    icon: Code,
    description: 'Object-oriented programming in Apex',
    content: (
      <div className="space-y-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <strong>Your processing logic needs organization.</strong> Classes group related functionality, methods perform specific tasks, and objects hold your data. Think of a class as a blueprint and objects as the houses built from it.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Class Structure and Fundamentals</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Every class in Apex follows a consistent structure. Let's build an AccountProcessor class step by step:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Class declaration with access modifier
// ✅ WHY: Public makes this class accessible from other classes and packages
// 💥 IF WRONG: Without public, the class is only accessible within the same package
public class AccountProcessor {

    // ✅ WHAT: Instance variables (properties) store object state
    // ✅ WHY: Private encapsulation - only this class can directly access these
    // 💥 IF WRONG: Public variables break encapsulation and create tight coupling
    private String processorName;
    private Integer maxAccountsToProcess;
    private Boolean isActive;

    // ✅ WHAT: Static variable shared across ALL instances of this class
    // ✅ WHY: Tracks total processors created - belongs to the class, not instances
    // 💥 IF WRONG: Instance variable would give each object its own counter
    private static Integer totalProcessorsCreated = 0;

    // ✅ WHAT: Default constructor (no parameters)
    // ✅ WHY: Provides a standard way to create objects with default values
    // 💥 IF WRONG: Without any constructor, Salesforce provides a default one anyway
    public AccountProcessor() {
        this.processorName = 'Default Processor';
        this.maxAccountsToProcess = 100;
        this.isActive = true;
        totalProcessorsCreated++; // ✅ Increment class-level counter
    }

    // ✅ WHAT: Parameterized constructor for custom initialization
    // ✅ WHY: Allows creating objects with specific values instead of defaults
    // 💥 IF WRONG: Having only default constructor limits object creation flexibility
    public AccountProcessor(String name, Integer maxAccounts) {
        this.processorName = name;
        this.maxAccountsToProcess = maxAccounts;
        this.isActive = true;
        totalProcessorsCreated++;
    }

    // ✅ WHAT: Getter method for private instance variable
    // ✅ WHY: Controlled access to private data - encapsulation principle
    // 💥 IF WRONG: Direct variable access breaks encapsulation
    public String getProcessorName() {
        return this.processorName;
    }

    // ✅ WHAT: Setter method with validation
    // ✅ WHY: Controlled modification of private data with business rules
    // 💥 IF WRONG: Direct assignment could allow invalid data
    public void setProcessorName(String newName) {
        if (String.isNotBlank(newName)) {
            this.processorName = newName;
        } else {
            throw new IllegalArgumentException('Processor name cannot be blank');
        }
    }

    // ✅ WHAT: Instance method that operates on this object's data
    // ✅ WHY: Encapsulates behavior with the data it operates on
    // 💥 IF WRONG: Static method couldn't access instance variables
    public void processAccounts(List<Account> accounts) {
        if (!this.isActive) {
            System.debug('Processor ' + this.processorName + ' is inactive');
            return;
        }

        Integer accountsToProcess = Math.min(accounts.size(), this.maxAccountsToProcess);

        for (Integer i = 0; i < accountsToProcess; i++) {
            Account acc = accounts[i];
            // ✅ Process each account
            acc.Description = 'Processed by ' + this.processorName;
        }

        System.debug(this.processorName + ' processed ' + accountsToProcess + ' accounts');
    }

    // ✅ WHAT: Static method - belongs to class, not instance
    // ✅ WHY: Utility function that doesn't need object state
    // 💥 IF WRONG: Instance method would require creating object for utility function
    public static Integer getTotalProcessorsCreated() {
        return totalProcessorsCreated;
    }

    // ✅ WHAT: Static method for creating specialized processors
    // ✅ WHY: Factory method pattern - encapsulates object creation logic
    // 💥 IF WRONG: Multiple constructors might become confusing
    public static AccountProcessor createHighVolumeProcessor(String name) {
        return new AccountProcessor(name, 1000);
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Access modifiers control visibility: public (accessible everywhere), private (only within this class), global (accessible in other namespaces)",
                type: "info",
                icon: "ℹ️"
              },
              {
                arrows: "         ↑",
                explanation: "Instance variables store object state. Each object gets its own copy of these variables",
                type: "success",
                icon: "✅"
              },
              {
                arrows: "              ↑",
                explanation: "Static variables belong to the class itself, shared across all instances. Perfect for counters or configuration",
                type: "warning",
                icon: "⚠️"
              },
              {
                arrows: "                   ↑",
                explanation: "Constructors initialize objects. You can have multiple constructors with different parameters (overloading)",
                type: "info",
                icon: "🏗️"
              },
              {
                arrows: "                        ↑",
                explanation: "Getter/setter methods provide controlled access to private variables. This is encapsulation in action",
                type: "success",
                icon: "🔒"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Using Your Classes</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Now let's see how to create and use objects from our AccountProcessor class:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Creating objects using different constructors
// ✅ WHY: Demonstrates constructor overloading and object instantiation
// 💥 IF WRONG: Forgetting 'new' keyword causes compilation error

// Using default constructor
AccountProcessor defaultProcessor = new AccountProcessor();

// Using parameterized constructor
AccountProcessor customProcessor = new AccountProcessor('Enterprise Processor', 500);

// Using static factory method
AccountProcessor bulkProcessor = AccountProcessor.createHighVolumeProcessor('Bulk Data Processor');

// ✅ WHAT: Accessing object methods and properties
// ✅ WHY: Demonstrates encapsulation - using getters instead of direct access
// 💥 IF WRONG: Trying to access private variables directly would fail

System.debug('Default processor: ' + defaultProcessor.getProcessorName());
System.debug('Custom processor: ' + customProcessor.getProcessorName());

// ✅ WHAT: Modifying object state through setter
// ✅ WHY: Controlled modification with validation
customProcessor.setProcessorName('Updated Enterprise Processor');

// ✅ WHAT: Using instance methods on objects
// ✅ WHY: Each object maintains its own state and behavior
List<Account> accountsToProcess = [SELECT Id, Name FROM Account LIMIT 50];

defaultProcessor.processAccounts(accountsToProcess);
customProcessor.processAccounts(accountsToProcess);

// ✅ WHAT: Accessing static method without creating object
// ✅ WHY: Static methods belong to the class, not instances
// 💥 IF WRONG: Calling static methods on instances works but is confusing
Integer totalCreated = AccountProcessor.getTotalProcessorsCreated();
System.debug('Total processors created: ' + totalCreated);

// ✅ WHAT: Demonstrating object independence
// ✅ WHY: Each object has its own state and can behave differently
AccountProcessor processor1 = new AccountProcessor('Processor One', 10);
AccountProcessor processor2 = new AccountProcessor('Processor Two', 20);

// These will process different amounts based on their maxAccountsToProcess
processor1.processAccounts(accountsToProcess); // Processes up to 10
processor2.processAccounts(accountsToProcess); // Processes up to 20`}
            annotations={[
              {
                arrows: "                                    ↑",
                explanation: "The 'new' keyword creates a new instance of the class in memory and calls the constructor",
                type: "info",
                icon: "🆕"
              },
              {
                arrows: "                        ↑",
                explanation: "Each object has its own copy of instance variables but shares static variables and methods",
                type: "success",
                icon: "🔄"
              },
              {
                arrows: "                                          ↑",
                explanation: "Static methods can be called on the class name without creating an object instance",
                type: "warning",
                icon: "⚡"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Method Types and Patterns</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Understanding different method types helps you design better classes:
          </p>

          <AnnotatedCode
            code={`public class ValidationHelper {

    // ✅ WHAT: Instance method that uses object state
    // ✅ WHY: Needs access to instance variables for validation rules
    private Map<String, String> validationRules;

    public ValidationHelper() {
        validationRules = new Map<String, String>();
        validationRules.put('email', '.*@.*\\..*'); // Simple email pattern
        validationRules.put('phone', '\\d{3}-\\d{3}-\\d{4}'); // Phone pattern
    }

    // ✅ WHAT: Instance method using object's validation rules
    // ✅ WHY: Each validator can have different rules
    public Boolean validateField(String fieldType, String value) {
        String pattern = validationRules.get(fieldType);
        if (pattern == null) {
            return true; // No rule means valid
        }
        return Pattern.matches(pattern, value);
    }

    // ✅ WHAT: Static utility method - no object state needed
    // ✅ WHY: Pure function that always behaves the same way
    // 💥 IF WRONG: Making this instance method would require unnecessary object creation
    public static Boolean isValidEmail(String email) {
        // ✅ Simple validation logic that doesn't need object state
        return String.isNotBlank(email) && email.contains('@') && email.contains('.');
    }

    // ✅ WHAT: Static method with parameters and return value
    // ✅ WHY: Reusable utility that doesn't depend on object state
    public static String formatPhoneNumber(String rawPhone) {
        if (String.isBlank(rawPhone)) {
            return null;
        }

        // ✅ Remove all non-digits
        String cleanPhone = rawPhone.replaceAll('[^0-9]', '');

        // ✅ Format as XXX-XXX-XXXX if 10 digits
        if (cleanPhone.length() == 10) {
            return cleanPhone.substring(0, 3) + '-' +
                   cleanPhone.substring(3, 6) + '-' +
                   cleanPhone.substring(6);
        }

        return rawPhone; // Return original if can't format
    }

    // ✅ WHAT: Method overloading - same name, different parameters
    // ✅ WHY: Provides flexible ways to call the same logical operation
    // 💥 IF WRONG: Different method names would be less intuitive

    // Version 1: Validate single field
    public Boolean validate(String fieldType, String value) {
        return validateField(fieldType, value);
    }

    // Version 2: Validate multiple fields at once
    public Map<String, Boolean> validate(Map<String, String> fieldValues) {
        Map<String, Boolean> results = new Map<String, Boolean>();

        for (String fieldType : fieldValues.keySet()) {
            String value = fieldValues.get(fieldType);
            results.put(fieldType, validateField(fieldType, value));
        }

        return results;
    }

    // ✅ WHAT: Method with void return type (doesn't return anything)
    // ✅ WHY: Used for actions/operations rather than calculations
    public void addValidationRule(String fieldType, String pattern) {
        validationRules.put(fieldType, pattern);
        System.debug('Added validation rule for ' + fieldType);
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Instance methods can access and modify object state (instance variables). They require an object to be called",
                type: "info",
                icon: "📦"
              },
              {
                arrows: "         ↑",
                explanation: "Static methods don't need object state. They're like utility functions that belong to the class",
                type: "success",
                icon: "🔧"
              },
              {
                arrows: "              ↑",
                explanation: "Method overloading allows multiple methods with the same name but different parameters",
                type: "warning",
                icon: "🔄"
              },
              {
                arrows: "                   ↑",
                explanation: "Void methods perform actions but don't return values. Use them for operations like logging or data modification",
                type: "info",
                icon: "⚡"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Real-World Example: Contact Manager</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Let's build a practical class that demonstrates all these concepts in a real Salesforce scenario:
          </p>

          <AnnotatedCode
            code={`public class ContactManager {
    // ✅ WHAT: Instance variables for object state
    private String managerName;
    private Set<String> allowedDomains;
    private Integer maxContactsPerBatch;

    // ✅ WHAT: Static variable for class-level tracking
    private static Integer totalContactsProcessed = 0;

    // ✅ WHAT: Constructor with validation
    public ContactManager(String name, Set<String> domains) {
        if (String.isBlank(name)) {
            throw new IllegalArgumentException('Manager name is required');
        }

        this.managerName = name;
        this.allowedDomains = domains != null ? domains : new Set<String>();
        this.maxContactsPerBatch = 200; // Default limit
    }

    // ✅ WHAT: Instance method for core business logic
    // ✅ WHY: Uses object state (allowedDomains, maxContactsPerBatch) for processing
    public List<Contact> processIncomingContacts(List<Contact> newContacts) {
        List<Contact> processedContacts = new List<Contact>();
        Integer processed = 0;

        for (Contact con : newContacts) {
            // ✅ Check batch limit
            if (processed >= this.maxContactsPerBatch) {
                System.debug('Batch limit reached: ' + this.maxContactsPerBatch);
                break;
            }

            // ✅ Validate email domain
            if (isValidDomain(con.Email)) {
                con.Description = 'Processed by ' + this.managerName;
                con.LeadSource = 'Web';
                processedContacts.add(con);
                processed++;
            } else {
                System.debug('Rejected contact with invalid domain: ' + con.Email);
            }
        }

        // ✅ Update class-level counter
        totalContactsProcessed += processed;

        return processedContacts;
    }

    // ✅ WHAT: Private helper method (encapsulation)
    // ✅ WHY: Internal logic that shouldn't be called from outside
    private Boolean isValidDomain(String email) {
        if (String.isBlank(email) || !email.contains('@')) {
            return false;
        }

        String domain = email.split('@')[1].toLowerCase();

        // ✅ If no specific domains set, allow all
        if (allowedDomains.isEmpty()) {
            return true;
        }

        return allowedDomains.contains(domain);
    }

    // ✅ WHAT: Static utility method for email validation
    // ✅ WHY: Pure function that doesn't need object state
    public static Boolean validateEmailFormat(String email) {
        if (String.isBlank(email)) {
            return false;
        }

        // ✅ Basic email format validation
        String emailRegex = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
        return Pattern.matches(emailRegex, email);
    }

    // ✅ WHAT: Static method to get class-level statistics
    public static Integer getTotalContactsProcessed() {
        return totalContactsProcessed;
    }

    // ✅ WHAT: Method to update object configuration
    public void setBatchLimit(Integer newLimit) {
        if (newLimit > 0 && newLimit <= 2000) {
            this.maxContactsPerBatch = newLimit;
        } else {
            throw new IllegalArgumentException('Batch limit must be between 1 and 2000');
        }
    }

    // ✅ WHAT: Method to add allowed domain
    public void addAllowedDomain(String domain) {
        if (String.isNotBlank(domain)) {
            this.allowedDomains.add(domain.toLowerCase());
        }
    }

    // ✅ WHAT: Static factory method for common configurations
    public static ContactManager createCorporateManager(String name) {
        Set<String> corporateDomains = new Set<String>{
            'salesforce.com', 'google.com', 'microsoft.com', 'amazon.com'
        };

        ContactManager manager = new ContactManager(name, corporateDomains);
        manager.setBatchLimit(500); // Higher limit for corporate
        return manager;
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Real-world classes combine data (instance variables) with behavior (methods) that operates on that data",
                type: "success",
                icon: "🏢"
              },
              {
                arrows: "         ↑",
                explanation: "Constructor validation ensures objects are created in a valid state from the beginning",
                type: "info",
                icon: "✅"
              },
              {
                arrows: "              ↑",
                explanation: "Instance methods use object state to make decisions and perform operations specific to that object",
                type: "warning",
                icon: "⚙️"
              },
              {
                arrows: "                   ↑",
                explanation: "Private methods encapsulate internal logic that shouldn't be exposed to external code",
                type: "info",
                icon: "🔒"
              },
              {
                arrows: "                        ↑",
                explanation: "Factory methods provide pre-configured object creation for common use cases",
                type: "success",
                icon: "🏭"
              }
            ]}
          />
        </section>

        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">💡 Key Class Design Principles</h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li><strong>Encapsulation:</strong> Keep data private, provide controlled access through methods</li>
            <li><strong>Single Responsibility:</strong> Each class should have one clear purpose</li>
            <li><strong>Constructor Validation:</strong> Ensure objects start in a valid state</li>
            <li><strong>Static vs Instance:</strong> Use static for utilities, instance for stateful operations</li>
            <li><strong>Method Overloading:</strong> Provide multiple ways to call the same logical operation</li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'soql',
    title: 'SOQL and Database',
    icon: Database,
    description: 'Query data and database operations',
    content: (
      <div className="space-y-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <strong>Your classes need data to work with.</strong> SOQL retrieves records from Salesforce, DML operations modify them, and proper database patterns ensure your code is efficient and bulkified. Master these fundamentals to build robust data-driven applications.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">SOQL Query Fundamentals</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SOQL (Salesforce Object Query Language) retrieves data from your Salesforce database. Every query follows a consistent pattern:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Basic SOQL query syntax
// ✅ WHY: SELECT specifies fields, FROM specifies object, WHERE filters records
// 💥 IF WRONG: Missing SELECT or FROM causes compilation error

// Simple query - get all accounts
List<Account> allAccounts = [SELECT Id, Name FROM Account];

// ✅ WHAT: Query with WHERE clause for filtering
// ✅ WHY: Reduces data retrieved, improves performance
// 💥 IF WRONG: No WHERE clause retrieves ALL records (potential performance issue)
List<Account> activeAccounts = [
    SELECT Id, Name, Type, Industry
    FROM Account
    WHERE Active__c = true
];

// ✅ WHAT: Query with multiple conditions
// ✅ WHY: AND/OR operators allow complex filtering logic
List<Account> enterpriseCustomers = [
    SELECT Id, Name, AnnualRevenue, NumberOfEmployees
    FROM Account
    WHERE (Type = 'Customer' OR Type = 'Customer - Direct')
    AND AnnualRevenue > 1000000
    AND NumberOfEmployees > 100
];

// ✅ WHAT: Query with LIMIT to control result size
// ✅ WHY: Prevents hitting governor limits, improves performance
// 💥 IF WRONG: No LIMIT might return too many records
List<Contact> recentContacts = [
    SELECT Id, Name, Email, CreatedDate
    FROM Contact
    WHERE CreatedDate = LAST_N_DAYS:30
    ORDER BY CreatedDate DESC
    LIMIT 100
];

// ✅ WHAT: Query with relationships (looking up)
// ✅ WHY: Get related data in single query instead of multiple queries
// 💥 IF WRONG: Separate queries create inefficient N+1 query problems
List<Contact> contactsWithAccounts = [
    SELECT Id, Name, Email,
           Account.Name, Account.Type, Account.Industry
    FROM Contact
    WHERE Account.Type = 'Customer'
    LIMIT 50
];

// ✅ WHAT: Query with relationships (looking down)
// ✅ WHY: Get child records with parent in single efficient query
List<Account> accountsWithContacts = [
    SELECT Id, Name, Type,
           (SELECT Id, Name, Email FROM Contacts LIMIT 5)
    FROM Account
    WHERE Type = 'Customer'
    LIMIT 20
];`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "SOQL queries are embedded in square brackets []. They return lists of sObjects matching your criteria",
                type: "info",
                icon: "🔍"
              },
              {
                arrows: "         ↑",
                explanation: "WHERE clauses filter results. Use them to avoid retrieving unnecessary data and hitting limits",
                type: "success",
                icon: "📊"
              },
              {
                arrows: "              ↑",
                explanation: "Relationship queries use dot notation (Account.Name) to access related object fields efficiently",
                type: "warning",
                icon: "🔗"
              },
              {
                arrows: "                   ↑",
                explanation: "Subqueries (SELECT within SELECT) retrieve child records. Always use LIMIT to control data volume",
                type: "info",
                icon: "📋"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">DML Operations and Data Modification</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            DML (Data Manipulation Language) operations create, update, and delete records. Always think in bulk:
          </p>

          <AnnotatedCode
            code={`public class ContactProcessor {

    // ✅ WHAT: Bulk insert operation
    // ✅ WHY: Single DML statement handles multiple records efficiently
    // 💥 IF WRONG: Individual inserts in loops hit governor limits quickly
    public static void createBulkContacts(List<Map<String, String>> contactData) {
        List<Contact> contactsToInsert = new List<Contact>();

        for (Map<String, String> data : contactData) {
            Contact newContact = new Contact();
            newContact.FirstName = data.get('firstName');
            newContact.LastName = data.get('lastName');
            newContact.Email = data.get('email');
            newContact.Phone = data.get('phone');

            // ✅ Add to list for bulk operation
            contactsToInsert.add(newContact);
        }

        // ✅ WHAT: Single insert statement for all records
        // ✅ WHY: Efficient, uses one DML statement regardless of record count
        if (!contactsToInsert.isEmpty()) {
            insert contactsToInsert;
            System.debug('Inserted ' + contactsToInsert.size() + ' contacts');
        }
    }

    // ✅ WHAT: Bulk update with error handling
    // ✅ WHY: Database.update allows partial success and error handling
    // 💥 IF WRONG: Standard update fails entire transaction on any error
    public static void updateAccountIndustries(Map<Id, String> accountIdToIndustry) {
        List<Account> accountsToUpdate = new List<Account>();

        // ✅ Build list of accounts to update
        for (Id accountId : accountIdToIndustry.keySet()) {
            Account acc = new Account();
            acc.Id = accountId;
            acc.Industry = accountIdToIndustry.get(accountId);
            accountsToUpdate.add(acc);
        }

        // ✅ WHAT: Database.update with allOrNone = false
        // ✅ WHY: Allows partial success, continues processing valid records
        if (!accountsToUpdate.isEmpty()) {
            Database.SaveResult[] results = Database.update(accountsToUpdate, false);

            // ✅ Process results to handle errors
            for (Integer i = 0; i < results.size(); i++) {
                Database.SaveResult result = results[i];
                if (!result.isSuccess()) {
                    System.debug('Failed to update account: ' + accountsToUpdate[i].Id);
                    for (Database.Error error : result.getErrors()) {
                        System.debug('Error: ' + error.getMessage());
                    }
                }
            }
        }
    }

    // ✅ WHAT: Upsert operation for insert or update
    // ✅ WHY: Handles both new and existing records based on external ID
    // 💥 IF WRONG: Separate insert/update logic is more complex and error-prone
    public static void upsertContactsByExternalId(List<Contact> contactsToUpsert) {
        // ✅ WHAT: Upsert using external ID field
        // ✅ WHY: Automatically determines insert vs update based on External_Id__c
        try {
            upsert contactsToUpsert External_Id__c;
            System.debug('Upserted ' + contactsToUpsert.size() + ' contacts');
        } catch (DmlException e) {
            System.debug('Upsert failed: ' + e.getMessage());
            // ✅ Handle specific DML errors
            for (Integer i = 0; i < e.getNumDml(); i++) {
                System.debug('Record ' + i + ': ' + e.getDmlMessage(i));
            }
        }
    }

    // ✅ WHAT: Safe delete with relationship checking
    // ✅ WHY: Prevents accidental deletion of records with dependencies
    public static void deleteInactiveAccounts() {
        // ✅ Query accounts to delete with related data check
        List<Account> accountsToDelete = [
            SELECT Id, Name,
                   (SELECT Id FROM Contacts LIMIT 1),
                   (SELECT Id FROM Opportunities LIMIT 1)
            FROM Account
            WHERE Active__c = false
            AND LastActivityDate < LAST_N_DAYS:365
        ];

        List<Account> safeToDelete = new List<Account>();

        for (Account acc : accountsToDelete) {
            // ✅ Only delete if no related records
            if (acc.Contacts.isEmpty() && acc.Opportunities.isEmpty()) {
                safeToDelete.add(acc);
            } else {
                System.debug('Cannot delete account with related records: ' + acc.Name);
            }
        }

        if (!safeToDelete.isEmpty()) {
            delete safeToDelete;
            System.debug('Deleted ' + safeToDelete.size() + ' inactive accounts');
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Always build lists of records and use single DML statements. Never use DML inside loops!",
                type: "danger",
                icon: "⚠️"
              },
              {
                arrows: "         ↑",
                explanation: "Database.update with allOrNone=false allows partial success and detailed error handling",
                type: "success",
                icon: "✅"
              },
              {
                arrows: "              ↑",
                explanation: "Upsert automatically handles insert vs update logic based on external ID or record ID",
                type: "info",
                icon: "🔄"
              },
              {
                arrows: "                   ↑",
                explanation: "Always check for related records before deletion to prevent referential integrity errors",
                type: "warning",
                icon: "🛡️"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Advanced SOQL Patterns</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Master these patterns for complex data retrieval scenarios:
          </p>

          <AnnotatedCode
            code={`public class AdvancedQueryExamples {

    // ✅ WHAT: Dynamic SOQL with String.escapeSingleQuotes()
    // ✅ WHY: Prevents SOQL injection while allowing runtime query building
    // 💥 IF WRONG: Direct string concatenation allows SOQL injection attacks
    public static List<Account> searchAccountsByName(String searchTerm) {
        // ✅ Escape user input to prevent injection
        String safeTerm = String.escapeSingleQuotes(searchTerm);

        String query = 'SELECT Id, Name, Type, Industry FROM Account ' +
                      'WHERE Name LIKE \'%' + safeTerm + '%\' ' +
                      'ORDER BY Name LIMIT 100';

        return Database.query(query);
    }

    // ✅ WHAT: Aggregate queries for calculations
    // ✅ WHY: Database-level calculations are more efficient than Apex loops
    // 💥 IF WRONG: Retrieving all records to calculate in Apex is inefficient
    public static Map<String, Decimal> getRevenueByIndustry() {
        // ✅ Use aggregate functions in SOQL
        List<AggregateResult> results = [
            SELECT Industry, SUM(AnnualRevenue) totalRevenue, COUNT(Id) accountCount
            FROM Account
            WHERE AnnualRevenue != null
            AND Industry != null
            GROUP BY Industry
            HAVING SUM(AnnualRevenue) > 1000000
            ORDER BY SUM(AnnualRevenue) DESC
        ];

        Map<String, Decimal> industryRevenue = new Map<String, Decimal>();

        for (AggregateResult result : results) {
            String industry = (String) result.get('Industry');
            Decimal revenue = (Decimal) result.get('totalRevenue');
            industryRevenue.put(industry, revenue);
        }

        return industryRevenue;
    }

    // ✅ WHAT: Date-based queries with date literals
    // ✅ WHY: Date literals are timezone-aware and more reliable than date comparisons
    public static List<Opportunity> getOpportunitiesByTimePeriod() {
        return [
            SELECT Id, Name, Amount, CloseDate, StageName,
                   Account.Name, Account.Type
            FROM Opportunity
            WHERE CloseDate = THIS_QUARTER
            AND StageName IN ('Negotiation/Review', 'Closed Won')
            AND Amount > 50000
            ORDER BY CloseDate DESC, Amount DESC
        ];
    }

    // ✅ WHAT: Complex relationship queries with filtering
    // ✅ WHY: Filters both parent and child records in single query
    public static List<Account> getAccountsWithRecentHighValueOpportunities() {
        return [
            SELECT Id, Name, Type, Industry,
                   (SELECT Id, Name, Amount, CloseDate, StageName
                    FROM Opportunities
                    WHERE Amount > 100000
                    AND CloseDate >= LAST_N_DAYS:90
                    ORDER BY Amount DESC
                    LIMIT 5)
            FROM Account
            WHERE Type = 'Customer'
            AND Id IN (
                SELECT AccountId
                FROM Opportunity
                WHERE Amount > 100000
                AND CloseDate >= LAST_N_DAYS:90
            )
            ORDER BY Name
        ];
    }

    // ✅ WHAT: Query optimization with selective fields
    // ✅ WHY: Only query fields you actually need to improve performance
    // 💥 IF WRONG: SELECT * equivalent queries waste resources
    public static void processContactsEfficiently() {
        // ✅ BAD: Querying unnecessary fields
        // List<Contact> contacts = [SELECT Id, Name, Email, Phone, Title,
        //                          Department, MailingAddress, Description
        //                          FROM Contact LIMIT 1000];

        // ✅ GOOD: Only query fields you'll use
        List<Contact> contacts = [
            SELECT Id, Email
            FROM Contact
            WHERE Email != null
            AND EmailBouncedReason = null
            LIMIT 1000
        ];

        // ✅ Process only the data you need
        List<String> emailAddresses = new List<String>();
        for (Contact con : contacts) {
            emailAddresses.add(con.Email);
        }

        // ✅ Use the collected data for business logic
        EmailService.sendBulkEmail(emailAddresses, 'Monthly Newsletter');
    }

    // ✅ WHAT: Using IN clause with set of values
    // ✅ WHY: Efficient way to filter by multiple values
    public static List<Contact> getContactsByAccountTypes(Set<String> accountTypes) {
        return [
            SELECT Id, Name, Email, Account.Name, Account.Type
            FROM Contact
            WHERE Account.Type IN :accountTypes
            AND Email != null
            ORDER BY Account.Name, Name
        ];
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "String.escapeSingleQuotes() prevents SOQL injection. Always sanitize user input in dynamic queries",
                type: "danger",
                icon: "🛡️"
              },
              {
                arrows: "         ↑",
                explanation: "Aggregate queries (SUM, COUNT, AVG) perform calculations at database level for better performance",
                type: "success",
                icon: "📊"
              },
              {
                arrows: "              ↑",
                explanation: "Date literals (THIS_QUARTER, LAST_N_DAYS) are timezone-aware and more reliable than date math",
                type: "info",
                icon: "📅"
              },
              {
                arrows: "                   ↑",
                explanation: "Only query fields you actually need. This improves performance and reduces memory usage",
                type: "warning",
                icon: "⚡"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Transaction Management and Best Practices</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Understanding transactions and error handling ensures data integrity:
          </p>

          <AnnotatedCode
            code={`public class TransactionManager {

    // ✅ WHAT: All-or-nothing transaction pattern
    // ✅ WHY: Ensures data consistency - either all operations succeed or all fail
    // 💥 IF WRONG: Partial updates can leave data in inconsistent state
    public static void createOpportunityWithProducts(
        Opportunity opp,
        List<OpportunityLineItem> products
    ) {
        Savepoint sp = Database.setSavepoint();

        try {
            // ✅ Step 1: Insert opportunity
            insert opp;

            // ✅ Step 2: Set opportunity ID on products
            for (OpportunityLineItem product : products) {
                product.OpportunityId = opp.Id;
            }

            // ✅ Step 3: Insert products
            insert products;

            System.debug('Successfully created opportunity with ' + products.size() + ' products');

        } catch (Exception e) {
            // ✅ WHAT: Rollback on any error
            // ✅ WHY: Maintains data integrity by undoing all changes
            Database.rollback(sp);
            System.debug('Transaction failed, rolled back: ' + e.getMessage());
            throw e; // Re-throw to notify caller
        }
    }

    // ✅ WHAT: Bulk processing with error isolation
    // ✅ WHY: Continues processing valid records even when some fail
    public static void bulkUpdateWithErrorHandling(List<Account> accountsToUpdate) {
        // ✅ Use Database.update with allOrNone = false
        Database.SaveResult[] results = Database.update(accountsToUpdate, false);

        List<Account> failedAccounts = new List<Account>();

        for (Integer i = 0; i < results.size(); i++) {
            Database.SaveResult result = results[i];
            Account acc = accountsToUpdate[i];

            if (result.isSuccess()) {
                System.debug('Updated account: ' + acc.Name);
            } else {
                // ✅ Collect failed records for retry or manual review
                failedAccounts.add(acc);

                // ✅ Log specific error details
                for (Database.Error error : result.getErrors()) {
                    System.debug('Failed to update ' + acc.Name + ': ' +
                               error.getMessage() + ' (Field: ' + error.getFields() + ')');
                }
            }
        }

        // ✅ Handle failed records appropriately
        if (!failedAccounts.isEmpty()) {
            // Could retry, send to admin, or store for manual processing
            System.debug(failedAccounts.size() + ' accounts failed to update');
        }
    }

    // ✅ WHAT: Query optimization to avoid limits
    // ✅ WHY: Prevents hitting SOQL query limits in bulk operations
    // 💥 IF WRONG: Multiple queries in loops hit governor limits
    public static void processAccountContactRelationships() {
        // ✅ GOOD: Single query with relationships
        List<Account> accountsWithContacts = [
            SELECT Id, Name, Type,
                   (SELECT Id, Name, Email FROM Contacts WHERE Email != null)
            FROM Account
            WHERE Type = 'Customer'
            AND Id IN (SELECT AccountId FROM Contact WHERE Email != null)
        ];

        // ✅ Process all data from single query
        for (Account acc : accountsWithContacts) {
            System.debug('Account: ' + acc.Name + ' has ' + acc.Contacts.size() + ' contacts');

            for (Contact con : acc.Contacts) {
                // ✅ Process each contact
                EmailService.addToNewsletter(con.Email);
            }
        }

        // ✅ BAD: This would create N+1 query problem
        // for (Account acc : accounts) {
        //     List<Contact> contacts = [SELECT Id, Email FROM Contact WHERE AccountId = :acc.Id];
        //     // This creates one query per account!
        // }
    }

    // ✅ WHAT: Proper exception handling hierarchy
    // ✅ WHY: Different error types need different handling strategies
    public static void handleDifferentExceptionTypes(List<Contact> contactsToProcess) {
        try {
            insert contactsToProcess;

        } catch (DmlException e) {
            // ✅ Handle DML-specific errors
            System.debug('DML Error occurred: ' + e.getMessage());

            for (Integer i = 0; i < e.getNumDml(); i++) {
                System.debug('Record ' + i + ' failed: ' + e.getDmlMessage(i));
                System.debug('Error code: ' + e.getDmlType(i));
                System.debug('Failed fields: ' + e.getDmlFields(i));
            }

        } catch (QueryException e) {
            // ✅ Handle query-related errors
            System.debug('Query Error: ' + e.getMessage());

        } catch (Exception e) {
            // ✅ Handle any other unexpected errors
            System.debug('Unexpected error: ' + e.getMessage());
            System.debug('Stack trace: ' + e.getStackTraceString());

            // ✅ Could send email to admin or log to custom object
            ErrorLogger.logError('ContactProcessor', 'handleDifferentExceptionTypes', e);
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Savepoints allow you to rollback to a specific point if errors occur, maintaining data integrity",
                type: "info",
                icon: "💾"
              },
              {
                arrows: "         ↑",
                explanation: "Database.update with allOrNone=false allows partial success and detailed error information",
                type: "success",
                icon: "🔄"
              },
              {
                arrows: "              ↑",
                explanation: "Use relationship queries to avoid N+1 problems. One query with subqueries beats many individual queries",
                type: "warning",
                icon: "⚡"
              },
              {
                arrows: "                   ↑",
                explanation: "Catch specific exception types (DmlException, QueryException) for targeted error handling",
                type: "info",
                icon: "🎯"
              }
            ]}
          />
        </section>

        <section className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">🚀 Database Performance Tips</h3>
          <ul className="space-y-2 text-green-800 dark:text-green-200">
            <li><strong>Selective Queries:</strong> Only query fields you need, use WHERE clauses to filter</li>
            <li><strong>Bulk Operations:</strong> Always process records in bulk, never use DML in loops</li>
            <li><strong>Relationship Queries:</strong> Use subqueries instead of separate queries to avoid N+1 problems</li>
            <li><strong>Error Handling:</strong> Use Database.* methods with allOrNone=false for partial success</li>
            <li><strong>Governor Limits:</strong> Be aware of SOQL query limits (100), DML row limits (10,000), heap size</li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'triggers',
    title: 'Triggers',
    icon: Timer,
    description: 'Apex triggers and automation patterns',
    content: (
      <div className="space-y-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <strong>Your data needs automated business logic.</strong> Triggers execute automatically when records are inserted, updated, or deleted. They're powerful but require careful design to avoid performance issues and maintain data integrity.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Trigger Fundamentals and Context</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Every trigger provides context about the operation being performed. Understanding this context is crucial for writing effective triggers:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Trigger declaration with multiple events
// ✅ WHY: Single trigger handles all events for better organization and performance
// 💥 IF WRONG: Multiple triggers on same object can cause unexpected execution order
trigger AccountTrigger on Account (before insert, before update, after insert, after update, after delete) {

    // ✅ WHAT: Using Trigger.isExecuting to check if running in trigger context
    // ✅ WHY: Prevents logic execution outside trigger context
    if (!Trigger.isExecuting) {
        return;
    }

    // ✅ WHAT: Separate handler class for trigger logic
    // ✅ WHY: Keeps trigger lean, makes logic testable and reusable
    // 💥 IF WRONG: Business logic in trigger makes testing difficult
    AccountTriggerHandler handler = new AccountTriggerHandler();

    // ✅ WHAT: Context-specific logic based on trigger operation
    // ✅ WHY: Different events need different processing logic
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            // ✅ Before insert: validation, default values, field manipulation
            handler.handleBeforeInsert(Trigger.new);
        }
        if (Trigger.isUpdate) {
            // ✅ Before update: validation, field updates based on changes
            handler.handleBeforeUpdate(Trigger.new, Trigger.oldMap);
        }
    }

    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            // ✅ After insert: create related records, send notifications
            handler.handleAfterInsert(Trigger.newMap);
        }
        if (Trigger.isUpdate) {
            // ✅ After update: update related records, audit changes
            handler.handleAfterUpdate(Trigger.newMap, Trigger.oldMap);
        }
        if (Trigger.isDelete) {
            // ✅ After delete: cleanup related records, logging
            handler.handleAfterDelete(Trigger.oldMap);
        }
    }
}

// ✅ WHAT: Dedicated handler class for trigger logic
// ✅ WHY: Separation of concerns, easier testing, reusable code
public class AccountTriggerHandler {

    // ✅ WHAT: Prevent recursive trigger execution
    // ✅ WHY: Stops infinite loops when trigger logic causes more triggers
    private static Boolean isProcessing = false;

    public void handleBeforeInsert(List<Account> newAccounts) {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // ✅ WHAT: Default value assignment in before trigger
            // ✅ WHY: Before triggers can modify record fields before save
            for (Account acc : newAccounts) {
                if (String.isBlank(acc.AccountNumber)) {
                    acc.AccountNumber = generateAccountNumber();
                }

                // ✅ Set default industry if not provided
                if (String.isBlank(acc.Industry)) {
                    acc.Industry = 'Other';
                }

                // ✅ Standardize account name formatting
                if (String.isNotBlank(acc.Name)) {
                    acc.Name = acc.Name.trim();
                }
            }

        } finally {
            isProcessing = false;
        }
    }

    public void handleBeforeUpdate(List<Account> newAccounts, Map<Id, Account> oldAccountMap) {
        if (isProcessing) return;
        isProcessing = true;

        try {
            for (Account newAcc : newAccounts) {
                Account oldAcc = oldAccountMap.get(newAcc.Id);

                // ✅ WHAT: Field change detection
                // ✅ WHY: Only process records where specific fields changed
                if (hasSignificantChange(newAcc, oldAcc)) {
                    newAcc.Last_Significant_Update__c = System.now();

                    // ✅ Log the change type
                    if (newAcc.Type != oldAcc.Type) {
                        newAcc.Type_Change_History__c =
                            (newAcc.Type_Change_History__c != null ? newAcc.Type_Change_History__c + '; ' : '') +
                            'Changed from ' + oldAcc.Type + ' to ' + newAcc.Type + ' on ' + System.today();
                    }
                }
            }

        } finally {
            isProcessing = false;
        }
    }

    // ✅ WHAT: Helper method to detect significant field changes
    // ✅ WHY: Reduces unnecessary processing and improves performance
    private Boolean hasSignificantChange(Account newAcc, Account oldAcc) {
        return newAcc.Type != oldAcc.Type ||
               newAcc.Industry != oldAcc.Industry ||
               newAcc.AnnualRevenue != oldAcc.AnnualRevenue;
    }

    private String generateAccountNumber() {
        // ✅ Simple account number generation
        return 'ACC-' + String.valueOf(System.currentTimeMillis()).right(8);
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Triggers should handle multiple events in one trigger for better organization and predictable execution order",
                type: "info",
                icon: "🔄"
              },
              {
                arrows: "         ↑",
                explanation: "Use separate handler classes to keep triggers lean and make business logic testable",
                type: "success",
                icon: "🏗️"
              },
              {
                arrows: "              ↑",
                explanation: "Before triggers can modify record fields. Use them for validation, default values, and field manipulation",
                type: "warning",
                icon: "⚡"
              },
              {
                arrows: "                   ↑",
                explanation: "Recursion prevention is crucial to avoid infinite trigger loops when your logic modifies data",
                type: "danger",
                icon: "🔁"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Bulkification and Performance Patterns</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Triggers must handle bulk operations efficiently. Always design for collections, never individual records:
          </p>

          <AnnotatedCode
            code={`public class OpportunityTriggerHandler {

    // ✅ WHAT: Bulk-safe after insert handler
    // ✅ WHY: Handles 1 record or 200 records with same performance characteristics
    // 💥 IF WRONG: Per-record processing hits governor limits quickly
    public void handleAfterInsert(Map<Id, Opportunity> newOpportunityMap) {
        // ✅ Collect all account IDs in one pass
        Set<Id> accountIds = new Set<Id>();
        List<Opportunity> highValueOpps = new List<Opportunity>();

        for (Opportunity opp : newOpportunityMap.values()) {
            accountIds.add(opp.AccountId);

            // ✅ Identify high-value opportunities for special processing
            if (opp.Amount > 100000) {
                highValueOpps.add(opp);
            }
        }

        // ✅ WHAT: Single query to get all related account data
        // ✅ WHY: One query handles all accounts, regardless of opportunity count
        // 💥 IF WRONG: Querying in loops creates N+1 query problems
        Map<Id, Account> accountMap = new Map<Id, Account>([
            SELECT Id, Name, Type, Industry, Owner.Email
            FROM Account
            WHERE Id IN :accountIds
        ]);

        // ✅ Process high-value opportunities
        if (!highValueOpps.isEmpty()) {
            createHighValueOpportunityTasks(highValueOpps, accountMap);
        }

        // ✅ Update account statistics in bulk
        updateAccountOpportunityStats(accountIds);
    }

    // ✅ WHAT: Bulk task creation pattern
    // ✅ WHY: Creates all tasks in single DML operation
    private void createHighValueOpportunityTasks(
        List<Opportunity> opportunities,
        Map<Id, Account> accountMap
    ) {
        List<Task> tasksToCreate = new List<Task>();

        for (Opportunity opp : opportunities) {
            Account acc = accountMap.get(opp.AccountId);

            // ✅ Create task for opportunity owner
            Task oppTask = new Task(
                WhatId = opp.Id,
                OwnerId = opp.OwnerId,
                Subject = 'Follow up on high-value opportunity: ' + opp.Name,
                Description = 'Opportunity amount: $' + opp.Amount +
                            '\\nAccount: ' + acc.Name +
                            '\\nIndustry: ' + acc.Industry,
                ActivityDate = System.today().addDays(1),
                Status = 'Not Started',
                Priority = 'High'
            );
            tasksToCreate.add(oppTask);

            // ✅ Create task for account owner if different
            if (acc.OwnerId != opp.OwnerId) {
                Task accTask = new Task(
                    WhatId = acc.Id,
                    OwnerId = acc.OwnerId,
                    Subject = 'High-value opportunity created on your account',
                    Description = 'New opportunity: ' + opp.Name +
                                '\\nAmount: $' + opp.Amount,
                    ActivityDate = System.today().addDays(1),
                    Status = 'Not Started',
                    Priority = 'Normal'
                );
                tasksToCreate.add(accTask);
            }
        }

        // ✅ WHAT: Single DML operation for all tasks
        // ✅ WHY: Efficient regardless of number of tasks created
        if (!tasksToCreate.isEmpty()) {
            insert tasksToCreate;
        }
    }

    // ✅ WHAT: Bulk update of related records
    // ✅ WHY: Updates account statistics based on opportunity changes
    private void updateAccountOpportunityStats(Set<Id> accountIds) {
        // ✅ Query current opportunity statistics
        List<AggregateResult> oppStats = [
            SELECT AccountId, COUNT(Id) oppCount, SUM(Amount) totalAmount
            FROM Opportunity
            WHERE AccountId IN :accountIds
            AND StageName NOT IN ('Closed Lost', 'Closed Won')
            GROUP BY AccountId
        ];

        List<Account> accountsToUpdate = new List<Account>();

        for (AggregateResult stat : oppStats) {
            Account acc = new Account(
                Id = (Id) stat.get('AccountId'),
                Active_Opportunity_Count__c = (Integer) stat.get('oppCount'),
                Total_Pipeline_Amount__c = (Decimal) stat.get('totalAmount')
            );
            accountsToUpdate.add(acc);
        }

        // ✅ Single update for all affected accounts
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }

    // ✅ WHAT: Bulk-safe update handler with change detection
    // ✅ WHY: Only processes records where relevant fields changed
    public void handleAfterUpdate(Map<Id, Opportunity> newOpportunityMap, Map<Id, Opportunity> oldOpportunityMap) {
        List<Opportunity> stageChangedOpps = new List<Opportunity>();
        List<Opportunity> amountChangedOpps = new List<Opportunity>();

        // ✅ Identify what type of changes occurred
        for (Id oppId : newOpportunityMap.keySet()) {
            Opportunity newOpp = newOpportunityMap.get(oppId);
            Opportunity oldOpp = oldOpportunityMap.get(oppId);

            // ✅ Stage change detection
            if (newOpp.StageName != oldOpp.StageName) {
                stageChangedOpps.add(newOpp);
            }

            // ✅ Amount change detection
            if (newOpp.Amount != oldOpp.Amount) {
                amountChangedOpps.add(newOpp);
            }
        }

        // ✅ Process each type of change appropriately
        if (!stageChangedOpps.isEmpty()) {
            processStageChanges(stageChangedOpps, oldOpportunityMap);
        }

        if (!amountChangedOpps.isEmpty()) {
            // Update account pipeline amounts
            Set<Id> affectedAccountIds = new Set<Id>();
            for (Opportunity opp : amountChangedOpps) {
                affectedAccountIds.add(opp.AccountId);
            }
            updateAccountOpportunityStats(affectedAccountIds);
        }
    }

    private void processStageChanges(List<Opportunity> changedOpps, Map<Id, Opportunity> oldOpportunityMap) {
        List<Opportunity> wonOpps = new List<Opportunity>();
        List<Opportunity> lostOpps = new List<Opportunity>();

        for (Opportunity opp : changedOpps) {
            if (opp.StageName == 'Closed Won') {
                wonOpps.add(opp);
            } else if (opp.StageName == 'Closed Lost') {
                lostOpps.add(opp);
            }
        }

        // ✅ Handle won opportunities
        if (!wonOpps.isEmpty()) {
            createWonOpportunityFollowups(wonOpps);
        }

        // ✅ Handle lost opportunities
        if (!lostOpps.isEmpty()) {
            logLostOpportunityReasons(lostOpps);
        }
    }

    private void createWonOpportunityFollowups(List<Opportunity> wonOpps) {
        List<Task> followupTasks = new List<Task>();

        for (Opportunity opp : wonOpps) {
            Task followup = new Task(
                WhatId = opp.Id,
                OwnerId = opp.OwnerId,
                Subject = 'Implementation planning for won opportunity',
                Description = 'Begin implementation planning for: ' + opp.Name,
                ActivityDate = System.today().addDays(3),
                Status = 'Not Started',
                Priority = 'High'
            );
            followupTasks.add(followup);
        }

        if (!followupTasks.isEmpty()) {
            insert followupTasks;
        }
    }

    private void logLostOpportunityReasons(List<Opportunity> lostOpps) {
        // ✅ Could create custom log records, send reports, etc.
        for (Opportunity opp : lostOpps) {
            System.debug('Lost opportunity: ' + opp.Name +
                        ', Reason: ' + opp.Loss_Reason__c +
                        ', Amount: $' + opp.Amount);
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Always collect data in bulk first, then process collections. Never query or process one record at a time",
                type: "success",
                icon: "📦"
              },
              {
                arrows: "         ↑",
                explanation: "Single queries handle all related data efficiently, avoiding N+1 query patterns in triggers",
                type: "warning",
                icon: "🔍"
              },
              {
                arrows: "              ↑",
                explanation: "Build collections of records to modify, then use single DML operations for all changes",
                type: "info",
                icon: "⚡"
              },
              {
                arrows: "                   ↑",
                explanation: "Detect specific field changes to avoid unnecessary processing and improve trigger performance",
                type: "info",
                icon: "🎯"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Advanced Trigger Patterns</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Complex business requirements need sophisticated trigger patterns. Here are proven approaches:
          </p>

          <AnnotatedCode
            code={`public class ContactTriggerHandler {

    // ✅ WHAT: Platform event publishing from triggers
    // ✅ WHY: Decouples trigger logic from external system integration
    // 💥 IF WRONG: Direct callouts from triggers are not allowed
    public void handleAfterInsert(List<Contact> newContacts) {
        List<Contact_Created__e> eventsToPublish = new List<Contact_Created__e>();

        for (Contact con : newContacts) {
            // ✅ Create platform event for external system notification
            Contact_Created__e event = new Contact_Created__e(
                Contact_Id__c = con.Id,
                Contact_Name__c = con.Name,
                Account_Id__c = con.AccountId,
                Email__c = con.Email,
                Created_Date__c = System.now()
            );
            eventsToPublish.add(event);
        }

        // ✅ Publish events for asynchronous processing
        if (!eventsToPublish.isEmpty()) {
            EventBus.publish(eventsToPublish);
        }
    }

    // ✅ WHAT: Complex validation with related record checking
    // ✅ WHY: Business rules often require checking related data
    public void handleBeforeInsert(List<Contact> newContacts) {
        // ✅ Collect account IDs for bulk validation
        Set<Id> accountIds = new Set<Id>();
        for (Contact con : newContacts) {
            if (con.AccountId != null) {
                accountIds.add(con.AccountId);
            }
        }

        // ✅ Get account information in bulk
        Map<Id, Account> accountMap = new Map<Id, Account>([
            SELECT Id, Type, Max_Contacts__c,
                   (SELECT Id FROM Contacts)
            FROM Account
            WHERE Id IN :accountIds
        ]);

        // ✅ Validate each contact against business rules
        for (Contact con : newContacts) {
            validateContactBusinessRules(con, accountMap.get(con.AccountId));
        }
    }

    private void validateContactBusinessRules(Contact con, Account acc) {
        if (acc == null) return;

        // ✅ WHAT: Business rule validation
        // ✅ WHY: Enforce data quality and business constraints

        // Rule 1: Customer accounts can have unlimited contacts
        // Rule 2: Prospect accounts limited to 3 contacts
        // Rule 3: Partner accounts limited to 10 contacts

        Integer currentContactCount = acc.Contacts.size();
        Integer maxAllowed = getMaxContactsForAccountType(acc.Type, acc.Max_Contacts__c);

        if (maxAllowed != null && currentContactCount >= maxAllowed) {
            con.addError('Account ' + acc.Id + ' has reached maximum allowed contacts (' +
                        maxAllowed + ') for account type: ' + acc.Type);
        }

        // ✅ Email domain validation for specific account types
        if (acc.Type == 'Customer' && String.isNotBlank(con.Email)) {
            if (!isValidEmailDomain(con.Email, acc.Id)) {
                con.Email.addError('Email domain does not match approved domains for this account');
            }
        }
    }

    private Integer getMaxContactsForAccountType(String accountType, Decimal customLimit) {
        // ✅ Custom limit takes precedence
        if (customLimit != null) {
            return customLimit.intValue();
        }

        // ✅ Default limits by account type
        switch on accountType {
            when 'Customer' { return null; } // Unlimited
            when 'Prospect' { return 3; }
            when 'Partner' { return 10; }
            when else { return 5; } // Default limit
        }
    }

    private Boolean isValidEmailDomain(String email, Id accountId) {
        // ✅ This could check against approved domain list
        // For now, simple validation
        if (!email.contains('@')) return false;

        String domain = email.split('@')[1].toLowerCase();

        // ✅ Could query custom metadata for approved domains per account
        // List<Approved_Domain__mdt> approvedDomains = [SELECT Domain__c FROM Approved_Domain__mdt];

        return true; // Simplified for example
    }

    // ✅ WHAT: Trigger framework pattern with bypass mechanism
    // ✅ WHY: Allows selective trigger bypass for data migration or testing
    public void handleBeforeUpdate(List<Contact> newContacts, Map<Id, Contact> oldContactMap) {
        // ✅ Check if triggers should be bypassed
        if (TriggerBypassManager.isBypassed('ContactTrigger')) {
            return;
        }

        List<Contact> emailChangedContacts = new List<Contact>();
        List<Contact> nameChangedContacts = new List<Contact>();

        // ✅ Categorize changes for targeted processing
        for (Contact newCon : newContacts) {
            Contact oldCon = oldContactMap.get(newCon.Id);

            if (newCon.Email != oldCon.Email) {
                emailChangedContacts.add(newCon);
            }

            if (newCon.FirstName != oldCon.FirstName || newCon.LastName != oldCon.LastName) {
                nameChangedContacts.add(newCon);
            }
        }

        // ✅ Process each type of change
        if (!emailChangedContacts.isEmpty()) {
            validateEmailChanges(emailChangedContacts, oldContactMap);
        }

        if (!nameChangedContacts.isEmpty()) {
            processNameChanges(nameChangedContacts, oldContactMap);
        }
    }

    private void validateEmailChanges(List<Contact> contacts, Map<Id, Contact> oldContactMap) {
        for (Contact con : contacts) {
            Contact oldCon = oldContactMap.get(con.Id);

            // ✅ Log email changes for audit
            if (String.isNotBlank(oldCon.Email)) {
                con.Email_Change_History__c =
                    (con.Email_Change_History__c != null ? con.Email_Change_History__c + '; ' : '') +
                    'Changed from ' + oldCon.Email + ' to ' + con.Email + ' on ' + System.today();
            }
        }
    }

    private void processNameChanges(List<Contact> contacts, Map<Id, Contact> oldContactMap) {
        for (Contact con : contacts) {
            // ✅ Update full name field
            con.Full_Name__c =
                (String.isNotBlank(con.FirstName) ? con.FirstName + ' ' : '') +
                (String.isNotBlank(con.LastName) ? con.LastName : '');

            // ✅ Set flag for external system sync
            con.Needs_External_Sync__c = true;
        }
    }

    // ✅ WHAT: After delete cleanup pattern
    // ✅ WHY: Maintain data integrity when records are deleted
    public void handleAfterDelete(Map<Id, Contact> deletedContactMap) {
        Set<Id> accountIds = new Set<Id>();
        List<Id> contactIds = new List<Id>(deletedContactMap.keySet());

        // ✅ Collect related account IDs
        for (Contact con : deletedContactMap.values()) {
            if (con.AccountId != null) {
                accountIds.add(con.AccountId);
            }
        }

        // ✅ Update account contact counts
        if (!accountIds.isEmpty()) {
            updateAccountContactCounts(accountIds);
        }

        // ✅ Archive contact relationships
        archiveContactRelationships(contactIds);
    }

    private void updateAccountContactCounts(Set<Id> accountIds) {
        List<AggregateResult> contactCounts = [
            SELECT AccountId, COUNT(Id) contactCount
            FROM Contact
            WHERE AccountId IN :accountIds
            GROUP BY AccountId
        ];

        List<Account> accountsToUpdate = new List<Account>();

        for (AggregateResult result : contactCounts) {
            Account acc = new Account(
                Id = (Id) result.get('AccountId'),
                Contact_Count__c = (Integer) result.get('contactCount')
            );
            accountsToUpdate.add(acc);
        }

        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }

    private void archiveContactRelationships(List<Id> contactIds) {
        // ✅ Could create archive records, update related data, etc.
        List<Contact_Archive__c> archives = new List<Contact_Archive__c>();

        for (Id contactId : contactIds) {
            Contact_Archive__c archive = new Contact_Archive__c(
                Original_Contact_Id__c = contactId,
                Archived_Date__c = System.now(),
                Archived_By__c = UserInfo.getUserId()
            );
            archives.add(archive);
        }

        if (!archives.isEmpty()) {
            insert archives;
        }
    }
}

// ✅ WHAT: Trigger bypass utility class
// ✅ WHY: Allows controlled trigger bypass for data operations
public class TriggerBypassManager {
    private static Set<String> bypassedTriggers = new Set<String>();

    public static void bypass(String triggerName) {
        bypassedTriggers.add(triggerName);
    }

    public static void clearBypass(String triggerName) {
        bypassedTriggers.remove(triggerName);
    }

    public static Boolean isBypassed(String triggerName) {
        return bypassedTriggers.contains(triggerName);
    }

    public static void clearAllBypasses() {
        bypassedTriggers.clear();
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Platform events allow triggers to integrate with external systems without direct callouts",
                type: "info",
                icon: "📡"
              },
              {
                arrows: "         ↑",
                explanation: "Complex validation often requires checking related records. Always do this in bulk",
                type: "warning",
                icon: "✅"
              },
              {
                arrows: "              ↑",
                explanation: "Categorize changes by type to avoid unnecessary processing and improve performance",
                type: "success",
                icon: "🎯"
              },
              {
                arrows: "                   ↑",
                explanation: "Trigger bypass mechanisms are essential for data migration and selective trigger disabling",
                type: "info",
                icon: "🔧"
              }
            ]}
          />
        </section>

        <section className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">⚠️ Trigger Anti-Patterns to Avoid</h3>
          <ul className="space-y-2 text-red-800 dark:text-red-200">
            <li><strong>DML in Loops:</strong> Never use insert/update/delete inside for loops - always build collections</li>
            <li><strong>SOQL in Loops:</strong> Avoid queries inside loops - get all data upfront with relationship queries</li>
            <li><strong>No Recursion Control:</strong> Always implement recursion prevention to avoid infinite trigger loops</li>
            <li><strong>Business Logic in Trigger:</strong> Keep triggers lean - move complex logic to handler classes</li>
            <li><strong>No Error Handling:</strong> Implement proper exception handling and partial success patterns</li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'async',
    title: 'Async Apex',
    icon: Search,
    description: 'Future methods, batch Apex, and queueable',
    content: (
      <div className="space-y-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <strong>Your business logic needs to escape governor limits.</strong> Asynchronous Apex runs your code in separate transactions with higher limits, allowing processing of large data volumes, external integrations, and long-running operations without blocking user interactions.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Future Methods - Simple Async Processing</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Future methods execute asynchronously with higher governor limits. Perfect for callouts and simple background processing:
          </p>

          <AnnotatedCode
            code={`public class ExternalIntegrationService {

    // ✅ WHAT: Future method declaration
    // ✅ WHY: @future annotation makes method execute asynchronously
    // 💥 IF WRONG: Without @future, callouts block user interface
    @future(callout=true)
    public static void syncAccountToExternalSystem(Set<Id> accountIds) {
        // ✅ WHAT: Higher governor limits in async context
        // ✅ WHY: Future methods get 12MB heap, 60 second timeout
        // 💥 IF WRONG: Sync context has 6MB heap, 10 second timeout

        List<Account> accounts = [
            SELECT Id, Name, Type, Industry, BillingAddress
            FROM Account
            WHERE Id IN :accountIds
            LIMIT 200 // ✅ Future methods can process more records
        ];

        for (Account acc : accounts) {
            try {
                // ✅ WHAT: HTTP callout to external system
                // ✅ WHY: Future methods allow callouts, sync methods don't (in triggers)
                syncSingleAccount(acc);

                // ✅ Update sync status
                acc.External_Sync_Status__c = 'Synced';
                acc.Last_Sync_Date__c = System.now();

            } catch (Exception e) {
                // ✅ Handle individual record failures
                acc.External_Sync_Status__c = 'Failed';
                acc.Sync_Error_Message__c = e.getMessage();
                System.debug('Failed to sync account ' + acc.Id + ': ' + e.getMessage());
            }
        }

        // ✅ Bulk update all accounts
        try {
            update accounts;
        } catch (DmlException e) {
            System.debug('Failed to update sync status: ' + e.getMessage());
        }
    }

    // ✅ WHAT: Helper method for individual account sync
    // ✅ WHY: Separates HTTP logic from bulk processing logic
    private static void syncSingleAccount(Account acc) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://external-system.com/api/accounts');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        // ✅ Build JSON payload
        Map<String, Object> payload = new Map<String, Object>{
            'salesforceId' => acc.Id,
            'name' => acc.Name,
            'type' => acc.Type,
            'industry' => acc.Industry
        };

        req.setBody(JSON.serialize(payload));

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() != 200) {
            throw new CalloutException('HTTP ' + res.getStatusCode() + ': ' + res.getBody());
        }
    }

    // ✅ WHAT: Future method for email notifications
    // ✅ WHY: Async processing prevents email delays from blocking UI
    @future
    public static void sendBulkNotifications(Set<Id> opportunityIds, String templateName) {
        List<Opportunity> opportunities = [
            SELECT Id, Name, Amount, CloseDate, StageName,
                   Account.Name, Owner.Email, Owner.Name
            FROM Opportunity
            WHERE Id IN :opportunityIds
        ];

        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

        for (Opportunity opp : opportunities) {
            if (String.isNotBlank(opp.Owner.Email)) {
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();

                email.setToAddresses(new String[] { opp.Owner.Email });
                email.setSubject('Opportunity Update: ' + opp.Name);

                String body = 'Dear ' + opp.Owner.Name + ',\\n\\n' +
                             'Your opportunity ' + opp.Name + ' has been updated.\\n' +
                             'Amount: $' + opp.Amount + '\\n' +
                             'Stage: ' + opp.StageName + '\\n' +
                             'Close Date: ' + opp.CloseDate + '\\n\\n' +
                             'Best regards,\\nSalesforce System';

                email.setPlainTextBody(body);
                emails.add(email);
            }
        }

        // ✅ WHAT: Bulk email sending
        // ✅ WHY: Single email operation handles multiple messages efficiently
        if (!emails.isEmpty()) {
            try {
                Messaging.sendEmail(emails);
                System.debug('Sent ' + emails.size() + ' notification emails');
            } catch (Exception e) {
                System.debug('Failed to send emails: ' + e.getMessage());
            }
        }
    }

    // ✅ WHAT: Future method with primitive parameters only
    // ✅ WHY: Future methods can only accept primitive types and collections of primitives
    // 💥 IF WRONG: Passing sObjects or custom classes causes compilation error
    @future
    public static void processRecords(List<Id> recordIds, String processType, Boolean isUrgent) {
        // ✅ Query records inside future method
        if (processType == 'ACCOUNT') {
            List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id IN :recordIds];
            // Process accounts...
        } else if (processType == 'CONTACT') {
            List<Contact> contacts = [SELECT Id, Name FROM Contact WHERE Id IN :recordIds];
            // Process contacts...
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "@future annotation executes method asynchronously with higher limits. Must be static and use primitive parameters only",
                type: "info",
                icon: "⚡"
              },
              {
                arrows: "         ↑",
                explanation: "Future methods get higher governor limits: 12MB heap vs 6MB, and can make HTTP callouts",
                type: "success",
                icon: "📈"
              },
              {
                arrows: "              ↑",
                explanation: "Always handle individual record failures in async processing to avoid losing all work",
                type: "warning",
                icon: "🛡️"
              },
              {
                arrows: "                   ↑",
                explanation: "Future methods accept only primitives. Query sObjects inside the method, don't pass them as parameters",
                type: "danger",
                icon: "⚠️"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Batch Apex - Large Data Processing</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Batch Apex processes large datasets by breaking them into manageable chunks. Essential for data migration and bulk operations:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Batch class implementing Database.Batchable interface
// ✅ WHY: Processes large datasets in chunks to avoid governor limits
// 💥 IF WRONG: Processing millions of records synchronously hits limits
public class AccountCleanupBatch implements Database.Batchable<sObject>, Database.Stateful {

    // ✅ WHAT: Instance variables for tracking batch state
    // ✅ WHY: Database.Stateful preserves state across batch chunks
    private Integer recordsProcessed = 0;
    private Integer recordsUpdated = 0;
    private Integer recordsWithErrors = 0;

    private String processType;
    private Date cutoffDate;

    // ✅ WHAT: Constructor for batch configuration
    // ✅ WHY: Allows parameterized batch execution
    public AccountCleanupBatch(String processType, Date cutoffDate) {
        this.processType = processType;
        this.cutoffDate = cutoffDate;
    }

    // ✅ WHAT: start() method defines the dataset to process
    // ✅ WHY: Returns a QueryLocator or Iterable for the batch to process
    public Database.QueryLocator start(Database.BatchableContext context) {
        System.debug('Starting AccountCleanupBatch for process: ' + processType);

        String query;

        // ✅ Build query based on process type
        switch on processType {
            when 'INACTIVE_CLEANUP' {
                query = 'SELECT Id, Name, Type, LastActivityDate, Active__c ' +
                       'FROM Account ' +
                       'WHERE LastActivityDate < :cutoffDate ' +
                       'AND Active__c = true';
            }
            when 'DUPLICATE_MERGE' {
                query = 'SELECT Id, Name, Type, BillingPostalCode ' +
                       'FROM Account ' +
                       'WHERE Name != null ' +
                       'ORDER BY Name, CreatedDate';
            }
            when else {
                query = 'SELECT Id FROM Account LIMIT 0'; // Empty result
            }
        }

        return Database.getQueryLocator(query);
    }

    // ✅ WHAT: execute() method processes each batch chunk
    // ✅ WHY: Called once per chunk (default 200 records, configurable up to 2000)
    public void execute(Database.BatchableContext context, List<Account> accounts) {
        System.debug('Processing batch chunk with ' + accounts.size() + ' accounts');

        recordsProcessed += accounts.size();

        try {
            switch on processType {
                when 'INACTIVE_CLEANUP' {
                    processInactiveAccounts(accounts);
                }
                when 'DUPLICATE_MERGE' {
                    processDuplicateAccounts(accounts);
                }
            }
        } catch (Exception e) {
            System.debug('Error in batch execute: ' + e.getMessage());
            recordsWithErrors += accounts.size();
        }
    }

    // ✅ WHAT: finish() method called after all batches complete
    // ✅ WHY: Performs cleanup, sends notifications, or starts dependent jobs
    public void finish(Database.BatchableContext context) {
        System.debug('AccountCleanupBatch completed');
        System.debug('Records processed: ' + recordsProcessed);
        System.debug('Records updated: ' + recordsUpdated);
        System.debug('Records with errors: ' + recordsWithErrors);

        // ✅ Send completion notification
        sendBatchCompletionEmail(context);

        // ✅ Start dependent batch if needed
        if (processType == 'INACTIVE_CLEANUP') {
            // Could start a follow-up batch for related data cleanup
            // Database.executeBatch(new RelatedDataCleanupBatch());
        }
    }

    // ✅ WHAT: Business logic for inactive account processing
    private void processInactiveAccounts(List<Account> accounts) {
        List<Account> accountsToUpdate = new List<Account>();

        for (Account acc : accounts) {
            // ✅ Mark as inactive if no activity for specified period
            if (acc.LastActivityDate < cutoffDate) {
                acc.Active__c = false;
                acc.Deactivation_Date__c = System.today();
                acc.Deactivation_Reason__c = 'No activity since ' + acc.LastActivityDate;
                accountsToUpdate.add(acc);
            }
        }

        // ✅ WHAT: Bulk update with error handling
        // ✅ WHY: Use Database.update with partial success for batch reliability
        if (!accountsToUpdate.isEmpty()) {
            Database.SaveResult[] results = Database.update(accountsToUpdate, false);

            for (Integer i = 0; i < results.size(); i++) {
                if (results[i].isSuccess()) {
                    recordsUpdated++;
                } else {
                    recordsWithErrors++;
                    System.debug('Failed to update account ' + accountsToUpdate[i].Id +
                               ': ' + results[i].getErrors()[0].getMessage());
                }
            }
        }
    }

    private void processDuplicateAccounts(List<Account> accounts) {
        // ✅ Simple duplicate detection by name
        Map<String, List<Account>> accountsByName = new Map<String, List<Account>>();

        for (Account acc : accounts) {
            String key = acc.Name.toLowerCase().trim();
            if (!accountsByName.containsKey(key)) {
                accountsByName.put(key, new List<Account>());
            }
            accountsByName.get(key).add(acc);
        }

        List<Account> accountsToUpdate = new List<Account>();

        // ✅ Mark potential duplicates
        for (String accountName : accountsByName.keySet()) {
            List<Account> duplicates = accountsByName.get(accountName);

            if (duplicates.size() > 1) {
                // Mark all but the first as potential duplicates
                for (Integer i = 1; i < duplicates.size(); i++) {
                    Account acc = duplicates[i];
                    acc.Potential_Duplicate__c = true;
                    acc.Duplicate_Of__c = duplicates[0].Id;
                    accountsToUpdate.add(acc);
                }
            }
        }

        if (!accountsToUpdate.isEmpty()) {
            try {
                update accountsToUpdate;
                recordsUpdated += accountsToUpdate.size();
            } catch (DmlException e) {
                recordsWithErrors += accountsToUpdate.size();
                System.debug('Failed to mark duplicates: ' + e.getMessage());
            }
        }
    }

    private void sendBatchCompletionEmail(Database.BatchableContext context) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();

        email.setToAddresses(new String[] { UserInfo.getUserEmail() });
        email.setSubject('Account Cleanup Batch Completed - ' + processType);

        String body = 'Account cleanup batch has completed.\\n\\n' +
                     'Process Type: ' + processType + '\\n' +
                     'Records Processed: ' + recordsProcessed + '\\n' +
                     'Records Updated: ' + recordsUpdated + '\\n' +
                     'Records with Errors: ' + recordsWithErrors + '\\n\\n' +
                     'Job ID: ' + context.getJobId();

        email.setPlainTextBody(body);

        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        } catch (Exception e) {
            System.debug('Failed to send completion email: ' + e.getMessage());
        }
    }
}

// ✅ WHAT: Utility class for batch execution
// ✅ WHY: Provides convenient methods to start different batch types
public class BatchJobManager {

    // ✅ WHAT: Start inactive account cleanup batch
    public static Id startInactiveAccountCleanup(Integer daysInactive) {
        Date cutoffDate = System.today().addDays(-daysInactive);
        AccountCleanupBatch batch = new AccountCleanupBatch('INACTIVE_CLEANUP', cutoffDate);

        // ✅ WHAT: Configure batch size (default 200, max 2000)
        // ✅ WHY: Smaller batches for complex processing, larger for simple updates
        return Database.executeBatch(batch, 100);
    }

    // ✅ WHAT: Start duplicate detection batch
    public static Id startDuplicateDetection() {
        AccountCleanupBatch batch = new AccountCleanupBatch('DUPLICATE_MERGE', null);
        return Database.executeBatch(batch, 500); // Larger batch for simple comparison
    }

    // ✅ WHAT: Check batch job status
    public static void checkBatchStatus(Id jobId) {
        AsyncApexJob job = [
            SELECT Id, Status, JobType, NumberOfErrors,
                   JobItemsProcessed, TotalJobItems, CreatedDate, CompletedDate
            FROM AsyncApexJob
            WHERE Id = :jobId
        ];

        System.debug('Batch Job Status: ' + job.Status);
        System.debug('Progress: ' + job.JobItemsProcessed + '/' + job.TotalJobItems);
        System.debug('Errors: ' + job.NumberOfErrors);

        if (job.Status == 'Completed') {
            System.debug('Job completed at: ' + job.CompletedDate);
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Batch classes implement Database.Batchable interface. Use Database.Stateful to preserve data across chunks",
                type: "info",
                icon: "🔄"
              },
              {
                arrows: "         ↑",
                explanation: "start() returns QueryLocator for up to 50M records, or Iterable for complex data sources",
                type: "success",
                icon: "🎯"
              },
              {
                arrows: "              ↑",
                explanation: "execute() processes each chunk. Use Database.update with allOrNone=false for reliability",
                type: "warning",
                icon: "⚙️"
              },
              {
                arrows: "                   ↑",
                explanation: "finish() handles completion logic. Perfect for notifications or chaining dependent jobs",
                type: "info",
                icon: "🏁"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Queueable Apex - Flexible Async Processing</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Queueable Apex combines the benefits of future methods and batch Apex. It's perfect for complex async operations that need to chain together:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Queueable class implementing System.Queueable interface
// ✅ WHY: More flexible than future methods, can chain jobs and pass complex data
public class OpportunityProcessingJob implements System.Queueable, Database.AllowsCallouts {

    private List<Id> opportunityIds;
    private String processType;
    private Map<String, Object> parameters;

    // ✅ WHAT: Constructor accepting complex parameters
    // ✅ WHY: Unlike future methods, queueable can accept sObjects and complex types
    public OpportunityProcessingJob(List<Id> oppIds, String processType, Map<String, Object> params) {
        this.opportunityIds = oppIds;
        this.processType = processType;
        this.parameters = params != null ? params : new Map<String, Object>();
    }

    // ✅ WHAT: execute() method - main queueable logic
    // ✅ WHY: Runs asynchronously with higher governor limits
    public void execute(System.QueueableContext context) {
        System.debug('Starting OpportunityProcessingJob: ' + processType);
        System.debug('Processing ' + opportunityIds.size() + ' opportunities');

        try {
            switch on processType {
                when 'STAGE_AUTOMATION' {
                    processStageAutomation();
                }
                when 'EXTERNAL_SYNC' {
                    syncWithExternalSystem();
                }
                when 'COMPLEX_CALCULATION' {
                    performComplexCalculations();
                }
                when 'CHAIN_PROCESSING' {
                    processAndChainNext(context);
                }
            }
        } catch (Exception e) {
            System.debug('Error in queueable job: ' + e.getMessage());
            handleJobError(e, context);
        }
    }

    // ✅ WHAT: Stage automation processing
    private void processStageAutomation() {
        List<Opportunity> opportunities = [
            SELECT Id, Name, StageName, Amount, CloseDate,
                   Account.Name, Account.Type, Owner.Email
            FROM Opportunity
            WHERE Id IN :opportunityIds
        ];

        List<Opportunity> oppsToUpdate = new List<Opportunity>();
        List<Task> tasksToCreate = new List<Task>();

        for (Opportunity opp : opportunities) {
            // ✅ Advanced stage logic based on opportunity characteristics
            String newStage = calculateOptimalStage(opp);

            if (newStage != opp.StageName) {
                opp.StageName = newStage;
                opp.Stage_Change_Reason__c = 'Automated optimization';
                oppsToUpdate.add(opp);

                // ✅ Create follow-up task
                Task followup = new Task(
                    WhatId = opp.Id,
                    OwnerId = opp.OwnerId,
                    Subject = 'Review automated stage change: ' + newStage,
                    Description = 'Opportunity automatically moved to ' + newStage +
                                ' based on optimization rules.',
                    ActivityDate = System.today().addDays(1),
                    Priority = 'Normal'
                );
                tasksToCreate.add(followup);
            }
        }

        // ✅ Bulk operations
        if (!oppsToUpdate.isEmpty()) {
            update oppsToUpdate;
        }
        if (!tasksToCreate.isEmpty()) {
            insert tasksToCreate;
        }
    }

    // ✅ WHAT: External system synchronization with callouts
    // ✅ WHY: Queueable supports callouts with Database.AllowsCallouts interface
    private void syncWithExternalSystem() {
        List<Opportunity> opportunities = [
            SELECT Id, Name, Amount, StageName, CloseDate
            FROM Opportunity
            WHERE Id IN :opportunityIds
        ];

        for (Opportunity opp : opportunities) {
            try {
                // ✅ HTTP callout to external system
                HttpRequest req = new HttpRequest();
                req.setEndpoint('https://external-crm.com/api/opportunities');
                req.setMethod('PUT');
                req.setHeader('Content-Type', 'application/json');

                Map<String, Object> payload = new Map<String, Object>{
                    'salesforceId' => opp.Id,
                    'name' => opp.Name,
                    'amount' => opp.Amount,
                    'stage' => opp.StageName,
                    'closeDate' => opp.CloseDate?.format()
                };

                req.setBody(JSON.serialize(payload));

                Http http = new Http();
                HttpResponse res = http.send(req);

                // ✅ Update sync status based on response
                opp.External_Sync_Status__c = res.getStatusCode() == 200 ? 'Success' : 'Failed';
                opp.Last_Sync_Date__c = System.now();

            } catch (Exception e) {
                opp.External_Sync_Status__c = 'Failed';
                opp.Sync_Error__c = e.getMessage();
            }
        }

        // ✅ Update all opportunities with sync results
        update opportunities;
    }

    // ✅ WHAT: Complex calculations that need async processing
    private void performComplexCalculations() {
        Decimal complexityFactor = (Decimal) parameters.get('complexityFactor');
        Boolean includeHistoricalData = (Boolean) parameters.get('includeHistoricalData');

        List<Opportunity> opportunities = [
            SELECT Id, Name, Amount, Probability, CreatedDate,
                   (SELECT Id, Amount FROM OpportunityLineItems)
            FROM Opportunity
            WHERE Id IN :opportunityIds
        ];

        List<Opportunity> oppsToUpdate = new List<Opportunity>();

        for (Opportunity opp : opportunities) {
            // ✅ Complex scoring algorithm
            Decimal baseScore = opp.Amount * opp.Probability / 100;
            Decimal timeFactorWeeks = (System.today().daysBetween(opp.CreatedDate)) / 7.0;
            Decimal complexityScore = baseScore * complexityFactor * Math.log(timeFactorWeeks + 1);

            // ✅ Calculate product diversity score
            Decimal diversityScore = calculateProductDiversityScore(opp.OpportunityLineItems);

            opp.Calculated_Score__c = complexityScore + diversityScore;
            opp.Score_Calculation_Date__c = System.now();
            oppsToUpdate.add(opp);
        }

        if (!oppsToUpdate.isEmpty()) {
            update oppsToUpdate;
        }
    }

    // ✅ WHAT: Job chaining - start next queueable job
    // ✅ WHY: Process data in sequential steps, each with fresh governor limits
    private void processAndChainNext(System.QueueableContext context) {
        // ✅ Process current batch
        processStageAutomation();

        // ✅ Check if more records need processing
        List<Id> nextBatch = getNextBatchToProcess();

        if (!nextBatch.isEmpty() && Limits.getQueueableJobs() < Limits.getLimitQueueableJobs()) {
            // ✅ WHAT: Chain next queueable job
            // ✅ WHY: Continue processing with fresh governor limits
            OpportunityProcessingJob nextJob = new OpportunityProcessingJob(
                nextBatch,
                'STAGE_AUTOMATION',
                parameters
            );

            System.enqueueJob(nextJob);
            System.debug('Chained next job for ' + nextBatch.size() + ' records');
        }
    }

    // ✅ WHAT: Helper methods for business logic
    private String calculateOptimalStage(Opportunity opp) {
        // ✅ Simplified stage optimization logic
        if (opp.Amount > 100000 && opp.Account.Type == 'Customer') {
            return 'Negotiation/Review';
        } else if (opp.Amount > 50000) {
            return 'Proposal/Price Quote';
        } else {
            return 'Qualification';
        }
    }

    private Decimal calculateProductDiversityScore(List<OpportunityLineItem> products) {
        // ✅ Simple diversity calculation
        return products.size() * 10.0; // More products = higher diversity score
    }

    private List<Id> getNextBatchToProcess() {
        // ✅ Query for next batch of opportunities needing processing
        List<Opportunity> nextOpps = [
            SELECT Id
            FROM Opportunity
            WHERE Needs_Processing__c = true
            AND Id NOT IN :opportunityIds
            LIMIT 100
        ];

        List<Id> nextIds = new List<Id>();
        for (Opportunity opp : nextOpps) {
            nextIds.add(opp.Id);
        }

        return nextIds;
    }

    private void handleJobError(Exception e, System.QueueableContext context) {
        // ✅ Error logging and notification
        System.debug('Queueable job failed: ' + e.getMessage());
        System.debug('Stack trace: ' + e.getStackTraceString());

        // ✅ Could create error records, send emails, etc.
        // Error_Log__c errorLog = new Error_Log__c(
        //     Job_Id__c = context.getJobId(),
        //     Error_Message__c = e.getMessage(),
        //     Stack_Trace__c = e.getStackTraceString()
        // );
        // insert errorLog;
    }
}

// ✅ WHAT: Utility class for starting queueable jobs
public class QueueableJobManager {

    public static Id startOpportunityProcessing(List<Id> oppIds, String processType) {
        OpportunityProcessingJob job = new OpportunityProcessingJob(oppIds, processType, null);
        return System.enqueueJob(job);
    }

    public static Id startComplexCalculation(List<Id> oppIds, Decimal complexityFactor) {
        Map<String, Object> params = new Map<String, Object>{
            'complexityFactor' => complexityFactor,
            'includeHistoricalData' => true
        };

        OpportunityProcessingJob job = new OpportunityProcessingJob(oppIds, 'COMPLEX_CALCULATION', params);
        return System.enqueueJob(job);
    }

    // ✅ WHAT: Monitor queueable job status
    public static void checkQueueableStatus(Id jobId) {
        AsyncApexJob job = [
            SELECT Id, Status, JobType, NumberOfErrors,
                   CreatedDate, CompletedDate, ExtendedStatus
            FROM AsyncApexJob
            WHERE Id = :jobId
        ];

        System.debug('Queueable Job Status: ' + job.Status);
        System.debug('Extended Status: ' + job.ExtendedStatus);
        System.debug('Errors: ' + job.NumberOfErrors);
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Queueable accepts complex parameters unlike future methods. Implement Database.AllowsCallouts for HTTP requests",
                type: "info",
                icon: "🔗"
              },
              {
                arrows: "         ↑",
                explanation: "Queueable gets higher limits than synchronous code and can make callouts like future methods",
                type: "success",
                icon: "⚡"
              },
              {
                arrows: "              ↑",
                explanation: "Job chaining allows processing large datasets by starting new jobs with fresh governor limits",
                type: "warning",
                icon: "🔗"
              },
              {
                arrows: "                   ↑",
                explanation: "Always implement proper error handling and logging in async jobs for debugging and monitoring",
                type: "info",
                icon: "🛡️"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Scheduled Apex - Time-Based Processing</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Scheduled Apex runs your code at specific times. Perfect for daily reports, cleanup jobs, and regular maintenance:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Schedulable class implementing System.Schedulable interface
// ✅ WHY: Allows code to run at scheduled times automatically
public class DailyMaintenanceScheduler implements System.Schedulable {

    private String jobType;

    public DailyMaintenanceScheduler(String jobType) {
        this.jobType = jobType;
    }

    // ✅ WHAT: execute() method called by scheduler
    // ✅ WHY: Entry point for scheduled job execution
    public void execute(System.SchedulableContext context) {
        System.debug('Running scheduled job: ' + jobType);

        try {
            switch on jobType {
                when 'DAILY_CLEANUP' {
                    runDailyCleanup();
                }
                when 'WEEKLY_REPORTS' {
                    runWeeklyReports();
                }
                when 'MONTHLY_ARCHIVAL' {
                    runMonthlyArchival();
                }
            }
        } catch (Exception e) {
            System.debug('Scheduled job error: ' + e.getMessage());
            notifyAdminsOfError(e, context);
        }
    }

    // ✅ WHAT: Daily cleanup routine
    private void runDailyCleanup() {
        System.debug('Starting daily cleanup tasks');

        // ✅ Start batch job for inactive record cleanup
        Id batchJobId = Database.executeBatch(
            new AccountCleanupBatch('INACTIVE_CLEANUP', System.today().addDays(-90)),
            100
        );

        // ✅ Start queueable job for expired data cleanup
        List<Id> expiredRecordIds = getExpiredRecordIds();
        if (!expiredRecordIds.isEmpty()) {
            ExpiredDataCleanupJob cleanupJob = new ExpiredDataCleanupJob(expiredRecordIds);
            System.enqueueJob(cleanupJob);
        }

        // ✅ Clean up temporary files and logs
        cleanupTemporaryData();
    }

    private void runWeeklyReports() {
        System.debug('Generating weekly reports');

        // ✅ Start batch job for report generation
        WeeklyReportBatch reportBatch = new WeeklyReportBatch(System.today().addDays(-7));
        Database.executeBatch(reportBatch, 50);
    }

    private void runMonthlyArchival() {
        System.debug('Starting monthly archival');

        // ✅ Archive old records to external storage
        MonthlyArchivalJob archivalJob = new MonthlyArchivalJob();
        System.enqueueJob(archivalJob);
    }

    private List<Id> getExpiredRecordIds() {
        List<Custom_Log__c> expiredLogs = [
            SELECT Id
            FROM Custom_Log__c
            WHERE CreatedDate < LAST_N_DAYS:30
            LIMIT 10000
        ];

        List<Id> expiredIds = new List<Id>();
        for (Custom_Log__c log : expiredLogs) {
            expiredIds.add(log.Id);
        }

        return expiredIds;
    }

    private void cleanupTemporaryData() {
        // ✅ Delete temporary records
        List<Temporary_Data__c> tempRecords = [
            SELECT Id
            FROM Temporary_Data__c
            WHERE CreatedDate < YESTERDAY
        ];

        if (!tempRecords.isEmpty()) {
            delete tempRecords;
            System.debug('Deleted ' + tempRecords.size() + ' temporary records');
        }
    }

    private void notifyAdminsOfError(Exception e, System.SchedulableContext context) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();

        // ✅ Get admin emails from custom setting or metadata
        List<String> adminEmails = new List<String>{ UserInfo.getUserEmail() };

        email.setToAddresses(adminEmails);
        email.setSubject('Scheduled Job Failed: ' + jobType);

        String body = 'Scheduled job failed with the following error:\\n\\n' +
                     'Job Type: ' + jobType + '\\n' +
                     'Job ID: ' + context.getTriggerId() + '\\n' +
                     'Error: ' + e.getMessage() + '\\n' +
                     'Stack Trace: ' + e.getStackTraceString() + '\\n\\n' +
                     'Please investigate and resolve the issue.';

        email.setPlainTextBody(body);

        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        } catch (Exception emailError) {
            System.debug('Failed to send error notification: ' + emailError.getMessage());
        }
    }
}

// ✅ WHAT: Utility class for managing scheduled jobs
public class ScheduledJobManager {

    // ✅ WHAT: Schedule daily cleanup job
    public static String scheduleDailyCleanup() {
        DailyMaintenanceScheduler scheduler = new DailyMaintenanceScheduler('DAILY_CLEANUP');

        // ✅ WHAT: Cron expression for daily execution at 2 AM
        // ✅ WHY: Runs during low-usage hours to minimize impact
        String cronExpression = '0 0 2 * * ?'; // Every day at 2:00 AM

        return System.schedule('Daily Cleanup Job', cronExpression, scheduler);
    }

    // ✅ WHAT: Schedule weekly reports
    public static String scheduleWeeklyReports() {
        DailyMaintenanceScheduler scheduler = new DailyMaintenanceScheduler('WEEKLY_REPORTS');

        // ✅ WHAT: Cron expression for weekly execution on Sunday at 6 AM
        String cronExpression = '0 0 6 ? * SUN'; // Every Sunday at 6:00 AM

        return System.schedule('Weekly Reports Job', cronExpression, scheduler);
    }

    // ✅ WHAT: Schedule monthly archival
    public static String scheduleMonthlyArchival() {
        DailyMaintenanceScheduler scheduler = new DailyMaintenanceScheduler('MONTHLY_ARCHIVAL');

        // ✅ WHAT: Cron expression for monthly execution on 1st day at 3 AM
        String cronExpression = '0 0 3 1 * ?'; // 1st day of every month at 3:00 AM

        return System.schedule('Monthly Archival Job', cronExpression, scheduler);
    }

    // ✅ WHAT: Check status of scheduled jobs
    public static void checkScheduledJobs() {
        List<CronTrigger> scheduledJobs = [
            SELECT Id, CronJobDetail.Name, State, NextFireTime, PreviousFireTime
            FROM CronTrigger
            WHERE CronJobDetail.Name LIKE '%Cleanup%'
            OR CronJobDetail.Name LIKE '%Reports%'
            OR CronJobDetail.Name LIKE '%Archival%'
        ];

        System.debug('Found ' + scheduledJobs.size() + ' scheduled jobs:');

        for (CronTrigger job : scheduledJobs) {
            System.debug('Job: ' + job.CronJobDetail.Name);
            System.debug('State: ' + job.State);
            System.debug('Next Fire Time: ' + job.NextFireTime);
            System.debug('Previous Fire Time: ' + job.PreviousFireTime);
            System.debug('---');
        }
    }

    // ✅ WHAT: Cancel all scheduled jobs
    public static void cancelAllScheduledJobs() {
        List<CronTrigger> jobsToCancel = [
            SELECT Id
            FROM CronTrigger
            WHERE CronJobDetail.Name LIKE '%Cleanup%'
            OR CronJobDetail.Name LIKE '%Reports%'
            OR CronJobDetail.Name LIKE '%Archival%'
        ];

        for (CronTrigger job : jobsToCancel) {
            System.abortJob(job.Id);
        }

        System.debug('Cancelled ' + jobsToCancel.size() + ' scheduled jobs');
    }

    // ✅ WHAT: Utility method to parse cron expressions
    public static void explainCronExpression(String cronExpr) {
        List<String> parts = cronExpr.split(' ');

        if (parts.size() != 6) {
            System.debug('Invalid cron expression');
            return;
        }

        System.debug('Cron Expression Breakdown:');
        System.debug('Seconds: ' + parts[0]);
        System.debug('Minutes: ' + parts[1]);
        System.debug('Hours: ' + parts[2]);
        System.debug('Day of Month: ' + parts[3]);
        System.debug('Month: ' + parts[4]);
        System.debug('Day of Week: ' + parts[5]);
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Schedulable classes run at specific times using cron expressions. Perfect for regular maintenance tasks",
                type: "info",
                icon: "⏰"
              },
              {
                arrows: "         ↑",
                explanation: "Scheduled jobs can start other async jobs (batch, queueable) to handle large data processing",
                type: "success",
                icon: "🔗"
              },
              {
                arrows: "              ↑",
                explanation: "Always implement error handling and admin notification in scheduled jobs for monitoring",
                type: "warning",
                icon: "🚨"
              },
              {
                arrows: "                   ↑",
                explanation: "Use System.schedule() with cron expressions to schedule jobs. Monitor with CronTrigger object",
                type: "info",
                icon: "⚙️"
              }
            ]}
          />
        </section>

        <section className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">🚀 Async Apex Best Practices</h3>
          <ul className="space-y-2 text-purple-800 dark:text-purple-200">
            <li><strong>Choose the Right Tool:</strong> Future for simple callouts, Batch for large datasets, Queueable for complex chaining</li>
            <li><strong>Error Handling:</strong> Always implement try-catch blocks and logging in async methods</li>
            <li><strong>Governor Limits:</strong> Monitor async job limits (250 queued/running jobs, 5 queued queueable jobs)</li>
            <li><strong>Job Monitoring:</strong> Query AsyncApexJob to track job status and handle failures</li>
            <li><strong>Data Consistency:</strong> Use Database.* methods with allOrNone=false for partial success patterns</li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'testing',
    title: 'Testing',
    icon: TestTube,
    description: 'Unit testing and test data management',
    content: (
      <div className="space-y-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <strong>Your code needs validation and confidence.</strong> Testing ensures your Apex logic works correctly, handles edge cases, and maintains quality through changes. Master test-driven development, data factories, and testing patterns to build robust Salesforce applications.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Test Class Fundamentals</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Every Apex class should have comprehensive tests. Test classes validate your logic and are required for deployment:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Test class annotation
// ✅ WHY: @IsTest marks class as test-only, excluded from code coverage requirements
// 💥 IF WRONG: Regular classes need 75% coverage, test classes don't count toward limits
@IsTest
public class AccountProcessorTest {

    // ✅ WHAT: Test setup method runs before each test
    // ✅ WHY: @TestSetup creates test data once for all test methods in class
    // 💥 IF WRONG: Creating data in each test method is slower and hits DML limits
    @TestSetup
    static void setupTestData() {
        // ✅ Create test accounts for multiple test scenarios
        List<Account> testAccounts = new List<Account>();

        // Account for positive test cases
        testAccounts.add(new Account(
            Name = 'Test Customer Account',
            Type = 'Customer',
            Industry = 'Technology',
            AnnualRevenue = 1000000,
            NumberOfEmployees = 500
        ));

        // Account for edge case testing
        testAccounts.add(new Account(
            Name = 'Test Prospect Account',
            Type = 'Prospect',
            Industry = 'Healthcare',
            AnnualRevenue = 50000,
            NumberOfEmployees = 10
        ));

        // Account with minimal data
        testAccounts.add(new Account(
            Name = 'Minimal Account'
            // No type, industry, or revenue
        ));

        insert testAccounts;
    }

    // ✅ WHAT: Positive test case - test expected behavior
    // ✅ WHY: Validates that your code works correctly with valid inputs
    @IsTest
    static void testProcessAccountsPositive() {
        // ✅ WHAT: Test data retrieval
        // ✅ WHY: Get data created in @TestSetup method
        List<Account> testAccounts = [SELECT Id, Name, Type FROM Account];

        // ✅ WHAT: Test context setup
        Test.startTest(); // ✅ Resets governor limits for the test

        // ✅ Execute the method being tested
        AccountProcessor processor = new AccountProcessor('Test Processor', 100);
        processor.processAccounts(testAccounts);

        Test.stopTest(); // ✅ Forces async code to complete

        // ✅ WHAT: Assertions to verify expected behavior
        // ✅ WHY: Validates that processing worked correctly
        List<Account> processedAccounts = [
            SELECT Id, Name, Description
            FROM Account
            WHERE Description LIKE '%Processed by%'
        ];

        // ✅ Verify all accounts were processed
        System.assertEquals(3, processedAccounts.size(),
            'All three test accounts should have been processed');

        // ✅ Verify specific account was updated correctly
        Account customerAccount = [
            SELECT Description
            FROM Account
            WHERE Name = 'Test Customer Account'
            LIMIT 1
        ];

        System.assertEquals('Processed by Test Processor', customerAccount.Description,
            'Customer account should have correct description');
    }

    // ✅ WHAT: Negative test case - test error handling
    // ✅ WHY: Validates that your code handles invalid inputs gracefully
    @IsTest
    static void testProcessAccountsWithInvalidProcessor() {
        List<Account> testAccounts = [SELECT Id FROM Account LIMIT 1];

        Test.startTest();

        try {
            // ✅ WHAT: Test invalid input scenario
            // ✅ WHY: Ensure constructor validation works
            AccountProcessor processor = new AccountProcessor('', 100); // Empty name
            processor.processAccounts(testAccounts);

            // ✅ If we reach this line, the test should fail
            System.assert(false, 'Expected IllegalArgumentException was not thrown');

        } catch (IllegalArgumentException e) {
            // ✅ WHAT: Verify expected exception was thrown
            // ✅ WHY: Confirms error handling works correctly
            System.assertEquals('Processor name cannot be blank', e.getMessage(),
                'Exception message should match expected error');
        }

        Test.stopTest();
    }

    // ✅ WHAT: Bulk testing - test with large datasets
    // ✅ WHY: Validates bulkification and governor limit compliance
    @IsTest
    static void testProcessAccountsBulk() {
        // ✅ Create larger dataset for bulk testing
        List<Account> bulkAccounts = new List<Account>();

        for (Integer i = 0; i < 200; i++) {
            bulkAccounts.add(new Account(
                Name = 'Bulk Account ' + i,
                Type = 'Customer'
            ));
        }

        insert bulkAccounts;

        Test.startTest();

        // ✅ Test bulk processing
        AccountProcessor processor = new AccountProcessor('Bulk Processor', 150);
        processor.processAccounts(bulkAccounts);

        Test.stopTest();

        // ✅ Verify only the limited number were processed
        List<Account> processedAccounts = [
            SELECT Id FROM Account
            WHERE Description = 'Processed by Bulk Processor'
        ];

        System.assertEquals(150, processedAccounts.size(),
            'Should only process up to the maximum limit of 150 accounts');
    }

    // ✅ WHAT: Test static methods
    // ✅ WHY: Static utility methods need testing too
    @IsTest
    static void testStaticMethods() {
        Test.startTest();

        // ✅ Test static method functionality
        Integer totalProcessors = AccountProcessor.getTotalProcessorsCreated();
        System.assertEquals(0, totalProcessors, 'Initial count should be zero');

        // ✅ Create processor to increment counter
        AccountProcessor processor1 = new AccountProcessor();
        totalProcessors = AccountProcessor.getTotalProcessorsCreated();
        System.assertEquals(1, totalProcessors, 'Count should increment to 1');

        // ✅ Test factory method
        AccountProcessor bulkProcessor = AccountProcessor.createHighVolumeProcessor('Test Bulk');
        System.assertEquals('Test Bulk', bulkProcessor.getProcessorName(),
            'Factory method should set processor name correctly');

        Test.stopTest();
    }

    // ✅ WHAT: Test private methods indirectly
    // ✅ WHY: Private methods are tested through public method calls
    @IsTest
    static void testPrivateMethodsIndirectly() {
        Test.startTest();

        // ✅ Test private validation by triggering it through public methods
        AccountProcessor processor = new AccountProcessor();

        try {
            processor.setProcessorName(null); // Should trigger validation
            System.assert(false, 'Expected exception for null name');
        } catch (IllegalArgumentException e) {
            System.assert(e.getMessage().contains('cannot be blank'),
                'Should validate empty processor name');
        }

        Test.stopTest();
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "@IsTest annotation marks test classes and methods. @TestSetup creates shared test data efficiently",
                type: "info",
                icon: "🧪"
              },
              {
                arrows: "         ↑",
                explanation: "Test.startTest() and Test.stopTest() reset governor limits and force async code completion",
                type: "success",
                icon: "⏱️"
              },
              {
                arrows: "              ↑",
                explanation: "Use System.assertEquals() and System.assert() to validate expected behavior and results",
                type: "warning",
                icon: "✅"
              },
              {
                arrows: "                   ↑",
                explanation: "Test both positive scenarios (expected behavior) and negative scenarios (error handling)",
                type: "info",
                icon: "🎯"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Test Data Factories and Patterns</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Reusable test data factories make tests maintainable and reduce duplication:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Test data factory utility class
// ✅ WHY: Centralized test data creation reduces duplication and improves maintainability
// 💥 IF WRONG: Duplicating test data creation in every test leads to maintenance issues
@IsTest
public class TestDataFactory {

    // ✅ WHAT: Account creation with default values
    // ✅ WHY: Provides sensible defaults while allowing customization
    public static Account createAccount(String name, String accountType) {
        return new Account(
            Name = name,
            Type = accountType,
            Industry = 'Technology',
            AnnualRevenue = 500000,
            NumberOfEmployees = 100,
            BillingCity = 'San Francisco',
            BillingState = 'CA',
            BillingCountry = 'USA'
        );
    }

    // ✅ WHAT: Overloaded method with fewer parameters
    // ✅ WHY: Convenience method for common use cases
    public static Account createAccount(String name) {
        return createAccount(name, 'Customer');
    }

    // ✅ WHAT: Bulk account creation
    // ✅ WHY: Efficient creation of multiple test records
    public static List<Account> createAccounts(Integer count, String namePrefix, String accountType) {
        List<Account> accounts = new List<Account>();

        for (Integer i = 0; i < count; i++) {
            accounts.add(createAccount(namePrefix + ' ' + i, accountType));
        }

        return accounts;
    }

    // ✅ WHAT: Contact creation with account relationship
    // ✅ WHY: Creates related data to test relationship scenarios
    public static Contact createContact(String firstName, String lastName, Id accountId) {
        return new Contact(
            FirstName = firstName,
            LastName = lastName,
            AccountId = accountId,
            Email = firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@test.com',
            Phone = '(555) 123-4567',
            Title = 'Test Contact',
            Department = 'Sales'
        );
    }

    // ✅ WHAT: Opportunity creation with required fields
    public static Opportunity createOpportunity(String name, Id accountId, Date closeDate) {
        return new Opportunity(
            Name = name,
            AccountId = accountId,
            StageName = 'Qualification',
            CloseDate = closeDate,
            Amount = 100000,
            Probability = 25,
            Type = 'New Customer',
            LeadSource = 'Web'
        );
    }

    // ✅ WHAT: Complete data scenario creation
    // ✅ WHY: Creates full object hierarchies for complex testing
    public static Map<String, List<SObject>> createCompleteTestScenario() {
        Map<String, List<SObject>> testData = new Map<String, List<SObject>>();

        // ✅ Create accounts
        List<Account> accounts = createAccounts(3, 'Test Account', 'Customer');
        insert accounts;
        testData.put('accounts', accounts);

        // ✅ Create contacts for each account
        List<Contact> contacts = new List<Contact>();
        for (Account acc : accounts) {
            contacts.add(createContact('John', 'Doe ' + acc.Name, acc.Id));
            contacts.add(createContact('Jane', 'Smith ' + acc.Name, acc.Id));
        }
        insert contacts;
        testData.put('contacts', contacts);

        // ✅ Create opportunities for each account
        List<Opportunity> opportunities = new List<Opportunity>();
        for (Account acc : accounts) {
            opportunities.add(createOpportunity('Opp for ' + acc.Name, acc.Id, System.today().addDays(30)));
        }
        insert opportunities;
        testData.put('opportunities', opportunities);

        return testData;
    }

    // ✅ WHAT: User creation for testing different profiles
    // ✅ WHY: Testing with different user contexts validates security and permissions
    public static User createTestUser(String profileName, String uniqueSuffix) {
        Profile testProfile = [SELECT Id FROM Profile WHERE Name = :profileName LIMIT 1];

        return new User(
            FirstName = 'Test',
            LastName = 'User ' + uniqueSuffix,
            Email = 'testuser' + uniqueSuffix + '@test.com',
            Username = 'testuser' + uniqueSuffix + '@testcompany.com',
            Alias = 'tuser' + uniqueSuffix.left(4),
            ProfileId = testProfile.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );
    }

    // ✅ WHAT: Custom setting creation for test isolation
    // ✅ WHY: Tests should not depend on org-specific configuration
    public static void createTestSettings() {
        // Example custom setting creation
        // Test_Settings__c settings = new Test_Settings__c(
        //     Name = 'Test Config',
        //     Max_Records__c = 100,
        //     Enable_Feature__c = true
        // );
        // insert settings;
    }
}

// ✅ WHAT: Test class using data factory
@IsTest
public class ContactManagerTest {

    @TestSetup
    static void setupTestData() {
        // ✅ Use factory to create consistent test data
        TestDataFactory.createCompleteTestScenario();
        TestDataFactory.createTestSettings();
    }

    @IsTest
    static void testContactValidation() {
        // ✅ Get test data created by factory
        List<Account> accounts = [SELECT Id, Type FROM Account];
        Account testAccount = accounts[0];

        Test.startTest();

        // ✅ Test valid contact creation
        ContactManager manager = new ContactManager('Test Manager', new Set<String>{'test.com'});
        List<Contact> validContacts = new List<Contact>{
            TestDataFactory.createContact('Valid', 'Contact', testAccount.Id)
        };

        List<Contact> results = manager.processIncomingContacts(validContacts);
        System.assertEquals(1, results.size(), 'Valid contact should be processed');

        Test.stopTest();
    }

    @IsTest
    static void testContactValidationWithDifferentAccountTypes() {
        // ✅ Test with different account types from factory
        List<Account> accounts = [SELECT Id, Type FROM Account];

        Test.startTest();

        for (Account acc : accounts) {
            // ✅ Create specific test scenario for each account type
            ContactManager manager = new ContactManager('Manager for ' + acc.Type, new Set<String>());

            Contact testContact = TestDataFactory.createContact('Test', 'Contact', acc.Id);
            List<Contact> results = manager.processIncomingContacts(new List<Contact>{ testContact });

            // ✅ Assertions based on account type
            if (acc.Type == 'Customer') {
                System.assertEquals(1, results.size(), 'Customer accounts should allow contacts');
            }
        }

        Test.stopTest();
    }

    // ✅ WHAT: Test with different user contexts
    @IsTest
    static void testContactProcessingAsStandardUser() {
        // ✅ Create test user with standard profile
        User standardUser = TestDataFactory.createTestUser('Standard User', 'STD001');
        insert standardUser;

        System.runAs(standardUser) {
            Test.startTest();

            // ✅ Test functionality with different user permissions
            List<Account> accounts = [SELECT Id FROM Account LIMIT 1];
            ContactManager manager = new ContactManager('Standard User Manager', new Set<String>());

            Contact testContact = TestDataFactory.createContact('Standard', 'User Test', accounts[0].Id);
            List<Contact> results = manager.processIncomingContacts(new List<Contact>{ testContact });

            // ✅ Verify behavior under standard user context
            System.assertNotEquals(null, results, 'Standard user should be able to process contacts');

            Test.stopTest();
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Test data factories centralize object creation with sensible defaults and customization options",
                type: "info",
                icon: "🏭"
              },
              {
                arrows: "         ↑",
                explanation: "Factories can create complete object hierarchies and relationships for complex testing scenarios",
                type: "success",
                icon: "🔗"
              },
              {
                arrows: "              ↑",
                explanation: "Test different user contexts with System.runAs() to validate security and permission handling",
                type: "warning",
                icon: "👤"
              },
              {
                arrows: "                   ↑",
                explanation: "Use factories in @TestSetup to create reusable test data that's available to all test methods",
                type: "info",
                icon: "⚙️"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Testing Async Apex and Advanced Scenarios</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Testing asynchronous code, triggers, and external integrations requires special techniques:
          </p>

          <AnnotatedCode
            code={`@IsTest
public class AsyncApexTest {

    // ✅ WHAT: Testing future methods
    // ✅ WHY: Future methods execute asynchronously, need Test.stopTest() to complete
    @IsTest
    static void testFutureMethod() {
        // ✅ Create test data
        List<Account> testAccounts = new List<Account>{
            TestDataFactory.createAccount('Future Test Account')
        };
        insert testAccounts;

        Set<Id> accountIds = new Set<Id>();
        for (Account acc : testAccounts) {
            accountIds.add(acc.Id);
        }

        Test.startTest();

        // ✅ WHAT: Call future method
        // ✅ WHY: Future method will be queued but not executed until Test.stopTest()
        ExternalIntegrationService.syncAccountToExternalSystem(accountIds);

        // ✅ WHAT: Test.stopTest() forces future method to complete
        // ✅ WHY: Without this, future method wouldn't execute in test context
        Test.stopTest();

        // ✅ Verify future method results
        List<Account> syncedAccounts = [
            SELECT Id, External_Sync_Status__c
            FROM Account
            WHERE Id IN :accountIds
        ];

        System.assertEquals(1, syncedAccounts.size(), 'Should have one synced account');
        // Note: In test context, external callouts are mocked
    }

    // ✅ WHAT: Testing batch Apex
    // ✅ WHY: Batch classes need special testing to verify all phases
    @IsTest
    static void testBatchApex() {
        // ✅ Create test data for batch processing
        List<Account> testAccounts = TestDataFactory.createAccounts(50, 'Batch Test', 'Customer');

        // Set up accounts for cleanup scenario
        for (Account acc : testAccounts) {
            acc.Active__c = true;
            acc.LastActivityDate = System.today().addDays(-100); // Old activity
        }
        insert testAccounts;

        Test.startTest();

        // ✅ WHAT: Execute batch job
        // ✅ WHY: Test.stopTest() will complete all batch chunks
        AccountCleanupBatch batch = new AccountCleanupBatch('INACTIVE_CLEANUP', System.today().addDays(-90));
        Id jobId = Database.executeBatch(batch, 10); // Small batch size for testing

        Test.stopTest();

        // ✅ Verify batch processing results
        List<Account> processedAccounts = [
            SELECT Id, Active__c, Deactivation_Date__c
            FROM Account
            WHERE Id IN :testAccounts
        ];

        Integer deactivatedCount = 0;
        for (Account acc : processedAccounts) {
            if (!acc.Active__c) {
                deactivatedCount++;
                System.assertNotEquals(null, acc.Deactivation_Date__c,
                    'Deactivated accounts should have deactivation date');
            }
        }

        System.assertEquals(50, deactivatedCount, 'All test accounts should be deactivated');

        // ✅ Verify batch job completion
        AsyncApexJob job = [
            SELECT Status, NumberOfErrors
            FROM AsyncApexJob
            WHERE Id = :jobId
        ];

        System.assertEquals('Completed', job.Status, 'Batch job should complete successfully');
        System.assertEquals(0, job.NumberOfErrors, 'Batch job should have no errors');
    }

    // ✅ WHAT: Testing queueable Apex
    @IsTest
    static void testQueueableApex() {
        // ✅ Create opportunities for processing
        Map<String, List<SObject>> testData = TestDataFactory.createCompleteTestScenario();
        List<Opportunity> opportunities = (List<Opportunity>) testData.get('opportunities');

        List<Id> oppIds = new List<Id>();
        for (Opportunity opp : opportunities) {
            oppIds.add(opp.Id);
        }

        Test.startTest();

        // ✅ WHAT: Enqueue queueable job
        OpportunityProcessingJob job = new OpportunityProcessingJob(oppIds, 'STAGE_AUTOMATION', null);
        Id jobId = System.enqueueJob(job);

        Test.stopTest();

        // ✅ Verify queueable processing results
        List<Opportunity> processedOpps = [
            SELECT Id, StageName, Stage_Change_Reason__c
            FROM Opportunity
            WHERE Id IN :oppIds
        ];

        for (Opportunity opp : processedOpps) {
            System.assertNotEquals(null, opp.StageName, 'Opportunity should have stage');
        }

        // ✅ Verify job completion
        AsyncApexJob queueJob = [
            SELECT Status FROM AsyncApexJob WHERE Id = :jobId
        ];
        System.assertEquals('Completed', queueJob.Status, 'Queueable job should complete');
    }

    // ✅ WHAT: Testing schedulable Apex
    @IsTest
    static void testSchedulableApex() {
        Test.startTest();

        // ✅ WHAT: Schedule the job for immediate execution in test
        // ✅ WHY: Tests run immediately, don't wait for actual schedule
        String cronExpression = '0 0 2 * * ?';
        DailyMaintenanceScheduler scheduler = new DailyMaintenanceScheduler('DAILY_CLEANUP');
        String jobId = System.schedule('Test Daily Cleanup', cronExpression, scheduler);

        Test.stopTest();

        // ✅ Verify scheduled job was created
        List<CronTrigger> scheduledJobs = [
            SELECT Id, CronJobDetail.Name, State
            FROM CronTrigger
            WHERE Id = :jobId
        ];

        System.assertEquals(1, scheduledJobs.size(), 'Scheduled job should be created');
        System.assertEquals('Test Daily Cleanup', scheduledJobs[0].CronJobDetail.Name);
    }

    // ✅ WHAT: Testing trigger behavior
    @IsTest
    static void testTriggerBehavior() {
        Test.startTest();

        // ✅ Test insert trigger
        Account newAccount = TestDataFactory.createAccount('Trigger Test Account');
        insert newAccount;

        // ✅ Verify trigger logic executed
        Account insertedAccount = [
            SELECT Id, AccountNumber, Industry
            FROM Account
            WHERE Id = :newAccount.Id
        ];

        System.assertNotEquals(null, insertedAccount.AccountNumber,
            'Trigger should set account number');
        System.assertEquals('Other', insertedAccount.Industry,
            'Trigger should set default industry');

        // ✅ Test update trigger
        insertedAccount.Type = 'Partner';
        update insertedAccount;

        Account updatedAccount = [
            SELECT Type_Change_History__c, Last_Significant_Update__c
            FROM Account
            WHERE Id = :insertedAccount.Id
        ];

        System.assertNotEquals(null, updatedAccount.Last_Significant_Update__c,
            'Trigger should set last update timestamp');

        Test.stopTest();
    }

    // ✅ WHAT: Testing with mock callouts
    // ✅ WHY: External integrations need mocking for predictable tests
    @IsTest
    static void testExternalIntegrationWithMock() {
        // ✅ Set up mock for HTTP callouts
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

        List<Account> testAccounts = new List<Account>{
            TestDataFactory.createAccount('Mock Test Account')
        };
        insert testAccounts;

        Test.startTest();

        // ✅ Call method that makes HTTP callout
        Set<Id> accountIds = new Set<Id>{ testAccounts[0].Id };
        ExternalIntegrationService.syncAccountToExternalSystem(accountIds);

        Test.stopTest();

        // ✅ Verify mock callout results
        Account syncedAccount = [
            SELECT External_Sync_Status__c
            FROM Account
            WHERE Id = :testAccounts[0].Id
        ];

        System.assertEquals('Synced', syncedAccount.External_Sync_Status__c,
            'Mock should simulate successful sync');
    }

    // ✅ WHAT: Testing governor limits
    @IsTest
    static void testGovernorLimits() {
        Test.startTest();

        // ✅ Test SOQL limits
        Integer soqlCount = Limits.getQueries();
        System.assertEquals(0, soqlCount, 'Should start with 0 SOQL queries');

        List<Account> accounts = [SELECT Id FROM Account LIMIT 1];
        soqlCount = Limits.getQueries();
        System.assertEquals(1, soqlCount, 'Should have 1 SOQL query after query');

        // ✅ Test DML limits
        Integer dmlCount = Limits.getDMLRows();
        System.assertEquals(0, dmlCount, 'Should start with 0 DML rows');

        Account testAccount = TestDataFactory.createAccount('Limit Test');
        insert testAccount;

        dmlCount = Limits.getDMLRows();
        System.assertEquals(1, dmlCount, 'Should have 1 DML row after insert');

        Test.stopTest();
    }
}

// ✅ WHAT: Mock HTTP response for testing callouts
// ✅ WHY: Provides predictable responses for external integration testing
@IsTest
global class MockHttpResponseGenerator implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest req) {
        // ✅ Create mock response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"status": "success", "id": "12345"}');
        res.setStatusCode(200);
        return res;
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "Test.stopTest() forces async code (future, batch, queueable) to complete synchronously in tests",
                type: "info",
                icon: "⏹️"
              },
              {
                arrows: "         ↑",
                explanation: "Test batch Apex by creating test data, executing the batch, and verifying results after Test.stopTest()",
                type: "success",
                icon: "📦"
              },
              {
                arrows: "              ↑",
                explanation: "Use Test.setMock() to provide predictable responses for HTTP callouts in tests",
                type: "warning",
                icon: "🎭"
              },
              {
                arrows: "                   ↑",
                explanation: "Monitor governor limits in tests using Limits class methods to verify efficient code",
                type: "info",
                icon: "📊"
              }
            ]}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Test-Driven Development and Best Practices</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            TDD and comprehensive testing strategies ensure code quality and maintainability:
          </p>

          <AnnotatedCode
            code={`// ✅ WHAT: Test-driven development example
// ✅ WHY: Writing tests first ensures better design and coverage
@IsTest
public class OpportunityScoreCalculatorTest {

    // ✅ STEP 1: Write test first (this will fail initially)
    @IsTest
    static void testBasicScoreCalculation() {
        // ✅ Arrange: Set up test data
        Opportunity testOpp = new Opportunity(
            Name = 'Test Opportunity',
            Amount = 100000,
            Probability = 50,
            StageName = 'Qualification',
            CloseDate = System.today().addDays(30)
        );

        // ✅ Act: Execute method being tested
        Test.startTest();
        Decimal score = OpportunityScoreCalculator.calculateScore(testOpp);
        Test.stopTest();

        // ✅ Assert: Verify expected results
        System.assertEquals(50000, score, 'Basic score should be Amount * Probability / 100');
    }

    // ✅ STEP 2: Write more specific tests
    @IsTest
    static void testScoreWithTimeFactors() {
        // ✅ Test opportunity close to closing
        Opportunity urgentOpp = new Opportunity(
            Name = 'Urgent Opportunity',
            Amount = 100000,
            Probability = 75,
            StageName = 'Negotiation/Review',
            CloseDate = System.today().addDays(7) // Closing soon
        );

        Test.startTest();
        Decimal urgentScore = OpportunityScoreCalculator.calculateScore(urgentOpp);
        Test.stopTest();

        // ✅ Urgent opportunities should have higher scores
        System.assert(urgentScore > 75000, 'Urgent opportunities should have time bonus');
    }

    @IsTest
    static void testScoreWithStageFactors() {
        // ✅ Test different stages
        List<Opportunity> opportunities = new List<Opportunity>{
            new Opportunity(
                Name = 'Qualification Opp',
                Amount = 100000,
                Probability = 25,
                StageName = 'Qualification',
                CloseDate = System.today().addDays(30)
            ),
            new Opportunity(
                Name = 'Proposal Opp',
                Amount = 100000,
                Probability = 50,
                StageName = 'Proposal/Price Quote',
                CloseDate = System.today().addDays(30)
            ),
            new Opportunity(
                Name = 'Negotiation Opp',
                Amount = 100000,
                Probability = 75,
                StageName = 'Negotiation/Review',
                CloseDate = System.today().addDays(30)
            )
        };

        Test.startTest();

        Map<String, Decimal> scoresByStage = new Map<String, Decimal>();
        for (Opportunity opp : opportunities) {
            Decimal score = OpportunityScoreCalculator.calculateScore(opp);
            scoresByStage.put(opp.StageName, score);
        }

        Test.stopTest();

        // ✅ Later stages should have higher multipliers
        System.assert(
            scoresByStage.get('Proposal/Price Quote') > scoresByStage.get('Qualification'),
            'Proposal stage should score higher than Qualification'
        );
        System.assert(
            scoresByStage.get('Negotiation/Review') > scoresByStage.get('Proposal/Price Quote'),
            'Negotiation stage should score highest'
        );
    }

    // ✅ STEP 3: Test edge cases and error conditions
    @IsTest
    static void testScoreWithNullValues() {
        Opportunity nullAmountOpp = new Opportunity(
            Name = 'Null Amount Opp',
            Amount = null,
            Probability = 50,
            StageName = 'Qualification',
            CloseDate = System.today().addDays(30)
        );

        Test.startTest();
        Decimal score = OpportunityScoreCalculator.calculateScore(nullAmountOpp);
        Test.stopTest();

        System.assertEquals(0, score, 'Null amount should result in zero score');
    }

    @IsTest
    static void testScoreWithInvalidData() {
        Opportunity invalidOpp = new Opportunity(
            Name = 'Invalid Opp',
            Amount = -1000, // Negative amount
            Probability = 150, // Invalid probability
            StageName = 'Invalid Stage',
            CloseDate = System.today().addDays(-30) // Past date
        );

        Test.startTest();

        try {
            Decimal score = OpportunityScoreCalculator.calculateScore(invalidOpp);
            System.assert(false, 'Should throw exception for invalid data');
        } catch (IllegalArgumentException e) {
            System.assert(e.getMessage().contains('Invalid opportunity data'),
                'Should provide meaningful error message');
        }

        Test.stopTest();
    }

    // ✅ STEP 4: Test complex scenarios
    @IsTest
    static void testBulkScoreCalculation() {
        // ✅ Create large dataset for performance testing
        List<Opportunity> bulkOpportunities = new List<Opportunity>();

        for (Integer i = 0; i < 200; i++) {
            bulkOpportunities.add(new Opportunity(
                Name = 'Bulk Opp ' + i,
                Amount = 10000 + (i * 1000),
                Probability = 25 + (Math.mod(i, 3) * 25),
                StageName = 'Qualification',
                CloseDate = System.today().addDays(30 + Math.mod(i, 60))
            ));
        }

        Test.startTest();

        List<Decimal> scores = OpportunityScoreCalculator.calculateBulkScores(bulkOpportunities);

        Test.stopTest();

        System.assertEquals(200, scores.size(), 'Should calculate scores for all opportunities');

        // ✅ Verify no null scores
        for (Decimal score : scores) {
            System.assertNotEquals(null, score, 'No scores should be null');
            System.assert(score >= 0, 'All scores should be non-negative');
        }

        // ✅ Verify governor limits weren't exceeded
        System.assert(Limits.getCpuTime() < Limits.getLimitCpuTime(),
            'Should not exceed CPU time limits');
    }

    // ✅ STEP 5: Integration testing
    @IsTest
    static void testScoreCalculationIntegration() {
        // ✅ Create complete test scenario with related data
        Map<String, List<SObject>> testData = TestDataFactory.createCompleteTestScenario();
        List<Opportunity> opportunities = (List<Opportunity>) testData.get('opportunities');

        // ✅ Add line items to make opportunities more complex
        List<OpportunityLineItem> lineItems = new List<OpportunityLineItem>();
        for (Opportunity opp : opportunities) {
            // Note: Would need Product2 and PricebookEntry setup in real scenario
            // lineItems.add(new OpportunityLineItem(...));
        }

        Test.startTest();

        // ✅ Test score calculation with complete data
        for (Opportunity opp : opportunities) {
            Decimal score = OpportunityScoreCalculator.calculateScore(opp);
            System.assertNotEquals(null, score, 'Integration test should produce valid scores');
        }

        Test.stopTest();
    }
}

// ✅ STEP 6: Now implement the actual class to make tests pass
public class OpportunityScoreCalculator {

    // ✅ Basic score calculation (implement to make first test pass)
    public static Decimal calculateScore(Opportunity opp) {
        if (opp == null) {
            throw new IllegalArgumentException('Opportunity cannot be null');
        }

        // ✅ Validate opportunity data
        validateOpportunity(opp);

        // ✅ Handle null amount
        if (opp.Amount == null) {
            return 0;
        }

        // ✅ Base score calculation
        Decimal baseScore = opp.Amount * (opp.Probability / 100);

        // ✅ Apply stage multiplier
        Decimal stageMultiplier = getStageMultiplier(opp.StageName);
        baseScore *= stageMultiplier;

        // ✅ Apply time factor
        Decimal timeFactor = getTimeFactor(opp.CloseDate);
        baseScore *= timeFactor;

        return baseScore;
    }

    public static List<Decimal> calculateBulkScores(List<Opportunity> opportunities) {
        List<Decimal> scores = new List<Decimal>();

        for (Opportunity opp : opportunities) {
            scores.add(calculateScore(opp));
        }

        return scores;
    }

    private static void validateOpportunity(Opportunity opp) {
        if (opp.Amount != null && opp.Amount < 0) {
            throw new IllegalArgumentException('Invalid opportunity data: Amount cannot be negative');
        }

        if (opp.Probability != null && (opp.Probability < 0 || opp.Probability > 100)) {
            throw new IllegalArgumentException('Invalid opportunity data: Probability must be 0-100');
        }

        if (opp.CloseDate != null && opp.CloseDate < System.today()) {
            throw new IllegalArgumentException('Invalid opportunity data: Close date cannot be in the past');
        }
    }

    private static Decimal getStageMultiplier(String stageName) {
        switch on stageName {
            when 'Qualification' { return 1.0; }
            when 'Needs Analysis' { return 1.1; }
            when 'Value Proposition' { return 1.2; }
            when 'Id. Decision Makers' { return 1.3; }
            when 'Perception Analysis' { return 1.4; }
            when 'Proposal/Price Quote' { return 1.5; }
            when 'Negotiation/Review' { return 1.7; }
            when 'Closed Won' { return 2.0; }
            when else { return 1.0; }
        }
    }

    private static Decimal getTimeFactor(Date closeDate) {
        if (closeDate == null) {
            return 1.0;
        }

        Integer daysUntilClose = System.today().daysBetween(closeDate);

        if (daysUntilClose <= 7) {
            return 1.5; // Urgent bonus
        } else if (daysUntilClose <= 30) {
            return 1.2; // Near-term bonus
        } else {
            return 1.0; // Standard
        }
    }
}`}
            annotations={[
              {
                arrows: "    ↑",
                explanation: "TDD: Write tests first to define expected behavior, then implement code to make tests pass",
                type: "info",
                icon: "🔄"
              },
              {
                arrows: "         ↑",
                explanation: "Test edge cases and error conditions to ensure robust error handling and validation",
                type: "warning",
                icon: "⚠️"
              },
              {
                arrows: "              ↑",
                explanation: "Performance test with bulk data to verify your code scales and respects governor limits",
                type: "success",
                icon: "⚡"
              },
              {
                arrows: "                   ↑",
                explanation: "Integration tests verify components work together correctly with real data relationships",
                type: "info",
                icon: "🔗"
              }
            ]}
          />
        </section>

        <section className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">✅ Testing Best Practices</h3>
          <ul className="space-y-2 text-green-800 dark:text-green-200">
            <li><strong>Test Coverage:</strong> Aim for 100% test coverage, not just the 75% minimum required for deployment</li>
            <li><strong>Test Data:</strong> Use @TestSetup and data factories for consistent, maintainable test data</li>
            <li><strong>Assertions:</strong> Include meaningful error messages in System.assertEquals() for easier debugging</li>
            <li><strong>Async Testing:</strong> Always use Test.startTest() and Test.stopTest() for async code (future, batch, queueable)</li>
            <li><strong>User Context:</strong> Test with different user profiles using System.runAs() to validate security</li>
            <li><strong>Mocking:</strong> Use Test.setMock() for external integrations to ensure predictable, isolated tests</li>
          </ul>
        </section>
      </div>
    )
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