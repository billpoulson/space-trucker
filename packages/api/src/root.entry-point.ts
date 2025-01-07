import { DependencyContainer, inject, singleton } from 'tsyringe'
import { ExpressServerContainer } from './http/express-server-container'
import { SCOPED_CONTAINER$$ } from './ioc/injection-tokens'
import { LoadsModule } from './services/loads/loads.module'
import { createShip } from './services/sp/ship/ship.module'
import { stationMgr } from './services/sp/station/station.module'

@singleton()
export class RootEntryPoint {
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private expressServer: ExpressServerContainer,
    private loadServer: LoadsModule
  ) {
    console.info(this.constructor.name)
    loadServer.clockController.toggleClock()
  }
  
  public async bootstrap() {
    await this.expressServer.init()
    const j = await createShip(this.scope)
    const j2 = new stationMgr(this.scope)
  }
}
