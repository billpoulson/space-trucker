import { LoadingState } from '@space-truckers/common'
import { Observable } from 'rxjs'

export interface IPortableDatabinding<TData> {
  update: (
    createPatch: (data: TData | LoadingState) => Observable<any>,
    pushUpdate?: boolean
  ) => Observable<TData>
  fetch: () => void
  data$: Observable<TData | LoadingState>
}
