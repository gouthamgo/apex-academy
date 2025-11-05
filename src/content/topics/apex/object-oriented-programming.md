---
title: "Object-Oriented Programming in Apex"
section: "apex"
order: 6
difficulty: "intermediate"
readTime: "35 min"
description: "Master object-oriented programming concepts in Apex including classes, objects, inheritance, interfaces, and polymorphism with comprehensive examples."
overview: "Learn how to design and implement robust, maintainable code using OOP principles including encapsulation, inheritance, polymorphism, and abstraction."
concepts: ["classes", "objects", "inheritance", "interfaces", "polymorphism", "encapsulation", "abstract-classes", "constructors"]
prerequisites: ["variables-and-data-types", "control-flow-and-logic", "collections-deep-dive"]
relatedTopics: ["exception-handling", "soql-fundamentals"]
lastUpdated: "2025-01-15"
examWeight: "high"
---

# Core Concepts

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around objects and classes. Mastering OOP is essential for building scalable, maintainable Salesforce applications.

## Understanding OOP

Object-Oriented Programming provides four key principles:
- **Encapsulation**: Bundle data and methods that operate on that data
- **Inheritance**: Reuse and extend existing code
- **Polymorphism**: One interface, multiple implementations
- **Abstraction**: Hide complex implementation details

**Key Principles:**
- **Modularity**: Break complex problems into manageable pieces
- **Reusability**: Write code once, use it many times
- **Maintainability**: Changes in one place don't break others
- **Testability**: Isolated components are easier to test

## OOP Building Blocks

### Classes and Objects
- **Class**: Blueprint or template for creating objects
- **Object**: Instance of a class with specific values
- **Fields**: Variables that hold object state
- **Methods**: Functions that define object behavior

### Access Modifiers
- **public**: Accessible from anywhere
- **private**: Only within the class
- **protected**: Within class and subclasses
- **global**: Accessible across namespaces

---

# Code Examples

## Classes and Objects

The foundation of object-oriented programming.

```apex
public class BankAccount {
    // ^^^^^^^^^^^^^^^^^^
    // CLASS DECLARATION: public keyword makes it accessible
    // → Classes are blueprints for creating objects
    // 💡 NAMING: Use PascalCase for class names

    // Instance variables (fields)
    private String accountNumber;
    private String accountHolder;
    private Decimal balance;
    // ^^^^^^^^^^
    // PRIVATE FIELDS: Encapsulated data
    // → Only accessible within this class
    // ✅ ENCAPSULATION: Protect internal state

    // Constructor - no return type, same name as class
    public BankAccount(String accountNumber, String accountHolder) {
        // ^^^^^^^^^^^^^
        // CONSTRUCTOR: Called when creating new instance
        // → Initializes object state
        // 💡 PURPOSE: Set up initial values

        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = 0;
        // ^^^^
        // THIS KEYWORD: Refers to current instance
        // → Distinguishes instance variable from parameter
    }

    // Overloaded constructor
    public BankAccount(String accountNumber, String accountHolder, Decimal initialBalance) {
        // ^^^^^^^^^^^^^^^^^^^
        // CONSTRUCTOR OVERLOADING: Multiple constructors
        // → Different parameter combinations
        // 💡 FLEXIBILITY: Various ways to create objects

        this(accountNumber, accountHolder); // Call other constructor
        this.balance = initialBalance;
    }

    // Public methods (behavior)
    public void deposit(Decimal amount) {
        // ^^^^^^^^^^^
        // PUBLIC METHOD: Accessible from outside class
        // → Defines object behavior
        // ✅ INTERFACE: How others interact with object

        if (amount <= 0) {
            throw new IllegalArgumentException('Deposit amount must be positive');
        }

        this.balance += amount;
        System.debug('Deposited $' + amount + '. New balance: $' + this.balance);
    }

    public void withdraw(Decimal amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException('Withdrawal amount must be positive');
        }

        if (amount > this.balance) {
            throw new InsufficientFundsException('Insufficient funds. Balance: $' + this.balance);
        }

        this.balance -= amount;
        System.debug('Withdrew $' + amount + '. New balance: $' + this.balance);
    }

    // Getter method (accessor)
    public Decimal getBalance() {
        return this.balance;
        // ^^^^^^^^^^^^^^^^^^^
        // GETTER: Controlled access to private field
        // → Encapsulation: Read-only access
        // 💡 SECURITY: Prevents direct modification
    }

    // Getter with business logic
    public String getAccountInfo() {
        return 'Account: ' + this.accountNumber +
               ', Holder: ' + this.accountHolder +
               ', Balance: $' + this.balance;
    }

    // Setter method (mutator)
    public void setAccountHolder(String newHolder) {
        // ^^^^^^^^^^
        // SETTER: Controlled modification of private field
        // → Can add validation logic
        // ✅ VALIDATION: Ensure data integrity

        if (String.isBlank(newHolder)) {
            throw new IllegalArgumentException('Account holder cannot be blank');
        }

        this.accountHolder = newHolder;
    }

    // Private helper method
    private void logTransaction(String type, Decimal amount) {
        // ^^^^^^^
        // PRIVATE METHOD: Internal implementation detail
        // → Not exposed to external callers
        // 💡 ENCAPSULATION: Hide complexity

        System.debug('[' + DateTime.now() + '] ' + type + ': $' + amount);
    }

    // Custom exception
    public class InsufficientFundsException extends Exception {}
}

// USING THE CLASS
public class BankAccountExample {

    public static void demonstrateClasses() {
        // Create object (instantiate class)
        BankAccount myAccount = new BankAccount('123456', 'John Doe');
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // OBJECT CREATION: new keyword calls constructor
        // → Creates instance with specific values
        // 💡 INSTANCE: Each object has its own state

        // Use object methods
        myAccount.deposit(1000);
        myAccount.withdraw(250);

        Decimal currentBalance = myAccount.getBalance();
        System.debug('Current balance: $' + currentBalance);

        // Create another independent object
        BankAccount savingsAccount = new BankAccount('789012', 'Jane Smith', 5000);
        // ^^^^^^^^^^^^^^^^^^^^^^
        // INDEPENDENT INSTANCE: Different object, different state
        // → Changes to myAccount don't affect savingsAccount
    }
}
```

## Inheritance

Reuse and extend existing classes.

```apex
// Base class (parent/superclass)
public virtual class Vehicle {
    // ^^^^^^^
    // VIRTUAL KEYWORD: Allows inheritance and method override
    // → Subclasses can extend this class
    // 💡 DESIGN: Plan for extension

    protected String make;
    protected String model;
    protected Integer year;
    // ^^^^^^^^^
    // PROTECTED: Accessible in this class and subclasses
    // → Not accessible outside inheritance hierarchy
    // ✅ INHERITANCE: Share with child classes

    public Vehicle(String make, String model, Integer year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    // Virtual method can be overridden
    public virtual String getDescription() {
        return year + ' ' + make + ' ' + model;
    }

    // Virtual method
    public virtual Decimal calculateInsurance() {
        return 500; // Base insurance cost
    }

    // Non-virtual method cannot be overridden
    public String getVIN() {
        return 'VIN-' + make + '-' + year;
    }
}

// Derived class (child/subclass)
public class Car extends Vehicle {
    // ^^^^^^^^^^^^^^^
    // EXTENDS: Inherit from Vehicle
    // → Gets all fields and methods from Vehicle
    // ✅ REUSE: Don't repeat code

    private Integer numDoors;
    private String bodyStyle;

    // Constructor must call super()
    public Car(String make, String model, Integer year, Integer numDoors, String bodyStyle) {
        super(make, model, year);
        // ^^^^^
        // SUPER(): Call parent constructor
        // → Must be first line in constructor
        // 💡 INITIALIZATION: Set up inherited fields

        this.numDoors = numDoors;
        this.bodyStyle = bodyStyle;
    }

    // Override parent method
    public override String getDescription() {
        // ^^^^^^^^
        // OVERRIDE: Replace parent implementation
        // → Must match parent method signature
        // ✅ POLYMORPHISM: Customize behavior

        String baseDescription = super.getDescription();
        return baseDescription + ' (' + numDoors + '-door ' + bodyStyle + ')';
        // ^^^^^^^^^^^^^^^^^^^^^^
        // SUPER.METHOD(): Call parent version
        // → Reuse parent logic, add custom behavior
    }

    // Override with different logic
    public override Decimal calculateInsurance() {
        Decimal baseInsurance = super.calculateInsurance();

        // Custom calculation for cars
        Decimal ageFactor = (2024 - year) * 10;
        return baseInsurance + ageFactor;
    }

    // Car-specific method
    public String getCarType() {
        return numDoors + '-door ' + bodyStyle;
    }
}

// Another derived class
public class Motorcycle extends Vehicle {

    private String bikeType; // Sport, Cruiser, etc.

    public Motorcycle(String make, String model, Integer year, String bikeType) {
        super(make, model, year);
        this.bikeType = bikeType;
    }

    public override String getDescription() {
        return super.getDescription() + ' (' + bikeType + ' Motorcycle)';
    }

    public override Decimal calculateInsurance() {
        Decimal baseInsurance = super.calculateInsurance();
        // Motorcycles are cheaper to insure
        return baseInsurance * 0.7;
    }
}

// USING INHERITANCE
public class InheritanceExample {

    public static void demonstrateInheritance() {
        // Create objects of different types
        Vehicle genericVehicle = new Vehicle('Generic', 'Model', 2020);
        Car sedan = new Car('Toyota', 'Camry', 2022, 4, 'Sedan');
        Motorcycle bike = new Motorcycle('Harley', 'Sportster', 2021, 'Cruiser');

        // Polymorphism - same method, different behavior
        System.debug(genericVehicle.getDescription()); // "2020 Generic Model"
        System.debug(sedan.getDescription()); // "2022 Toyota Camry (4-door Sedan)"
        System.debug(bike.getDescription()); // "2021 Harley Sportster (Cruiser Motorcycle)"
        // ^^^^^^^^^^^^^^^^^^^^^^^^
        // POLYMORPHISM: Same method call, different results
        // → Each class provides its own implementation
        // 💡 FLEXIBILITY: Uniform interface, varied behavior

        // Type checking
        if (genericVehicle instanceof Vehicle) {
            // ^^^^^^^^^^
            // INSTANCEOF: Check object type
            // → True if object is of specified type or subtype
            System.debug('Is a vehicle');
        }

        if (sedan instanceof Car) {
            System.debug('Is a car');
            // Can access Car-specific methods
            System.debug('Type: ' + sedan.getCarType());
        }
    }

    // Method accepting parent type works with all subtypes
    public static void processVehicles(List<Vehicle> vehicles) {
        // ^^^^^^^^^^^^^^^^^^^^
        // POLYMORPHIC PARAMETER: Accepts any Vehicle subtype
        // → Can pass Car, Motorcycle, or Vehicle objects
        // ✅ FLEXIBILITY: Work with entire hierarchy

        for (Vehicle v : vehicles) {
            System.debug(v.getDescription());
            System.debug('Insurance: $' + v.calculateInsurance());
            // Each object uses its own override implementation
        }
    }
}
```

## Interfaces

Define contracts that classes must implement.

```apex
// Interface definition
public interface Payable {
    // ^^^^^^^^^
    // INTERFACE: Contract for implementing classes
    // → Defines what methods must exist
    // 💡 CONTRACT: All methods are implicitly public and abstract

    Decimal calculatePay();
    // ^^^^^^^^^^^^^^^^^^^
    // INTERFACE METHOD: No implementation, just signature
    // → Implementing classes must provide implementation
    // ✅ CONTRACT: Guarantee this method exists

    void processPayment();
    String getPaymentDetails();
}

// Class implementing interface
public class Employee implements Payable {
    // ^^^^^^^^^^^
    // IMPLEMENTS: Must provide all interface methods
    // → Compiler enforces contract

    private String name;
    private Decimal hourlyRate;
    private Integer hoursWorked;

    public Employee(String name, Decimal hourlyRate, Integer hoursWorked) {
        this.name = name;
        this.hourlyRate = hourlyRate;
        this.hoursWorked = hoursWorked;
    }

    // Implement required method
    public Decimal calculatePay() {
        return hourlyRate * hoursWorked;
        // ^^^^^^^^^^^^^^^^^^^^
        // IMPLEMENTATION: Specific to Employee
        // → Different classes can implement differently
    }

    public void processPayment() {
        Decimal payment = calculatePay();
        System.debug('Processing payment of $' + payment + ' for ' + name);
    }

    public String getPaymentDetails() {
        return name + ': ' + hoursWorked + ' hours @ $' + hourlyRate + '/hr';
    }

    // Additional methods not in interface
    public void clockIn() {
        System.debug(name + ' clocked in');
    }
}

// Another class implementing same interface
public class Contractor implements Payable {

    private String companyName;
    private Decimal projectFee;
    private Boolean projectCompleted;

    public Contractor(String companyName, Decimal projectFee) {
        this.companyName = companyName;
        this.projectFee = projectFee;
        this.projectCompleted = false;
    }

    // Same interface, different implementation
    public Decimal calculatePay() {
        return projectCompleted ? projectFee : 0;
        // ^^^^^^^^^^^^^^^^^^^^^^
        // DIFFERENT LOGIC: Same method, different calculation
        // → Interface allows varied implementations
    }

    public void processPayment() {
        if (projectCompleted) {
            System.debug('Processing contractor payment of $' + projectFee + ' to ' + companyName);
        } else {
            System.debug('Project not completed - no payment');
        }
    }

    public String getPaymentDetails() {
        return companyName + ': $' + projectFee + ' (Completed: ' + projectCompleted + ')';
    }

    public void markCompleted() {
        this.projectCompleted = true;
    }
}

// Multiple interfaces
public interface Taxable {
    Decimal calculateTax();
    String getTaxId();
}

// Class implementing multiple interfaces
public class FullTimeEmployee extends Employee implements Taxable {
    // ^^^^^^^^^^^^^^^^^^
    // MULTIPLE INTERFACES: Separate with commas
    // → Must implement all methods from all interfaces

    private String taxId;

    public FullTimeEmployee(String name, Decimal hourlyRate, Integer hoursWorked, String taxId) {
        super(name, hourlyRate, hoursWorked);
        this.taxId = taxId;
    }

    // Implement Taxable interface methods
    public Decimal calculateTax() {
        return calculatePay() * 0.25; // 25% tax
    }

    public String getTaxId() {
        return this.taxId;
    }
}

// USING INTERFACES
public class InterfaceExample {

    public static void processPayroll(List<Payable> payables) {
        // ^^^^^^^^^^^^^^
        // INTERFACE TYPE: Can hold any implementing class
        // → Employee, Contractor, or any future Payable class
        // ✅ FLEXIBILITY: Code to interface, not implementation

        Decimal totalPayment = 0;

        for (Payable p : payables) {
            // Each object uses its own implementation
            Decimal payment = p.calculatePay();
            totalPayment += payment;

            p.processPayment();
            System.debug(p.getPaymentDetails());
        }

        System.debug('Total payroll: $' + totalPayment);
    }

    public static void demonstrateInterfaces() {
        List<Payable> payables = new List<Payable>();

        // Add different types, all Payable
        payables.add(new Employee('John Doe', 50, 40));
        payables.add(new Employee('Jane Smith', 75, 35));

        Contractor contractor = new Contractor('ACME Corp', 5000);
        contractor.markCompleted();
        payables.add(contractor);

        // Process all uniformly
        processPayroll(payables);
    }
}
```

## Abstract Classes

Classes that cannot be instantiated directly.

```apex
// Abstract class
public abstract class Shape {
    // ^^^^^^^^
    // ABSTRACT: Cannot create instances directly
    // → Must be extended by concrete classes
    // 💡 PURPOSE: Provide common base with enforced customization

    protected String color;
    protected Decimal borderWidth;

    public Shape(String color, Decimal borderWidth) {
        this.color = color;
        this.borderWidth = borderWidth;
    }

    // Abstract method - must be implemented by subclasses
    public abstract Decimal calculateArea();
    // ^^^^^^^^
    // ABSTRACT METHOD: No implementation in base class
    // → Forces subclasses to provide implementation
    // ✅ ENFORCEMENT: Ensures all shapes can calculate area

    public abstract Decimal calculatePerimeter();

    // Concrete method - shared by all subclasses
    public String getDescription() {
        return 'A ' + color + ' shape with ' + borderWidth + 'px border';
        // ^^^^^^^^^^^^^^^^^^^^
        // CONCRETE METHOD: Can have implementation
        // → Provides common functionality
    }

    // Another concrete method
    public virtual String getDisplayInfo() {
        return getDescription() + ', Area: ' + calculateArea();
    }
}

// Concrete subclass must implement all abstract methods
public class Circle extends Shape {

    private Decimal radius;

    public Circle(String color, Decimal borderWidth, Decimal radius) {
        super(color, borderWidth);
        this.radius = radius;
    }

    // Must implement abstract method
    public override Decimal calculateArea() {
        return Math.PI * radius * radius;
        // ^^^^^^^^^^^^^^^^
        // REQUIRED IMPLEMENTATION: Fulfill abstract contract
        // → Circle-specific calculation
    }

    public override Decimal calculatePerimeter() {
        return 2 * Math.PI * radius;
    }

    // Circle-specific method
    public Decimal getRadius() {
        return this.radius;
    }
}

public class Rectangle extends Shape {

    private Decimal width;
    private Decimal height;

    public Rectangle(String color, Decimal borderWidth, Decimal width, Decimal height) {
        super(color, borderWidth);
        this.width = width;
        this.height = height;
    }

    public override Decimal calculateArea() {
        return width * height;
        // ^^^^^^^^^^^^^^^^^
        // DIFFERENT IMPLEMENTATION: Rectangle calculation
        // → Same method name, appropriate logic
    }

    public override Decimal calculatePerimeter() {
        return 2 * (width + height);
    }

    public override String getDisplayInfo() {
        return super.getDisplayInfo() + ' (Dimensions: ' + width + 'x' + height + ')';
    }
}

// USING ABSTRACT CLASSES
public class AbstractExample {

    public static void demonstrateAbstract() {
        // Cannot instantiate abstract class
        // Shape shape = new Shape('red', 2); // COMPILATION ERROR!

        // Can instantiate concrete subclasses
        List<Shape> shapes = new List<Shape>();
        shapes.add(new Circle('blue', 1, 5));
        shapes.add(new Rectangle('green', 2, 10, 20));
        shapes.add(new Circle('red', 1, 3));

        // Process polymorphically
        for (Shape shape : shapes) {
            System.debug(shape.getDescription());
            System.debug('Area: ' + shape.calculateArea());
            System.debug('Perimeter: ' + shape.calculatePerimeter());
            System.debug('---');
        }
    }
}
```

## Advanced OOP Patterns

```apex
// Singleton pattern
public class ConfigurationManager {
    // ^^^^^^^^^
    // SINGLETON: Only one instance exists
    // → Shared configuration across application

    private static ConfigurationManager instance;

    private Map<String, String> settings;

    // Private constructor prevents external instantiation
    private ConfigurationManager() {
        this.settings = new Map<String, String>();
        loadSettings();
    }

    // Public method to get single instance
    public static ConfigurationManager getInstance() {
        if (instance == null) {
            instance = new ConfigurationManager();
        }
        return instance;
        // ^^^^^^^^^^^^^^^^^^^^^
        // LAZY INITIALIZATION: Create only when needed
        // → Save resources if never used
    }

    public String getSetting(String key) {
        return settings.get(key);
    }

    public void setSetting(String key, String value) {
        settings.put(key, value);
    }

    private void loadSettings() {
        // Load from custom settings, etc.
        settings.put('api_endpoint', 'https://api.example.com');
        settings.put('timeout', '30');
    }
}

// Factory pattern
public class ShapeFactory {
    // ^^^^^^^
    // FACTORY: Creates objects based on input
    // → Encapsulates object creation logic

    public static Shape createShape(String type, Map<String, Decimal> params) {
        // ^^^^^^^^^^^^^^^^^^
        // FACTORY METHOD: Decides which class to instantiate
        // → Centralizes creation logic

        if (type == 'circle') {
            return new Circle(
                'blue',
                params.get('borderWidth'),
                params.get('radius')
            );
        } else if (type == 'rectangle') {
            return new Rectangle(
                'green',
                params.get('borderWidth'),
                params.get('width'),
                params.get('height')
            );
        } else {
            throw new IllegalArgumentException('Unknown shape type: ' + type);
        }
        // ^^^^^^^^^^^^^^^^^^^^
        // FLEXIBLE CREATION: Easy to add new types
        // → Changes isolated to factory
    }
}

// Builder pattern
public class AccountBuilder {
    // ^^^^^^^
    // BUILDER: Construct complex objects step by step
    // → More readable than many constructor parameters

    private Account acc;

    public AccountBuilder() {
        this.acc = new Account();
    }

    public AccountBuilder setName(String name) {
        this.acc.Name = name;
        return this;
        // ^^^^^^^^^^^
        // METHOD CHAINING: Return this for fluent API
        // → Allows builder.setName().setIndustry()
    }

    public AccountBuilder setIndustry(String industry) {
        this.acc.Industry = industry;
        return this;
    }

    public AccountBuilder setRevenue(Decimal revenue) {
        this.acc.AnnualRevenue = revenue;
        return this;
    }

    public Account build() {
        // Validation before creating
        if (String.isBlank(acc.Name)) {
            throw new IllegalArgumentException('Name is required');
        }
        return this.acc;
    }
}

// USING PATTERNS
public class DesignPatternExample {

    public static void demonstratePatterns() {
        // Singleton
        ConfigurationManager config = ConfigurationManager.getInstance();
        String endpoint = config.getSetting('api_endpoint');

        // Factory
        Map<String, Decimal> circleParams = new Map<String, Decimal>{
            'borderWidth' => 2,
            'radius' => 10
        };
        Shape circle = ShapeFactory.createShape('circle', circleParams);

        // Builder
        Account acc = new AccountBuilder()
            .setName('ACME Corp')
            .setIndustry('Technology')
            .setRevenue(1000000)
            .build();
        // ^^^^^^^^^^^^^^^^^^^^
        // FLUENT API: Readable object construction
        // → Clear intent, self-documenting
    }
}
```

---

# Best Practices

## Encapsulation

```apex
// ❌ BAD - Exposing internal state
public class BadBankAccount {
    public Decimal balance; // Anyone can modify!
}

// ✅ GOOD - Controlled access
public class GoodBankAccount {
    private Decimal balance;

    public Decimal getBalance() {
        return balance;
    }

    public void deposit(Decimal amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}
```

## Prefer Composition Over Inheritance

```apex
// ❌ Excessive inheritance
public class Vehicle {}
public class Car extends Vehicle {}
public class ElectricCar extends Car {}
public class TeslaModelS extends ElectricCar {} // Too deep!

// ✅ BETTER - Composition
public class Car {
    private Engine engine;
    private Battery battery;

    public Car(Engine engine, Battery battery) {
        this.engine = engine;
        this.battery = battery;
    }
}
```

---

# Common Gotchas

💀 **Static vs Instance**: Static members belong to class, instance members to objects
⚠️ **Null References**: Always check for null before calling methods
💡 **Access Modifiers**: Use most restrictive access level possible

---

# Exam Tips

1. **Inheritance**: Only single inheritance supported (one parent class)
2. **Interfaces**: Multiple interfaces can be implemented
3. **Abstract**: Abstract classes can have concrete methods
4. **Virtual**: Required for method overriding
5. **Override**: Required keyword when overriding methods

---

# Practice Exercises

Create these classes following OOP principles:
1. Library system (Book, Member, Loan)
2. Shopping cart (Product, Cart, Payment)
3. University (Student, Course, Enrollment)

---

# Related Topics

## Prerequisites
- **[Variables and Data Types](variables-and-data-types)**
- **[Control Flow and Logic](control-flow-and-logic)**
- **[Collections Deep Dive](collections-deep-dive)**

## Next Steps
- **[Exception Handling](exception-handling)** - Custom exceptions
- **[DML Operations](dml-operations)** - Work with Salesforce data

**Next Recommended Topic:** [DML Operations](dml-operations) - Learn to create, read, update, and delete Salesforce records.
