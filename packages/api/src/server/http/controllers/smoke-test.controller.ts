import { UserInfoObject } from '@space-truckers/types'
import express from 'express'
import { DependencyContainer } from 'tsyringe'
import { LoginsRepo } from '../../../db/login.repo'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'

type PingRequest = { s: string }

export default (
  scope: DependencyContainer
) => {
  const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => scope)

  const router = express.Router()

  router.get('/ping/:response', requestScopedAction<PingRequest>(
    (scope, req, res, params, body) => {
      const [repo, userInfo] = [
        scope.resolve(LoginsRepo),
        scope.resolve(UserInfoObject),
      ]
      repo.incrementLoginCount(`${+new Date}`)
      res.send(params.get('response'))
    }))

  return router
}
