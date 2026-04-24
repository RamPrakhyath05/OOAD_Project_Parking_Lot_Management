# Parking Lot Management System (ParkQ)

A full-stack **Parking Lot Management System** built using **Spring Boot (Java)** and **React**, designed using **Object-Oriented Analysis & Design principles**, MVC architecture, and multiple design patterns.

---

## 📌 Project Overview

The Parking Lot Management System automates vehicle parking, slot allocation, billing, and administration. It eliminates manual tracking and ensures efficient utilization of parking space.

### 🎯 Key Objectives

* Efficient parking slot allocation
* Automated fee calculation
* Real-time tracking of parked vehicles
* Admin control over parking slots
* Clean and scalable architecture using OOAD principles

---

## 🏗️ Architecture

The system follows the **MVC Architecture Pattern**:

```text
Controller → Facade → Service → Repository → Database
```

* **Controller** → Handles API requests
* **Facade** → Provides unified interface (Facade Pattern)
* **Service** → Business logic
* **Repository** → Data access layer (JPA)
* **Frontend** → React-based UI

---

## ⚙️ Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* H2 Database

### Frontend

* React (Vite)
* Fetch API

### Tools

* Maven
* Git & GitHub

---

## ✨ Features

### 🚗 Major Features

* Park a vehicle
* Unpark a vehicle (with billing)
* Search for parked vehicle
* Slot management (Admin)

### 🔧 Minor Features

* View active tickets
* Dashboard with slot status
* Automatic fee calculation
* Slot allocation strategies

---

## 🧠 Design Patterns Used

### 1. Strategy Pattern (Behavioral)

Used for:

* Slot allocation (`NearestSlotStrategy`, `RandomSlotStrategy`)
* Fee calculation (`CarFeeStrategy`, `BikeFeeStrategy`)

👉 Enables flexible and extensible logic.

---

### 2. Factory Pattern (Creational)

Used for:

* Selecting appropriate strategy dynamically

```java
SlotStrategyFactory
FeeStrategyFactory
```

👉 Promotes loose coupling.

---

### 3. Facade Pattern (Structural)

Introduced via:

```java
ParkingFacade
```

👉 Provides a unified interface for:

* Parking
* Exit
* Search
* Ticket retrieval

---

## 📐 Design Principles Used

### 1. Single Responsibility Principle (SRP)

Each class has a single responsibility:

* Controller → API handling
* Service → business logic
* Repository → DB operations

---

### 2. Open/Closed Principle (OCP)

System is open for extension:

* Add new strategies without modifying existing code

---

### 3. Dependency Inversion Principle (DIP)

* High-level modules depend on abstractions
* Spring DI injects implementations

---

### 4. DRY Principle

* Logic centralized in `ParkingService`
* DTO conversion reused

---

### 5. Interface Segregation Principle (ISP)

* Small, focused interfaces:

  * `FeeStrategy`
  * `SlotAllocationStrategy`

---

## 📊 Database Design

Entities:

* **Vehicle**
* **ParkingSlot**
* **Ticket**

Relationships:

* One Vehicle → Many Tickets
* One Slot → Many Tickets

---

## 🔌 API Endpoints

### Parking APIs

| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| POST   | `/api/parking/entry`       | Park vehicle    |
| POST   | `/api/parking/exit`        | Unpark vehicle  |
| GET    | `/api/parking/active`      | Active vehicles |
| GET    | `/api/parking/ticket/{id}` | Get ticket      |
| GET    | `/api/parking/search`      | Search vehicle  |

---

### Admin APIs

| Method | Endpoint               | Description   |
| ------ | ---------------------- | ------------- |
| POST   | `/api/admin/slot`      | Add slot      |
| GET    | `/api/admin/slots`     | Get all slots |
| DELETE | `/api/admin/slot/{slotNumber}` | Delete slot   |

---

## 🖥️ Frontend Modules

* Dashboard (overview & occupancy)
* Park Vehicle
* Unpark Vehicle (billing UI)
* Search Vehicle
* Slot Administration

---

## ▶️ How to Run

### 🔹 Backend

```bash
mvn spring-boot:run
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Run Both (optional script)

```bash
./run.sh
```

---

## 🔄 System Workflow

1. Vehicle enters → system checks if already parked  
2. Available slot is selected using allocation strategy  
3. Ticket is generated and slot is marked occupied  
4. On exit → system calculates duration and fee  
5. Slot is freed and ticket is closed

---

## 👨‍💻 Team Contributions

| Member   | Contribution     |
| -------- | ---------------- |
| Member 1 | Parking logic    |
| Member 2 | Slot management  |
| Member 3 | UI/Frontend      |
| Member 4 | Search & Billing |

---

## 🎓 Conclusion

This project demonstrates:

* Practical application of **OOAD concepts**
* Use of **Design Patterns and Principles**
* Implementation of a **scalable and modular system**

---

## 💬 Future Enhancements

* Multi-floor parking analytics
* Payment gateway integration
* User authentication system
* Real-time notifications

---

# 🚀 Final Note

This project is designed to meet **OOAD mini-project guidelines** with:

* MVC architecture
* Multiple design patterns
* Clean layered design


