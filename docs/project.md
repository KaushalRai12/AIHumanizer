# AI Text Humanizer Website

## Overview
This project is an AI-powered text humanizer website that helps users rewrite and humanize AI-generated content to make it appear more human-like. The platform offers various subscription tiers with different features and credit limits. The project is implemented as a full-stack web application with a React frontend, Express backend, and PostgreSQL database.

## Project Structure
```mermaid
graph TD
    A[Project Root] --> B[Frontend]
    A --> C[Backend]
    A --> D[Documentation]
    B --> E[Pages]
    B --> F[Components]
    B --> G[Context]
    C --> H[Routes]
    C --> I[Models]
    C --> J[Config]
    C --> K[Middleware]
    E --> L[Public Pages]
    E --> M[Auth Pages]
    E --> N[Dashboard]
    E --> O[Admin Pages]
    H --> P[Auth Routes]
    H --> Q[Text Analysis]
    H --> R[Admin Routes]
    I --> S[User Model]
    I --> T[TextAnalysis Model]
    I --> U[Subscription Model]
    K --> V[Auth Middleware]
    K --> W[Admin Middleware]
```

## Core Features
See [features.md](./features.md) for a detailed list of project features.

## Architecture
The project follows a modern web application architecture with clear separation of concerns.

### Frontend Architecture
```mermaid
graph TD
    A[Frontend] --> B[Public Pages]
    A --> C[Auth Pages]
    A --> D[Dashboard]
    A --> E[Context]
    A --> F[Admin Pages]
    B --> G[Home/Humanizer]
    B --> H[Pricing]
    B --> I[Contact]
    C --> J[Login]
    C --> K[Signup]
    D --> L[User Dashboard]
    D --> M[Text History]
    D --> N[Credits]
    D --> O[Payment]
    E --> P[AuthContext]
    E --> Q[HumanizerContext]
    F --> R[Admin Dashboard]
    F --> S[User Management]
    F --> T[Statistics]
```

### Backend Architecture
```mermaid
graph TD
    A[Backend] --> B[API Routes]
    A --> C[Models]
    A --> D[Services]
    A --> E[Middleware]
    B --> F[Auth Routes]
    B --> G[Text Analysis Routes]
    B --> H[User Routes]
    B --> I[Payment Routes]
    B --> J[Admin Routes]
    C --> K[User Model]
    C --> L[TextAnalysis Model]
    C --> M[Subscription Model]
    D --> N[Auth Service]
    D --> O[Humanizer Service]
    D --> P[Payment Service]
    E --> Q[Authentication]
    E --> R[Admin Authorization]
```

### Database Schema
```mermaid
erDiagram
    USERS ||--o{ TEXT_ANALYSES : creates
    USERS ||--o{ SUBSCRIPTIONS : has
    USERS {
        int id PK
        string name
        string email
        string password
        boolean isAdmin
        datetime created_at
        datetime updated_at
    }
    TEXT_ANALYSES {
        int id PK
        int user_id FK
        text original_text
        text humanized_text
        int character_count
        datetime created_at
        datetime updated_at
    }
    SUBSCRIPTIONS {
        int id PK
        int user_id FK
        string plan_type
        int credits_total
        int credits_used
        datetime start_date
        datetime end_date
        boolean active
    }
    TEXT_STATISTICS {
        int id PK
        int user_id FK
        int texts_processed
        int characters_processed
        datetime last_processed
    }
```

### Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    U->>F: Enter credentials
    F->>B: POST /api/auth/login
    B->>DB: Check credentials
    DB->>B: Credentials valid/invalid
    B->>B: Check user role
    B->>F: Return JWT token with user data
    F->>F: Store token and user data in localStorage
    F->>U: Redirect to Dashboard or Admin dashboard
```

### Role-Based Access Control
```mermaid
graph TD
    A[Request] --> B{Is Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D{Is Admin Route?}
    D -->|No| E[Access Regular Route]
    D -->|Yes| F{Is Admin User?}
    F -->|No| G[Return 403 Forbidden]
    F -->|Yes| H[Access Admin Route]
```

### Text Humanization Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI Service
    participant DB as Database
    
    U->>F: Enter text to humanize
    F->>B: POST /api/text/humanize
    B->>B: Verify JWT token
    B->>B: Check user credits
    B->>AI: Request text humanization
    AI->>B: Return humanized text
    B->>DB: Save original and humanized text
    B->>DB: Update user credits
    B->>F: Return humanized text
    F->>U: Display humanized text
```

## Development Guidelines
1. Follow React best practices for frontend development
2. Implement secure authentication with JWT
3. Ensure responsive design for all pages
4. Maintain comprehensive documentation
5. Write unit tests for critical functionality
6. Use TypeScript for type safety
7. Follow RESTful API design principles
8. Use environment variables for configuration
9. Use PostgreSQL for persistent data storage

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT, Context API (frontend)
- **Payment**: Stripe (planned)
- **AI Processing**: Undetectable AI API
- **Deployment**: Netlify (frontend), Heroku (backend)
- **API Documentation**: Swagger UI, JSDoc

## Getting Started
1. Clone the repository
2. Install dependencies (frontend and backend)
3. Set up environment variables in a `.env` file (see example below)
4. Create the PostgreSQL database using `database.sql`
5. Start the backend server: `npm run server` (or `npx ts-node src/server/index.ts`)
6. Start the frontend: `npm start`
7. Access the application at `localhost:3000` (frontend) and `localhost:3001` (backend API)

### Example .env file
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_humanizer
DB_USER=postgres
DB_PASSWORD=Testers
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
UNDETECTABLE_API_KEY=your-undetectable-ai-api-key
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Log in a user

### Text Analysis
- `POST /api/text/humanize` - Humanize text and save to history
- `GET /api/text/history` - Get user's text history
- `GET /api/text/:id` - Get specific text analysis

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/credits` - Get user credit information

### Subscription Management
- `GET /api/subscriptions` - Get available subscription plans
- `POST /api/subscriptions` - Create a new subscription
- `PUT /api/subscriptions/:id` - Update subscription

### Admin Management
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/user/:id` - Get specific user details (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)
- `POST /api/admin/make-admin/:id` - Grant admin privileges to user (admin only)

## API Documentation
API documentation is available via Swagger UI at `http://localhost:3001/api-docs`

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
MIT License - See LICENSE file for details 