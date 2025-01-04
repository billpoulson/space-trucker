import { config as configDotenv } from 'dotenv'
import 'reflect-metadata'

import path from 'path'
import { container } from 'tsyringe'
import { ApplicationData } from './db/application-data'
import { registerOauth2Module } from './http/oauth/create-auth-module'
import { SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$ } from './ioc/injection-tokens'
import { RootEntryPoint } from './root.entry-point'
const { AppDbConfig } = ApplicationData
configDotenv()

registerOauth2Module(container)
container
  .register(SCOPED_CONTAINER$$, { useValue: container })
  .register(STATIC_CONTENT_PATH$$, { useFactory: () => path.join(__dirname, 'public') })
  .register(AppDbConfig, { useValue: { path: 'db.json' } })
  .resolve(RootEntryPoint)
  .bootstrap()
