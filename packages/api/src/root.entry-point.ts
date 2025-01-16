import { OllamaServiceSettings } from '@space-truckers/common'
import { Ollama } from 'ollama'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import { SCOPED_CONTAINER$$ } from './ioc/injection-tokens'
import { ExpressServerContainer } from './server/http/express-server-container'
import { LoadsModule } from './services/sp/loads/loads.module'

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
    console.log(`bootstrap application`)
    console.log(`checking for required models`)

    const ollama = this.scope.resolve(Ollama)
    const settings = this.scope.resolve(OllamaServiceSettings)
    
    await ollama.pull({
      model: settings.completionModel
    }).then(progress => {
      console.log(`finished pulling ${settings.completionModel}`)
      console.log(progress)
    })
    await ollama.pull({
      model: settings.embeddingModel
    }).then(progress => {
      console.log(`finished pulling ${settings.embeddingModel}`)
      console.log(progress)
    })
    console.log(`models ready`)

    await this.expressServer.init()// setup http and websocket server
    this.loadServer.clockController.toggleClock()// start the load server
  }
}
