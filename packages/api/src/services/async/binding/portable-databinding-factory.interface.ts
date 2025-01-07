import { IPortableDatabinding } from './portable-databinding.interface'

export interface PortableDatabindingFactory<TData> {
  getPortable: () => IPortableDatabinding<TData>
}
