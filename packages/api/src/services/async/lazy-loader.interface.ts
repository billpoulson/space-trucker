import { LoadingState } from '@space-truckers/common'
import { BehaviorSubject } from 'rxjs'

export interface ILazyLoader<TData> {
  data: BehaviorSubject<LoadingState | TData>
  load(): Promise<TData>
}
