import { Sequelize } from 'sequelize';

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // Heroku production config
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Heroku requires this
      },
    },
  });
} else {
  // Local development config
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ai_humanizer',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Testers',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });
}

export { sequelize }; 