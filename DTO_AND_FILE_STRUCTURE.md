# CSD230 Lab 6 — DTO Reference & File Structure

> **Backend base URL:** `http://localhost:8080`  
> **Frontend dev server:** `http://localhost:5173` (proxied to `8080` via Vite)  
> All REST endpoints are prefixed with `/api/rest`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Books](#2-books)
3. [Magazines](#3-magazines)
4. [Disc Magazines](#4-disc-magazines-discmags)
5. [Tickets](#5-tickets)
6. [Handheld Consoles](#6-handheld-consoles)
7. [Home Consoles](#7-home-consoles)
8. [Cart](#8-cart)
9. [Orders](#9-orders)
10. [DTO Inheritance Hierarchy](#10-dto-inheritance-hierarchy)
11. [File Structure](#11-file-structure)

---

## 1. Authentication

**Endpoint:** `POST /api/rest/auth/login`

### Login Request Body

```json
{
  "username": "string",
  "password": "string"
}
```

| Field      | Type     | Required | Notes                          |
|------------|----------|----------|--------------------------------|
| `username` | `string` | Yes      | Also accepts `email` field     |
| `email`    | `string` | No       | Used as fallback if no username|
| `password` | `string` | Yes      |                                |

### Login Response Body

```json
{
  "token": "string",
  "username": "string",
  "role": "string"
}
```

| Field      | Type     | Notes                                      |
|------------|----------|--------------------------------------------|
| `token`    | `string` | JWT Bearer token — stored in localStorage  |
| `username` | `string` | Authenticated user's username              |
| `role`     | `string` | e.g. `"ADMIN"` or `"USER"`                |

> The JWT is attached on every subsequent request as:  
> `Authorization: Bearer <token>`

---

## 2. Books

**Base endpoint:** `/api/rest/books`

| Method   | Path              | Description        |
|----------|-------------------|--------------------|
| `GET`    | `/books`          | Get all books      |
| `GET`    | `/books/{id}`     | Get book by ID     |
| `POST`   | `/books`          | Create a new book  |
| `PUT`    | `/books/{id}`     | Update a book      |
| `DELETE` | `/books/{id}`     | Delete a book      |

### Book JSON Shape

```json
{
  "id": 1,
  "name": "string",
  "author": "string",
  "price": 19.99,
  "copies": 10
}
```

| Field    | Type     | Required (POST/PUT) | Notes                     |
|----------|----------|---------------------|---------------------------|
| `id`     | `number` | Auto-generated      | `product_id` in DB        |
| `name`   | `string` | Yes                 | Title of the book         |
| `author` | `string` | Yes                 |                           |
| `price`  | `number` | Yes                 | Stored in `pub_price` col |
| `copies` | `number` | Yes                 | Inventory count           |

### Frontend Component Fields (Book.jsx / BookForm.jsx)

- `id`, `name`, `author`, `price`, `copies`

---

## 3. Magazines

**Base endpoint:** `/api/rest/magazines`

| Method   | Path                | Description           |
|----------|---------------------|-----------------------|
| `GET`    | `/magazines`        | Get all magazines     |
| `GET`    | `/magazines/{id}`   | Get magazine by ID    |
| `POST`   | `/magazines`        | Create a new magazine |
| `PUT`    | `/magazines/{id}`   | Update a magazine     |
| `DELETE` | `/magazines/{id}`   | Delete a magazine     |

### Magazine JSON Shape

```json
{
  "id": 1,
  "name": "string",
  "price": 9.99,
  "copies": 50,
  "orderQty": 100,
  "currentIssue": "2025-01-15T00:00:00"
}
```

| Field          | Type             | Required (POST/PUT) | Notes                             |
|----------------|------------------|---------------------|-----------------------------------|
| `id`           | `number`         | Auto-generated      |                                   |
| `name`         | `string`         | Yes                 | Magazine title                    |
| `price`        | `number`         | Yes                 |                                   |
| `copies`       | `number`         | Yes                 | On-hand copies                    |
| `orderQty`     | `number`         | Yes                 | Quantity ordered from publisher   |
| `currentIssue` | `string` (ISO 8601 datetime) | Yes | e.g. `"2025-06-01T00:00:00"` |

### Frontend Component Fields (Magazine.jsx / MagazineForm.jsx)

- `id`, `name`, `price`, `copies`, `orderQty`, `currentIssue`

---

## 4. Disc Magazines (DiscMags)

**Base endpoint:** `/api/rest/discmags`

| Method   | Path               | Description               |
|----------|--------------------|---------------------------|
| `GET`    | `/discmags`        | Get all disc magazines    |
| `GET`    | `/discmags/{id}`   | Get disc magazine by ID   |
| `POST`   | `/discmags`        | Create a new disc magazine|
| `PUT`    | `/discmags/{id}`   | Update a disc magazine    |
| `DELETE` | `/discmags/{id}`   | Delete a disc magazine    |

### DiscMag JSON Shape

```json
{
  "id": 1,
  "name": "string",
  "price": 14.99,
  "copies": 20,
  "orderQty": 50,
  "currentIssue": "2025-03-01T00:00:00",
  "hasDisc": true
}
```

| Field          | Type      | Required (POST/PUT) | Notes                            |
|----------------|-----------|---------------------|----------------------------------|
| `id`           | `number`  | Auto-generated      |                                  |
| `name`         | `string`  | Yes                 |                                  |
| `price`        | `number`  | Yes                 |                                  |
| `copies`       | `number`  | Yes                 |                                  |
| `orderQty`     | `number`  | Yes                 |                                  |
| `currentIssue` | `string`  | Yes                 | ISO 8601 datetime string         |
| `hasDisc`      | `boolean` | Yes                 | `true` if a disc is included     |

### Frontend Component Fields (DiscMag.jsx / DiscMagForm.jsx)

- `id`, `name`, `price`, `copies`, `orderQty`, `currentIssue`, `hasDisc`

---

## 5. Tickets

**Base endpoint:** `/api/rest/tickets`

| Method   | Path              | Description        |
|----------|-------------------|--------------------|
| `GET`    | `/tickets`        | Get all tickets    |
| `GET`    | `/tickets/{id}`   | Get ticket by ID   |
| `POST`   | `/tickets`        | Create a ticket    |
| `PUT`    | `/tickets/{id}`   | Update a ticket    |
| `DELETE` | `/tickets/{id}`   | Delete a ticket    |

### Ticket JSON Shape

```json
{
  "id": 1,
  "name": "string",
  "price": 49.99
}
```

| Field   | Type     | Required (POST/PUT) | Notes                          |
|---------|----------|---------------------|--------------------------------|
| `id`    | `number` | Auto-generated      | `product_id` in DB             |
| `name`  | `string` | Yes                 | Ticket description / event name|
| `price` | `number` | Yes                 | Stored in `ticket_price` col   |

### Frontend Component Fields (Ticket.jsx / TicketForm.jsx)

- `id`, `name`, `price`

---

## 6. Handheld Consoles

**Base endpoint:** `/api/rest/handheld-consoles`

| Method   | Path                       | Description               |
|----------|----------------------------|---------------------------|
| `GET`    | `/handheld-consoles`       | Get all handheld consoles |
| `GET`    | `/handheld-consoles/{id}`  | Get handheld console by ID|
| `POST`   | `/handheld-consoles`       | Create handheld console   |
| `PUT`    | `/handheld-consoles/{id}`  | Update handheld console   |
| `DELETE` | `/handheld-consoles/{id}`  | Delete handheld console   |

### HandheldConsole JSON Shape

```json
{
  "id": 1,
  "name": "string",
  "manufacturer": "string",
  "price": 249.99,
  "quantity": 30,
  "batteryLifeHours": 8
}
```

| Field              | Type     | Required (POST/PUT) | Notes                          |
|--------------------|----------|---------------------|--------------------------------|
| `id`               | `number` | Auto-generated      |                                |
| `name`             | `string` | Yes                 |                                |
| `manufacturer`     | `string` | Yes                 |                                |
| `price`            | `number` | Yes                 | Stored in `console_price` col  |
| `quantity`         | `number` | Yes                 | Inventory count                |
| `batteryLifeHours` | `number` | Yes                 | Stored in `battery_life_hours` |

### Frontend Component Fields (HandheldConsole.jsx / HandheldConsoleForm.jsx)

- `id`, `name`, `manufacturer`, `price`, `quantity`, `batteryLifeHours`

---

## 7. Home Consoles

**Base endpoint:** `/api/rest/home-consoles`

| Method   | Path                    | Description             |
|----------|-------------------------|-------------------------|
| `GET`    | `/home-consoles`        | Get all home consoles   |
| `GET`    | `/home-consoles/{id}`   | Get home console by ID  |
| `POST`   | `/home-consoles`        | Create home console     |
| `PUT`    | `/home-consoles/{id}`   | Update home console     |
| `DELETE` | `/home-consoles/{id}`   | Delete home console     |

### HomeConsole JSON Shape

```json
{
  "id": 1,
  "name": "string",
  "manufacturer": "string",
  "price": 499.99,
  "quantity": 15,
  "maxResolution": "4K"
}
```

| Field           | Type     | Required (POST/PUT) | Notes                         |
|-----------------|----------|---------------------|-------------------------------|
| `id`            | `number` | Auto-generated      |                               |
| `name`          | `string` | Yes                 |                               |
| `manufacturer`  | `string` | Yes                 |                               |
| `price`         | `number` | Yes                 | Stored in `console_price` col |
| `quantity`      | `number` | Yes                 | Inventory count               |
| `maxResolution` | `string` | Yes                 | e.g. `"4K"`, `"1080p"`       |

### Frontend Component Fields (HomeConsole.jsx / HomeConsoleForm.jsx)

- `id`, `name`, `manufacturer`, `price`, `quantity`, `maxResolution`

---

## 8. Cart

**Base endpoint:** `/api/rest/cart`  
> ⚠️ All cart endpoints require a valid JWT — the cart is tied to the authenticated user.

| Method | Path                    | Description                     |
|--------|-------------------------|---------------------------------|
| `GET`  | `/cart`                 | Get current user's cart         |
| `POST` | `/cart/add/{productId}` | Add a product to the cart       |
| `POST` | `/cart/remove/{productId}` | Remove a product from cart   |
| `POST` | `/cart/checkout`        | Checkout and create an order    |

### Cart Response Shape

```json
{
  "id": 1,
  "products": [
    {
      "id": 5,
      "name": "string",
      "price": 19.99,
      "product_type": "BOOK"
    }
  ],
  "count": 1,
  "total": 19.99
}
```

| Field      | Type            | Notes                                     |
|------------|-----------------|-------------------------------------------|
| `id`       | `number`        | Cart ID                                   |
| `products` | `array`         | Array of product objects (polymorphic)    |
| `count`    | `number`        | Number of items in cart                   |
| `total`    | `number`        | Sum of all product prices                 |

### Checkout Response Shape

```json
{
  "message": "Order placed successfully!",
  "orderId": 10,
  "total": 49.99
}
```

---

## 9. Orders

Orders are created automatically on checkout. There is no dedicated frontend order REST endpoint; orders are managed server-side.

### OrderEntity Fields (for reference)

| Field         | Type              | Notes                          |
|---------------|-------------------|--------------------------------|
| `id`          | `number`          | Auto-generated order ID        |
| `totalAmount` | `number`          | Total cost of the order        |
| `orderDate`   | `string`          | ISO 8601 datetime              |
| `user`        | `UserEntity`      | The user who placed the order  |
| `products`    | `ProductEntity[]` | Snapshot of purchased items    |

---

## 10. DTO Inheritance Hierarchy

```
SaleableItem (interface)
└── Product (abstract POJO)
    ├── Publication (abstract POJO)
    │   ├── Book         → fields: productId, title, price, copies, author, isbn
    │   ├── Magazine     → fields: productId, title, price, copies, orderQty, currentIssue
    │   └── DiscMag      → fields: (all Magazine fields), hasDisc
    ├── GameConsole (abstract POJO)
    │   ├── HandheldConsole → fields: productId, name, manufacturer, price, quantity, batteryLifeHours
    │   └── HomeConsole     → fields: productId, name, manufacturer, price, quantity, maxResolution
    └── Ticket           → fields: productId, name/description, price

ProductEntity (abstract JPA, @Table products, SINGLE_TABLE)
├── PublicationEntity (abstract JPA)
│   ├── BookEntity        → @DiscriminatorValue("BOOK")
│   ├── MagazineEntity    → @DiscriminatorValue("MAGAZINE")
│   └── DiscMagEntity     → @DiscriminatorValue("DISCMAG")
└── TicketEntity          → @DiscriminatorValue("TICKET")

GameConsoleEntity (abstract JPA, @MappedSuperclass)
├── HandheldConsoleEntity → @DiscriminatorValue("HANDHELD CONSOLE")
└── HomeConsoleEntity     → @DiscriminatorValue("HOME CONSOLE")
```

> **Note:** The REST API serializes **Entity** objects directly (not the POJO DTOs).  
> The POJO classes (`pojos/` package) are in-memory DTOs used for business logic.

---

## 11. File Structure

```
csd230 - lab6/
├── docker-compose.yaml          # Docker services: app + MySQL
├── Dockerfile                   # Spring Boot app image
├── pom.xml                      # Maven build file
├── mvnw / mvnw.cmd              # Maven wrapper scripts
│
├── frontend/                    # React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # Proxy: /api/rest → localhost:8080
│   └── src/
│       ├── main.jsx             # App entry point (ReactDOM.createRoot)
│       ├── App.jsx              # Root component, routing, data loading
│       ├── App.css
│       ├── index.css
│       │
│       ├── Navbar.jsx           # Top navigation bar (lucide-react icons)
│       ├── Home.jsx             # Landing / home page
│       │
│       ├── Book.jsx             # Book list item (view + inline edit)
│       ├── BookForm.jsx         # Add new book form
│       ├── Magazine.jsx         # Magazine list item
│       ├── MagazineForm.jsx     # Add new magazine form
│       ├── DiscMag.jsx          # Disc magazine list item
│       ├── DiscMagForm.jsx      # Add new disc magazine form
│       ├── HandheldConsole.jsx  # Handheld console list item
│       ├── HandheldConsoleForm.jsx
│       ├── HomeConsole.jsx      # Home console list item
│       ├── HomeConsoleForm.jsx
│       ├── Ticket.jsx           # Ticket list item
│       ├── TicketForm.jsx       # Add new ticket form
│       ├── Cart.jsx             # Shopping cart view + checkout
│       │
│       ├── api/
│       │   └── axiosConfig.js   # Axios instance (baseURL, JWT interceptor, 401 redirect)
│       │
│       ├── pages/
│       │   ├── Login.jsx        # Login page (POST /api/rest/auth/login)
│       │   └── Logout.jsx       # Clears token + redirects to /login
│       │
│       ├── provider/
│       │   └── authProvider.jsx # AuthContext: token, role, isAdmin state
│       │
│       └── routes/
│           └── ProtectedRoute.jsx  # Wraps routes needing authentication
│
└── src/
    ├── main/
    │   ├── java/com/juanroy/lab6/
    │   │   ├── Application.java
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── JwtUtil.java               # Token creation & parsing
    │   │   │   └── JwtAuthorizationFilter.java # JWT validation filter
    │   │   │
    │   │   ├── config/                        # Spring Security config
    │   │   │
    │   │   ├── entities/                      # JPA Entities (SINGLE_TABLE inheritance)
    │   │   │   ├── ProductEntity.java         # Base entity (@Table products)
    │   │   │   ├── PublicationEntity.java     # Abstract publication
    │   │   │   ├── BookEntity.java            # BOOK discriminator
    │   │   │   ├── MagazineEntity.java        # MAGAZINE discriminator
    │   │   │   ├── DiscMagEntity.java         # DISCMAG discriminator
    │   │   │   ├── TicketEntity.java          # TICKET discriminator
    │   │   │   ├── CartEntity.java            # @Table cart_entity
    │   │   │   ├── OrderEntity.java           # @Table order_entity
    │   │   │   └── UserEntity.java            # @Table users
    │   │   │
    │   │   ├── nicheEntities/                 # Console entities (@MappedSuperclass)
    │   │   │   ├── GameConsoleEntity.java     # Abstract console base
    │   │   │   ├── HandheldConsoleEntity.java # HANDHELD CONSOLE discriminator
    │   │   │   └── HomeConsoleEntity.java     # HOME CONSOLE discriminator
    │   │   │
    │   │   ├── pojos/                         # In-memory DTOs / business objects
    │   │   │   ├── SaleableItem.java          # Interface: sellItem(), getPrice()
    │   │   │   ├── Product.java               # Abstract base POJO
    │   │   │   ├── Publication.java           # Abstract publication POJO
    │   │   │   ├── Book.java                  # Book POJO
    │   │   │   ├── Magazine.java              # Magazine POJO
    │   │   │   ├── DiscMag.java               # DiscMag POJO
    │   │   │   ├── GameConsole.java           # Abstract console POJO
    │   │   │   ├── HandheldConsole.java       # HandheldConsole POJO
    │   │   │   ├── HomeConsole.java           # HomeConsole POJO
    │   │   │   ├── Ticket.java                # Ticket POJO
    │   │   │   └── Cart.java                  # Cart POJO
    │   │   │
    │   │   ├── repositories/                  # Spring Data JPA repositories
    │   │   │
    │   │   ├── services/                      # Service layer
    │   │   │
    │   │   └── controllers/
    │   │       ├── BookController.java        # MVC (Thymeleaf) controller
    │   │       ├── CartController.java
    │   │       ├── DiscMagController.java
    │   │       ├── LoginController.java
    │   │       ├── MagazineController.java
    │   │       ├── ProductController.java
    │   │       ├── RegisterController.java
    │   │       ├── SpaController.java         # Serves SPA index.html for React routes
    │   │       ├── advices/                   # @ControllerAdvice exception handlers
    │   │       ├── exceptions/                # Custom exceptions (404, 422, etc.)
    │   │       └── restControllers/           # REST API controllers
    │   │           ├── AuthRestController.java        # POST /api/rest/auth/login
    │   │           ├── BookRestController.java        # /api/rest/books
    │   │           ├── MagazineRestController.java    # /api/rest/magazines
    │   │           ├── DiscMagRestController.java     # /api/rest/discmags
    │   │           ├── TicketRestController.java      # /api/rest/tickets
    │   │           ├── HandheldConsoleRestController.java # /api/rest/handheld-consoles
    │   │           ├── HomeConsoleRestController.java     # /api/rest/home-consoles
    │   │           ├── CartRestController.java        # /api/rest/cart
    │   │           └── ProductRestController.java     # /api/rest/products
    │   │
    │   └── resources/
    │       ├── application.properties         # Active profile selector
    │       ├── application-h2.properties      # H2 in-memory config
    │       ├── application-mysql.properties   # MySQL config
    │       ├── static/                        # Vite build output (served as static)
    │       └── templates/                     # Thymeleaf HTML templates
    │           ├── login.html
    │           ├── register.html
    │           ├── adds/   (addBook.html, addMagazine.html, etc.)
    │           ├── details/
    │           ├── edits/
    │           └── lists/
    │
    └── test/
        └── java/com/juanroy/lab6/
```

---

## Quick Reference — Field Names by Resource

| Resource         | Endpoint                   | Key Fields                                                                 |
|------------------|----------------------------|---------------------------------------------------------------------------|
| Auth Login       | `POST /auth/login`         | `username`, `password` → `token`, `role`                                  |
| Book             | `/books`                   | `id`, `name`, `author`, `price`, `copies`                                 |
| Magazine         | `/magazines`               | `id`, `name`, `price`, `copies`, `orderQty`, `currentIssue`              |
| DiscMag          | `/discmags`                | `id`, `name`, `price`, `copies`, `orderQty`, `currentIssue`, `hasDisc`   |
| Ticket           | `/tickets`                 | `id`, `name`, `price`                                                     |
| HandheldConsole  | `/handheld-consoles`       | `id`, `name`, `manufacturer`, `price`, `quantity`, `batteryLifeHours`     |
| HomeConsole      | `/home-consoles`           | `id`, `name`, `manufacturer`, `price`, `quantity`, `maxResolution`        |
| Cart             | `/cart`                    | `id`, `products[]`, `count`, `total`                                      |

