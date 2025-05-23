const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbName = 'ai_humanizer';
const username = 'postgres';
const password = 'Testers';

console.log('Setting up the database...');

// Create a temporary SQL file with postgres credentials
const tempSqlFile = path.join(__dirname, 'temp_setup.sql');
fs.writeFileSync(tempSqlFile, `
-- Drop database if exists (comment this out if you don't want to risk data loss)
DROP DATABASE IF EXISTS ${dbName};

-- Create the database
CREATE DATABASE ${dbName};
`);

// Set PGPASSWORD environment variable for passwordless authentication
const env = Object.assign({}, process.env, { PGPASSWORD: password });

// Execute the SQL file using psql
const psqlCommand = `psql -U ${username} -h localhost -f "${tempSqlFile}"`;

exec(psqlCommand, { env }, (error, stdout, stderr) => {
  console.log(stdout);
  if (stderr) console.error(stderr);
  
  if (error) {
    console.error(`Error creating database: ${error.message}`);
    console.error('Make sure PostgreSQL is running and credentials are correct');
    cleanup();
    return;
  }
  
  console.log('Database created successfully');
  
  // Execute the main database.sql file to create tables
  const mainSqlFile = path.join(__dirname, 'database.sql');
  
  exec(`psql -U ${username} -h localhost -d ${dbName} -f "${mainSqlFile}"`, { env }, (err, stdout, stderr) => {
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    if (err) {
      console.error(`Error setting up tables: ${err.message}`);
      cleanup();
      return;
    }
    
    console.log('Database tables created successfully');
    cleanup();
    
    // Create .env file if it doesn't exist
    createEnvFile();
  });
});

function cleanup() {
  // Remove temporary SQL file
  if (fs.existsSync(tempSqlFile)) {
    fs.unlinkSync(tempSqlFile);
    console.log('Temporary files cleaned up');
  }
}

function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  // Only create if it doesn't exist
  if (!fs.existsSync(envPath)) {
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

    fs.writeFileSync(envPath, envContent);
    console.log('.env file created successfully at:', envPath);
  } else {
    console.log('.env file already exists, skipping creation');
  }
} 