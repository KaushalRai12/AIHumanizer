# AI Humanizer System Architecture

This document describes the detailed system architecture of the AI Humanizer application, including component interactions, data flow, and technical implementation details.

## System Overview

The AI Humanizer application is built as a modern web application with a clear separation between frontend and backend components. The application follows a RESTful architecture pattern with the frontend making API calls to the backend, which in turn interacts with the database and external services.

## High-Level Architecture

```mermaid
graph TD
    Client[Client Browser] <--> Frontend[React Frontend]
    Frontend <--> API[Express API Server]
    API <--> DB[(PostgreSQL Database)]
    API <--> Auth[Auth Service]
    API <--> AI[Undetectable AI Service]
    API <--> Payment[Payment Service]
    
    subgraph Frontend Components
        FC1[Public Pages]
        FC2[Auth Pages]
        FC3[Dashboard Pages]
        FC4[Context Providers]
        FC5[Admin Pages]
    end
    
    subgraph Backend Components
        BC1[API Routes]
        BC2[Sequelize Models]
        BC3[Middleware]
        BC4[Services]
        BC5[Swagger Documentation]
    end
```

## Component Architecture

### Frontend Architecture

The frontend is built using React with TypeScript. It uses the following key libraries and patterns:

- **React Router** for navigation and route management
- **Context API** for state management
- **Fetch API** for communication with the backend
- **Tailwind CSS** for styling
- **React Hooks** for component logic

```mermaid
graph TD
    App[App.tsx] --> Router[React Router]
    Router --> PublicRoute[Public Routes]
    Router --> ProtectedRoute[Protected Routes]
    Router --> AdminRoute[Admin Routes]
    
    PublicRoute --> Home[Home Page]
    PublicRoute --> Pricing[Pricing Page]
    PublicRoute --> Contact[Contact Page]
    PublicRoute --> Login[Login Page]
    PublicRoute --> Signup[Signup Page]
    
    ProtectedRoute --> Dashboard[Dashboard Page]
    ProtectedRoute --> TextHistory[Text History Page]
    ProtectedRoute --> Settings[Settings Page]
    ProtectedRoute --> Payment[Payment Page]
    
    AdminRoute --> AdminDashboard[Admin Dashboard]
    
    App --> AuthContext[Auth Context]
    App --> HumanizerContext[Humanizer Context]
```

### Context Architecture

The application uses React Context API for state management across components.

```mermaid
graph TD
    AuthContext[Auth Context] --> Login[Login Logic]
    AuthContext --> Register[Register Logic]
    AuthContext --> TokenStorage[Token Storage]
    AuthContext --> UserState[User State]
    AuthContext --> UserRole[User Role Management]
    
    HumanizerContext[Humanizer Context] --> TextInput[Text Input State]
    HumanizerContext --> HumanizationOptions[Humanization Options]
    HumanizerContext --> CreditsTracking[Credits Tracking]
    HumanizerContext --> HistoryState[History State]
```

### Backend Architecture

The backend is built using Express.js with TypeScript. It follows a modular architecture with clear separation of concerns.

```mermaid
graph TD
    API[Express App] --> Middleware[Middleware]
    API --> Routes[Routes]
    API --> Swagger[Swagger Documentation]
    
    Middleware --> CORS[CORS]
    Middleware --> Helmet[Helmet]
    Middleware --> BodyParser[Body Parser]
    Middleware --> AuthMiddleware[Auth Middleware]
    Middleware --> AdminMiddleware[Admin Middleware]
    
    Routes --> AuthRoutes[Auth Routes]
    Routes --> TextRoutes[Text Routes]
    Routes --> UserRoutes[User Routes]
    Routes --> SubscriptionRoutes[Subscription Routes]
    Routes --> AdminRoutes[Admin Routes]
    
    AuthRoutes --> Login[Login]
    AuthRoutes --> Register[Register]
    
    TextRoutes --> Humanize[Humanize]
    TextRoutes --> History[Get History]
    
    UserRoutes --> Profile[Get Profile]
    UserRoutes --> UpdateProfile[Update Profile]
    UserRoutes --> Credits[Get Credits]
    
    SubscriptionRoutes --> Plans[Get Plans]
    SubscriptionRoutes --> Subscribe[Subscribe]
    SubscriptionRoutes --> UpdatePlan[Update Plan]
    
    AdminRoutes --> GetUsers[Get All Users]
    AdminRoutes --> GetUser[Get User Details]
    AdminRoutes --> GetStats[Get Platform Stats]
    AdminRoutes --> MakeAdmin[Make User Admin]
```

### Database Architecture

The application uses PostgreSQL with Sequelize ORM for data storage and management.

```mermaid
erDiagram
    USERS ||--o{ TEXT_ANALYSES : creates
    USERS ||--o{ SUBSCRIPTIONS : has
    USERS ||--o{ TEXT_STATISTICS : tracks
    SUBSCRIPTIONS ||--o{ PAYMENTS : includes
    
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
    
    PAYMENTS {
        int id PK
        int subscription_id FK
        decimal amount
        string payment_method
        string status
        datetime payment_date
    }
    
    TEXT_STATISTICS {
        int id PK
        int user_id FK
        int texts_processed
        int characters_processed
        datetime last_processed
    }
```

## Authentication and Authorization Flow

The application uses JWT (JSON Web Tokens) for authentication and role-based access control for authorization.

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant API
    participant Database
    
    Client->>Frontend: Enter credentials
    Frontend->>API: POST /api/auth/login
    API->>Database: Check credentials
    Database-->>API: Valid credentials
    API->>API: Generate JWT token with user data (including isAdmin flag)
    API-->>Frontend: Return JWT token and user data
    Frontend->>Frontend: Store token and user data in localStorage
    Frontend-->>Client: Show Dashboard or Admin Dashboard
    
    Note over Client,Database: Subsequent Authenticated Requests
    
    Client->>Frontend: Access protected route
    Frontend->>Frontend: Check for token
    Frontend->>API: Request with Authorization header
    API->>API: Validate JWT token
    
    alt Access Admin Route
        API->>API: Check isAdmin flag
        API->>API: If not admin, return 403 Forbidden
    end
    
    API->>Database: Fetch requested data
    Database-->>API: Return data
    API-->>Frontend: Return requested data
    Frontend-->>Client: Display data
```

## API Documentation

The application includes comprehensive API documentation using Swagger UI.

```mermaid
graph TD
    A[Express App] --> B[Swagger Setup]
    B --> C[Swagger UI Express]
    B --> D[Swagger JSDoc]
    D --> E[Route Documentation]
    E --> F[Auth Routes JSDoc]
    E --> G[Text Routes JSDoc]
    E --> H[User Routes JSDoc]
    E --> I[Subscription Routes JSDoc]
    E --> J[Admin Routes JSDoc]
    C --> K[Swagger UI Endpoint: /api-docs]
```

## Text Humanization Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant UndetectableAI
    participant Database
    
    User->>Frontend: Enter text
    Frontend->>Frontend: Calculate credits needed
    User->>Frontend: Click "Humanize"
    Frontend->>API: POST /api/text/humanize
    API->>API: Verify JWT token
    API->>Database: Check user credits
    Database-->>API: Credits available
    API->>UndetectableAI: Send text for humanization
    UndetectableAI-->>API: Return humanized text
    API->>Database: Save text analysis
    API->>Database: Update user credits
    Database-->>API: Success
    API-->>Frontend: Return humanized text
    Frontend-->>User: Display humanized text
```

## Payment Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant StripeAPI
    participant Database
    
    User->>Frontend: Select subscription plan
    Frontend->>API: GET /api/subscription/plans
    API-->>Frontend: Return plans
    Frontend-->>User: Display plan options
    User->>Frontend: Select plan and payment method
    Frontend->>API: POST /api/subscription/create
    API->>StripeAPI: Create payment intent
    StripeAPI-->>API: Return client secret
    API-->>Frontend: Return client secret
    Frontend->>StripeAPI: Complete payment with client secret
    StripeAPI-->>Frontend: Payment success
    Frontend->>API: POST /api/subscription/confirm
    API->>Database: Create subscription
    API->>Database: Update user credits
    Database-->>API: Success
    API-->>Frontend: Return updated subscription
    Frontend-->>User: Display success message
```

## Error Handling Strategy

```mermaid
flowchart TD
    A[Error Occurs] --> B{Error Type?}
    B -->|Auth Error| C[Return 401/403]
    B -->|Validation Error| D[Return 400 with details]
    B -->|Resource Error| E[Return 404]
    B -->|Server Error| F[Return 500]
    
    C --> G[Log minimal info]
    D --> G
    E --> G
    F --> H[Log detailed error]
    
    G --> I[Return to Client]
    H --> I
    
    I --> J[Frontend Error Handler]
    J --> K{Error Type?}
    K -->|Auth Error| L[Redirect to login]
    K -->|Validation Error| M[Show field errors]
    K -->|Resource Error| N[Show not found message]
    K -->|Server Error| O[Show friendly error message]
```

## Deployment Architecture

```mermaid
graph TD
    Client[Client Browser] --> FE[Frontend - Netlify]
    FE --> BE[Backend - Heroku]
    BE --> DB[(PostgreSQL Database)]
    BE --> UAI[Undetectable AI API]
    BE --> Stripe[Stripe API]
    
    subgraph Frontend Deployment
        Netlify[Netlify] --> Build[Build Process]
        Build --> Deploy[Deploy]
        Deploy --> CDN[CDN Distribution]
    end
    
    subgraph Backend Deployment
        Heroku[Heroku] --> DockerContainer[Docker Container]
        DockerContainer --> ExpressApp[Express Application]
    end 
```

## Troubleshooting

### Common Issues

#### TypeScript Interface Conflicts

If you encounter TypeScript errors related to interface conflicts between middleware files, ensure each interface is declared only once. For example, the Express.Request interface should only be extended in one file, such as:

```typescript
// In auth.middleware.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
```

Other middleware files should then use this interface without redefining it.

#### Port Conflicts

The application uses the following ports by default:
- Frontend: 3000
- Backend: 3001

If you encounter port conflicts, you can change the port in:
- Frontend: Edit `package.json` and add `"PORT=3002"` to the start script
- Backend: Update the PORT variable in the .env file

#### Database Connection Issues

If the server fails to connect to the database, ensure:
1. PostgreSQL is running
2. The database credentials in .env are correct
3. The database exists (run `createdb ai_humanizer` if needed)
4. The database user has appropriate permissions
</rewritten_file>