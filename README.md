<div align="center">

# 🌍 AllAboutTravel ✈️

<img src="https://via.placeholder.com/800x300/1e293b/ffffff?text=AllAboutTravel+%E2%80%94+Your+Smart+Travel+Companion" alt="AllAboutTravel Banner" width="100%" />

<br />

**A comprehensive, AI-powered travel recommendation and booking platform** that eliminates the hassle of juggling multiple travel services. Built for modern travelers who want personalized itineraries, smart cross-service recommendations, and an intelligent AI travel assistant — all within a single, elegant interface. Powered by **React 19**, **Node.js/Express**, **MongoDB**, and **Google Gemini AI**.

<br />

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## 🔗 Live Demo

> 🚀 **[View Live Demo →](#)** *(deployment link coming soon)*

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 🧠 | **Smart Cross-Service Recommendations** | Post-booking engine that automatically suggests relevant car rentals, tour guides, local products, and hostels based on your destination city — ranked by rating, price, popularity, and recency. |
| 🤖 | **AI-Powered Travel Assistant** | Real-time conversational travel advisor powered by **Google Gemini AI** with full city context awareness, chat history persistence, and retry-safe API handling. |
| 🗓️ | **Intelligent Itinerary Generator** | Auto-generated multi-day travel plans with time allocations, budget estimates, activity difficulty levels, and tourist attraction integrations. |
| 🏨 | **Hostel Booking System** | Browse, filter, and book hostels with detailed facility info, image galleries, pricing, and reviews. |
| 🚗 | **Car Rental Marketplace** | Discover and rent vehicles with filters for fuel type, vehicle type, availability, and pricing. |
| 🧑‍🏫 | **Tour Guide Hiring** | Find verified, experienced tour guides with language filters, specialization tags, and per-day pricing. |
| 🛍️ | **Local Products Store** | Browse and purchase authentic regional products with stock tracking, category filters, and integrated checkout. |
| 🏛️ | **Tourist Attractions Explorer** | Beautiful grid layouts with Wikipedia-enriched descriptions, distance calculations, entry fees, opening hours, and interactive maps. |
| 🌦️ | **Live Weather Integration** | Real-time weather data for any destination city via OpenWeather API. |
| 🗺️ | **Interactive Maps & Directions** | Leaflet-powered maps with Geoapify/OpenRouteService for routing, POI discovery, and distance calculations. |
| 💳 | **Razorpay Payment Gateway** | Secure payment processing with order creation, verification, and payment status tracking. |
| 📊 | **Provider Dashboard** | Full-featured dashboard for service providers to manage listings, track bookings, view analytics, and add new services. |
| 🎯 | **Trip Hub Dashboard** | Centralized post-booking dashboard with city overview, weather forecasts, AI assistant, tourist attractions, itinerary, and cross-selling recommendations. |
| 🔐 | **Role-Based Access Control** | Three-tier access system (Customer, Provider, Admin) with protected routes and middleware-level authorization. |
| 🎨 | **Premium UI/UX** | Responsive, animated interface with parallax hero, scroll-reveal animations, glassmorphism, custom cursor, page transitions, and a cinematic loading screen. |

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **React Router DOM 7** | Client-side routing & navigation |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Vite 7** | Build tool & dev server |
| **Axios** | HTTP client for API communication |
| **Leaflet + React-Leaflet** | Interactive maps |
| **Lucide React** | Icon library |
| **QRCode.react** | QR code generation for bookings |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **Mongoose 9** | MongoDB ODM |
| **JSON Web Tokens (JWT)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Nodemon** | Development hot-reloading |
| **dotenv** | Environment variable management |

### Database
| Technology | Purpose |
|------------|---------|
| **MongoDB** | Primary NoSQL database |
| **Mongoose** | Schema-based data modeling |

### Authentication
| Technology | Purpose |
|------------|---------|
| **JWT** | Stateless authentication |
| **bcryptjs** | Secure password hashing |
| **Role-based middleware** | CUSTOMER / PROVIDER / ADMIN authorization |

### APIs & Services
| Service | Purpose |
|---------|---------|
| **Google Gemini AI** | AI travel assistant & conversational agent |
| **Razorpay** | Payment gateway integration |
| **Geoapify** | Geocoding & place search |
| **OpenRouteService** | Route directions & navigation |
| **OpenWeather API** | Real-time weather data |
| **Wikipedia REST API** | Tourist attraction enrichment |
| **Unsplash** | High-quality imagery |

### Deployment
| Tool | Purpose |
|------|---------|
| **Vite** | Frontend build |
| **Node.js** | Backend runtime |
| **MongoDB Atlas** | Cloud database *(optional)* |

---

## 🛠 Installation & Setup

### Prerequisites

- **Node.js** v16.x or higher
- **npm** or **yarn**
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- API Keys: Google Gemini, OpenWeather, Geoapify, Razorpay, Cloudinary *(optional)*

### 1. Clone Repository

```bash
git clone https://github.com/DanishSharma0/AllAboutTravel.git
cd AllAboutTravel
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# ── Server ──────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── MongoDB ─────────────────────────────────────
MONGODB_URI=mongodb://127.0.0.1:27017/all_about_india

# ── JWT ─────────────────────────────────────────
JWT_SECRET=your_jwt_secret_key_here

# ── Frontend URL ────────────────────────────────
FRONTEND_URL=http://localhost:5173

# ── Razorpay ────────────────────────────────────
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ── Google Gemini AI ────────────────────────────
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash
AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.7

# ── Cloudinary ──────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ── OpenWeather ─────────────────────────────────
OPENWEATHER_API_KEY=your_openweather_api_key

# ── Geoapify & Maps ────────────────────────────
GEOAPIFY_API_KEY=your_geoapify_api_key
OPENROUTE_API_KEY=your_openroute_api_key

# ── Email (Nodemailer) ─────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the backend:

```bash
npm run dev
# ✅ Server running on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
# ✅ App running on http://localhost:5173
```

### 4. Seed Database *(Optional but Recommended)*

```bash
cd backend
node scripts/seedItineraries.js
```

---

## 📂 Project Structure

```
AllAboutTravel/
├── backend/                          # Express.js API Server
│   ├── scripts/
│   │   └── seedItineraries.js        # Database seeder for itineraries
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection config
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Profile
│   │   │   ├── bookingController.js  # Booking CRUD operations
│   │   │   ├── cityController.js     # City data endpoints
│   │   │   ├── directionsController.js
│   │   │   ├── geminiService.js      # Google Gemini AI integration
│   │   │   ├── geoapifyController.js # Geoapify geocoding
│   │   │   ├── hostelController.js   # Hostel CRUD
│   │   │   ├── paymentController.js  # Razorpay payment processing
│   │   │   ├── placeController.js    # Tourist places
│   │   │   ├── productController.js  # Local products
│   │   │   ├── providerController.js # Provider dashboard logic
│   │   │   ├── recommendationController.js  # Smart recommendations engine
│   │   │   ├── rentalController.js   # Car rental CRUD
│   │   │   ├── reviewController.js   # User reviews
│   │   │   └── tourGuideController.js
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT auth + role-based guards
│   │   ├── models/                   # 18 Mongoose schemas
│   │   │   ├── City.js
│   │   │   ├── Hostel.js
│   │   │   ├── HostelBooking.js
│   │   │   ├── Itinerary.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Product.js
│   │   │   ├── Recommendation.js
│   │   │   ├── Rental.js
│   │   │   ├── RentalBooking.js
│   │   │   ├── Review.js
│   │   │   ├── TourGuide.js
│   │   │   ├── TouristPlace.js
│   │   │   ├── TravelChat.js
│   │   │   ├── User.js
│   │   │   └── ...
│   │   ├── routes/                   # 13 route modules
│   │   ├── services/
│   │   │   └── geoapifyService.js    # External API service layer
│   │   ├── utils/
│   │   │   ├── cache.js              # In-memory caching
│   │   │   ├── passwordUtils.js      # Hashing helpers
│   │   │   └── tokenUtils.js         # JWT generation
│   │   └── server.js                 # Express app entry point
│   ├── .env                          # Environment variables
│   └── package.json
│
├── frontend/                         # React 19 + Vite Application
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── assets/                   # Images & icons
│   │   ├── components/               # 25 reusable components
│   │   │   ├── AIChatBot.jsx
│   │   │   ├── AITravelAssistant.jsx
│   │   │   ├── CityOverviewCard.jsx
│   │   │   ├── CustomCursor.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── InitialLoader.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   ├── RecommendationCarousel.jsx
│   │   │   ├── SuggestedItinerarySection.jsx
│   │   │   ├── TouristAttractionsSection.jsx
│   │   │   ├── TripHubDashboard.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state management
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── pages/                    # 22 page components
│   │   │   ├── Home.jsx
│   │   │   ├── Hostels.jsx
│   │   │   ├── Rentals.jsx
│   │   │   ├── TourGuides.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ContinueExploring.jsx # Post-booking Trip Hub
│   │   │   ├── ProviderDashboard.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance & interceptors
│   │   │   └── index.js              # Service barrel exports
│   │   ├── utils/
│   │   │   └── bookingFlow.js        # Booking state management
│   │   ├── App.jsx                   # Root component with routing
│   │   └── main.jsx                  # Vite entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (React 19)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Pages   │  │Components│  │ Context  │  │  Services  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       └──────────────┴────────────┴───────────────┘         │
│                         Axios HTTP                          │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
┌────────────────────────────┴────────────────────────────────┐
│                    SERVER (Express 5)                        │
│  ┌────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Routes │→ │ Middleware │→ │Controllers│→ │  Services  │  │
│  └────────┘  └────────────┘  └─────┬─────┘  └─────┬──────┘  │
│                                    │               │         │
│                              ┌─────┴─────┐   ┌────┴────┐   │
│                              │  Models   │   │External │   │
│                              │(Mongoose) │   │  APIs   │   │
│                              └─────┬─────┘   └─────────┘   │
└────────────────────────────────────┬────────────────────────┘
                                     │
                              ┌──────┴──────┐
                              │   MongoDB   │
                              └─────────────┘
```

- **Frontend Flow:** React pages → Component rendering → Context for auth state → Axios service layer → REST API calls
- **Backend Flow:** Express routes → Auth/Role middleware → Controllers (business logic) → Mongoose models → MongoDB
- **Database:** MongoDB with 18 collections — Users, Cities, Hostels, Rentals, TourGuides, Products, Bookings, Payments, Itineraries, TravelChats, Reviews, and more
- **Authentication:** JWT-based stateless auth with `bcryptjs` password hashing; tokens stored in `localStorage` and sent via `Authorization` header
- **API Communication:** RESTful architecture with Axios interceptors for automatic token attachment and error handling
- **External Services:** Google Gemini AI (chat), Razorpay (payments), OpenWeather (weather), Geoapify (maps), Wikipedia (attraction enrichment)

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| 🔑 **JWT Authentication** | Stateless token-based auth with expiration |
| 🔐 **Password Hashing** | `bcryptjs` with salt rounds for secure storage |
| ✅ **Input Validation** | Server-side validation on all endpoints |
| 🛡️ **Role-Based Authorization** | Three-tier access: Customer, Provider, Admin with middleware guards |
| 🔒 **Secure Environment Variables** | All secrets stored in `.env`, excluded from version control |
| 🌐 **CORS Configuration** | Configurable allowed origins for cross-origin requests |
| 🚫 **Protected Routes** | Frontend `ProtectedRoute` component + backend `authMiddleware` |
| 🔄 **API Retry Logic** | Exponential backoff retry for external API calls |
| 📝 **Error Sanitization** | User-friendly error messages; stack traces hidden in production |

---

## 📸 Screenshots

<div align="center">

| Home Page | Hostel Listings |
|:---------:|:---------------:|
| <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Home+Page" alt="Home Page" width="100%"> | <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Hostel+Listings" alt="Hostel Listings" width="100%"> |

| AI Travel Assistant | Trip Hub Dashboard |
|:-------------------:|:------------------:|
| <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=AI+Travel+Assistant" alt="AI Travel Assistant" width="100%"> | <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Trip+Hub+Dashboard" alt="Trip Hub Dashboard" width="100%"> |

| Smart Recommendations | Payment Checkout |
|:---------------------:|:----------------:|
| <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Smart+Recommendations" alt="Smart Recommendations" width="100%"> | <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Payment+Checkout" alt="Payment Checkout" width="100%"> |

| Provider Dashboard | Tourist Attractions |
|:------------------:|:-------------------:|
| <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Provider+Dashboard" alt="Provider Dashboard" width="100%"> | <img src="https://via.placeholder.com/400x250/1e293b/ffffff?text=Tourist+Attractions" alt="Tourist Attractions" width="100%"> |

</div>

---

## 🌟 Future Improvements

- 🤖 **ML-Powered Recommendations** — Collaborative filtering based on user behavior and booking patterns
- 👥 **Group Trip Planning** — Real-time collaborative itinerary building for multiple travelers
- 📱 **Mobile App** — React Native companion app for on-the-go travel management
- 🌐 **Multi-Language Support** — i18n localization for international travelers
- 📄 **PDF Export** — Download itineraries and booking confirmations as formatted PDFs
- 💬 **Social Features** — Community feed for sharing trips, reviews, and travel photos
- 🔔 **Push Notifications** — Real-time booking updates and travel alerts
- 📊 **Advanced Analytics** — Provider-side insights with revenue charts and occupancy tracking
- 🏷️ **Dynamic Pricing** — Seasonal and demand-based pricing algorithms

---

## ⚠ Disclaimer

This project is built for **educational and portfolio demonstration purposes**. The payment integration uses Razorpay test mode. No real financial transactions are processed. All travel data, including hostels, tour guides, and rental listings, is seeded demo data and does not represent real businesses. API keys shown in documentation are placeholders — never commit real credentials to version control.

---

## 👨‍💻 Author

<div align="center">

| | |
|---|---|
| **Name** | Danish Sharma |
| **GitHub** | [@DanishSharma0](https://github.com/DanishSharma0) |
| **LinkedIn** | [Connect on LinkedIn](#) |

</div>

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ If you found this project useful, please consider giving it a star! ⭐**

<br />

Made with ❤️ by [Danish Sharma](https://github.com/DanishSharma0)

</div>
