export class Database {
    connect() {
        console.log('Database connected with environment: ', {
            DB_HOST: process.env.DB_HOST,
            DB_PORT: process.env.DB_PORT,
            DB_NAME: process.env.DB_NAME,
        });
    }
}