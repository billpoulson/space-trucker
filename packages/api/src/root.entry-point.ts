import { DependencyContainer, inject, singleton } from 'tsyringe'
import { SCOPED_CONTAINER$$ } from './ioc/injection-tokens'
import { ExpressServerContainer } from './server/http/express-server-container'
import { LoadsModule } from './services/sp/loads/loads.module'
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
  }
  
  public async bootstrap() {
    await this.expressServer.init()// setup http and websocket server
    const j = await createShip(this.scope)// create a test ship
    const j2 = new stationMgr(this.scope)// create a test station
    this.loadServer.clockController.toggleClock()// start the load server
  }
}
