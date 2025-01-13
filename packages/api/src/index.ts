import { config as configDotenv } from 'dotenv'
import 'reflect-metadata'

import path from 'path'
import { container } from 'tsyringe'
import { AppDbConfig } from './db/core/config'
import { SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$ } from './ioc/injection-tokens'
import { registerOauth2Module } from './ioc/modules/create-auth-module'
import { registerOllamaBackend } from './ioc/modules/register-ollama-backend'
import { RootEntryPoint } from './root.entry-point'
configDotenv()

registerOauth2Module(container)
registerOllamaBackend(container)

container
  .register(SCOPED_CONTAINER$$, { useValue: container })
  .register(STATIC_CONTENT_PATH$$, { useFactory: () => path.join(__dirname, 'public') })
  .register(AppDbConfig, { useValue: { path: 'db.json' } })
  .resolve(RootEntryPoint)
  .bootstrap()
