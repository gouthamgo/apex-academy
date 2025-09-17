export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface PracticeQuestion {
  number: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  code?: string;
  answer: string;
  explanation: string;
  correctCode?: string;
  keyLearning: string;
  examTip: string;
}

export interface TopicContent {
  title: string;
  overview: string;
  codeExamples: CodeExample[];
  practiceQuestions: PracticeQuestion[];
}

export const topicContent: Record<string, TopicContent> = {
  'variables-and-data-types': {
    title: 'Variables and Data Types',
    overview: 'Master Apex variables, primitive data types, and type conversion. Variables are the foundation of every Apex program - they store information your code needs. Understanding variables is crucial because EVERYTHING in Salesforce development builds on this: from simple field updates to complex business logic. This topic sets the stage for Collections (multiple values), Control Flow (decisions about values), and beyond.',
    codeExamples: [
      {
        title: 'Basic Variable Declaration',
        code: `public class VariableExample {
    // ✅ WHAT: Class declaration with public access
    // 💀 EXAM TRAP: Class name must match filename exactly

    private String customerName;
    // ✅ WHAT: Instance variable for storing text
    // ✅ WHY: private = controlled access (encapsulation)
    // 💀 COMMON MISTAKE: Variables default to null (not empty)

    private Integer age = 0;
    // ✅ WHAT: Whole number with safe initialization
    // ✅ WHY: Prevents null pointer exceptions
    // 💀 EXAM TRAP: Use Integer (not int) in Apex

    public VariableExample(String name) {
        this.customerName = name;
        // ✅ WHAT: this = current object reference
        // ✅ WHY: Distinguishes parameter from field
    }
}`,
        explanation: 'Apex uses wrapper types (Integer, Boolean, String) instead of Java primitives. All variables can be null and have methods. Always initialize variables or check for null before using them.'
      },
      {
        title: 'String Operations',
        code: `public class StringDemo {
    public void processNames() {
        String firstName = 'John';
        // 💀 EXAM TRAP: Single quotes (not double) in Apex

        String lastName = 'Doe';
        String fullName = firstName + ' ' + lastName;
        // ✅ RESULT: 'John Doe'

        Boolean hasContent = String.isNotBlank(fullName);
        // ✅ SAFE: Checks null AND empty AND whitespace
        // ✅ BETTER THAN: fullName != null && fullName.length() > 0

        if (hasContent) {
            System.debug('Name: ' + fullName.toUpperCase());
        }
    }
}`,
        explanation: 'String operations in Apex are null-safe when using built-in methods like isNotBlank(). Always use these instead of manual null checks for robust code.'
      },
      {
        title: 'Type Conversion',
        code: `public class ConversionDemo {
    public void safeConversion() {
        String numberStr = '123';
        Integer result;

        // ✅ SAFE: Check before converting
        if (numberStr.isNumeric()) {
            result = Integer.valueOf(numberStr);
        } else {
            result = 0; // Default fallback
        }

        // ✅ SAFE: Try-catch for complex conversions
        try {
            Decimal price = Decimal.valueOf('19.99');
            System.debug('Price: ' + price);
        } catch (TypeException e) {
            System.debug('Invalid number format');
        }
    }
}`,
        explanation: 'Always validate input before type conversion. Use isNumeric() for basic checks and try-catch for complex scenarios. TypeException is thrown for invalid conversions.'
      }
    ],
    practiceQuestions: [
      {
        number: 1,
        difficulty: 'beginner',
        question: "What is wrong with this code?",
        code: `String name;
Integer length = name.length();`,
        answer: "NullPointerException will be thrown",
        explanation: "The variable 'name' is declared but not initialized, so it defaults to null. Calling .length() on a null String throws a NullPointerException at runtime.",
        correctCode: `String name = 'John';  // Initialize the variable
Integer length = name.length();  // Now safe to call`,
        keyLearning: "Always initialize variables or check for null before using them. Uninitialized reference variables default to null.",
        examTip: "This is a very common PD1 certification question pattern. Always look for uninitialized variables in code samples."
      },
      {
        number: 2,
        difficulty: 'beginner',
        question: "Which data type should you use for storing currency values in Salesforce?",
        answer: "Decimal",
        explanation: "Decimal is the best choice for currency because it provides exact precision without floating-point rounding errors. Double/Float can introduce rounding errors that are unacceptable for financial calculations.",
        correctCode: `Decimal price = 19.99;
Decimal total = price * 1.08;  // Exact calculation`,
        keyLearning: "Use Decimal for financial calculations to avoid floating-point precision issues. Currency fields in Salesforce are also stored as Decimal.",
        examTip: "Salesforce strongly recommends Decimal for currency. This appears in PD1 questions about data type selection."
      },
      {
        number: 3,
        difficulty: 'beginner',
        question: "What happens when you declare 'Integer count;' without initialization?",
        answer: "count defaults to null",
        explanation: "In Apex, uninitialized primitive wrapper types (Integer, Double, Boolean, etc.) default to null, not zero. This is different from Java where primitives have default values.",
        correctCode: `Integer count = 0;  // Explicitly initialize
// OR
Integer count;
if (count == null) {
    count = 0;  // Handle null case
}`,
        keyLearning: "Apex primitive wrappers default to null, not zero. Always initialize or null-check before using.",
        examTip: "PD1 exam tests understanding of null vs zero. Remember Apex uses wrapper types (Integer) not primitives (int)."
      },
      {
        number: 4,
        difficulty: 'beginner',
        question: "Fix this code: 'boolean isActive = true;'",
        answer: "Use Boolean (capital B) instead of boolean",
        explanation: "Apex uses wrapper types, not Java primitives. 'boolean' (lowercase) doesn't exist in Apex - use 'Boolean' (capital B).",
        correctCode: `Boolean isActive = true;  // Correct wrapper type`,
        keyLearning: "Apex only has wrapper types (Boolean, Integer, Double), not Java primitives (boolean, int, double).",
        examTip: "Case sensitivity is tested on PD1. Always use capital letters for Apex data types."
      },
      {
        number: 5,
        difficulty: 'intermediate',
        question: "What's the difference between 'Integer' and 'int' in Apex?",
        answer: "'int' doesn't exist in Apex - only 'Integer' is valid",
        explanation: "Unlike Java, Apex only has wrapper types. There are no primitive types like 'int', 'boolean', or 'double' in Apex. All data types are objects that can be null.",
        correctCode: `Integer count = 10;     // Correct
Boolean flag = true;    // Correct
Double rate = 2.5;      // Correct`,
        keyLearning: "Apex simplifies Java by only having wrapper types. This means all variables can be null and have methods.",
        examTip: "This fundamental difference from Java is frequently tested. Remember: Apex = wrapper types only."
      },
      {
        number: 6,
        difficulty: 'intermediate',
        question: "What happens with this code: Decimal d1 = null; Decimal d2 = 10; Decimal result = d1 + d2;",
        answer: "NullPointerException is thrown",
        explanation: "When performing arithmetic operations with Decimal variables, if any operand is null, the operation throws a NullPointerException. Unlike some languages that might treat null as zero, Apex requires explicit null checking.",
        correctCode: `Decimal d1 = null;
Decimal d2 = 10;
Decimal result = (d1 != null ? d1 : 0) + d2;  // Safe addition`,
        keyLearning: "Always null-check Decimal variables before arithmetic operations. Apex doesn't auto-convert null to zero.",
        examTip: "Null arithmetic operations are frequently tested scenarios on certification exams."
      },
      {
        number: 7,
        difficulty: 'beginner',
        question: "You're reviewing code and see 'String name; System.debug(name.toUpperCase());' - what will happen and how do you fix it?",
        answer: "NullPointerException will be thrown because 'name' is uninitialized (null)",
        explanation: "In Apex, declaring a variable without initialization sets it to null. Calling methods on null objects throws NullPointerException at runtime. This is a common mistake for developers coming from languages where primitives have default values.",
        correctCode: `// Option 1: Initialize with a value
String name = 'John';
System.debug(name.toUpperCase()); // Safe

// Option 2: Null-check before use
String name;
if (String.isNotBlank(name)) {
    System.debug(name.toUpperCase());
}`,
        keyLearning: "Always initialize variables or null-check before calling methods. Uninitialized reference variables default to null in Apex.",
        examTip: "This exact pattern appears frequently on certification exams. Always look for uninitialized variables in code samples."
      },
      {
        number: 8,
        difficulty: 'intermediate',
        question: "A junior developer asks why 'int count = 0;' doesn't work in Apex. How do you explain it?",
        answer: "Apex only has wrapper types like 'Integer', not primitives like 'int'",
        explanation: "Unlike Java, Apex simplified the type system by only providing wrapper types (Integer, Boolean, Double, etc.). There are no primitive types (int, boolean, double) in Apex. This means all variables can be null and have methods.",
        correctCode: `Integer count = 0;        // Correct - wrapper type
Boolean isActive = true;  // Correct - wrapper type
Double rate = 2.5;        // Correct - wrapper type

// These don't exist in Apex:
// int count = 0;        // Compilation error
// boolean flag = true;  // Compilation error`,
        keyLearning: "Apex = wrapper types only. This simplifies the language but means all variables can be null.",
        examTip: "Type system questions are common. Remember: Apex wrapper types (Integer) vs Java primitives (int) - only wrappers exist in Apex."
      },
      {
        number: 9,
        difficulty: 'intermediate',
        question: "You need to store monetary values with precision. What data type do you choose and why?",
        answer: "Decimal - it provides exact precision without floating-point rounding errors",
        explanation: "For financial calculations, Decimal is the only safe choice because it avoids floating-point arithmetic errors that can occur with Double. Currency fields in Salesforce are stored as Decimal, making this the natural choice for monetary calculations.",
        correctCode: `// Correct for currency
Decimal price = 19.99;
Decimal tax = price * 0.08;
Decimal total = price + tax;  // Exact calculation

// Wrong for currency - can have rounding errors
Double price = 19.99;
Double tax = price * 0.08;    // Potential precision loss`,
        keyLearning: "Use Decimal for all financial calculations to avoid floating-point precision issues. Currency fields in Salesforce use Decimal.",
        examTip: "Currency data type questions appear frequently. Remember: Decimal for money, Double/Float for scientific calculations."
      },
      {
        number: 10,
        difficulty: 'beginner',
        question: "Code review: 'Boolean isActive;' - what's the potential issue and how do you improve it?",
        answer: "Uninitialized Boolean defaults to null, not false, which can cause unexpected behavior",
        explanation: "In Apex, Boolean variables default to null when uninitialized, not false. This can cause issues in conditional logic where you might expect false behavior. Explicit initialization prevents confusion and potential NPEs.",
        correctCode: `// Better: Explicit initialization
Boolean isActive = false;  // Clear intent, no null issues

// Or handle null explicitly
Boolean isActive;
if (isActive == true) {    // Explicit null-safe comparison
    System.debug('Active');
}`,
        keyLearning: "Boolean variables default to null, not false. Always initialize or use explicit null-safe comparisons.",
        examTip: "Boolean null behavior is tested frequently. Remember: null != false in Apex Boolean logic."
      },
      {
        number: 11,
        difficulty: 'intermediate',
        question: "A method receives a String parameter that might be null, empty, or whitespace. Write the safest validation.",
        answer: "Use String.isNotBlank() for comprehensive validation",
        explanation: "String.isNotBlank() is the most comprehensive check as it validates against null, empty string, and strings containing only whitespace characters. This is safer than manual null checks or isEmpty().",
        correctCode: `public void processName(String name) {
    // Best: Handles null, empty, and whitespace
    if (String.isNotBlank(name)) {
        System.debug('Valid name: ' + name.trim());
    } else {
        System.debug('Invalid name provided');
    }
}

// Alternative for specific cases:
if (String.isNotEmpty(name)) { } // null and empty only
if (name != null && name.length() > 0) { } // Manual, more verbose`,
        keyLearning: "String.isNotBlank() is your best friend for string validation. It handles all edge cases in one call.",
        examTip: "String validation questions are common. Know the difference: isNotBlank (null/empty/whitespace), isNotEmpty (null/empty only)."
      },
      {
        number: 12,
        difficulty: 'advanced',
        question: "Explain when you'd use 'final' keyword with variables and give a practical example.",
        answer: "Use 'final' for constants and variables that shouldn't be reassigned after initialization",
        explanation: "The 'final' keyword prevents variable reassignment after initialization, making code more predictable and catching accidental modifications. It's especially useful for constants, configuration values, and protecting important references.",
        correctCode: `public class ConfigurationManager {
    // Class constant - compile-time constant
    private static final Integer MAX_RETRIES = 3;

    // Instance constant - runtime constant
    private final String organizationId;

    public ConfigurationManager() {
        // Can only be set once during construction
        this.organizationId = UserInfo.getOrganizationId();
    }

    public void processData(List<Account> accounts) {
        // Method-level constant
        final Integer BATCH_SIZE = 200;

        // organizationId = 'new-id';  // Compilation error
        // BATCH_SIZE = 300;           // Compilation error
    }
}`,
        keyLearning: "'final' prevents reassignment and documents intent. Use for constants, configuration, and protecting important references.",
        examTip: "Final keyword questions test understanding of immutability. Remember: prevents reassignment, not object modification."
      },
      {
        number: 13,
        difficulty: 'intermediate',
        question: "You see 'Object data = someMethod();' - what are the risks and how do you handle them safely?",
        answer: "Risk of ClassCastException and loss of type safety. Use instanceof checks and explicit casting",
        explanation: "Object is the most generic type in Apex. Using it loses compile-time type checking and requires runtime type verification. This can lead to ClassCastException if you cast to the wrong type.",
        correctCode: `Object data = someMethod();

// Safe approach with instanceof
if (data instanceof String) {
    String stringData = (String) data;
    System.debug('String value: ' + stringData);
} else if (data instanceof Integer) {
    Integer intData = (Integer) data;
    System.debug('Integer value: ' + intData);
} else if (data instanceof List<Object>) {
    List<Object> listData = (List<Object>) data;
    System.debug('List size: ' + listData.size());
} else {
    System.debug('Unknown data type: ' + (data != null ? data.getClass() : 'null'));
}`,
        keyLearning: "Object type loses type safety. Always use instanceof before casting to prevent ClassCastException.",
        examTip: "Object casting questions test type safety understanding. Remember: instanceof before casting, handle null case."
      },
      {
        number: 14,
        difficulty: 'beginner',
        question: "A developer uses 'Double' for currency calculations. What problems could this cause?",
        answer: "Floating-point precision errors that can cause incorrect monetary calculations",
        explanation: "Double uses floating-point arithmetic which can't exactly represent many decimal numbers, leading to rounding errors. For financial calculations, even tiny errors compound and can cause significant issues in accounting and reporting.",
        correctCode: `// Wrong - potential precision errors
Double price = 0.1;
Double tax = 0.2;
Double total = price + tax;  // Might not equal exactly 0.3

// Correct - exact decimal arithmetic
Decimal price = 0.1;
Decimal tax = 0.2;
Decimal total = price + tax;  // Exactly 0.3

// Real example
Decimal itemPrice = 19.99;
Decimal taxRate = 0.0825;    // 8.25%
Decimal totalPrice = itemPrice * (1 + taxRate);`,
        keyLearning: "Never use Double for currency. Decimal provides exact precision for financial calculations.",
        examTip: "Currency precision questions are frequent. Remember: Decimal for money, Double for scientific measurements."
      },
      {
        number: 15,
        difficulty: 'intermediate',
        question: "Write code to safely convert user input from String to Integer with proper error handling.",
        answer: "Use try-catch with Integer.valueOf() and validate input first",
        explanation: "String to Integer conversion can fail if the string contains non-numeric characters. Always validate input and handle TypeException to provide meaningful error messages.",
        correctCode: `public Integer safeStringToInteger(String input, Integer defaultValue) {
    // Early validation
    if (String.isBlank(input)) {
        return defaultValue;
    }

    // Remove whitespace
    input = input.trim();

    // Check if purely numeric (optional optimization)
    if (!input.isNumeric()) {
        System.debug('Non-numeric input: ' + input);
        return defaultValue;
    }

    try {
        return Integer.valueOf(input);
    } catch (TypeException e) {
        System.debug('Conversion error for input "' + input + '": ' + e.getMessage());
        return defaultValue;
    }
}

// Usage example
Integer userAge = safeStringToInteger(userInput, 0);`,
        keyLearning: "Always validate string input before type conversion. Use try-catch for TypeException and provide meaningful defaults.",
        examTip: "Type conversion questions test error handling skills. Remember: validate, try-catch, provide defaults."
      },
      {
        number: 16,
        difficulty: 'beginner',
        question: "You need to compare two String variables for equality. What are the different approaches and their implications?",
        answer: "Use .equals() method for content comparison, never == operator",
        explanation: "In Apex (like Java), the == operator compares object references, not content. For string content comparison, always use .equals() method. This is a common source of bugs for developers new to Apex.",
        correctCode: `String name1 = 'John';
String name2 = getName(); // Returns 'John'

// Wrong - compares references (might be false even with same content)
if (name1 == name2) { }

// Correct - compares content
if (name1.equals(name2)) { }

// Better - null-safe comparison
if (name1?.equals(name2) == true) { }

// Best - using String utility (handles nulls)
if (String.isEmpty(name1) && String.isEmpty(name2)) {
    // Both empty/null
} else if (name1?.equals(name2) == true) {
    // Content matches
}`,
        keyLearning: "String comparison: == compares references, .equals() compares content. Always use .equals() for string comparison.",
        examTip: "String comparison is heavily tested. Remember: == for primitives/references, .equals() for content comparison."
      },
      {
        number: 17,
        difficulty: 'intermediate',
        question: "A field might contain null or actual data. Write defensive code to handle both cases.",
        answer: "Use null-coalescing operators and safe navigation for robust handling",
        explanation: "Apex provides several mechanisms for safe null handling: null-coalescing (?:), safe navigation (?.), and traditional null checks. Combining these creates robust, readable code.",
        correctCode: `public void processAccountData(Account acc) {
    // Null-coalescing - provide default if null
    String accountName = acc.Name ?? 'Unknown Account';

    // Safe navigation - only call if not null
    Integer nameLength = acc.Name?.length();

    // Traditional null check for complex logic
    if (acc.AnnualRevenue != null) {
        Decimal monthlyRevenue = acc.AnnualRevenue / 12;
        System.debug('Monthly revenue: ' + monthlyRevenue);
    } else {
        System.debug('Annual revenue not set');
    }

    // Combining approaches
    String displayText = acc.Description?.abbreviate(50) ?? 'No description available';

    // Safe field access with default
    String industry = acc.Industry ?? 'Not Specified';
    String type = acc.Type ?? 'Standard';
}`,
        keyLearning: "Use null-coalescing (??) for defaults, safe navigation (?.) for method calls, explicit checks for complex logic.",
        examTip: "Null handling is critical for robust code. Know all three approaches: ??, ?., and explicit null checks."
      },
      {
        number: 18,
        difficulty: 'beginner',
        question: "Explain the difference between 'String s = null;' and 'String s = \"\";' and when each matters.",
        answer: "null means no object exists, empty string means object exists but contains no characters",
        explanation: "This distinction is crucial for validation and business logic. null typically means 'no value provided' while empty string means 'value provided but empty'. Different validation methods handle these cases differently.",
        correctCode: `String nullString = null;      // No object
String emptyString = '';       // Object exists, no content
String blankString = '   ';    // Object exists, whitespace only

// Different validation results:
System.debug(String.isEmpty(nullString));     // true
System.debug(String.isEmpty(emptyString));    // true
System.debug(String.isEmpty(blankString));    // false

System.debug(String.isBlank(nullString));     // true
System.debug(String.isBlank(emptyString));    // true
System.debug(String.isBlank(blankString));    // true

// Null-safe operations:
System.debug(nullString?.length());           // null
System.debug(emptyString?.length());          // 0
System.debug(blankString?.length());          // 3`,
        keyLearning: "null = no object, empty = object with no content. Use appropriate validation method based on business needs.",
        examTip: "String state questions are common. Know: null (no object), empty (no content), blank (no meaningful content)."
      },
      {
        number: 19,
        difficulty: 'advanced',
        question: "You're processing form data where numbers come as strings. Show the complete safe conversion pattern.",
        answer: "Comprehensive validation with multiple fallback strategies",
        explanation: "Real-world form processing requires handling various edge cases: null values, empty strings, non-numeric content, decimal vs integer, negative values, and range validation.",
        correctCode: `public class FormDataProcessor {
    public static Decimal parseDecimalField(String input, String fieldName, Decimal defaultValue) {
        // Step 1: Handle null/empty
        if (String.isBlank(input)) {
            System.debug(fieldName + ' is blank, using default: ' + defaultValue);
            return defaultValue;
        }

        // Step 2: Clean the input
        String cleaned = input.trim().replace(',', ''); // Remove commas

        // Step 3: Basic numeric validation
        String numericPattern = '^-?\\d*\\.?\\d+$';
        if (!Pattern.matches(numericPattern, cleaned)) {
            System.debug('Invalid numeric format for ' + fieldName + ': ' + input);
            return defaultValue;
        }

        // Step 4: Safe conversion
        try {
            Decimal result = Decimal.valueOf(cleaned);

            // Step 5: Range validation (example)
            if (fieldName.contains('Price') && result < 0) {
                System.debug('Negative price not allowed: ' + result);
                return 0;
            }

            return result;
        } catch (TypeException e) {
            System.debug('Conversion failed for ' + fieldName + ': ' + e.getMessage());
            return defaultValue;
        }
    }

    // Usage example
    public static void processOrderForm(Map<String, String> formData) {
        Decimal price = parseDecimalField(formData.get('price'), 'Price', 0.00);
        Decimal quantity = parseDecimalField(formData.get('qty'), 'Quantity', 1.00);
        Decimal total = price * quantity;
    }
}`,
        keyLearning: "Production form processing needs comprehensive validation: null handling, cleaning, format checking, type conversion, and business rules.",
        examTip: "Complex validation scenarios test real-world skills. Think: validate → clean → convert → business rules."
      },
      {
        number: 20,
        difficulty: 'advanced',
        question: "You're mentoring someone on variable naming. What are the key principles with examples?",
        answer: "Use descriptive names, consistent conventions, and context-appropriate scope indicators",
        explanation: "Good variable naming improves code readability and maintainability. Follow conventions that make intent clear, scope obvious, and purpose explicit.",
        correctCode: `public class VariableNamingBestPractices {
    // Constants: SCREAMING_SNAKE_CASE
    private static final Integer MAX_RETRY_ATTEMPTS = 3;
    private static final String DEFAULT_COUNTRY_CODE = 'US';

    // Instance variables: camelCase with descriptive names
    private String customerEmailAddress;
    private Decimal monthlyRecurringRevenue;
    private Date lastLoginTimestamp;

    // Method parameters: camelCase, context-clear
    public void updateCustomerProfile(String newEmailAddress,
                                    Boolean isEmailVerified,
                                    Date profileLastModified) {

        // Local variables: descriptive within scope
        String normalizedEmail = newEmailAddress.toLowerCase().trim();
        Boolean isValidEmailFormat = validateEmailFormat(normalizedEmail);

        // Loop variables: short names OK for short scopes
        for (Integer i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
            // Process with clear intent
        }

        // Collection variables: plural nouns
        List<Contact> customerContacts = new List<Contact>();
        Map<Id, Account> accountsById = new Map<Id, Account>();

        // Boolean variables: is/has/can/should prefixes
        Boolean hasValidLicense = checkLicenseStatus();
        Boolean canProcessPayment = validatePaymentMethod();
        Boolean shouldSendNotification = determineNotificationPreference();
    }
}

// Bad examples to avoid:
// String s, str, temp, data          // Too generic
// Integer num1, num2                 // Unclear purpose
// Boolean flag, check                // What kind of flag/check?
// List<Object> list                  // What does it contain?`,
        keyLearning: "Good names are self-documenting. Use: descriptive nouns, action verbs, consistent conventions, appropriate scope length.",
        examTip: "Code quality questions include naming conventions. Remember: constants (CAPS), variables (camelCase), booleans (is/has/can)."
      }
    ]
  },

  'collections-deep-dive': {
    title: 'Collections Deep Dive',
    overview: 'Master Lists, Sets, Maps and bulkification patterns. Now that you understand single values (Variables), learn to handle MULTIPLE values efficiently. Collections are essential for Salesforce bulk processing and prevent governor limit violations. This knowledge directly enables Control Flow (processing collections) and triggers (handling bulk data changes).',
    codeExamples: [
      {
        title: 'List Fundamentals',
        code: `public class ListDemo {
    public void processList() {
        // ✅ BUILDING ON: Variables hold ONE value (String name = 'John')
        // ✅ NEW CONCEPT: Lists hold MULTIPLE values of same type
        List<String> names = new List<String>();
        // ✅ CONNECTION: Same String type from Variables topic, but now a container
        // ✅ WHY: Processing multiple records requires collections
        // 💡 NEXT TOPIC: You'll use loops (Control Flow) to process these efficiently

        names.add('John');
        names.add('Jane');
        names.add('John'); // ✅ Lists allow duplicates (unlike Sets)

        // ✅ BUILDING FORWARD: This validation pattern crucial in Triggers
        if (!names.isEmpty()) {
            String first = names.get(0);
            System.debug('First name: ' + first);
        }

        // ✅ ENHANCED FOR LOOP: Process each item
        // 💡 NEXT TOPIC: This loop syntax comes from Control Flow
        for (String name : names) {
            // ✅ CONNECTION: String validation from Variables topic
            if (String.isNotBlank(name)) {
                System.debug('Processing valid name: ' + name);
            }
        }
        // 💡 BUILDING FORWARD: This pattern scales to process 200 records in Triggers
    }
}`,
        explanation: 'Lists are ordered collections that allow duplicates. Always check isEmpty() before accessing elements to avoid ListException. Use enhanced for loops for cleaner iteration.'
      },
      {
        title: 'Set Operations',
        code: `public class SetDemo {
    public void demonstrateSets() {
        // ✅ WHAT: Container for unique values only
        Set<String> uniqueEmails = new Set<String>();
        // ✅ WHY: Sets automatically prevent duplicates
        // ✅ PERFORMANCE: contains() is O(1) vs List O(n)

        uniqueEmails.add('john@example.com');
        uniqueEmails.add('jane@example.com');
        uniqueEmails.add('john@example.com'); // Ignored - duplicate

        System.debug('Size: ' + uniqueEmails.size()); // 2, not 3

        // ✅ FAST LOOKUP: Use for existence checks
        if (uniqueEmails.contains('john@example.com')) {
            System.debug('Email found');
        }
    }
}`,
        explanation: 'Sets enforce uniqueness and provide O(1) lookup performance. Use Sets when you need to prevent duplicates or perform fast existence checks.'
      },
      {
        title: 'Map Usage',
        code: `public class MapDemo {
    public void processAccounts() {
        // ✅ WHAT: Key-value storage for fast lookups
        Map<Id, Account> accountMap = new Map<Id, Account>();
        // ✅ WHY: Get records by ID without loops

        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 10];

        // ✅ POPULATE: Add records to map
        for (Account acc : accounts) {
            accountMap.put(acc.Id, acc);
        }

        // ✅ SAFE ACCESS: Check key exists
        Id searchId = accounts[0].Id;
        if (accountMap.containsKey(searchId)) {
            Account found = accountMap.get(searchId);
            System.debug('Found: ' + found.Name);
        }
    }
}`,
        explanation: 'Maps provide key-value storage with O(1) lookup performance. Always use containsKey() before get() to avoid null issues. Essential for bulkification patterns.'
      }
    ],
    practiceQuestions: [
      {
        number: 1,
        difficulty: 'beginner',
        question: "What's the difference between a List and a Set in Apex?",
        answer: "Lists allow duplicates and maintain order, Sets prevent duplicates and don't guarantee order",
        explanation: "Lists are indexed collections that can contain duplicate values and maintain insertion order. Sets automatically enforce uniqueness - attempting to add a duplicate value is ignored, and elements are not stored in any particular order.",
        correctCode: `List<String> names = new List<String>{'John', 'Jane', 'John'};  // 3 items
Set<String> uniqueNames = new Set<String>{'John', 'Jane', 'John'};  // 2 items`,
        keyLearning: "Choose Lists when order matters and duplicates are allowed. Choose Sets when you need to ensure uniqueness and fast lookups.",
        examTip: "PD1 frequently tests List vs Set differences. Remember: Lists = order + duplicates, Sets = uniqueness + fast contains()."
      },
      {
        number: 2,
        difficulty: 'beginner',
        question: "How do you safely access the first element of a List?",
        answer: "Check if the list is not empty first: if (!myList.isEmpty()) { firstElement = myList.get(0); }",
        explanation: "Always check if a List has elements before accessing by index to avoid System.ListException. Using isEmpty() is more readable than checking size() > 0.",
        correctCode: `List<String> names = new List<String>();
if (!names.isEmpty()) {
    String first = names.get(0);  // Safe access
} else {
    System.debug('List is empty');
}`,
        keyLearning: "Never assume a List has elements. Always check isEmpty() or size() before using get(index).",
        examTip: "Index out of bounds exceptions are common exam scenarios. Always validate before accessing."
      },
      {
        number: 3,
        difficulty: 'intermediate',
        question: "What's wrong with this bulkification pattern?",
        code: `for (Account acc : Trigger.new) {
    List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId = :acc.Id];
    // Process contacts
}`,
        answer: "SOQL query inside a loop - will hit governor limits",
        explanation: "Putting SOQL queries inside loops is the most common bulkification anti-pattern. With 200 accounts, this creates 200 separate queries, quickly hitting the 100 SOQL query limit per transaction.",
        correctCode: `Set<Id> accountIds = new Set<Id>();
for (Account acc : Trigger.new) {
    accountIds.add(acc.Id);
}
List<Contact> allContacts = [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds];`,
        keyLearning: "Always collect IDs first, then query once outside the loop. This is fundamental to writing scalable Apex.",
        examTip: "Governor limit violations due to queries in loops are heavily tested on certification exams."
      },
      {
        number: 4,
        difficulty: 'intermediate',
        question: "When should you use a Map instead of a List?",
        answer: "When you need fast lookups by key or need to group related data",
        explanation: "Maps provide O(1) lookup performance vs O(n) for Lists. Use Maps when you frequently need to find items by a unique identifier, or when grouping related objects together.",
        correctCode: `// Good: Map for fast account lookup
Map<Id, Account> accountMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);
Account found = accountMap.get(someId);  // O(1) lookup

// Bad: List requires loop for lookup
List<Account> accounts = [SELECT Id, Name FROM Account];
for (Account acc : accounts) {  // O(n) lookup
    if (acc.Id == someId) { found = acc; break; }
}`,
        keyLearning: "Maps excel at key-based lookups and grouping. Lists are better for ordered data and iteration.",
        examTip: "Performance questions about data structures appear frequently on Apex certification exams."
      },
      {
        number: 5,
        difficulty: 'advanced',
        question: "You have a List with 100,000 records and need to check if a specific ID exists. What's the performance concern and solution?",
        answer: "Linear search O(n) performance issue. Convert to Set or Map for O(1) lookups.",
        explanation: "Lists require scanning every element to find matches, which becomes expensive with large datasets. Sets and Maps provide hash-based lookups that are dramatically faster for existence checks.",
        correctCode: `// Problem: O(n) lookup - slow with large lists
List<Id> accountIds = new List<Id>(/* 100,000 IDs */);
Boolean exists = false;
for (Id accId : accountIds) {
    if (accId == targetId) { exists = true; break; }  // Potentially scans all 100K
}

// Solution 1: Set for existence checks - O(1)
Set<Id> accountIdSet = new Set<Id>(accountIds);
Boolean exists = accountIdSet.contains(targetId);  // Fast lookup

// Solution 2: Map if you need the data too - O(1)
Map<Id, Account> accountMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);
Boolean exists = accountMap.containsKey(targetId);
Account foundAccount = accountMap.get(targetId);`,
        keyLearning: "Performance scales with collection choice. Use the right data structure: List for order, Set for uniqueness, Map for key-value relationships.",
        examTip: "Performance scenarios with large datasets are common interview questions. Always think about time complexity."
      },
      {
        number: 6,
        difficulty: 'beginner',
        question: "Explain when you'd use List vs Set vs Map with real Salesforce scenarios.",
        answer: "List for ordered processing, Set for duplicate prevention, Map for key-based relationships",
        explanation: "Each collection type serves specific business needs in Salesforce. Understanding when to use each prevents performance issues and makes code more maintainable.",
        correctCode: `// List: When order matters and duplicates are OK
List<Task> taskHistory = [SELECT Id, Subject FROM Task WHERE AccountId = :accId ORDER BY CreatedDate];
for (Task t : taskHistory) {
    // Process in chronological order
}

// Set: When you need unique values only
Set<String> uniqueIndustries = new Set<String>();
for (Account acc : accounts) {
    uniqueIndustries.add(acc.Industry);  // Automatically prevents duplicates
}

// Map: When you need fast lookups or grouping
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact con : contacts) {
    if (!contactsByAccount.containsKey(con.AccountId)) {
        contactsByAccount.put(con.AccountId, new List<Contact>());
    }
    contactsByAccount.get(con.AccountId).add(con);
}`,
        keyLearning: "Collection choice drives performance and functionality. List = order, Set = uniqueness, Map = relationships.",
        examTip: "Scenario-based questions test practical understanding. Think about the business requirement first."
      },
      {
        number: 7,
        difficulty: 'advanced',
        question: "Code review: 'for(Account a : accounts) { for(Contact c : contacts) { if(c.AccountId == a.Id) {...} } }' - what's wrong?",
        answer: "O(n²) performance problem. Use Map for O(n) solution.",
        explanation: "Nested loops create quadratic time complexity. With 200 accounts and 1000 contacts, this performs 200,000 comparisons instead of the 1,200 needed with proper data structures.",
        correctCode: `// Wrong: O(n²) - 200 accounts × 1000 contacts = 200,000 operations
for (Account a : accounts) {
    for (Contact c : contacts) {
        if (c.AccountId == a.Id) {
            // Process - but this is VERY slow
        }
    }
}

// Right: O(n) - Group contacts first, then lookup
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact c : contacts) {  // O(n) - 1000 operations
    if (!contactsByAccount.containsKey(c.AccountId)) {
        contactsByAccount.put(c.AccountId, new List<Contact>());
    }
    contactsByAccount.get(c.AccountId).add(c);
}

for (Account a : accounts) {  // O(n) - 200 operations
    List<Contact> accountContacts = contactsByAccount.get(a.Id);
    if (accountContacts != null) {
        // Process contacts for this account
    }
}`,
        keyLearning: "Avoid nested loops with large datasets. Group data with Maps to convert O(n²) to O(n) operations.",
        examTip: "Performance anti-patterns are heavily tested. Nested loops = red flag for optimization."
      },
      {
        number: 8,
        difficulty: 'intermediate',
        question: "You need to group Contacts by AccountId efficiently. Walk me through your approach.",
        answer: "Use Map<Id, List<Contact>> to group related records in a single pass",
        explanation: "Grouping is a common pattern in Salesforce. The key is to iterate once and build the grouped structure, avoiding multiple lookups or nested loops.",
        correctCode: `public Map<Id, List<Contact>> groupContactsByAccount(List<Contact> contacts) {
    Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();

    for (Contact con : contacts) {
        // Skip contacts without AccountId
        if (con.AccountId == null) continue;

        // Initialize list if first contact for this account
        if (!contactsByAccount.containsKey(con.AccountId)) {
            contactsByAccount.put(con.AccountId, new List<Contact>());
        }

        // Add contact to the account's list
        contactsByAccount.get(con.AccountId).add(con);
    }

    return contactsByAccount;
}

// Usage example
Map<Id, List<Contact>> grouped = groupContactsByAccount(allContacts);
for (Id accountId : grouped.keySet()) {
    List<Contact> accountContacts = grouped.get(accountId);
    System.debug('Account ' + accountId + ' has ' + accountContacts.size() + ' contacts');
}`,
        keyLearning: "Grouping pattern: Map<KeyType, List<ValueType>>. Iterate once, check if key exists, initialize list, add item.",
        examTip: "Grouping questions are common. Master this pattern: it's used everywhere in Salesforce development."
      },
      {
        number: 9,
        difficulty: 'beginner',
        question: "A List might contain nulls and duplicates. Write code to clean it up safely.",
        answer: "Use Set for deduplication and null checks for cleaning",
        explanation: "Real-world data often contains nulls and duplicates. Cleaning collections safely requires handling both issues without causing exceptions.",
        correctCode: `public List<String> cleanStringList(List<String> inputList) {
    if (inputList == null || inputList.isEmpty()) {
        return new List<String>();
    }

    Set<String> uniqueValues = new Set<String>();

    for (String item : inputList) {
        // Skip null and blank values
        if (String.isNotBlank(item)) {
            // Set automatically handles duplicates
            uniqueValues.add(item.trim());
        }
    }

    // Convert back to List if order matters for caller
    return new List<String>(uniqueValues);
}

// Usage
List<String> dirtyList = new List<String>{'John', null, 'Jane', 'John', '  ', 'Bob'};
List<String> cleanList = cleanStringList(dirtyList);
// Result: ['John', 'Jane', 'Bob'] - no nulls, no duplicates, trimmed`,
        keyLearning: "Collection cleaning: null checks prevent exceptions, Sets remove duplicates automatically.",
        examTip: "Data validation scenarios are frequent. Always handle null input gracefully."
      },
      {
        number: 10,
        difficulty: 'intermediate',
        question: "You're processing Opportunity data and need fast lookups by Stage. What collection strategy do you use?",
        answer: "Map<String, List<Opportunity>> to group by stage with fast access",
        explanation: "Business reporting often requires grouping records by field values. Maps provide both fast access and logical grouping for analysis.",
        correctCode: `public Map<String, List<Opportunity>> groupOpportunitiesByStage(List<Opportunity> opps) {
    Map<String, List<Opportunity>> oppsByStage = new Map<String, List<Opportunity>>();

    for (Opportunity opp : opps) {
        String stage = opp.StageName ?? 'Unknown';  // Handle null stages

        if (!oppsByStage.containsKey(stage)) {
            oppsByStage.put(stage, new List<Opportunity>());
        }

        oppsByStage.get(stage).add(opp);
    }

    return oppsByStage;
}

// Business logic usage
Map<String, List<Opportunity>> oppsByStage = groupOpportunitiesByStage(opportunities);

// Fast analysis
List<Opportunity> closedWon = oppsByStage.get('Closed Won');
List<Opportunity> negotiation = oppsByStage.get('Negotiation/Review');

System.debug('Closed Won count: ' + (closedWon?.size() ?? 0));
System.debug('In Negotiation: ' + (negotiation?.size() ?? 0));`,
        keyLearning: "Grouping enables fast business analysis. Map structure mirrors business logic for intuitive access.",
        examTip: "Business scenario questions test practical application. Think about how business users would want to access the data."
      }
    ]
  },

  'control-flow-and-loops': {
    title: 'Control Flow and Loops',
    overview: 'Master decision-making in your code. Now that you have Variables (single values) and Collections (multiple values), learn to make DECISIONS about that data. Control flow is where business logic lives - every "if this then that" rule in Salesforce. This directly leads to Classes (organizing decision logic) and Triggers (automated decisions).',
    codeExamples: [
      {
        title: 'Decision Making with Business Logic',
        code: `public class ControlFlowDemo {
    // ✅ BUILDING ON: Collections from previous topic
    public void processLeads(List<Lead> leads) {
        // ✅ NEW CONCEPT: Decision making with collected data
        List<Lead> hotLeads = new List<Lead>();
        List<Lead> coldLeads = new List<Lead>();

        // ✅ ENHANCED FOR LOOP: Process each item in collection
        for (Lead lead : leads) {
            // ✅ CONNECTION: Same for loop pattern you'll use everywhere
            // ✅ WHY enhanced for: Safer than index loops, no out-of-bounds

            // ✅ CONDITIONAL LOGIC: Business decision making
            if (lead.AnnualRevenue != null && lead.AnnualRevenue > 1000000) {
                // ✅ NULL SAFETY: Always check null first (from Variables topic)
                // ✅ BUSINESS LOGIC: Categorize high-value prospects
                hotLeads.add(lead);

                // ✅ NESTED CONDITIONS: More complex decision trees
                if (lead.Industry == 'Technology') {
                    lead.Rating = 'Hot';
                    // ✅ CONNECTION: This pattern crucial in Triggers topic
                }
            } else if (lead.AnnualRevenue != null && lead.AnnualRevenue > 100000) {
                // ✅ ELSE IF: Handle multiple conditions efficiently
                lead.Rating = 'Warm';
            } else {
                // ✅ ELSE: Catch-all for remaining cases
                coldLeads.add(lead);
            }
        }

        // ✅ CONDITIONAL PROCESSING: Only act if data exists
        if (!hotLeads.isEmpty()) {
            // 💡 NEXT TOPIC: You'll organize this logic into Classes
            processHotLeads(hotLeads);
        }
    }

    private void processHotLeads(List<Lead> leads) {
        for (Lead lead : leads) {
            lead.Status = 'Working - Contacted';
        }
    }
}`,
        explanation: 'Always check for null before comparing values. Use explicit boolean comparisons (== true) for null-safe logic with Boolean fields that can be null.'
      },
      {
        title: 'Switch Statements and Advanced Patterns',
        code: `public class SwitchPatterns {
    // ✅ SWITCH STATEMENT: Clean multiple exact comparisons
    public String categorizeBySource(Lead lead) {
        // ✅ WHEN TO USE: Multiple exact value comparisons (not ranges)
        switch on lead.LeadSource {
            when 'Web' {
                return 'Digital Marketing';
            }
            when 'Phone Inquiry', 'Cold Call' {
                // ✅ MULTIPLE VALUES: Comma-separated in single case
                return 'Direct Sales';
            }
            when 'Partner Referral' {
                return 'Channel Partners';
            }
            when else {
                // ✅ DEFAULT CASE: Handle unmatched values
                return 'Unknown Source';
            }
        }
        // 💡 NEXT TOPIC: This decision logic will be reused in Classes
    }

    // ✅ EARLY EXIT PATTERNS: Improve performance
    public void processOpportunities(List<Opportunity> opps) {
        for (Opportunity opp : opps) {
            // ✅ GUARD CLAUSE: Early exit for invalid data
            if (opp.Amount == null || opp.Amount <= 0) {
                continue; // Skip to next iteration
            }

            // ✅ BUSINESS LOGIC: Only process valid opportunities
            if (opp.StageName == 'Closed Won') {
                // Process won opportunity
                System.debug('Processing won opp: ' + opp.Amount);

                // ✅ BREAK: Exit loop if we found what we need
                if (opp.Amount > 1000000) {
                    System.debug('Found large deal, stopping search');
                    break;
                }
            }
        }
    }
}`,
        explanation: 'Choose the right loop type: enhanced for when processing all elements, traditional for when you need indexes, while when the iteration count depends on conditions.'
      }
    ],
    practiceQuestions: [
      {
        number: 1,
        difficulty: 'advanced',
        question: "You see nested for loops processing 1000+ records in a trigger. What's the performance issue and how do you fix it?",
        answer: "O(n²) complexity causing CPU timeout. Use Maps to flatten to O(n).",
        explanation: "Nested loops create quadratic time complexity. With 1000 records, this means 1,000,000 operations. This quickly hits CPU timeout limits in Salesforce. The solution is to use Maps for grouping data.",
        correctCode: `// Wrong: O(n²) - 1000 × 1000 = 1,000,000 operations
for (Account acc : accounts) {
    for (Contact con : contacts) {
        if (con.AccountId == acc.Id) {
            // Process - but VERY slow
        }
    }
}

// Right: O(n) - Group first, then process
Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
for (Contact con : contacts) {  // 1000 operations
    if (!contactsByAccount.containsKey(con.AccountId)) {
        contactsByAccount.put(con.AccountId, new List<Contact>());
    }
    contactsByAccount.get(con.AccountId).add(con);
}

for (Account acc : accounts) {  // 1000 more operations
    List<Contact> relatedContacts = contactsByAccount.get(acc.Id);
    // Process efficiently
}`,
        keyLearning: "Nested loops are a performance killer. Always flatten to single loops with Maps for grouping.",
        examTip: "Performance optimization questions are common. Nested loops = immediate red flag for O(n²) complexity."
      },
      {
        number: 2,
        difficulty: 'intermediate',
        question: "A developer uses `if (lead.Company.startsWith('Acme'))` - what could go wrong and how do you fix it?",
        answer: "NullPointerException if Company is null. Use null-safe navigation.",
        explanation: "Field values in Salesforce can be null. Calling methods directly on potentially null fields throws NullPointerException at runtime. Always check for null first or use safe navigation.",
        correctCode: `// Wrong - throws NPE if Company is null
if (lead.Company.startsWith('Acme')) {
    // Process
}

// Option 1: Traditional null check
if (lead.Company != null && lead.Company.startsWith('Acme')) {
    // Process safely
}

// Option 2: Safe navigation (modern Apex)
if (lead.Company?.startsWith('Acme') == true) {
    // Process safely
}

// Option 3: Null-coalescing for default
String company = lead.Company ?? '';
if (company.startsWith('Acme')) {
    // Process safely
}`,
        keyLearning: "Always assume Salesforce fields can be null. Use null checks or safe navigation before calling methods.",
        examTip: "Null safety is heavily tested. Look for method calls on fields without null checks."
      },
      {
        number: 3,
        difficulty: 'beginner',
        question: "When would you choose switch over if/else statements?",
        answer: "Switch for multiple exact value comparisons, if/else for ranges or complex conditions",
        explanation: "Switch statements are cleaner and more performant for comparing a single variable against multiple exact values. Use if/else for range comparisons, complex boolean logic, or when you need different variables in each condition.",
        correctCode: `// Good use of switch: exact value matching
switch on lead.Status {
    when 'Open - Not Contacted' {
        lead.Priority = 'High';
    }
    when 'Working - Contacted' {
        lead.Priority = 'Medium';
    }
    when 'Closed - Converted', 'Closed - Not Converted' {
        lead.Priority = 'Low';
    }
    when else {
        lead.Priority = 'Unknown';
    }
}

// Better with if/else: range comparisons
if (lead.AnnualRevenue > 1000000) {
    lead.Rating = 'Hot';
} else if (lead.AnnualRevenue > 100000) {
    lead.Rating = 'Warm';
} else {
    lead.Rating = 'Cold';
}`,
        keyLearning: "Switch = exact values, if/else = ranges/complex logic. Choose based on what you're comparing.",
        examTip: "Control structure choice questions test understanding of appropriate usage patterns."
      },
      {
        number: 4,
        difficulty: 'intermediate',
        question: "Explain the difference between `break` and `continue` with examples.",
        answer: "`break` exits the entire loop, `continue` skips to the next iteration",
        explanation: "These control statements change loop execution flow. `break` immediately exits the loop entirely, while `continue` skips the remaining code in the current iteration and moves to the next iteration.",
        correctCode: `List<Account> accounts = [SELECT Id, Name, AnnualRevenue FROM Account];

// Using continue - skip invalid records
for (Account acc : accounts) {
    if (acc.AnnualRevenue == null) {
        continue; // Skip this account, go to next iteration
    }

    // This code only runs for accounts with revenue
    acc.Rating = acc.AnnualRevenue > 1000000 ? 'Hot' : 'Cold';
}

// Using break - exit when found
for (Account acc : accounts) {
    if (acc.Name == 'Target Account') {
        System.debug('Found target account');
        break; // Exit loop completely, don't process remaining accounts
    }

    // This code runs until target is found
    System.debug('Still searching: ' + acc.Name);
}`,
        keyLearning: "continue = skip current iteration, break = exit entire loop. Use continue for filtering, break for early termination.",
        examTip: "Loop control questions test understanding of flow modification. Remember: continue skips, break exits."
      },
      {
        number: 5,
        difficulty: 'beginner',
        question: "You need to process only the first 50 records in a list. Show two approaches.",
        answer: "Use LIMIT in SOQL query or traditional for loop with counter",
        explanation: "When you only need a subset of records, it's more efficient to limit at the query level. If you already have the full list, use a traditional for loop with index control.",
        correctCode: `// Approach 1: Limit at query level (BEST)
List<Lead> leads = [SELECT Id, Name FROM Lead ORDER BY CreatedDate LIMIT 50];
for (Lead lead : leads) {
    // Process all 50 records
}

// Approach 2: Limit during processing
List<Lead> allLeads = [SELECT Id, Name FROM Lead ORDER BY CreatedDate];
for (Integer i = 0; i < Math.min(allLeads.size(), 50); i++) {
    Lead lead = allLeads.get(i);
    // Process only first 50
}

// Approach 3: Enhanced for with counter
List<Lead> allLeads = [SELECT Id, Name FROM Lead ORDER BY CreatedDate];
Integer count = 0;
for (Lead lead : allLeads) {
    if (count >= 50) break;

    // Process record
    count++;
}`,
        keyLearning: "Always prefer limiting at the database level (SOQL LIMIT) rather than in Apex loops for better performance.",
        examTip: "Query optimization questions favor database-level filtering over Apex-level filtering."
      },
      {
        number: 6,
        difficulty: 'intermediate',
        question: "What's wrong with `if (stringValue == null || stringValue == '') {...}` and how do you improve it?",
        answer: "Verbose and doesn't handle whitespace. Use String.isBlank() for comprehensive checking",
        explanation: "Manual null and empty checking is verbose and error-prone. String.isBlank() handles null, empty string, and whitespace-only strings in one call, making code cleaner and more robust.",
        correctCode: `String stringValue = getValueFromSomewhere();

// Verbose and incomplete
if (stringValue == null || stringValue == '') {
    // Doesn't catch '   ' (whitespace only)
}

// Better but still verbose
if (stringValue == null || stringValue.trim().length() == 0) {
    // Handles whitespace but verbose
}

// Best: comprehensive and concise
if (String.isBlank(stringValue)) {
    // Handles null, empty, and whitespace-only
}

// For processing with default
String processedValue = String.isBlank(stringValue) ? 'Default' : stringValue.trim();`,
        keyLearning: "Use String utility methods (isBlank, isNotBlank, isNotEmpty) instead of manual null/empty checks.",
        examTip: "String validation questions favor utility methods over manual checking. Remember: isBlank includes whitespace."
      },
      {
        number: 7,
        difficulty: 'advanced',
        question: "A loop is causing 'CPU timeout exceeded'. How do you optimize it?",
        answer: "Move to asynchronous processing, reduce complexity, or use database operations instead of loops",
        explanation: "CPU timeouts occur when synchronous Apex runs too long (10 seconds). Solutions include moving heavy processing to async context, optimizing algorithms, or replacing Apex loops with database operations.",
        correctCode: `// Problem: Heavy processing in sync context
public void processLargeDataset(List<Account> accounts) {
    for (Account acc : accounts) {
        // Complex calculations causing timeout
        for (Contact con : [SELECT Id FROM Contact WHERE AccountId = :acc.Id]) {
            // Nested query + processing = CPU killer
        }
    }
}

// Solution 1: Move to async
@future
public static void processLargeDatasetAsync(List<Id> accountIds) {
    // 60 second limit instead of 10 seconds
    List<Account> accounts = [SELECT Id FROM Account WHERE Id IN :accountIds];
    // Process with higher limits
}

// Solution 2: Bulkify queries
public void processLargeDatasetBulk(List<Account> accounts) {
    Set<Id> accountIds = new Set<Id>();
    for (Account acc : accounts) {
        accountIds.add(acc.Id);
    }

    // Single query instead of loop queries
    Map<Id, List<Contact>> contactsByAccount = new Map<Id, List<Contact>>();
    for (Contact con : [SELECT Id, AccountId FROM Contact WHERE AccountId IN :accountIds]) {
        // Group efficiently
    }
}`,
        keyLearning: "CPU timeouts require architectural changes: async processing, query bulkification, or database operations.",
        examTip: "Governor limit scenarios test understanding of Salesforce platform constraints and optimization strategies."
      },
      {
        number: 8,
        difficulty: 'beginner',
        question: "You're processing Account records and need to skip inactive ones. Best approach?",
        answer: "Use continue statement to skip inactive accounts in the loop",
        explanation: "When you need to skip certain records during processing, the continue statement provides clean, readable code that moves to the next iteration without deeply nesting the main logic.",
        correctCode: `public void processAccounts(List<Account> accounts) {
    for (Account acc : accounts) {
        // Guard clause: skip inactive accounts
        if (acc.Active__c != true) {
            continue; // Skip to next account
        }

        // Main processing logic only runs for active accounts
        if (acc.AnnualRevenue > 1000000) {
            acc.Rating = 'Hot';
        }

        acc.LastProcessed__c = System.now();
        System.debug('Processed active account: ' + acc.Name);
    }
}

// Alternative: filter in query (even better)
List<Account> activeAccounts = [SELECT Id, Name, AnnualRevenue FROM Account WHERE Active__c = true];
for (Account acc : activeAccounts) {
    // All accounts are already active
}`,
        keyLearning: "Use continue for clean guard clauses, but prefer filtering in SOQL queries when possible.",
        examTip: "Early exit patterns improve code readability. Guard clauses with continue are preferred over deep nesting."
      },
      {
        number: 9,
        difficulty: 'intermediate',
        question: "Explain when enhanced for loops are preferred over traditional for loops.",
        answer: "Enhanced for when processing all elements, traditional for when you need index or skip elements",
        explanation: "Enhanced for loops are safer (no index bounds issues) and cleaner for processing all elements. Traditional for loops give you index control for partial processing or when you need element position.",
        correctCode: `List<Contact> contacts = [SELECT Id, Name, Email FROM Contact];

// Enhanced for: Process all elements (PREFERRED)
for (Contact con : contacts) {
    // Clean, safe, no index management
    if (String.isNotBlank(con.Email)) {
        sendEmail(con.Email);
    }
}

// Traditional for: When you need the index
for (Integer i = 0; i < contacts.size(); i++) {
    Contact con = contacts.get(i);
    System.debug('Processing contact #' + (i + 1) + ': ' + con.Name);
}

// Traditional for: Process only first half
for (Integer i = 0; i < contacts.size() / 2; i++) {
    Contact con = contacts.get(i);
    // Process subset
}

// Traditional for: Skip every other element
for (Integer i = 0; i < contacts.size(); i += 2) {
    Contact con = contacts.get(i);
    // Process every other contact
}`,
        keyLearning: "Enhanced for = all elements safely. Traditional for = index control and partial processing.",
        examTip: "Loop choice questions test understanding of when index access is necessary vs. simple iteration."
      },
      {
        number: 10,
        difficulty: 'advanced',
        question: "A business rule has 8 different conditions. How do you structure this cleanly?",
        answer: "Use early returns, switch statements, or strategy pattern to avoid deep nesting",
        explanation: "Multiple conditions can create deeply nested, hard-to-read code. Clean approaches include guard clauses with early returns, switch statements for exact matches, or organizing into separate methods.",
        correctCode: `// Problem: Deep nesting with many conditions
public String categorizeOpportunity(Opportunity opp) {
    if (opp.Amount != null) {
        if (opp.Amount > 1000000) {
            if (opp.Probability > 80) {
                if (opp.Type == 'New Customer') {
                    // Deep nesting continues...
                }
            }
        }
    }
    return 'Unknown';
}

// Solution 1: Early returns (guard clauses)
public String categorizeOpportunityClean(Opportunity opp) {
    // Handle invalid cases early
    if (opp.Amount == null) return 'No Amount';
    if (opp.Probability == null) return 'No Probability';

    // Large deals
    if (opp.Amount > 1000000) {
        if (opp.Probability > 80) return 'Large Sure Deal';
        if (opp.Probability > 50) return 'Large Likely Deal';
        return 'Large Risky Deal';
    }

    // Medium deals
    if (opp.Amount > 100000) {
        return opp.Probability > 70 ? 'Medium Sure Deal' : 'Medium Deal';
    }

    return 'Small Deal';
}

// Solution 2: Switch for exact matching
public String categorizeByStage(Opportunity opp) {
    switch on opp.StageName {
        when 'Prospecting', 'Qualification' { return 'Early Stage'; }
        when 'Needs Analysis', 'Value Proposition' { return 'Mid Stage'; }
        when 'Id. Decision Makers', 'Perception Analysis' { return 'Late Stage'; }
        when 'Proposal/Price Quote', 'Negotiation/Review' { return 'Final Stage'; }
        when 'Closed Won' { return 'Won'; }
        when 'Closed Lost' { return 'Lost'; }
        when else { return 'Unknown Stage'; }
    }
}`,
        keyLearning: "Complex conditions need clean structure: early returns, switch statements, or separate methods to avoid nesting.",
        examTip: "Code quality questions test ability to write maintainable logic. Deep nesting is an anti-pattern."
      }
    ]
  },

  'classes-and-objects': {
    title: 'Classes and Objects',
    overview: 'Master object-oriented programming in Apex. Your control flow logic needs organization and reusability - Classes are containers for related functionality. Understanding classes is crucial because 30% of Salesforce development involves creating and using custom classes. This knowledge directly enables SOQL operations (organized data access) and Triggers (organized automation).',
    codeExamples: [
      {
        title: 'Class Structure',
        code: `public class CustomerManager {
    // ✅ BUILDING ON: Control flow logic needs organization and reusability
    // ✅ NEW CONCEPT: Classes are containers for related functionality

    // ✅ INSTANCE VARIABLES: Data that belongs to each object
    private String managerName;
    private Integer customersProcessed;
    private List<String> processedCustomerIds;
    // ✅ WHY private: Encapsulation - controlled access only
    // ✅ CONNECTION: Same variable principles from Variables topic
    // 💡 NEXT TOPIC: SOQL will populate these with real data

    // ✅ STATIC VARIABLES: Shared across ALL objects of this class
    private static Integer totalCustomersProcessed = 0;
    // ✅ WHAT: One copy shared by all CustomerManager objects
    // ✅ WHY: Track global statistics across all instances

    // ✅ CONSTANTS: Values that never change
    public static final Integer MAX_CUSTOMERS_PER_BATCH = 200;
    // ✅ WHY 200: Salesforce governor limits for bulk processing

    // ✅ CONSTRUCTOR: Initialize object when created
    public CustomerManager(String name) {
        // ✅ WHAT: Runs automatically when object created with 'new'
        // ✅ WHY: Ensures object starts in valid state
        this.managerName = name;
        this.customersProcessed = 0;
        this.processedCustomerIds = new List<String>();
        // ✅ CONNECTION: List initialization from Collections topic
        // 💀 EXAM TRAP: Forgetting to initialize collections = null errors
    }

    // ✅ INSTANCE METHOD: Operates on specific object's data
    public void processCustomer(Account customer) {
        // ✅ VALIDATION: Same patterns from Control Flow topic
        if (customer == null || String.isBlank(customer.Name)) {
            System.debug('Invalid customer data provided');
            return; // Early exit pattern
        }

        // ✅ BUSINESS LOGIC: Apply processing rules
        if (customer.AnnualRevenue != null && customer.AnnualRevenue > 100000) {
            customer.CustomerPriority__c = 'High';
            // ✅ CONNECTION: Conditional logic from Control Flow topic
        }

        // ✅ STATE TRACKING: Update object's internal data
        this.customersProcessed++;
        this.processedCustomerIds.add(customer.Id);
        totalCustomersProcessed++; // Static variable

        System.debug(this.managerName + ' processed: ' + customer.Name);
        // 💡 NEXT TOPIC: SOQL will provide customer data efficiently
    }

    // ✅ STATIC METHOD: Utility function, no object needed
    public static Boolean isHighValueCustomer(Account customer) {
        // ✅ WHEN TO USE: Pure function that doesn't need object state
        // ✅ REUSABILITY: Can be called from anywhere
        if (customer?.AnnualRevenue == null) {
            return false;
        }
        return customer.AnnualRevenue > 500000;
        // ✅ CONNECTION: Null safety from Variables topic
    }

    // ✅ GETTER METHOD: Controlled access to private data
    public Integer getCustomersProcessed() {
        return this.customersProcessed;
        // ✅ ENCAPSULATION: Read-only access to internal state
    }
}

// ✅ USAGE EXAMPLE: How classes work together
public class BusinessLogicExample {
    public void demonstrateClassUsage() {
        // ✅ OBJECT CREATION: Constructor runs automatically
        CustomerManager salesManager = new CustomerManager('John Smith');
        CustomerManager supportManager = new CustomerManager('Jane Doe');
        // ✅ MULTIPLE OBJECTS: Each has its own state

        // ✅ STATIC METHOD: Called on class, not object
        List<Account> accounts = [SELECT Id, Name, AnnualRevenue FROM Account LIMIT 10];

        for (Account acc : accounts) {
            // ✅ DECISION LOGIC: From Control Flow topic
            if (CustomerManager.isHighValueCustomer(acc)) {
                salesManager.processCustomer(acc);
                // ✅ INSTANCE METHOD: Called on specific object
            }
        }

        System.debug('Sales processed: ' + salesManager.getCustomersProcessed());
        // 💡 NEXT TOPIC: SOQL will get data more efficiently
    }
}`,
        explanation: 'Classes encapsulate related data and behavior. Use instance variables for object state, constructors for initialization, instance methods for object operations, and static methods for utilities.'
      }
    ],
    practiceQuestions: [
      {
        number: 1,
        difficulty: 'beginner',
        question: "What's the difference between a class and an object in Apex?",
        answer: "A class is a blueprint/template, an object is an instance created from that class",
        explanation: "A class defines the structure (variables and methods) but doesn't exist in memory. An object is a specific instance of that class that actually holds data and can execute methods.",
        correctCode: `public class Account {
    public String name;  // Class defines structure
    public void display() { System.debug(name); }
}

// Object creation from class
Account myAccount = new Account();  // Create object instance
myAccount.name = 'Acme Corp';       // Set data in object
myAccount.display();                // Call method on object`,
        keyLearning: "Class = blueprint, Object = actual instance. You need to instantiate a class with 'new' to create an object.",
        examTip: "PD1 frequently tests understanding of classes vs objects. Remember: classes define, objects execute."
      },
      {
        number: 2,
        difficulty: 'beginner',
        question: "When should you use a constructor in Apex?",
        answer: "When you need to initialize instance variables or perform setup when an object is created",
        explanation: "Constructors ensure objects start in a valid state. Use them to set default values, initialize collections, or perform validation. If you don't create a constructor, Apex provides a default no-argument constructor.",
        correctCode: `public class OrderProcessor {
    private String processorName;
    private List<Order> pendingOrders;
    private DateTime createdAt;

    // Constructor initializes object state
    public OrderProcessor(String name) {
        this.processorName = name;
        this.pendingOrders = new List<Order>(); // Initialize collection
        this.createdAt = System.now();          // Set timestamp

        // Validation in constructor
        if (String.isBlank(name)) {
            throw new IllegalArgumentException('Processor name cannot be blank');
        }
    }

    // Overloaded constructor with different parameters
    public OrderProcessor(String name, Integer initialCapacity) {
        this(name); // Call other constructor
        this.pendingOrders = new List<Order>(initialCapacity);
    }
}`,
        keyLearning: "Constructors initialize object state and ensure valid starting conditions. Always initialize collections to avoid null errors.",
        examTip: "Constructor questions often test initialization patterns and overloading. Remember: no return type for constructors."
      },
      {
        number: 3,
        difficulty: 'intermediate',
        question: "What's the difference between instance and static methods? When would you use each?",
        answer: "Instance methods operate on object data, static methods are utilities that don't need object state",
        explanation: "Instance methods have access to instance variables and represent object behavior. Static methods can't access instance variables and are called on the class itself, not objects.",
        correctCode: `public class CustomerService {
    private String serviceName;
    private Integer requestsHandled;

    // Instance method - needs object state
    public void handleCustomerRequest(Case customerCase) {
        this.requestsHandled++;  // Uses instance variable
        System.debug(this.serviceName + ' handled case: ' + customerCase.Subject);
    }

    // Static method - utility function, no object needed
    public static Boolean isHighPriorityCase(Case customerCase) {
        return customerCase.Priority == 'High' || customerCase.Priority == 'Critical';
        // No access to instance variables
    }

    // Static method - helper for calculations
    public static Decimal calculateSLA(DateTime created, String priority) {
        Decimal hours = 24; // Default
        if (priority == 'High') hours = 4;
        if (priority == 'Critical') hours = 1;
        return hours;
    }
}

// Usage examples
CustomerService service = new CustomerService();
service.handleCustomerRequest(someCase); // Instance method

Boolean isHigh = CustomerService.isHighPriorityCase(someCase); // Static method`,
        keyLearning: "Instance methods for object-specific operations, static methods for utilities and helper functions.",
        examTip: "Static method questions test understanding of when object state is needed vs. pure functions."
      },
      {
        number: 4,
        difficulty: 'beginner',
        question: "What is encapsulation and why use private variables?",
        answer: "Encapsulation hides internal implementation details and controls access to data through public methods",
        explanation: "Private variables prevent external code from directly modifying object state. This ensures data integrity and allows you to control how data is accessed or modified.",
        correctCode: `public class BankAccount {
    // Private variables - cannot be accessed directly from outside
    private Decimal balance;
    private String accountNumber;

    public BankAccount(String accNum, Decimal initialBalance) {
        this.accountNumber = accNum;
        this.balance = initialBalance;
    }

    // Public getter - controlled read access
    public Decimal getBalance() {
        return this.balance;
    }

    // Public method with validation - controlled write access
    public Boolean withdraw(Decimal amount) {
        if (amount <= 0) {
            System.debug('Invalid withdrawal amount');
            return false;
        }

        if (amount > this.balance) {
            System.debug('Insufficient funds');
            return false;
        }

        this.balance -= amount; // Controlled modification
        return true;
    }

    // Direct access prevented:
    // account.balance = -1000; // COMPILATION ERROR - private variable
}`,
        keyLearning: "Private variables with public methods provide controlled access and maintain data integrity.",
        examTip: "Encapsulation questions test understanding of access modifiers and data protection principles."
      },
      {
        number: 5,
        difficulty: 'advanced',
        question: "Your class needs to track total records processed across all instances. How do you implement this?",
        answer: "Use a static variable that's shared across all instances of the class",
        explanation: "Static variables belong to the class, not individual objects. All instances share the same static variable, making it perfect for tracking global counters or shared state.",
        correctCode: `public class RecordProcessor {
    // Static variable - shared across ALL instances
    private static Integer totalRecordsProcessed = 0;
    private static Map<String, Integer> processingStats = new Map<String, Integer>();

    // Instance variables - unique to each object
    private String processorName;
    private Integer instanceRecordsProcessed;

    public RecordProcessor(String name) {
        this.processorName = name;
        this.instanceRecordsProcessed = 0;
    }

    public void processRecord(SObject record) {
        // Update instance counter
        this.instanceRecordsProcessed++;

        // Update shared static counter
        totalRecordsProcessed++;

        // Update shared stats
        String objectType = record.getSObjectType().getDescribe().getName();
        Integer currentCount = processingStats.get(objectType);
        processingStats.put(objectType, (currentCount == null ? 1 : currentCount + 1));
    }

    // Static method to access shared data
    public static Integer getTotalRecordsProcessed() {
        return totalRecordsProcessed;
    }

    public static Map<String, Integer> getProcessingStats() {
        return processingStats.clone(); // Return copy for safety
    }
}

// Usage - all instances share static variables
RecordProcessor proc1 = new RecordProcessor('Processor1');
RecordProcessor proc2 = new RecordProcessor('Processor2');

proc1.processRecord(someAccount);  // totalRecordsProcessed = 1
proc2.processRecord(someContact);  // totalRecordsProcessed = 2

System.debug(RecordProcessor.getTotalRecordsProcessed()); // 2`,
        keyLearning: "Static variables are shared across all instances and persist for the entire transaction.",
        examTip: "Static variable questions test understanding of class-level vs instance-level data sharing."
      },
      {
        number: 6,
        difficulty: 'intermediate',
        question: "You have a class with both a parameterized constructor and need a default constructor. How do you implement this?",
        answer: "Create multiple constructors with different parameter lists (constructor overloading)",
        explanation: "You can have multiple constructors as long as they have different parameter signatures. This allows flexible object creation patterns.",
        correctCode: `public class EmailService {
    private String serviceName;
    private String defaultTemplate;
    private Boolean debugMode;

    // Default constructor
    public EmailService() {
        this('Default Email Service', 'standard_template', false);
    }

    // Constructor with service name only
    public EmailService(String name) {
        this(name, 'standard_template', false);
    }

    // Constructor with name and template
    public EmailService(String name, String template) {
        this(name, template, false);
    }

    // Full constructor - all others call this one
    public EmailService(String name, String template, Boolean debug) {
        this.serviceName = name;
        this.defaultTemplate = template;
        this.debugMode = debug;

        // Common initialization logic in one place
        validateInputs();
    }

    private void validateInputs() {
        if (String.isBlank(this.serviceName)) {
            this.serviceName = 'Unnamed Service';
        }
        if (String.isBlank(this.defaultTemplate)) {
            this.defaultTemplate = 'basic_template';
        }
    }
}

// Flexible object creation
EmailService service1 = new EmailService();
EmailService service2 = new EmailService('Marketing Service');
EmailService service3 = new EmailService('Sales Service', 'sales_template');
EmailService service4 = new EmailService('Debug Service', 'debug_template', true);`,
        keyLearning: "Constructor overloading provides flexible object creation. Use constructor chaining with this() to avoid code duplication.",
        examTip: "Constructor overloading questions test understanding of parameter signatures and initialization patterns."
      },
      {
        number: 7,
        difficulty: 'beginner',
        question: "What happens if you don't define a constructor in your Apex class?",
        answer: "Apex automatically provides a default no-argument constructor",
        explanation: "If you don't write any constructors, Apex creates a default constructor that takes no parameters and does nothing. However, if you create any constructor, the default one is no longer provided.",
        correctCode: `// Class without explicit constructor
public class SimpleClass {
    public String name;
    public Integer value;

    // Apex automatically provides:
    // public SimpleClass() { }
}

// Usage works fine
SimpleClass obj1 = new SimpleClass(); // Uses default constructor
obj1.name = 'Test';

// Class with explicit constructor
public class ExplicitConstructorClass {
    public String name;

    public ExplicitConstructorClass(String n) {
        this.name = n;
    }

    // Default constructor NO LONGER PROVIDED
}

// This would cause compilation error:
// ExplicitConstructorClass obj2 = new ExplicitConstructorClass(); // ERROR

// This works:
ExplicitConstructorClass obj3 = new ExplicitConstructorClass('Valid');`,
        keyLearning: "Default constructor is provided only if you don't write any constructors. Writing one constructor removes the default.",
        examTip: "Constructor questions often test this rule: explicit constructor = no more default constructor."
      },
      {
        number: 8,
        difficulty: 'intermediate',
        question: "How do you properly handle null checks when working with objects in methods?",
        answer: "Use null safety patterns and validation at method entry points",
        explanation: "Always validate object parameters and use safe navigation or explicit null checks to prevent NullPointerExceptions.",
        correctCode: `public class ContactService {

    public String getContactDisplayName(Contact con) {
        // Guard clause - early return for null
        if (con == null) {
            return 'Unknown Contact';
        }

        // Safe string operations
        String firstName = String.isBlank(con.FirstName) ? '' : con.FirstName;
        String lastName = String.isBlank(con.LastName) ? 'Unknown' : con.LastName;

        return firstName + ' ' + lastName;
    }

    public Boolean isHighValueContact(Contact con) {
        // Multiple validations
        if (con?.Account == null) {
            return false;
        }

        // Safe navigation with null coalescing
        Decimal revenue = con.Account.AnnualRevenue ?? 0;
        return revenue > 1000000;
    }

    public void updateContactPreferences(Contact con, Map<String, Object> prefs) {
        // Validate both parameters
        if (con == null || prefs == null || prefs.isEmpty()) {
            System.debug('Invalid parameters provided');
            return;
        }

        // Safe map access
        if (prefs.containsKey('Email_Opt_Out__c')) {
            con.Email_Opt_Out__c = Boolean.valueOf(prefs.get('Email_Opt_Out__c'));
        }

        // Validate before DML
        if (con.Id != null) {
            update con;
        }
    }
}`,
        keyLearning: "Use guard clauses, safe navigation (?.), and null coalescing (??) for robust null handling.",
        examTip: "Null safety questions test defensive programming practices. Always validate inputs early."
      },
      {
        number: 9,
        difficulty: 'advanced',
        question: "You need a utility class with only static methods. What's the best practice for this?",
        answer: "Make the constructor private to prevent instantiation and mark the class as final",
        explanation: "Utility classes shouldn't be instantiated since they only contain static methods. A private constructor prevents object creation.",
        correctCode: `public final class MathUtils {

    // Private constructor prevents instantiation
    private MathUtils() {
        throw new UnsupportedOperationException('Utility class cannot be instantiated');
    }

    // All methods are static
    public static Decimal calculateTax(Decimal amount, Decimal rate) {
        if (amount == null || rate == null || amount < 0 || rate < 0) {
            throw new IllegalArgumentException('Invalid tax calculation parameters');
        }
        return amount * (rate / 100);
    }

    public static Decimal calculateDiscount(Decimal originalPrice, Decimal discountPercent) {
        if (originalPrice == null || discountPercent == null) {
            return originalPrice;
        }

        Decimal discount = originalPrice * (discountPercent / 100);
        return originalPrice - discount;
    }

    public static Boolean isWithinRange(Decimal value, Decimal min, Decimal max) {
        if (value == null) return false;
        return value >= min && value <= max;
    }
}

// Usage - only static method calls
Decimal tax = MathUtils.calculateTax(100.00, 8.5);
Decimal discounted = MathUtils.calculateDiscount(100.00, 10);

// This would cause error:
// MathUtils util = new MathUtils(); // COMPILATION ERROR`,
        keyLearning: "Utility classes use private constructors and static methods only. Mark as final for clarity.",
        examTip: "Utility class questions test understanding of static-only design patterns and instantiation prevention."
      },
      {
        number: 10,
        difficulty: 'intermediate',
        question: "How do you implement a class that needs to maintain a count of all instances created?",
        answer: "Use a static variable incremented in the constructor",
        explanation: "Static variables are shared across all instances and persist throughout the transaction. Incrementing in the constructor tracks every object creation.",
        correctCode: `public class SessionManager {
    // Static counter shared by all instances
    private static Integer instanceCount = 0;

    // Instance variables
    private String sessionId;
    private DateTime createdAt;

    public SessionManager() {
        // Increment counter for every instance created
        instanceCount++;

        this.sessionId = 'SESSION_' + instanceCount + '_' + System.currentTimeMillis();
        this.createdAt = System.now();

        System.debug('Created session #' + instanceCount + ': ' + this.sessionId);
    }

    // Parameterized constructor also increments
    public SessionManager(String customId) {
        this(); // Call default constructor to increment counter
        this.sessionId = customId + '_' + instanceCount;
    }

    // Static method to access count
    public static Integer getTotalInstancesCreated() {
        return instanceCount;
    }

    // Instance method to get this object's number
    public String getSessionInfo() {
        return 'Session: ' + this.sessionId + ' (Created: ' + this.createdAt + ')';
    }
}

// Demonstration
System.debug('Initial count: ' + SessionManager.getTotalInstancesCreated()); // 0

SessionManager session1 = new SessionManager();
System.debug('After session1: ' + SessionManager.getTotalInstancesCreated()); // 1

SessionManager session2 = new SessionManager('CUSTOM');
System.debug('After session2: ' + SessionManager.getTotalInstancesCreated()); // 2

List<SessionManager> sessions = new List<SessionManager>();
for (Integer i = 0; i < 3; i++) {
    sessions.add(new SessionManager());
}
System.debug('Final count: ' + SessionManager.getTotalInstancesCreated()); // 5`,
        keyLearning: "Static variables in constructors track global instance counts across all object creation.",
        examTip: "Instance counting questions test understanding of static variable lifecycle and constructor execution."
      },
      {
        number: 11,
        difficulty: 'beginner',
        question: "What's the difference between public, private, and global access modifiers in Apex?",
        answer: "public = accessible within namespace, private = within class only, global = accessible everywhere",
        explanation: "Access modifiers control visibility. Private is most restrictive (class only), public allows access within the same namespace, global allows access from anywhere including managed packages.",
        correctCode: `public class AccessModifierDemo {

    // Private - only this class can access
    private String internalData = 'secret';

    // Public - accessible within same namespace
    public String publicData = 'shared';

    // Global - accessible from anywhere (use sparingly)
    global String globalData = 'universal';

    // Private method - internal use only
    private void internalProcess() {
        System.debug('Internal processing: ' + this.internalData);
    }

    // Public method - namespace access
    public void processData() {
        internalProcess(); // Can call private method
        System.debug('Processing: ' + this.publicData);
    }

    // Global method - universal access
    global void globalProcess() {
        System.debug('Global processing: ' + this.globalData);
    }
}

// In same namespace:
AccessModifierDemo demo = new AccessModifierDemo();
System.debug(demo.publicData);  // Works
demo.processData();             // Works
// System.debug(demo.internalData); // COMPILATION ERROR - private

// From managed package or other namespace:
// Only global members would be accessible`,
        keyLearning: "Use private for internal implementation, public for namespace sharing, global only when necessary for external access.",
        examTip: "Access modifier questions test understanding of visibility scope. Global should be used sparingly."
      },
      {
        number: 12,
        difficulty: 'advanced',
        question: "How do you implement a singleton pattern in Apex to ensure only one instance exists?",
        answer: "Use a private constructor, static variable to hold the instance, and static method to get it",
        explanation: "Singleton pattern ensures only one instance exists throughout the transaction. Use static variable to store the single instance and control access through a static method.",
        correctCode: `public class ConfigurationManager {
    // Static variable to hold the single instance
    private static ConfigurationManager instance;

    // Instance variables
    private Map<String, String> settings;
    private DateTime lastUpdated;

    // Private constructor prevents external instantiation
    private ConfigurationManager() {
        this.settings = new Map<String, String>();
        this.lastUpdated = System.now();
        loadDefaultSettings();
    }

    // Static method to get the single instance
    public static ConfigurationManager getInstance() {
        if (instance == null) {
            instance = new ConfigurationManager();
        }
        return instance;
    }

    // Business methods
    public String getSetting(String key) {
        return this.settings.get(key);
    }

    public void setSetting(String key, String value) {
        this.settings.put(key, value);
        this.lastUpdated = System.now();
    }

    private void loadDefaultSettings() {
        this.settings.put('debug_mode', 'false');
        this.settings.put('timeout_seconds', '30');
        this.settings.put('max_records', '200');
    }

    public Integer getSettingsCount() {
        return this.settings.size();
    }
}

// Usage - always returns same instance
ConfigurationManager config1 = ConfigurationManager.getInstance();
ConfigurationManager config2 = ConfigurationManager.getInstance();

config1.setSetting('debug_mode', 'true');
System.debug(config2.getSetting('debug_mode')); // 'true' - same instance

System.debug(config1 === config2); // true - exact same object

// This would cause error:
// ConfigurationManager config3 = new ConfigurationManager(); // ERROR`,
        keyLearning: "Singleton pattern uses private constructor and static getInstance() method to ensure single instance per transaction.",
        examTip: "Singleton questions test understanding of instance control and static variable usage for shared state."
      },
      {
        number: 13,
        difficulty: 'intermediate',
        question: "Your class needs to work with different types of Salesforce objects. How do you make it generic?",
        answer: "Use SObject as parameter type and getSObjectType() for type-specific operations",
        explanation: "SObject is the base class for all Salesforce objects. Using SObject parameters makes your class work with any standard or custom object.",
        correctCode: `public class GenericRecordProcessor {

    public void processRecords(List<SObject> records) {
        if (records == null || records.isEmpty()) {
            return;
        }

        // Get object type for type-specific logic
        String objectType = records[0].getSObjectType().getDescribe().getName();
        System.debug('Processing ' + records.size() + ' ' + objectType + ' records');

        for (SObject record : records) {
            processIndividualRecord(record);
        }
    }

    private void processIndividualRecord(SObject record) {
        String objectName = record.getSObjectType().getDescribe().getName();

        // Type-specific processing
        if (objectName == 'Account') {
            processAccount((Account)record);
        } else if (objectName == 'Contact') {
            processContact((Contact)record);
        } else if (objectName == 'Opportunity') {
            processOpportunity((Opportunity)record);
        } else {
            processGenericRecord(record);
        }
    }

    private void processAccount(Account acc) {
        System.debug('Processing Account: ' + acc.Name);
        // Account-specific logic
    }

    private void processContact(Contact con) {
        System.debug('Processing Contact: ' + con.Name);
        // Contact-specific logic
    }

    private void processOpportunity(Opportunity opp) {
        System.debug('Processing Opportunity: ' + opp.Name);
        // Opportunity-specific logic
    }

    private void processGenericRecord(SObject record) {
        System.debug('Processing generic record: ' + record.Id);
        // Generic processing for any object type
    }
}

// Usage with different object types
GenericRecordProcessor processor = new GenericRecordProcessor();

List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 5];
processor.processRecords(accounts);

List<Contact> contacts = [SELECT Id, Name FROM Contact LIMIT 5];
processor.processRecords(contacts);`,
        keyLearning: "Use SObject for generic programming. Use getSObjectType() and casting for type-specific operations.",
        examTip: "Generic programming questions test understanding of SObject hierarchy and type checking patterns."
      },
      {
        number: 14,
        difficulty: 'advanced',
        question: "How do you implement a factory pattern to create different types of objects based on input?",
        answer: "Use a static factory method that returns different implementations based on parameters",
        explanation: "Factory pattern centralizes object creation logic. Use a static method that takes parameters and returns the appropriate object type, often using inheritance or interfaces.",
        correctCode: `// Base interface for all notification types
public interface NotificationService {
    void sendNotification(String message, String recipient);
    Boolean isAvailable();
}

// Email implementation
public class EmailNotificationService implements NotificationService {
    public void sendNotification(String message, String recipient) {
        System.debug('Sending email to ' + recipient + ': ' + message);
        // Email-specific logic
    }

    public Boolean isAvailable() {
        return true; // Email always available
    }
}

// SMS implementation
public class SMSNotificationService implements NotificationService {
    public void sendNotification(String message, String recipient) {
        System.debug('Sending SMS to ' + recipient + ': ' + message);
        // SMS-specific logic
    }

    public Boolean isAvailable() {
        // Check SMS service availability
        return System.now().hour() >= 8 && System.now().hour() <= 22;
    }
}

// Slack implementation
public class SlackNotificationService implements NotificationService {
    public void sendNotification(String message, String recipient) {
        System.debug('Sending Slack message to ' + recipient + ': ' + message);
        // Slack-specific logic
    }

    public Boolean isAvailable() {
        return true; // Slack always available
    }
}

// Factory class
public class NotificationFactory {

    // Factory method - creates appropriate notification service
    public static NotificationService createNotificationService(String type) {
        if (String.isBlank(type)) {
            throw new IllegalArgumentException('Notification type cannot be blank');
        }

        switch on type.toLowerCase() {
            when 'email' {
                return new EmailNotificationService();
            }
            when 'sms' {
                return new SMSNotificationService();
            }
            when 'slack' {
                return new SlackNotificationService();
            }
            when else {
                throw new UnsupportedOperationException('Unknown notification type: ' + type);
            }
        }
    }

    // Convenience method with fallback logic
    public static NotificationService createAvailableService(String preferredType) {
        try {
            NotificationService service = createNotificationService(preferredType);
            if (service.isAvailable()) {
                return service;
            }
        } catch (Exception e) {
            System.debug('Preferred service unavailable: ' + e.getMessage());
        }

        // Fallback to email
        return new EmailNotificationService();
    }
}

// Usage
NotificationService emailService = NotificationFactory.createNotificationService('email');
emailService.sendNotification('Welcome!', 'user@example.com');

NotificationService smsService = NotificationFactory.createNotificationService('sms');
if (smsService.isAvailable()) {
    smsService.sendNotification('Alert!', '+1234567890');
}

// With automatic fallback
NotificationService service = NotificationFactory.createAvailableService('sms');
service.sendNotification('Important message', 'recipient');`,
        keyLearning: "Factory pattern centralizes object creation. Use interfaces for consistent behavior across different implementations.",
        examTip: "Factory pattern questions test understanding of object creation strategies and polymorphism."
      },
      {
        number: 15,
        difficulty: 'beginner',
        question: "What's the purpose of the 'this' keyword in Apex?",
        answer: "Refers to the current instance of the class, used to differentiate between instance variables and parameters",
        explanation: "'this' explicitly refers to the current object. It's useful when parameter names match instance variable names or when you want to be explicit about accessing instance members.",
        correctCode: `public class Employee {
    private String name;
    private String department;
    private Integer salary;

    // Constructor with parameter names matching instance variables
    public Employee(String name, String department, Integer salary) {
        // Without 'this', you'd assign parameter to itself
        this.name = name;           // this.name = instance variable
        this.department = department; // name = parameter
        this.salary = salary;
    }

    // Method showing different uses of 'this'
    public void updateEmployee(String name, String department) {
        // Explicit reference to instance variables
        this.name = name;
        this.department = department;

        // Calling another method on this object
        this.validateEmployee();

        // Pass current object to another method
        EmployeeValidator.validate(this);
    }

    private void validateEmployee() {
        // 'this' is optional when no naming conflicts
        if (String.isBlank(name)) { // Could write this.name
            throw new IllegalArgumentException('Employee name cannot be blank');
        }
    }

    // Return current object for method chaining
    public Employee setSalary(Integer newSalary) {
        this.salary = newSalary;
        return this; // Return current object
    }

    public Employee setDepartment(String newDepartment) {
        this.department = newDepartment;
        return this;
    }
}

// Method chaining example
Employee emp = new Employee('John Doe', 'Sales', 50000);
emp.setSalary(55000).setDepartment('Marketing');`,
        keyLearning: "Use 'this' to resolve naming conflicts and for explicit instance member access. Also enables method chaining.",
        examTip: "'this' keyword questions test understanding of object reference and parameter vs instance variable disambiguation."
      },
      {
        number: 16,
        difficulty: 'intermediate',
        question: "How do you properly implement a class that handles exceptions and error logging?",
        answer: "Use try-catch blocks, custom exceptions, and proper logging patterns with different error levels",
        explanation: "Good error handling includes specific exception types, proper logging, and graceful failure modes. Always log enough information for debugging without exposing sensitive data.",
        correctCode: `public class CustomerDataService {

    // Custom exception for business logic errors
    public class CustomerDataException extends Exception {}

    public Boolean processCustomerData(List<Customer__c> customers) {
        if (customers == null || customers.isEmpty()) {
            System.debug(LoggingLevel.WARN, 'No customers provided for processing');
            return false;
        }

        Integer successCount = 0;
        Integer errorCount = 0;

        for (Customer__c customer : customers) {
            try {
                validateCustomer(customer);
                processIndividualCustomer(customer);
                successCount++;

            } catch (CustomerDataException e) {
                errorCount++;
                System.debug(LoggingLevel.ERROR, 'Business logic error for customer ' +
                    customer.Id + ': ' + e.getMessage());

            } catch (DmlException e) {
                errorCount++;
                System.debug(LoggingLevel.ERROR, 'Database error for customer ' +
                    customer.Id + ': ' + e.getDmlMessage(0));

            } catch (Exception e) {
                errorCount++;
                System.debug(LoggingLevel.ERROR, 'Unexpected error for customer ' +
                    customer.Id + ': ' + e.getMessage() + ' at line ' + e.getLineNumber());
            }
        }

        System.debug(LoggingLevel.INFO, 'Processing complete. Success: ' +
            successCount + ', Errors: ' + errorCount);

        return errorCount == 0;
    }

    private void validateCustomer(Customer__c customer) {
        if (customer == null) {
            throw new CustomerDataException('Customer record is null');
        }

        if (String.isBlank(customer.Name)) {
            throw new CustomerDataException('Customer name is required');
        }

        if (String.isBlank(customer.Email__c) || !customer.Email__c.contains('@')) {
            throw new CustomerDataException('Valid email is required');
        }
    }

    private void processIndividualCustomer(Customer__c customer) {
        try {
            // Simulate processing
            customer.Last_Processed__c = System.now();
            customer.Status__c = 'Processed';

            update customer;

        } catch (DmlException e) {
            System.debug(LoggingLevel.ERROR, 'Failed to update customer: ' + e.getMessage());
            throw e; // Re-throw for caller to handle
        }
    }

    // Safe method that never throws exceptions
    public CustomerProcessingResult safePprocessCustomers(List<Customer__c> customers) {
        CustomerProcessingResult result = new CustomerProcessingResult();

        try {
            Boolean success = processCustomerData(customers);
            result.success = success;
            result.message = success ? 'All customers processed' : 'Some errors occurred';

        } catch (Exception e) {
            result.success = false;
            result.message = 'Processing failed: ' + e.getMessage();
            result.errorDetails = e.getStackTraceString();
        }

        return result;
    }

    // Result wrapper class
    public class CustomerProcessingResult {
        public Boolean success;
        public String message;
        public String errorDetails;
    }
}`,
        keyLearning: "Use specific exception types, proper logging levels, and safe wrapper methods for robust error handling.",
        examTip: "Exception handling questions test understanding of try-catch patterns, custom exceptions, and error recovery strategies."
      },
      {
        number: 17,
        difficulty: 'advanced',
        question: "How do you implement a class that can be used in both synchronous and asynchronous contexts?",
        answer: "Design with context awareness and use appropriate patterns for governor limits and state management",
        explanation: "Classes used in async contexts need to handle different governor limits, potential serialization requirements, and state management differently than synchronous contexts.",
        correctCode: `public class DataProcessor {

    // Context-aware processing
    public enum ProcessingContext {
        SYNCHRONOUS,
        FUTURE,
        BATCH,
        QUEUEABLE
    }

    private ProcessingContext context;
    private Integer batchSize;

    // Constructor that determines context
    public DataProcessor() {
        this.context = determineContext();
        this.batchSize = getBatchSizeForContext();
    }

    public DataProcessor(ProcessingContext explicitContext) {
        this.context = explicitContext;
        this.batchSize = getBatchSizeForContext();
    }

    // Main processing method - context aware
    public ProcessingResult processRecords(List<SObject> records) {
        ProcessingResult result = new ProcessingResult();
        result.context = this.context;
        result.startTime = System.now();

        try {
            switch on this.context {
                when SYNCHRONOUS {
                    result = processSynchronously(records);
                }
                when FUTURE {
                    result = processForFuture(records);
                }
                when BATCH {
                    result = processForBatch(records);
                }
                when QUEUEABLE {
                    result = processForQueueable(records);
                }
            }

        } catch (Exception e) {
            result.success = false;
            result.errorMessage = e.getMessage();
        }

        result.endTime = System.now();
        return result;
    }

    // Synchronous processing - stricter limits
    private ProcessingResult processSynchronously(List<SObject> records) {
        ProcessingResult result = new ProcessingResult();

        // Limit records to avoid timeouts
        List<SObject> limitedRecords = records.size() > 100 ?
            new List<SObject>(records).subList(0, 100) : records;

        result.recordsProcessed = processRecordsBatch(limitedRecords);
        result.success = true;

        return result;
    }

    // Future method processing - higher limits
    private ProcessingResult processForFuture(List<SObject> records) {
        ProcessingResult result = new ProcessingResult();

        // Can handle more records
        result.recordsProcessed = processRecordsBatch(records);
        result.success = true;

        return result;
    }

    // Batch processing - highest limits
    private ProcessingResult processForBatch(List<SObject> records) {
        ProcessingResult result = new ProcessingResult();

        // Process in optimal batch sizes
        Integer processed = 0;
        for (Integer i = 0; i < records.size(); i += this.batchSize) {
            Integer endIndex = Math.min(i + this.batchSize, records.size());
            List<SObject> batch = records.subList(i, endIndex);
            processed += processRecordsBatch(batch);
        }

        result.recordsProcessed = processed;
        result.success = true;

        return result;
    }

    // Queueable processing - chainable
    private ProcessingResult processForQueueable(List<SObject> records) {
        ProcessingResult result = new ProcessingResult();

        result.recordsProcessed = processRecordsBatch(records);
        result.success = true;
        result.canChain = records.size() > 1000; // Indicate if chaining needed

        return result;
    }

    // Core processing logic
    private Integer processRecordsBatch(List<SObject> records) {
        // Actual processing logic here
        for (SObject record : records) {
            // Process individual record
        }
        return records.size();
    }

    // Context detection
    private ProcessingContext determineContext() {
        if (System.isFuture()) {
            return ProcessingContext.FUTURE;
        } else if (System.isBatch()) {
            return ProcessingContext.BATCH;
        } else if (System.isQueueable()) {
            return ProcessingContext.QUEUEABLE;
        } else {
            return ProcessingContext.SYNCHRONOUS;
        }
    }

    // Context-appropriate batch sizes
    private Integer getBatchSizeForContext() {
        switch on this.context {
            when SYNCHRONOUS { return 50; }
            when FUTURE { return 100; }
            when BATCH { return 200; }
            when QUEUEABLE { return 150; }
            when else { return 50; }
        }
    }

    // Result class
    public class ProcessingResult {
        public Boolean success;
        public String errorMessage;
        public Integer recordsProcessed;
        public ProcessingContext context;
        public DateTime startTime;
        public DateTime endTime;
        public Boolean canChain;
    }
}

// Usage in different contexts
DataProcessor processor = new DataProcessor(); // Auto-detects context
ProcessingResult result = processor.processRecords(myRecords);`,
        keyLearning: "Context-aware classes adapt behavior based on execution environment. Use different strategies for different governor limit contexts.",
        examTip: "Async-aware design questions test understanding of governor limit differences and context detection patterns."
      },
      {
        number: 18,
        difficulty: 'intermediate',
        question: "How do you implement proper equality and comparison for custom objects?",
        answer: "Override equals() and hashCode() methods, implement Comparable interface for sorting",
        explanation: "Custom equality allows objects to be properly compared and used in Sets/Maps. Proper hashCode ensures correct behavior in collections.",
        correctCode: `public class Product implements Comparable {
    public String name;
    public String sku;
    public Decimal price;
    public String category;

    public Product(String name, String sku, Decimal price, String category) {
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.category = category;
    }

    // Override equals for proper object comparison
    public Boolean equals(Object obj) {
        if (this === obj) return true; // Same reference
        if (obj == null) return false;
        if (!(obj instanceof Product)) return false;

        Product other = (Product) obj;

        // Products are equal if SKU matches (business rule)
        return this.sku != null && this.sku.equals(other.sku);
    }

    // Must override hashCode when overriding equals
    public Integer hashCode() {
        return this.sku != null ? this.sku.hashCode() : 0;
    }

    // Implement Comparable for sorting
    public Integer compareTo(Object obj) {
        if (!(obj instanceof Product)) {
            throw new ClassCastException('Cannot compare Product to ' + obj);
        }

        Product other = (Product) obj;

        // Primary sort: category
        Integer categoryComparison = compareStrings(this.category, other.category);
        if (categoryComparison != 0) {
            return categoryComparison;
        }

        // Secondary sort: price (descending)
        if (this.price != other.price) {
            return this.price > other.price ? -1 : 1;
        }

        // Tertiary sort: name
        return compareStrings(this.name, other.name);
    }

    // Helper method for string comparison
    private Integer compareStrings(String str1, String str2) {
        if (str1 == null && str2 == null) return 0;
        if (str1 == null) return 1;
        if (str2 == null) return -1;
        return str1.compareTo(str2);
    }

    // toString for debugging
    public override String toString() {
        return 'Product{name=' + name + ', sku=' + sku + ', price=' + price + '}';
    }
}

// Usage examples
Product product1 = new Product('Widget A', 'WGT-001', 19.99, 'Electronics');
Product product2 = new Product('Widget A Deluxe', 'WGT-001', 29.99, 'Electronics');
Product product3 = new Product('Gadget B', 'GDT-002', 15.50, 'Electronics');

// Equality testing
System.debug(product1.equals(product2)); // true - same SKU
System.debug(product1.equals(product3)); // false - different SKU

// Set usage - duplicates removed based on equals/hashCode
Set<Product> productSet = new Set<Product>{product1, product2, product3};
System.debug('Set size: ' + productSet.size()); // 2 (product1 and product2 are equal)

// List sorting
List<Product> products = new List<Product>{product3, product1, product2};
products.sort(); // Uses compareTo method
for (Product p : products) {
    System.debug(p.toString());
}`,
        keyLearning: "Override equals() and hashCode() together. Implement Comparable for custom sorting. Use business logic for equality.",
        examTip: "Object comparison questions test understanding of equals/hashCode contract and sorting implementation."
      },
      {
        number: 19,
        difficulty: 'advanced',
        question: "Design a class that implements the observer pattern for real-time notifications.",
        answer: "Use interfaces for observers, maintain a list of observers, and notify them when events occur",
        explanation: "Observer pattern allows objects to be notified of changes without tight coupling. Use interfaces for flexibility and lists to manage multiple observers.",
        correctCode: `// Observer interface
public interface InventoryObserver {
    void onInventoryChanged(String productSku, Integer oldQuantity, Integer newQuantity);
    void onLowStock(String productSku, Integer currentQuantity, Integer threshold);
    void onOutOfStock(String productSku);
}

// Concrete observer implementations
public class EmailNotificationObserver implements InventoryObserver {
    private String emailAddress;

    public EmailNotificationObserver(String email) {
        this.emailAddress = email;
    }

    public void onInventoryChanged(String productSku, Integer oldQuantity, Integer newQuantity) {
        System.debug('Email: Inventory changed for ' + productSku +
            ' from ' + oldQuantity + ' to ' + newQuantity);
    }

    public void onLowStock(String productSku, Integer currentQuantity, Integer threshold) {
        System.debug('Email Alert: Low stock for ' + productSku +
            ' (' + currentQuantity + ' remaining, threshold: ' + threshold + ')');
    }

    public void onOutOfStock(String productSku) {
        System.debug('URGENT Email: ' + productSku + ' is out of stock!');
    }
}

public class SlackNotificationObserver implements InventoryObserver {
    private String channel;

    public SlackNotificationObserver(String slackChannel) {
        this.channel = slackChannel;
    }

    public void onInventoryChanged(String productSku, Integer oldQuantity, Integer newQuantity) {
        // Only notify on significant changes
        if (Math.abs(newQuantity - oldQuantity) >= 10) {
            System.debug('Slack ' + channel + ': Significant inventory change for ' + productSku);
        }
    }

    public void onLowStock(String productSku, Integer currentQuantity, Integer threshold) {
        System.debug('Slack ' + channel + ': ⚠️ Low stock alert for ' + productSku);
    }

    public void onOutOfStock(String productSku) {
        System.debug('Slack ' + channel + ': 🚨 OUT OF STOCK: ' + productSku);
    }
}

// Subject class that manages observers
public class InventoryManager {
    private Map<String, Integer> inventory;
    private Map<String, Integer> lowStockThresholds;
    private List<InventoryObserver> observers;

    public InventoryManager() {
        this.inventory = new Map<String, Integer>();
        this.lowStockThresholds = new Map<String, Integer>();
        this.observers = new List<InventoryObserver>();
    }

    // Observer management
    public void addObserver(InventoryObserver observer) {
        if (observer != null && !this.observers.contains(observer)) {
            this.observers.add(observer);
        }
    }

    public void removeObserver(InventoryObserver observer) {
        this.observers.remove(this.observers.indexOf(observer));
    }

    // Business methods that trigger notifications
    public void updateInventory(String productSku, Integer newQuantity) {
        Integer oldQuantity = this.inventory.get(productSku);
        if (oldQuantity == null) oldQuantity = 0;

        this.inventory.put(productSku, newQuantity);

        // Notify all observers
        notifyInventoryChanged(productSku, oldQuantity, newQuantity);

        // Check for stock levels
        checkStockLevels(productSku, newQuantity);
    }

    public void setLowStockThreshold(String productSku, Integer threshold) {
        this.lowStockThresholds.put(productSku, threshold);
    }

    // Notification methods
    private void notifyInventoryChanged(String productSku, Integer oldQuantity, Integer newQuantity) {
        for (InventoryObserver observer : this.observers) {
            try {
                observer.onInventoryChanged(productSku, oldQuantity, newQuantity);
            } catch (Exception e) {
                System.debug('Error notifying observer: ' + e.getMessage());
            }
        }
    }

    private void checkStockLevels(String productSku, Integer currentQuantity) {
        if (currentQuantity == 0) {
            notifyOutOfStock(productSku);
        } else {
            Integer threshold = this.lowStockThresholds.get(productSku);
            if (threshold != null && currentQuantity <= threshold) {
                notifyLowStock(productSku, currentQuantity, threshold);
            }
        }
    }

    private void notifyLowStock(String productSku, Integer currentQuantity, Integer threshold) {
        for (InventoryObserver observer : this.observers) {
            try {
                observer.onLowStock(productSku, currentQuantity, threshold);
            } catch (Exception e) {
                System.debug('Error notifying observer: ' + e.getMessage());
            }
        }
    }

    private void notifyOutOfStock(String productSku) {
        for (InventoryObserver observer : this.observers) {
            try {
                observer.onOutOfStock(productSku);
            } catch (Exception e) {
                System.debug('Error notifying observer: ' + e.getMessage());
            }
        }
    }

    // Utility methods
    public Integer getCurrentInventory(String productSku) {
        return this.inventory.get(productSku);
    }
}

// Usage example
InventoryManager inventory = new InventoryManager();

// Add observers
inventory.addObserver(new EmailNotificationObserver('manager@company.com'));
inventory.addObserver(new SlackNotificationObserver('#inventory-alerts'));

// Set thresholds and update inventory
inventory.setLowStockThreshold('WIDGET-001', 10);
inventory.updateInventory('WIDGET-001', 100); // Normal stock
inventory.updateInventory('WIDGET-001', 8);   // Low stock alert
inventory.updateInventory('WIDGET-001', 0);   // Out of stock alert`,
        keyLearning: "Observer pattern uses interfaces for loose coupling and list management for multiple observers. Handle observer exceptions gracefully.",
        examTip: "Observer pattern questions test understanding of design patterns, interfaces, and event-driven programming."
      },
      {
        number: 20,
        difficulty: 'expert',
        question: "Design a comprehensive class hierarchy for a Salesforce integration that handles multiple data sources with different authentication and processing requirements.",
        answer: "Use abstract base class with template method pattern, interfaces for contracts, and strategy pattern for authentication",
        explanation: "Complex integration scenarios require flexible architecture using multiple design patterns. Abstract classes provide common structure while interfaces ensure contracts are met.",
        correctCode: `// Base interface for all data sources
public interface DataSource {
    Boolean isConnected();
    List<SObject> fetchData(Map<String, Object> parameters);
    void disconnect();
}

// Authentication strategy interface
public interface AuthenticationStrategy {
    Boolean authenticate(Map<String, String> credentials);
    String getAuthToken();
    Boolean isTokenValid();
}

// OAuth implementation
public class OAuthStrategy implements AuthenticationStrategy {
    private String accessToken;
    private DateTime tokenExpiry;

    public Boolean authenticate(Map<String, String> credentials) {
        // OAuth flow implementation
        this.accessToken = 'oauth_token_' + System.currentTimeMillis();
        this.tokenExpiry = System.now().addHours(1);
        return true;
    }

    public String getAuthToken() {
        return this.accessToken;
    }

    public Boolean isTokenValid() {
        return this.accessToken != null && System.now() < this.tokenExpiry;
    }
}

// API Key implementation
public class ApiKeyStrategy implements AuthenticationStrategy {
    private String apiKey;

    public Boolean authenticate(Map<String, String> credentials) {
        this.apiKey = credentials.get('api_key');
        return String.isNotBlank(this.apiKey);
    }

    public String getAuthToken() {
        return this.apiKey;
    }

    public Boolean isTokenValid() {
        return String.isNotBlank(this.apiKey);
    }
}

// Abstract base class - Template Method Pattern
public abstract class AbstractDataSource implements DataSource {
    protected AuthenticationStrategy authStrategy;
    protected String sourceName;
    protected Boolean connected = false;
    protected Map<String, String> configuration;

    public AbstractDataSource(String name, AuthenticationStrategy auth) {
        this.sourceName = name;
        this.authStrategy = auth;
        this.configuration = new Map<String, String>();
    }

    // Template method - defines the algorithm structure
    public final List<SObject> fetchData(Map<String, Object> parameters) {
        List<SObject> results = new List<SObject>();

        try {
            // Step 1: Validate connection
            if (!isConnected()) {
                connect();
            }

            // Step 2: Validate authentication
            if (!this.authStrategy.isTokenValid()) {
                reAuthenticate();
            }

            // Step 3: Validate parameters
            validateParameters(parameters);

            // Step 4: Transform parameters (hook method)
            Map<String, Object> transformedParams = transformParameters(parameters);

            // Step 5: Fetch data (abstract method - subclasses implement)
            results = doFetchData(transformedParams);

            // Step 6: Transform results (hook method)
            results = transformResults(results);

            // Step 7: Log success
            logOperation('SUCCESS', results.size() + ' records fetched');

        } catch (Exception e) {
            logOperation('ERROR', 'Fetch failed: ' + e.getMessage());
            handleError(e);
            throw e;
        }

        return results;
    }

    // Abstract methods - subclasses must implement
    protected abstract List<SObject> doFetchData(Map<String, Object> parameters);
    protected abstract void validateParameters(Map<String, Object> parameters);

    // Hook methods - subclasses can override
    protected virtual Map<String, Object> transformParameters(Map<String, Object> parameters) {
        return parameters; // Default: no transformation
    }

    protected virtual List<SObject> transformResults(List<SObject> results) {
        return results; // Default: no transformation
    }

    protected virtual void handleError(Exception e) {
        System.debug(LoggingLevel.ERROR, 'Error in ' + this.sourceName + ': ' + e.getMessage());
    }

    // Common methods
    public Boolean isConnected() {
        return this.connected;
    }

    private void connect() {
        this.connected = true;
        logOperation('INFO', 'Connected to ' + this.sourceName);
    }

    public void disconnect() {
        this.connected = false;
        logOperation('INFO', 'Disconnected from ' + this.sourceName);
    }

    private void reAuthenticate() {
        Map<String, String> credentials = getStoredCredentials();
        if (!this.authStrategy.authenticate(credentials)) {
            throw new AuthenticationException('Re-authentication failed for ' + this.sourceName);
        }
    }

    protected virtual Map<String, String> getStoredCredentials() {
        // Default implementation - override in subclasses
        return new Map<String, String>();
    }

    private void logOperation(String level, String message) {
        System.debug('[' + this.sourceName + '] ' + level + ': ' + message);
    }

    // Custom exception
    public class AuthenticationException extends Exception {}
}

// Concrete implementation for REST API
public class RestApiDataSource extends AbstractDataSource {
    private String endpoint;

    public RestApiDataSource(String name, String apiEndpoint, AuthenticationStrategy auth) {
        super(name, auth);
        this.endpoint = apiEndpoint;
    }

    protected override List<SObject> doFetchData(Map<String, Object> parameters) {
        // REST API specific implementation
        HttpRequest req = new HttpRequest();
        req.setEndpoint(this.endpoint);
        req.setMethod('GET');
        req.setHeader('Authorization', 'Bearer ' + this.authStrategy.getAuthToken());

        // Add query parameters
        String queryParams = buildQueryString(parameters);
        if (String.isNotBlank(queryParams)) {
            req.setEndpoint(this.endpoint + '?' + queryParams);
        }

        Http http = new Http();
        HttpResponse response = http.send(req);

        if (response.getStatusCode() == 200) {
            return parseJsonResponse(response.getBody());
        } else {
            throw new CalloutException('API call failed: ' + response.getStatus());
        }
    }

    protected override void validateParameters(Map<String, Object> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            throw new IllegalArgumentException('Parameters cannot be null or empty');
        }

        // REST API specific validations
        if (!parameters.containsKey('limit')) {
            parameters.put('limit', 100); // Default limit
        }
    }

    protected override Map<String, Object> transformParameters(Map<String, Object> parameters) {
        Map<String, Object> transformed = new Map<String, Object>(parameters);

        // Convert Salesforce field names to API field names
        if (transformed.containsKey('LastModifiedDate')) {
            transformed.put('updated_after', transformed.remove('LastModifiedDate'));
        }

        return transformed;
    }

    private String buildQueryString(Map<String, Object> parameters) {
        List<String> parts = new List<String>();
        for (String key : parameters.keySet()) {
            parts.add(key + '=' + String.valueOf(parameters.get(key)));
        }
        return String.join(parts, '&');
    }

    private List<SObject> parseJsonResponse(String jsonBody) {
        // JSON parsing logic here
        List<SObject> results = new List<SObject>();
        // ... parsing implementation
        return results;
    }
}

// Concrete implementation for Database
public class DatabaseDataSource extends AbstractDataSource {
    private String connectionString;

    public DatabaseDataSource(String name, String connString, AuthenticationStrategy auth) {
        super(name, auth);
        this.connectionString = connString;
    }

    protected override List<SObject> doFetchData(Map<String, Object> parameters) {
        // Database specific implementation
        String query = buildSqlQuery(parameters);

        // Execute query (pseudo-code - actual implementation would vary)
        List<SObject> results = executeQuery(query);

        return results;
    }

    protected override void validateParameters(Map<String, Object> parameters) {
        // Database specific validations
        if (!parameters.containsKey('table_name')) {
            throw new IllegalArgumentException('Table name is required');
        }
    }

    private String buildSqlQuery(Map<String, Object> parameters) {
        String tableName = String.valueOf(parameters.get('table_name'));
        String whereClause = String.valueOf(parameters.get('where_clause'));

        String query = 'SELECT * FROM ' + tableName;
        if (String.isNotBlank(whereClause)) {
            query += ' WHERE ' + whereClause;
        }

        return query;
    }

    private List<SObject> executeQuery(String query) {
        // Database execution logic
        return new List<SObject>();
    }
}

// Usage example
public class IntegrationService {
    private Map<String, DataSource> dataSources;

    public IntegrationService() {
        this.dataSources = new Map<String, DataSource>();
        initializeDataSources();
    }

    private void initializeDataSources() {
        // Create different data sources with appropriate authentication
        AuthenticationStrategy oauthStrategy = new OAuthStrategy();
        AuthenticationStrategy apiKeyStrategy = new ApiKeyStrategy();

        RestApiDataSource restApi = new RestApiDataSource(
            'External API',
            'https://api.external.com/v1/data',
            oauthStrategy
        );

        DatabaseDataSource database = new DatabaseDataSource(
            'Legacy Database',
            'jdbc:mysql://localhost:3306/legacy',
            apiKeyStrategy
        );

        this.dataSources.put('api', restApi);
        this.dataSources.put('database', database);
    }

    public List<SObject> fetchFromSource(String sourceName, Map<String, Object> parameters) {
        DataSource source = this.dataSources.get(sourceName);
        if (source == null) {
            throw new IllegalArgumentException('Unknown data source: ' + sourceName);
        }

        return source.fetchData(parameters);
    }
}`,
        keyLearning: "Complex architectures use multiple patterns: Template Method for structure, Strategy for authentication, Abstract classes for shared behavior.",
        examTip: "Architecture questions test understanding of design patterns, inheritance, interfaces, and separation of concerns."
      }
    ]
  },

  'soql-and-dml': {
    title: 'SOQL and DML',
    overview: 'Master Salesforce Object Query Language and database operations. SOQL retrieves records from Salesforce, DML operations modify them.',
    codeExamples: [
      {
        title: 'Basic SOQL Queries',
        code: `public class QueryDemo {
    public void basicQueries() {
        // ✅ WHAT: Basic SELECT with specific fields
        List<Account> accounts = [
            SELECT Id, Name, Type, Industry
            FROM Account
            WHERE Type = 'Customer'
            LIMIT 100
        ];

        // ✅ WHAT: Query with relationships (lookup)
        List<Contact> contacts = [
            SELECT Id, Name, Email,
                   Account.Name, Account.Industry
            FROM Contact
            WHERE Account.Type = 'Customer'
        ];

        // ✅ WHAT: Query with child relationships
        List<Account> accountsWithContacts = [
            SELECT Id, Name,
                   (SELECT Id, Name, Email FROM Contacts)
            FROM Account
            WHERE Id IN :accountIds
        ];
    }
}`,
        explanation: 'SOQL syntax is similar to SQL but with Salesforce-specific features like relationship queries. Always specify needed fields explicitly and use LIMIT to prevent governor limit issues.'
      }
    ],
    practiceQuestions: [
      // Practice questions for SOQL...
    ]
  },

  'triggers-and-automation': {
    title: 'Triggers and Automation',
    overview: 'Master Apex triggers and automation patterns. Triggers execute automatically when records are inserted, updated, or deleted.',
    codeExamples: [
      {
        title: 'Trigger Structure',
        code: `trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    // ✅ WHAT: Single trigger handles multiple events
    // ✅ WHY: Better organization and predictable execution order

    if (Trigger.isBefore) {
        if (Trigger.isInsert || Trigger.isUpdate) {
            AccountTriggerHandler.validateAccounts(Trigger.new);
        }
    }

    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            AccountTriggerHandler.createDefaultContacts(Trigger.new);
        }

        if (Trigger.isUpdate) {
            AccountTriggerHandler.updateRelatedOpportunities(
                Trigger.new,
                Trigger.oldMap
            );
        }
    }
}`,
        explanation: 'Use a single trigger per object with multiple events. Delegate logic to handler classes for better organization and testability.'
      }
    ],
    practiceQuestions: [
      // Practice questions for Triggers...
    ]
  },

  'asynchronous-apex': {
    title: 'Asynchronous Apex',
    overview: 'Master asynchronous processing with Future, Batch, Queueable, and Schedulable Apex for handling large data volumes.',
    codeExamples: [
      {
        title: 'Future Methods',
        code: `public class AsyncDemo {
    // ✅ WHAT: Future method for async processing
    @future
    public static void processAccountsAsync(Set<Id> accountIds) {
        // ✅ WHAT: Query records in the async method
        List<Account> accounts = [
            SELECT Id, Name, Industry
            FROM Account
            WHERE Id IN :accountIds
        ];

        for (Account acc : accounts) {
            // Long-running processing
            acc.Description = 'Processed async on ' + System.now();
        }

        update accounts;
    }
}`,
        explanation: 'Future methods run asynchronously and must be static. They can only accept primitive types and collections of primitives as parameters.'
      }
    ],
    practiceQuestions: [
      // Practice questions for Async Apex...
    ]
  },

  'testing-and-debugging': {
    title: 'Testing and Debugging',
    overview: 'Master unit testing, test data creation, and test automation in Apex. Proper testing ensures code quality and prevents regressions.',
    codeExamples: [
      {
        title: 'Basic Test Structure',
        code: `@IsTest
public class AccountProcessorTest {

    @TestSetup
    static void createTestData() {
        // ✅ WHAT: Test data created once for all test methods
        List<Account> testAccounts = new List<Account>();
        for (Integer i = 0; i < 10; i++) {
            testAccounts.add(new Account(
                Name = 'Test Account ' + i,
                Type = 'Customer',
                Industry = 'Technology'
            ));
        }
        insert testAccounts;
    }

    @IsTest
    static void testAccountProcessing() {
        // ✅ WHAT: Query test data
        List<Account> accounts = [SELECT Id, Name FROM Account];

        Test.startTest();
        // ✅ WHAT: Execute code under test
        AccountProcessor processor = new AccountProcessor('Test Processor', 20);
        processor.processAccounts(accounts);
        Test.stopTest();

        // ✅ WHAT: Verify results
        List<Account> processedAccounts = [
            SELECT Id, Last_Processed_Date__c
            FROM Account
        ];

        for (Account acc : processedAccounts) {
            System.assertNotEquals(null, acc.Last_Processed_Date__c,
                'Account should have processing date');
        }
    }
}`,
        explanation: 'Use @TestSetup for common test data, Test.startTest()/stopTest() to reset governor limits, and System.assert methods to verify results.'
      }
    ],
    practiceQuestions: [
      // Practice questions for Testing...
    ]
  }
};