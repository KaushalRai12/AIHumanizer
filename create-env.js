const fs = require('fs');
const path = require('path');

// Database configuration
const dbName = 'ai_humanizer';
const username = 'postgres';
const password = 'Testers';

// Create .env file
const envPath = path.join(__dirname, '.env');
const envContent = `
# Server Configuration
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${dbName}
DB_USER=${username}
DB_PASSWORD=${password}

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

# API Keys (replace with actual values when available)
# OPENAI_API_KEY=your_openai_api_key
`.trim();

try {
  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully at:', envPath);
  console.log('Content:');
  console.log(envContent);
} catch (error) {
  console.error('Error creating .env file:', error.message);
} 