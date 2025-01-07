import cors from 'cors'
import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import { Server } from 'http'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import { AppDbContext } from '../../db/core/context'
import {
  EXPRESS_APP$$,
  EXPRESS_SERVER$$, SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$
} from '../../ioc/injection-tokens'
import { AUTH_AUDIENCE$$, AUTH_ISSUER_DOMAIN$$ } from '../../ioc/security/injection-tokens'
import { AppConfig } from '../../server/app-config'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'
import { WebSocketServer } from '../socket$/websocket.server'
import { ControllerInitializer } from './controller.registry'
import routdd from './controllers/balance.controller'
import pingRouteModule from './controllers/smoke-test.controller'
import { corsWhitelist } from './cors-whitelist'

@singleton()
export class ExpressServerContainer {
  public app = express()
  public db = {} as any
  public server!: Server
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    public appDb: AppDbContext,
    private appConfig: AppConfig,
    tokenAuthService: JWTTokenAuthenticationService,
    @inject(AUTH_AUDIENCE$$) audience: string,
    @inject(AUTH_ISSUER_DOMAIN$$) issuerDomain: string,
    @inject(STATIC_CONTENT_PATH$$) staticContentPath: string,
  ) {
    console.info(this.constructor.name)
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
      .use(express.json())
      .options('*', corsMiddleware)
      .use(async (req: any, res, next) => {
        const userProfile = await tokenAuthService.getUserInfo(req.auth.token)
        req.userProfile = userProfile
        next()
      })
      .use('/test', routdd(scope))
      .use('/_', pingRouteModule(scope))

    scope
      .register(EXPRESS_SERVER$$, {
        useFactory: () => this.app.listen(this.appConfig.port, () => {
          console.log('Running on port ', this.appConfig.port)
        })
      })
      .register(EXPRESS_APP$$, {
        useFactory: () => this.app 
      })

    scope.resolve(WebSocketServer)
    this.scope.resolve(ControllerInitializer)

  }

  public async init() {
    await this.appDb.init()
    this.db = this.appDb.loginsDB
  }
}
