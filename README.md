# AI Humanizer - Make AI-Generated Text Sound Human

AI Humanizer is a web application that helps users transform AI-generated content into natural, human-like text. It's built with React, Express, and PostgreSQL, providing a seamless experience for content creators, students, and professionals who want to ensure their AI-generated content doesn't get flagged as machine-written.

![AI Humanizer Screenshot](docs/screenshot.png)

## Features

- **Advanced Text Humanization**: Convert AI-generated text to human-like writing using the Undetectable AI API
- **User Authentication**: Secure login and registration with JWT
- **Subscription Tiers**: Multiple pricing plans with different feature sets
- **Credit System**: Track and manage usage with a credit-based system
- **Dashboard**: Monitor usage, view history, and manage account settings
- **Text History**: Save and retrieve previous humanization requests
- **Responsive Design**: Fully functional on desktop and mobile devices
- **Admin Dashboard**: Platform management with user statistics and controls
- **Payment Processing**: Support for credit card and PayPal payments
- **API Documentation**: Interactive Swagger UI for API exploration

## Documentation

- [Project Overview](docs/project.md)
- [Feature List](docs/features.md)
- [System Architecture](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Changelog](docs/changelog.md)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT, Context API (frontend)
- **Documentation**: Swagger UI, JSDoc
- **Payment**: Stripe (planned)
- **AI Processing**: Undetectable AI API
- **Deployment**: Netlify (frontend), Heroku (backend)

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL (v12+ recommended)
- NPM or Yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-humanizer.git
   cd ai-humanizer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_humanizer
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3001
   JWT_SECRET=your_jwt_secret
   UNDETECTABLE_API_KEY=your_api_key
   ```

4. Set up the database:
   ```
   psql -U postgres -f database.sql
   ```

5. Start the backend development server:
   ```
   npm run server
   ```

6. In a new terminal, start the frontend development server:
   ```
   npm start
   ```

7. Visit `http://localhost:3000` in your browser
8. Access the API documentation at `http://localhost:3001/api-docs`

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/          # Page components
  │   ├── Home.tsx    # Home page with text humanizer
  │   ├── Pricing.tsx # Subscription plans
  │   ├── Login.tsx   # User authentication
  │   ├── Admin.tsx   # Admin dashboard
  │   └── ...         # Other pages
  ├── context/        # React contexts for state management
  ├── server/         # Backend server code
  │   ├── routes/     # API routes
  │   ├── models/     # Database models
  │   ├── middleware/ # Express middleware
  │   └── config/     # Server configuration
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions
  ├── App.tsx         # Main application component
  └── index.tsx       # Application entry point
```

## Available Scripts

- `npm start`: Runs the frontend in development mode
- `npm run server`: Runs the backend server
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [aihumanizer.com](https://aihumanizer.com)
- Email: support@aihumanizer.com
- Twitter: [@aihumanizer](https://twitter.com/aihumanizer) 