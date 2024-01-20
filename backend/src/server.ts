import { Application, NextFunction, Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { verify } from 'jsonwebtoken';
import { config } from './configs';
import { IAuthPayload } from './types/auth.interface';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from './Utils/error-handler';
import { appRoutes } from './routes';

const SERVER_PORT = process.env.SERVER_PORT || 5000;

function start(app: Application): void {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    authErrorHanlder(app);
    startServer(app);
}

function securityMiddleware(app: Application): void {
    app.use(hpp());
    app.use(helmet());
    app.use(
        cors({
            origin: process.env.FRONT_END,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATH', 'DELETE', 'OPTIONS']
        })
    );
    // 'Bearer xxxxx'
    app.use((req: Request, _res: Response, next: NextFunction) => {
        if (req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
            const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
            req.currentUser = payload;
        };
        next();
    })
}

function standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' })); // form submissions handler
}

function routesMiddleware(app: Application): void {
    console.log(app);
    appRoutes(app);
}

function authErrorHanlder(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        console.log('error', `${fullUrl} endpoint does not exist.`, '');
        res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.'});
        next();
    });
  
    app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
        if (error instanceof CustomError) {
            console.log('error authErrorHanlder Error:', error);
            res.status(error.statusCode).json(error.serializeErrors());
        } else {
            // Generic error handling
            console.log('error', 'Unexpected Error:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred.' });
        }

        next();
    });
}

function startServer(app: Application): void {
    try {
        const httpServer: http.Server = new http.Server(app);
        console.log(`Start Server Successfully with process id ${process.pid}`);
        httpServer.listen(SERVER_PORT, () => {
            console.log(`Server is successfully running at PORT ${SERVER_PORT}`);
        })
    } catch (error) {
        console.log(`Error when starting Server: ${error}`)
    }
}

export default start;