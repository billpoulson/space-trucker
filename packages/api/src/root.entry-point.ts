import { DependencyContainer, inject, singleton } from 'tsyringe'
import { SCOPED_CONTAINER$$ } from './ioc/injection-tokens'
import { ExpressServerContainer } from './server/express-server-container'

@singleton()
export class RootEntryPoint {
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private expressServer: ExpressServerContainer,
    
  ) {
  }

  public async bootstrap() {
    return this.expressServer.init()
  }
}
