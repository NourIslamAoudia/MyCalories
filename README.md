# NutriTrack API 🍎

> **Complete nutritional tracking and calorie management API**

A modern RESTful API allowing users to track their food intake, calculate caloric needs, and manage their nutritional goals.

![API Status](https://img.shields.io/badge/status-online-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

**🌐 Base URL:** `https://my-calories-two.vercel.app/`

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Demonstrations](#-demonstrations)
- [Data Models](#-data-models)
- [Authentication](#-authentication)
- [Security](#-security)
- [Deployment](#-deployment)

## ✨ Features

### 🔐 User Management
- ✅ Secure registration and login
- ✅ Google OAuth authentication
- ✅ Complete user profile management
- ✅ JWT tokens with automatic expiration

### 🥗 Food Management
- ✅ Complete food database
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Intelligent search by name
- ✅ Detailed nutritional information

### 🍽️ Meal Tracking
- ✅ Daily meal creation and management
- ✅ Add/remove foods with quantities
- ✅ Automatic calorie and macronutrient calculation
- ✅ Meal history by date

### 📊 Nutritional Analysis
- ✅ BMR (Basal Metabolic Rate) calculation
- ✅ Daily caloric needs estimation
- ✅ Personalized calorie goals
- ✅ Detailed nutritional statistics

## 🏗️ Architecture

```
NutriTrack API/
├── 🔌 Controllers/
│   ├── authController.js       # Authentication & Security
│   ├── foodController.js       # Food CRUD Management
│   ├── mealController.js       # Meal Logic
│   └── profilController.js     # Profile & BMR Calculations
├── 🛠️ Lib/
│   ├── db.js                   # MongoDB Connection
│   ├── passport.js             # OAuth Configuration
│   └── utils.js                # JWT Utilities
├── 🛡️ Middleware/
│   └── auth-middleware.js      # Route Protection
├── 📦 Models/
│   ├── FoodModel.js           # Mongoose Food Schema
│   ├── MealModel.js           # Mongoose Meal Schema
│   └── UserModel.js           # Mongoose User Schema
├── 🛣️ Routers/
│   ├── auth.js                # Authentication Routes
│   ├── foods.js               # Food Routes
│   ├── meals.js               # Meal Routes
│   └── profil.js              # Profile Routes
├── ⚙️ Config/
│   ├── .env                   # Environment Variables
│   └── .gitignore            # Git Ignored Files
└── 📄 Files/
    ├── index.js              # Server Entry Point
    └── package.json          # NPM Dependencies
```

### 🔄 Data Flow

```mermaid
graph TD
    A[Client App] -->|HTTP Request| B[Express Router]
    B --> C{Auth Required?}
    C -->|Yes| D[Auth Middleware]
    C -->|No| E[Controller]
    D --> F{Valid Token?}
    F -->|Yes| E
    F -->|No| G[401 Unauthorized]
    E --> H[MongoDB Query]
    H --> I[Data Processing]
    I --> J[JSON Response]
    J --> A
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v14.0.0+)
- **MongoDB** (v4.0.0+)
- **npm** or **yarn**

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/mycalories-api.git
cd mycalories-api
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit the .env file with your configurations
```

4. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file at the project root:

```env
# 🗄️ Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mycalories

# 🔐 JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# 🌐 Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://my-calories-two.vercel.app/auth/google/callback

# 🚀 Server Configuration
PORT=3000
NODE_ENV=production
```

### 🔧 Technologies Used

| Technology | Version | Usage |
|------------|---------|-------|
| **Node.js** | 18+ | JavaScript Runtime |
| **Express.js** | 4.18+ | Web Framework |
| **MongoDB** | 5.0+ | Database |
| **Mongoose** | 7.0+ | MongoDB ODM |
| **JWT** | 9.0+ | Authentication |
| **Passport.js** | 0.6+ | OAuth Strategy |
| **bcryptjs** | 2.4+ | Password Hashing |

## 📡 API Documentation

### Base URL
```
https://my-calories-two.vercel.app/
```

### 🔐 Authentication

#### Registration
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201)**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
GET /auth/google
# Automatic redirection to Google
```

### 🥗 Food Management

#### Search Foods
```http
GET /foods?search=apple&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Red Apple",
      "caloriesPer100g": 52,
      "proteinPer100g": 0.3,
      "carbsPer100g": 14,
      "fatPer100g": 0.2,
      "category": "Fruits",
      "photoUrl": "https://example.com/apple.jpg"
    }
  ],
  "count": 1
}
```

#### Create Food
```http
POST /foods
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Organic Avocado",
  "caloriesPer100g": 160,
  "proteinPer100g": 2,
  "carbsPer100g": 9,
  "fatPer100g": 15,
  "category": "Fruits",
  "photoUrl": "https://example.com/avocado.jpg"
}
```

### 🍽️ Meal Management

#### Create Meal
```http
POST /meals
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Breakfast",
  "date": "2024-01-15"
}
```

#### Add Food to Meal
```http
POST /meals/64f1a2b3c4d5e6f7g8h9i0j1/items
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "foodId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "amount": 150
}
```

#### Meals by Day
```http
GET /meals/per-day?date=2024-01-15
Authorization: Bearer YOUR_JWT_TOKEN
```

### 👤 Profile Management

#### Get Profile
```http
GET /profil
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Profile
```http
PUT /profil
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "age": 28,
  "height": 175,
  "weight": 70,
  "sex": "M"
}
```

#### Calculate BMR
```http
GET /profil/bmr
Authorization: Bearer YOUR_JWT_TOKEN
```

**BMR Response (200)**
```json
{
  "success": true,
  "data": {
    "bmr": 1687,
    "dailyCalorieNeeds": {
      "sedentary": 2024,
      "lightlyActive": 2320,
      "moderatelyActive": 2616,
      "veryActive": 2912,
      "extraActive": 3208
    }
  }
}
```
## 📸 Demonstrations

### 1. Authentication Interface
![Demo Auth](./screenshots/login.png)
*Registration and login process with real-time validation*

### 2. Food Search and Management
![Demo Foods](./screenshots/food.png)
*Advanced search interface with filters and nutritional information*

### 3. Meal Creation and Tracking
![Demo Meals](./screenshots/meals.png)
*Adding foods to meals with automatic calorie calculation*

### 4. Nutritional Dashboard
![Demo Dashboard](./screenshots/traker.png)
*Daily statistics visualization and calorie goals*

### 5. Profile and BMR Calculations
![Demo Profile](./screenshots/profile.png)
*User profile management and personalized metabolic calculations*

## 📊 Data Models

### 👤 User
```javascript
{
  _id: ObjectId,
  username: String,           // Unique username
  email: String,             // Unique email
  password: String,          // Hashed password (bcrypt)
  googleId: String,          // Google OAuth ID (optional)
  age: Number,               // Age in years
  height: Number,            // Height in cm
  weight: Number,            // Weight in kg
  sex: String,               // 'M' or 'F'
  caloriesGoal: Number,      // Daily calorie goal
  createdAt: Date,           // Creation date
  updatedAt: Date            // Last update
}
```

### 🥗 Food
```javascript
{
  _id: ObjectId,
  name: String,              // Food name
  caloriesPer100g: Number,   // Calories per 100g
  proteinPer100g: Number,    // Protein per 100g
  carbsPer100g: Number,      // Carbohydrates per 100g
  fatPer100g: Number,        // Fat per 100g
  category: String,          // Category (Fruits, Vegetables, etc.)
  photoUrl: String,          // Image URL
  createdAt: Date,
  updatedAt: Date
}
```

### 🍽️ Meal
```javascript
{
  _id: ObjectId,
  name: String,              // Meal name
  user: ObjectId,            // User reference
  items: [{
    food: ObjectId,          // Food reference
    amount: Number           // Amount in grams
  }],
  calories: Number,          // Total calculated calories
  proteinCalories: Number,   // Protein calories
  carbCalories: Number,      // Carbohydrate calories
  fatCalories: Number,       // Fat calories
  date: Date,                // Meal date
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Authentication

### JWT (JSON Web Tokens)
- **Lifetime:** 24 hours by default
- **Algorithm:** HS256
- **Required header:** `Authorization: Bearer <token>`

### OAuth 2.0 Google
- **Scopes:** `profile`, `email`
- **Callback URL:** `/auth/google/callback`

### Route Protection
All API routes (except authentication) require a valid JWT token.

```javascript
// Example authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## 🛡️ Security

### Implemented Measures

- ✅ **bcrypt hashing** for passwords (salt rounds: 12)
- ✅ **JWT with automatic expiration**
- ✅ **Server-side input validation**
- ✅ **CORS protection** configured
- ✅ **Security headers** with Helmet.js
- ✅ **Rate limiting** to prevent spam
- ✅ **MongoDB injection protection**

### Best Practices
```javascript
// Example data validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: [8, 'Minimum 8 characters']
  }
});
```

## 🚀 Deployment

### Vercel Deployment

1. **Vercel Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

2. **Vercel Environment Variables**
```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

3. **Deployment Commands**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Performance and Optimizations

- **GZIP compression** enabled
- **Cache headers** configured
- **MongoDB connection** with connection pooling
- **Pagination** for large collections
- **Optimized MongoDB indexes**

### Monitoring

```javascript
// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 📞 Support and Contact

- **API Status:** [https://my-calories-two.vercel.app/health](https://my-calories-two.vercel.app/health)
- **Documentation:** This README
- **Issues:** GitHub Issues

---

**Developed with ❤️ by the NutriTrack team**

> 🚀 **Live API:** [https://my-calories-two.vercel.app/](https://my-calories-two.vercel.app/)