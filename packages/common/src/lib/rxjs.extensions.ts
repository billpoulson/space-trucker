import { Observable, OperatorFunction, pipe, Subject } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'

export const toKeysAndData = <TData>(data: { [key: string]: TData }): { keys: string[]; data: { [key: string]: TData } } => ({
  keys: Object.keys(data),
  data
})



// Custom operator function
export function forwardTo<T>(subject: Subject<T>) {
  return function (source: Observable<T>): Observable<T> {
    return source.pipe(
      tap(value => subject.next(value))
    )
  }
}

/**
 * Custom operator that applies the given operator based on a feature flag.
 * @param featureFlag A boolean indicating whether the feature is enabled.
 * @param innerOperator The operator to apply if the feature is enabled.
 */
function withFeatureFlag<T, R = T>(
  featureFlag: boolean,
  innerOperator: OperatorFunction<T, R> = map((value) => value as unknown as R)
): OperatorFunction<T, T | R> {
  return function (source) {
    return featureFlag ? source.pipe(innerOperator) : source
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