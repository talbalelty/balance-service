# Crypto Balance System

## Overview

This project is a simple crypto balance management system developed using the NestJS monorepo architecture. It allows users to manage their cryptocurrency holdings and view their current valuations in various currencies. The system consists of two microservices: `balance-service` and `rate-service`, along with shared libraries for common functionality.

---

## Features

### General
- **NestJS Monorepo**: Two microservices (`balance-service` and `rate-service`) with shared libraries.
- **Local JSON Storage**: Data is stored in JSON files, eliminating the need for a database setup.
- **User Identification**: User ID is passed via the `X-User-ID` HTTP header for all requests.
- **GitHub Repository**: Code is version-controlled and pushed regularly to GitHub.

### Balance Service
- **CRUD Operations**: Manage user balances for each cryptocurrency asset.
- **Endpoints**:
  - Add or remove crypto assets from user balances.
  - Retrieve user balances.
  - Calculate total balance value in a specified currency.
- **Rebalance Endpoint** (Bonus): Adjust holdings to match specified target percentages.

### Rate Service
- **CoinGecko API Integration**: Fetch and store current cryptocurrency rates.
- **Caching**: Efficient caching mechanism to minimize API calls.
- **Background Job**: Periodically update rates in the cache.

### Shared Libraries
- **Database Module**: File-based storage management.
- **Logger Module**: Basic logging functionality.
- **Error Handling Module**: Custom error handling.

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- docker engine running on the computer

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd balance-service
   ```

2. Execution - Open terminal
    ``` bash
    docker-compose build
    docker-compose up
    ```

## Request Examples
I recommend to start with the first request to init data in the storage

Create  
``` 
POST
http://localhost:3000/balance
{
    "assets": [
        {
            "name": "bitcoin",
            "value": 49
        }
    ]
}   
```

Get Total Balance
```
GET
http://localhost:3000/balance/total/usd
```

Get Balances
```
GET
http://localhost:3000/balance
```

Add or Remove Balances
```
PUT
http://localhost:3000/balance/add-or-remove
{
    "name": "bitcoin",
    "value": 1000
}
```
