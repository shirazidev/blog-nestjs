namespace NodeJS {
    interface ProcessEnv {
        // Application
        PORT: number;

        // Database
        DBPORT: number;
        DBHOST: string;
        DBUSERNAME: string;
        DBPASSWORD: string;
        DB: string;
    }
}