import { Provider } from 'injection-js'
import jwksClient, { JwksClient } from 'jwks-rsa'
import { JWTTokenAuthenticationService } from '../http/controllers/ws.controller'
import { AUTH_AUDIENCE$$, AUTH_ISSUER$$ } from '../types/injection-tokens'
import { JWTVerifyOptions } from '../types/jwt-verify-options'

export function createAuthModule(): Provider[] {
    return [
        {
            provide: AUTH_AUDIENCE$$,
            useFactory: () => process.env['AUTH_AUDIENCE']
        },
        {
            provide: AUTH_ISSUER$$,
            useFactory: () => process.env['AUTH_ISSUER']
        },
        {
            provide: JwksClient,
            deps: [AUTH_ISSUER$$],
            useFactory: (issuer) => {
                return jwksClient({ jwksUri: `https://${issuer}/.well-known/jwks.json` })
            }
        },
        {
            provide: JWTVerifyOptions,
            deps: [AUTH_ISSUER$$, AUTH_AUDIENCE$$],
            useFactory: (
                issuer: string,
                audience: string
            ) => ({
                audience,
                issuer: `https://${issuer}/`,
                algorithms: ['RS256']
            })
        },
        JWTTokenAuthenticationService,
    ]
}
