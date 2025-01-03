import cors from 'cors'
import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import { Server } from 'http'
import { Injectable } from 'injection-js'
import { ApplicationData } from '../db/app-db'
import { corsWhitelist } from '../http/cors-whitelist'
import { AppConfig } from './app-config'

@Injectable()
export class AppContainer {
    jwtCheck = auth({
        audience: 'space-truckers-api-endpoint',
        issuerBaseURL: 'https://dev-3avwt6j38oy3nubm.us.auth0.com/',
        tokenSigningAlg: 'RS256'
    });

    public app = express();
    public db = {} as any;
    public server!: Server;
    constructor(
        private appConfig: AppConfig,
        public appDb: ApplicationData.AppDbContext
    ) { }

    config() {
        this.app.use(cors({
            origin: function (origin, callback) {
                if (!origin || corsWhitelist.includes(origin)) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            credentials: true
        }))
        this.app.options('*', cors({
            origin: function (origin, callback) {
                if (!origin || corsWhitelist.includes(origin)) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            credentials: true
        }))
        this.app.use(this.jwtCheck);
    }

    public async init() {
        this.config();
        await this.appDb.init()
        this.db = this.appDb.loginsDB;
        this.server = this.app.listen(
            this.appConfig.port,
            () => {
                console.log('Running on port ', this.appConfig.port);
            }
        );
    }

}