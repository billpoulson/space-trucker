import { config as configDotenv } from 'dotenv'
import 'reflect-metadata'

import path from 'path'
import { container } from 'tsyringe'
import { AppDbConfig } from './db/jsondb/core/config'
import { SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$ } from './ioc/injection-tokens'
import { registerOauth2Module } from './ioc/modules/create-auth-module'
import { registerMongoDb } from './ioc/modules/register-mongo-db'
import { registerOllamaBackendForRoot } from './ioc/modules/register-ollama-backend'
import { registerApplicationRBACContainer } from './ioc/modules/register-rbac-container'
import { RootEntryPoint } from './root.entry-point'
configDotenv()

registerOauth2Module(container)
registerOllamaBackendForRoot(container)
registerMongoDb(container)
registerApplicationRBACContainer(container)

container
  .register(SCOPED_CONTAINER$$, { useValue: container })
  .register(STATIC_CONTENT_PATH$$, { useFactory: () => path.join(__dirname, 'public') })
  .register(AppDbConfig, { useValue: { path: 'db.json' } })// jsondb config
  .resolve(RootEntryPoint)
  .bootstrap()
