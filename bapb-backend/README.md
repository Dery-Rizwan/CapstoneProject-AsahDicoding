# BAPB System - Backend API

Backend API untuk sistem Berita Acara Pemeriksaan Barang (BAPB)

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb bapb_system

# Or using psql
psql -U postgres
CREATE DATABASE bapb_system;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` with your credentials.

### 4. Run Database Migration
```bash
npm run db:migrate
```

### 5. Start Development Server
```bash
npm run dev
```

Server will run at `http://localhost:5000`

## API Endpoints

### Authentication
```
POST   /api/auth/register   - Register new user
POST   /api/auth/login      - Login user
GET    /api/auth/profile    - Get user profile (Protected)
```

### BAPB Management
```
POST   /api/bapb            - Create new BAPB (Vendor only)
GET    /api/bapb            - Get all BAPB
GET    /api/bapb/:id        - Get BAPB by ID
PUT    /api/bapb/:id        - Update BAPB (Vendor only)
DELETE /api/bapb/:id        - Delete BAPB (Vendor only, draft only)
POST   /api/bapb/:id/submit - Submit BAPB for review (Vendor only)
```

## User Roles

- `vendor` - Vendor/Supplier
- `pic_gudang` - PIC Gudang (Warehouse Officer)
- `admin` - Admin
- `approver` - Approver (Direksi)

## BAPB Status Flow
```
draft → submitted → in_review → approved/rejected
                              → revision_required → submitted
```

## Testing with Postman

Import the Postman collection from `/postman` folder (akan dibuat di langkah berikutnya).

## Project Structure
```
bapb-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── utils/           # Helper functions
│   └── app.js           # Main application
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Development Team

- Backend Dev 1 (BE1): User Management & Auth
- **Backend Dev 2 (BE2): BAPB Core Logic** ← You are here
- Backend Dev 3 (BE3): BAPP Core Logic