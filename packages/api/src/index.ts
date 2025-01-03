import { config } from 'dotenv'
import 'reflect-metadata'
import { ExpressServer } from './http/express-server'
import { getService } from './server/container.config'
config();
  (async () => getService<ExpressServer>(ExpressServer).bootstrap())()
