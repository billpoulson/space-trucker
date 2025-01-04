import cors from 'cors'
import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import { Server } from 'http'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import { ApplicationData } from '../db/application-data'
import { ControllerInitializer } from '../http/controller.registry'
import { corsWhitelist } from '../http/cors-whitelist'
import {
  AUTH_AUDIENCE$$,
  AUTH_ISSUER_DOMAIN$$,
  EXPRESS_SERVER$$, SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$
} from '../ioc/injection-tokens'
import { WebSocketServer } from '../socket$/websocket.server'
import { AppConfig } from './app-config'

@singleton()
export class ExpressServerContainer {
  public app = express()
  public db = {} as any
  public server!: Server
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private appConfig: AppConfig,
    public appDb: ApplicationData.AppDbContext,
    @inject(AUTH_AUDIENCE$$) audience: string,
    @inject(AUTH_ISSUER_DOMAIN$$) issuerDomain: string,
    @inject(STATIC_CONTENT_PATH$$) staticContentPath: string,
  ) {

    const oauth2Middleware = auth({
      audience,
      issuerBaseURL: `https://${issuerDomain}/`,
      tokenSigningAlg: 'RS256',
    })

    const corsMiddleware = cors({
      origin: function (origin, callback) {
        if (!origin || corsWhitelist.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
    this.app = express()
      .use(express.static(staticContentPath))
      .use(oauth2Middleware)
      .use(corsMiddleware)
      .options('*', corsMiddleware)
      .use((req: any, res, next) => {
        debugger
        req.customData = {
          message: 'Hello from middleware',
          timestamp: new Date(),
        }
        next() // Pass control to the next middleware/handler
      })

    scope
      .register(EXPRESS_SERVER$$, {
        useFactory: () => this.app.listen(this.appConfig.port, () => {
          console.log('Running on port ', this.appConfig.port)
        })
      })

      scope.resolve(WebSocketServer)
      this.scope.resolve(ControllerInitializer)

  }

  public async init() {
    await this.appDb.init()
    this.db = this.appDb.loginsDB
  }
}
