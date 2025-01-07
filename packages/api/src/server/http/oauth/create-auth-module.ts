import jwksClient, { JwksClient } from 'jwks-rsa'
import { DependencyContainer } from 'tsyringe'
import { AUTH_AUDIENCE$$, AUTH_ISSUER_DOMAIN$$ } from '../../../ioc/security/injection-tokens'
import { JWTVerifyOptions } from './jwt-verify-options'

export function registerOauth2Module(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .register(AUTH_AUDIENCE$$, { useFactory: () => process.env['AUTH_AUDIENCE'] })
        .register(AUTH_ISSUER_DOMAIN$$, { useFactory: () => process.env['AUTH_ISSUER'] })
        .register(AUTH_AUDIENCE$$, { useFactory: () => process.env['AUTH_AUDIENCE'] })
        .register(JwksClient, {
            useFactory: (deps: DependencyContainer) => {
                const issuer = deps.resolve(AUTH_ISSUER_DOMAIN$$)
                return jwksClient({ jwksUri: `https://${issuer}/.well-known/jwks.json` })
            }
        })
        .register(JWTVerifyOptions, {
            useFactory: (deps: DependencyContainer) => {
                const issuer = deps.resolve(AUTH_ISSUER_DOMAIN$$)
                const audience = deps.resolve(AUTH_AUDIENCE$$)
                return ({
                    audience,
                    issuer: `https://${issuer}/`,
                    algorithms: ['RS256']
                })
            }
        })

}
