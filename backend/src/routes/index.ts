import { Application } from "express";

function appRoutes(app: Application): void {
    app.use('', () => {
        console.log("App routes")
    });
}

export {
    appRoutes
}