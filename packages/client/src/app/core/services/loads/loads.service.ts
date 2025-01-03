import { Injectable } from '@angular/core'
import { toKeysAndData } from '@space-truckers/common'
import { BehaviorSubject, concatMap, firstValueFrom, from, map, share } from 'rxjs'
import { ClockSignal } from '../../subjects/clock-signal'
import { LoadDefinitionData } from '../../system/data/load'
import { calculatePercent } from '../../util/math.extensions'
import { EntropyService } from '../_/entropy.service'
export type LoadDB = { [key: string]: LoadDefinitionData }
@Injectable({
  providedIn: 'root',
})
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
    this._availableLoads$.subscribe(console.log)
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
      console.log('Load Delivered Successfully', updatedLoad)
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

    this.updateLoad(load.key, load)

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
