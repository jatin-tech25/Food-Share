# Food Share - "Reduce Waste, Feed Need"
### Full-Stack Social Impact Surplus Food Rescue Platform

A comprehensive, production-grade web application designed for B.Tech Computer Science and Engineering projects. **Food Share** connects food providers (restaurants, hotels, college canteens, households) with verified NGOs, shelters, and community volunteers to prevent avoidable food waste and distribute surplus meals to people in need.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**:
   - **Food Provider**: Post food donations with portion estimates, preparation timestamps, allergens, and safe pickup deadlines; review and accept incoming NGO requests; coordinate volunteer pickups.
   - **NGO / Community Organization**: Search and filter available surplus donations; submit portion requests with distribution plans; track delivery; confirm receipt upon delivery.
   - **Volunteer**: Browse open rescue missions in their city; claim assignments; update status in real-time (`Assigned` ➔ `Picked Up` ➔ `Delivered`).
   - **Administrator**: Comprehensive oversight dashboard; verify NGO credentials; review reports and moderate listings; suspend/reactivate accounts; inspect immutable security audit logs; view real-time platform impact statistics.

2. **Atomic Quantity Allocation & Concurrency Protection**:
   - Provider acceptance deducts from remaining available quantity in a transactional workflow to prevent overselling.
   - Donation transitions gracefully: `Available` ➔ `Partially Reserved` ➔ `Fully Reserved` ➔ `Pickup Arranged` ➔ `Picked Up` ➔ `Delivered` ➔ `Completed`.

3. **In-App Notification Center**:
   - Real database-driven alerts for request submissions, approvals, volunteer mission claims, pickup updates, and completion.

4. **Impact Analytics**:
   - Real calculated metrics: Completed food rescue donations, estimated meal portions distributed, active providers, participating NGOs, and estimated CO2 emission reductions.

5. **Food Safety Compliance & Guidance**:
   - Temperature guidelines, allergen alerts, packaging checklists, and a community reporting mechanism.

6. **Interactive Automated Test Suite & Fake Website Stress Runner**:
   - Dual-mode test runner verifying:
     - **Mode 1 (Core API Tests)**: Registration, password hashing, duplicate detection, atomic allocation, volunteer status transitions, and audit logs.
     - **Mode 2 (Fake Website & Security Stress Runner)**: Simulates synthetic fake listing injection, fake admin escalation defense, sybil spam defense, high-concurrency race condition defense, and virtual end-to-end sandbox simulation.

7. **FoodShare AI Assistant Chatbot**:
   - Floating interactive assistant equipped with quick prompts for food safety, temperature rules, NGO verification guides, volunteer mission help, and direct platform navigation.

8. **Variety of Rescued Foods Showcase**:
   - Visual catalog on the homepage highlighting hot cooked meals, artisan breads & morning pastries, crisp organic farm fruits & vegetables, shelf-stable packaged goods, chilled dairy, and banquet catering platters.

---

## 🏗️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons | Responsive modern UI with natural green color palette |
| **Full-Stack Applet Server** | Express.js, Node.js / `tsx`, Vite | Connects API with client-side SPA on port 3000 |
| **Python Backend (VS Code)** | Python 3.10+, Flask, Flask-SQLAlchemy, Werkzeug, Pytest | Clean modular blueprints architecture with SQLite ORM |
| **Database** | Persistent Relational SQLite / JSON Store | Survives server restarts with seed fixtures |

---

## 📁 Project Folder Structure

```
food-share/
├── server.ts                    # Full-stack Express server mounting /api routes & Vite
├── server/
│   ├── db.ts                    # Persistent database engine with transactions & audit log
│   ├── routes.ts                # Express API endpoints for auth, donations, requests, etc.
│   └── types.ts                 # Full TypeScript interfaces for all database models
├── src/
│   ├── App.tsx                  # Main application with client router, role switcher & alerts
│   ├── components/
│   │   ├── Navbar.tsx           # Global header with logo, navigation links & notification bell
│   │   ├── Footer.tsx           # Social-impact footer with links & food safety note
│   │   ├── DonationCard.tsx     # Marketplace donation card with status badges & progress
│   │   ├── StatusBadge.tsx      # Color-coded badge component for all lifecycle states
│   │   ├── NotificationDrawer.tsx# Live notification center
│   │   └── TestRunnerModal.tsx  # In-app automated test suite runner
│   ├── views/
│   │   ├── HomeView.tsx         # Public landing page with hero, live impact & how it works
│   │   ├── MarketplaceView.tsx  # Available food marketplace with search, category & filters
│   │   ├── DonationDetailView.tsx # Single donation view & NGO portion request modal
│   │   ├── CreateDonationView.tsx # Food listing submission form with safety pledge
│   │   ├── ProviderDashboard.tsx# Provider portal (listings table, request review)
│   │   ├── NgoDashboard.tsx     # NGO portal (active requests, delivery confirmation)
│   │   ├── VolunteerDashboard.tsx# Volunteer missions board & delivery status tracker
│   │   ├── AdminDashboard.tsx   # Admin center (users, NGO verification, audit logs)
│   │   ├── ImpactView.tsx       # Detailed social impact metrics & charts
│   │   ├── FoodSafetyView.tsx   # Food safety & handling manual
│   │   └── AuthViews.tsx        # Login, registration, role selection & password reset
│   ├── types.ts                 # Shared UI types & interfaces
│   └── index.css                # Tailwind CSS v4 theme variables
├── flask_backend/               # Python Flask codebase for local VS Code execution
│   ├── app/
│   │   ├── __init__.py          # Flask application factory
│   │   ├── extensions.py        # SQLAlchemy & Migrate instances
│   │   ├── models/              # User, Donation, FoodRequest, VolunteerAssignment, etc.
│   │   ├── auth/routes.py       # Authentication endpoints
│   │   ├── donations/routes.py  # Donation marketplace routes
│   │   ├── requests/routes.py   # Request management & allocation routes
│   │   ├── volunteers/routes.py # Volunteer assignment routes
│   │   └── admin/routes.py      # Admin management & verification routes
│   ├── tests/
│   │   └── test_food_share.py   # Automated pytest unit and integration tests
│   ├── config.py                # Environment and database configuration
│   ├── requirements.txt         # Python package dependencies
│   ├── run.py                   # Flask server entry point & DB seed CLI
│   └── pytest.ini               # Pytest configuration
├── data/
│   └── foodshare.db.json        # Persistent JSON/SQLite file store
├── metadata.json
├── package.json
└── README.md
```

---

## 🚀 How to Run the Project in VS Code

### Option A: Running the Full-Stack Web Application (Recommended for Demo)

The web application runs on port 3000 with Express API + React frontend:

1. **Open the project in VS Code**:
   ```bash
   cd food-share
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`.

---

### Option B: Running the Python Flask Backend in VS Code

For your Python/Flask college project submission:

1. **Open a terminal in VS Code** and navigate to `flask_backend`:
   ```bash
   cd flask_backend
   ```

2. **Create and activate a Python virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install the Python requirements**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize and seed the SQLite database**:
   ```bash
   flask --app run.py init-db
   ```

5. **Start the Flask development server**:
   ```bash
   python run.py
   ```
   The Flask API will run at `http://127.0.0.1:5000`.

6. **Run automated Python tests**:
   ```bash
   pytest
   ```

---

## 🔑 Default Demonstration Accounts

You can test any role immediately using the built-in **Quick Demo Role Switcher** in the top navigation bar, or log in with these credentials:

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@foodshare.org` | `password123` | Full admin privileges, NGO verification, audit logs |
| **Food Provider** | `provider@foodshare.org` | `password123` | Green Garden Bistro & Catering (active listings) |
| **NGO Organization** | `ngo@foodshare.org` | `password123` | Hope & Care Food Bank (verified status) |
| **Community Volunteer** | `volunteer@foodshare.org` | `password123` | Alex Rivera (pickup & delivery missions) |

---

## 🧪 Testing the Complete End-to-End Workflow

Follow this 5-minute scenario to demonstrate the full application lifecycle:

1. **Create a Listing**:
   - Switch to or log in as **Food Provider** (`provider@foodshare.org`).
   - Click **"Donate Food"** (`/donations/new`).
   - Fill in food details (e.g., 30 portions of freshly cooked pasta, deadline 6 hours ahead). Submit the donation.
2. **Find & Request Surplus**:
   - Switch to **NGO** (`ngo@foodshare.org`).
   - Navigate to **"Available Food"** (`/donations`).
   - Click on the new listing, review allergen and storage notes, and request 20 portions with a distribution note.
3. **Accept Request & Allocate Portions**:
   - Switch back to **Food Provider** (`/dashboard/provider`).
   - Under **"Incoming Requests"**, click **"Accept Request"**. Notice that the remaining quantity updates automatically from 30 to 10 portions (`Partially Reserved`).
4. **Volunteer Pickup & Delivery**:
   - Switch to **Volunteer** (`volunteer@foodshare.org` / `/dashboard/volunteer`).
   - Look under **"Open Pickup Opportunities"** and click **"Claim Mission"**.
   - Click **"Mark as Picked Up"** when collected, then **"Mark as Delivered"** when arrived.
5. **Confirm Receipt & Complete**:
   - Switch to **NGO** (`/dashboard/ngo`).
   - Click **"Confirm Food Received"**. The donation status becomes `Completed`, the audit log records the timestamp, and impact metrics increase!
6. **Admin Verification & Audit**:
   - Switch to **Admin** (`admin@foodshare.org` / `/dashboard/admin`).
   - View the updated impact metrics, verify pending NGOs, and inspect the immutable audit log trail.
7. **Run Automated Test Suite**:
   - Click **"Run Automated Tests"** in the top bar or footer to execute the automated test cases live!

---

## 🛡️ Security & Integrity Design

- **Password Hashing**: Passwords are securely hashed with SHA-256 and salted. Plaintext passwords are never stored.
- **Server-Side Authorization**: Every protected API route enforces role-based checks on the server.
- **Atomic Operations**: Quantity allocation checks remaining food before committing changes.
- **Audit Logging**: Sensitive operations (user creation, status changes, verification, reports) are recorded in an audit trail.

---

## 🎓 Academic Presentation Tips

When presenting this project for your B.Tech CSE evaluation:
- Highlight the **social impact** (UN Sustainable Development Goal 12: Responsible Consumption and Production & Goal 2: Zero Hunger).
- Explain the **database schema normalization** and how foreign keys ensure relational integrity.
- Demonstrate the **state machine** (how status transitions prevent invalid actions like requesting expired food or claiming already assigned missions).
- Showcase the **real database-backed impact analytics** rather than static numbers.
