import { UserInfoObject } from '@space-truckers/types'
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import fetch from 'node-fetch'
import { from } from 'rxjs'
import { inject, singleton } from 'tsyringe'
import { JWTVerifyOptions } from '../http/oauth/jwt-verify-options'
import { AUTH_ISSUER_DOMAIN$$ } from '../ioc/injection-tokens'


@singleton()
export class JWTTokenAuthenticationService {
  constructor(
    @inject(AUTH_ISSUER_DOMAIN$$) private issuerDomain: string,
    private client: JwksClient,
    private options: JWTVerifyOptions
  ) { }
  private getKey(header: any, callback: any) {
    this.client.getSigningKey(header.kid, (err, key: any) => {
      if (err) {
        callback(err, null)
        return
      }
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    })
  }

  private verifyToken(token: string): Promise<UserInfoObject> {
    const get = this.getKey.bind(this)
    return new Promise((resolve, reject) => {
      jwt.verify(token, get, this.options, async (err, decoded) => {
        if (err) {
          reject('Token verification failed')
        } else {
          await fetch(
            `https://${this.issuerDomain}/userinfo`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(response => response.json())
            .then(data => {
              resolve(data as any)
            })

        }
      })
    })
  }

  getUserInfo(token: string): Promise<UserInfoObject> {
    return fetch(
      `https://${this.issuerDomain}/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json() as any)

  }


  tryVerifyOauthToken(
    token: string
  ) {
    return from(
      new Promise<[boolean, UserInfoObject?]>(
        async (resolve) => {
          await this.verifyToken(token)
            .then((val) => {
              console.log(`Connection accepted.`)
              resolve([true, val])
            }).catch((reason) => {
              console.log(`Connection rejected. : ${reason}`)
              resolve([false, undefined])
            })
        })
    )
  }
}
