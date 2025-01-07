import { Observable, pipe, Subject } from 'rxjs'
import { filter, tap } from 'rxjs/operators'

export const toKeysAndData = <TData>(data: { [key: string]: TData }): { keys: string[]; data: { [key: string]: TData } } => ({
  keys: Object.keys(data),
  data
})

export function forwardTo<T>(subject: Subject<T>) {
  return function (source: Observable<T>): Observable<T> {
    return source.pipe(
      tap(value => subject.next(value))
    )
  }
}

export function isTruthy<T>(selector?: (data: T) => any) {
  if (typeof selector !== 'function') {
    return pipe(
      filter<T>((value) => Boolean(value))
    )
  }
  return pipe(
    filter<T>((value) => !!selector!(value))
  )
}