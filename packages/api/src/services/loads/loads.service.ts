import { calculatePercent, toKeysAndData } from '@space-truckers/common'
import { BehaviorSubject, concatMap, firstValueFrom, from, map, share } from 'rxjs'

import { LoadDefinitionData } from '@space-truckers/types'
import { singleton } from 'tsyringe'
import { EntropyService } from '../gamify/entropy.service'
import { ClockSignal } from './clock-signal'
export type LoadDB = { [key: string]: LoadDefinitionData }

@singleton()
export class LoadsService {
  private nextId = 0;
  private _availableLoads$ = new BehaviorSubject<LoadDB>({})
  public availableLoads$ = this._availableLoads$.asObservable()
  public loadsInProgress$ = this._availableLoads$.asObservable()
    .pipe(
      map(toKeysAndData),
      map(({ keys, data }) =>
        keys.filter(key => data[key].inProgress && !data[key].pirated)
          .reduce((accum, key) => ({
            ...accum,
            [key]: data[key]
          }), {} as LoadDB)),
      share()
    )



  constructor(
    private clock: ClockSignal,
    private rng: EntropyService
  ) {
    // this._availableLoads$.subscribe(console.log)
    this.updateLoadProgressOnTick()
  }

  updateLoadProgressOnTick() {
    this.clock.pipe(
      concatMap(() => firstValueFrom(this.loadsInProgress$)),
      map(toKeysAndData),
      concatMap(({ keys }) =>
        from(keys)
          .pipe(
            map(k => this.getLoadByKey(k)),
            map(load => this.uploadLoadProgress(load))
          ))
    ).subscribe()
  }
  private uploadLoadProgress(load: LoadDefinitionData) {
    const progress = load.progress + (load.mass / 10000)
    const isCompleted = progress >= load.distance
    const percentageCompleted = calculatePercent(progress, load.distance)
    const inProgress = !isCompleted

    const updatedLoad = this.updateLoad(load.key, {
      progress,
      isCompleted,
      inProgress,
      percentageCompleted
    })

    if (isCompleted) {
      // console.log('Load Delivered Successfully', updatedLoad)
    }

    return updatedLoad
  }

  getEnumerableDB() {
    return toKeysAndData(this._availableLoads$.value)
  }

  addLoad(load: LoadDefinitionData) {

    load.key = `${this.nextId++}`
    load.cargoValue = this.rng.generateRandomNumber(1000, 10000000)
    load.distance = this.rng.generateRandomNumber(100, 100000000000)
    load.mass = this.rng.generateRandomNumber(100, 100000000000)
    load.payout = this.rng.generateRandomNumber(100, 100000000000)

    return this.updateLoad(load.key, load)

  }

  deleteKey(key: string) {
    let data = { ...this._availableLoads$.value }
    delete data[key]
    this._availableLoads$.next(data)
  }

  takeLoad(key: string) {
    return this.updateLoad(key, {
      inProgress: true,
      progress: 0,
    })
  }

  getLoadValue(key: string) {
    return this.getLoadByKey(key).cargoValue
  }

  pirateLoad(key: string) {
    return this.updateLoad(key, {
      inProgress: false,
      percentageCompleted: 0,
      pirated: true
    })
  }

  getLoadByKey(key: string) {
    return this._availableLoads$.value?.[key]
  }

  private updateLoad(
    key: string,
    data: Partial<LoadDefinitionData>
  ): LoadDefinitionData {
    const patch = { ...data }
    delete patch.key

    if ([null, undefined].includes(key as any)) {
      throw 'no key was defined'
    }

    let datasource = this._availableLoads$.value
    this._availableLoads$.next({
      ...datasource,
      [key]: {
        ...datasource?.[key],
        ...patch,
        ...{ key },
      }
    })

    return this.getLoadByKey(key)
  }
}
