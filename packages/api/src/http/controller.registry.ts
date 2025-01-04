import { DependencyContainer, inject, singleton } from 'tsyringe'
import { SCOPED_CONTAINER$$ } from '../ioc/injection-tokens'

const controllers = []

@singleton()
export class ControllerInitializer extends Array<any> {
  constructor(@inject(SCOPED_CONTAINER$$) public scope: DependencyContainer) {
    super(controllers.map(t => scope.resolve(t)))
  }
}
