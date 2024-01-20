import express, {Express} from 'express';
import start from './server';
import { databaseConnection } from './configs';

const initialize = async (): Promise<void> => {
    const app: Express = express();

    try {
        await databaseConnection();
        start(app);
    } catch (error) {
        console.error('Failed to initialize the application:', error);
        process.exit(1);
    }
};

initialize();