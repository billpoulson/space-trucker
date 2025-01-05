import { DependencyContainer, inject, singleton } from 'tsyringe'
import { ExpressServerContainer } from './http/express-server-container'
import { SCOPED_CONTAINER$$ } from './ioc/injection-tokens'

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
