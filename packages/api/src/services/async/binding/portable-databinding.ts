import { LoadingState } from '@space-truckers/common'
import { Observable } from 'rxjs'
import { IPortableDatabinding } from './portable-databinding.interface'

export abstract class PortableDatabinding<
  TData,
  TBoundObject extends IPortableDatabinding<TData>
>
  implements IPortableDatabinding<TData> {
  constructor(
    private boundObject: TBoundObject
  ) {
  }
  public getPortable(): IPortableDatabinding<TData> {
    return {
      update: this.boundObject.update.bind(this.boundObject),
      fetch: this.boundObject.fetch.bind(this.boundObject),
      data$: this.boundObject.data$,
    }
  }
  update!: (
    createPatch: (data: LoadingState | TData) => Observable<any>,
    pushUpdate?: boolean
  ) => Observable<TData>

  fetch!: () => void
  data$!: Observable<LoadingState | TData>
}
