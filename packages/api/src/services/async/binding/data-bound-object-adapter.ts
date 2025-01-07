import { DataBoundObject } from './data-bound-object'
import { PortableDatabinding } from './portable-databinding'

export abstract class DataBoundObjectAdapter<
  TData,
  TBoundObject extends DataBoundObject<TData>
>
  extends PortableDatabinding<TData, TBoundObject> {
  constructor(boundSource: TBoundObject) {
    super(boundSource)
    return this.getPortable() as any
  }
}
