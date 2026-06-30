# Pantry Tracker — Backend

Express.js + MongoDB backend for the Pantry Tracker MERN project.

## Folder Structure

```
backend/
├── server.js               ← Entry point, cron jobs registered here
├── .env.example            ← Copy this to .env and fill in your keys
├── config/
│   └── db.js               ← MongoDB connection
├── models/
│   ├── User.js             ← User schema
│   ├── PantryItem.js       ← Pantry item schema
│   └── ShoppingItem.js     ← Shopping list schema
├── controllers/
│   ├── authController.js   ← Register, Login, Get Me
│   ├── pantryController.js ← CRUD for pantry items + summary
│   ├── shoppingController.js ← Shopping list CRUD + check off
│   ├── recipeController.js ← Calls Gemini API for recipe suggestions
│   ├── spendingController.js ← Monthly cost breakdown + CSV export
│   └── cronController.js   ← Midnight cron: expiry alerts + low stock
├── routes/
│   ├── authRoutes.js
│   ├── pantryRoutes.js
│   ├── shoppingRoutes.js
│   ├── recipeRoutes.js
│   └── spendingRoutes.js
└── middleware/
    └── authMiddleware.js   ← JWT protect middleware
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login and get token |
| GET | /api/auth/me | Get logged-in user (protected) |

### Pantry
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/pantry | Get all pantry items |
| GET | /api/pantry/summary | Dashboard counts |
| GET | /api/pantry/:id | Get one item |
| POST | /api/pantry | Add item |
| PUT | /api/pantry/:id | Update item |
| PATCH | /api/pantry/:id/quantity | Update quantity only |
| DELETE | /api/pantry/:id | Delete item |

### Shopping List
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/shopping | Get pending shopping items |
| POST | /api/shopping | Add item manually |
| PATCH | /api/shopping/:id | Check off (also updates pantry) |
| DELETE | /api/shopping/:id | Remove item |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | Get 3 AI recipe suggestions from Gemini |

### Spending
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/spending | Monthly cost per household member |
| GET | /api/spending/export | Download as CSV |
| POST | /api/spending/invite | Invite member by email |

## Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. `npm run dev`

Server runs on http://localhost:5000

## How JWT Auth Works

Every protected route needs this header:
```
Authorization: Bearer <your_token>
```
You get the token from `/api/auth/login` or `/api/auth/register`.
