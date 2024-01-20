import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || "default_database_name",
    process.env.DB_USER || 'default_user',
    process.env.DB_PASSWORD || 'default_password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

async function databaseConnection(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log("Connection to Mysql Database Successfully.")
    } catch (error) {
        console.log("databaseConnection", error)
    }
}

export {
    sequelize,
    databaseConnection
}